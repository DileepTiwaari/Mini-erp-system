// src/services/procurementService.js
// Automated replenishment and shortages recommendations service layer.

import procurementApi from '../api/procurementApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';
import purchaseService from './purchaseService';
import manufacturingService from './manufacturingService';

export const procurementService = {
  getRecommendations: async () => {
    try {
      const res = await procurementApi.getRecommendations();
      return res.data;
    } catch (e) {
      const products = mockDb.getAll(DB_KEYS.PRODUCTS);
      const boms = mockDb.getAll(DB_KEYS.BOMS);
      const vendors = mockDb.getAll(DB_KEYS.VENDORS);
      const salesOrders = mockDb.getAll(DB_KEYS.SALES);
      const mfgOrders = mockDb.getAll(DB_KEYS.MANUFACTURING);
      const purchaseOrders = mockDb.getAll(DB_KEYS.PURCHASES);
      
      const recommendations = [];

      // 1. MTS Logic: replenishment recommendations based on safety stock threshold check (freeToUseQty < minStock)
      products.forEach(p => {
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
            if (!vendor) {
              if (p.code.startsWith('RM-COP') || p.categoryId === 'cat2') {
                vendor = vendors.find(v => v.id === 'v2') || vendors[0];
              } else if (p.code.startsWith('RM-BLT')) {
                vendor = vendors.find(v => v.id === 'v3') || vendors[0];
              }
            }
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

      // 2. MTO Logic: demand recommendations triggered by confirmed/draft Sales Orders
      const openSales = salesOrders.filter(so => 
        so.status !== 'cancelled' && so.status !== 'fully_delivered'
      );

      openSales.forEach(order => {
        (order.items || []).forEach(item => {
          const prod = products.find(p => p.id === item.productId);
          if (prod && prod.procurementStrategy === 'MTO') {
            const delivered = order.deliveredQty?.[prod.id] || 0;
            const remainingNeeded = Math.max(0, item.quantity - delivered);

            if (remainingNeeded > 0) {
              // Calculate already scheduled POs/MOs for this SO
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

      return recommendations;
    }
  },

  executeProcurement: async (recommendation) => {
    try {
      const res = await procurementApi.executeProcurement(recommendation);
      return res.data;
    } catch (e) {
      if (recommendation.procurementType === 'MANUFACTURING') {
        // Create planned Manufacturing Order
        const moData = {
          bomId: recommendation.bomId,
          productId: recommendation.productId,
          quantity: recommendation.recommendedQty,
          status: 'PLANNED',
          sourceSalesOrder: recommendation.refNumber || '',
          plannedStartDate: new Date().toISOString().split('T')[0],
          assignee: 'u5'
        };

        const mo = await manufacturingService.createManufacturingOrder(moData);
        
        mockDb.logAudit('Procurement Trigger', `Auto-generated planned Manufacturing Order ${mo.moNumber} for product ${recommendation.productName}.`, 'Procurement', mo.moNumber);

        return {
          success: true,
          manufacturingOrderId: mo.id,
          manufacturingOrderNumber: mo.moNumber,
          // compatibility fields
          purchaseOrderId: mo.id,
          purchaseOrderNumber: mo.moNumber
        };
      } else {
        // Create draft Purchase Order
        const poData = {
          vendorId: recommendation.suggestedVendorId,
          items: [
            {
              productId: recommendation.productId,
              quantity: recommendation.recommendedQty,
              unitCost: mockDb.getById(DB_KEYS.PRODUCTS, recommendation.productId)?.cost || 1.00
            }
          ],
          status: 'draft',
          sourceSalesOrder: recommendation.refNumber || ''
        };

        const po = await purchaseService.createPurchaseOrder(poData);

        mockDb.logAudit('Procurement Trigger', `Auto-generated draft Purchase Order ${po.orderNumber} for product ${recommendation.productName}.`, 'Procurement', po.orderNumber);

        return {
          success: true,
          purchaseOrderId: po.id,
          purchaseOrderNumber: po.orderNumber
        };
      }
    }
  }
};

export default procurementService;
