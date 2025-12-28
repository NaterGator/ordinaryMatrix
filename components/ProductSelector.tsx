import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Plus, Check, Search, X } from 'lucide-react';

interface ProductSelectorProps {
  allProducts: Product[];
  selectedProducts: Product[];
  onSelect: (product: Product) => void;
  onRemove: (productId: string) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ 
  allProducts, 
  selectedProducts, 
  onSelect,
  onRemove
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    const lowerTerm = searchTerm.toLowerCase();
    return allProducts.filter(p => 
      !selectedProducts.find(sp => sp.id === p.id) && // Exclude already selected
      (p.name.toLowerCase().includes(lowerTerm) || p.category?.toLowerCase().includes(lowerTerm))
    ).slice(0, 8); // Limit suggestions
  }, [allProducts, selectedProducts, searchTerm]);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm shadow-sm transition duration-150 ease-in-out"
          placeholder="Search for products (e.g., 'Niacinamide', 'Retinol')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {filteredProducts.length === 0 ? (
              <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                No products found.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="cursor-pointer select-none relative py-3 px-4 hover:bg-gray-50 flex justify-between items-center group"
                  onClick={() => handleSelect(product)}
                >
                  <div>
                    <span className="block font-medium text-gray-900">{product.name}</span>
                    <span className="block text-xs text-gray-500">{product.category}</span>
                  </div>
                  <Plus className="h-4 w-4 text-gray-400 group-hover:text-black" />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected Chips */}
      <div className="flex flex-wrap gap-2">
        {selectedProducts.map((product) => (
          <span
            key={product.id}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200"
          >
            {product.name}
            <button
              type="button"
              className="flex-shrink-0 ml-2 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
              onClick={() => onRemove(product.id)}
            >
              <span className="sr-only">Remove {product.name}</span>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      
      {selectedProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Start by searching and adding products to your routine.
        </div>
      )}
    </div>
  );
};
