import type { Question, CookingProfile } from './api';

export interface UserPreferences {
  dietaryPreferences: string;
  allergies: string;
  healthGoals: string;
}

export interface Answer {
  questionId: string;
  answer: string;
}

export interface QAPair {
  questionId: string;
  question: string;
  mandatory: boolean;
  type: string;
  options: string[];
  answer: string;
}

export interface OnboardingSession {
  userId: string;
  sessionId: string;
  username: string;
  preferences: UserPreferences;
  questions: Question[];
  answers: Answer[];
}

export interface OnboardingEvent {
  eventType: 'UserSignedUp' | 'OnboardingStarted' | 'OnboardingComplete';
  userId: string;
  metadata?: Record<string, unknown>;
}

export type { CookingProfile };
