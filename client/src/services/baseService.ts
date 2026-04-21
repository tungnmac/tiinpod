import api from './api';

export interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const productService = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getProduct: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
};

export const orderService = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getOrder: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  }
};

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};

export const storeService = {
  getStores: async () => {
    const response = await api.get('/stores');
    return response.data;
  }
};

export const baseTemplateService = {
  getTemplates: async () => {
    const response = await api.get('/product-templates');
    return response.data;
  },
  getTemplate: async (id: string) => {
    const response = await api.get(`/product-templates/${id}`);
    return response.data;
  }
};

export const paymentService = {
  getCurrentMethod: async (params: any) => {
    const response = await api.get('/payments/method', { params });
    return response.data;
  },
  getSavedMethods: async (params: any) => {
    const response = await api.get('/payments/methods', { params });
    return response.data;
  },
  saveMethod: async (methodData: any) => {
    const response = await api.post('/payments/methods', methodData);
    return response.data;
  },
  verifyCard: async (cardData: any) => {
    const response = await api.post('/payments/verify-card', cardData);
    return response.data;
  }
};
