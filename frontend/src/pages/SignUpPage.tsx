import React, { useState } from 'react';
import { signUp } from '../services/api';
import { validateSignUp } from '../utils/validation';
import { Page, AppSession } from '../App';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

interface SignUpPageProps {
  onNavigate: (page: Page) => void;
  updateSession: (data: Partial<AppSession>) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate, updateSession }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    // Client side validation
    const validation = validateSignUp(username, email, password, confirmPassword);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    try {
      const res = await signUp(username, email, password);

      // Save userId and username to global session
      updateSession({ userId: res.userId, username });

      // Navigate to preferences
      onNavigate('preferences');

    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
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
          backgroundImage: 'url(https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80)'
        }}
      />

      <div className='page-content' style={styles.container}>

        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <button style={styles.backBtn} onClick={() => onNavigate('landing')}>
            ← Back
          </button>

          <div style={styles.leftBody}>
            <span style={{ fontSize: '40px' }}>🌿</span>
            <h1 style={styles.leftTitle}>
              Your kitchen,<br />reimagined.
            </h1>
            <p style={styles.leftSubtitle}>
              Join PantryPal and let AI help you cook smarter
              with what you already have.
            </p>
          </div>

          <div style={styles.testimonial}>
            <p style={styles.testimonialText}>
              "PantryPal changed how I think about cooking entirely."
            </p>
            <span style={styles.testimonialAuthor}>— Early User</span>
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <div style={styles.formCard}>

            <h2 style={styles.formTitle}>Create Account</h2>
            <p style={styles.formSubtitle}>
              Start your personalized cooking journey
            </p>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: '24px' }}>
                <Alert type='error' message={error} />
              </div>
            )}

            {/* Fields */}
            <div style={styles.fields}>
              <Input
                label='Username'
                value={username}
                onChange={setUsername}
                placeholder='pantry_chef'
              />
              <Input
                label='Email Address'
                value={email}
                onChange={setEmail}
                type='email'
                placeholder='you@example.com'
              />
              <Input
                label='Password'
                value={password}
                onChange={setPassword}
                type='password'
                placeholder='••••••••'
                hint='Must be at least 8 characters'
              />
              <Input
                label='Confirm Password'
                value={confirmPassword}
                onChange={setConfirmPassword}
                type='password'
                placeholder='••••••••'
              />
            </div>

            {/* Submit */}
            <div style={{ marginTop: '32px' }}>
              <Button
                label='Create Account →'
                onClick={handleSubmit}
                loading={loading}
                fullWidth
              />
            </div>

            {/* Back to landing */}
            <p style={styles.backText}>
              Already have an account?{' '}
              <span
                style={styles.backLink}
                onClick={() => onNavigate('landing')}
              >
                Go back
              </span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  leftPanel: {
    flex: 1,
    padding: '40px 60px',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-faint)',
    fontSize: '13px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-body)',
    padding: 0,
    alignSelf: 'flex-start',
  },
  leftBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  leftTitle: {
    fontSize: 'clamp(32px, 4vw, 52px)',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    color: 'var(--color-text)',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  leftSubtitle: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.7',
    fontWeight: '300',
    maxWidth: '340px',
  },
  testimonial: {
    borderLeft: '2px solid var(--color-gold)',
    paddingLeft: '20px',
  },
  testimonialText: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
    marginBottom: '8px',
    lineHeight: '1.6',
  },
  testimonialAuthor: {
    fontSize: '11px',
    color: 'var(--color-gold)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  formCard: {
    width: '100%',
    maxWidth: '400px',
  },
  formTitle: {
    fontSize: '32px',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '8px',
    letterSpacing: '-0.01em',
  },
  formSubtitle: {
    fontSize: '14px',
    color: 'var(--color-text-faint)',
    marginBottom: '32px',
    fontWeight: '300',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  backText: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--color-text-faint)',
    marginTop: '20px',
  },
  backLink: {
    color: 'var(--color-gold)',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default SignUpPage;