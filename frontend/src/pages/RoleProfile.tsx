import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  FileText, 
  Video, 
  MessageSquare, 
  Zap, 
  Target, 
  Layers,
  ArrowRight,
  Info,
  Clock,
  CheckCircle2,
  BookOpen,
  History,
  Layout,
  Trash2
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import ScoreIndicator from '../components/ScoreIndicator';
import AddKnowledgeModal from '../components/AddKnowledgeModal';
import { getRole, api } from '../services/api';

type TabType = 'overview' | 'knowledge' | 'training' | 'history';

const RoleProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<any>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      const [roleData, knowledgeData] = await Promise.all([
        getRole(id),
        api.get(`/knowledge?role_id=${id}`)
      ]);
      setRole(roleData);
      setKnowledge(knowledgeData.data || knowledgeData);
    } catch (error) {
      console.error("Failed to fetch role data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this intelligence asset?')) return;
    try {
      await api.delete(`/knowledge/${itemId}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete knowledge item:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-6 text-center">
        <h1 className="text-2xl font-bold text-brand-black tracking-tightest">Role not found</h1>
        <Button onClick={() => navigate('/dependency-map')} className="mt-6">
          Back to Dependency Map
        </Button>
      </div>
    );
  }

  const mockDetails = {
    department: role.name.includes('Sales') || role.name.includes('Account') ? 'Sales' : 
                role.name.includes('CSM') ? 'Customer Success' : 
                role.name.includes('Ops') ? 'Operations' : 
                role.name.includes('Founder') || role.name.includes('CEO') ? 'Executive' : 'Product',
    responsibilities: [
      "Strategic planning and resource allocation",
      "Process optimization across departmental boundaries",
      "Key stakeholder management and reporting",
      "Team leadership and performance monitoring"
    ],
    kpis: [
      { label: "Operational Efficiency", target: "90%", current: "78%", trend: 'up' },
      { label: "Role Documentation", target: "100%", current: role.dependency_score < 50 ? "85%" : "45%", trend: 'up' },
      { label: "Decision Latency", target: "< 24h", current: "36h", trend: 'down' }
    ],
    knowledgeCoverage: role.dependency_score < 50 ? 82 : role.dependency_score < 70 ? 55 : 28,
    reportingTo: role.parent_id ? "Direct Supervisor" : "Board of Directors",
    decisions: [
      { date: '2026-05-12', title: 'New CRM Migration', impact: 'High', type: 'Strategic' },
      { date: '2026-04-20', title: 'Q2 Hiring Plan Approval', impact: 'Medium', type: 'Personnel' },
      { date: '2026-03-15', title: 'Budget Allocation Re-alignment', impact: 'High', type: 'Financial' }
    ],
    trainingMilestones: [
      { title: 'Core Process Immersion', status: 'completed', date: 'Day 15' },
      { title: 'Toolchain Mastery', status: 'in-progress', date: 'Day 30' },
      { title: 'Decision Framework Training', status: 'pending', date: 'Day 60' },
      { title: 'Independent Execution', status: 'pending', date: 'Day 90' }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'critical': return <ShieldAlert className="w-5 h-5 text-brand-critical" />;
      case 'warning': return <Shield className="w-5 h-5 text-brand-warning" />;
      default: return <ShieldCheck className="w-5 h-5 text-brand-success" />;
    }
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'training', label: 'Training', icon: Zap },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <div className="min-h-screen bg-brand-gray-100/30">
      {/* Top Navigation Bar */}
      <div className="bg-brand-white border-b border-brand-charcoal-800/5 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-brand-gray-400 hover:text-brand-black transition-colors font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest border border-brand-charcoal-800/10">Export PDF</Button>
            <Button size="sm" className="text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-blue/20">Edit Role</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 px-6">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[9px] font-bold uppercase tracking-[0.2em] rounded">Role Intelligence</span>
              <span className="w-1 h-1 bg-brand-charcoal-800/10 rounded-full"></span>
              <span className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.2em]">{mockDetails.department}</span>
            </div>
            <h1 className="text-5xl font-bold text-brand-black tracking-tightest leading-tight mb-6">
              {role.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                role.status === 'critical' ? 'bg-brand-critical/5 border-brand-critical/10 text-brand-critical' : 
                role.status === 'warning' ? 'bg-brand-warning/5 border-brand-warning/10 text-brand-warning' : 'bg-brand-success/5 border-brand-success/10 text-brand-success'
              }`}>
                {getStatusIcon(role.status)}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {role.status} Risk Level
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-white border border-brand-charcoal-800/10 text-brand-gray-400">
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">ID: {role.id}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-white border border-brand-charcoal-800/10 text-brand-gray-400">
                <Target className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Reports to: {mockDetails.reportingTo}</span>
              </div>
            </div>
          </div>
          
          <Card className="w-full lg:w-80 bg-brand-black text-brand-white border-none p-8 flex flex-col items-center justify-center text-center overflow-hidden relative shadow-2xl" padding="none">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
             <ScoreIndicator score={role.dependency_score} size="md" className="bg-white/5 border border-white/10 mb-6" />
             <h4 className="text-3xl font-bold tracking-tightest mb-1">{role.dependency_score}%</h4>
             <p className="text-[9px] font-bold text-brand-gray-400 uppercase tracking-[0.3em]">Dependency Score</p>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-brand-charcoal-800/10 mb-10 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative ${
                activeTab === tab.id ? 'text-brand-blue' : 'text-brand-gray-400 hover:text-brand-black'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {activeTab === 'overview' && (
              <>
                <section>
                  <h3 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.2em] mb-6 font-mono">Role Description</h3>
                  <p className="text-lg text-brand-black font-medium leading-relaxed mb-8">
                    The {role.name} is responsible for the overall strategic direction and execution of the {mockDetails.department} function. 
                    This role bridges the gap between high-level company goals and daily operational reality.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6 mt-10">
                    <div className="space-y-4">
                      <h4 className="text-[9px] font-bold text-brand-gray-400 uppercase tracking-[0.2em]">Core Responsibilities</h4>
                      <div className="space-y-3">
                        {mockDetails.responsibilities.map((resp, i) => (
                          <div key={i} className="flex gap-3 group">
                            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
                            <span className="text-sm font-semibold text-brand-black/80 leading-snug">{resp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Card className="bg-brand-gray-100/30 border-brand-charcoal-800/5 p-6" padding="none">
                       <h4 className="text-[9px] font-bold text-brand-gray-400 uppercase tracking-[0.2em] mb-4">Maturity Context</h4>
                       <p className="text-xs text-brand-gray-400 leading-relaxed italic">
                         "This role is currently in a high-growth phase. Systemization is lagging behind output volume. Priority should be given to documenting the decision framework to enable delegation."
                       </p>
                    </Card>
                  </div>
                </section>

                <section className="pt-10 border-t border-brand-charcoal-800/5">
                   <div className="flex justify-between items-center mb-8">
                     <h3 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.2em] font-mono">Primary Success Metrics</h3>
                     <span className="text-[9px] font-bold text-brand-blue-soft uppercase tracking-widest bg-brand-blue/5 px-2 py-0.5 rounded">Live tracking</span>
                   </div>
                   <div className="grid sm:grid-cols-3 gap-6">
                     {mockDetails.kpis.map((kpi, i) => (
                       <Card key={i} className="hover:border-brand-blue/20 transition-all border-brand-charcoal-800/5 shadow-sm group" padding="md">
                         <div className="flex justify-between items-start mb-2">
                           <p className="text-[9px] font-bold text-brand-gray-400 uppercase tracking-widest">{kpi.label}</p>
                         </div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-bold text-brand-black tracking-tightest group-hover:text-brand-blue transition-colors">{kpi.current}</span>
                           <span className="text-[9px] font-bold text-brand-gray-400 uppercase">/ {kpi.target}</span>
                         </div>
                         <div className="mt-4 flex items-center gap-1.5">
                            <div className="flex-1 h-1 bg-brand-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-brand-success rounded-full" style={{ width: kpi.current.includes('%') ? kpi.current : '65%' }}></div>
                            </div>
                            <span className="text-[8px] font-bold text-brand-success uppercase">On Track</span>
                         </div>
                       </Card>
                     ))}
                   </div>
                </section>
              </>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-end border-b border-brand-charcoal-800/5 pb-6">
                   <div>
                     <h3 className="text-2xl font-bold text-brand-black tracking-tightest mb-1">Intelligence Assets</h3>
                     <p className="text-sm text-brand-gray-400 font-medium">Captured expertise and operational blueprints.</p>
                   </div>
                   <Button size="sm" className="text-[10px] font-bold uppercase tracking-widest" onClick={() => setShowAddModal(true)}>
                     <BookOpen className="w-3.5 h-3.5 mr-2" /> Add Intelligence
                   </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {knowledge && knowledge.length > 0 ? knowledge.map((item, i) => (
                    <Card key={i} className="hover:border-brand-blue/30 transition-all cursor-pointer group shadow-sm border-brand-charcoal-800/5 hover:shadow-md relative" padding="lg">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-brand-gray-100/50 text-brand-black rounded-lg group-hover:bg-brand-blue group-hover:text-brand-white transition-all duration-300 shadow-sm border border-brand-charcoal-800/5">
                          {item.type === 'sop' ? <FileText size={20} /> : 
                           item.type === 'recording' ? <Video size={20} /> : <MessageSquare size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] font-bold text-brand-gray-400 uppercase tracking-widest">{item.type}</span>
                            <span className="text-[8px] font-bold text-brand-gray-300 uppercase">{new Date(item.captured_at).toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-base font-bold text-brand-black tracking-tightest group-hover:text-brand-blue transition-colors line-clamp-1 pr-6">{item.title}</h4>
                          <div className="mt-4 flex items-center text-[10px] font-bold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                            Access Asset <ArrowRight className="w-3 h-3 ml-2" />
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="absolute top-8 right-8 p-1.5 text-brand-gray-400 hover:text-brand-critical opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </Card>
                  )) : (
                    <div className="sm:col-span-2 py-24 text-center bg-brand-gray-100/20 rounded-brand border border-dashed border-brand-charcoal-800/10">
                       <BookOpen className="w-12 h-12 text-brand-gray-300 mx-auto mb-4 opacity-30" />
                       <h4 className="text-brand-gray-400 font-bold tracking-tightest">No assets captured for this role.</h4>
                       <p className="text-xs text-brand-gray-400 mt-2 mb-8 max-w-xs mx-auto">Start documenting processes to reduce dependency risk and build organizational intelligence.</p>
                       <Button variant="outline" size="sm" className="border-brand-charcoal-800/10 font-bold uppercase text-[10px] tracking-widest" onClick={() => setShowAddModal(true)}>Create First SOP</Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'training' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                 <section>
                    <div className="flex items-center gap-3 mb-8">
                       <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue border border-brand-blue/10 shadow-sm">
                          <Zap className="w-5 h-5" />
                       </div>
                       <h3 className="text-2xl font-bold text-brand-black tracking-tightest">Independence Roadmap</h3>
                    </div>
                    
                    <Card padding="lg" className="bg-brand-black text-brand-white border-none relative overflow-hidden shadow-2xl">
                       <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full translate-x-1/2 translate-y-1/2"></div>
                       <div className="relative z-10 space-y-10">
                          {mockDetails.trainingMilestones.map((milestone, i) => (
                             <div key={i} className="flex gap-6 relative last:pb-0 pb-10 after:absolute after:left-[19px] after:top-[40px] after:bottom-0 after:w-[1px] after:bg-white/10 last:after:hidden">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all shadow-xl ${
                                   milestone.status === 'completed' ? 'bg-brand-blue border-brand-blue text-brand-white' : 
                                   milestone.status === 'in-progress' ? 'bg-white/10 border-brand-blue text-brand-blue-soft animate-pulse' : 'bg-white/5 border-white/10 text-brand-gray-400'
                                }`}>
                                   {milestone.status === 'completed' ? <CheckCircle2 size={16} /> : `0${i+1}`}
                                </div>
                                <div>
                                   <div className="flex items-center gap-3 mb-1">
                                      <h4 className={`text-base font-bold tracking-tightest ${milestone.status === 'pending' ? 'text-brand-gray-400' : 'text-brand-white'}`}>{milestone.title}</h4>
                                      <span className="text-[9px] font-bold text-brand-gray-400 uppercase tracking-widest font-mono">{milestone.date}</span>
                                   </div>
                                   <p className="text-xs text-brand-gray-400 leading-relaxed max-w-md">
                                      {i === 0 ? "Review all captured SOPs and successfully execute core departmental workflows under supervision." : 
                                       i === 1 ? "Full proficiency in CRM, project management, and reporting toolsets with zero guidance required." : 
                                       "Establish clear delegation boundaries and transition final approval authority for core workflows."}
                                   </p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </Card>
                 </section>

                 <section className="pt-10 border-t border-brand-charcoal-800/5">
                    <div className="flex justify-between items-center mb-8">
                       <h4 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.2em] font-mono">Training Materials</h4>
                       <Button variant="ghost" size="sm" className="text-brand-blue text-[10px] uppercase font-bold tracking-widest">Manage Resources</Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                       <div className="p-4 bg-brand-white border border-brand-charcoal-800/5 rounded-brand flex items-center justify-between group cursor-pointer hover:border-brand-blue/20 transition-all shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-brand-gray-100 rounded-lg flex items-center justify-center text-brand-gray-400 group-hover:text-brand-blue transition-colors">
                                <Video size={18} />
                             </div>
                             <span className="text-sm font-bold text-brand-black tracking-tightest">Onboarding Playlist</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-brand-gray-200 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                       </div>
                       <div className="p-4 bg-brand-white border border-brand-charcoal-800/5 rounded-brand flex items-center justify-between group cursor-pointer hover:border-brand-blue/20 transition-all shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-brand-gray-100 rounded-lg flex items-center justify-center text-brand-gray-400 group-hover:text-brand-blue transition-colors">
                                <FileText size={18} />
                             </div>
                             <span className="text-sm font-bold text-brand-black tracking-tightest">Decision Framework v2</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-brand-gray-200 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                       </div>
                    </div>
                 </section>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                 <section>
                    <h3 className="text-2xl font-bold text-brand-black tracking-tightest mb-8">Role Decision Log</h3>
                    <div className="space-y-4">
                       {mockDetails.decisions.map((decision, i) => (
                          <div key={i} className="flex items-start gap-6 p-6 bg-brand-white border border-brand-charcoal-800/5 rounded-brand shadow-sm hover:shadow-md transition-all group">
                             <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-brand-gray-100 flex flex-col items-center justify-center text-brand-gray-400 font-mono">
                                   <span className="text-[10px] font-bold leading-none">{decision.date.split('-')[2]}</span>
                                   <span className="text-[8px] uppercase tracking-tighter">{decision.date.split('-')[1]}</span>
                                </div>
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                   <h4 className="text-base font-bold text-brand-black tracking-tightest group-hover:text-brand-blue transition-colors">{decision.title}</h4>
                                   <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
                                      decision.impact === 'High' ? 'bg-brand-critical/5 border-brand-critical/10 text-brand-critical' : 'bg-brand-blue/5 border-brand-blue/10 text-brand-blue'
                                   }`}>Impact: {decision.impact}</span>
                                </div>
                                <p className="text-xs text-brand-gray-400 mb-4">Type: {decision.type}</p>
                                <button className="text-[9px] font-bold text-brand-blue uppercase tracking-widest hover:underline">View Rationale</button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </section>

                 <section className="pt-10 border-t border-brand-charcoal-800/5">
                    <h3 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.2em] mb-8 font-mono">Audit History</h3>
                    <div className="bg-brand-white border border-brand-charcoal-800/5 rounded-brand overflow-hidden shadow-sm">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="bg-brand-gray-100/50 border-b border-brand-charcoal-800/5">
                                <th className="px-6 py-3 text-[9px] font-bold text-brand-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-3 text-[9px] font-bold text-brand-gray-400 uppercase tracking-widest">Score</th>
                                <th className="px-6 py-3 text-[9px] font-bold text-brand-gray-400 uppercase tracking-widest">Auditor</th>
                                <th className="px-6 py-3 text-[9px] font-bold text-brand-gray-400 uppercase tracking-widest text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-charcoal-800/5">
                             <tr>
                                <td className="px-6 py-4 text-xs font-bold text-brand-black tracking-tightest">June 10, 2026</td>
                                <td className="px-6 py-4 text-xs font-bold text-brand-blue">{role.dependency_score}%</td>
                                <td className="px-6 py-4 text-xs font-medium text-brand-gray-400">System (Auto)</td>
                                <td className="px-6 py-4 text-right">
                                   <button className="text-[9px] font-bold text-brand-blue uppercase tracking-widest hover:underline">View Report</button>
                                </td>
                             </tr>
                             <tr className="bg-brand-gray-100/10">
                                <td className="px-6 py-4 text-xs font-bold text-brand-black tracking-tightest">May 15, 2026</td>
                                <td className="px-6 py-4 text-xs font-bold text-brand-blue">{Math.min(100, role.dependency_score + 5)}%</td>
                                <td className="px-6 py-4 text-xs font-medium text-brand-gray-400">CEO</td>
                                <td className="px-6 py-4 text-right">
                                   <button className="text-[9px] font-bold text-brand-blue uppercase tracking-widest hover:underline">View Report</button>
                                </td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </section>
              </div>
            )}
          </div>

          {/* Sidebar - Contextual Actions & Intelligence Meta */}
          <div className="space-y-8">
            <section className="space-y-6">
               <h3 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.3em] px-2 font-mono">Intelligence Meta</h3>
               <Card padding="lg" className="shadow-sm border-brand-charcoal-800/5 bg-brand-white">
                  <div className="space-y-8">
                     <div>
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-[10px] font-bold text-brand-black uppercase tracking-widest">Knowledge Coverage</span>
                           <span className="text-xs font-bold text-brand-blue">{mockDetails.knowledgeCoverage}%</span>
                        </div>
                        <div className="w-full h-2 bg-brand-gray-100 rounded-full overflow-hidden shadow-inner">
                           <div className="h-full bg-brand-blue rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${mockDetails.knowledgeCoverage}%` }}></div>
                        </div>
                     </div>
                     <div className="pt-6 border-t border-brand-charcoal-800/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-brand-gray-400">Last Intelligence Update</span>
                        <span className="text-brand-black flex items-center gap-1"><Clock className="w-3 h-3" /> 2h ago</span>
                     </div>
                  </div>
               </Card>
            </section>

            <section className="space-y-4">
               <h3 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.3em] px-2 font-mono">Quick Actions</h3>
               <Button className="w-full justify-between py-4 group shadow-xl shadow-brand-blue/10 text-[10px] uppercase font-bold tracking-[0.2em]" onClick={() => setShowAddModal(true)}>
                 Capture Intelligence <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Button>
               <Button variant="outline" className="w-full py-4 bg-brand-white border-brand-charcoal-800/10 font-bold uppercase text-[10px] tracking-[0.2em] text-brand-gray-400 hover:text-brand-black">
                 Start Succession Audit
               </Button>
               <Button variant="ghost" className="w-full py-4 text-brand-critical/60 hover:text-brand-critical hover:bg-brand-critical/5 font-bold uppercase text-[10px] tracking-[0.2em]">
                 Archive Role
               </Button>
            </section>

            <Card padding="md" className="bg-brand-blue/5 border-brand-blue/10">
               <div className="flex gap-4 items-start">
                  <div className="mt-0.5 p-2 bg-brand-white rounded-lg text-brand-blue shadow-sm border border-brand-blue/5">
                     <Info className="w-4 h-4" />
                  </div>
                  <div>
                     <h4 className="text-xs font-bold text-brand-black uppercase tracking-widest mb-1">AI Recommendation</h4>
                     <p className="text-[11px] text-brand-gray-400 leading-relaxed font-medium">
                        Documentation for "Budget Re-alignment" is currently 40% complete. AI suggests finalizing the exceptions handling section to reduce decision reliance on CEO.
                     </p>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </div>

      {showAddModal && role && (
        <AddKnowledgeModal
          roleId={role.id}
          roleName={role.name}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default RoleProfile;
