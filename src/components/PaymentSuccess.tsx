import React from 'react';
import { 
  CheckCircle, FileText, Download, Wallet, ArrowRight, 
  ExternalLink, Sparkles, Award, ShieldCheck, Mail 
} from 'lucide-react';

interface PaymentSuccessProps {
  transaction: {
    id: string;
    recipientName: string;
    recipientAddress: string;
    amount: number;
    token: 'USDa' | 'EURa' | 'GBPa';
    txHash: string;
    riskScore: number;
    timestamp: string;
    purpose: string;
  };
  onClose: () => void;
}

export default function PaymentSuccess({ transaction, onClose }: PaymentSuccessProps) {
  
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(transaction.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const simulateDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Receipt compiled successfully! Dowloading File: CleanRoutePay_Receipt_${transaction.id}.pdf`);
    }, 1200);
  };

  const isTravelRule = transaction.amount >= 1000;

  return (
    <div id="payment-success-root" className="max-w-2xl mx-auto space-y-6 font-sans">
      
      {/* 1. COMPLIANCE SUCCESS CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Decorative corner flash background blur */}
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        {/* Main icon and success notice */}
        <div className="text-center space-y-3">
          <div className="h-16 w-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <CheckCircle className="h-9 w-9" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">SETTLEMENT COMPLETED SUCCESSFULLY</span>
            <h3 className="text-xl font-bold text-white font-display">Compliant Stablecoin Payout Emitted</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Your transaction has passed all zero-knowledge rule assertions and hash records are committed to the on-chain registry audit trails.
            </p>
          </div>
        </div>

        {/* COMPREHENSIVE VECTOR RECEIPT BLOCK */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">Payout Receipt Summary</span>
            <span className="text-xs font-semibold text-slate-400">ID: {transaction.id}</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Recipient Beneficiary</span>
              <span className="font-semibold text-slate-200">{transaction.recipientName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Recipient Web3 Wallet address</span>
              <span className="font-mono text-slate-400 text-[11px] truncate max-w-[200px]" title={transaction.recipientAddress}>
                {transaction.recipientAddress}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Transferred Stablecoin Amount</span>
              <span className="font-bold text-slate-100 font-mono">
                {transaction.amount.toLocaleString()} <span className="text-orange-400 font-sans font-normal">{transaction.token}</span>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Payout Purpose Declaratives</span>
              <span className="text-slate-350">{transaction.purpose || 'On-chain consultant payment'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Compliance Settlement Date</span>
              <span className="text-slate-400 font-mono text-[11px]">{transaction.timestamp}</span>
            </div>

            <div className="pt-2 border-t border-slate-905 flex justify-between items-center">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Compliance checks validation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wide flex items-center gap-0.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Passed Whitelisted
              </span>
            </div>

            {isTravelRule && (
              <div className="pt-2 border-t border-slate-905 flex justify-between items-start flex-col gap-1 sm:flex-row sm:items-center">
                <span className="text-slate-400 font-mono text-[10px] uppercase">FATF Travel Rule Attestation Hash</span>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 break-all">
                  ✓ GENERATED &amp; DEPLOYED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CRYPTOGRAPHIC TRANSACTION INDICATION ROW */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-900 flex justify-between items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-slate-500 font-bold">BLOCK TXHASH:</span>
            <span className="text-orange-400 truncate text-[11px] font-mono select-all">{transaction.txHash}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={handleCopyHash}
              className="text-[10px] p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 font-semibold cursor-pointer transition-colors"
            >
              {copied ? 'Copied' : 'Copy Hash'}
            </button>
            <button 
              className="p-1 px-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 cursor-pointer transition-colors"
              title="Query on explorer block"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* COMPLAINCE STAMPS / SEALS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-mono text-slate-500 pt-1">
          <div className="p-2 border border-slate-800 rounded bg-slate-950 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-500 shrink-0" />
            <span>Zero-Knowledge biometric checks completed by A-Pass registry</span>
          </div>

          <div className="p-2 border border-slate-800 rounded bg-slate-950 flex items-center gap-2">
            <Award className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>Travel Rule cert filed to compliance directory catalog</span>
          </div>
        </div>

        {/* DOWLOAD RECEIPT TIMELINE BUTTONS */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={simulateDownload}
            disabled={downloading}
            className="p-2 px-4 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-orange-400" />
            {downloading ? 'Compiling PDF Receipt...' : 'Download Cryptographic Receipt'}
          </button>

          <button
            onClick={onClose}
            className="p-2 px-5 rounded bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold uppercase text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            Go back to Explorer
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
