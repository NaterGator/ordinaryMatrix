import React, { useState } from 'react';
import { Product, AnalysisResult, CompatibilityStatus } from '../types';
import { CheckCircle, AlertTriangle, XCircle, HelpCircle, Info } from 'lucide-react';

interface MatrixGridProps {
  products: Product[];
  analysis: AnalysisResult;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({ products, analysis }) => {
  const [selectedCell, setSelectedCell] = useState<{ p1: string, p2: string, reason: string, status: CompatibilityStatus } | null>(null);

  // Helper to find result between two products
  const getCompatibility = (p1: Product, p2: Product) => {
    if (p1.id === p2.id) return null; // Same product

    // Search in pairs for A-B or B-A
    const pair = analysis.pairs.find(
      p => (p.productA === p1.name && p.productB === p2.name) || 
           (p.productA === p2.name && p.productB === p1.name)
    );

    return pair;
  };

  const getStatusIcon = (status: CompatibilityStatus) => {
    switch (status) {
      case CompatibilityStatus.COMPATIBLE: return <CheckCircle className="w-5 h-5 text-green-500" />;
      case CompatibilityStatus.CONFLICT: return <XCircle className="w-5 h-5 text-red-500" />;
      case CompatibilityStatus.CAUTION: return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <HelpCircle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status: CompatibilityStatus) => {
    switch (status) {
      case CompatibilityStatus.COMPATIBLE: return 'bg-green-50 hover:bg-green-100 border-green-200';
      case CompatibilityStatus.CONFLICT: return 'bg-red-50 hover:bg-red-100 border-red-200';
      case CompatibilityStatus.CAUTION: return 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200';
      default: return 'bg-gray-50 hover:bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Routine Summary</h3>
        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Compatibility Matrix</h3>
        
        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full align-middle">
            <div className="grid" style={{ gridTemplateColumns: `auto repeat(${products.length}, minmax(40px, 1fr))` }}>
              
              {/* Header Row */}
              <div className="sticky left-0 z-10 bg-white p-2"></div>
              {products.map((p, i) => (
                <div key={p.id} className="p-2 text-center text-xs font-medium text-gray-500 rotate-0 md:rotate-0 writing-mode-horizontal flex items-end justify-center break-words">
                  <span className="w-20 truncate" title={p.name}>{p.name.split(' ').slice(0,2).join(' ')}...</span>
                </div>
              ))}

              {/* Matrix Rows */}
              {products.map((rowProduct, rowIndex) => (
                <React.Fragment key={rowProduct.id}>
                  {/* Row Header */}
                  <div className="sticky left-0 z-10 bg-white p-2 flex items-center justify-end border-r border-gray-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                    <span className="text-xs font-medium text-gray-700 text-right w-24 truncate" title={rowProduct.name}>
                      {rowProduct.name}
                    </span>
                  </div>

                  {/* Cells */}
                  {products.map((colProduct, colIndex) => {
                    if (rowIndex === colIndex) {
                      return <div key={`${rowProduct.id}-${colProduct.id}`} className="bg-gray-50 border border-white"></div>;
                    }
                    
                    const pair = getCompatibility(rowProduct, colProduct);
                    const status = pair?.status || CompatibilityStatus.UNKNOWN;

                    return (
                      <div 
                        key={`${rowProduct.id}-${colProduct.id}`}
                        onClick={() => pair && setSelectedCell({ p1: rowProduct.name, p2: colProduct.name, reason: pair.reason, status: pair.status })}
                        className={`
                          aspect-square flex items-center justify-center cursor-pointer border border-white transition-colors duration-200
                          ${getStatusColor(status)}
                        `}
                      >
                         {getStatusIcon(status)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Compatible</div>
          <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" /> Use with Caution</div>
          <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Conflict</div>
        </div>
      </div>

      {/* Detail Modal/Card */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedCell(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Interaction Detail
              </h4>
              <button onClick={() => setSelectedCell(null)} className="text-gray-400 hover:text-gray-600">
                <Info className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
               <div className="flex-1 text-sm font-medium text-center">{selectedCell.p1}</div>
               <div className="text-gray-400 font-bold">+</div>
               <div className="flex-1 text-sm font-medium text-center">{selectedCell.p2}</div>
            </div>

            <div className={`mb-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${selectedCell.status === 'COMPATIBLE' ? 'bg-green-100 text-green-800' : ''}
              ${selectedCell.status === 'CONFLICT' ? 'bg-red-100 text-red-800' : ''}
              ${selectedCell.status === 'CAUTION' ? 'bg-yellow-100 text-yellow-800' : ''}
            `}>
              {selectedCell.status}
            </div>

            <p className="text-gray-700">{selectedCell.reason}</p>
            
            <button 
              onClick={() => setSelectedCell(null)}
              className="mt-6 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
