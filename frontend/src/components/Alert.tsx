import React from 'react';

interface AlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  if (!message) return null;

  const styles: Record<string, React.CSSProperties> = {
    error: {
      backgroundColor: 'var(--color-error-bg)',
      border: '1px solid var(--color-error-border)',
      color: 'var(--color-error)',
    },
    success: {
      backgroundColor: 'rgba(74, 222, 128, 0.10)',
      border: '1px solid rgba(74, 222, 128, 0.30)',
      color: 'var(--color-success)',
    },
    info: {
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text-muted)',
    }
  };

  const icons: Record<string, string> = {
    error: '⚠',
    success: '✓',
    info: 'ℹ'
  };

  return (
    <div style={{
      ...styles[type],
      padding: '12px 16px',
      borderRadius: '2px',
      fontSize: '13px',
      lineHeight: '1.5',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      fontFamily: 'var(--font-body)',
    }}>
      <span style={{ flexShrink: 0, fontWeight: '700' }}>
        {icons[type]}
      </span>
      <span>{message}</span>
    </div>
  );
};

export default Alert;