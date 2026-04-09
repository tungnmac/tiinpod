import api from './api';
import { SceneTemplate, InteriorAsset, SceneApiResponse } from '../features/scene-design/types/scene';

export const sceneService = {
  getTemplates: async () => {
    const { data } = await api.get<SceneApiResponse<SceneTemplate[]>>('/scenes/templates');
    return data.data;
  },

  getAssets: async () => {
    const { data } = await api.get<SceneApiResponse<InteriorAsset[]>>('/scenes/assets');
    return data.data;
  }
};
