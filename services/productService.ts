import { products } from 'the-ordinary-unofficial-api';
import { Product } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  // Convert the object map to our array format
  const sortedProducts: Product[] = Object.values(products).sort((a, b) => a.Name.localeCompare(b.Name));

  return sortedProducts;
};