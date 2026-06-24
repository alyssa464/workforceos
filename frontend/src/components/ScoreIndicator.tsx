import React from 'react';

interface ScoreIndicatorProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * WorkforceOS Score Indicator
 * 
 * Displays numerical scores with semantic color mapping.
 * 0-40: Critical
 * 41-70: Warning
 * 71-100: Success
 */
const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ 
  score, 
  label, 
  size = 'md',
  className = '' 
}) => {
  const getSemanticColor = (val: number) => {
    if (val <= 40) return 'text-brand-critical';
    if (val <= 70) return 'text-brand-warning';
    return 'text-brand-success';
  };

  const getBackgroundColor = (val: number) => {
    if (val <= 40) return 'bg-brand-critical/10';
    if (val <= 70) return 'bg-brand-warning/10';
    return 'bg-brand-success/10';
  };

  const colorClass = getSemanticColor(score);
  const bgClass = getBackgroundColor(score);

  const sizes = {
    sm: {
      value: 'text-2xl',
      label: 'text-xs',
      container: 'p-3'
    },
    md: {
      value: 'text-4xl',
      label: 'text-sm',
      container: 'p-6'
    },
    lg: {
      value: 'text-6xl',
      label: 'text-base',
      container: 'p-10'
    }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center rounded-brand ${bgClass} ${currentSize.container} ${className}`}>
      <span className={`${currentSize.value} font-bold tracking-tightest ${colorClass}`}>
        {score}
      </span>
      {label && (
        <span className={`${currentSize.label} font-medium text-brand-black/60 mt-1 uppercase tracking-wider`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default ScoreIndicator;
