import axiosInstance from './axios';

export const statisticsAPI = {
  getStatistics: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/statistics${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },
};

