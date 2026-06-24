import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Link as LinkIcon, Video, Plus, Search, ChevronRight, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import AddKnowledgeModal from '../components/AddKnowledgeModal';
import { api } from '../services/api';

interface Role {
  id: number;
  name: string;
  dependency_score: number;
  status: string;
}

interface KnowledgeItem {
  id: number;
  role_id: number;
  title: string;
  type: string;
  content: string;
  captured_at: string;
}

const KnowledgeCapture = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const fetchData = async () => {
    try {
      const [rolesRes, knowledgeRes] = await Promise.all([
        api.get('/roles'),
        api.get('/knowledge')
      ]);
      setRoles(rolesRes.data);
      setKnowledge(knowledgeRes.data);
    } catch (error) {
      console.error("Failed to fetch knowledge data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this intelligence asset?')) return;
    try {
      await api.delete(`/knowledge/${itemId}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete knowledge item:", error);
    }
  };

  const filteredKnowledge = knowledge.filter(k => {
    if (selectedRole && k.role_id !== selectedRole.id) return false;
    if (typeFilter !== 'all' && k.type !== typeFilter) return false;
    return true;
  });

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'sop': return <FileText className="w-4 h-4" />;
      case 'recording': return <Video className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-brand-black tracking-tightest">Knowledge Capture</h1>
          <p className="text-brand-gray-400 text-sm">Transforming individual expertise into permanent company assets.</p>
        </div>
        {selectedRole && (
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Intelligence
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest px-2">Company Roles</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-400" />
            <input 
              type="text" 
              placeholder="Search roles..." 
              className="w-full pl-10 pr-4 py-2 bg-brand-white border border-brand-charcoal-800/10 rounded-brand text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[600px] pr-2">
            {filteredRoles.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left p-4 rounded-brand border transition-all ${
                  selectedRole?.id === role.id 
                    ? 'bg-brand-black border-brand-black text-brand-white shadow-lg' 
                    : 'bg-brand-white border-brand-charcoal-800/5 hover:border-brand-charcoal-800/20 text-brand-black'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold tracking-tightest">{role.name}</span>
                  <ChevronRight className={`w-4 h-4 ${selectedRole?.id === role.id ? 'text-brand-white' : 'text-brand-gray-400'}`} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    role.status === 'critical' ? 'bg-brand-critical/20 text-brand-critical' : 'bg-brand-success/20 text-brand-success'
                  }`}>
                    {role.status}
                  </span>
                  <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-widest">
                    {knowledge.filter(k => k.role_id === role.id).length} Items
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Knowledge Items */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-brand-charcoal-800/5 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mb-1 block">Role Intelligence</span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-brand-black tracking-tightest">{selectedRole.name}</h2>
                    <Link to={`/role/${selectedRole.id}`}>
                      <Button variant="ghost" size="sm" className="text-brand-blue text-[10px] uppercase font-bold tracking-widest border border-brand-blue/10 hover:bg-brand-blue/5">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 outline-none cursor-pointer"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="sop">SOPs</option>
                    <option value="recording">Recordings</option>
                    <option value="decision">Decisions</option>
                    <option value="meeting-notes">Meeting Notes</option>
                  </select>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest block mb-1">Dependency Risk</span>
                    <span className={`text-xl font-bold ${selectedRole.dependency_score > 70 ? 'text-brand-critical' : 'text-brand-success'}`}>
                      {selectedRole.dependency_score}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {filteredKnowledge.length > 0 ? (
                  filteredKnowledge.map(item => (
                    <Card key={item.id} className="hover:border-brand-blue/30 transition-all cursor-pointer group relative">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-brand-blue/5 text-brand-blue rounded-lg group-hover:bg-brand-blue group-hover:text-brand-white transition-all">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-brand-black tracking-tightest truncate pr-8">{item.title}</h4>
                          <p className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-widest mt-1">{item.type}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="absolute top-4 right-4 p-2 text-brand-gray-400 hover:text-brand-critical opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="mt-4 pt-4 border-t border-brand-charcoal-800/5 flex justify-between items-center">
                        <span className="text-[10px] text-brand-gray-400 font-medium">Captured {new Date(item.captured_at).toLocaleDateString()}</span>
                        <span className="text-brand-blue text-[10px] font-bold uppercase tracking-widest group-hover:underline">View Asset</span>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="sm:col-span-2 py-20 text-center bg-brand-gray-100/50 rounded-brand border border-dashed border-brand-charcoal-800/10">
                    <FileText className="w-12 h-12 text-brand-gray-400 mx-auto mb-4 opacity-20" />
                    <h3 className="text-brand-gray-400 font-bold tracking-tightest">No intelligence captured yet for this role.</h3>
                    <p className="text-xs text-brand-gray-400 mt-1 mb-6">Start documenting processes to reduce dependency risk.</p>
                    <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
                      <Plus className="w-4 h-4 mr-2" /> Add First SOP
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-20 text-center border border-dashed border-brand-charcoal-800/10 rounded-brand bg-brand-gray-100/30">
              <div>
                <Search className="w-16 h-16 text-brand-gray-400 mx-auto mb-4 opacity-10" />
                <p className="text-brand-gray-400 font-bold uppercase tracking-widest text-xs">Select a role to view captured intelligence</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && selectedRole && (
        <AddKnowledgeModal
          roleId={selectedRole.id}
          roleName={selectedRole.name}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default KnowledgeCapture;
