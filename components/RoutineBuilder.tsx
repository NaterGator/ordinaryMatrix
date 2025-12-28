import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { checkConflict } from '../services/compatibilityService';
import { Sun, Moon, Info, Check } from 'lucide-react';

interface RoutineBuilderProps {
  products: Product[];
}

export const RoutineBuilder: React.FC<RoutineBuilderProps> = ({ products }) => {
  const [amRoutine, setAmRoutine] = useState<string[]>([]);
  const [pmRoutine, setPmRoutine] = useState<string[]>([]);

  // Cleanup routines if products are removed from main selection
  useEffect(() => {
    const productIds = products.map(p => p.id);
    setAmRoutine(prev => prev.filter(id => productIds.includes(id)));
    setPmRoutine(prev => prev.filter(id => productIds.includes(id)));
  }, [products]);

  const toggleProduct = (productId: string, type: 'AM' | 'PM') => {
    const currentList = type === 'AM' ? amRoutine : pmRoutine;
    const setList = type === 'AM' ? setAmRoutine : setPmRoutine;

    if (currentList.includes(productId)) {
      setList(currentList.filter(id => id !== productId));
    } else {
      setList([...currentList, productId]);
    }
  };

  const getConflictInfo = (product: Product, currentRoutineIds: string[]) => {
    const currentRoutineProducts = products.filter(p => currentRoutineIds.includes(p.id));
    const conflicts = currentRoutineProducts.filter(p => p.id !== product.id && checkConflict(p, product));
    return conflicts;
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Routine Builder</h3>
        <p className="text-sm text-gray-500">
          Assign products to your Morning (AM) or Evening (PM) routine. 
          Incompatible products will be disabled automatically based on your current selection.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/2">Product</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                <div className="flex items-center justify-center gap-1">
                  <Sun className="w-4 h-4" /> AM
                </div>
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                <div className="flex items-center justify-center gap-1">
                  <Moon className="w-4 h-4" /> PM
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => {
              const inAM = amRoutine.includes(product.id);
              const inPM = pmRoutine.includes(product.id);
              
              const amConflicts = getConflictInfo(product, amRoutine);
              const pmConflicts = getConflictInfo(product, pmRoutine);
              
              // Disable if not currently selected AND has conflicts with existing items
              const disableAM = !inAM && amConflicts.length > 0;
              const disablePM = !inPM && pmConflicts.length > 0;

              return (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-400">{product.category}</div>
                  </td>
                  
                  {/* AM Toggle */}
                  <td className="py-3 px-4 text-center">
                    <RoutineToggle 
                      active={inAM}
                      disabled={disableAM}
                      icon={<Sun className="w-4 h-4" />}
                      conflicts={amConflicts}
                      onClick={() => toggleProduct(product.id, 'AM')}
                      colorClass="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"
                    />
                  </td>

                  {/* PM Toggle */}
                  <td className="py-3 px-4 text-center">
                     <RoutineToggle 
                      active={inPM}
                      disabled={disablePM}
                      icon={<Moon className="w-4 h-4" />}
                      conflicts={pmConflicts}
                      onClick={() => toggleProduct(product.id, 'PM')}
                      colorClass="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoutineSummary title="Morning Routine" items={products.filter(p => amRoutine.includes(p.id))} icon={<Sun className="w-5 h-5 text-yellow-500"/>} />
        <RoutineSummary title="Evening Routine" items={products.filter(p => pmRoutine.includes(p.id))} icon={<Moon className="w-5 h-5 text-indigo-500"/>} />
      </div>
    </div>
  );
};

const RoutineToggle: React.FC<{
  active: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
  conflicts: Product[];
}> = ({ active, disabled, icon, onClick, colorClass, conflicts }) => {
  return (
    <div className="relative group flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200
          ${active 
            ? `${colorClass} shadow-sm border-transparent scale-100` 
            : disabled 
              ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
              : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-600'
          }
        `}
      >
        {active ? <Check className="w-5 h-5" /> : icon}
      </button>
      
      {disabled && conflicts.length > 0 && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center shadow-lg">
          <div className="font-semibold mb-1">Incompatible with:</div>
          <ul className="list-disc list-inside text-gray-300">
            {conflicts.map(c => (
              <li key={c.id} className="truncate">{c.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const RoutineSummary: React.FC<{ title: string; items: Product[]; icon: React.ReactNode }> = ({ title, items, icon }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
    <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
      {icon}
      <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
      <span className="ml-auto text-xs text-gray-500 font-medium">{items.length} steps</span>
    </div>
    {items.length === 0 ? (
      <div className="text-gray-400 text-xs italic py-2">No products assigned</div>
    ) : (
      <ul className="space-y-2">
        {items.map((p, idx) => (
          <li key={p.id} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-gray-300 font-mono text-xs mt-0.5">{idx + 1}</span>
            <span className="truncate">{p.name}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
