import React from 'react';

/**
 * WorkforceOS Card Component
 * 
 * Standard container for content modules.
 */
const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`
      bg-brand-white 
      border border-brand-charcoal-800/10 
      rounded-brand 
      ${paddings[padding]} 
      ${hover ? 'hover:border-brand-charcoal-800/30 transition-colors duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    <h3 className="text-lg font-semibold text-brand-black tracking-tightest leading-tight">
      {title}
    </h3>
    {subtitle && (
      <p className="text-sm text-brand-gray-400 mt-1">
        {subtitle}
      </p>
    )}
  </div>
);

export default Card;
