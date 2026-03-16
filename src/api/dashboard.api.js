import axiosInstance from './axios';

export const dashboardAPI = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/dashboard');
    return response.data;
  },

  toggleRestaurantStatus: async () => {
    const response = await axiosInstance.put('/dashboard/toggle-status');
    return response.data;
  },
};

