export interface Product {
  id: string;
  name: string;
  price: number;
  originalImage: string;
  generatedImages: string[];
  description: string;
  features: string[];
}

export interface StoreData {
  mode: 'ai' | 'manual'; // New property
  name: string;
  prompt: string;
  slogan: string;
  themeColor: string;
  logo: string;
  banner: string;
  aboutUs: string;
  products: Product[];
  ownerEmail: string;
  ownerPhone?: string;
  password?: string;
}

export enum GenerationStep {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  TEXT_GEN = 'TEXT_GEN',
  ASSETS_GEN = 'ASSETS_GEN',
  IMAGE_VAR = 'IMAGE_VAR',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}