import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentIntro from '../components/AssessmentIntro';
import AssessmentStepper from '../components/AssessmentStepper';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';
import { transformAndScore } from '../services/assessmentService';

interface Question {
  id: string;
  category: string;
  stepName: string;
  text: string;
  options: {
    text: string;
    score: number;
  }[];
}

const QUESTIONS: Question[] = [
  // Step 1: Team Info
  {
    id: 'founder_absence',
    category: 'Founder Dependence',
    stepName: 'Team Info',
    text: 'If you (the founder) took a 30-day vacation today with zero contact, what would happen?',
    options: [
      { text: 'Complete standstill / major crisis', score: 10 },
      { text: 'Severe disruption in sales and delivery', score: 40 },
      { text: 'Growth stops but current clients are served', score: 70 },
      { text: 'Business continues to run and grow normally', score: 100 },
    ],
  },
  {
    id: 'decision_making',
    category: 'Founder Dependence',
    stepName: 'Team Info',
    text: 'What percentage of company decisions currently require your final approval?',
    options: [
      { text: 'Over 90%', score: 10 },
      { text: '50% - 90%', score: 40 },
      { text: '10% - 50%', score: 70 },
      { text: 'Less than 10%', score: 100 },
    ],
  },
  // Step 2: Roles
  {
    id: 'key_person_replacement',
    category: 'Key-Person Risk',
    stepName: 'Roles',
    text: 'If your most "essential" employee left tomorrow, how long would it take to fully replace their output?',
    options: [
      { text: '6+ months / Impossible to replace', score: 10 },
      { text: '3 - 6 months', score: 40 },
      { text: '1 - 3 months', score: 70 },
      { text: 'Less than 30 days', score: 100 },
    ],
  },
  {
    id: 'successor_training',
    category: 'Key-Person Risk',
    stepName: 'Roles',
    text: 'How many roles in your company have a "successor" identified and partially trained?',
    options: [
      { text: 'None', score: 10 },
      { text: 'Only 1 or 2 critical roles', score: 40 },
      { text: 'Most key roles', score: 70 },
      { text: 'Every role has a redundancy plan', score: 100 },
    ],
  },
  // Step 3: Process
  {
    id: 'documentation_maturity',
    category: 'Documentation & Systems',
    stepName: 'Process',
    text: 'What percentage of your core business processes are documented in a way a new hire could follow?',
    options: [
      { text: 'Less than 20%', score: 10 },
      { text: '20% - 50%', score: 40 },
      { text: '50% - 80%', score: 70 },
      { text: 'Over 80%', score: 100 },
    ],
  },
  {
    id: 'mistake_response',
    category: 'Documentation & Systems',
    stepName: 'Process',
    text: 'When a mistake happens, is the primary response usually "training the person" or "fixing the process"?',
    options: [
      { text: 'Always training/blaming the person', score: 10 },
      { text: 'Mostly training the person', score: 40 },
      { text: 'Mostly fixing the process', score: 70 },
      { text: 'Always fixing the system/process', score: 100 },
    ],
  },
  {
    id: 'onboarding_speed',
    category: 'Training & Onboarding',
    stepName: 'Process',
    text: 'How long does it take for a new hire in a core role to become 80% as productive as a veteran?',
    options: [
      { text: 'More than 6 months', score: 10 },
      { text: '3 - 6 months', score: 40 },
      { text: '1 - 3 months', score: 70 },
      { text: 'Less than 30 days', score: 100 },
    ],
  },
];

const STEPS = ['Team Info', 'Roles', 'Process', 'Results'];

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'intro' | 'questions' | 'loading'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentStepIndex = STEPS.indexOf(currentQuestion.stepName);
  
  const handleStart = () => setView('questions');

  const handleSelectOption = (score: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: score });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setView('loading');
      try {
        const results = await transformAndScore(answers, "My Company");
        navigate('/results', { state: { results } });
      } catch (error) {
        console.error("Failed to score assessment:", error);
        // Fallback to local calculation if API fails during dev/test
        const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
        const avgScore = Math.round(totalScore / QUESTIONS.length);
        navigate('/results', { state: { results: { score: avgScore } } });
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (view === 'intro') return <AssessmentIntro onStart={handleStart} />;

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-brand-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-bold text-brand-black tracking-tightest mb-2">Analyzing Your Organizational Intelligence...</h2>
        <p className="text-brand-gray-400">Benchmarking your dependencies against industry standards.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-100/30 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <Logo size="sm" />
          <div className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest">
            Diagnostic in progress
          </div>
        </div>

        <AssessmentStepper currentStep={currentStepIndex} steps={STEPS} />

        <Card padding="lg" className="shadow-xl border-brand-charcoal-800/5 mt-12 bg-brand-white">
          <div className="mb-8">
            <span className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.2em] mb-3 block">
              {currentQuestion.category}
            </span>
            <h1 className="text-2xl font-bold text-brand-black tracking-tightest leading-tight">
              {currentQuestion.text}
            </h1>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === option.score;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option.score)}
                  className={`
                    w-full text-left p-5 rounded-brand border transition-all duration-200
                    ${isSelected 
                      ? 'bg-brand-blue/5 border-brand-blue ring-1 ring-brand-blue' 
                      : 'bg-brand-white border-brand-charcoal-800/10 hover:border-brand-charcoal-800/30'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-6 h-6 rounded-full border mr-4 flex items-center justify-center transition-all
                      ${isSelected ? 'border-brand-blue bg-brand-blue' : 'border-brand-charcoal-800/20'}
                    `}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-brand-white rounded-full shadow-sm"></div>}
                    </div>
                    <span className={`text-base font-medium ${isSelected ? 'text-brand-black' : 'text-brand-black/70'}`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex justify-between items-center border-t border-brand-charcoal-800/5 pt-8">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className={currentQuestionIndex === 0 ? 'invisible' : ''}
            >
              Back
            </Button>
            <div className="flex items-center space-x-4">
               <span className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest">
                Question {currentQuestionIndex + 1} of {QUESTIONS.length}
              </span>
              <Button 
                disabled={answers[currentQuestion.id] === undefined}
                onClick={handleNext}
                className="px-12 py-3"
              >
                {currentQuestionIndex === QUESTIONS.length - 1 ? 'See Results' : 'Next Step'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;
