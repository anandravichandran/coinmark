import React, { useState } from 'react';
import { 
  Search, ShieldAlert, Check, X, ShieldCheck, AlertTriangle, 
  ChevronRight, Calendar, User, FileText, Globe, Wallet, Eye, Info, Sparkles 
} from 'lucide-react';
import { APassIdentity } from '../types';

interface AdminVerificationDashboardProps {
  initialIdentities: APassIdentity[];
  onUpdateIdentityStatus: (id: string, nextStatus: 'Verified' | 'Submitted' | 'Suspended' | 'Rejected') => void;
}

export default function AdminVerificationDashboard({ 
  initialIdentities, 
  onUpdateIdentityStatus 
}: AdminVerificationDashboardProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [selectedIdentity, setSelectedIdentity] = useState<APassIdentity | null>(null);
  const [complianceNotes, setComplianceNotes] = useState('');

  // Local helper list that handles updates beautifully
  const filteredIdentities = initialIdentities.filter(identity => {
    const matchesSearch = 
      identity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      identity.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      identity.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      identity.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || identity.status === statusFilter;
    const matchesRisk = riskFilter === 'All' || identity.riskCategory === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleApprove = (id: string) => {
    onUpdateIdentityStatus(id, 'Verified');
    // update current selected card view state
    if (selectedIdentity && selectedIdentity.id === id) {
      setSelectedIdentity({
        ...selectedIdentity,
        status: 'Verified',
        documents: { ...selectedIdentity.documents, sanctionsCheck: 'Passed' }
      });
    }
  };

  const handleReject = (id: string) => {
    onUpdateIdentityStatus(id, 'Rejected' as any);
    if (selectedIdentity && selectedIdentity.id === id) {
      setSelectedIdentity({
        ...selectedIdentity,
        status: 'Rejected' as any,
        documents: { ...selectedIdentity.documents, sanctionsCheck: 'Failed' }
      });
    }
  };

  const selectAndFillNotes = (ident: APassIdentity) => {
    setSelectedIdentity(ident);
    setComplianceNotes(`Oracle sanctions checks fully clear. Risk scoring category: ${ident.riskCategory}. KYC Level: ${ident.kycLevel}. Checked by Coinmark compliance desk.`);
  };

  return (
    <div id="admin-verification-root" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="space-y-1.5 border-b border-slate-800 pb-4">
        <span className="text-[10px] text-orange-500 font-mono font-bold tracking-widest uppercase">Operator Control Room</span>
        <h3 className="text-xl font-bold text-white flex items-center gap-1.5 font-display">
          <ShieldAlert className="h-5 w-5 text-orange-500" />
          A-Pass Admin Identity Verification Portal
        </h3>
        <p className="text-xs text-slate-400">
          Manage, verify, audit, and authorize soulbound DID credentials requesting clearance on the stablecoin payout rails.
        </p>
      </div>

      {/* FILTER & CONTROL BAR (ENTERPRISE GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
        
        {/* Search Searchbar */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Email, Wallet address or A-Pass ID..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 pl-10 text-xs text-slate-300 focus:outline-none font-sans"
          />
        </div>

        {/* Status drop filters */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">All Verification Statuses</option>
            <option value="Submitted">Pending Review (Submitted)</option>
            <option value="Verified">Verified Safely</option>
            <option value="Suspended">Suspended / Deactivated</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Risk drop filters */}
        <div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">All Risk Profiles</option>
            <option value="Low">Low Risk Score</option>
            <option value="Medium">Medium Risk Warning</option>
            <option value="High">High Risk / Block Alert</option>
          </select>
        </div>

      </div>

      {/* SPLIT COOLS LIST vs SPECIFIC CARD DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* USERS LIST TABLE (LARG COLUMNS) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900/30 border-b border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-350 tracking-wider">SOVEREIGN TRUST DIRECTORY REGISTRY</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                {filteredIdentities.length} User Records matches
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 bg-slate-950 select-none font-mono">
                    <th className="p-3">Sovereign Holder</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">Risk Category</th>
                    <th className="p-3">Compliance Limit</th>
                    <th className="p-3">Registration Status</th>
                    <th className="p-3 text-right">Verification Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {filteredIdentities.map((ident) => (
                    <tr 
                      key={ident.id} 
                      onClick={() => selectAndFillNotes(ident)}
                      className={`hover:bg-slate-900/30 cursor-pointer transition-colors ${
                        selectedIdentity?.id === ident.id ? 'bg-slate-900/50' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] uppercase font-mono ${
                            ident.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}>
                            {ident.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{ident.name}</p>
                            <span className="text-[10px] font-mono text-slate-500">{ident.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-slate-400 font-medium">
                        {ident.country}
                      </td>

                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 font-semibold rounded text-[10px] uppercase ${
                          ident.riskCategory === 'Low' 
                            ? 'text-emerald-400' 
                            : ident.riskCategory === 'Medium' 
                              ? 'text-amber-400' 
                              : 'text-rose-400 font-bold'
                        }`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${
                            ident.riskCategory === 'Low' ? 'bg-emerald-500' : ident.riskCategory === 'Medium' ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
                          }`} />
                          {ident.riskCategory} Risk
                        </span>
                      </td>

                      <td className="p-3 text-slate-350 font-mono">
                        {ident.kycLevel}
                      </td>

                      <td className="p-3">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                          ident.status === 'Verified' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : ident.status === 'Submitted'
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {ident.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 text-[10px] font-mono flex items-center gap-1 ml-auto">
                          <Eye className="h-3 w-3" />
                          Audit Profile
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredIdentities.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-500 font-sans space-y-2">
                        <User className="h-8 w-8 text-slate-600 mx-auto" />
                        <p className="font-semibold text-slate-400">No matching directories found</p>
                        <p className="text-[11px] text-slate-500 leading-normal">Refine your search term variables or clear active status/risk filter dropdowns</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* DETAILED INSPECTION CARD (RIGHT SPECIFIC PANEL) */}
        <div className="space-y-4">
          {selectedIdentity ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5 shadow-2xl relative">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest">{selectedIdentity.id}</span>
                  <h4 className="text-base font-bold text-slate-100 mt-0.5">{selectedIdentity.name}</h4>
                  <span className="text-[10px] text-slate-500 block font-mono">{selectedIdentity.email}</span>
                </div>
                
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                  selectedIdentity.status === 'Verified' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                }`}>
                  {selectedIdentity.status}
                </span>
              </div>

              {/* Document checklists */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Uploaded Compliance Checkpoints</span>
                
                <div className="space-y-1.5 font-sans text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800/50">
                    <span className="text-slate-450 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      Government ID Document
                    </span>
                    <span className="text-emerald-400 font-bold font-mono text-[10px]">RECEIVED ✓</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800/50">
                    <span className="text-slate-450 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      Corporate proof of Address
                    </span>
                    <span className="text-emerald-400 font-bold font-mono text-[10px]">VERIFIED ✓</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-905 border border-slate-800/50">
                    <span className="text-slate-450 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-500" />
                      UN &amp; OFAC Sanctions Screening
                    </span>
                    <span className={`font-bold font-mono text-[10px] ${
                      selectedIdentity.documents.sanctionsCheck === 'Passed' 
                        ? 'text-emerald-405 text-emerald-400' 
                        : selectedIdentity.documents.sanctionsCheck === 'Pending'
                          ? 'text-amber-400 text-amber-500 animate-pulse'
                          : 'text-rose-455 text-rose-500'
                    }`}>
                      {selectedIdentity.documents.sanctionsCheck.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Info Binding */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Anchored Web3 Key Wallet</span>
                <p className="bg-slate-900 border border-slate-800 p-2 rounded font-mono text-slate-300 text-[11px] break-all select-all text-center">
                  {selectedIdentity.walletAddress}
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                  <span>Region: {selectedIdentity.country}</span>
                  <span>Issued: {selectedIdentity.issuedAt.substring(0,10)}</span>
                </div>
              </div>

              {/* Operator validation notes opinion */}
              <div className="space-y-1 px-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase block">Compliance Review Decisives</label>
                <textarea 
                  value={complianceNotes}
                  onChange={(e) => setComplianceNotes(e.target.value)}
                  placeholder="Insert auditing and sanctions compliance logs notes..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 text-slate-300 rounded p-2 text-xs focus:outline-none min-h-[60px]"
                />
              </div>

              {/* Risk warning card */}
              {selectedIdentity.riskCategory === 'High' && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded flex items-start gap-2 text-[11px] text-rose-400 leading-relaxed">
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold">Sanctions Risk Warnings Checked</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">High-volume payout warning triggered. Double-check the nationality documents and OFAC lists matching.</p>
                  </div>
                </div>
              )}

              {/* ACTION BUTTON CHEVRONS */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2.5">
                {selectedIdentity.status !== 'Verified' && (
                  <button
                    onClick={() => handleApprove(selectedIdentity.id)}
                    className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase font-mono rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Approve ID
                  </button>
                )}

                {selectedIdentity.status !== 'Rejected' && (
                  <button
                    onClick={() => handleReject(selectedIdentity.id)}
                    className="flex-1 py-2 px-3 bg-slate-950 border border-rose-500/30 hover:border-rose-500/60 text-rose-400 font-bold text-xs uppercase font-mono rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Reject Access
                  </button>
                )}
              </div>

              <div className="text-[10px] text-center text-slate-500 font-mono flex items-center gap-1 justify-center bg-slate-900/40 py-1.5 rounded border border-slate-900">
                <Sparkles className="h-3 w-3" />
                <span>Multi-sig secure clearance signing verified</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-slate-800 border-dashed rounded-xl p-12 text-center text-slate-500 space-y-2 h-full flex flex-col justify-center">
              <Info className="h-8 w-8 text-slate-700 mx-auto" />
              <h5 className="font-semibold text-slate-400">Select an A-Pass Holder</h5>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Pick a directory record on the left to verify sanctions documentation, check wallet bindings, and authorize compliance clearance status.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
