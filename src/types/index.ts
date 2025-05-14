
export type Language = 'en' | 'ta';

export interface User {
  id: string;
  email: string;
  name: string; // Changed from optional
  language: Language;
  onboarded: boolean;
  darkMode?: boolean; // Added for theme preference
  dob?: string; // YYYY-MM-DD format
  gender?: 'male' | 'female' | 'other' | 'preferNotToSay';
  favoriteColor?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange' | 'black' | 'white' | 'other_color';
  // Fields from original QuestionnaireAnswers, can be merged or kept separate
  stressSource?: string;
  copingMechanism?: string;
}

export interface QuestionnaireAnswers {
  stressSource?: string;
  copingMechanism?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'preferNotToSay';
  favoriteColor?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange' | 'black' | 'white' | 'other_color';
  // Add more answers as needed
}

export interface BreathingExercise {
  slug: string;
  nameKey: TranslatedStringType; // Key for translation
  descriptionKey: TranslatedStringType; // Key for translation
  durationMinutes: number;
}

export interface MoodLog {
  id: string;
  mood: 'happy' | 'calm' | 'neutral' | 'anxious' | 'sad';
  note?: string;
  timestamp: Date;
}

export interface JournalEntry {
  id:string;
  content: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language: Language;
  escalate?: boolean;
}

// Add TranslatedStringType if it's not globally available or imported elsewhere
// For this example, assuming it's defined or imported from i18n.ts
export type TranslatedStringType = string;

