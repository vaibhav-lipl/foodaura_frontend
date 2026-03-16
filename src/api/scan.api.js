import axiosInstance from './axios';

export const scanAPI = {
  scanFoodImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosInstance.post('/scan-food', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

