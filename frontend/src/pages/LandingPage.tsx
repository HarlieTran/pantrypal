import React, { useState } from 'react';
import { getHealth } from '../services/api';
import { HealthResponse } from '../types/api';
import { Page } from '../App';
import Button from '../components/Button';
import Alert from '../components/Alert';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState('');
  const [showRaw, setShowRaw] = useState(false);

  const handleGetStarted = async () => {
    setLoading(true);
    setError('');
    setHealth(null);

    try {
      const data = await getHealth();
      setHealth(data);
    } catch (err: any) {
      setError(err.message || 'Service unavailable. Please try again.');
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
          opacity: 0.5
        }}
      />

      <div className='page-content' style={styles.wrapper}>

        {/* Nav */}
        <nav style={styles.nav}>
          <div style={styles.logo}>
            <span>🌿</span>
            <span style={styles.logoText}>PantryPal</span>
          </div>
        </nav>

        {/* Hero */}
        <main style={styles.hero}>
          <div className='animate-fadeUp'>

            {/* Badge */}
            <div style={styles.badge}>
              AI-Powered Kitchen Assistant
            </div>

            {/* Title */}
            <h1 style={styles.title}>
              Plan Well<br />
              <span style={{ color: 'var(--color-gold)' }}>Eat Well</span>
            </h1>

            {/* Subtitle */}
            <p style={styles.subtitle}>
              Smart pantry management and personalized recipes<br />
              tailored to your unique cooking habits.
            </p>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: '24px', maxWidth: '480px' }}>
                <Alert type='error' message={error} />
              </div>
            )}

            {/* Health Response */}
            {health && (
              <div style={styles.healthCard}>

                {/* Status */}
                <div style={styles.healthStatus}>
                  <span style={styles.statusDot}>●</span>
                  <span style={styles.statusText}>Service Online</span>
                </div>

                {/* Friendly display */}
                <div style={styles.healthGrid}>
                  {[
                    { label: 'Application', value: health.applicationName },
                    { label: 'Student', value: health.studentName },
                    { label: 'Student ID', value: health.studentId },
                    { label: 'Environment', value: health.environment },
                    { label: 'Memory', value: `${health.lambdaMemorySize} MB` },
                    { label: 'Timestamp', value: new Date(health.timestamp).toLocaleString() },
                  ].map((item, i) => (
                    <div key={i} style={styles.healthItem}>
                      <span style={styles.healthLabel}>{item.label}</span>
                      <span style={styles.healthValue}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Raw JSON toggle */}
                <button
                  style={styles.rawToggle}
                  onClick={() => setShowRaw(prev => !prev)}
                >
                  {showRaw ? 'Hide' : 'Show'} Raw JSON ▾
                </button>

                {showRaw && (
                  <pre style={styles.rawJson}>
                    {JSON.stringify(health, null, 2)}
                  </pre>
                )}

                {/* Continue button */}
                <div style={{ marginTop: '24px' }}>
                  <Button
                    label='Continue to Sign Up →'
                    onClick={() => onNavigate('signup')}
                  />
                </div>
              </div>
            )}

            {/* Get Started button — shown before health check */}
            {!health && (
              <Button
                label={loading ? 'Checking Service...' : 'Get Started →'}
                onClick={handleGetStarted}
                loading={loading}
              />
            )}

          </div>
        </main>

        {/* Feature cards */}
        <div style={styles.features}>
          {[
            { icon: '🧠', title: 'AI Onboarding', desc: 'Personalized questions to understand your cooking style' },
            { icon: '🥘', title: 'Smart Recipes', desc: 'Recipes generated from your actual pantry items' },
            { icon: '📦', title: 'Pantry Tracking', desc: 'Manage groceries, spices and ingredients easily' },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <span style={{ fontSize: '28px' }}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 40px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    padding: '24px 0',
    borderBottom: '1px solid var(--color-border)',
    marginBottom: '80px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '22px',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: 'var(--color-text)',
    fontSize: '20px',
  },
  hero: {
    marginBottom: '80px',
  },
  badge: {
    display: 'inline-block',
    border: '1px solid var(--color-gold-border)',
    color: 'var(--color-gold)',
    padding: '6px 16px',
    fontSize: '11px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
    marginBottom: '32px',
  },
  title: {
    fontSize: 'clamp(56px, 8vw, 96px)',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    lineHeight: '1.0',
    color: 'var(--color-text)',
    letterSpacing: '-0.02em',
    marginBottom: '24px',
  },
  subtitle: {
    fontSize: '17px',
    color: 'var(--color-text-muted)',
    marginBottom: '40px',
    fontWeight: '300',
    lineHeight: '1.7',
  },
  healthCard: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderLeft: '3px solid var(--color-gold)',
    padding: '28px 32px',
    marginBottom: '32px',
    maxWidth: '520px',
    borderRadius: '2px',
  },
  healthStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  statusDot: {
    color: 'var(--color-success)',
    fontSize: '12px',
  },
  statusText: {
    fontSize: '13px',
    color: 'var(--color-success)',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
  },
  healthGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '16px',
  },
  healthItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '10px',
  },
  healthLabel: {
    fontSize: '11px',
    color: 'var(--color-text-faint)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
  },
  healthValue: {
    fontSize: '13px',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
  },
  rawToggle: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-faint)',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-body)',
    padding: '0',
    marginBottom: '8px',
  },
  rawJson: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--color-border)',
    padding: '16px',
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    overflowX: 'auto',
    fontFamily: 'monospace',
    lineHeight: '1.6',
    borderRadius: '2px',
    marginBottom: '8px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2px',
    marginBottom: '60px',
  },
  featureCard: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  featureTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.02em',
  },
  featureDesc: {
    fontSize: '13px',
    color: 'var(--color-text-faint)',
    lineHeight: '1.6',
    fontWeight: '300',
  },
};

export default LandingPage;