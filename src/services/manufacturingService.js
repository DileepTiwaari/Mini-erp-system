// src/services/manufacturingService.js
// Bill of Materials (BOM), Work Centers, and Manufacturing Orders service layer.
// Automates stock deductions of raw components and addition of finished goods upon MO completion.

import bomApi from '../api/bomApi';
import workCenterApi from '../api/workCenterApi';
import manufacturingApi from '../api/manufacturingApi';
import workOrderApi from '../api/workOrderApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const manufacturingService = {
  // BOM services
  getBoms: async () => {
    try {
      const res = await bomApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.BOMS);
    }
  },

  getBomById: async (id) => {
    try {
      const res = await bomApi.getById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.BOMS, id);
    }
  },

  createBom: async (data) => {
    try {
      const res = await bomApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.BOMS, data);
    }
  },

  updateBom: async (id, data) => {
    try {
      const res = await bomApi.update(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.BOMS, id, data);
    }
  },

  deleteBom: async (id) => {
    try {
      await bomApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.BOMS, id);
    }
  },

  // Work Centers services
  getWorkCenters: async () => {
    try {
      const res = await workCenterApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.WORK_CENTERS);
    }
  },

  createWorkCenter: async (data) => {
    try {
      const res = await workCenterApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.WORK_CENTERS, data);
    }
  },

  deleteWorkCenter: async (id) => {
    try {
      await workCenterApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.WORK_CENTERS, id);
    }
  },

  // Manufacturing Orders services
  getManufacturingOrders: async () => {
    try {
      const res = await manufacturingApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.MANUFACTURING);
    }
  },

  getManufacturingOrderById: async (id) => {
    try {
      const res = await manufacturingApi.getById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.MANUFACTURING, id);
    }
  },

  createManufacturingOrder: async (data) => {
    try {
      const res = await manufacturingApi.create(data);
      return res.data;
    } catch (e) {
      const doc = {
        moNumber: `MO-00${Math.floor(400 + Math.random() * 900)}`,
        status: data.status || 'PLANNED',
        assignee: data.assignee || '',
        ...data,
      };

      const mo = mockDb.insert(DB_KEYS.MANUFACTURING, doc);
      
      // Auto-create sub-operation work orders for the MO using BoM routing
      const boms = mockDb.getAll(DB_KEYS.BOMS);
      const bom = boms.find(b => b.id === mo.bomId);
      
      if (bom && bom.operations && bom.operations.length > 0) {
        bom.operations.forEach(op => {
          mockDb.insert(DB_KEYS.WORK_ORDERS, {
            moId: mo.id,
            workCenterId: op.workCenterId,
            name: op.name,
            operationOrder: op.sequence || 10,
            durationPlanned: (op.durationMinutes || 15) * mo.quantity,
            status: 'PENDING'
          });
        });
      } else {
        // Fallback standard work orders if no operations are defined
        mockDb.insert(DB_KEYS.WORK_ORDERS, {
          moId: mo.id,
          workCenterId: 'wc-assembly',
          name: `Pre-stage components for ${mo.moNumber}`,
          operationOrder: 10,
          durationPlanned: 15 * mo.quantity,
          status: 'PENDING'
        });
        mockDb.insert(DB_KEYS.WORK_ORDERS, {
          moId: mo.id,
          workCenterId: 'wc-assembly',
          name: `Assemble and test ${mo.moNumber}`,
          operationOrder: 20,
          durationPlanned: 30 * mo.quantity,
          status: 'PENDING'
        });
      }

      return mo;
    }
  },

  updateManufacturingOrder: async (id, data) => {
    try {
      const res = await manufacturingApi.update(id, data);
      return res.data;
    } catch (e) {
      const oldMo = mockDb.getById(DB_KEYS.MANUFACTURING, id);
      const updated = {
        ...data
      };

      const completionStates = ['COMPLETED', 'completed', 'done', 'DONE'];
      const isCompleting = completionStates.includes(data.status) && !completionStates.includes(oldMo.status);

      if (isCompleting) {
        manufacturingService.processStockForMoCompletion({ ...oldMo, ...updated });
        updated.actualEndDate = new Date().toISOString().split('T')[0];
        
        // Auto-complete associated work orders
        const wos = mockDb.getAll(DB_KEYS.WORK_ORDERS).filter(w => w.moId === id);
        wos.forEach(w => {
          if (w.status !== 'DONE' && w.status !== 'done') {
            mockDb.update(DB_KEYS.WORK_ORDERS, w.id, { status: 'DONE' });
          }
        });
      }

      return mockDb.update(DB_KEYS.MANUFACTURING, id, updated);
    }
  },

  deleteManufacturingOrder: async (id) => {
    try {
      await manufacturingApi.delete(id);
      return true;
    } catch (e) {
      // Also delete associated work orders
      const wos = mockDb.getAll(DB_KEYS.WORK_ORDERS).filter(w => w.moId === id);
      wos.forEach(w => mockDb.delete(DB_KEYS.WORK_ORDERS, w.id));
      return mockDb.delete(DB_KEYS.MANUFACTURING, id);
    }
  },

  // Work Orders sub-services
  getWorkOrders: async () => {
    try {
      const res = await workOrderApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.WORK_ORDERS);
    }
  },

  updateWorkOrderStatus: async (id, status) => {
    try {
      const res = await workOrderApi.updateStatus(id, status);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.WORK_ORDERS, id, { status });
    }
  },

  processStockForMoCompletion: (mo) => {
    try {
      const bom = mockDb.getById(DB_KEYS.BOMS, mo.bomId);
      if (!bom) return;

      const products = mockDb.getAll(DB_KEYS.PRODUCTS);

      // Deduct raw material components (factoring in Waste %)
      (bom.items || []).forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const wasteFactor = 1 + (Number(item.wastePercent) || 0) / 100;
          const quantityNeeded = item.quantity * mo.quantity * wasteFactor;
          const newStock = Math.max(0, prod.stock - quantityNeeded);
          const reservedQty = prod.reservedQty || 0;
          const freeToUseQty = newStock - reservedQty;

          mockDb.update(DB_KEYS.PRODUCTS, prod.id, { stock: newStock, freeToUseQty });
          
          mockDb.insert(DB_KEYS.INVENTORY_LEDGER, {
            productId: prod.id,
            movementType: 'Manufacturing Consumption',
            quantity: quantityNeeded,
            reference: mo.moNumber,
            timestamp: new Date().toISOString(),
            balanceAfterMovement: newStock
          });
        }
      });

      // Add finished good to inventory stock
      const finishedGood = products.find(p => p.id === mo.productId);
      if (finishedGood) {
        const newStock = finishedGood.stock + mo.quantity;
        const reservedQty = finishedGood.reservedQty || 0;
        const freeToUseQty = newStock - reservedQty;

        mockDb.update(DB_KEYS.PRODUCTS, finishedGood.id, { stock: newStock, freeToUseQty });

        mockDb.insert(DB_KEYS.INVENTORY_LEDGER, {
          productId: finishedGood.id,
          movementType: 'Manufacturing Production',
          quantity: mo.quantity,
          reference: mo.moNumber,
          timestamp: new Date().toISOString(),
          balanceAfterMovement: newStock
        });
      }
    } catch (err) {
      console.error('Failed to adjust stock for manufacturing order completion', err);
    }
  }
};

export default manufacturingService;
