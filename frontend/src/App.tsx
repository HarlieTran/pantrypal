import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import PreferencesPage from './pages/PreferencesPage';
import QuestionsPage from './pages/QuestionsPage';
import SummaryPage from './pages/SummaryPage';
import type { Question } from './types/api';
import type { UserPreferences } from './types/onboarding';

export type Page = 'landing' | 'signup' | 'preferences' | 'questions' | 'summary';

export interface AppSession {
  userId: string;
  sessionId: string;
  username: string;
  questions: Question[];
  preferences: UserPreferences;
}

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [session, setSession] = useState<AppSession>({
    userId: '',
    sessionId: '',
    username: '',
    questions: [],
    preferences: {
      dietaryPreferences: '',
      allergies: '',
      healthGoals: ''
    }
  });

  const navigate = (p: Page) => setPage(p);

  const updateSession = (data: Partial<AppSession>) => {
    setSession(prev => ({ ...prev, ...data }));
  };

  return (
    <>
      {page === 'landing' && (
        <LandingPage onNavigate={navigate} />
      )}
      {page === 'signup' && (
        <SignUpPage onNavigate={navigate} updateSession={updateSession} />
      )}
      {page === 'preferences' && (
        <PreferencesPage
          onNavigate={navigate}
          session={session}
          updateSession={updateSession}
        />
      )}
      {page === 'questions' && (
        <QuestionsPage onNavigate={navigate} session={session} updateSession={updateSession} />
      )}
      {page === 'summary' && (
        <SummaryPage onNavigate={navigate} session={session} />
      )}
    </>
  );
};

export default App;
