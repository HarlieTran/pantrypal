import React, { useState } from 'react';
import { getQuestions } from '../services/api';
import { validatePreferences } from '../utils/validation';
import { UserPreferences } from '../types/onboarding';
import { Page, AppSession } from '../App';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

interface PreferencesPageProps {
  onNavigate: (page: Page) => void;
  session: AppSession;
  updateSession: (data: Partial<AppSession>) => void;
}

const PreferencesPage: React.FC<PreferencesPageProps> = ({
  onNavigate,
  session,
  updateSession
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietaryPreferences: '',
    allergies: '',
    healthGoals: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updatePreference = (key: keyof UserPreferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    // Validate
    const validation = validatePreferences(
      preferences.dietaryPreferences,
      preferences.healthGoals
    );
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    try {
      const res = await getQuestions(session.userId, preferences);

      // Save sessionId and questions to global session
      updateSession({
        sessionId: res.sessionId,
        questions: res.questions,
        preferences
      });

      onNavigate('questions');

    } catch (err: any) {
      setError(err.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='page'>

      {/* Background */}
      <div
        className='page-bg'
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80)'
        }}
      />

      <div className='page-content' style={styles.container}>

        {/* Back */}
        <button style={styles.backBtn} onClick={() => onNavigate('signup')}>
          ← Back
        </button>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.step}>Step 1 of 2</span>
          <h1 style={styles.title}>
            Hello, {session.username}! 👋
          </h1>
          <p style={styles.subtitle}>
            Tell us about your dietary preferences so we can
            generate personalized cooking questions just for you.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: '24px' }}>
            <Alert type='error' message={error} />
          </div>
        )}

        {/* Form */}
        <div style={styles.form}>
          <Input
            label='Dietary Preferences'
            value={preferences.dietaryPreferences}
            onChange={val => updatePreference('dietaryPreferences', val)}
            placeholder='e.g. vegetarian, vegan, keto...'
          />
          <Input
            label='Food Allergies'
            value={preferences.allergies}
            onChange={val => updatePreference('allergies', val)}
            placeholder='e.g. nuts, gluten, dairy...'
            hint='Optional — leave blank if none'
          />
          <Input
            label='Health Goals'
            value={preferences.healthGoals}
            onChange={val => updatePreference('healthGoals', val)}
            placeholder='e.g. lose weight, build muscle, eat healthier...'
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ marginBottom: '24px' }}>
            <Alert
              type='info'
              message='Our AI is generating your personalized questions...'
            />
          </div>
        )}

        {/* Submit */}
        <Button
          label={loading ? 'Generating Questions...' : 'Generate My Questions →'}
          onClick={handleSubmit}
          loading={loading}
          fullWidth
        />

        {/* Skip */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Button
            label='Skip and use defaults'
            variant='ghost'
            onClick={() => {
              setPreferences({
                dietaryPreferences: 'no preference',
                allergies: 'none',
                healthGoals: 'eat healthier'
              });
              setTimeout(handleSubmit, 100);
            }}
          />
        </div>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '520px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-faint)',
    fontSize: '13px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-body)',
    padding: '0 0 32px',
    display: 'block',
  },
  header: {
    marginBottom: '40px',
  },
  step: {
    display: 'block',
    fontSize: '11px',
    color: 'var(--color-gold)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
    marginBottom: '12px',
  },
  title: {
    fontSize: 'clamp(28px, 4vw, 40px)',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '12px',
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.7',
    fontWeight: '300',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '32px',
  },
};

export default PreferencesPage;