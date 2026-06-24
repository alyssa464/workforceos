import React from 'react';

/**
 * WorkforceOS Button Component
 * 
 * Variants: 
 * - primary: Black background (on light) or White background (on dark)
 * - secondary: Charcoal background
 * - outline: Transparent with border
 * - ghost: No background/border
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-brand tracking-tightest focus:outline-none focus:ring-2 focus:ring-brand-blue/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-black text-brand-white hover:bg-brand-charcoal-900 border border-brand-black',
    secondary: 'bg-brand-charcoal-800 text-brand-white hover:bg-brand-charcoal-700 border border-brand-charcoal-800',
    outline: 'bg-transparent text-brand-black border border-brand-charcoal-800 hover:bg-brand-charcoal-800 hover:text-brand-white',
    ghost: 'bg-transparent text-brand-black hover:bg-brand-charcoal-800/10 border border-transparent',
    white: 'bg-brand-white text-brand-black hover:bg-brand-gray-100 border border-brand-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
