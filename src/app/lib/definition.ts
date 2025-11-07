export type Product = {
  product_id: number;
  name: string;
  image_url: string;
  original_price: number;
  discount_price: number | null;
  max_original_price?: number;
  max_discount_price?: number | null;
  stock?: number;
  info?: string;      // optional extra fields
  order_fulfillment?: string;
  warranty_period?: string;
  warranty_method?: string;
};

export type ProductType = {
  product_type_id: number;
  type: string;
  original_price: string;
  discount_price: string;
  stock: number;
};

export type User = {
    username: string;
    email: string,
    password: string
}