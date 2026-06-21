// src/services/procurementService.js
// Automated replenishment and shortages recommendations service layer.
// Gracefully falls back to demoDb when the live backend is offline.

import procurementApi from '../api/procurementApi';
import productService from './productService';
import salesService from './salesService';
import purchaseService from './purchaseService';
import manufacturingService from './manufacturingService';
import { demoDb, DEMO_KEYS } from './demoDataService';

export const procurementService = {
  getRecommendations: async () => {
    try {
      const res = await procurementApi.getRecommendations();
      return res.data;
    } catch (e) {
      console.warn('[Procurement] Recommendations endpoint unavailable, calculating from fallbacks.', e.message);
      
      let products = [];
      let salesOrders = [];
      try {
        products = await productService.getProducts();
        salesOrders = await salesService.getSalesOrders();
      } catch (err) {
        console.warn('[Procurement] Live dependencies down.', err.message);
      }

      const boms = demoDb.getAll(DEMO_KEYS.BOMS);
      const vendors = demoDb.getAll(DEMO_KEYS.VENDORS);
      const mfgOrders = demoDb.getAll(DEMO_KEYS.MANUFACTURING);
      const purchaseOrders = demoDb.getAll(DEMO_KEYS.PURCHASES);
      
      const recommendations = [];

      // 1. MTS Logic: safety stock threshold checks
      (products || []).forEach(p => {
        const strategy = p.procurementStrategy || 'MTS';
        const freeToUse = p.freeToUseQty !== undefined ? p.freeToUseQty : p.stock;
        
        if (strategy === 'MTS' && freeToUse < p.minStock) {
          const qtyToOrder = Math.max(p.minStock * 2 - freeToUse, 10);
          
          if (p.procurementType === 'MANUFACTURING') {
            const bom = boms.find(b => b.productId === p.id || b.id === p.bomId);
            recommendations.push({
              id: `rec-mts-${p.id}`,
              productId: p.id,
              productName: p.name,
              productCode: p.code,
              currentStock: p.stock,
              freeToUseQty: freeToUse,
              minStock: p.minStock,
              recommendedQty: qtyToOrder,
              uom: p.uom,
              procurementType: 'MANUFACTURING',
              bomId: bom?.id || 'bom-301',
              reason: `MTS: Available stock is below safety reorder point of ${p.minStock} ${p.uom}.`
            });
          } else {
            // PURCHASE
            let vendor = vendors.find(v => v.id === p.vendorId) || vendors[0];
            const estimatedCost = qtyToOrder * p.cost;

            recommendations.push({
              id: `rec-mts-${p.id}`,
              productId: p.id,
              productName: p.name,
              productCode: p.code,
              currentStock: p.stock,
              freeToUseQty: freeToUse,
              minStock: p.minStock,
              recommendedQty: qtyToOrder,
              uom: p.uom,
              procurementType: 'PURCHASE',
              suggestedVendorId: vendor?.id || 'v1',
              suggestedVendorName: vendor?.name || 'Apex Metal Corp',
              estimatedCost,
              reason: `MTS: Available stock is below safety reorder point of ${p.minStock} ${p.uom}.`
            });
          }
        }
      });

      // 2. MTO Logic: demand recommendations from Sales Orders
      const openSales = (salesOrders || []).filter(so => 
        so.status !== 'cancelled' && so.status !== 'fully_delivered'
      );

      openSales.forEach(order => {
        (order.items || []).forEach(item => {
          const prod = (products || []).find(p => p.id === item.productId);
          if (prod && prod.procurementStrategy === 'MTO') {
            const delivered = order.deliveredQty?.[prod.id] || 0;
            const remainingNeeded = Math.max(0, item.quantity - delivered);

            if (remainingNeeded > 0) {
              let alreadyScheduled = 0;

              if (prod.procurementType === 'MANUFACTURING') {
                const activeMOs = mfgOrders.filter(mo => 
                  mo.productId === prod.id && 
                  mo.sourceSalesOrder === order.orderNumber &&
                  mo.status !== 'CANCELLED' && mo.status !== 'cancelled'
                );
                alreadyScheduled = activeMOs.reduce((sum, mo) => sum + mo.quantity, 0);
              } else {
                // PURCHASE
                const activePOs = purchaseOrders.filter(po => 
                  po.sourceSalesOrder === order.orderNumber &&
                  po.status !== 'cancelled' &&
                  po.items.some(poi => poi.productId === prod.id)
                );
                activePOs.forEach(po => {
                  const poi = po.items.find(pi => pi.productId === prod.id);
                  if (poi) {
                    alreadyScheduled += poi.quantity;
                  }
                });
              }

              const shortage = remainingNeeded - alreadyScheduled;

              if (shortage > 0) {
                if (prod.procurementType === 'MANUFACTURING') {
                  const bom = boms.find(b => b.productId === prod.id || b.id === prod.bomId);
                  recommendations.push({
                    id: `rec-mto-${order.id}-${prod.id}`,
                    productId: prod.id,
                    productName: prod.name,
                    productCode: prod.code,
                    currentStock: prod.stock,
                    freeToUseQty: prod.freeToUseQty || 0,
                    minStock: prod.minStock || 0,
                    recommendedQty: shortage,
                    uom: prod.uom,
                    procurementType: 'MANUFACTURING',
                    bomId: bom?.id || 'bom-301',
                    reason: `MTO: Required to fulfill Sales Order ${order.orderNumber}.`,
                    refNumber: order.orderNumber
                  });
                } else {
                  // PURCHASE
                  let vendor = vendors.find(v => v.id === prod.vendorId) || vendors[0];
                  const estimatedCost = shortage * prod.cost;
                  recommendations.push({
                    id: `rec-mto-${order.id}-${prod.id}`,
                    productId: prod.id,
                    productName: prod.name,
                    productCode: prod.code,
                    currentStock: prod.stock,
                    freeToUseQty: prod.freeToUseQty || 0,
                    minStock: prod.minStock || 0,
                    recommendedQty: shortage,
                    uom: prod.uom,
                    procurementType: 'PURCHASE',
                    suggestedVendorId: vendor?.id || 'v1',
                    suggestedVendorName: vendor?.name || 'Apex Metal Corp',
                    estimatedCost,
                    reason: `MTO: Required to fulfill Sales Order ${order.orderNumber}.`,
                    refNumber: order.orderNumber
                  });
                }
              }
            }
          }
        });
      });

      // If no dynamic recommendations (e.g. all stocks ok), load static demo recommendations to keep screens rich
      if (recommendations.length === 0) {
        return demoDb.getAll(DEMO_KEYS.PROCUREMENT_RECS);
      }

      return recommendations;
    }
  },

  executeProcurement: async (recommendation) => {
    try {
      const res = await procurementApi.executeProcurement(recommendation);
      return res.data;
    } catch (e) {
      if (recommendation.procurementType === 'MANUFACTURING') {
        const moData = {
          bomId: recommendation.bomId,
          productId: recommendation.productId,
          quantity: recommendation.recommendedQty,
          status: 'PLANNED',
          sourceSalesOrder: recommendation.refNumber || '',
          plannedStartDate: new Date().toISOString().split('T')[0],
          assignee: 'manufacturing'
        };

        const mo = await manufacturingService.createManufacturingOrder(moData);
        
        demoDb.logAudit('Procurement Trigger', `Auto-generated planned Manufacturing Order ${mo.moNumber} for product ${recommendation.productName}.`, 'Procurement', mo.moNumber);

        return {
          success: true,
          manufacturingOrderId: mo.id,
          manufacturingOrderNumber: mo.moNumber,
          purchaseOrderId: mo.id,
          purchaseOrderNumber: mo.moNumber
        };
      } else {
        const poData = {
          vendorId: recommendation.suggestedVendorId,
          items: [
            {
              productId: recommendation.productId,
              quantity: recommendation.recommendedQty,
              unitCost: recommendation.estimatedCost ? round(recommendation.estimatedCost / recommendation.recommendedQty, 2) : 10.0
            }
          ],
          status: 'draft',
          sourceSalesOrder: recommendation.refNumber || ''
        };

        const po = await purchaseService.createPurchaseOrder(poData);

        demoDb.logAudit('Procurement Trigger', `Auto-generated draft Purchase Order ${po.orderNumber} for product ${recommendation.productName}.`, 'Procurement', po.orderNumber);

        return {
          success: true,
          purchaseOrderId: po.id,
          purchaseOrderNumber: po.orderNumber
        };
      }
    }
  }
};

// Simple helper
function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

export default procurementService;
