import axiosInstance from './axios';

export const ordersAPI = {
  getAllOrders: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/orders${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};

