import React from 'react';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

const AssessmentStepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-12">
      <div className="flex justify-between items-center relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-brand-charcoal-800/10 z-0" />
        
        {/* Progress Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-blue transition-all duration-500 z-0"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${isActive ? 'bg-brand-blue text-brand-white ring-4 ring-brand-blue/20 scale-110' : ''}
                  ${isCompleted ? 'bg-brand-blue text-brand-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-brand-white border-2 border-brand-charcoal-800/20 text-brand-gray-400' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span 
                className={`
                  absolute -bottom-6 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap transition-colors duration-300
                  ${isActive ? 'text-brand-black' : 'text-brand-gray-400'}
                `}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentStepper;
