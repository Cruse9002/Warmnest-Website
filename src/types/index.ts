
export type Language = 'en' | 'ta';

export interface User {
  id: string;
  email: string;
  name: string; 
  language: Language;
  onboarded: boolean;
  darkMode?: boolean; 
  dob?: string; 
  gender?: 'male' | 'female' | 'other' | 'preferNotToSay';
  favoriteColor?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange' | 'black' | 'white' | 'other_color';
  stressSource?: string;
  copingMechanism?: string;
}

export interface QuestionnaireAnswers {
  stressSource?: string;
  copingMechanism?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'preferNotToSay';
  favoriteColor?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange' | 'black' | 'white' | 'other_color';
}

export interface BreathingExercise {
  slug: string;
  nameKey: TranslatedStringType; 
  descriptionKey: TranslatedStringType; 
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

export interface MockJamendoTrack {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  streamUrl: string; // Mock URL
  genre: 'calm' | 'energetic' | 'focus' | 'uplifting' | 'gentle' | 'nature'; // For personalization
  aiHint: string;
}

export type TranslatedStringType = string;
