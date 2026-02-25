import React, { useState } from 'react';
import { submitAnswers, logEvent } from '../services/api';
import { Answer } from '../types/onboarding';
import { Page, AppSession } from '../App';
import QuestionCard from '../components/QuestionCard';
import Button from '../components/Button';
import Alert from '../components/Alert';

interface QuestionsPageProps {
  onNavigate: (page: Page) => void;
  session: AppSession;
  updateSession: (data: Partial<AppSession>) => void;
}

const QuestionsPage: React.FC<QuestionsPageProps> = ({
  onNavigate,
  session,
  updateSession
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const questions = session.questions;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers.find(
    a => a.questionId === currentQuestion?.questionId
  );
  const isLastQuestion = currentIndex === questions.length - 1;
  const allAnswered = questions.every(
    q => answers.find(a => a.questionId === q.questionId)
  );

  const handleAnswer = (answer: Answer) => {
    setAnswers(prev => {
      const existing = prev.findIndex(
        a => a.questionId === answer.questionId
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = answer;
        return updated;
      }
      return [...prev, answer];
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    setError('');
    setLoading(true);

    try {
      // Build habit background from preferences
      const { dietaryPreferences, allergies, healthGoals } = session.preferences;
      const habitBackground = `Diet: ${dietaryPreferences}. Allergies: ${allergies || 'none'}. Goals: ${healthGoals}.`;

      // Submit answers
      await submitAnswers(
        session.userId,
        session.sessionId,
        questions,
        answers,
        habitBackground
      );

      // Log onboarding complete event
      await logEvent({
        eventType: 'OnboardingComplete',
        userId: session.userId,
        metadata: {
          sessionId: session.sessionId,
          questionCount: questions.length
        }
      });

      onNavigate('summary');

    } catch (err: any) {
      setError(err.message || 'Failed to save answers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Guard — no questions loaded
  if (!questions || questions.length === 0) {
    return (
      <div className='page'>
        <div className='page-content' style={styles.container}>
          <Alert type='error' message='No questions found. Please go back and try again.' />
          <div style={{ marginTop: '24px' }}>
            <Button
              label='← Go Back'
              variant='secondary'
              onClick={() => onNavigate('preferences')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='page'>

      {/* Background */}
      <div
        className='page-bg'
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1200&q=80)'
        }}
      />

      <div className='page-content' style={styles.container}>

        {/* Step indicator */}
        <div style={styles.stepRow}>
          <span style={styles.step}>Step 2 of 2</span>
          <button
            style={styles.backBtn}
            onClick={() => onNavigate('preferences')}
          >
            ← Back to Preferences
          </button>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          currentIndex={currentIndex}
          totalCount={questions.length}
          existingAnswer={currentAnswer?.answer}
          onAnswer={answer => {
            handleAnswer(answer);
            // Auto advance to next question after short delay
            if (currentIndex < questions.length - 1) {
              setTimeout(() => setCurrentIndex(prev => prev + 1), 400);
            }
          }}
        />

        {/* Error */}
        {error && (
          <div style={{ marginTop: '24px' }}>
            <Alert type='error' message={error} />
          </div>
        )}

        {/* Navigation */}
        <div style={styles.navRow}>

          {/* Previous */}
          <Button
            label='← Previous'
            variant='secondary'
            onClick={handlePrev}
            disabled={currentIndex === 0}
          />

          {/* Next or Finish */}
          {isLastQuestion ? (
            <Button
              label={loading ? 'Saving...' : 'See My Cooking Profile →'}
              onClick={handleFinish}
              loading={loading}
              disabled={!allAnswered}
            />
          ) : (
            <Button
              label='Next →'
              onClick={handleNext}
              disabled={!currentAnswer}
            />
          )}

        </div>

        {/* Answer progress summary */}
        <div style={styles.dotRow}>
          {questions.map((q, i) => {
            const answered = !!answers.find(a => a.questionId === q.questionId);
            const isCurrent = i === currentIndex;
            return (
              <button
                key={q.questionId}
                onClick={() => setCurrentIndex(i)}
                style={{
                  ...styles.dot,
                  backgroundColor: isCurrent
                    ? 'var(--color-gold)'
                    : answered
                      ? 'rgba(200,169,126,0.4)'
                      : 'var(--color-border)',
                }}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '560px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  stepRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '48px',
  },
  step: {
    fontSize: '11px',
    color: 'var(--color-gold)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-faint)',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.05em',
    padding: 0,
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '40px',
    gap: '12px',
  },
  dotRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '32px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'background-color 0.2s ease',
  },
};

export default QuestionsPage;