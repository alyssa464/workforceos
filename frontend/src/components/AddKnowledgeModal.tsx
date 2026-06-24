import React, { useState } from 'react';
import { X, FileText, Video, MessageSquare, Zap, Target, Loader2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { api } from '../services/api';

interface AddKnowledgeModalProps {
  roleId: number | string;
  roleName: string;
  onClose: () => void;
  onSuccess: () => void;
}

type KnowledgeType = 'sop' | 'recording' | 'document' | 'decision' | 'meeting-notes';

const AddKnowledgeModal: React.FC<AddKnowledgeModalProps> = ({ 
  roleId, 
  roleName, 
  onClose, 
  onSuccess 
}) => {
  const [type, setType] = useState<KnowledgeType>('sop');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/knowledge', {
        role_id: Number(roleId),
        title,
        type: type,
        content,
        tags: [],
        source: 'manual'
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to add knowledge:', err);
      setError('Failed to save intelligence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const types: { id: KnowledgeType; label: string; icon: any; description: string; placeholder: string }[] = [
    { 
      id: 'sop', 
      label: 'Standard Operating Procedure', 
      icon: FileText, 
      description: 'Step-by-step instructions for a core task.',
      placeholder: 'Paste the SOP text or summary here...'
    },
    { 
      id: 'recording', 
      label: 'Loom / Video Recording', 
      icon: Video, 
      description: 'Link to a screen share or training video.',
      placeholder: 'https://loom.com/share/...'
    },
    { 
      id: 'decision', 
      label: 'Key Decision', 
      icon: Zap, 
      description: 'Log a strategic choice and its rationale.',
      placeholder: 'Describe the decision and why it was made...'
    },
    { 
      id: 'meeting-notes', 
      label: 'Meeting Notes', 
      icon: MessageSquare, 
      description: 'Insights from a tactical or strategic session.',
      placeholder: 'Paste key takeaways and action items...'
    }
  ];

  const activeType = types.find(t => t.id === type) || types[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl bg-brand-white shadow-2xl border-none overflow-hidden flex flex-col" padding="none">
        <div className="flex justify-between items-center p-6 border-b border-brand-charcoal-800/5 bg-brand-gray-100/30">
          <div>
            <h3 className="text-xl font-bold text-brand-black tracking-tightest">Ingest Intelligence</h3>
            <p className="text-xs text-brand-gray-400 font-medium">Adding knowledge for <span className="text-brand-blue font-bold">{roleName}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-brand-gray-100 rounded-full transition-colors text-brand-gray-400 border border-transparent hover:border-brand-charcoal-800/5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 max-h-[80vh]">
          {/* Type Selection */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.2em] font-mono">Select Asset Type</h4>
            <div className="grid grid-cols-2 gap-4">
              {types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex items-start gap-4 p-4 rounded-brand border text-left transition-all ${
                    type === t.id 
                      ? 'bg-brand-blue/5 border-brand-blue ring-1 ring-brand-blue' 
                      : 'bg-brand-white border-brand-charcoal-800/5 hover:border-brand-charcoal-800/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${type === t.id ? 'bg-brand-blue text-brand-white' : 'bg-brand-gray-100 text-brand-gray-400'}`}>
                    <t.icon size={18} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold tracking-tightest ${type === t.id ? 'text-brand-black' : 'text-brand-black/70'}`}>{t.label}</p>
                    <p className="text-[10px] text-brand-gray-400 leading-tight mt-1">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Input 
              label="Asset Title" 
              placeholder={`e.g. ${type === 'decision' ? 'New Hiring Policy' : 'Client Onboarding Flow'}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-brand-black uppercase tracking-wider">
                {type === 'recording' ? 'Video URL' : 'Content / Details'}
              </label>
              {type === 'recording' ? (
                <input
                  type="url"
                  className="w-full bg-brand-white border border-brand-charcoal-800/20 rounded-brand px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  placeholder={activeType.placeholder}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              ) : (
                <textarea
                  className="w-full bg-brand-white border border-brand-charcoal-800/20 rounded-brand px-4 py-3 text-sm min-h-[150px] focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none font-medium text-brand-black/80"
                  placeholder={activeType.placeholder}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-brand-critical/5 border border-brand-critical/10 rounded-brand">
              <p className="text-xs text-brand-critical font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 border-brand-charcoal-800/10 font-bold uppercase text-[10px] tracking-widest"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 shadow-xl shadow-brand-blue/20 font-bold uppercase text-[10px] tracking-widest"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Capture Intelligence</>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddKnowledgeModal;
