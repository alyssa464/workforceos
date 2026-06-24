import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  type Node,
  type Edge,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getRoles } from '../services/api';
import { X, AlertTriangle, ShieldCheck, HelpCircle, LayoutGrid, Network } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

// Custom Node Component
const RoleNode = ({ data }: any) => {
  const getStatusColor = (score: number) => {
    if (score >= 80) return 'border-brand-critical bg-brand-critical/5';
    if (score >= 50) return 'border-brand-warning bg-brand-warning/5';
    return 'border-brand-success bg-brand-success/5';
  };

  const getBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-brand-critical/10 text-brand-critical border-brand-critical/20';
    if (score >= 50) return 'bg-brand-warning/10 text-brand-warning border-brand-warning/20';
    return 'bg-brand-success/10 text-brand-success border-brand-success/20';
  };

  return (
    <div className={`px-4 py-4 shadow-xl rounded-brand border-2 min-w-[220px] transition-all duration-300 ${getStatusColor(data.score)} ${data.selected ? 'ring-2 ring-brand-blue/30 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-brand-charcoal-800/20 border-none" />
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getBadgeColor(data.score)}`}>
            {data.status}
          </span>
          {data.score >= 80 && <AlertTriangle className="w-3.5 h-3.5 text-brand-critical" />}
        </div>
        <span className="text-sm font-bold text-brand-black leading-tight tracking-tightest mb-3">{data.label}</span>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-widest">Dependency</span>
            <span className={`text-xs font-mono font-bold ${data.score >= 50 ? 'text-brand-critical' : 'text-brand-success'}`}>
              {data.score}%
            </span>
          </div>
          <div className="w-full bg-brand-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-1000 ${data.score >= 80 ? 'bg-brand-critical' : data.score >= 50 ? 'bg-brand-warning' : 'bg-brand-success'}`}
              style={{ width: `${data.score}%` }}
            ></div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-brand-charcoal-800/20 border-none" />
    </div>
  );
};

const nodeTypes = {
  roleNode: RoleNode,
};

const DependencyMap: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'dependency' | 'risk'>('dependency');

  const onNodeClick = (_: any, node: Node) => {
    setSelectedRole(node.data);
  };

  const layoutTree = (roles: any[]) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const levelCount: { [key: number]: number } = {};

    const processRole = (role: any, level: number, parentX: number = 400) => {
      levelCount[level] = (levelCount[level] || 0) + 1;
      
      const x = parentX + (levelCount[level] - 1) * 300 - 400; 
      const y = level * 180 + 50;

      nodes.push({
        id: role.id.toString(),
        type: 'roleNode',
        position: { x, y },
        data: { 
          label: role.name, 
          score: role.dependency_score, 
          status: role.status,
          roleId: role.id
        },
      });

      const children = roles.filter(r => r.parent_id === role.id);
      children.forEach(child => {
        edges.push({
          id: `e${role.id}-${child.id}`,
          source: role.id.toString(),
          target: child.id.toString(),
          animated: child.dependency_score > 70,
          style: { stroke: child.dependency_score > 70 ? '#EF4444' : '#E5E7EB', strokeWidth: 2 },
        });
        processRole(child, level + 1, x);
      });
    };

    const roots = roles.filter(r => !r.parent_id);
    roots.forEach(root => processRole(root, 0));

    return { nodes, edges };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roles = await getRoles();
        const { nodes: layoutedNodes, edges: layoutedEdges } = layoutTree(roles);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setNodes, setEdges]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-brand-white">
      <div className="text-center">
        <Network className="w-12 h-12 text-brand-blue animate-pulse mx-auto mb-4" />
        <p className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.3em]">Mapping Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-brand-gray-100/30 overflow-hidden">
      <div className="flex-1 flex flex-col relative">
        {/* Header Overlay */}
        <div className="absolute top-8 left-8 z-10 max-w-md">
          <Card className="bg-brand-white/80 backdrop-blur-md border-brand-charcoal-800/10 shadow-2xl" padding="lg">
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-5 h-5 text-brand-blue" />
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em]">Operational Graph</span>
            </div>
            <h1 className="text-2xl font-bold text-brand-black mb-2 tracking-tightest">Workforce Dependency Map</h1>
            <p className="text-xs text-brand-gray-400 mb-6 font-medium leading-relaxed">Visualizing single points of failure and knowledge concentration across your organization.</p>
            
            <div className="flex gap-2 p-1 bg-brand-gray-100/50 rounded-xl border border-brand-charcoal-800/5">
              <button 
                onClick={() => setViewMode('dependency')}
                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'dependency' ? 'bg-brand-white text-brand-black shadow-sm border border-brand-charcoal-800/5' : 'text-brand-gray-400 hover:text-brand-black'}`}
              >
                Dependency Score
              </button>
              <button 
                onClick={() => setViewMode('risk')}
                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'risk' ? 'bg-brand-white text-brand-black shadow-sm border border-brand-charcoal-800/5' : 'text-brand-gray-400 hover:text-brand-black'}`}
              >
                Risk Analysis
              </button>
            </div>
          </Card>
        </div>

        {/* Legend Panel */}
        <div className="absolute bottom-8 left-8 z-10">
          <Card className="bg-brand-white/80 backdrop-blur-md border-brand-charcoal-800/10 shadow-xl" padding="sm">
            <div className="space-y-3 px-1">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-success shadow-sm"></div>
                <span className="text-[10px] font-bold text-brand-black uppercase tracking-wider opacity-70 italic">System Dependent</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-warning shadow-sm"></div>
                <span className="text-[10px] font-bold text-brand-black uppercase tracking-wider opacity-70 italic">Moderate Risk</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-critical shadow-sm"></div>
                <span className="text-[10px] font-bold text-brand-black uppercase tracking-wider opacity-70 italic">Critical Dependency</span>
              </div>
            </div>
          </Card>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-brand-gray-100/30"
        >
          <Background color="#1A1A1A" gap={25} size={1} opacity={0.03} />
          <Controls className="!bg-brand-white !border-brand-charcoal-800/10 !shadow-lg !rounded-brand overflow-hidden" />
        </ReactFlow>
      </div>

      {/* Details Sidebar */}
      <div className={`w-[400px] bg-brand-white border-l border-brand-charcoal-800/10 shadow-2xl transition-all duration-700 ease-in-out transform flex flex-col ${selectedRole ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedRole ? (
          <>
            <div className="p-8 border-b border-brand-charcoal-800/5 flex justify-between items-center bg-brand-gray-100/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-black rounded-lg text-brand-white">
                  <LayoutGrid size={18} />
                </div>
                <h2 className="text-lg font-bold text-brand-black uppercase tracking-tightest">Role Intelligence</h2>
              </div>
              <button 
                onClick={() => setSelectedRole(null)}
                className="p-2 hover:bg-brand-gray-100 rounded-full transition-colors text-brand-gray-400 border border-transparent hover:border-brand-charcoal-800/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <section>
                <h3 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em] mb-4">Identity & Status</h3>
                <div className="space-y-2">
                  <h4 className="text-3xl font-bold text-brand-black tracking-tightest leading-tight">{selectedRole.label}</h4>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${selectedRole.score >= 80 ? 'bg-brand-critical/10 text-brand-critical border-brand-critical/20' : selectedRole.score >= 50 ? 'bg-brand-warning/10 text-brand-warning border-brand-warning/20' : 'bg-brand-success/10 text-brand-success border-brand-success/20'}`}>
                      {selectedRole.status}
                    </span>
                    <span className="text-xs text-brand-gray-400 font-bold uppercase tracking-widest opacity-40">Role ID: {selectedRole.roleId}</span>
                  </div>
                </div>
              </section>

              <Card className="bg-brand-charcoal-900 border-none text-brand-white overflow-hidden relative" padding="lg">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex justify-between items-end mb-4 relative z-10">
                  <h3 className="text-[10px] font-bold text-brand-blue-soft uppercase tracking-[0.2em]">Dependency Score</h3>
                  <span className={`text-5xl font-bold tracking-tightest ${selectedRole.score >= 80 ? 'text-brand-critical' : selectedRole.score >= 50 ? 'text-brand-warning' : 'text-brand-success'}`}>
                    {selectedRole.score}%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 mb-6 overflow-hidden relative z-10 border border-white/5">
                  <div 
                    className={`h-full transition-all duration-1000 delay-300 ${selectedRole.score >= 80 ? 'bg-brand-critical' : selectedRole.score >= 50 ? 'bg-brand-warning' : 'bg-brand-success'}`} 
                    style={{ width: `${selectedRole.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-brand-gray-400 leading-relaxed font-medium relative z-10">
                  {selectedRole.score >= 80 
                    ? "CRITICAL: This role is a single point of failure. Operational continuity will cease if this individual is unavailable for 48+ hours." 
                    : selectedRole.score >= 50 
                    ? "WARNING: Moderate dependency. Some documentation exists, but key execution knowledge still resides with one person." 
                    : "STABLE: Low dependency. This role is well-systematized with redundant knowledge and clear, tested SOPs."}
                </p>
              </Card>

              <section className="space-y-6">
                <h3 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.3em]">Operational Readiness</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-brand-gray-100/30 border-brand-charcoal-800/5 hover:bg-brand-gray-100/50 transition-colors" padding="md">
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 p-2 bg-brand-white rounded-lg text-brand-blue shadow-sm border border-brand-charcoal-800/5">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-black uppercase tracking-widest mb-1">Documentation</p>
                        <p className="text-xs text-brand-gray-400 font-medium">{selectedRole.score > 70 ? 'Minimal coverage (under 20%)' : 'Good coverage (above 70%)'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-brand-gray-100/30 border-brand-charcoal-800/5 hover:bg-brand-gray-100/50 transition-colors" padding="md">
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 p-2 bg-brand-white rounded-lg text-brand-warning shadow-sm border border-brand-charcoal-800/5">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-black uppercase tracking-widest mb-1">Redundancy</p>
                        <p className="text-xs text-brand-gray-400 font-medium">{selectedRole.score > 80 ? 'No secondary coverage identified' : 'Partial secondary coverage exists'}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </section>

              <section className="pt-8 border-t border-brand-charcoal-800/10 space-y-3">
                <Link to={`/role/${selectedRole.roleId}`} className="block">
                  <Button className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl shadow-brand-blue/20">
                    View Full Intelligence Profile
                  </Button>
                </Link>
                <Button variant="outline" className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] border-brand-charcoal-800/10 bg-brand-white">
                  Generate IQ Report
                </Button>
                <p className="text-[9px] text-brand-gray-400 text-center mt-4 font-bold uppercase tracking-widest italic opacity-60">Confidential Organizational Intelligence</p>
              </section>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div>
              <div className="w-20 h-20 bg-brand-gray-100/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-charcoal-800/5 shadow-inner">
                <Network className="w-8 h-8 text-brand-gray-400 opacity-30" />
              </div>
              <p className="text-brand-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-[180px] mx-auto leading-loose">Select a role node in the graph to view intelligence data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DependencyMap;
