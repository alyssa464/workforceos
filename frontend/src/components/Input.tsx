import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * WorkforceOS Input Component
 * 
 * Minimalist input styling.
 */
const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-brand-black uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`
          w-full 
          bg-brand-white 
          border border-brand-charcoal-800/20 
          rounded-brand 
          px-4 py-2 
          text-sm 
          placeholder:text-brand-gray-400/50
          focus:outline-none 
          focus:ring-2 
          focus:ring-brand-blue/20 
          focus:border-brand-blue 
          transition-all
          ${error ? 'border-brand-critical ring-brand-critical/20' : ''}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-brand-critical font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
