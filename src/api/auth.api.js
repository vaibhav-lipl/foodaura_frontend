import axiosInstance from './axios';

export const authAPI = {
  signup: async (userData) => {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  },

  setupRestaurant: async (restaurantData, imageFile) => {
    const formData = new FormData();

    // Append text fields
    Object.keys(restaurantData).forEach((key) => {
      if (key !== 'imageUrl' && restaurantData[key] !== null && restaurantData[key] !== undefined) {
        formData.append(key, restaurantData[key]);
      }
    });

    // Append image file if provided
    if (imageFile) {
      formData.append('restaurantImage', imageFile);
    }

    const response = await axiosInstance.post('/auth/setup-restaurant', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // auth.api.js

  getNotifications: async () => {
    const response = await axiosInstance.get('/auth/notifications');
    return response.data;
  },

  markNotificationAsRead: async (notificationId) => {
    const response = await axiosInstance.put(
      `/auth/markNotificationAsRead/${notificationId}`
    );
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await axiosInstance.delete(
      `/auth/deleteNotification/${notificationId}`
    );
    return response.data;
  },
};

