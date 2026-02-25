import React, { useState } from 'react';
import { Question } from '../types/api';
import { Answer } from '../types/onboarding';
import Button from './Button';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalCount: number;
  existingAnswer?: string;
  onAnswer: (answer: Answer) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalCount,
  existingAnswer,
  onAnswer
}) => {
  const [selected, setSelected] = useState<string>(existingAnswer ?? '');
  const [showCustom, setShowCustom] = useState<boolean>(existingAnswer === 'Other');
  const [customValue, setCustomValue] = useState<string>(
    existingAnswer && !question.options.includes(existingAnswer) ? existingAnswer : ''
  );

  const handleOptionClick = (option: string) => {
    if (option === 'Other') {
      setSelected('Other');
      setShowCustom(true);
      return;
    }
    setSelected(option);
    setShowCustom(false);
    setCustomValue('');
    onAnswer({ questionId: question.questionId, answer: option });
  };

  const handleCustomConfirm = () => {
    if (!customValue.trim()) return;
    setSelected(customValue.trim());
    setShowCustom(false);
    onAnswer({ questionId: question.questionId, answer: customValue.trim() });
  };

  const progress = ((currentIndex + 1) / totalCount) * 100;

  return (
    <div className='animate-fadeUp' style={{ width: '100%', maxWidth: '560px' }}>

      {/* Progress */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <span style={{
            fontSize: '11px',
            color: 'var(--color-gold)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body)'
          }}>
            Question {currentIndex + 1} of {totalCount}
          </span>
          <span style={{
            fontSize: '11px',
            color: 'var(--color-text-faint)',
            fontFamily: 'var(--font-body)'
          }}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '2px',
          backgroundColor: 'var(--color-border)',
          borderRadius: '1px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--color-gold)',
            borderRadius: '1px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Mandatory badge */}
      {question.mandatory && (
        <span style={{
          display: 'inline-block',
          fontSize: '10px',
          color: 'var(--color-gold)',
          border: '1px solid var(--color-gold-border)',
          padding: '3px 10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '16px',
          fontFamily: 'var(--font-body)'
        }}>
          Required
        </span>
      )}

      {/* Question text */}
      <h2 style={{
        fontSize: 'clamp(22px, 3vw, 28px)',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-text)',
        marginBottom: '28px',
        lineHeight: '1.3',
        letterSpacing: '-0.01em'
      }}>
        {question.question}
      </h2>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map(option => {
          const isSelected = selected === option ||
            (option === 'Other' && showCustom);

          return (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              style={{
                backgroundColor: isSelected
                  ? 'var(--color-gold-dim)'
                  : 'var(--color-surface)',
                border: isSelected
                  ? '1px solid var(--color-gold)'
                  : '1px solid var(--color-border)',
                color: isSelected
                  ? 'var(--color-gold)'
                  : 'var(--color-text-muted)',
                padding: '14px 20px',
                fontSize: '14px',
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
                borderRadius: '2px',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{option}</span>
              {isSelected && <span>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Custom input for Other */}
      {showCustom && (
        <div style={{
          marginTop: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1 }}>
            <input
              type='text'
              placeholder='Type your answer...'
              value={customValue}
              autoFocus
              onChange={e => setCustomValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustomConfirm()}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-gold-border)',
                borderRadius: '2px',
                padding: '14px 16px',
                color: 'var(--color-text)',
                fontSize: '15px',
                width: '100%',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>
          <Button
            label='Confirm'
            onClick={handleCustomConfirm}
            disabled={!customValue.trim()}
          />
        </div>
      )}

    </div>
  );
};

export default QuestionCard;
