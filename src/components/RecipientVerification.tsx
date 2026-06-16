import React, { useState } from 'react';
import { 
  Plus, Search, UserCheck, ShieldCheck, Wallet, Globe, X, 
  CheckCircle, AlertTriangle, Eye, Lock, RefreshCw, Trash2, Info, ArrowRight, Inbox 
} from 'lucide-react';
import { APassIdentity } from '../types';

interface RecipientVerificationProps {
  existingRecipients: APassIdentity[];
  onAddRecipient: (newRec: APassIdentity) => void;
  onRemoveRecipient?: (id: string) => void;
}

export default function RecipientVerification({ 
  existingRecipients, 
  onAddRecipient,
  onRemoveRecipient
}: RecipientVerificationProps) {
  
  // Interactive Modal or section form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United States');
  const [walletAddress, setWalletAddress] = useState('');
  const [kycLevel, setKycLevel] = useState<'Level 1 (Basic)' | 'Level 2 (Standard)' | 'Level 3 (Enterprise)'>('Level 2 (Standard)');
  const [riskCategory, setRiskCategory] = useState<'Low' | 'Medium' | 'High'>('Low');

  // Search filter
  const [search, setSearch] = useState('');
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  const countries = [
    'United States', 'United Kingdom', 'Singapore', 'Germany', 
    'Argentina', 'Cyprus', 'India', 'Panama'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !walletAddress) return;

    const newRecId = `AP-${Math.floor(202600 + Math.random() * 89999)}`;
    const newRecipient: APassIdentity = {
      id: newRecId,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@payout.net`,
      type: 'Freelancer',
      country,
      kycLevel,
      status: 'Submitted', // Start as Submitted to allow operator "Verify recipient" action clicks!
      walletAddress,
      issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      riskCategory,
      documents: {
        idDocument: true,
        proofOfAddress: true,
        sanctionsCheck: 'Pending'
      }
    };

    onAddRecipient(newRecipient);
    
    // Clear state
    setName('');
    setEmail('');
    setWalletAddress('');
    setShowAddForm(false);
  };

  const verifyRecipientOnChain = (id: string) => {
    setIsVerifying(id);
    setTimeout(() => {
      setIsVerifying(null);
      // We can update isVerifying status to Verified of the items in parent
      const found = existingRecipients.find(r => r.id === id);
      if (found) {
        found.status = 'Verified';
        found.documents.sanctionsCheck = 'Passed';
      }
    }, 1200);
  };

  const filteredRecipients = existingRecipients.filter(r => {
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.walletAddress.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.country.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div id="recipient-verification-root" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] text-orange-500 font-mono font-bold tracking-widest uppercase">Beneficiary Management</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-1.5 font-display">
            <UserCheck className="h-5 w-5 text-orange-500" />
            Sovereign Recipient Registry
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Maintain whitelist validation status, wallet binding, and Travel Rule clearance checks of secure payees.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 font-bold text-xs text-slate-950 uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add New Recipient
        </button>
      </div>

      {/* CONDITIONAL ADD FORM */}
      {showAddForm && (
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <span className="text-xs font-mono font-bold text-orange-400">ADD NEW RECIPIENT COMPLIANCE PROFILE</span>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Recipient Legal Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Liam Sterling"
                className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded p-2.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Corporate Email Address (Optional)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="liam@domain.co"
                className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded p-2.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Residency / Jurisdiction</label>
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded p-2.5 text-xs text-slate-300 focus:outline-none"
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Destination Web3 Wallet address ID</label>
              <input 
                type="text" 
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
                placeholder="0x..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded p-2.5 text-xs text-slate-300 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">KYC Target Compliance Level</label>
              <select 
                value={kycLevel}
                onChange={(e) => setKycLevel(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded p-2.5 text-xs text-slate-300"
              >
                <option value="Level 1 (Basic)">Level 1 (Basic) - Payout Limit $1K</option>
                <option value="Level 2 (Standard)">Level 2 (Standard) - Payout Limit $10K</option>
                <option value="Level 3 (Enterprise)">Level 3 (Enterprise) - Unlimited payouts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Risk Category</label>
              <select 
                value={riskCategory}
                onChange={(e) => setRiskCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded p-2.5 text-xs text-slate-300"
              >
                <option value="Low">Low Risk Score</option>
                <option value="Medium">Medium Risk Warning</option>
                <option value="High">High Risk Check</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs uppercase cursor-pointer"
              >
                Onboard Recipient Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search onboarded recipients by name, wallet address, country region, or validation id..."
          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 pl-10 text-xs text-slate-350 focus:outline-none"
        />
      </div>

      {/* RECIPIENTS CARD LIST */}
      {filteredRecipients.length === 0 ? (
        
        /* PROFESSIONAL EMPTY STATE: NO RECIPIENTS */
        <div id="no-recipients-empty-state" className="bg-slate-950/60 p-16 rounded-xl border border-slate-805 border-dashed text-center space-y-3">
          <div className="h-12 w-12 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Inbox className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-400 tracking-tight">No Recipients Onboarded</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            There are currently no recipient compliance profiles in your sovereign directory database. Add a recipient legal name and verify their Web3 wallet binding to get started.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 text-xs text-orange-400 font-bold transition-all cursor-pointer"
            >
              Add Your First Recipient
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecipients.map((rec) => {
            const isSubmitted = rec.status === 'Submitted';
            return (
              <div key={rec.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
                
                {/* Holder identity brief */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">A-PASS REGISTERED</span>
                      <h4 className="text-sm font-bold text-slate-200 mt-0.5">{rec.name}</h4>
                      <p className="text-[10px] font-mono text-slate-500">{rec.email}</p>
                    </div>

                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase border ${
                      rec.status === 'Verified'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse'
                    }`}>
                      {rec.status}
                    </span>
                  </div>

                  {/* Badges indicators */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-1">
                    <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded border border-slate-900">
                      <Globe className="h-3 w-3 text-slate-500" />
                      <span>{rec.country}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded border border-slate-900">
                      <ShieldCheck className="h-3 w-3 text-slate-500" />
                      <span>{rec.kycLevel.split(' ')[0]} {rec.kycLevel.split(' ')[1] || ''}</span>
                    </div>
                  </div>
                </div>

                {/* Wallets checking */}
                <div className="space-y-1 bg-slate-900/50 p-3 rounded border border-slate-900">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-mono">DESTINATION WALLET KEY</span>
                    <span className="text-slate-450 font-bold font-mono text-[9px] text-orange-400">LEDGER ATTESTED</span>
                  </div>
                  <p className="text-[11px] text-slate-350 font-mono break-all leading-normal pt-1 flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    {rec.walletAddress}
                  </p>
                </div>

                {/* Validation triggers */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <div className={`h-2 w-2 rounded-full ${rec.status === 'Verified' ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                    <span>{rec.status === 'Verified' ? 'On-Chain Whitelisted' : 'Validation Needed'}</span>
                  </div>

                  {isSubmitted ? (
                    <button
                      onClick={() => verifyRecipientOnChain(rec.id)}
                      disabled={isVerifying === rec.id}
                      className="p-1 px-3 bg-orange-500 text-slate-950 font-bold text-[10px] uppercase font-mono tracking-wider cursor-pointer rounded hover:bg-orange-600 disabled:opacity-50 transition-colors inline-flex items-center gap-1"
                    >
                      {isVerifying === rec.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                      Verify Recipient
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      {onRemoveRecipient && (
                        <button
                          onClick={() => onRemoveRecipient(rec.id)}
                          className="text-slate-500 hover:text-rose-455 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove recipient"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wide flex items-center gap-0.5">
                        <CheckCircle className="h-3 w-3" />
                        A-Pass Cleared
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      )}

    </div>
  );
}
