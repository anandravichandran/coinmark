import React from 'react';
import { 
  Fingerprint, Wallet, Globe, ShieldCheck, HelpCircle, 
  RefreshCw, Award, Copy, Check, Download, ExternalLink, Sparkles 
} from 'lucide-react';
import { APassIdentity } from '../types';

interface APassProfileProps {
  identity?: APassIdentity | null;
  onRefresh?: () => void;
}

export default function APassProfile({ identity, onRefresh }: APassProfileProps) {
  const [copied, setCopied] = React.useState(false);

  const defaultIdentity: APassIdentity = identity || {
    id: 'AP-2026-3912',
    name: 'your_name Varga',
    email: 'your_name.v@cleanverse.net',
    type: 'Freelancer',
    country: 'Argentina',
    kycLevel: 'Level 2 (Standard)',
    status: 'Verified',
    walletAddress: '0x321a9c8f1e29c8fb9a83d721faea831c',
    issuedAt: '2026-06-13 14:10:02',
    riskCategory: 'Low',
    documents: {
      idDocument: true,
      proofOfAddress: true,
      sanctionsCheck: 'Passed'
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultIdentity.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div id="apass-profile-root" className="max-w-2xl mx-auto space-y-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="space-y-1">
        <span className="text-[10px] text-orange-500 font-mono font-bold tracking-widest uppercase">My Soulbound Credentials</span>
        <h3 className="text-xl font-bold text-white flex items-center gap-1.5 font-display">
          <Fingerprint className="h-5 w-5 text-orange-500" />
          A-Pass Decentralized Identity Profile
        </h3>
        <p className="text-xs text-slate-400">
          This digital identity profile acts as an attested compliance certificate. Standard payouts can verify you dynamically without revealing cleartext passports.
        </p>
      </div>

      {/* HOLOGRAPHIC A-PASS PASSPORT */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-950 via-[#0b1329] to-slate-950 border border-slate-800 shadow-2xl p-6 text-slate-200">
        
        {/* Hologram subtle lighting effects */}
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        
        {/* Dynamic decorative grids */}
        <div className="absolute right-4 top-4 stroke-slate-800 opacity-20 pointer-events-none">
          <svg width="100" height="100" fill="none" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
            </pattern>
            <rect width="1005" height="100" fill="url(#grid)"/>
          </svg>
        </div>

        {/* Passport Content Layout */}
        <div className="space-y-6 relative z-10">
          
          {/* TOP ALIGN: ID Badge and Sovereign seal */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 font-bold block uppercase">SOULBOUND COMPLIANCE ID</span>
                <span className="text-sm font-bold tracking-wider font-mono text-white select-all">{defaultIdentity.id}</span>
              </div>
            </div>

            {/* Compliance Badge */}
            <div className="flex flex-col items-end">
              <span className={`inline-flex items-center gap-1 font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider border ${
                defaultIdentity.status === 'Verified'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-md shadow-emerald-500/5'
                  : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              }`}>
                <Award className="h-3.5 w-3.5" />
                A-Pass Active
              </span>
              <span className="text-[9px] text-slate-500 tracking-tight mt-1 font-mono">SOVEREIGN ATTESTED</span>
            </div>
          </div>

          {/* MIDDLE ALIGN: PRIMARY DETAILS PROFILE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Holder Legal Name</span>
              <p className="text-base font-bold text-slate-100">{defaultIdentity.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Email Register Address</span>
              <p className="text-sm font-semibold text-slate-350">{defaultIdentity.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Primary Jurisdiction Country</span>
              <div className="flex items-center gap-1.5 text-slate-300 font-medium text-sm">
                <Globe className="h-4 w-4 text-slate-500" />
                {defaultIdentity.country}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Sub Tier Certification Level</span>
              <p className="text-sm font-bold text-slate-300 font-mono">
                {defaultIdentity.kycLevel} 
                <span className="text-[10px] font-normal text-slate-500 ml-1.5">(Sub-tier: FATF Compliant)</span>
              </p>
            </div>

          </div>

          {/* BOTTOM ALIGN: WALLET BINDING KEY */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900 space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Attested Bound Web3 Wallet Address</span>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-orange-400 font-mono text-xs overflow-hidden">
                <Wallet className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate select-all">{defaultIdentity.walletAddress}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handleCopy}
                  className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy wallet address string"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button 
                  className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Query explorer logs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* AUDIT METADATA TIMELINE CHIPS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900 gap-2">
            <span className="font-mono">INITIAL CREATION: {defaultIdentity.issuedAt}</span>
            <span className="font-mono text-emerald-400 flex items-center gap-1 uppercase font-bold">
              <Sparkles className="h-3 w-3" />
              Cryptographic status validated: Passed
            </span>
          </div>

        </div>

      </div>

      {/* QUICK INSTRUCTION DETAILS PANEL */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 font-sans">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">A-Pass Regulatory Integration Manual</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          This attested identity profile acts as an off-chain digital credential conforming to FATF Recommendation 16 (Travel Rule standards). When sending or receiving payouts from compliant institutions:
        </p>
        <div className="space-y-1.5 pl-3 border-l-2 border-orange-500/30 text-xs text-slate-400">
          <p>✓ 1. Whitelisting checks dynamically references your linked A-Pass DID.</p>
          <p>✓ 2. Payout rules checking bypasses transaction limits automatically.</p>
          <p>✓ 3. Sanctions screens pass instantly using our zero-knowledge biometric proofs.</p>
        </div>

        {onRefresh && (
          <div className="pt-2">
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Query sovereign oracle check status...
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
