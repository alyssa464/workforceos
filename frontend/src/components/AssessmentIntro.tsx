import React from 'react';
import Button from './Button';
import Card from './Card';
import Logo from './Logo';

interface IntroProps {
  onStart: () => void;
}

const AssessmentIntro: React.FC<IntroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <Logo size="lg" className="mb-12" />
      
      <Card padding="lg" className="max-w-2xl w-full text-center shadow-xl border-brand-charcoal-800/5 bg-brand-white">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            Organizational Intelligence diagnostic
          </span>
          <h1 className="text-4xl font-bold text-brand-black tracking-tightest leading-tight mb-4">
            Is your business <span className="text-brand-blue">System-Dependent</span> or Person-Dependent?
          </h1>
          <p className="text-lg text-brand-gray-400 max-w-lg mx-auto">
            Our 10-minute diagnostic returns your Organizational Independence Score™, identifies critical bottlenecks, and reveals your hidden key-person risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
          {[
            { 
              title: "Scoring", 
              desc: "Get your flagship Organizational Independence Score™ (0-100).",
              icon: "📊"
            },
            { 
              title: "Bottlenecks", 
              desc: "Identify exactly where the founder is the primary barrier to growth.",
              icon: "🛑"
            },
            { 
              title: "Risk Map", 
              desc: "Visualize which roles would cause the most disruption if they left.",
              icon: "🗺️"
            }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-brand bg-brand-gray-100/50 border border-brand-charcoal-800/5">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="text-sm font-bold text-brand-black mb-1">{item.title}</h3>
              <p className="text-xs text-brand-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <Button size="lg" className="w-full md:w-auto px-12 py-4 text-base" onClick={onStart}>
          Start Free Assessment
        </Button>
        
        <p className="mt-6 text-xs text-brand-gray-400 font-medium">
          Used by 7 & 8-figure agencies and service businesses to prepare for scale or sale.
        </p>
      </Card>

      <div className="mt-12 flex items-center space-x-8 grayscale opacity-50">
        <div className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Trusted By Leaders At</div>
        {/* Simple text logos for placeholder */}
        <span className="text-sm font-bold text-brand-black">Linear</span>
        <span className="text-sm font-bold text-brand-black">Rippling</span>
        <span className="text-sm font-bold text-brand-black">Notion</span>
      </div>
    </div>
  );
};

export default AssessmentIntro;
