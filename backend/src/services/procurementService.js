// src/services/procurementService.js
// Procurement recommendations service layer — live APIs only, no mock fallbacks.

import procurementApi from '../api/procurementApi';

const extractList = (data) => (Array.isArray(data) ? data : (data?.content ?? []));

export const procurementService = {
  getRecommendations: async () => {
    const res = await procurementApi.getRecommendations();
    return extractList(res.data);
  },

  executeProcurement: async (data) => {
    const res = await procurementApi.executeProcurement(data);
    return res.data;
  },
};

export default procurementService;
