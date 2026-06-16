export interface Transaction {
  id: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  amount: number;
  token: 'USDa' | 'EURa' | 'GBPa';
  status: 'Completed' | 'Pending' | 'Flagged' | 'Rejected';
  riskScore: number; // 0 to 100
  travelRuleStatus: 'Exempt' | 'Verified' | 'Pending_Attestation' | 'Flagged';
  timestamp: string;
  txHash: string;
  purpose: string;
}

export interface APassIdentity {
  id: string; // "AP-XXXX-XXXX"
  name: string;
  email: string;
  type: 'Business' | 'Freelancer';
  country: string;
  kycLevel: 'Level 1 (Basic)' | 'Level 2 (Standard)' | 'Level 3 (Enterprise)';
  status: 'Verified' | 'Pending' | 'Submitted' | 'Suspended';
  walletAddress: string;
  issuedAt: string;
  riskCategory: 'Low' | 'Medium' | 'High';
  documents: {
    idDocument: boolean;
    proofOfAddress: boolean;
    businessRegistry?: boolean;
    sanctionsCheck: 'Passed' | 'Failed' | 'Pending';
  };
}

export interface ATokenRule {
  id: string;
  name: string;
  description: string;
  category: 'Velocity' | 'Sanctions' | 'Geofencing' | 'TravelRule' | 'VolumeLimit';
  value: string | number;
  enabled: boolean;
  severity: 'Block' | 'Flag' | 'Review';
}

export interface TravelRuleReport {
  id: string; // TR-XXXX
  transactionId: string;
  originatorVASP: string;
  beneficiaryVASP: string;
  originatorAPass: string;
  beneficiaryAPass: string;
  amountUSD: number;
  status: 'Filed' | 'In_Review' | 'Flagged' | 'Approved';
  certifiedAt: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  category: 'KYC' | 'Payout' | 'Rule_Change' | 'Travel_Rule' | 'Security';
  status: 'Success' | 'Warning' | 'Failure';
  hash: string; // cryptographic log proof
}
