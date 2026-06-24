import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * WorkforceOS Logo Component
 * 
 * Clean wordmark with a stylized 'O' representing organizational intelligence.
 */
const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true, 
  showSlogan = false, 
  size = 'md' 
}) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  const sloganSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Icon: Abstract 'W' and 'O' network */}
      <svg 
        className={`${sizes[size]} w-auto text-brand-black`} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="8" fill="currentColor" />
        <path 
          d="M10 12L15 28L20 18L25 28L30 12" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <circle cx="20" cy="22" r="4" stroke="#3B82F6" strokeWidth="2" />
      </svg>
      
      <div className="flex flex-col">
        {showText && (
          <span className={`${textSizes[size]} font-bold tracking-tightest text-brand-black leading-none`}>
            Workforce<span className="text-brand-blue">OS</span>
          </span>
        )}
        {showSlogan && (
          <span className={`${sloganSizes[size]} font-medium text-brand-gray-400 mt-0.5 uppercase tracking-[0.1em] leading-none`}>
            Build a business that survives people
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
