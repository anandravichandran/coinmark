import React, { useState } from 'react';
import { 
  CheckCircle, Clock, ShieldAlert, Sparkles, AlertCircle, Ban, 
  HelpCircle, RefreshCw, Send, ArrowRight, CornerDownRight, ShieldCheck 
} from 'lucide-react';

interface KycStatusTrackingProps {
  currentIdentity?: {
    id: string;
    name: string;
    email: string;
    country: string;
    walletAddress: string;
    kycLevel: string;
    status: string;
  };
}

export default function KycStatusTracking({ currentIdentity }: KycStatusTrackingProps) {
  // Let's allow users to simulate different status timelines to see beautiful professional UI layouts
  const [selectedSimStatus, setSelectedSimStatus] = useState<'Submitted' | 'Under_Review' | 'APass_Generated' | 'Verified' | 'Rejected' | 'Frozen'>('Verified');

  const defaultIdDetails = currentIdentity || {
    id: 'AP-2026-8910',
    name: 'your_name Varga',
    email: 'your_name.v@cleanverse.net',
    country: 'Argentina',
    walletAddress: '0x098d...1ea1',
    kycLevel: 'Level 2 (Standard)',
    status: 'Verified'
  };

  const getStepStatus = (stepNum: number) => {
    const statusOrder = ['Submitted', 'Under_Review', 'APass_Generated', 'Verified', 'Rejected', 'Frozen'];
    const activeIndex = statusOrder.indexOf(selectedSimStatus);
    
    // Split branches based on Rejected / Frozen
    if (selectedSimStatus === 'Rejected') {
      if (stepNum <= 3) return 'completed';
      if (stepNum === 4) return 'error-rejected';
      return 'disabled';
    }

    if (selectedSimStatus === 'Frozen') {
      if (stepNum <= 4) return 'completed';
      if (stepNum === 5) return 'error-frozen';
      return 'disabled';
    }

    // Normal successful progression
    if (stepNum <= activeIndex + 1) {
      return stepNum === activeIndex + 1 ? 'active' : 'completed';
    }
    return 'disabled';
  };

  const getTimelineSteps = () => {
    return [
      {
        num: 1,
        title: 'Documents Submitted',
        desc: 'Demographic variables and credentials uploaded to sovereign DID vault.',
        date: '2026-06-13 10:41:02',
        info: 'Soulbound A-Pass anchor created in directory ledger.'
      },
      {
        num: 2,
        title: 'Oracle Under Review',
        desc: 'Sovereign screening and biometric face-mapping run against compliance databases.',
        date: '2026-06-13 11:15:30',
        info: 'UN Watchlist & OFAC sanctions checklists queried.'
      },
      {
        num: 3,
        title: 'A-Pass Soulbound Generated',
        desc: 'Cryptographic identity credentials bound with target destination wallet.',
        date: '2026-06-13 12:00:15',
        info: 'DID Document linked on arbitrated stablecoin router.'
      },
      {
        num: 4,
        title: 'Sovereign Verified',
        desc: 'Compliant A-Pass badge issued. Free to claim instant high-volume stablecoin transfers.',
        date: '2026-06-13 12:10:00',
        info: 'Valid for global payout channels until renewal epoch.'
      },
      {
        num: 5,
        title: 'Revoked / Frozen',
        desc: 'Emergency security block deployed. Whitelist credential deactivated in rules engine.',
        date: '2026-06-14 05:30:11',
        info: 'Requires multi-signature guardian arbitration to release status.'
      }
    ];
  };

  return (
    <div id="kyc-tracking-root" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <span className="text-[10px] text-orange-500 font-mono font-bold tracking-widest uppercase">TRUST DIRECTORY PROTOCOL</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-1.5 font-display">
            <ShieldCheck className="h-5 w-5 text-orange-500" />
            KYC Progress &amp; Sovereign Status Tracker
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Audit live compliance progression files of your decentralized identity across key checkpoint timelines.</p>
        </div>

        {/* Simulator Switcher */}
        <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-[9px] font-mono text-slate-500 font-bold uppercase px-2">SIMULATE:</span>
          {(['Submitted', 'Under_Review', 'APass_Generated', 'Verified', 'Rejected', 'Frozen'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedSimStatus(st)}
              className={`text-[10px] px-2 py-1 rounded font-mono transition-colors font-bold ${
                selectedSimStatus === st
                  ? st === 'Verified' ? 'bg-emerald-500 text-slate-950' : st === 'Rejected' || st === 'Frozen' ? 'bg-rose-500 text-white' : 'bg-orange-500 text-slate-950'
                  : 'bg-slate-905 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PROGRESS FLOW TIMELINE (LEFT 2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-6 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {getTimelineSteps().map((step) => {
              const stepStatus = getStepStatus(step.num);
              
              let stepIconColor = 'bg-slate-950 text-slate-700 border-slate-800';
              let lineTitleColor = 'text-slate-500';
              let lineDescColor = 'text-slate-500';
              
              if (stepStatus === 'completed') {
                stepIconColor = 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold';
                lineTitleColor = 'text-slate-100 font-bold';
                lineDescColor = 'text-slate-350';
              } else if (stepStatus === 'active') {
                stepIconColor = 'bg-orange-500 text-slate-150 border-orange-400 animate-pulse font-extrabold';
                lineTitleColor = 'text-orange-400 font-bold';
                lineDescColor = 'text-slate-300';
              } else if (stepStatus === 'error-rejected') {
                stepIconColor = 'bg-rose-600 text-white border-rose-500';
                lineTitleColor = 'text-rose-400 font-bold';
                lineDescColor = 'text-slate-300';
              } else if (stepStatus === 'error-frozen') {
                stepIconColor = 'bg-rose-600 text-white border-rose-500';
                lineTitleColor = 'text-rose-500 font-extrabold uppercase tracking-wide';
                lineDescColor = 'text-slate-300';
              }

              // Hide default Frozen log if simulating other successful runs
              if (step.num === 5 && selectedSimStatus !== 'Frozen') return null;
              // If rejected, replace sovereign index 4 step details with Reject log
              let titleText = step.title;
              let descriptionText = step.desc;
              if (step.num === 4 && selectedSimStatus === 'Rejected') {
                titleText = 'Verification Denied';
                descriptionText = 'Democratic parameters failed OFAC screening bounds or database validation did not match.';
              }

              return (
                <div key={step.num} className="relative group transition-all">
                  
                  {/* Floating Circle Checkpoint indicator */}
                  <div className={`absolute -left-[21px] top-1 h-6 w-6 rounded-full flex items-center justify-center text-xs border transition-colors ${stepIconColor}`}>
                    {stepStatus === 'completed' ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : stepStatus === 'error-rejected' || stepStatus === 'error-frozen' ? (
                      <Ban className="h-3.5 w-3.5" strokeWidth={2.5} />
                    ) : (
                      step.num
                    )}
                  </div>

                  {/* Log description */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5 transition-all hover:bg-slate-950/90 hover:border-slate-700/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className={`text-sm ${lineTitleColor}`}>{titleText}</span>
                      <span className="text-[10px] font-mono text-slate-500">{step.date}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${lineDescColor}`}>{descriptionText}</p>
                    
                    <div className="flex items-center gap-2 pl-2 border-l border-orange-500/30 text-[10px] font-mono text-slate-500">
                      <CornerDownRight className="h-3 w-3 text-orange-500" />
                      <span>Ledger cert: {step.info}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STATUS BRIEFING DETAILS PANEL (RIGHT 1 COL) */}
        <div className="space-y-4">
          
          {/* Identity Brief */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">Target Identity Profile</h4>
            
            <div className="space-y-3 divide-y divide-slate-900 font-sans text-xs">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Holder Legal Name</span>
                <span className="font-semibold text-slate-200">{defaultIdDetails.name}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Issued Residency</span>
                <span className="font-semibold text-slate-200">{defaultIdDetails.country}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Bound Wallet Anchor</span>
                <span className="font-mono text-slate-400 text-[11px] font-bold">{defaultIdDetails.walletAddress}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Compliance Limit</span>
                <span className="font-semibold text-slate-200">{defaultIdDetails.kycLevel}</span>
              </div>
              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Timeline Status</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                  selectedSimStatus === 'Verified' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : selectedSimStatus === 'Rejected' || selectedSimStatus === 'Frozen'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                }`}>
                  {selectedSimStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Guidance Alerts based on simulated status */}
          {selectedSimStatus === 'Verified' && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2 text-xs font-sans">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle className="h-4 w-4" />
                White-listed &amp; Active
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Your A-Pass profile status has been whitelisted across corporate smart rules checking engines. Ready to receive instant compliant payouts globally.
              </p>
            </div>
          )}

          {selectedSimStatus === 'Under_Review' && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2 text-xs font-sans">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold animate-pulse">
                <Clock className="h-4 w-4" />
                Querying watchlist lists
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Database screening oracle checking registers against OFAC and FinCEN sanctions updates. Handshake typically completes within 10 minutes.
              </p>
            </div>
          )}

          {(selectedSimStatus === 'Rejected' || selectedSimStatus === 'Frozen') && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-2 text-xs font-sans">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <Ban className="h-4 w-4" />
                ACCESS DENIED / DEACTIVATED
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Whitelist status was cancelled due to compliance mismatch or sanctions flags. To file a recovery appeal with credentials arbitration, contact the Coinmark compliance desk.
              </p>
            </div>
          )}

          <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[9px] font-mono uppercase text-slate-500 font-bold">Need assistance?</span>
            <p className="text-[11px] text-slate-400 leading-normal">Our decentralized compliance keepers are available to review state blocks via sovereign multi-sig validation.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
