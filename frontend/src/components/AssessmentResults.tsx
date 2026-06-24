import React from 'react';
import { 
  AlertCircle, 
  ArrowRight, 
  Download, 
  Share2, 
  TrendingDown, 
  Users,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import Button from './Button';
import Card from './Card';
import ScoreIndicator from './ScoreIndicator';
import Logo from './Logo';

interface ResultsProps {
  score?: number;
  companyName?: string;
}

const AssessmentResults: React.FC<ResultsProps> = ({ 
  score = 64, 
  companyName = 'Acme Digital Services' 
}) => {
  const getScoreStatus = (val: number) => {
    if (val <= 40) return { label: 'High Risk', color: 'text-brand-critical', bg: 'bg-brand-critical/10' };
    if (val <= 70) return { label: 'Moderate Risk', color: 'text-brand-warning', bg: 'bg-brand-warning/10' };
    return { label: 'Healthy', color: 'text-brand-success', bg: 'bg-brand-success/10' };
  };

  const status = getScoreStatus(score);

  const roleDependencies = [
    { role: 'Founder', risk: 'Critical', score: 85, color: '#EF4444' },
    { role: 'Lead Developer', risk: 'High', score: 72, color: '#EF4444' },
    { role: 'Ops Manager', risk: 'Moderate', score: 45, color: '#F59E0B' },
    { role: 'Sales Lead', risk: 'Moderate', score: 38, color: '#F59E0B' },
    { role: 'Cust Support', risk: 'Low', score: 15, color: '#10B981' },
  ];

  const categoryData = [
    { subject: 'Founder Dep.', A: 35, fullMark: 100 },
    { subject: 'Key-Person', A: 42, fullMark: 100 },
    { subject: 'Systems', A: 68, fullMark: 100 },
    { subject: 'Onboarding', A: 55, fullMark: 100 },
    { subject: 'Decision Dist.', A: 30, fullMark: 100 },
    { subject: 'Scalability', A: 48, fullMark: 100 },
  ];

  const breakdownData = [
    { name: 'Founder Absence', score: 20 },
    { name: 'Decision Speed', score: 40 },
    { name: 'Replacement Time', score: 35 },
    { name: 'SOP Coverage', score: 70 },
    { name: 'Successor Training', score: 15 },
  ];

  return (
    <div className="min-h-screen bg-brand-gray-100/30 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <Logo size="sm" className="mb-4" />
            <h1 className="text-3xl font-bold text-brand-black tracking-tightest">Organizational Intelligence Report</h1>
            <p className="text-brand-gray-400 font-medium">{companyName} • Generated June 10, 2026</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline" className="bg-white">
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Top Level Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Score Card */}
          <Card className="lg:col-span-2 bg-brand-black text-brand-white p-8 md:p-10 flex flex-col justify-between overflow-hidden relative" padding="none">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
             <div className="relative z-10">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue-soft mb-2 block font-mono">OI FLAGSHIP METRIC</span>
               <h2 className="text-4xl md:text-5xl font-bold tracking-tightest leading-tight mb-6">
                 Your Independence Score is <span className={status.color}>{score}</span>
               </h2>
               <div className="flex flex-wrap items-center gap-4 mb-8">
                 <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.bg} ${status.color}`}>
                   {status.label}
                 </div>
                 <span className="text-brand-gray-400 text-sm italic">
                   Benchmarked against 850+ digital service businesses
                 </span>
               </div>
               <p className="text-brand-gray-400 max-w-lg leading-relaxed text-sm md:text-base">
                 Your business currently has a <span className="text-brand-white font-semibold">Moderate Dependency Risk</span>. You have basic systems, but growth remains capped by the founder's involvement in daily operations.
               </p>
             </div>

             <div className="mt-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                <ScoreIndicator score={score} size="lg" className="bg-white/5 border border-white/10" />
                <div className="flex-1 w-full space-y-4">
                  <div className="flex justify-between items-end font-mono">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">System Maturity</span>
                    <span className="text-lg font-bold">{score}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue transition-all duration-1000" style={{ width: `${score}%` }} />
                  </div>
                  <p className="text-[10px] text-brand-gray-400 uppercase tracking-tighter">
                    Ready for scale: <span className="text-brand-white">Partially</span> | Documented: <span className="text-brand-white">Moderate</span>
                  </p>
                </div>
             </div>
          </Card>

          {/* Quick Metrics */}
          <div className="space-y-6">
            <Card className="border-brand-charcoal-800/10 shadow-sm relative overflow-hidden" padding="md">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-critical font-mono">Founder Bottleneck</span>
                <TrendingDown className="w-5 h-5 text-brand-critical" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-brand-black tracking-tightest">82%</div>
                <div className="text-xs font-bold text-brand-critical uppercase">+12% vs last month</div>
              </div>
              <p className="text-[11px] text-brand-gray-400 mt-2 leading-relaxed">
                Founder approval is required for <span className="font-bold text-brand-black">82%</span> of workflow paths.
              </p>
              <div className="mt-4 h-1 w-full bg-brand-gray-100 rounded-full">
                <div className="h-full bg-brand-critical" style={{ width: '82%' }} />
              </div>
            </Card>

            <Card className="border-brand-charcoal-800/10 shadow-sm" padding="md">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-warning font-mono">Key Person Risk</span>
                <Users className="w-5 h-5 text-brand-warning" />
              </div>
              <div className="text-4xl font-bold text-brand-black tracking-tightest">03</div>
              <p className="text-[11px] text-brand-gray-400 mt-2 leading-relaxed">
                <span className="font-bold text-brand-black">3 roles</span> would cause total operational stoppage if vacated tomorrow.
              </p>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="h-2 flex-1 bg-brand-warning rounded-sm" />)}
                {[4, 5].map(i => <div key={i} className="h-2 flex-1 bg-brand-gray-100 rounded-sm" />)}
              </div>
            </Card>
          </div>
        </div>

        {/* Visual Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Intelligence Graph (Radar) */}
          <Card className="border-brand-charcoal-800/10 shadow-sm flex flex-col" padding="lg">
            <h3 className="text-lg font-bold text-brand-black mb-1 tracking-tightest">Organizational Intelligence Graph</h3>
            <p className="text-[10px] text-brand-gray-400 mb-8 font-bold uppercase tracking-widest">Multi-dimensional Maturity Analysis</p>
            
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                  />
                  <Radar
                    name="Maturity"
                    dataKey="A"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.15}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #1A1A1A10',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 p-4 bg-brand-blue/5 rounded-brand border border-brand-blue/10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-xs text-brand-gray-400 leading-relaxed font-medium">
                  Your <span className="text-brand-black font-semibold">Systems</span> score is high, but poorly distributed. Process exists, but it's not being leveraged to reduce <span className="text-brand-black font-semibold">Founder Dependence</span>.
                </p>
              </div>
            </div>
          </Card>

          {/* Role Dependency Heatmap */}
          <Card className="border-brand-charcoal-800/10 shadow-sm" padding="lg">
            <h3 className="text-lg font-bold text-brand-black mb-1 tracking-tightest">Role Dependency Heatmap</h3>
            <p className="text-[10px] text-brand-gray-400 mb-8 font-bold uppercase tracking-widest">Fragility per Core Function</p>
            
            <div className="space-y-6">
              {roleDependencies.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-brand-black">{item.role}</span>
                    <span className="font-mono text-[10px] font-bold text-brand-gray-400 uppercase tracking-wider">
                       Risk: {item.score}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-brand-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full transition-all duration-1000 delay-500" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-5 bg-brand-critical/5 border border-brand-critical/10 rounded-brand relative">
              <div className="flex gap-4 items-start relative z-10">
                <AlertCircle className="w-5 h-5 text-brand-critical shrink-0" />
                <div>
                   <h4 className="text-sm font-bold text-brand-critical mb-1">Severe Disruption Risk</h4>
                   <p className="text-xs text-brand-critical/80 leading-relaxed font-medium">
                    If the Founder or Lead Developer left within 30 days, 75% of your service delivery would halt immediately. No successor identified.
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 p-4 opacity-5 rotate-12">
                 <AlertCircle size={80} />
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Bar Chart Breakdowns */}
        <Card className="border-brand-charcoal-800/10 shadow-sm mb-12" padding="lg">
          <h3 className="text-lg font-bold text-brand-black mb-1 tracking-tightest">Metric Detail Breakdown</h3>
          <p className="text-[10px] text-brand-gray-400 mb-10 font-bold uppercase tracking-widest">Question-Level Independence Scoring</p>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={140} 
                  tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #1A1A1A10',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 60 ? '#3B82F6' : entry.score > 30 ? '#F59E0B' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lock / CTA Section */}
        <Card className="bg-brand-blue p-8 md:p-16 text-brand-white text-center shadow-2xl shadow-brand-blue/30 overflow-hidden relative" padding="none">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="grid grid-cols-12 h-full gap-2">
                {[...Array(24)].map((_, i) => <div key={i} className="border-r border-white" />)}
             </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20">
               <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tightest leading-[1.1] max-w-2xl">
              Unlock Your Full 90-Day Independence Roadmap.
            </h2>
            <p className="text-brand-white/80 mb-10 max-w-xl mx-auto leading-relaxed text-sm md:text-lg">
              The diagnostic reveals your risk. The **WorkforceOS Intelligence Audit** delivers the execution plan to transform those risks into a sellable asset.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full md:w-auto">
              <Button variant="white" size="lg" className="px-12 py-6 text-lg font-bold shadow-lg">
                Buy The Audit ($15,000) <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <Button variant="ghost" className="text-brand-white hover:bg-white/10 px-12 py-6 text-lg font-bold">
                Book a Strategy Call
              </Button>
            </div>
            <p className="mt-8 text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">
              Money-back guarantee if we don't find 15+ hours/week of founder freedom.
            </p>
          </div>
        </Card>

        {/* Footer info */}
        <p className="text-center text-[10px] text-brand-gray-400 mt-16 uppercase tracking-[0.3em] font-bold mb-8">
          WorkforceOS • Organizational Intelligence Platform • Assessment ID: WF-99231-X
        </p>
      </div>
    </div>
  );
};

export default AssessmentResults;
