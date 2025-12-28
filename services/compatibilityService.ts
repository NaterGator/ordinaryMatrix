import { Product, AnalysisResult, CompatibilityStatus, CompatibilityPair } from '../types';

export const checkCompatibility = (products: Product[]): AnalysisResult => {
  const pairs: CompatibilityPair[] = [];
  
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const pA = products[i];
      const pB = products[j];
      
      let status = CompatibilityStatus.COMPATIBLE;
      let reason = "No known conflicts reported by The Ordinary.";
      
      // Logic: A conflict exists if Product A explicitly excludes Product B (by name or tag),
      // OR if Product B explicitly excludes Product A.
      
      const aExcludesB = isConflict(pA, pB);
      const bExcludesA = isConflict(pB, pA);

      if (aExcludesB || bExcludesA) {
        status = CompatibilityStatus.CONFLICT;
        if (aExcludesB && bExcludesA) {
          reason = `Both products recommend avoiding the other.`;
        } else if (aExcludesB) {
          reason = `${pA.name} recommends avoiding products containing ${getConflictTerm(pA, pB)}.`;
        } else {
          reason = `${pB.name} recommends avoiding products containing ${getConflictTerm(pB, pA)}.`;
        }
      }
      
      pairs.push({
        productA: pA.name,
        productB: pB.name,
        status,
        reason
      });
    }
  }

  // Generate Summary
  const conflictCount = pairs.filter(p => p.status === CompatibilityStatus.CONFLICT).length;
  let summary = "";
  
  if (conflictCount === 0) {
    summary = "Great news! No direct conflicts were found in your selection based on The Ordinary's guidelines.";
  } else {
    summary = `Found ${conflictCount} potential conflict${conflictCount === 1 ? '' : 's'}. It is recommended to use conflicting products in separate routines (e.g., one in the AM and one in the PM, or on alternate days).`;
  }

  return { pairs, summary };
};

// Helper to check if two products conflict with each other (bidirectional)
export const checkConflict = (pA: Product, pB: Product): boolean => {
  return isConflict(pA, pB) || isConflict(pB, pA);
};

// Helper to check if source product excludes target product
export const isConflict = (source: Product, target: Product): boolean => {
  if (!source.excludes || source.excludes.length === 0) return false;

  return source.excludes.some(exclusion => {
    // 1. Direct Name Match
    if (exclusion === target.name) return true;
    
    // 2. Tag/Category Match (e.g. source excludes "Direct Acids", target has tag "Direct Acids")
    if (target.tags && target.tags.includes(exclusion)) return true;

    // 3. Partial Name Match (Conservative check)
    return false;
  });
};

// Helper to get the term that caused the conflict for better messages
const getConflictTerm = (source: Product, target: Product): string => {
   const match = source.excludes.find(exclusion => 
     exclusion === target.name || (target.tags && target.tags.includes(exclusion))
   );
   return match || "conflicting ingredients";
};