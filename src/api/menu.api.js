import axiosInstance from './axios';

export const menuAPI = {
  getAllMenuItems: async () => {
    const response = await axiosInstance.get('/restaurant/menu');
    return response.data;
  },

  createMenuItem: async (menuData, imageFile) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(menuData).forEach((key) => {
      if (key !== 'imageUrl' && menuData[key] !== null && menuData[key] !== undefined) {
        // Convert boolean to string for FormData
        const value = typeof menuData[key] === 'boolean' ? String(menuData[key]) : menuData[key];
        formData.append(key, value);
      }
    });
    
    // Append image file if provided
    if (imageFile) {
      formData.append('menuImage', imageFile);
    }

    const response = await axiosInstance.post('/restaurant/menu', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateMenuItem: async (menuId, menuData, imageFile) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(menuData).forEach((key) => {
      if (key !== 'imageUrl' && menuData[key] !== null && menuData[key] !== undefined) {
        // Convert boolean to string for FormData
        const value = typeof menuData[key] === 'boolean' ? String(menuData[key]) : menuData[key];
        formData.append(key, value);
      }
    });
    
    // Append image file if provided
    if (imageFile) {
      formData.append('menuImage', imageFile);
    }

    const response = await axiosInstance.put(`/restaurant/menu/${menuId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMenuItem: async (menuId) => {
    const response = await axiosInstance.delete(`/restaurant/menu/${menuId}`);
    return response.data;
  },
};

