import { Transaction, APassIdentity, ATokenRule, TravelRuleReport, AuditRecord } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-9021',
    senderName: 'Cleanverse Labs Inc.',
    senderAddress: '0x3f5c...a812',
    recipientName: 'Devon Webb',
    recipientAddress: '0x9a83...4e12',
    amount: 3200,
    token: 'USDa',
    status: 'Completed',
    riskScore: 8,
    travelRuleStatus: 'Verified',
    timestamp: '2026-06-14 02:14:00',
    txHash: '0x7b58a1f83c...98ef',
    purpose: 'Software Contract - Milestone 3'
  },
  {
    id: 'TX-9020',
    senderName: 'Cleanverse Labs Inc.',
    senderAddress: '0x3f5c...a812',
    recipientName: 'Enter your recipient name',
    recipientAddress: '0x88f2...cd3a',
    amount: 1450,
    token: 'EURa',
    status: 'Completed',
    riskScore: 12,
    travelRuleStatus: 'Verified',
    timestamp: '2026-06-13 18:45:00',
    txHash: '0xfa39e602be...7d11',
    purpose: 'UX/UI Consulting - May Deliverables'
  },
  {
    id: 'TX-9019',
    senderName: 'Velo Finance Corp',
    senderAddress: '0x811c...7d91',
    recipientName: 'Arjun Mehta',
    recipientAddress: '0x12b4...34df',
    amount: 12500,
    token: 'USDa',
    status: 'Completed',
    riskScore: 28,
    travelRuleStatus: 'Verified',
    timestamp: '2026-06-13 11:20:00',
    txHash: '0x3a48e8ddcd...dbeb',
    purpose: 'Quarterly Security Penetration Audit'
  },
  {
    id: 'TX-9018',
    senderName: 'Cleanverse Labs Inc.',
    senderAddress: '0x3f5c...a812',
    recipientName: 'Chen Wei',
    recipientAddress: '0xcd19...def4',
    amount: 950,
    token: 'USDa',
    status: 'Completed',
    riskScore: 5,
    travelRuleStatus: 'Exempt',
    timestamp: '2026-06-12 16:30:00',
    txHash: '0xbcde293198...ee92',
    purpose: 'Logo Design & Brand Guidelines'
  },
  {
    id: 'TX-9017',
    senderName: 'Novara Ventures Ltd',
    senderAddress: '0x5acb...3c22',
    recipientName: 'Katarina Petrova',
    recipientAddress: '0xe9c1...22b8',
    amount: 4300,
    token: 'USDa',
    status: 'Flagged',
    riskScore: 78,
    travelRuleStatus: 'Flagged',
    timestamp: '2026-06-12 09:05:00',
    txHash: '0x9924ba9de1...3492',
    purpose: 'System Integration Support'
  },
  {
    id: 'TX-9016',
    senderName: 'Cleanverse Labs Inc.',
    senderAddress: '0x3f5c...a812',
    recipientName: 'Amara Okafor',
    recipientAddress: '0x6b3f...e81c',
    amount: 6000,
    token: 'EURa',
    status: 'Completed',
    riskScore: 19,
    travelRuleStatus: 'Verified',
    timestamp: '2026-06-11 14:15:00',
    txHash: '0x43a8cdef1a...8e44',
    purpose: 'Full-Stack Smart Contract Engineering'
  },
  {
    id: 'TX-9015',
    senderName: 'Acme Growth Co',
    senderAddress: '0x7123...4fa3',
    recipientName: 'Lucas Dupont',
    recipientAddress: '0x9212...06cb',
    amount: 8500,
    token: 'GBPa',
    status: 'Pending',
    riskScore: 45,
    travelRuleStatus: 'Pending_Attestation',
    timestamp: '2026-06-14 04:50:00',
    txHash: '0x9320fac8be...012d',
    purpose: 'Data Pipeline Optimization Contract'
  }
];

export const INITIAL_A_PASS_IDENTITIES: APassIdentity[] = [
  {
    id: 'AP-2026-3912',
    name: 'Cleanverse Labs Inc.',
    email: 'treasury@cleanverse.network',
    type: 'Business',
    country: 'United States',
    kycLevel: 'Level 3 (Enterprise)',
    status: 'Verified',
    walletAddress: '0x3f5c...a812',
    issuedAt: '2026-01-10 10:00:00',
    riskCategory: 'Low',
    documents: {
      idDocument: true,
      proofOfAddress: true,
      businessRegistry: true,
      sanctionsCheck: 'Passed'
    }
  },
  {
    id: 'AP-2026-8802',
    name: 'Devon Webb',
    email: 'devon.webb@proton.me',
    type: 'Freelancer',
    country: 'United Kingdom',
    kycLevel: 'Level 2 (Standard)',
    status: 'Verified',
    walletAddress: '0x9a83...4e12',
    issuedAt: '2026-02-15 14:30:00',
    riskCategory: 'Low',
    documents: {
      idDocument: true,
      proofOfAddress: true,
      sanctionsCheck: 'Passed'
    }
  },
  {
    id: 'AP-2026-7110',
    name: 'your name',
    email: 'your name.v@outlook.com',
    type: 'Freelancer',
    country: 'Hungary',
    kycLevel: 'Level 2 (Standard)',
    status: 'Verified',
    walletAddress: '0x88f2...cd3a',
    issuedAt: '2026-03-01 09:15:00',
    riskCategory: 'Low',
    documents: {
      idDocument: true,
      proofOfAddress: true,
      sanctionsCheck: 'Passed'
    }
  },
  {
    id: 'AP-2026-1029',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@tech-india.io',
    type: 'Freelancer',
    country: 'India',
    kycLevel: 'Level 2 (Standard)',
    status: 'Verified',
    walletAddress: '0x12b4...34df',
    issuedAt: '2026-04-12 11:40:00',
    riskCategory: 'Medium',
    documents: {
      idDocument: true,
      proofOfAddress: true,
      sanctionsCheck: 'Passed'
    }
  },
  {
    id: 'AP-2026-4402',
    name: 'Katarina Petrova',
    email: 'petrova.kats@runbox.com',
    type: 'Freelancer',
    country: 'Cyprus',
    kycLevel: 'Level 1 (Basic)',
    status: 'Verified',
    walletAddress: '0xe9c1...22b8',
    issuedAt: '2026-05-18 16:55:00',
    riskCategory: 'High',
    documents: {
      idDocument: true,
      proofOfAddress: false,
      sanctionsCheck: 'Passed'
    }
  },
  {
    id: 'AP-2026-0129',
    name: 'Zane Thompson',
    email: 'zane@frontier-labs.co',
    type: 'Freelancer',
    country: 'Panama',
    kycLevel: 'Level 1 (Basic)',
    status: 'Pending',
    walletAddress: '0x7db1...ef09',
    issuedAt: '2026-06-11 08:22:00',
    riskCategory: 'Medium',
    documents: {
      idDocument: true,
      proofOfAddress: true,
      sanctionsCheck: 'Pending'
    }
  }
];

export const INITIAL_A_TOKEN_RULES: ATokenRule[] = [
  {
    id: 'RULE-101',
    name: 'OFAC Sanctions Gating',
    description: 'Ensure recipient wallet values screening does not match OFAC Specially Designated Nationals List.',
    category: 'Sanctions',
    value: 'Global OFAC List v2.4',
    enabled: true,
    severity: 'Block'
  },
  {
    id: 'RULE-102',
    name: 'Geofenced High-Risk Jurisdictions',
    description: 'Restrict token routing or interactions with wallets bound to North Korea, Iran, Syria, and Cuba.',
    category: 'Geofencing',
    value: 'KP, IR, SY, CU',
    enabled: true,
    severity: 'Block'
  },
  {
    id: 'RULE-103',
    name: 'FATF Travel Rule Threshold',
    description: 'Enforce full secure KYC transmission and VASP identification for single transactions exceeding $1,000 threshold.',
    category: 'TravelRule',
    value: '1000 USD Equiv',
    enabled: true,
    severity: 'Flag'
  },
  {
    id: 'RULE-104',
    name: 'Freelancer Daily Velocity Limit',
    description: 'Max volume dispatched per 24 hours to high-risk client categories without Tier 3 verification.',
    category: 'Velocity',
    value: '15000',
    enabled: true,
    severity: 'Review'
  },
  {
    id: 'RULE-105',
    name: 'Suspicious IP Block',
    description: 'Flag transactions requested or signed from public VPN hubs or Tor exit nodes.',
    category: 'Security' as any,
    value: 'TorExitFilterActive',
    enabled: false,
    severity: 'Flag'
  }
];

export const INITIAL_TRAVEL_RULE_REPORTS: TravelRuleReport[] = [
  {
    id: 'TR-4011',
    transactionId: 'TX-9019',
    originatorVASP: 'Coinmark Pay (Client)',
    beneficiaryVASP: 'CoinSwitch Elite VASP',
    originatorAPass: 'AP-2026-3912',
    beneficiaryAPass: 'AP-2026-1029',
    amountUSD: 12500,
    status: 'Approved',
    certifiedAt: '2026-06-13 11:21:05'
  },
  {
    id: 'TR-4010',
    transactionId: 'TX-9016',
    originatorVASP: 'Coinmark Pay (Client)',
    beneficiaryVASP: 'Kraken Institutional VASP',
    originatorAPass: 'AP-2026-3912',
    beneficiaryAPass: 'AP-2026-7110',
    amountUSD: 6420,
    status: 'Approved',
    certifiedAt: '2026-06-11 14:17:11'
  },
  {
    id: 'TR-4009',
    transactionId: 'TX-9015',
    originatorVASP: 'Coinmark Pay (Client)',
    beneficiaryVASP: 'Binance Custodial VASP',
    originatorAPass: 'AP-2026-3912',
    beneficiaryAPass: 'AP-2026-8802',
    amountUSD: 8500,
    status: 'In_Review',
    certifiedAt: '2026-06-14 04:50:41'
  }
];

export const INITIAL_AUDIT_TIMELINE: AuditRecord[] = [
  {
    id: 'AUD-9192',
    timestamp: '2026-06-14 04:50:00',
    action: 'Travel Rule payload dispatched for TX-9015',
    user: 'system_contract',
    category: 'Travel_Rule',
    status: 'Success',
    hash: '0xbade...ae91'
  },
  {
    id: 'AUD-9191',
    timestamp: '2026-06-14 02:14:02',
    action: 'Anti-Pass KYC State Certified for Devon Webb',
    user: 'compliance_officer_3',
    category: 'KYC',
    status: 'Success',
    hash: '0xcade...11bf'
  },
  {
    id: 'AUD-9190',
    timestamp: '2026-06-13 15:10:22',
    action: 'AToken Compliance Rule modified (Velocities enabled)',
    user: 'admin_root@coinmark.pay',
    category: 'Rule_Change',
    status: 'Warning',
    hash: '0xda3f...ff01'
  },
  {
    id: 'AUD-9189',
    timestamp: '2026-06-12 09:05:03',
    action: 'Flagged transaction: TX-9017 detected High Risk routing',
    user: 'threat_engine_v4',
    category: 'Security',
    status: 'Failure',
    hash: '0xe8a1...39d2'
  },
  {
    id: 'AUD-9188',
    timestamp: '2026-06-11 14:15:00',
    action: 'Payout of 6,000 EURa signed and emitted to Amara Okafor',
    user: 'client_caller_api',
    category: 'Payout',
    status: 'Success',
    hash: '0xf3fb...3312'
  }
];

// Map SVG visualization helper data (cross-border points connected to Cleanverse Hub)
export const MAP_NODES = [
  { id: 'hub', name: 'US Host (Cleanverse)', x: 180, y: 130, color: '#F97316' },
  { id: 'london', name: 'UK Beneficiary', x: 410, y: 100, color: '#38BDF8' },
  { id: 'budapest', name: 'Europe Node', x: 450, y: 110, color: '#34D399' },
  { id: 'india', name: 'Arjun (India)', x: 620, y: 180, color: '#FBBF24' },
  { id: 'nigeria', name: 'Lagos Peer', x: 420, y: 220, color: '#A78BFA' },
  { id: 'panama', name: 'Zane (Panama)', x: 230, y: 200, color: '#F472B6' }
];

export const MAP_CONNECTIONS = [
  { from: 'hub', to: 'london', active: true, pulse: true },
  { from: 'hub', to: 'budapest', active: true, pulse: false },
  { from: 'hub', to: 'india', active: true, pulse: true },
  { from: 'hub', to: 'nigeria', active: true, pulse: false },
  { from: 'hub', to: 'panama', active: false, pulse: false }
];
