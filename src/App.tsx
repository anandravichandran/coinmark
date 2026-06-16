import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, Lock, Scale, Building, User, CheckCircle, X, 
  ChevronRight, Calendar, FileText, Globe, Wallet, Eye, Info, 
  Sparkles, Bell, Code, Clock, ShieldCheck, Award, Layers3, 
  FilePieChart, LogOut, Plus, Search, Building2, CreditCard, 
  ArrowRight, ChevronDown, Check, Loader2, Shield, HeartHandshake,
  AlertTriangle, FileUp, Filter, RefreshCw, BarChart2, Activity,
  Sliders, Send, Moon, Sun, Laptop, ArrowUpRight
} from 'lucide-react';

import KycWizard from './components/KycWizard';
import KycStatusTracking from './components/KycStatusTracking';
import AdminVerificationDashboard from './components/AdminVerificationDashboard';
import APassProfile from './components/APassProfile';
import RecipientVerification from './components/RecipientVerification';
import PaymentReviewAndCompliance from './components/PaymentReviewAndCompliance';
import PaymentSuccess from './components/PaymentSuccess';
import NotificationCenter from './components/NotificationCenter';
import PaymentMap from './components/PaymentMap';
import RiskGauge from './components/RiskGauge';
import ComplianceRuleBuilder from './components/ComplianceRuleBuilder';
import TravelRuleCenter from './components/TravelRuleCenter';

import { Transaction, APassIdentity, ATokenRule, TravelRuleReport, AuditRecord } from './types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_A_PASS_IDENTITIES, 
  INITIAL_A_TOKEN_RULES, 
  INITIAL_TRAVEL_RULE_REPORTS, 
  INITIAL_AUDIT_TIMELINE 
} from './data';

export default function App() {
  // --- Persistent States ---
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('cm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [identities, setIdentities] = useState<APassIdentity[]>(() => {
    const saved = localStorage.getItem('cm_identities');
    return saved ? JSON.parse(saved) : INITIAL_A_PASS_IDENTITIES;
  });

  const [rules, setRules] = useState<ATokenRule[]>(() => {
    const saved = localStorage.getItem('cm_rules');
    return saved ? JSON.parse(saved) : INITIAL_A_TOKEN_RULES;
  });

  const [reports, setReports] = useState<TravelRuleReport[]>(() => {
    const saved = localStorage.getItem('cm_reports');
    return saved ? JSON.parse(saved) : INITIAL_TRAVEL_RULE_REPORTS;
  });

  const [audits, setAudits] = useState<AuditRecord[]>(() => {
    const saved = localStorage.getItem('cm_audits');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_TIMELINE;
  });

  // --- Effects for Storage Persistence ---
  useEffect(() => {
    localStorage.setItem('cm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cm_identities', JSON.stringify(identities));
  }, [identities]);

  useEffect(() => {
    localStorage.setItem('cm_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('cm_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('cm_audits', JSON.stringify(audits));
  }, [audits]);

  // --- App Flow & Auth States ---
  const [activePage, setActivePage] = useState<string>('landing');
  const [loggedInState, setLoggedInState] = useState<{
    name: string;
    email: string;
    type: 'Business' | 'Freelancer' | 'Admin';
    walletAddress?: string;
    country?: string;
  } | null>(() => {
    const saved = localStorage.getItem('cm_logged_in');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep state sync with storage
  useEffect(() => {
    if (loggedInState) {
      localStorage.setItem('cm_logged_in', JSON.stringify(loggedInState));
    } else {
      localStorage.removeItem('cm_logged_in');
    }
  }, [loggedInState]);

  // --- Onboarding & OTP Form States ---
  const [regType, setRegType] = useState<'Business' | 'Freelancer'>('Business');
  
  // Form input states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCountry, setRegCountry] = useState('United States');
  const [regWallet, setRegWallet] = useState('0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6));
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // OTP Verification Specific
  const [otpCode, setOtpCode] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(59);
  const [otpError, setOtpError] = useState<string>('');
  const [pendingRegistrationUser, setPendingRegistrationUser] = useState<{
    name: string;
    email: string;
    type: 'Business' | 'Freelancer';
    country: string;
    wallet: string;
  } | null>(null);

  // --- OTP countdown timer ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activePage === 'otp-verification' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePage, otpTimer]);

  const triggerSentOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(code);
    setEnteredOtp('');
    setOtpError('');
    setOtpTimer(59);
    console.log(`[Coinmark Security Desk] OTP Code Sent to Email: ${code}`);
  };

  // --- Payment Creation Flow ---
  const [payoutRecipient, setPayoutRecipient] = useState('');
  const [payoutAddress, setPayoutAddress] = useState('');
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutToken, setPayoutToken] = useState<'USDa' | 'EURa' | 'GBPa'>('USDa');
  const [payoutPurpose, setPayoutPurpose] = useState('Enterprise Consulting Settlement');
  const [paymentStep, setPaymentStep] = useState<'form' | 'checking' | 'review' | 'success' | 'blocked' | 'failed'>('form');
  const [complianceMessage, setComplianceMessage] = useState('');
  const [txRiskScore, setTxRiskScore] = useState(12);
  const [activeTx, setActiveTx] = useState<Transaction | null>(null);

  // --- Rule Building States ---
  const [ruleTokenName, setRuleTokenName] = useState('');
  const [ruleTokenSymbol, setRuleTokenSymbol] = useState('');
  const [ruleMinTier, setRuleMinTier] = useState('Level 1');
  const [ruleGeofence, setRuleGeofence] = useState('None');
  const [ruleGroup, setRuleGroup] = useState('All');
  const [launchedTokens, setLaunchedTokens] = useState<any[]>([
    { name: 'Coinmark USDa', symbol: 'USDa', minTier: 'Level 1', geofence: 'Sanctioned List', group: 'Enterprise', isPaused: false },
    { name: 'Coinmark EURa', symbol: 'EURa', minTier: 'Level 2', geofence: 'EMEA Standard', group: 'All', isPaused: false },
    { name: 'Coinmark GBPa', symbol: 'GBPa', minTier: 'Level 2', geofence: 'UK Regulated', group: 'UK-Citizens', isPaused: false }
  ]);

  // --- Reports manager states ---
  const [selectedReportType, setSelectedReportType] = useState<'Transactions' | 'Compliance' | 'TravelRule' | 'Audit'>('Transactions');
  const [reportSuccessMessage, setReportSuccessMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // --- Freeze User modal state ---
  const [freezeModalUser, setFreezeModalUser] = useState<APassIdentity | null>(null);
  const [freezeReason, setFreezeReason] = useState('Suspicious high velocity ledger transfers identified');
  const [freezeRisk, setFreezeRisk] = useState<'Low' | 'Medium' | 'High'>('High');
  const [freezeNotes, setFreezeNotes] = useState('Flagged by automated smart contract geofence alerts.');

  // Notification Alerts State
  const [globalSystemAlerts, setGlobalSystemAlerts] = useState<any[]>([
    { id: 1, title: 'Compliance Rule Altered', text: 'FATF travel rules threshold lowered to $1,000 equivalent.', type: 'info', time: '12m ago' },
    { id: 2, title: 'Sanctions List updated', text: 'Integrated EU consolidated restrictions list v421.', type: 'warning', time: '1h ago' }
  ]);

  // Dynamic system-wide aggregate score
  const [systemRiskScore, setSystemRiskScore] = useState(15);

  // --- Handlers ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setRegError('All fields are required.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    setRegError('');
    setPendingRegistrationUser({
      name: regName,
      email: regEmail,
      type: regType,
      country: regCountry,
      wallet: regWallet
    });
    setActivePage('otp-verification');
    triggerSentOtp();
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === otpCode || enteredOtp === '123456') {
      // Create Pending Identity in state
      const idCode = 'AP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      const newIdent: APassIdentity = {
        id: idCode,
        name: pendingRegistrationUser?.name || 'Anonymous',
        email: pendingRegistrationUser?.email || '',
        type: pendingRegistrationUser?.type || 'Freelancer',
        country: pendingRegistrationUser?.country || 'United States',
        kycLevel: 'Level 1 (Basic)',
        status: 'Submitted', // Submitted means awaiting KYC completion & approval
        walletAddress: pendingRegistrationUser?.wallet || '0x321f...a812',
        issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        riskCategory: 'Low',
        documents: {
          idDocument: false,
          proofOfAddress: false,
          sanctionsCheck: 'Pending'
        }
      };

      setIdentities(prev => [newIdent, ...prev]);
      
      // Auto-login to let them perform KYC wizard
      setLoggedInState({
        name: newIdent.name,
        email: newIdent.email,
        type: newIdent.type,
        walletAddress: newIdent.walletAddress,
        country: newIdent.country
      });

      // Clear register forms
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      
      // Go to KYC Wizard
      setActivePage('kyc-wizard-start');
    } else {
      setOtpError('Invalid 6-digit OTP code. Enter 123456 or consult console.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Admin login shortcut
    if (loginEmail === 'admin@coinmark.pay' && loginPassword === 'admin') {
      setLoggedInState({
        name: 'Executive Auditor',
        email: 'admin@coinmark.pay',
        type: 'Admin'
      });
      setActivePage('admin-verification');
      return;
    }

    if (loginEmail === 'admin@coinmark.pay') {
      if (loginPassword !== 'admin') {
        setLoginError('Incorrect administrative passkey. (Use password "admin")');
        return;
      }
    }

    // Standard User lookup
    const foundIdent = identities.find(i => i.email.toLowerCase() === loginEmail.toLowerCase());
    if (foundIdent) {
      if (foundIdent.status === 'Suspended') {
        setLoginError('Your access has been frozen due to compliance/risk warnings.');
        return;
      }

      setLoggedInState({
        name: foundIdent.name,
        email: foundIdent.email,
        type: foundIdent.type as any,
        walletAddress: foundIdent.walletAddress,
        country: foundIdent.country
      });

      if (foundIdent.status === 'Submitted') {
        // Did not submit actual details or pending review
        // check if they filled Kyc details
        if (foundIdent.documents.idDocument) {
          setActivePage('approval-awaiting');
        } else {
          setActivePage('kyc-wizard-start');
        }
      } else if (foundIdent.status === 'Verified') {
        setActivePage('dashboard');
      } else {
        setActivePage('approval-awaiting');
      }
    } else {
      // Default fallback account login for testing convenience
      setLoggedInState({
        name: 'Cleanverse Labs Inc.',
        email: loginEmail || 'treasury@cleanverse.net',
        type: 'Business',
        walletAddress: '0x3f5c...a812',
        country: 'United States'
      });
      setActivePage('dashboard');
    }
  };

  const handleKycWizardComplete = (creds: any) => {
    // Find current user's profile and update status to under review (Submitted)
    if (loggedInState) {
      setIdentities(prev => prev.map(ident => {
        if (ident.email.toLowerCase() === loggedInState.email.toLowerCase()) {
          return {
            ...ident,
            status: 'Submitted',
            kycLevel: 'Level 2 (Standard)',
            walletAddress: creds.walletAddress || ident.walletAddress,
            country: creds.country || ident.country,
            documents: {
              idDocument: true,
              proofOfAddress: true,
              sanctionsCheck: 'Pending'
            }
          };
        }
        return ident;
      }));
    }
    setActivePage('approval-awaiting');
  };

  const handleCheckApprovalStatusFromUser = () => {
    if (!loggedInState) return;
    const currentIdent = identities.find(i => i.email.toLowerCase() === loggedInState.email.toLowerCase());
    if (currentIdent) {
      if (currentIdent.status === 'Verified') {
        setActivePage('dashboard');
      } else {
        // Show realistic loading block before informing they are still pending
        setComplianceMessage('Sovereign decentralized registries are synced. The executive compliance officer is still auditing your sanctions clearance documents.');
        setTimeout(() => setComplianceMessage(''), 4500);
      }
    }
  };

  const handleUpdateIdentityStatus = (id: string, nextStatus: 'Verified' | 'Submitted' | 'Suspended' | 'Rejected') => {
    setIdentities(prev => prev.map(ident => {
      if (ident.id === id) {
        // Add Audit Log
        const logId = 'AUDIT-' + Math.floor(1000 + Math.random() * 9000);
        const newRecord: AuditRecord = {
          id: logId,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: `Identity verified - Status: ${nextStatus} for ${ident.name}`,
          user: 'Compliance Operator',
          category: 'KYC',
          status: 'Success',
          hash: '0x7e1a' + Math.random().toString(16).substring(2, 8) + '...21f0'
        };
        setAudits(old => [newRecord, ...old]);

        return {
          ...ident,
          status: nextStatus,
          id: ident.id || ('AP-' + Math.floor(100000 + Math.random() * 900000)),
          documents: {
            ...ident.documents,
            sanctionsCheck: nextStatus === 'Verified' ? 'Passed' : (nextStatus === 'Rejected' ? 'Failed' : 'Pending')
          }
        } as APassIdentity;
      }
      return ident;
    }));
  };

  // --- Payment Creation / Pre-flight execution flow ---
  const handleInitiatePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutRecipient || payoutAmount <= 0) {
      return;
    }

    setPaymentStep('checking');
    
    // Simulate real-time compliance review scoring
    setTimeout(() => {
      // Find beneficiary's risk rating
      const recipientIdentity = identities.find(
        i => i.name.toLowerCase() === payoutRecipient.toLowerCase() || 
        i.walletAddress.toLowerCase() === payoutAddress.toLowerCase()
      );

      let risk = 14;
      if (recipientIdentity) {
        if (recipientIdentity.riskCategory === 'High') risk = 76;
        else if (recipientIdentity.riskCategory === 'Medium') risk = 42;
      } else if (payoutAmount > 50000) {
        risk = 68; // High volume risk trigger
      }

      setTxRiskScore(risk);

      if (recipientIdentity?.status === 'Suspended') {
        setPaymentStep('blocked');
      } else {
        setPaymentStep('review');
      }
    }, 1500);
  };

  const handleExecutePayout = () => {
    // Generate new Transaction
    const txId = 'TX-' + Math.floor(100000 + Math.random() * 900000);
    const newTx: Transaction = {
      id: txId,
      senderName: loggedInState?.name || 'Cleanverse Labs Inc.',
      senderAddress: loggedInState?.walletAddress || '0x3f5c...a812',
      recipientName: payoutRecipient,
      recipientAddress: payoutAddress,
      amount: payoutAmount,
      token: payoutToken,
      purpose: payoutPurpose,
      riskScore: txRiskScore,
      travelRuleStatus: payoutAmount >= 1000 ? 'Verified' : 'Exempt',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      txHash: '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
      status: txRiskScore > 70 ? 'Flagged' : 'Completed'
    };

    setTransactions(prev => [newTx, ...prev]);

    // Create Audit track
    const auditId = 'AUDIT-' + Math.floor(1000 + Math.random() * 9000);
    const newAudit: AuditRecord = {
      id: auditId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: `Executed payout ${txId} of ${payoutAmount} ${payoutToken} to ${payoutRecipient}`,
      user: loggedInState?.name || 'Treasury Custodian',
      category: 'Payout',
      status: txRiskScore > 70 ? 'Warning' : 'Success',
      hash: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6)
    };
    setAudits(prev => [newAudit, ...prev]);

    setActiveTx(newTx);
    setPaymentStep('success');

    // Reset payout fields
    setPayoutRecipient('');
    setPayoutAddress('');
    setPayoutAmount(0);
  };

  const handleLaunchTokenRules = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleTokenName || !ruleTokenSymbol) return;

    const newToken = {
      name: ruleTokenName,
      symbol: ruleTokenSymbol,
      minTier: ruleMinTier,
      geofence: ruleGeofence,
      group: ruleGroup,
      isPaused: false
    };

    setLaunchedTokens(prev => [...prev, newToken]);

    // Add general rule metadata
    const ruleId = 'RULE-' + Math.floor(100 + Math.random() * 900);
    const newRule: ATokenRule = {
      id: ruleId,
      name: `${ruleTokenSymbol} Gating Restriction`,
      description: `Whitelist gating restricted in ${ruleGeofence} zones for ${ruleTokenSymbol}.`,
      category: 'Geofencing',
      value: ruleGeofence,
      enabled: true,
      severity: 'Block'
    };
    setRules(prev => [...prev, newRule]);

    // audit trail log
    const auditId = 'AUDIT-' + Math.floor(1000 + Math.random() * 9000);
    const newAudit: AuditRecord = {
      id: auditId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: `Configured ruleset for ${ruleTokenSymbol}`,
      user: loggedInState?.name || 'Administrator',
      category: 'Rule_Change',
      status: 'Success',
      hash: '0x32ba' + Math.random().toString(16).substring(2, 6) + '...f91a'
    };
    setAudits(prev => [newAudit, ...prev]);

    // Reset fields
    setRuleTokenName('');
    setRuleTokenSymbol('');
  };

  const toggleTokenActive = (symbol: string) => {
    setLaunchedTokens(prev => prev.map(t => {
      if (t.symbol === symbol) {
        return { ...t, isPaused: !t.isPaused };
      }
      return t;
    }));
  };

  // --- Generate & Export Reports Handler --
  const handleExportReport = () => {
    setIsExporting(true);
    setReportSuccessMessage('');
    setTimeout(() => {
      setIsExporting(false);
      setReportSuccessMessage(`Successfully generated robust ${selectedReportType} audit file: CM_Compliance_${selectedReportType}_v2.pdf and exported to cryptographically verified JSON metadata ledger.`);
    }, 1800);
  };

  // --- Execute Freezing User ---
  const handleFreezeUserSubmission = () => {
    if (!freezeModalUser) return;
    
    // update status inside identities database
    setIdentities(prev => prev.map(i => {
      if (i.id === freezeModalUser.id) {
        return {
          ...i,
          status: 'Suspended',
          riskCategory: 'High'
        };
      }
      return i;
    }));

    // audit trail log
    const auditId = 'AUDIT-' + Math.floor(1000 + Math.random() * 9000);
    setAudits(prev => [{
      id: auditId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'Administrative Controller',
      action: `FREEZE CREDENTIAL HOLDER - Reason: ${freezeReason}`,
      entityTarget: freezeModalUser.name,
      blockchainTx: '0x' + Math.random().toString(16).substring(2, 6) + '...fba0'
    }, ...prev]);

    setFreezeModalUser(null);
  };

  // Unfreeze User Handler
  const handleUnfreezeUser = (userId: string) => {
    setIdentities(prev => prev.map(i => {
      if (i.id === userId) {
        return {
          ...i,
          status: 'Verified',
          riskCategory: 'Low'
        };
      }
      return i;
    }));

    // audit trail log
    const auditId = 'AUDIT-' + Math.floor(1000 + Math.random() * 9000);
    setAudits(prev => [{
      id: auditId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'Administrative Controller',
      action: `UNFREEZE CREDENTIAL HOLDER`,
      entityTarget: identities.find(ident => ident.id === userId)?.name || 'Holder',
      blockchainTx: '0x32bf...23fa'
    }, ...prev]);
  };

  // Log Out helper
  const handleLogout = () => {
    setLoggedInState(null);
    setActivePage('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none antialiased">
      
      {/* ────────────────────────────────────────────────────────
          STICKY TOP NAVIGATION BAR (Enterprise standard)
          ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 bg-white border-b border-slate-200 shrink-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={() => {
              if (loggedInState?.type === 'Admin') {
                setActivePage('admin-verification');
              } else if (loggedInState) {
                setActivePage('dashboard');
              } else {
                setActivePage('landing');
              }
            }} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Coinmark <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded border border-blue-100 font-mono">PAY</span>
              </span>
            </div>
          </div>

          {/* Navigation Links - Unauthenticated Public Pages */}
          {!loggedInState && (
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
              <button onClick={() => setActivePage('landing')} className={`hover:text-blue-600 transition-colors ${activePage === 'landing' ? 'text-blue-600 font-semibold' : ''}`}>Home</button>
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#docs" className="hover:text-blue-600 transition-colors">Documentation</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          )}

          {/* User Section Area */}
          <div className="flex items-center gap-4">
            {loggedInState ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{loggedInState.name}</p>
                  <p className="text-[10px] font-mono text-slate-505 text-slate-500 uppercase tracking-wider">{loggedInState.type.toUpperCase()}</p>
                </div>
                
                {/* Micro menu actions */}
                <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs uppercase font-mono shadow-sm">
                  {loggedInState.name[0]}
                </div>

                <button 
                  onClick={handleLogout}
                  title="Sign out of secure portal"
                  className="p-2 text-slate-450 hover:text-rose-600 bg-slate-100/80 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setActivePage('login')}
                  className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    setRegType('Business');
                    setActivePage('business-reg');
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg transition-all shadow-sm shadow-orange-500/10 cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
          MAIN WORKSPACE LAYOUT
          ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* SIDEBAR NAVIGATION (ONLY SHOW FOR AUTHENTICATED VERIFIED USERS) */}
        {loggedInState && loggedInState.type !== 'Admin' && (
          (() => {
            // Check check status
            const foundMyIdent = identities.find(i => i.email.toLowerCase() === loggedInState.email.toLowerCase());
            const userIsVerified = foundMyIdent?.status === 'Verified';

            if (userIsVerified) {
              return (
                <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 z-30 font-sans shadow-sm">
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="mb-2 px-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">TREASURY MANAGEMENT</p>
                      </div>
                      
                      <nav className="space-y-1">
                        <button
                          onClick={() => { setActivePage('dashboard'); setPaymentStep('form'); }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                            activePage === 'dashboard' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <BarChart2 className="h-4 w-4 shrink-0" />
                          <span>Corporate Dashboard</span>
                        </button>

                        <button
                          onClick={() => { setActivePage('create-payout'); setPaymentStep('form'); }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                            activePage === 'create-payout' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <Send className="h-4 w-4 shrink-0" />
                          <span>Execute Payout</span>
                        </button>

                        <button
                          onClick={() => setActivePage('transaction-explorer')}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                            activePage === 'transaction-explorer' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <Activity className="h-4 w-4 shrink-0" />
                          <span>Transaction Directory</span>
                        </button>

                        <button
                          onClick={() => setActivePage('recipient-verification')}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                            activePage === 'recipient-verification' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4 shrink-0" />
                          <span>Recipient Registry</span>
                        </button>
                      </nav>

                      <div className="mt-6 mb-2 px-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">COMPLIANCE &amp; SOVEREIGN ID</p>
                      </div>

                      <nav className="space-y-1">
                        <button
                          onClick={() => setActivePage('atoken-management')}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                            activePage === 'atoken-management' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <Layers3 className="h-4 w-4 shrink-0" />
                          <span>A-Token Settings</span>
                        </button>

                        <button
                          onClick={() => setActivePage('reports')}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                            activePage === 'reports' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <FilePieChart className="h-4 w-4 shrink-0" />
                          <span>Compliance Auditor Reports</span>
                        </button>

                        <button
                          onClick={() => setActivePage('apass-profile')}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                            activePage === 'apass-profile' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <Award className="h-4 w-4 shrink-0" />
                          <span>My A-Pass Profile</span>
                        </button>

                        <button
                          onClick={() => setActivePage('audit-timeline')}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                            activePage === 'audit-timeline' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>On-Chain Cryptographic Logs</span>
                        </button>
                      </nav>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-6 shrink-0">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span className="text-[11px] font-bold text-slate-800">Identity Attested</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Sovereign wallet bound &amp; cleared for standard payouts.</p>
                      </div>
                    </div>
                  </div>
                </aside>
              );
            }
            return null;
          })()
        )}

        {/* ADMIN WORKSPACE SIDEBAR MENU */}
        {loggedInState && loggedInState.type === 'Admin' && (
          <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 z-30 font-sans shadow-sm">
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="mb-2 px-3">
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest leading-none font-mono">AUDITOR COMMANDS</p>
                </div>
                
                <nav className="space-y-1">
                  <button
                    onClick={() => setActivePage('admin-verification')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                      activePage === 'admin-verification' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                    <span>Auditor Operator Control</span>
                  </button>

                  <button
                    onClick={() => setActivePage('admin-audit-timeline')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                      activePage === 'admin-audit-timeline' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                    }`}
                  >
                    <Clock className="h-4 w-4 shrink-0 text-slate-500" />
                    <span>Compliance Action Trails</span>
                  </button>

                  <button
                    onClick={() => setActivePage('admin-token-architect')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 font-semibold transition-all border ${
                      activePage === 'admin-token-architect' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                    }`}
                  >
                    <Layers3 className="h-4 w-4 shrink-0 text-orange-500" />
                    <span>System Gating Configurations</span>
                  </button>
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 shrink-0 text-xs">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">OPERATIVE ROOT MODE</span>
                <span className="text-[11px] font-mono font-bold text-slate-800">admin@coinmark.pay</span>
              </div>
            </div>
          </aside>
        )}

        {/* WORKSPACE AREA CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          
          {/* ────────────────────────────────────────────────────────
              1. PUBLIC LANDING PAGE SCREEN
              ──────────────────────────────────────────────────────── */}
          {activePage === 'landing' && (
            <div className="space-y-16 py-8">
              
              {/* HEADING HERO */}
              <div id="hero" className="text-center max-w-3xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>The Global Compliance Infrastructure for Stablecoin Settlements</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Institutional stablecoin payouts with <span className="text-blue-600">automatic FATF compliance</span>
                </h1>
                
                <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Coinmark Pay equips regulated enterprises, business treasuries, and freelancers with secure, soulbound digital identities (A-Pass) to execute lightning-fast stablecoin payouts that instantly fulfill OFAC and local regulatory checklists.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      setRegType('Business');
                      setActivePage('business-reg');
                    }}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-lg transition-all shadow-md shadow-orange-500/10 cursor-pointer"
                  >
                    Register Business Vault
                  </button>
                  <button
                    onClick={() => {
                      setRegType('Freelancer');
                      setActivePage('freelancer-reg');
                    }}
                    className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-lg transition-all shadow-sm cursor-pointer"
                  >
                    Onboard Freelancer Recipient
                  </button>
                </div>
              </div>

              {/* STATS STRIP */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-5xl mx-auto">
                <div className="text-center p-4">
                  <p className="text-3xl font-extrabold text-slate-900 font-mono">$3.4B+</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Audit Clear Volume</p>
                </div>
                <div className="text-center p-4 border-t md:border-t-0 md:border-l border-slate-100">
                  <p className="text-3xl font-extrabold text-slate-900 font-mono">1.1s</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Decentralized Attestation Time</p>
                </div>
                <div className="text-center p-4 border-t md:border-t-0 md:border-l border-slate-100">
                  <p className="text-3xl font-extrabold text-slate-900 font-mono">100%</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Travel Rule Resolution</p>
                </div>
                <div className="text-center p-4 border-t md:border-t-0 md:border-l border-slate-100">
                  <p className="text-3xl font-extrabold text-slate-900 font-mono">Zero</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Sanction Escapes</p>
                </div>
              </div>

              {/* FEATURES BLOCK */}
              <div id="features" className="space-y-6 max-w-5xl mx-auto pt-8">
                <div className="text-center border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Platform Pillars</h2>
                  <p className="text-xs text-slate-505 text-slate-500 mt-1">Engineered to standards demanded by the worlds leading banks and compliance committees.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                      <Fingerprint className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-905 text-slate-900">Sovereign A-Pass Credentials</h3>
                    <p className="text-xs text-slate-550 text-slate-500 leading-relaxed font-sans">
                      A-Pass is a cryptographically verified digital identity. Users assert KYC compliance state anonymously via zero-knowledge technology without revealing cleartext identity data.
                    </p>
                  </div>

                  <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Layers3 className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-905 text-slate-900">Hashed Travel Rule Handshakes</h3>
                    <p className="text-xs text-slate-550 text-slate-500 leading-relaxed font-sans">
                      All payouts above the regulatory $1,000 threshold dynamically create cryptographic FATF Recommendation 16 compliance hashes before settling.
                    </p>
                  </div>

                  <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-905 text-slate-900">Automatic OFAC Screen Check</h3>
                    <p className="text-xs text-slate-550 text-slate-500 leading-relaxed font-sans">
                      Our dynamic oracle sweeps consolidated sanctions lists (OFAC, EU, UN, OFSI) to prevent illicit fund flow inside smart-gated stablecoins.
                    </p>
                  </div>
                </div>
              </div>

              {/* PRICING BLOCK */}
              <div id="pricing" className="max-w-4xl mx-auto space-y-6 pt-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Simple, Compliant Pricing</h2>
                  <p className="text-xs text-slate-505 text-slate-500 mt-1">Flat-rate security clearance. No percentage of volume fees.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Standard Attestation</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Perfect for individual freelancers / contractors.</p>
                    </div>
                    <div className="font-mono">
                      <span className="text-3xl font-bold">$0</span> <span className="text-xs text-slate-500">/ forever</span>
                    </div>
                    <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      <p>✓ 1 Active A-Pass soulbound DID credential</p>
                      <p>✓ Bound 1 verified payment receiving wallet</p>
                      <p>✓ Standard zero-knowledge verification check</p>
                    </div>
                    <button 
                      onClick={() => {
                        setRegType('Freelancer');
                        setActivePage('freelancer-reg');
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Onboard Freelancer ID
                    </button>
                  </div>

                  <div className="bg-white p-8 border-2 border-blue-600 rounded-xl shadow-md space-y-4 relative">
                    <span className="absolute top-3 right-3 bg-blue-10/70 border border-blue-200 text-blue-600 font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">REGULATED STANDARD</span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Business Vaults</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Designed for financial institutions &amp; enterprises.</p>
                    </div>
                    <div className="font-mono">
                      <span className="text-3xl font-bold">$199</span> <span className="text-xs text-slate-500">/ month</span>
                    </div>
                    <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600 font-sans">
                      <p>✓ Unlimited active Recipient onboards</p>
                      <p>✓ Dedicated A-Token Smart Gating rule engine</p>
                      <p>✓ Automated OFAC / UN Sanctions Screening sweep</p>
                      <p>✓ FATF Recommend 16 Travel Rule hashes output</p>
                    </div>
                    <button 
                      onClick={() => {
                        setRegType('Business');
                        setActivePage('business-reg');
                      }}
                      className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Onboard Enterprise Vault
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              2. TRADITIONAL LOGIN PAGE
              ──────────────────────────────────────────────────────── */}
          {activePage === 'login' && (
            <div className="max-w-md mx-auto py-12 space-y-6">
              
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Sign In to Coinmark Portal</h2>
                <p className="text-xs text-slate-500">Access your business stablecoin vault or attestation profile.</p>
              </div>

              {loginError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-4">
                <form onSubmit={handleLogin} className="space-y-4 font-sans">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate / Registered Email</label>
                    <input 
                      type="email" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. treasury@cleanverse.net"
                      className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">Audit Secret Passkey</label>
                      <span className="text-[11px] text-slate-400 font-mono select-none">Admin shortcut: admin / admin</span>
                    </div>
                    <input 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-opacity-0 bg-white" />
                      Remember authorization ticket
                    </label>
                    <button type="button" onClick={() => alert("Enterprise administrators can reset credentials via physical MFA tokens.")} className="hover:text-blue-600 font-medium">Forgot Password?</button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer mt-2"
                  >
                    Authenticate credentials
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 text-center">
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">A-Pass attestation workspace setup</p>
                  <p className="text-xs text-slate-605 text-slate-600 font-semibold mt-1">
                    Need an account?{' '}
                    <button onClick={() => { setRegType('Business'); setActivePage('business-reg'); }} className="text-blue-600 hover:underline">Register Business</button>
                    {' '}or{' '}
                    <button onClick={() => { setRegType('Freelancer'); setActivePage('freelancer-reg'); }} className="text-blue-600 hover:underline">Onboard Freelancer</button>
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setActivePage('landing')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-mono"
                >
                  &larr; Back to Landing Page
                </button>
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              3. REGISTRATION PAGES (BUSINESS VS FREELANCER ONBOARDINGS)
              ──────────────────────────────────────────────────────── */}
          {(activePage === 'business-reg' || activePage === 'freelancer-reg') && (
            <div className="max-w-lg mx-auto py-6 space-y-6">
              
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-905 text-slate-900">
                  {activePage === 'business-reg' ? 'Onboard Corporate Wallet Vault' : 'Onboard Recipient A-Pass Profile'}
                </h2>
                <p className="text-xs text-slate-550 text-slate-550/80 text-slate-500">
                  {activePage === 'business-reg' 
                    ? 'Regulated financial services, treasuries, and DAO custody integrations.' 
                    : 'Individual contractors, software engineers, and global freelancers.'}
                </p>
              </div>

              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {regError}
                </div>
              )}

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-4">
                
                {/* Visual state toggling between profiles */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => { setRegType('Business'); setActivePage('business-reg'); }}
                    className={`py-2 text-xs font-semibold rounded-lg ${activePage === 'business-reg' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    Business Entity
                  </button>
                  <button 
                    onClick={() => { setRegType('Freelancer'); setActivePage('freelancer-reg'); }}
                    className={`py-2 text-xs font-semibold rounded-lg ${activePage === 'freelancer-reg' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    Freelancer / Recipient
                  </button>
                </div>

                <form onSubmit={handleRegister} className="space-y-4 font-sans">
                  
                  {activePage === 'business-reg' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-705 text-slate-700 mb-1">Company / Legal Name</label>
                      <input 
                        type="text" 
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Cleanverse Labs Inc."
                        className="w-full bg-white border border-slate-350 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-705 text-slate-700 mb-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Enter your name"
                        className="w-full bg-white border border-slate-350 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-705 text-slate-700 mb-1">Business / Personal Email</label>
                    <input 
                      type="email" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. treasury@cleanverse.net"
                      className="w-full bg-white border border-slate-350 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-705 text-slate-700 mb-1">Primary Jurisdiction</label>
                      <select 
                        value={regCountry}
                        onChange={(e) => setRegCountry(e.target.value)}
                        className="w-full bg-white border border-slate-350 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Germany">Germany</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-7s0 text-slate-700 mb-1">Primary Wallet Address</label>
                      <input 
                        type="text" 
                        value={regWallet}
                        onChange={(e) => setRegWallet(e.target.value)}
                        className="w-full bg-white border border-slate-350 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 font-mono focus:outline-none"
                        placeholder="0x..."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-705 text-slate-700 mb-1 font-sans">Password</label>
                      <input 
                        type="password" 
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white border border-slate-350 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-705 text-slate-700 mb-1">Confirm Password</label>
                      <input 
                        type="password" 
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white border border-slate-350 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* HIGH VISIBILITY PRIMARY ATTEST ACTION */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wide rounded-lg transition-all shadow-sm shadow-orange-500/15 cursor-pointer mt-2"
                  >
                    Register Credentials &amp; Issue OTP Ticket
                  </button>

                </form>

                <div className="border-t border-slate-100 pt-4 text-center">
                  <span className="text-xs text-slate-500 leading-normal">
                    Already registered?{' '}
                    <button onClick={() => setActivePage('login')} className="text-blue-600 hover:underline font-bold">Sign In here</button>
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              4. DEDICATED OTP VERIFICATION PAGE
              ──────────────────────────────────────────────────────── */}
          {activePage === 'otp-verification' && (
            <div className="max-w-md mx-auto py-12 space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Email Verification OTP</h2>
                <p className="text-xs text-slate-500">
                  A verification code was routed to: <span className="font-semibold text-slate-800">{pendingRegistrationUser?.email}</span>
                </p>
              </div>

              {otpError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {otpError}
                </div>
              )}

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-5">
                
                <div>
                  <label className="block text-xs font-bold text-slate-650 text-slate-600 uppercase font-mono tracking-wider mb-2 text-center">Enter 6-Digit Verification Code</label>
                  <input 
                    type="text" 
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-lg p-3 text-lg font-bold font-mono tracking-widest text-slate-900 focus:outline-none"
                    maxLength={6}
                    required
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-1">For testing convenience, use the sent code or input: 123456</span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                  <span className="text-slate-500">
                    Resend code in: <span className="font-mono font-bold text-slate-800">{otpTimer > 0 ? `${otpTimer}s` : 'Ready'}</span>
                  </span>
                  
                  <button
                    onClick={triggerSentOtp}
                    disabled={otpTimer > 0}
                    type="button"
                    className="text-blue-600 hover:text-blue-700 disabled:text-slate-400 font-bold transition-all cursor-pointer disabled:cursor-not-allowed text-xs"
                  >
                    Resend OTP Ticket
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Verify Email Identity
                </button>

              </div>

              <div className="text-center">
                <button 
                  onClick={() => setActivePage('landing')} 
                  className="text-xs font-mono text-slate-400 hover:text-slate-600"
                >
                  &larr; Cancel Onboarding registration
                </button>
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              5. KYC VERIFICATION PAGE (START / WIZARD)
              ──────────────────────────────────────────────────────── */}
          {activePage === 'kyc-wizard-start' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border-b border-slate-205 border-slate-200 pb-4 text-center">
                <span className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-widest">Sovereign Compliance Vault</span>
                <h2 className="text-2xl font-bold text-slate-900">Soulbound A-Pass KYC Attestation</h2>
                <p className="text-xs text-slate-500 mt-1">To execute secure on-chain stablecoin settlements, please complete your compliance registry fields.</p>
              </div>

              <KycWizard 
                onComplete={handleKycWizardComplete}
                initialValues={{
                  name: loggedInState?.name || '',
                  email: loggedInState?.email || '',
                  country: loggedInState?.country || 'United States',
                  wallet: loggedInState?.walletAddress || '0x...'
                }}
              />
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              6. ADMIN REVIEW & APPROVAL WAITING LOCK SCREEN
              ──────────────────────────────────────────────────────── */}
          {activePage === 'approval-awaiting' && (
            <div className="max-w-xl mx-auto py-12 space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 mx-auto flex items-center justify-center border border-orange-100">
                  <ShieldCheck className="h-8 w-8 animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-orange-600 font-mono font-bold tracking-widest uppercase">Executive Sanctions Underway</span>
                  <h3 className="text-xl font-bold text-slate-900">Sovereign Attestation Status: IN REVIEW</h3>
                  <p className="text-xs text-slate-550 text-slate-550 leading-relaxed max-w-sm mx-auto text-slate-500">
                    The decentralized identity network is mapping your compliance parameters. An auditor is verifying your submitted documents to generate your A-Pass DID certificate.
                  </p>
                </div>

                {/* Simulated running progress checkmarks */}
                <div className="space-y-2 max-w-sm mx-auto text-xs text-left bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-2 uppercase font-mono text-[9px] tracking-wide">Live Compliance Pipeline checks</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">UN &amp; OFAC Sanctions Database</span>
                    <span className="text-amber-600 font-semibold font-mono text-[10px]">RUNNING...</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">ID Verification Attestation Check</span>
                    <span className="text-emerald-600 font-semibold font-mono text-[10px]">RECEIVED ✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Soulbound Blockchain binding</span>
                    <span className="text-emerald-600 font-semibold font-mono text-[10px]">LINKED ✓</span>
                  </div>
                </div>

                {complianceMessage && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-xs text-left animate-fade-in font-sans leading-relaxed">
                    {complianceMessage}
                  </div>
                )}

                <div className="space-y-2 border-t border-slate-100 pt-5">
                  {/* Shortcut to approve self */}
                  <span className="text-[10px] text-slate-400 block font-sans">
                    Admin bypass: Log in as <span className="font-semibold">admin@coinmark.pay</span> (Password: <span className="font-semibold">admin</span>) to instantly approve this user in the administrative console.
                  </span>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={handleCheckApprovalStatusFromUser}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Check clearance state
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-transparent text-slate-500 hover:text-slate-800 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              7. BUSINESS CLIENT DASHBOARD
              ──────────────────────────────────────────────────────── */}
          {activePage === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Header Dashboard section */}
              <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                  <span className="text-[9px] text-orange-620 text-orange-600 font-mono font-bold tracking-widest uppercase block">Corporate Vault</span>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    {loggedInState ? loggedInState.name : 'Cleanverse Labs Inc.'}
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-mono font-bold uppercase tracking-wider">
                      A-PASS TIER 3 COMPLIANT
                    </span>
                  </h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setActivePage('create-payout'); setPaymentStep('form'); }}
                    className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-lg shadow-sm shadow-orange-500/10 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <CreditCard className="h-4 w-4" />
                    CREATE STABLECOIN PAYOUT
                  </button>
                </div>
              </div>

              {/* STATS KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono tracking-wide uppercase font-bold">Treasury Balance (USDa)</span>
                    <Wallet className="h-4 w-4 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold font-mono text-slate-900 tracking-tight mt-1.5">
                    2,184,500 <span className="text-xs text-orange-600 font-sans font-normal">USDa</span>
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">&uarr; 14.2% from last epoch</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono tracking-wide uppercase font-bold">Invoiced / Routed</span>
                    <BarChart2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold font-mono text-slate-900 tracking-tight mt-1.5">
                    345,150 <span className="text-xs text-blue-600 font-sans font-normal">EURa</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">98 transactions completed</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono tracking-wide uppercase font-bold">Active Recipient IDs</span>
                    <User className="h-4 w-4 text-cyan-600" />
                  </div>
                  <p className="text-2xl font-bold font-mono text-slate-900 tracking-tight mt-1.5">
                    {identities.filter(i => i.status === 'Verified').length} <span className="text-xs text-slate-400 font-sans font-normal">A-Passes</span>
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">100% Attestation Rate</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow shadow-slate-100">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono tracking-wide uppercase font-bold">Compliance Audits</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold font-mono text-slate-900 tracking-tight mt-1.5">
                    {audits.length} <span className="text-xs text-slate-500 font-sans font-normal">Logged</span>
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">Cryptographic Proof OK</p>
                </div>

              </div>

              {/* Payment Map & Compliance Risk Dual Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">PAYOUT NETWORK ATTRIBUTIONS</span>
                  <div className="h-72 w-full rounded-xl overflow-hidden border border-slate-100">
                    <PaymentMap />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
                  <RiskGauge score={systemRiskScore} onScoreChange={(v) => setSystemRiskScore(v)} />
                </div>
              </div>

              {/* RECENT SETTLED TRANSFERS */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 flex items-center justify-between border-b border-slate-200">
                  <h3 className="font-bold text-xs font-mono text-slate-705 text-slate-708 text-slate-800">RECENT STABLECOIN TRANSFERS</h3>
                  <button
                    onClick={() => setActivePage('transaction-explorer')}
                    className="text-[10px] font-mono text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                  >
                    Full ledger explore &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#fcfdfe] text-slate-550 uppercase font-mono text-[9px] border-b border-slate-200 select-none">
                      <tr>
                        <th className="p-3.5">Payout ID</th>
                        <th className="p-3.5">Beneficiary (A-Pass Verified)</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5 text-center">OFAC Sanctions</th>
                        <th className="p-3.5">FATF Travel Status</th>
                        <th className="p-3.5">Settled At</th>
                        <th className="p-3.5 text-right">Settlement State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      {transactions.slice(0, 5).map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50">
                          <td className="p-3.5 font-bold text-slate-900">{tx.id}</td>
                          <td className="p-3.5">
                            <p className="font-sans font-semibold text-slate-900 leading-tight">{tx.recipientName}</p>
                            <p className="text-[9px] text-slate-400">{tx.recipientAddress}</p>
                          </td>
                          <td className="p-3.5 font-extrabold text-slate-900">
                            {tx.amount.toLocaleString()} <span className="text-[10px] font-sans font-bold text-orange-620 text-orange-600">{tx.token}</span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.riskScore > 60 ? 'bg-red-50 text-red-600 border border-red-100' : (tx.riskScore > 20 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100')
                            }`}>
                              Passed ({tx.riskScore}%)
                            </span>
                          </td>
                          <td className="p-3.5 font-sans">
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono uppercase tracking-wide">
                              {tx.travelRuleStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 text-[10px] text-slate-505 text-slate-500">{tx.timestamp}</td>
                          <td className="p-3.5 text-right">
                            <span className="px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase font-sans bg-emerald-50 text-emerald-600 border border-emerald-100">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              8. PAYOUT CREATION & PRE-FLIGHT COMPLIANCE FLIGHT WIZARD
              ──────────────────────────────────────────────────────── */}
          {activePage === 'create-payout' && (
            <div className="space-y-6">
              
              {paymentStep === 'form' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  
                  <div className="border-b border-slate-200 pb-4">
                    <span className="text-[9px] text-orange-620 text-orange-600 font-mono font-bold uppercase tracking-widest block">Settlement Clearing Portal</span>
                    <h2 className="text-xl font-bold text-slate-905 text-slate-900">Create Compliance-Native Payout</h2>
                    <p className="text-xs text-slate-500 mt-1">This transaction will run real-time OFAC screens, smart rules checks, and Travel Rule mappings.</p>
                  </div>

                  <form onSubmit={handleInitiatePayout} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 font-sans">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Beneficiary Legal Name</label>
                        <select 
                          value={payoutRecipient}
                          onChange={(e) => {
                            setPayoutRecipient(e.target.value);
                            const matched = identities.find(i => i.name === e.target.value);
                            if (matched) {
                              setPayoutAddress(matched.walletAddress);
                            }
                          }}
                          className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                          required
                        >
                          <option value="">Select Verified Beneficiary...</option>
                          {identities.filter(i => i.status === 'Verified').map(i => (
                            <option key={i.id} value={i.name}>{i.name} ({i.country})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">On-Chain Wallet address</label>
                        <input 
                          type="text" 
                          value={payoutAddress}
                          onChange={(e) => setPayoutAddress(e.target.value)}
                          placeholder="0x321f...a812"
                          className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 font-mono focus:outline-none"
                          required
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Settlement Amount</label>
                        <input 
                          type="number" 
                          value={payoutAmount || ''}
                          onChange={(e) => setPayoutAmount(Number(e.target.value))}
                          placeholder="e.g. 5000"
                          className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 font-mono focus:outline-none"
                          required
                          min={1}
                        />
                        <span className="text-[10px] text-slate-400 block mt-1">Transactions equal or above 1000 require Travel Rule handshake</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Gated Stablecoin Asset</label>
                        <select 
                          value={payoutToken}
                          onChange={(e: any) => setPayoutToken(e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none font-bold text-slate-800"
                        >
                          <option value="USDa">Coinmark USDa (USD pegged)</option>
                          <option value="EURa">Coinmark EURa (Euro pegged)</option>
                          <option value="GBPa">Coinmark GBPa (Sterling pegged)</option>
                        </select>
                      </div>

                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Settlement Purpose / Contract Link</label>
                      <input 
                        type="text" 
                        value={payoutPurpose}
                        onChange={(e) => setPayoutPurpose(e.target.value)}
                        placeholder="e.g. Enterprise Engineering services contract - Q2 payment"
                        className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wide rounded-lg transition-all shadow-sm shadow-orange-500/10 cursor-pointer flex items-center gap-1.5"
                      >
                        Run Compliance Audits
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                  </form>

                </div>
              )}

              {/* LOADER COMPLIANCE SECURING */}
              {paymentStep === 'checking' && (
                <div className="max-w-md mx-auto py-16 text-center space-y-4">
                  <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-mono">Running Compliance checks...</h3>
                    <p className="text-xs text-slate-500">Sweeping sanctions registry blocks, checking velocity indices, and creating FATF Recommendations mappings.</p>
                  </div>
                </div>
              )}

              {/* PAYMENT BLOCKED ERROR STATE */}
              {paymentStep === 'blocked' && (
                <div className="max-w-md mx-auto py-12 space-y-6">
                  <div className="bg-white border-2 border-rose-500 rounded-2xl shadow-lg p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center border border-rose-100">
                      <AlertTriangle className="h-6 w-6 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] text-rose-600 font-mono font-bold tracking-widest uppercase block">FATF SANCTIONS GATE KICKBACK</span>
                      <h3 className="text-lg font-bold text-slate-900">Settlement Blocked: COMPLIANCE REJECTED</h3>
                      <p className="text-xs text-slate-550 text-slate-500 font-sans leading-relaxed">
                        The beneficiary credentials represent an active <span className="font-bold text-rose-620">Suspended / Frozen</span> classification inside deep oracle sanctions index. Outbound Stablecoin settlement is illegal.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-center">
                      <button
                        onClick={() => setPaymentStep('form')}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer"
                      >
                        Return &amp; Amend parameters
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILED VERIFIED REVIEW PRE-FLIGHT BLOCK */}
              {paymentStep === 'review' && (
                <div className="p-1 animate-fade-in">
                  <PaymentReviewAndCompliance 
                    pendingPayout={{
                      recipientName: payoutRecipient,
                      recipientAddress: payoutAddress,
                      amount: payoutAmount,
                      token: payoutToken,
                      purpose: payoutPurpose,
                      riskScore: txRiskScore
                    }}
                    onExecute={handleExecutePayout}
                    onCancel={() => setPaymentStep('form')}
                  />
                </div>
              )}

              {/* TRANSACTION SUCCESS */}
              {paymentStep === 'success' && activeTx && (
                <div className="max-w-md mx-auto py-6 animate-fade-in">
                  <PaymentSuccess 
                    transaction={{
                      id: activeTx.id,
                      recipientName: activeTx.recipientName,
                      recipientAddress: activeTx.recipientAddress,
                      amount: activeTx.amount,
                      token: activeTx.token,
                      txHash: activeTx.txHash,
                      riskScore: activeTx.riskScore,
                      timestamp: activeTx.timestamp,
                      purpose: activeTx.purpose
                    }} 
                    onClose={() => {
                      setActiveTx(null);
                      setActivePage('dashboard');
                      setPaymentStep('form');
                    }} 
                  />
                </div>
              )}

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              9. TRANSACTION EXPLORER LEDGER
              ──────────────────────────────────────────────────────── */}
          {activePage === 'transaction-explorer' && (
            <div className="space-y-6">
              
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[9px] text-blue-600 font-mono font-bold tracking-widest uppercase block">Sovereign Crypto Ledger</span>
                <h2 className="text-2xl font-bold text-slate-905 text-slate-900">Cryptographically Signed Transactions Ledger</h2>
                <p className="text-xs text-slate-500 mt-1">Immutably anchored ledger showing zero-knowledge Travel Rule filings and risk scoring clearances.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fcfdfe] text-slate-500 uppercase font-mono text-[9px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Hash</th>
                      <th className="p-3.5">Recipient</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Purpose</th>
                      <th className="p-3.5">AML Risk</th>
                      <th className="p-3.5">FATF Travel Status</th>
                      <th className="p-3.5 text-right">Settled State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/40">
                        <td className="p-3.5 font-bold text-slate-950 font-mono">{tx.id}</td>
                        <td className="p-3.5 font-sans font-semibold text-slate-900">{tx.recipientName}</td>
                        <td className="p-3.5 font-extrabold text-slate-900">{tx.amount.toLocaleString()} {tx.token}</td>
                        <td className="p-3.5 font-sans text-slate-500">{tx.purpose}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            tx.riskScore > 50 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {tx.riskScore}%
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 font-sans">{tx.travelRuleStatus}</td>
                        <td className="p-3.5 text-right">
                          <span className="px-2 py-0.5 font-bold uppercase text-[9px] text-emerald-600 bg-emerald-50 rounded border border-emerald-100">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              10. RECIPIENT DIRECTORY / REGISTRY
              ──────────────────────────────────────────────────────── */}
          {activePage === 'recipient-verification' && (
            <div className="space-y-6">
              
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[9px] text-blue-600 font-mono font-bold tracking-widest uppercase block">Clearance Attestation Directory</span>
                <h2 className="text-2xl font-bold text-slate-905 text-slate-900">Whitelisted Recipient Directory</h2>
                <p className="text-xs text-slate-500 mt-1">Link global contractors, beneficiaries, and subsidiaries. Automatically verifies physical DID A-Pass status before sending settlements.</p>
              </div>

              <RecipientVerification 
                existingRecipients={identities}
                onAddRecipient={(recipe) => {
                  const idCode = 'AP-2026-' + Math.floor(1000 + Math.random() * 9000);
                  const newIdent: APassIdentity = {
                    id: idCode,
                    name: recipe.name,
                    email: recipe.email,
                    type: 'Freelancer',
                    country: recipe.country || 'Argentina',
                    kycLevel: 'Level 2 (Standard)',
                    status: 'Verified',
                    walletAddress: recipe.walletAddress,
                    issuedAt: new Date().toISOString().substring(0, 10) + ' 14:02:11',
                    riskCategory: 'Low',
                    documents: { idDocument: true, proofOfAddress: true, sanctionsCheck: 'Passed' }
                  };
                  setIdentities(prev => [newIdent, ...prev]);
                  
                  // Add Audit record
                  const auditId = 'AUDIT-' + Math.floor(1000 + Math.random() * 9000);
                  const newAudit: AuditRecord = {
                    id: auditId,
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    action: `Added verified recipient ${recipe.name} to business whitelisted folder`,
                    user: loggedInState?.name || 'Administrative Custodian',
                    category: 'KYC',
                    status: 'Success',
                    hash: '0x32cf' + Math.random().toString(16).substring(2, 6) + '...e911'
                  };
                  setAudits(prev => [newAudit, ...prev]);
                }}
                onRemoveRecipient={(id) => {
                  setIdentities(prev => prev.filter(ident => ident.id !== id));
                }}
              />

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              11. A-TOKEN MANAGEMENT RULES SCREEN
              ──────────────────────────────────────────────────────── */}
          {activePage === 'atoken-management' && (
            <div className="space-y-6">
              
              <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-[9px] text-blue-600 font-mono font-bold tracking-widest uppercase block">Oracle Smart Contracts</span>
                  <h2 className="text-2xl font-bold text-slate-905 text-slate-900">A-Token Gating Rule Engine</h2>
                  <p className="text-xs text-slate-500 mt-1">Construct zero-knowledge smart-contract gating parameters on compliant stablecoins.</p>
                </div>
              </div>

              {/* Setup Gating Tokens section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form to Launch Rule Gated Token */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                    <Plus className="h-4.5 w-4.5 text-blue-600" />
                    Configure New A-Token Gating Rule
                  </h3>
                  
                  <form onSubmit={handleLaunchTokenRules} className="space-y-3.5 font-sans text-xs">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Target Stablecoin Name</label>
                      <input 
                        type="text"
                        value={ruleTokenName}
                        onChange={(e) => setRuleTokenName(e.target.value)}
                        placeholder="e.g. Coinmark USDa Gated"
                        className="w-full bg-white border border-slate-300 focus:border-blue-650 rounded p-2 text-xs focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Token Symbol</label>
                      <input 
                        type="text"
                        value={ruleTokenSymbol}
                        onChange={(e) => setRuleTokenSymbol(e.target.value)}
                        placeholder="e.g. USDa"
                        className="w-full bg-white border border-slate-300 focus:border-blue-650 rounded p-2 text-xs focus:outline-none font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum A-Pass Cert Level</label>
                      <select 
                        value={ruleMinTier}
                        onChange={(e) => setRuleMinTier(e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-650 rounded p-2 text-xs"
                      >
                        <option value="Level 1">Level 1 (Basic Self-attested)</option>
                        <option value="Level 2">Level 2 (FATF Recommended Standard)</option>
                        <option value="Level 3">Level 3 (Enterprise Qualified)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">OFAC Geofencing Zone restrictions</label>
                      <select 
                        value={ruleGeofence}
                        onChange={(e) => setRuleGeofence(e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-650 rounded p-2 text-xs"
                      >
                        <option value="None">None (Global Whitelisted)</option>
                        <option value="Sanctioned Lists">Sanctioned List geo bans (OFAC sweep)</option>
                        <option value="EMEA Restricted">EMEA localized compliance limits</option>
                        <option value="US Citizens Only">US Citizens only whitelist</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-[10px] rounded transition-colors cursor-pointer"
                    >
                      Configure Gated Rule ruleset
                    </button>
                  </form>
                </div>

                {/* Tokens running directory */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Active Smart Gated Contract Tokens</h3>
                  
                  <div className="space-y-3">
                    {launchedTokens.map(token => (
                      <div key={token.symbol} className="p-4 rounded-xl border border-slate-150 flex items-center justify-between gap-4 bg-slate-50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm leading-tight">{token.name}</span>
                            <span className="text-[10px] bg-blue-10/80 text-blue-600 font-mono font-bold px-1.5 py-0.5 rounded border border-blue-105">
                              {token.symbol}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-slate-500 font-mono pt-1">
                            <span>GATING LEVEL: {token.minTier}</span>
                            <span>•</span>
                            <span>REG: {token.geofence}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${token.isPaused ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          
                          <button
                            onClick={() => toggleTokenActive(token.symbol)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                              token.isPaused 
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100' 
                                : 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100'
                            }`}
                          >
                            {token.isPaused ? 'Resume Smart checks' : 'Pause Stablecoin'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              12. COMPLIANCE AUDITOR REPORTS GENERATOR SCREEN
              ──────────────────────────────────────────────────────── */}
          {activePage === 'reports' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[9px] text-blue-600 font-mono font-bold tracking-widest uppercase block">Regulatory Audits</span>
                <h2 className="text-2xl font-bold text-slate-905 text-slate-900">Regulatory &amp; Travel Rule Reports Generator</h2>
                <p className="text-xs text-slate-500 mt-1">Generate signed reports tracking originator/beneficiary credentials, sanctions sweep logs, and audit trails.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 font-sans">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">Configure report parameters</h3>
                    
                    <div className="space-y-3 text-xs leading-normal">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Verification Report Type</label>
                        <select 
                          value={selectedReportType}
                          onChange={(e: any) => {
                            setSelectedReportType(e.target.value);
                            setReportSuccessMessage('');
                          }}
                          className="w-full bg-white border border-slate-300 focus:border-blue-650 rounded p-2.5 text-xs text-slate-900 focus:outline-none"
                        >
                          <option value="Transactions">Standard Transactions Settlement Audit</option>
                          <option value="Compliance">Sanctions / PEP Screening Consolidated Log</option>
                          <option value="TravelRule">FATF Recommendation 16 Travel Rule Filings</option>
                          <option value="Audit">Decentralized Trust Node cryptographic actions</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Compilation Horizon</label>
                        <select className="w-full bg-white border border-slate-300 focus:border-blue-650 rounded p-2.5 text-xs text-slate-900 focus:outline-none">
                          <option value="current">Current Epoch (Previous 30 Days)</option>
                          <option value="ytd">Year-to-Date (YTD Compliance logs)</option>
                          <option value="all">Full Historical Sovereign Vault records</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleExportReport}
                      disabled={isExporting}
                      className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wide rounded-lg flex items-center justify-center gap-2 shadow shadow-orange-500/10 cursor-pointer disabled:opacity-40"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cryptographically compiling data files...
                        </>
                      ) : (
                        <>
                          <FileUp className="h-4.5 w-4.5" />
                          Generate Verified Audit packet
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right information box */}
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4 text-xs font-sans">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">Export formats output</h4>
                      <p className="text-slate-500 leading-relaxed text-xs">
                        Each exported report contains a decentralized ledger signature mapping the exact state. This file is directly ingestible by central bank dashboards and regulators.
                      </p>
                    </div>

                    <div className="space-y-1.5 font-mono text-[10px] text-slate-600">
                      <p>✓ Hash format: SHA256 cryptographic match</p>
                      <p>✓ Structures: Ingests raw JSON schema &amp; CSV packets</p>
                      <p>✓ Compliance signature seal: Anchored locally</p>
                    </div>
                  </div>

                </div>

                {/* Report Generation Success panel */}
                {reportSuccessMessage && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex gap-3 animate-fade-in leading-relaxed">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Audit Packet Compiled Ready</p>
                      <p className="mt-1 text-emerald-700/90">{reportSuccessMessage}</p>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              13. MY A-PASS PROFILE SCREEN
              ──────────────────────────────────────────────────────── */}
          {activePage === 'apass-profile' && (
            <div className="p-1">
              <APassProfile 
                identity={identities.find(i => i.email.toLowerCase() === loggedInState?.email.toLowerCase())} 
                onRefresh={() => alert("Attestation verified of sovereign soulbound credential. All checks passing.")}
              />
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              14. OPERATIONAL ON-CHAIN CRYPTO LOGS
              ──────────────────────────────────────────────────────── */}
          {activePage === 'audit-timeline' && (
            <div className="space-y-6">
              
              <div className="border-b border-slate-205 border-slate-200 pb-4">
                <span className="text-[9px] text-blue-600 font-mono font-bold tracking-widest uppercase block">Trust Engine Trails</span>
                <h2 className="text-2xl font-bold text-slate-905 text-slate-900">Cryptographic Node Audit Trail</h2>
                <p className="text-xs text-slate-500 mt-1">Complete cryptographic verification pipeline audits triggered on gated stablecoins.</p>
              </div>

              <div className="relative border-l border-slate-200 ml-4 py-2 space-y-6 text-xs text-slate-750">
                {audits.map(record => (
                  <div key={record.id} className="relative pl-6">
                    {/* Node status point */}
                    <span className="absolute -left-1.5 top-0.5 h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-xs" />
                    
                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs max-w-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-orange-620 text-orange-600 font-bold uppercase">{record.id}</span>
                        <span className="font-mono text-[9px] text-slate-400">{record.timestamp}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 leading-tight">{record.action}</h4>
                      <p className="text-slate-550 leading-normal text-xs pt-1">Target Entity Name: <span className="font-bold text-slate-700">{record.entityTarget}</span></p>
                      <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
                        <span>Initiated by: {record.actor}</span>
                        <span>Tx: {record.blockchainTx}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              15. COMPLIANCE AUDITOR ADMINISTRATOR CENTRAL TERMINAL
              ──────────────────────────────────────────────────────── */}
          {activePage === 'admin-verification' && (
            <div className="space-y-6">
              
              <AdminVerificationDashboard 
                initialIdentities={identities}
                onUpdateIdentityStatus={handleUpdateIdentityStatus}
              />

              {/* Extra auditor functions */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1">
                  <Sliders className="h-4.5 w-4.5 text-blue-600" />
                  Operator Quick Administration Actions
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  
                  {identities.filter(i => i.status === 'Submitted' || i.status === 'Verified').slice(0, 4).map(user => (
                    <div key={user.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex flex-col justify-between text-xs font-sans">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <span className="text-[10px] font-mono text-slate-500 block">JUR: {user.country}</span>
                        <span className="text-[10px] font-mono text-slate-500 block">Status: {user.status}</span>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-200/50 mt-3 flex items-center gap-2">
                        {user.status === 'Suspended' ? (
                          <button 
                            onClick={() => handleUnfreezeUser(user.id)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-1 px-2.5 rounded text-[10.5px] font-bold border border-emerald-200 transition-all cursor-pointer"
                          >
                            Unfreeze user
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setFreezeModalUser(user);
                              setFreezeReason(`Suspicious transaction pattern mapped on bound wallet address ${user.walletAddress}`);
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 py-1 px-2.5 rounded text-[10.5px] font-bold border border-rose-200 transition-all cursor-pointer"
                          >
                            Freeze Holder
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                </div>
              </div>

            </div>
          )}

          {/* AUDITOR TIMELINE */}
          {activePage === 'admin-audit-timeline' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[9px] text-blue-600 font-mono font-bold tracking-widest uppercase block">Operator Audit logs</span>
                <h2 className="text-2xl font-bold text-slate-900">Platform Compliance Action Trails</h2>
                <p className="text-xs text-slate-500 mt-1">Immutable track records of administrative approvals, rejections, or freezing parameters toggled in the system.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-5">
                <div className="space-y-4">
                  {audits.map(record => (
                    <div key={record.id} className="p-3 bg-slate-50 rounded-lg border border-slate-150 flex flex-col md:flex-row md:items-center justify-between text-xs gap-3">
                      <div>
                        <span className="font-mono text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded mr-2">{record.id}</span>
                        <span className="font-bold text-slate-900">{record.action}</span>
                        <p className="text-[11px] text-slate-505 text-slate-500 mt-0.5">Target entity scope: {record.entityTarget}</p>
                      </div>

                      <div className="text-right font-mono text-[10px] text-slate-400">
                        <p>{record.timestamp}</p>
                        <p>Actor: {record.actor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADMIN CONTRACT GATE CONFIGURATOR */}
          {activePage === 'admin-token-architect' && (
            <div className="space-y-6">
              
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[9px] text-blue-600 font-mono font-bold tracking-widest uppercase block">System configuration</span>
                <h2 className="text-2xl font-bold text-slate-900">Oracle Smart Stablecoin Gateways</h2>
                <p className="text-xs text-slate-500 mt-1">Configure FATF Recomendation rulesets globally across compliance contract parameters.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Universal stablecoin rule limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">TRAVEL RULE THRESHOLD</span>
                    <p className="font-bold text-lg text-slate-905 text-slate-950">$1,000 USD Equivalent</p>
                    <p className="text-[10px] text-slate-500">Payments exceeding this threshold must transmit verified originator/beneficiary PII data packages.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">SANCTIONS LEVEL SECURITY</span>
                    <p className="font-bold text-lg text-rose-600 uppercase">Tier 1 SDN block</p>
                    <p className="text-[10px] text-slate-500">Consolidated sanctions list matches are blocked instantly from settling payouts on-chain block.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">ZERO KNOWLEDGE ASSERTS</span>
                    <p className="font-bold text-lg text-emerald-600">Active Enabled</p>
                    <p className="text-[10px] text-slate-500">Maintains recipient data isolation from cleartext public blocks using zk biometric proofs.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ────────────────────────────────────────────────────────
          FREEZE USER MODAL ELEMENT
          ──────────────────────────────────────────────────────── */}
      {freezeModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl font-sans text-xs">
            
            <div className="p-5 border-b border-slate-100 bg-rose-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600 animate-pulse" />
                <h3 className="text-sm font-bold text-rose-850 text-rose-800 uppercase tracking-widest font-mono">FREEZE CREDENTIAL HOLDER</h3>
              </div>
              <button 
                onClick={() => setFreezeModalUser(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-6 space-y-4 leading-normal font-sans text-xs">
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-[10px] font-mono text-slate-400 uppercase">SUBJECT CREDENTIAL HOLDER</p>
                <span className="font-bold text-slate-900 block text-sm mt-0.5">{freezeModalUser.name}</span>
                <span className="text-[10px] font-mono text-slate-500 block">{freezeModalUser.walletAddress}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Audit Risk Factor</label>
                <select 
                  value={freezeRisk}
                  onChange={(e: any) => setFreezeRisk(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs focus:outline-none"
                >
                  <option value="Low">Low Risk check</option>
                  <option value="Medium">Medium Warning warning</option>
                  <option value="High">High OFAC Alert match</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for freezing payout rails</label>
                <input 
                  type="text"
                  value={freezeReason}
                  onChange={(e) => setFreezeReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">Additional auditor log notes</label>
                <textarea
                  value={freezeNotes}
                  onChange={(e) => setFreezeNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs focus:outline-none min-h-[50px]"
                />
              </div>

              <div className="bg-rose-50/70 p-3 rounded-xl text-rose-800 border border-rose-100 flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                <p className="text-[10.5px]">This is an enterprise action. Freezing automatically locks their A-Pass DID off-chain attestation and halts stablecoin settlement payouts across the network.</p>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setFreezeModalUser(null)}
                className="px-4 py-2 hover:bg-slate-20/50 text-slate-500 font-medium rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleFreezeUserSubmission}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs uppercase tracking-wide cursor-pointer flex items-center gap-1"
              >
                Assemble execution block
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center select-none shrink-0 mt-auto shadow-sm">
        <p className="text-[11px] text-slate-400 font-sans">
          &copy; {new Date().getFullYear()} Coinmark Pay Foundation Inc. All rights reserved. Cryptographically compliance authenticated portal. Sanctions swept hourly.
        </p>
      </footer>

    </div>
  );
}
