
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string | null;
  is_active?: boolean;
}
