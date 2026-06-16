import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Plus, ToggleLeft, ToggleRight, Trash2, Edit3, Settings, Save, AlertTriangle, HelpCircle } from 'lucide-react';
import { ATokenRule } from '../types';

interface ComplianceRuleBuilderProps {
  rules: ATokenRule[];
  onToggleRule: (id: string) => void;
  onAddRule: (rule: ATokenRule) => void;
  onDeleteRule: (id: string) => void;
}

export default function ComplianceRuleBuilder({
  rules,
  onToggleRule,
  onAddRule,
  onDeleteRule
}: ComplianceRuleBuilderProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<'Velocity' | 'Sanctions' | 'Geofencing' | 'TravelRule' | 'VolumeLimit'>('Velocity');
  const [newRuleVal, setNewRuleVal] = useState('');
  const [newRuleSeverity, setNewRuleSeverity] = useState<'Block' | 'Flag' | 'Review'>('Flag');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newRuleDesc) return;

    const rule: ATokenRule = {
      id: `RULE-${Math.floor(100 + Math.random() * 900)}`,
      name: newRuleName,
      description: newRuleDesc,
      category: newRuleCategory,
      value: newRuleVal || 'Enabled',
      enabled: true,
      severity: newRuleSeverity
    };

    onAddRule(rule);
    // Reset Form
    setNewRuleName('');
    setNewRuleDesc('');
    setNewRuleVal('');
    setShowAddForm(false);
  };

  const getSeverityBadge = (severity: 'Block' | 'Flag' | 'Review') => {
    switch (severity) {
      case 'Block':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Flag':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5 font-sans">
            <Shield className="h-5 w-5 text-orange-500" />
            Smart A-Token Compliance Rules
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic regulatory hooks processed directly on Cleanverse smart contracts during token mint, transfer, or burn events.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          type="button"
          className="px-3 py-1.5 rounded bg-orange-500 hover:bg-orange-600 font-bold text-xs text-slate-950 uppercase tracking-wider flex items-center gap-1 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          {showAddForm ? 'Close Rule Builder' : 'New Contract Rule'}
        </button>
      </div>

      {/* Add New Rule Form with motion */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 border border-orange-500/30 rounded-xl p-5 shadow-xl relative"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-orange-400 font-bold tracking-wider flex items-center gap-1">
                  <Settings className="h-3.5 w-3.5" />
                  COMPILE NEW SMART REGULATORY PARAMETER
                </span>
                <span className="text-[10px] text-slate-500">Gwei cost: ~12 Gwei</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Rule Identifier / Name</label>
                  <input
                    type="text"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    required
                    placeholder="e.g. EU Passport Restriction Rule"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded p-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Trigger Category</label>
                  <select
                    value={newRuleCategory}
                    onChange={(e) => setNewRuleCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded p-2 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="Velocity">Velocity</option>
                    <option value="Sanctions">Sanctions</option>
                    <option value="Geofencing">Geofencing</option>
                    <option value="TravelRule">TravelRule</option>
                    <option value="VolumeLimit">VolumeLimit</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Rule Condition Description</label>
                  <input
                    type="text"
                    value={newRuleDesc}
                    onChange={(e) => setNewRuleDesc(e.target.value)}
                    required
                    placeholder="e.g. Deny transactions if transferee region is not in white-listed passport register."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded p-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Condition Parameters (Value / Target)</label>
                  <input
                    type="text"
                    value={newRuleVal}
                    onChange={(e) => setNewRuleVal(e.target.value)}
                    placeholder="e.g. > 10000 USD, or Regions: EU/US"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded p-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Breach Enforcement Protocol</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Block', 'Flag', 'Review'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setNewRuleSeverity(sev)}
                        className={`py-1.5 rounded text-xs transition-all font-medium border ${
                          newRuleSeverity === sev
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/60 font-semibold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-slate-200 text-xs font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs uppercase"
                >
                  DEPLOY TO SMART CONTRACT
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules list */}
      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-slate-900/40 border rounded-xl p-5 transition-all text-left flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              rule.enabled ? 'border-slate-800' : 'border-slate-800/40 opacity-55'
            }`}
          >
            <div className="space-y-1.5 flex-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-slate-950 text-orange-400 border border-slate-800 px-2 py-0.5 rounded font-semibold">
                  {rule.id}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 tracking-wider">
                  {rule.category}
                </span>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1">
                  {rule.name}
                </h4>
              </div>

              <p className="text-xs text-slate-400">{rule.description}</p>
              
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] text-slate-500 font-mono">
                  State Value: <span className="text-slate-300 font-bold">{rule.value}</span>
                </span>
                <span className="text-slate-800">|</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getSeverityBadge(rule.severity)} font-mono uppercase font-bold tracking-widest`}>
                  ACTION: {rule.severity}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleRule(rule.id)}
                type="button"
                className="p-1.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                title={rule.enabled ? 'Disable active rule' : 'Enable rule'}
              >
                {rule.enabled ? (
                  <ToggleRight className="h-7 w-7 text-orange-500" />
                ) : (
                  <ToggleLeft className="h-7 w-7 text-slate-600" />
                )}
              </button>
              <button
                onClick={() => onDeleteRule(rule.id)}
                type="button"
                className="p-1.5 rounded hover:bg-slate-800 transition-colors text-slate-500 hover:text-red-400 cursor-pointer"
                title="Decompile rule"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contract audit disclaimer */}
      <div className="bg-slate-900/20 border border-slate-800 p-4 rounded-lg flex items-start gap-2.5">
        <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          <strong>A-Token Regulatory Advisory:</strong> Modification to rules acts as a hard contract upgrade on-chain. Rule deletions are stored for regulatory review in accordance with FATF standards and travel rule guidelines. All updates are logged securely in the <strong>Audit Timeline</strong>.
        </p>
      </div>
    </div>
  );
}
