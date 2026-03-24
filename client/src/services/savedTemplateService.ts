import api from './api';

export interface UserTemplate {
  id: number;
  user_id: number;
  product_template_id: number;
  name: string;
  preview_image_url: string;
  design_data: string;
  created_at: string;
  updated_at: string;
  product_template?: {
    id: number;
    name: string;
    sku: string;
    image_url: string;
    base_price: number;
    default_profit: number;
    rating: number;
    review_count: number;
    colors: string;
    sizes: string;
    category?: string;
    views?: any[];
  };
}

export const savedTemplateService = {
  getMyTemplates: async () => {
    const response = await api.get<UserTemplate[]>('/user-templates');
    return response.data;
  },

  saveTemplate: async (data: {
    id?: number;
    product_template_id: number;
    name: string;
    preview_image_url: string;
    design_data: string;
  }) => {
    if (data.id) {
      const response = await api.put(`/user-templates/${data.id}`, data);
      return response.data;
    }
    const response = await api.post('/user-templates', data);
    return response.data;
  },

  deleteTemplate: async (id: number) => {
    const response = await api.delete(`/user-templates/${id}`);
    return response.data;
  },

  getPresignedUpload: async () => {
    const response = await api.get('/user-templates/presigned-upload');
    return response.data;
  }
};
