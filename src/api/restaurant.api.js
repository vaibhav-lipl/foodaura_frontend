import axiosInstance from './axios';

export const restaurantAPI = {
  getProfile: async () => {
    const response = await axiosInstance.get('/restaurant/profile');
    return response.data;
  },

  updateProfile: async (profileData, imageFile) => {
    const formData = new FormData();

    // Append text fields
    Object.keys(profileData).forEach((key) => {
      if (key !== 'imageUrl' && profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });

    // Append image file if provided
    if (imageFile) {
      formData.append('restaurantImage', imageFile);
    }

    const response = await axiosInstance.put('/restaurant/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSchedule: async () => {
    const response = await axiosInstance.get('/restaurant/schedule');
    return response.data;
  },

  updateSchedule: async (schedules) => {
    const response = await axiosInstance.put('/restaurant/schedule', { schedules });
    return response.data;
  },

  getOffers: async () => {
    const response = await axiosInstance.get('/restaurant/offers');
    return response.data;
  },

  createOffer: async (offerData, imageFile) => {
    const formData = new FormData();

    // Append text fields
    Object.keys(offerData).forEach((key) => {
      if (offerData[key] !== null && offerData[key] !== undefined) {
        const value =
          typeof offerData[key] === 'boolean'
            ? String(offerData[key])
            : offerData[key];

        formData.append(key, value);
      }
    });

    // Append image file
    if (imageFile) {
      formData.append('offerImage', imageFile); // 🔑 must match multer
    }

    const response = await axiosInstance.post(
      '/restaurant/offers',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  getStatistics: async (params = {}) => {
    const response = await axiosInstance.get('/restaurant/statistics', { params });
    return response.data;
  },

  SaveRestaurantToken: async (token) => {
    const response = await axiosInstance.post('/restaurant/save-restaurant-token', { token });
    return response.data;
  }

};

