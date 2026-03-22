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
  ProductTemplate?: {
    id: number;
    name: string;
    image: string;
    price: number;
  };
}

export const savedTemplateService = {
  getMyTemplates: async () => {
    const response = await api.get<UserTemplate[]>('/saved-templates');
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
      const response = await api.put(`/saved-templates/${data.id}`, data);
      return response.data;
    }
    const response = await api.post('/saved-templates', data);
    return response.data;
  },

  deleteTemplate: async (id: number) => {
    const response = await api.delete(`/saved-templates/${id}`);
    return response.data;
  },

  getPresignedUpload: async () => {
    const response = await api.get('/saved-templates/presigned-upload');
    return response.data;
  }
};
