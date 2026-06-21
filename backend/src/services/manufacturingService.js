// src/services/manufacturingService.js
// Manufacturing orders service layer — live APIs only, no mock fallbacks.

import manufacturingApi from '../api/manufacturingApi';
import workOrderApi from '../api/workOrderApi';
import workCenterApi from '../api/workCenterApi';
import bomApi from '../api/bomApi';

const extractList = (data) => (Array.isArray(data) ? data : (data?.content ?? []));

export const manufacturingService = {
  getManufacturingOrders: async (params) => {
    const res = await manufacturingApi.getAll(params);
    return extractList(res.data);
  },

  getManufacturingOrderById: async (id) => {
    const res = await manufacturingApi.getById(id);
    return res.data;
  },

  createManufacturingOrder: async (data) => {
    const res = await manufacturingApi.create(data);
    return res.data;
  },

  updateManufacturingOrder: async (id, data) => {
    const res = await manufacturingApi.update(id, data);
    return res.data;
  },

  deleteManufacturingOrder: async (id) => {
    await manufacturingApi.delete(id);
    return true;
  },

  getWorkOrders: async (params) => {
    const res = await workOrderApi.getAll(params);
    return extractList(res.data);
  },

  getWorkCenters: async () => {
    const res = await workCenterApi.getAll();
    return extractList(res.data);
  },

  getBoms: async () => {
    const res = await bomApi.getAll();
    return extractList(res.data);
  },

  createBom: async (data) => {
    const res = await bomApi.create(data);
    return res.data;
  },

  updateBom: async (id, data) => {
    const res = await bomApi.update(id, data);
    return res.data;
  },

  deleteBom: async (id) => {
    await bomApi.delete(id);
    return true;
  },
};

export default manufacturingService;
