export interface IProduct {
  name: string;
  brand: string;
  price: number;
  model: string;
  stock: number;
  description?: string;
  category?: string;
  images?: string[];
  ratings?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}
