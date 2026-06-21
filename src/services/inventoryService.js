// src/services/inventoryService.js
// Stock ledger adjustments, stock table and physical inventory service layer.
// Gracefully falls back to demoDataService when the live backend is offline.

import inventoryApi from '../api/inventoryApi';
import productService from './productService';
import { demoDb, DEMO_KEYS } from './demoDataService';

export const inventoryService = {
  getInventoryLedger: async () => {
    try {
      const res = await inventoryApi.getLedger();
      const data = res.data && res.data.success ? res.data.data : res.data;
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('[Inventory] Ledger endpoint unavailable, returning demo dataset.', e.message);
      return demoDb.getAll(DEMO_KEYS.INVENTORY_LEDGER);
    }
  },

  adjustStock: async (data) => {
    try {
      const res = await inventoryApi.adjust(data);
      return res.data && res.data.success ? res.data.data : res.data;
    } catch (e) {
      console.warn('[Inventory] Adjust endpoint unavailable, applying locally to demo.', e.message);
      
      // Update mock ledger locally
      const ledgerEntry = {
        productId: data.productId,
        movementType: 'Adjustment',
        type: 'in', // adjust always positive for this demo or calculate sign
        quantity: data.quantity,
        reference: data.reference || 'ADJ-MANUAL',
        timestamp: new Date().toISOString(),
        balanceAfterMovement: data.quantity
      };
      
      const newLedger = demoDb.insert(DEMO_KEYS.INVENTORY_LEDGER, ledgerEntry);
      
      // Try updating product stock locally if live productService update is down
      try {
        const prod = await productService.getProductById(data.productId);
        if (prod) {
          await productService.updateProduct(data.productId, {
            stock: data.quantity,
            freeToUseQty: data.quantity - (prod.reservedQty || 0)
          });
        }
      } catch (err) {
        console.warn('[Inventory] Could not update live product stock level.', err.message);
      }
      
      demoDb.logAudit('Physical Inventory Adjustment', `Adjusted product stock level to ${data.quantity} units.`, 'Inventory', data.reference || '-');
      return newLedger;
    }
  },

  getInventorySummary: async () => {
    try {
      const res = await inventoryApi.getSummary();
      return res.data && res.data.success ? res.data.data : res.data;
    } catch (e) {
      console.warn('[Inventory] Summary endpoint unavailable, calculating from live catalog and demo.', e.message);
      
      let productsList = [];
      try {
        productsList = await productService.getProducts();
      } catch (err) {
        console.warn('[Inventory] Failed to get live products list for summary.', err.message);
      }

      const totalValuation = (productsList || []).reduce((acc, p) => acc + (Number(p.stock || 0) * Number(p.cost || 0)), 0);
      const lowStockCount = (productsList || []).filter(p => Number(p.stock || 0) <= Number(p.minStock || 0)).length;
      const outOfStockCount = (productsList || []).filter(p => Number(p.stock || 0) === 0).length;
      const ledgerList = demoDb.getAll(DEMO_KEYS.INVENTORY_LEDGER) || [];

      return {
        totalValuation,
        totalItems: (productsList || []).length || 50,
        lowStockCount,
        outOfStockCount,
        recentMovements: ledgerList.slice(0, 5)
      };
    }
  }
};

export default inventoryService;
