import React, { useState } from 'react';
import { 
  User, Calendar, Globe, FileText, Wallet, CheckCircle, 
  ArrowRight, ArrowLeft, Check, Sparkles, AlertTriangle, ShieldCheck
} from 'lucide-react';

interface KycWizardProps {
  onComplete: (data: any) => void;
  initialValues?: {
    name?: string;
    email?: string;
    wallet?: string;
    country?: string;
  };
}

export default function KycWizard({ onComplete, initialValues = {} }: KycWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Form states
  // Step 1
  const [fullName, setFullName] = useState(initialValues.name || 'Alex Rivera');
  const [dob, setDob] = useState('1992-08-14');
  const [nationality, setNationality] = useState(initialValues.country || 'United States');
  const [country, setCountry] = useState(initialValues.country || 'United States');
  
  // Step 2
  const [idType, setIdType] = useState<'Passport' | 'DriversLicense' | 'NationalID'>('Passport');
  const [idNumber, setIdNumber] = useState('N-4920210A');
  const [issuingCountry, setIssuingCountry] = useState(initialValues.country || 'United States');
  const [expirationDate, setExpirationDate] = useState('2032-12-31');
  
  // Step 3
  const [walletAddress, setWalletAddress] = useState(initialValues.wallet || '0x78ab28c91d84f9de82a3c74b1049c321');
  const [blockchainNetwork, setBlockchainNetwork] = useState('Ethereum Mainnet (Compliance Gated)');
  const [isWalletVerified, setIsWalletVerified] = useState(true);
  const [isVerifyingWallet, setIsVerifyingWallet] = useState(false);

  const countries = [
    'United States', 'United Kingdom', 'Singapore', 'Germany', 
    'Argentina', 'Cyprus', 'India', 'Panama'
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as any);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const verifyWallet = () => {
    setIsVerifyingWallet(true);
    setTimeout(() => {
      setIsVerifyingWallet(false);
      setIsWalletVerified(true);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      fullName,
      dob,
      nationality,
      country,
      idType,
      idNumber,
      issuingCountry,
      expirationDate,
      walletAddress,
      blockchainNetwork,
      verifiedAt: new Date().toISOString().substring(0, 10)
    });
  };

  return (
    <div id="kyc-wizard-root" className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Visual Header Indicator */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-sky-500" />
      
      {/* Steps Progress Ribbon */}
      <div className="bg-slate-950 p-4 border-b border-slate-800/80 flex justify-between items-center text-xs overflow-x-auto">
        {[
          { num: 1, label: 'Personal Details', icon: User },
          { num: 2, label: 'Identity Check', icon: FileText },
          { num: 3, label: 'Wallet Binding', icon: Wallet },
          { num: 4, label: 'Review & Submit', icon: ShieldCheck }
        ].map((s) => {
          const Icon = s.icon;
          const isDone = step > s.num;
          const isActive = step === s.num;
          return (
            <div key={s.num} className="flex items-center gap-2 whitespace-nowrap px-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold transition-all text-[11px] ${
                isDone 
                  ? 'bg-orange-500 text-slate-950' 
                  : isActive 
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 font-bold' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}>
                {isDone ? <Check className="h-3 w-3" strokeWidth={3} /> : s.num}
              </div>
              <span className={`text-[11px] font-medium font-mono ${
                isActive ? 'text-orange-400 font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {s.label}
              </span>
              {s.num < 4 && <div className="h-0.5 w-6 bg-slate-800 hidden sm:block" />}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-orange-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Step 1 of 4: Decentralized Demographics
            </div>
            <h4 className="text-base font-bold text-white">Enter Your Demographics Certificate</h4>
            <p className="text-xs text-slate-400">Your information is attested on-chain to the A-Pass soulbound DID envelope without exposing cleartext logs to unauthorized pools.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Legal Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 pl-10 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 pl-10 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nationality</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <select 
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 pl-10 text-xs text-slate-300 focus:outline-none"
                  >
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Country of Permanent Residence</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 pl-10 text-xs text-slate-300 focus:outline-none"
                  >
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Identity Verification */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-orange-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Step 2 of 4: Government Credentials
            </div>
            <h4 className="text-base font-bold text-white">Identity Credentials Input</h4>
            <p className="text-xs text-slate-400">Declare standard government credentials matching your region to trigger compliant database querying checks.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Identity Document Type</label>
                <select 
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="Passport">International Passport Certificate</option>
                  <option value="DriversLicense">Driver License Signature</option>
                  <option value="NationalID">National Sovereign Registration ID</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Document ID Number</label>
                <input 
                  type="text" 
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                  placeholder="e.g. AA 912003"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Issuing Jurisdiction Country</label>
                <select 
                  value={issuingCountry}
                  onChange={(e) => setIssuingCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Document Expiration Date</label>
                <input 
                  type="date" 
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Wallet Binding */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-orange-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Step 3 of 4: Cryptographic Wallet Key Anchor
            </div>
            <h4 className="text-base font-bold text-white">Anchor Compliant Web3 Payout Wallet</h4>
            <p className="text-xs text-slate-400 font-sans">A-Pass matches verification to a specific cryptographic address, ensuring whitelist compliance with A-Token automated guard rails.</p>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Payout Destination Wallet Address</label>
                <input 
                  type="text" 
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    setIsWalletVerified(false);
                  }}
                  required
                  placeholder="0x..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Compliance Blockchain Network</label>
                <select 
                  value={blockchainNetwork}
                  onChange={(e) => setBlockchainNetwork(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="Ethereum Mainnet (Compliance Gated)">Ethereum Mainnet (Compliance Gated)</option>
                  <option value="Arbitrum One (L2 Instant Settlement Node)">Arbitrum One (L2 Instant Settlement Node)</option>
                  <option value="Polygon Proof of Stake (Gas Exempt Vault)">Polygon Proof of Stake (Gas Exempt Vault)</option>
                  <option value="Coinmark Pay Sandbox Test Network">Coinmark Pay Sandbox Test Network</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${isWalletVerified ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-[11px] font-mono font-medium text-slate-300">
                    {isWalletVerified ? 'Signature Handshake Validated' : 'Handshake Signing Required'}
                  </span>
                </div>
                {!isWalletVerified ? (
                  <button
                    type="button"
                    onClick={verifyWallet}
                    disabled={isVerifyingWallet}
                    className="p-1 px-3 rounded bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 font-bold text-[10px] uppercase font-mono tracking-wider cursor-pointer"
                  >
                    {isVerifyingWallet ? 'Verifying Key...' : 'Sign Verification Message'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsWalletVerified(false)}
                    className="text-[10px] text-slate-500 hover:text-slate-400 font-mono transition-colors cursor-pointer"
                  >
                    unlink &amp; sign another key
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-orange-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Step 4 of 4: Attest &amp; Submit Review
            </div>
            <h4 className="text-base font-bold text-white">Review Verified Profile Summary</h4>
            <p className="text-xs text-slate-400 font-sans">Verify your details before broadcasting to the Coinmark Pay compliance directory.</p>

            {/* Comprehensive Detail Summary Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-900">
              <div className="p-4 flex justify-between items-center bg-slate-900/30">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Category</span>
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Entered Profile Data</span>
              </div>
              
              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-400">Legal Name</span>
                <span className="font-semibold text-slate-200">{fullName}</span>
              </div>

              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-400">Date of Birth &amp; Nationality</span>
                <span className="font-semibold text-slate-200">{dob} • {nationality}</span>
              </div>

              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-400">Identity Document Details</span>
                <span className="font-semibold text-slate-200 font-mono text-[11px]">{idType}: {idNumber}</span>
              </div>

              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-400">Exp Country / Expired</span>
                <span className="font-semibold text-slate-200">{issuingCountry} (Ends {expirationDate})</span>
              </div>

              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-400">Verified Binding Address</span>
                <span className="font-mono text-orange-400 text-[11px] tracking-tight">{walletAddress}</span>
              </div>

              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-400">Cryptographic Ledger Anchor</span>
                <span className="text-slate-300 font-semibold">{blockchainNetwork}</span>
              </div>
            </div>

            <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg flex gap-3 text-[11px] text-orange-300/90 leading-relaxed font-sans">
              <AlertTriangle className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
              <span>
                By executing this submission, you attest under penalty of perjury that the primary credentials provided are fully authorized, matches valid passports, and that the linked Web3 wallet belongs exclusively to your sovereign trust.
              </span>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-850/50 rounded-lg text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs uppercase cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold font-mono text-xs uppercase cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-colors"
            >
              Submit KYC &amp; Generate A-Pass
              <Check className="h-4 w-4" strokeWidth={3} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
