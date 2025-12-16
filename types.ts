export type Language = 'ar' | 'fr' | 'en';

export interface LocalizedString {
  ar: string;
  fr: string;
  en: string;
}

export interface Subject {
  id: string;
  name: LocalizedString;
  coefficient: number;
  grade?: number; // Out of 20
  isCustom?: boolean;
}

export interface Stream {
  id: string;
  name: LocalizedString;
  defaultSubjects: Subject[];
}

export interface EducationLevel {
  id: string;
  name: LocalizedString;
  streams: Stream[]; // If only one stream (like CEM), list as 'General' or similar
}

export interface AiAdviceResponse {
  analysis: string;
  tips: string[];
  encouragement: string;
}
