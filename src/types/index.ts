
export type Language = 'en' | 'ta';

export interface User {
  id: string;
  email: string;
  name?: string;
  language: Language;
  onboarded: boolean;
}

export interface QuestionnaireAnswers {
  stressSource?: string;
  copingMechanism?: string;
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
