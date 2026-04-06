import { DesignElement } from '../../../types/product';

export interface SceneObject extends DesignElement {
  type: 'image' | 'text' | 'decor' | 'furniture';
  zIndex: number;
  flipX?: boolean;
}

export interface SceneTemplate {
  id: string;
  name: string;
  category: 'office' | 'cafe' | 'tea-room' | 'studio';
  thumbnail_url: string;
  background_url: string;
  default_objects?: Partial<SceneObject>[];
}

export interface InteriorAsset {
  id: string;
  name: string;
  category: string;
  image_url: string;
  default_width: number;
}
