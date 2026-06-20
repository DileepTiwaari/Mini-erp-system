// src/services/inventoryService.js
// Stock ledger adjustments, stock table and physical inventory service layer.

import inventoryApi from '../api/inventoryApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const inventoryService = {
  getInventoryLedger: async () => {
    try {
      const res = await inventoryApi.getLedger();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.INVENTORY_LEDGER);
    }
  },

  adjustStock: async (data) => {
    try {
      const res = await inventoryApi.adjust(data);
      return res.data;
    } catch (e) {
      // Direct adjustment simulation
      const { productId, adjustmentType, quantity, reference } = data;
      const product = mockDb.getById(DB_KEYS.PRODUCTS, productId);
      
      if (!product) {
        throw new Error('Product not found for adjustment.');
      }

      const parsedQty = Number(quantity) || 0;
      let newStock = product.stock;
      if (adjustmentType === 'in') {
        newStock += parsedQty;
      } else {
        newStock = Math.max(0, newStock - parsedQty);
      }

      const reservedQty = product.reservedQty || 0;
      const freeToUseQty = newStock - reservedQty;

      mockDb.update(DB_KEYS.PRODUCTS, productId, { stock: newStock, freeToUseQty });
      
      const ledgerEntry = mockDb.insert(DB_KEYS.INVENTORY_LEDGER, {
        productId,
        type: adjustmentType,
        movementType: 'Adjustment',
        quantity: parsedQty,
        reference: reference || 'Physical Adjustment',
        timestamp: new Date().toISOString(),
        balanceAfterMovement: newStock
      });

      return {
        product: mockDb.getById(DB_KEYS.PRODUCTS, productId),
        ledgerEntry
      };
    }
  },

  getInventorySummary: async () => {
    try {
      const res = await inventoryApi.getSummary();
      return res.data;
    } catch (e) {
      // Mock metrics aggregations
      const products = mockDb.getAll(DB_KEYS.PRODUCTS);
      const ledger = mockDb.getAll(DB_KEYS.INVENTORY_LEDGER);

      const totalValuation = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
      const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
      const outOfStockCount = products.filter(p => p.stock === 0).length;

      return {
        totalValuation,
        totalItems: products.length,
        lowStockCount,
        outOfStockCount,
        recentMovements: ledger.slice(0, 5),
      };
    }
  }
};

export default inventoryService;
