import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  hint
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

      {/* Label */}
      <label style={{
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        fontWeight: '500',
        fontFamily: 'var(--font-body)',
      }}>
        {label}
      </label>

      {/* Input */}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '2px',
          padding: '14px 16px',
          color: 'var(--color-text)',
          fontSize: '15px',
          width: '100%',
          fontFamily: 'var(--font-body)',
          opacity: disabled ? 0.5 : 1,
        }}
      />

      {/* Hint */}
      {hint && (
        <span style={{
          fontSize: '12px',
          color: 'var(--color-text-faint)',
          fontFamily: 'var(--font-body)',
          fontWeight: '300',
        }}>
          {hint}
        </span>
      )}

    </div>
  );
};

export default Input;