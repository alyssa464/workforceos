import React, { useEffect, useState } from 'react';
import { BarChart3, Users, FileText, AlertCircle, TrendingUp, Loader2, ChevronRight, Activity, ShieldCheck } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import ScoreIndicator from '../components/ScoreIndicator';
import { api } from '../services/api';

const Dashboard = () => {
  const [latestAssessment, setLatestAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await api.get('/assessments');
        if (response.data && response.data.length > 0) {
          const detailed = await api.get(`/assessment/${response.data[0].id}`);
          setLatestAssessment(detailed.data.results);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-white">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const oiScore = latestAssessment?.independence_score || 64;

  const secondaryStats = [
    { 
      label: 'Founder Bottleneck', 
      value: latestAssessment?.bottleneck_index || 42, 
      sub: '%', 
      icon: AlertCircle, 
      textColor: 'text-brand-warning', 
      bgColor: 'bg-brand-warning/10',
      barColor: 'bg-brand-warning',
      description: 'Reliance on founder for daily decisions.'
    },
    { 
      label: 'Operational Valuation', 
      value: latestAssessment?.valuation_score || 72, 
      sub: '/100', 
      icon: FileText, 
      textColor: 'text-brand-blue', 
      bgColor: 'bg-brand-blue/10',
      barColor: 'bg-brand-blue',
      description: 'Documentation and process maturity.'
    },
    { 
      label: 'Critical Dependency', 
      value: latestAssessment?.critical_roles?.length || 3, 
      sub: 'Roles', 
      icon: Users, 
      textColor: 'text-brand-critical', 
      bgColor: 'bg-brand-critical/10',
      barColor: 'bg-brand-critical',
      description: 'Single points of failure in the team.'
    },
  ];

  return (
    <div className="min-h-screen bg-brand-gray-100/30">
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-brand-blue" />
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em]">Workforce Intelligence</span>
            </div>
            <h1 className="text-4xl font-bold text-brand-black tracking-tightest mb-2">Executive Dashboard</h1>
            <p className="text-brand-gray-400 font-medium">Real-time visibility into organizational independence and person-dependency risk.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-brand-white border-brand-charcoal-800/10 shadow-sm">
              Export Audit
            </Button>
            <Button className="shadow-lg shadow-brand-blue/20">
              Run New Diagnostic
            </Button>
          </div>
        </div>

        {/* Intelligence Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Primary Score Indicator */}
          <Card className="lg:col-span-1 bg-brand-black text-brand-white border-none flex flex-col justify-center items-center text-center overflow-hidden relative" padding="lg">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
             <span className="text-[10px] font-bold text-brand-blue-soft uppercase tracking-[0.2em] mb-6 relative z-10">Flagship Metric</span>
             <ScoreIndicator 
               score={oiScore} 
               label="Independence Score" 
               size="lg" 
               className="bg-brand-white/5 border border-white/10 relative z-10" 
             />
             <p className="text-brand-gray-400 text-xs mt-6 px-4 leading-relaxed relative z-10">
               Your company is <span className="text-brand-white font-bold">Moderate Risk</span>. 
               Systemization is required to reach the 80+ benchmark.
             </p>
          </Card>

          {/* Secondary Stats Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryStats.map((stat, i) => (
              <Card key={i} className="group hover:border-brand-blue/30 transition-all duration-300 shadow-sm hover:shadow-md border-brand-charcoal-800/5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.2em] mb-4">{stat.label}</span>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold text-brand-black tracking-tightest">{stat.value}</span>
                      <span className="text-brand-gray-400 font-bold text-xs uppercase tracking-widest">{stat.sub}</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-brand group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-brand-gray-400 font-medium mb-4">{stat.description}</p>
                  <div className="w-full h-1.5 bg-brand-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${stat.barColor}`} 
                      style={{ width: `${Math.min(100, (stat.value / (stat.sub === 'Roles' ? 10 : 100)) * 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Insights Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-sm border-brand-charcoal-800/5" padding="lg">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-brand-black tracking-tightest leading-tight">Independence Growth Trend</h3>
                <p className="text-xs text-brand-gray-400 font-medium mt-1">Comparison of organizational maturity over time.</p>
              </div>
              <Button variant="ghost" size="sm" className="text-brand-blue font-bold group">
                View Reports <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="h-80 bg-brand-gray-100/20 rounded-brand flex flex-col items-center justify-center border border-dashed border-brand-charcoal-800/20">
               <div className="p-5 bg-brand-white rounded-full shadow-md mb-4 border border-brand-charcoal-800/5">
                 <BarChart3 className="w-10 h-10 text-brand-gray-400/60" />
               </div>
               <p className="text-brand-gray-400 font-bold text-sm tracking-tightest max-w-xs text-center px-6">
                 Benchmark trend data will be available after your next operational audit.
               </p>
               <Button variant="outline" size="sm" className="mt-6 border-brand-charcoal-800/10 text-[10px] uppercase tracking-widest font-bold">
                 Schedule Next Audit
               </Button>
            </div>
          </Card>
          
          <Card className="shadow-sm border-brand-charcoal-800/5" padding="lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-blue" />
                <h3 className="text-xl font-bold text-brand-black tracking-tightest leading-tight">Intelligence Log</h3>
              </div>
              <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[9px] font-bold uppercase tracking-widest rounded-full">Live</span>
            </div>
            
            <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-brand-gray-100">
              {[
                { text: 'SOP for "Client Onboarding" updated', time: '2 hours ago', tag: 'SOP', borderColor: 'border-brand-blue', textColor: 'text-brand-blue', bgColor: 'bg-brand-blue/5', tagBorder: 'border-brand-blue/10' },
                { text: 'New assessment completed by Founder', time: '5 hours ago', tag: 'Audit', borderColor: 'border-brand-success', textColor: 'text-brand-success', bgColor: 'bg-brand-success/5', tagBorder: 'border-brand-success/10' },
                { text: 'Bottleneck alert: Sales Approvals', time: 'Yesterday', tag: 'Alert', borderColor: 'border-brand-critical', textColor: 'text-brand-critical', bgColor: 'bg-brand-critical/5', tagBorder: 'border-brand-critical/10' },
                { text: 'Key role identified: Operations Lead', time: '2 days ago', tag: 'Risk', borderColor: 'border-brand-warning', textColor: 'text-brand-warning', bgColor: 'bg-brand-warning/5', tagBorder: 'border-brand-warning/10' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-6 items-start relative">
                  <div className={`w-3.5 h-3.5 bg-brand-white border-2 ${activity.borderColor} rounded-full mt-1.5 shrink-0 z-10 shadow-sm`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-black font-bold tracking-tightest leading-snug mb-2 truncate">{activity.text}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-bold ${activity.textColor} uppercase tracking-widest ${activity.bgColor} px-2 py-0.5 rounded border ${activity.tagBorder}`}>
                        {activity.tag}
                      </span>
                      <p className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-widest">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-10 text-[10px] font-bold uppercase tracking-[0.25em] border border-brand-charcoal-800/10 hover:bg-brand-gray-100/50 py-3">
              View All Intelligence
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
