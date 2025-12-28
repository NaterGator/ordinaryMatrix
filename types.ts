export type { Product } from 'the-ordinary-unofficial-api';

export interface LegacyProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  target?: string;
  format?: string;
  excludes: string[]; // List of conflicts (names or tags)
  tags: string[];     // List of attributes (e.g. "Direct Acids")
}

export enum CompatibilityStatus {
  COMPATIBLE = 'COMPATIBLE',
  CONFLICT = 'CONFLICT',
  CAUTION = 'CAUTION',
  UNKNOWN = 'UNKNOWN'
}

export interface CompatibilityPair {
  productA: string; // Product Name
  productB: string; // Product Name
  status: CompatibilityStatus;
  reason: string;
}

export interface AnalysisResult {
  pairs: CompatibilityPair[];
  summary: string;
}