import { DesignElement } from '../../../types/product';

// Base GORM fields to match Golang Backend (snake_case)
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface SceneObject extends Omit<DesignElement, 'type'> {
  type: 'image' | 'text' | 'decor' | 'furniture';
  zIndex: number;
  flipX?: boolean;
}

export interface SceneTemplate extends BaseEntity {
  name: string;
  category: string;
  thumbnail_url: string;
  background_url: string;
  description?: string;
}

export interface InteriorAsset extends BaseEntity {
  name: string;
  url: string;
  category: string;
}

export interface SceneApiResponse<T> {
  message: string;
  data: T;
}
