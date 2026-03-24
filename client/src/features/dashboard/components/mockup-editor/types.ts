export interface DesignElement {
  id: string;
  type: 'image' | 'text';
  viewId?: 'front' | 'back' | 'left' | 'right';
  url?: string;
  text?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: string;
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: number;
  curve?: number; // -100 to 100, 0 is flat
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  isVisible: boolean;
}

export interface ProductView {
  id: string; // "front", "back", "left", "right"
  view_name: string;
  image_url: string;
}

export interface ProductTemplate {
  id: number;
  name: string;
  sku: string;
  image_url: string;
  views?: ProductView[];
  category: string;
  default_profit: number;
  rating: number;
  review_count: number;
  colors: string;
  sizes: string;
  base_price: number;
  price: number; // For UI display and updates
}
