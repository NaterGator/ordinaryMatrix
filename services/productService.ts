import * as OrdinaryLib from 'the-ordinary-unofficial-api';
import { Product } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  const lib = OrdinaryLib as any;
  
  // The API exports 'products' as a named export which is an object: { [key: string]: Product }
  // We need to robustly find this object.
  let productsMap: any = {};

  if (lib.products && typeof lib.products === 'object' && !Array.isArray(lib.products)) {
    productsMap = lib.products;
  } else if (lib.default && lib.default.products && typeof lib.default.products === 'object') {
    productsMap = lib.default.products;
  } else if (lib.default && typeof lib.default === 'object') {
    // Fallback if default export IS the map
    productsMap = lib.default;
  }

  // Convert the object map to our array format
  const mappedProducts: Product[] = Object.values(productsMap).map((p: any) => {
    return {
      id: p.id || p.slug, // API uses 'id' as the slug usually
      name: p.Name,       // Note capitalized 'Name' from API source
      slug: p.id,
      category: p.Tags?.[0] || 'General', 
      target: p.Targets?.join(', '),
      format: p.Format,
      excludes: p.Excludes || [], // Capture exclusion list
      tags: p.Tags || []          // Capture tags (e.g. "Direct Acids")
    };
  });

  // Sort alphabetically
  mappedProducts.sort((a, b) => a.name.localeCompare(b.name));

  return mappedProducts;
};