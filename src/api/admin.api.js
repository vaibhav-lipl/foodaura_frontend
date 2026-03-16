import axiosInstance from './axios';

export const adminAPI = {

  // Update admin profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/admin/profile', profileData);
    return response.data;
  },

  // Change admin password
  changePassword: async (passwordData) => {
    const response = await axiosInstance.put('/admin/password', passwordData);
    return response.data;
  },

  // Dashboard
  getDashboard: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  },

  // User Management
  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.role) queryParams.append('role', params.role);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = `/admin/users${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Restaurant Management
  getAllRestaurants: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
    if (params.isOpen !== undefined) queryParams.append('isOpen', params.isOpen);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = `/admin/restaurants${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  updateRestaurantStatus: async (restaurantId, statusData) => {
    const response = await axiosInstance.put(`/admin/restaurants/${restaurantId}/status`, statusData);
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await axiosInstance.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await axiosInstance.put('/admin/settings', settingsData);
    return response.data;
  },

  getDeliveryPartners: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/admin/delivery-partners${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  updateDeliveryPartnerStatus: async (partnerId, statusData) => {
    const response = await axiosInstance.put(
      `/admin/delivery-partners/${partnerId}/status`,
      statusData
    );
    return response.data;
  },

  getDeliveryPartnerById: async (partnerId) => {
    const response = await axiosInstance.get(`/admin/delivery-partners/${partnerId}`);
    return response.data;
  }

};

