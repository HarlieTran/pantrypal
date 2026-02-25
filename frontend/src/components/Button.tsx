import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button'
}) => {

  const base: React.CSSProperties = {
    padding: '14px 32px',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
    borderRadius: '2px',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.4 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'filter 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-gold)',
      color: '#0a0a0a',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-muted)',
      border: '1px solid var(--color-border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-faint)',
      border: 'none',
      padding: '8px 0',
      letterSpacing: '0.05em',
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant] }}
    >
      {loading ? (
        <>
          <span style={{ animation: 'pulse 1.5s ease infinite' }}>●</span>
          Loading...
        </>
      ) : label}
    </button>
  );
};

export default Button;