import api from './api';
import { UserTemplate } from '../types/product';

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
