import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, ArrowRight, User, Wallet, Globe, 
  HelpCircle, Scale, AlertTriangle, Cpu, Check, FileText, BarChart3 
} from 'lucide-react';
import { Transaction } from '../types';
import RiskGauge from './RiskGauge';

interface PaymentReviewProps {
  pendingPayout: {
    recipientName: string;
    recipientAddress: string;
    amount: number;
    token: 'USDa' | 'EURa' | 'GBPa';
    purpose: string;
    riskScore: number;
    ruleChecks?: string[];
  };
  senderDetails?: {
    name: string;
    wallet: string;
    level: string;
  };
  onExecute: () => void;
  onCancel: () => void;
}

export default function PaymentReviewAndCompliance({ 
  pendingPayout, 
  senderDetails, 
  onExecute, 
  onCancel 
}: PaymentReviewProps) {
  
  const [isSignLoading, setIsSignLoading] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(true);

  const defaultSender = senderDetails || {
    name: 'Cleanverse Labs Inc.',
    wallet: '0x3f5c...a812',
    level: 'Enterprise Tier 3'
  };

  const handleExecute = () => {
    if (!agreementChecked) return;
    setIsSignLoading(true);
    setTimeout(() => {
      setIsSignLoading(false);
      onExecute();
    }, 1400); // realistic signing delay!
  };

  const isTravelRuleRequired = pendingPayout.amount >= 1000;
  const isHighRisk = pendingPayout.riskScore > 50;

  return (
    <div id="payment-review-compliance-root" className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden font-sans max-w-4xl mx-auto">
      
      {/* 1. COMPLIANCE STATUS RIBBON */}
      <div className={`p-4 text-xs font-semibold tracking-wider font-mono flex items-center justify-between uppercase ${
        isHighRisk 
          ? 'bg-rose-500/10 text-rose-400 border-b border-rose-500/20' 
          : isTravelRuleRequired
            ? 'bg-amber-500/10 text-amber-400 border-b border-amber-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20'
      }`}>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
          <span>
            {isHighRisk 
              ? 'WARNING Status: High Risk profile check Required' 
              : isTravelRuleRequired 
                ? 'COMPLIANCE GATEWAY: TRAVEL RULE HANDSHAKE MANDATED' 
                : 'CLEARED Status: Instant stablecoin settlement pre-approved'
            }
          </span>
        </div>
        <span>ORACLE STATUS V37</span>
      </div>

      <div className="p-6 space-y-6">
        
        {/* HEADER */}
        <div className="space-y-1">
          <span className="text-[10px] text-orange-500 font-mono font-bold tracking-widest uppercase">SECURE CLEARING CHECKPOINT</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-1.5 font-display">
            <Scale className="h-5 w-5 text-orange-500" />
            Pre-flight stablecoin compliance Review
          </h3>
          <p className="text-xs text-slate-400">
            Verify transaction audit details, recipient soulbound identities, and network Travel Rule compliance parameters below.
          </p>
        </div>

        {/* PRIMARY DETAILS GRID: LEFT DETAILS, RIGHT COMPLIANCE MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SENDER, RECEIVER & parameters (2 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* TRANSACTION DIRECTION CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* SENDER CARD */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">ORIGINATOR SENDER</span>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{defaultSender.name}</h5>
                    <span className="text-[10px] font-mono text-slate-500">{defaultSender.level}</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-400 flex items-center gap-1.5 border border-slate-900 truncate">
                  <Wallet className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>0x3f5c88c91d84a1e9e2a3c74b1049a812</span>
                </div>
              </div>

              {/* BENEFICIARY RECEIVER CARD */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">BENEFICIARY RECEIVER</span>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-mono font-bold text-xs uppercase">
                    {pendingPayout.recipientName ? pendingPayout.recipientName[0] : 'R'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{pendingPayout.recipientName}</h5>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase flex items-center gap-0.5">
                      ✓ A-Pass Validated
                    </span>
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-400 flex items-center gap-1.5 border border-slate-900 truncate">
                  <Wallet className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>{pendingPayout.recipientAddress}</span>
                </div>
              </div>

            </div>

            {/* TRANSACTION PARAMS BILLING DETAILS CARD */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">TRANSFER INTENT &amp; AMOUNT</span>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                    {pendingPayout.amount.toLocaleString()} <span className="text-sm font-sans font-normal text-orange-400">{pendingPayout.token}</span>
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    USDT Counterpart: ~{(pendingPayout.amount * (pendingPayout.token === 'EURa' ? 1.08 : pendingPayout.token === 'GBPa' ? 1.25 : 1)).toLocaleString()} USDa
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-350 block uppercase">PAYMENT PURPOSE</span>
                  <span className="text-xs text-slate-400">{pendingPayout.purpose || 'Freelancer dev services contract agreement'}</span>
                </div>
              </div>
            </div>

            {/* EXPANDED COMPLIANCE AND PROTOCOL MANUAL RUNCHECKS */}
            <div className="space-y-2 bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide block">Automated Ledger Checkpoints Runlogs</span>
              
              <div className="space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between border-b border-slate-900 py-1.5">
                  <span className="text-slate-400">OFAC / SDN List Sanctions Database Screening</span>
                  <span className="text-emerald-400 font-mono font-bold text-[10px]">SUCCESS PASSED ✓</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-900 py-1.5">
                  <span className="text-slate-400">Stablecoin Daily Volume Velocity Checks</span>
                  <span className="text-emerald-400 font-mono font-bold text-[10px]">CLEAR APPROVED ✓</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-900 py-1.5">
                  <span className="text-slate-400 font-mono text-[11px]">FATF Travel Rule Attestation</span>
                  <span className={`font-mono font-bold text-[10px] ${
                    isTravelRuleRequired ? 'text-amber-400 animate-pulse' : 'text-slate-500'
                  }`}>
                    {isTravelRuleRequired ? 'MANDATED - REPORT CREATED' : 'EXEMPT - BELOW $1,000 VALUE'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Target Geofencing Blacklist Checks</span>
                  <span className="text-emerald-400 font-mono font-bold text-[10px]">AUTHORIZED PASS ✓</span>
                </div>
              </div>
            </div>

          </div>

          {/* RISK GAUGE COLUMN (1 COL) */}
          <div className="space-y-4">
            
            {/* RISK CONTAINER */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col items-center text-center space-y-4 relative justify-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">A-Token security Risk Profile</span>
              
              {/* Dynamic Risk gauge display */}
              <div className="w-44 h-24 relative overflow-hidden flex items-end justify-center">
                <div className="absolute inset-0 border-[16px] border-slate-900 rounded-full" />
                <div className={`absolute inset-0 border-[16px] rounded-full border-t-0 border-l-0 transform rotate-[45deg] ${
                  isHighRisk ? 'border-rose-500' : isTravelRuleRequired ? 'border-amber-500' : 'border-emerald-500'
                }`} />
                <span className="text-3xl font-extrabold font-mono text-white relative z-10 bottom-1">
                  {pendingPayout.riskScore}
                </span>
                <span className="text-[10px] text-slate-500 absolute bottom-1 block font-mono">SCORED OUT OF 100</span>
              </div>

              <div>
                <span className={`text-xs font-bold uppercase ${
                  isHighRisk ? 'text-rose-455 text-rose-400' : isTravelRuleRequired ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {isHighRisk ? 'High compliance Warning' : isTravelRuleRequired ? 'Medium Rule Checking' : 'Low Compliance Risk'}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[150px] mx-auto leading-normal">
                  Calculated dynamically from recipient geographic indices and wallet transaction age profiles.
                </p>
              </div>
            </div>

            {/* Travel Rule status instructions card */}
            {isTravelRuleRequired && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1 text-[11px] text-amber-300 leading-normal">
                <span className="font-mono font-bold uppercase tracking-wider block text-[10px]">Travel Rule attestation required</span>
                <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
                  Stablecoin value is equal or greater than $1,000 USD. A Travel Rule report (originator and beneficiary VASP names) will be hashed onto the transaction metadata.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* COMPLIANCE TERM INDEMNITY CHECKBOX */}
        <div className="pt-3 border-t border-slate-800 space-y-4 font-sans">
          <label className="flex gap-2.5 items-start text-xs text-slate-400 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
              className="mt-0.5 rounded border-slate-800 bg-slate-950 focus:border-orange-500 text-orange-500 h-4 w-4 shrink-0 transition-all cursor-pointer"
            />
            <span>
              I authorize the on-chain issuance of this stablecoin payment and certify that all A-Pass verification declarations to be compiled within the cryptographically-signed transaction are current.
            </span>
          </label>

          {/* ACTION BUTTON CHEVRONS */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-850/50 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel &amp; Edit parameters
            </button>

            <button
              onClick={handleExecute}
              disabled={!agreementChecked || isSignLoading}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs uppercase rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              {isSignLoading ? (
                <>
                  <Cpu className="h-4 w-4 animate-spin" />
                  Generating Travel Rule Hash &amp; Signing...
                </>
              ) : (
                <>
                  Execute payout settlement
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
