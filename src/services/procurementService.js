// src/services/procurementService.js
// Automated replenishment and shortages recommendations service layer.

import procurementApi from '../api/procurementApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';
import purchaseService from './purchaseService';

export const procurementService = {
  getRecommendations: async () => {
    try {
      const res = await procurementApi.getRecommendations();
      return res.data;
    } catch (e) {
      // Standalone algorithm: find products where stock is <= minStock, identify vendor, calculate gap
      const products = mockDb.getAll(DB_KEYS.PRODUCTS);
      const boms = mockDb.getAll(DB_KEYS.BOMS);
      const vendors = mockDb.getAll(DB_KEYS.VENDORS);
      
      const recommendations = [];

      products.forEach(p => {
        if (p.stock <= p.minStock) {
          // Identify vendor. Default: bind to ElectroParts or Apex
          let vendor = vendors[0];
          if (p.code.startsWith('RM-COP') || p.categoryId === 'cat2') {
            vendor = vendors.find(v => v.id === 'v2') || vendors[0];
          } else if (p.code.startsWith('RM-BLT')) {
            vendor = vendors.find(v => v.id === 'v3') || vendors[0];
          }
          
          const qtyToOrder = Math.max(p.minStock * 2 - p.stock, 10);
          const estimatedCost = qtyToOrder * p.cost;

          recommendations.push({
            id: `rec-${p.id}`,
            productId: p.id,
            productName: p.name,
            productCode: p.code,
            currentStock: p.stock,
            minStock: p.minStock,
            recommendedQty: qtyToOrder,
            uom: p.uom,
            suggestedVendorId: vendor?.id || 'v1',
            suggestedVendorName: vendor?.name || 'Apex Metal Corp',
            estimatedCost,
            reason: 'Stock dropped below minimum safety threshold.'
          });
        }
      });

      return recommendations;
    }
  },

  executeProcurement: async (recommendation) => {
    try {
      const res = await procurementApi.executeProcurement(recommendation);
      return res.data;
    } catch (e) {
      // Create a draft Purchase Order automatically!
      const poData = {
        vendorId: recommendation.suggestedVendorId,
        items: [
          {
            productId: recommendation.productId,
            quantity: recommendation.recommendedQty,
            unitCost: mockDb.getById(DB_KEYS.PRODUCTS, recommendation.productId)?.cost || 1.00
          }
        ],
        status: 'draft'
      };

      const po = await purchaseService.createPurchaseOrder(poData);

      // Add audit log
      mockDb.logAudit('Procurement Trigger', `Auto-generated draft Purchase Order ${po.orderNumber} for product ${recommendation.productName}.`);

      return {
        success: true,
        purchaseOrderId: po.id,
        purchaseOrderNumber: po.orderNumber
      };
    }
  }
};

export default procurementService;
