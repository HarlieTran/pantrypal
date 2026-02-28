import {
  HealthResponse,
  SignUpResponse,
  QuestionsResponse,
  AnswerResponse,
  EventResponse,
  SummaryResponse
} from '../types/api';

import {
  UserPreferences,
  Answer,
  QAPair,
  OnboardingEvent
} from '../types/onboarding';

import { Question } from '../types/api';

// ── Base URL ───────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_ONBOARDING_API_URL;


// ── HTTP Client ────────────────────────────────────────
const http = async <T>(
  method: string,
  path: string,
  body?: object
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data as T;
};

// ── API Calls ──────────────────────────────────────────

// GET /health
export const getHealth = (): Promise<HealthResponse> =>
  http<HealthResponse>('GET', '/health');

// POST /signup
export const signUp = (
  username: string,
  email: string,
  password: string
): Promise<SignUpResponse> =>
  http<SignUpResponse>('POST', '/signup', { username, email, password });

// POST /questions
export const getQuestions = (
  userId: string,
  preferences: UserPreferences
): Promise<QuestionsResponse> =>
  http<QuestionsResponse>('POST', '/questions', {
    userId,
    dietaryPreferences: preferences.dietaryPreferences,
    allergies: preferences.allergies,
    healthGoals: preferences.healthGoals
  });

// POST /answer
export const submitAnswers = (
  userId: string,
  sessionId: string,
  questions: Question[],
  answers: Answer[],
  habitBackground: string
): Promise<AnswerResponse> => {
  const qaPairs: QAPair[] = questions.map(q => {
    const answer = answers.find(a => a.questionId === q.questionId);
    return {
      questionId: q.questionId,
      question: q.question,
      mandatory: q.mandatory,
      type: q.type,
      options: q.options,
      answer: answer?.answer ?? 'No answer provided'
    };
  });

  return http<AnswerResponse>('POST', '/answer', {
    userId,
    sessionId,
    questions,
    answers,
    qaPairs,
    habitBackground
  });
};

// POST /event
export const logEvent = (
  event: OnboardingEvent
): Promise<EventResponse> =>
  http<EventResponse>('POST', '/event', event);

// POST /summary
export const getSummary = (
  userId: string,
  sessionId: string
): Promise<SummaryResponse> =>
  http<SummaryResponse>('POST', '/summary', { userId, sessionId });
