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
  id: number; 
  view_name: string; // "front", "back", "left", "right"
  image_url: string;
  product_template_id: number;
}

export interface ProductTemplate {
  id: number;
  name: string;
  description: string;
  sku: string;
  type?: string; // e.g. "T-Shirt", "Mug"
  image_url: string;
  views?: ProductView[];
  category: string;
  provider: string; // Changed from vendor
  base_price: number;
  price: number; // For UI display and updates
  default_profit: number;
  rating: number;
  review_count: number;
  colors: string[]; // Changed from string
  sizes: string[]; // Changed from string
  variants: number;
  specs: { label: string; value: string }[];
  features: string[];
}

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
    description: string;
    provider: string;
    variants: number;
    colors: string;
    sizes: string;
    category?: string;
    views?: any[];
    specs?: { label: string; value: string }[];
    features?: string[];
  };
}