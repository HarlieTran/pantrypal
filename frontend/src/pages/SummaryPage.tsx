import React, { useEffect, useState } from 'react';
import { getSummary } from '../services/api';
import { CookingProfile } from '../types/onboarding';
import { Page, AppSession } from '../App';
import Button from '../components/Button';
import Alert from '../components/Alert';

interface SummaryPageProps {
  onNavigate: (page: Page) => void;
  session: AppSession;
}

const SummaryPage: React.FC<SummaryPageProps> = ({ onNavigate, session }) => {
  const [profile, setProfile] = useState<CookingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getSummary(session.userId, session.sessionId);
        setProfile(res.cookingProfile);
      } catch (err: any) {
        setError(err.message || 'Failed to generate your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [session.userId, session.sessionId]);

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div className='page'>
        <div className='page-content' style={styles.centered}>
          <span style={styles.loadingEmoji}>🍳</span>
          <h2 style={styles.loadingTitle}>
            Building your cooking profile...
          </h2>
          <p style={styles.loadingSubtitle}>
            Our AI is analyzing your answers
          </p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────
  if (error) {
    return (
      <div className='page'>
        <div className='page-content' style={styles.centered}>
          <Alert type='error' message={error} />
          <div style={{ marginTop: '24px' }}>
            <Button
              label='← Try Again'
              onClick={() => onNavigate('questions')}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────
  const skillEmoji: Record<string, string> = {
    beginner: '🌱',
    intermediate: '👨‍🍳',
    advanced: '⭐'
  };

  const freqEmoji: Record<string, string> = {
    rarely: '🌙',
    sometimes: '☀️',
    often: '🔥',
    daily: '⚡'
  };

  // ── Summary Page ─────────────────────────────────────
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

        {/* Header */}
        <div className='animate-fadeUp' style={styles.header}>
          <span style={styles.congrats}>✨ Profile Complete</span>
          <h1 style={styles.title}>
            Your Cooking<br />
            <span style={{ color: 'var(--color-gold)' }}>Profile</span>
          </h1>
          <p style={styles.subtitle}>
            Welcome,{' '}
            <strong style={{ color: 'var(--color-gold)' }}>
              {session.username}
            </strong>
            . Here's what we learned about you.
          </p>
        </div>

        {/* Summary quote */}
        <div style={styles.summaryCard}>
          <p style={styles.summaryText}>
            "{profile?.summary}"
          </p>
        </div>

        {/* Stats grid */}
        <div style={styles.statsGrid}>
          {[
            {
              emoji: skillEmoji[profile?.cookingSkill ?? ''] ?? '👨‍🍳',
              label: 'Cooking Skill',
              value: profile?.cookingSkill ?? '',
              capitalize: true
            },
            {
              emoji: '👥',
              label: 'Cooking For',
              value: `${profile?.servingSize} ${Number(profile?.servingSize) === 1 ? 'person' : 'people'}`,
            },
            {
              emoji: '⏱️',
              label: 'Available Time',
              value: profile?.availableTime ?? '',
            },
            {
              emoji: freqEmoji[profile?.cookingFrequency ?? ''] ?? '🔥',
              label: 'Cooks',
              value: profile?.cookingFrequency ?? '',
              capitalize: true
            },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <span style={styles.statEmoji}>{stat.emoji}</span>
              <span style={styles.statLabel}>{stat.label}</span>
              <span style={{
                ...styles.statValue,
                textTransform: stat.capitalize ? 'capitalize' : 'none'
              }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={styles.tagsSection}>
          {[
            {
              label: 'Cuisine Preferences',
              items: profile?.cuisinePreferences ?? [],
              color: 'var(--color-gold)'
            },
            {
              label: 'Flavor Profile',
              items: profile?.flavorProfile ?? [],
              color: '#7ec8a9'
            },
            {
              label: 'Dietary Restrictions',
              items: profile?.dietaryRestrictions ?? [],
              color: '#a97ec8'
            },
          ].map((section, i) => (
            <div key={i} style={styles.tagGroup}>
              <span style={styles.tagLabel}>{section.label}</span>
              <div style={styles.tags}>
                {section.items.length > 0
                  ? section.items.map((item, j) => (
                    <span
                      key={j}
                      style={{
                        ...styles.tag,
                        borderColor: section.color,
                        color: section.color
                      }}
                    >
                      {item}
                    </span>
                  ))
                  : (
                    <span style={{
                      ...styles.tag,
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-faint)'
                    }}>
                      None specified
                    </span>
                  )
                }
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={styles.cta}>
          <Button
            label='Go to Dashboard →'
            onClick={() => onNavigate('landing')}
          />
          <Button
            label='Redo Onboarding'
            variant='secondary'
            onClick={() => onNavigate('preferences')}
          />
        </div>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
    textAlign: 'center',
    padding: '40px',
  },
  loadingEmoji: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '8px',
    animation: 'pulse 1.5s ease infinite',
  },
  loadingTitle: {
    fontSize: '24px',
    fontFamily: 'var(--font-display)',
    color: 'var(--color-text)',
    margin: 0,
  },
  loadingSubtitle: {
    fontSize: '14px',
    color: 'var(--color-text-faint)',
    margin: 0,
    fontWeight: '300',
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  header: {
    marginBottom: '40px',
  },
  congrats: {
    display: 'block',
    fontSize: '11px',
    color: 'var(--color-gold)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
    marginBottom: '16px',
  },
  title: {
    fontSize: 'clamp(40px, 6vw, 64px)',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    color: 'var(--color-text)',
    lineHeight: '1.0',
    letterSpacing: '-0.02em',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--color-text-muted)',
    fontWeight: '300',
    lineHeight: '1.6',
    margin: 0,
  },
  summaryCard: {
    backgroundColor: 'var(--color-surface)',
    borderLeft: '3px solid var(--color-gold)',
    border: '1px solid var(--color-border)',
    padding: '28px 32px',
    marginBottom: '32px',
    borderRadius: '2px',
  },
  summaryText: {
    fontSize: '16px',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
    fontFamily: 'var(--font-display)',
    lineHeight: '1.7',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'center',
  },
  statEmoji: { fontSize: '24px' },
  statLabel: {
    fontSize: '10px',
    color: 'var(--color-text-faint)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
  },
  statValue: {
    fontSize: '13px',
    color: 'var(--color-text)',
    fontWeight: '600',
    fontFamily: 'var(--font-body)',
  },
  tagsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '40px',
  },
  tagGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  tagLabel: {
    fontSize: '11px',
    color: 'var(--color-text-faint)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    border: '1px solid',
    padding: '5px 14px',
    fontSize: '12px',
    letterSpacing: '0.05em',
    textTransform: 'capitalize',
    fontFamily: 'var(--font-body)',
    borderRadius: '2px',
  },
  cta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
};

export default SummaryPage;