export interface HealthResponse {
  applicationName: string;
  studentName: string;
  studentId: string;
  environment: string;
  lambdaMemorySize: string;
  timestamp: string;
  status: string;
}

export interface SignUpResponse {
  message: string;
  userId: string;
}

export interface QuestionsResponse {
  sessionId: string;
  questions: Question[];
}

export interface AnswerResponse {
  message: string;
}

export interface EventResponse {
  message: string;
}

export interface SummaryResponse {
  userId: string;
  sessionId: string;
  cookingProfile: CookingProfile;
}

export interface Question {
  questionId: string;
  question: string;
  mandatory: boolean;
  type: string;
  options: string[];
}

export interface CookingProfile {
  cookingSkill: string;
  servingSize: number;
  availableTime: string;
  cuisinePreferences: string[];
  flavorProfile: string[];
  dietaryRestrictions: string[];
  cookingFrequency: string;
  summary: string;
}

export interface ApiError {
  message: string;
}