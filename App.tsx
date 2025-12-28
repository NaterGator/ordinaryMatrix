import React, { useEffect, useState } from 'react';
import { fetchProducts } from './services/productService';
import { checkCompatibility } from './services/compatibilityService';
import { Product, AnalysisResult } from './types';
import { ProductSelector } from './components/ProductSelector';
import { MatrixGrid } from './components/MatrixGrid';
import { RoutineBuilder } from './components/RoutineBuilder';
import { Beaker, Sparkles, AlertCircle, X } from 'lucide-react';

const App: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts();
      setAllProducts(products);
    };
    loadProducts();
  }, []);

  const handleSelectProduct = (product: Product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      const newSelection = [...selectedProducts, product];
      setSelectedProducts(newSelection);
      // Auto-analyze when selection changes if we have enough products
      if (newSelection.length >= 2) {
         const result = checkCompatibility(newSelection);
         setAnalysisResult(result);
      } else {
         setAnalysisResult(null);
      }
    }
  };

  const handleRemoveProduct = (productId: string) => {
    const newSelection = selectedProducts.filter(p => p.id !== productId);
    setSelectedProducts(newSelection);
    
    if (newSelection.length >= 2) {
       const result = checkCompatibility(newSelection);
       setAnalysisResult(result);
    } else {
       setAnalysisResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-gray-200">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-sm">
              <Beaker className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">The Ordinary Matcher</h1>
          </div>
          <button 
            onClick={() => setShowAbout(true)} 
            className="text-xs text-gray-500 hover:text-black hover:underline decoration-1 underline-offset-2 focus:outline-none"
          >
            About
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Intro */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-gray-900 tracking-tight">
            Build your regimen.
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            Select products from The Ordinary to verify conflicts and build a safe, effective skincare routine.
          </p>
        </div>

        {/* Product Selector */}
        <div className="bg-white p-6 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Select Products</h3>
          <ProductSelector 
            allProducts={allProducts} 
            selectedProducts={selectedProducts} 
            onSelect={handleSelectProduct}
            onRemove={handleRemoveProduct}
          />
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          {selectedProducts.length === 0 && (
             <div className="text-center text-gray-400 py-12">
               Select products to see the compatibility matrix.
             </div>
          )}

          {selectedProducts.length > 0 && selectedProducts.length < 2 && (
             <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
               Select at least one more product to compare.
             </div>
          )}

          {analysisResult && selectedProducts.length >= 2 && (
             <MatrixGrid products={selectedProducts} analysis={analysisResult} />
          )}

          {/* Routine Builder - Only show if we have products selected */}
          {selectedProducts.length > 0 && (
             <RoutineBuilder products={selectedProducts} />
          )}
        </div>

      </main>

      <footer className="mt-20 py-8 border-t border-gray-200 text-center">
        <p className="text-gray-400 text-xs">
          Not affiliated with DECIEM or The Ordinary. Always patch test products. <br/>
          Data sourced from unofficial community APIs. Consult a dermatologist for professional advice.
        </p>
      </footer>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setShowAbout(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowAbout(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" /> 
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">About The Ordinary Matcher</h3>
            
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                This tool is designed to help skincare enthusiasts build safe routines by identifying potential conflicts between products from The Ordinary.
              </p>
              <p>
                It uses data from the <a href="https://github.com/melissamcewen/the-ordinary-unofficial-api" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Unofficial The Ordinary API</a> to determine compatibility based on product usage guidelines (e.g., avoiding conflicting active ingredients in the same routine).
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-xs text-gray-500">
                <p className="font-semibold text-gray-700 mb-1">Disclaimer</p>
                This application is a fan-made project and is <strong>not affiliated with, endorsed by, or connected to DECIEM or The Ordinary</strong>. 
                <br/><br/>
                All product names are trademarks of their respective owners. Information provided here is for educational purposes only and does not substitute professional dermatological advice.
              </div>
            </div>

            <button 
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;