import { ProductTemplate } from "../types/product";

export const sampleTemplate: ProductTemplate = {
  id: 1,
  name: "Classic Unisex T-Shirt",
  description: "A timeless and versatile t-shirt, perfect for any occasion. Made from 100% premium ring-spun cotton, it offers a soft feel and a comfortable fit. Ideal for printing your custom designs, this shirt serves as a blank canvas for your creativity. It features a durable construction with a double-needle stitched neckline and sleeves.",
  sku: "TS-UN-CL-WH-M",
  image_url: "https://images.printify.com/mockup/63b8/3415/3012/unisex-staple-t-shirt-bella-canvas-3001.jpg?s=600",
  views: [
    { id: 1, view_name: "front", image_url: "https://images.printify.com/mockup/63b8/3415/3012/unisex-staple-t-shirt-bella-canvas-3001.jpg?s=600", product_template_id: 1 },
    { id: 2, view_name: "back", image_url: "https://images.printify.com/mockup/63b8/3415/3014/unisex-staple-t-shirt-bella-canvas-3001.jpg?s=600", product_template_id: 1 },
    { id: 3, view_name: "left", image_url: "https://images.printify.com/mockup/63b8/3415/3016/unisex-staple-t-shirt-bella-canvas-3001.jpg?s=600", product_template_id: 1 },
  ],
  category: "Apparel",
  provider: "Printify",
  base_price: 12.50,
  price: 25.00,
  currency: "USD",
  default_profit: 12.50,
  rating: 4.8,
  review_count: 1250,
  colors: ["White", "Black", "Navy", "Heather Grey", "Red"],
  sizes: ["S", "M", "L", "XL", "2XL"],
  variants: 25,
  specs: [
    { label: "Material", value: "100% Cotton" },
    { label: "Weight", value: "4.2 oz" },
    { label: "Fit", value: "Retail Fit" },
    { label: "Sizing", value: "Unisex" },
  ],
  features: [
    "Side-seamed",
    "Tear-away label",
    "Shoulder-to-shoulder taping",
    "Pre-shrunk fabric",
  ],
};
