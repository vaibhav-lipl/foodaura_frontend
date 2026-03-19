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
  },

  // FAQ Modules
  getFaqModules: async () => {
    const response = await axiosInstance.get('/admin/faq-modules');
    return response.data;
  },

  createFaqModule: async (payload) => {
    const response = await axiosInstance.post('/admin/faq-modules', payload);
    return response.data;
  },

  updateFaqModule: async (moduleId, payload) => {
    const response = await axiosInstance.put(`/admin/faq-modules/${moduleId}`, payload);
    return response.data;
  },

  deleteFaqModule: async (moduleId) => {
    const response = await axiosInstance.delete(`/admin/faq-modules/${moduleId}`);
    return response.data;
  },

  // FAQs
  getFaqs: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.user_type) queryParams.append('user_type', params.user_type);
    if (params.moduleId) queryParams.append('moduleId', params.moduleId);
    if (params.module) queryParams.append('module', params.module);

    const queryString = queryParams.toString();
    const url = `/admin/faqs${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  createFaq: async (payload) => {
    const response = await axiosInstance.post('/admin/faqs', payload);
    return response.data;
  },

  updateFaq: async (faqId, payload) => {
    const response = await axiosInstance.put(`/admin/faqs/${faqId}`, payload);
    return response.data;
  },

  deleteFaq: async (faqId) => {
    const response = await axiosInstance.delete(`/admin/faqs/${faqId}`);
    return response.data;
  },

  // Support Tickets
  getSupportTickets: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.user_type) queryParams.append('user_type', params.user_type);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = `/admin/support-tickets${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getSupportTicketById: async (ticketId) => {
    const response = await axiosInstance.get(`/admin/support-tickets/${ticketId}`);
    return response.data;
  },

  replyToSupportTicket: async (ticketId, payload) => {
    const response = await axiosInstance.post(`/admin/support-tickets/${ticketId}/reply`, payload);
    return response.data;
  },

  updateSupportTicketStatus: async (ticketId, payload) => {
    const response = await axiosInstance.put(`/admin/support-tickets/${ticketId}/status`, payload);
    return response.data;
  },

};
