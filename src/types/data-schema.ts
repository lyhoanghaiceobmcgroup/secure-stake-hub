// Chuẩn hóa dữ liệu tối thiểu cho hệ thống GoldenBook

// User/KYC Schema
export interface UserKYC {
  userId: string;
  kycStatus: 'pending' | 'processing' | 'verified' | 'rejected';
  kycDocHash: string;
  verifiedAt?: string;
  rejectedReason?: string;
}

// Wallet Transaction Schema
export interface WalletTransaction {
  txId: string;
  type: 'topup' | 'hold' | 'allocate' | 'distribution';
  amount: number;
  state: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  proofHash: string;
  createdAt: string;
  completedAt?: string;
  description?: string;
}

// Investment Intent Schema
export interface InvestmentIntent {
  intentId: string;
  gid: string; // Group/Package ID
  amount: number;
  holdAt: string;
  eSignStatus: 'pending' | 'signed_investor' | 'signed_all' | 'rejected';
  issuerConfirmAt?: string;
  createdAt: string;
  expiresAt: string;
}

// Certificate (CQĐĐT) Schema
export interface Certificate {
  cqid: string; // Certificate ID
  gid: string; // Group/Package ID
  userId: string;
  qr: string; // QR code data
  certHash: string;
  allocatedAt: string;
  status: 'allocated' | 'active' | 'matured' | 'cancelled';
  amount: number;
  maturityDate: string;
}

// Distribution Schema
export interface Distribution {
  batchId: string;
  gid: string;
  period: string; // e.g., "2025-Q1", "2025-01"
  amount: number;
  docHash: string;
  settledAt?: string;
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  distributionDate: string;
}

// Documents Schema
export interface Document {
  docId: string;
  type: 'contract' | 'payout' | 'statement' | 'progress';
  docHash: string;
  qrLink: string;
  createdAt: string;
  title: string;
  description?: string;
  fileSize?: number;
  mimeType?: string;
}

// Progress Profile Schema (for widget)
export interface ProgressProfile {
  kycStatus: 'pending' | 'processing' | 'verified' | 'rejected';
  bankPrimary: boolean;
  twoFA: {
    enabled: boolean;
    method?: 'sms' | 'app' | 'email';
  };
  wallet: {
    available: number;
    held: number;
    total: number;
  };
  riskAcknowledgedAt?: string;
  intentDraft?: {
    gid: string;
    amount: number;
    id: string;
    expiresAt: string;
  };
  contract?: {
    status: 'draft' | 'signed_investor' | 'signed_all' | 'rejected';
    id: string;
    signedAt?: string;
  };
  certificate?: {
    status: 'pending' | 'allocated' | 'active';
    cqid: string;
    allocatedAt?: string;
  };
}

// Step Status for Progress Widget
export interface StepStatus {
  id: string;
  name: string;
  required: boolean;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  weight: number;
  deepLink: string;
  description: string;
  completionCriteria: string;
  blockingReason?: string;
}

// Analytics Events
export interface AnalyticsEvent {
  event: 'progress.view' | 'progress.jump_click' | 'progress.step_done' | 'progress.blocked' | 'progress.resume_intent';
  properties: {
    step?: string;
    gid?: string;
    intentId?: string;
    fromRoute?: string;
    device: 'desktop' | 'mobile' | 'tablet';
    timestamp: string;
    userId: string;
  };
}

// Legal Disclaimer Content
export interface LegalDisclaimer {
  id: string;
  type: 'esign' | 'report' | 'general';
  content: string;
  version: string;
  effectiveDate: string;
  language: 'vi' | 'en';
}

// Bank Account Schema
export interface BankAccount {
  id: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isPrimary: boolean;
  verifiedAt?: string;
  proofHash?: string;
  status: 'pending' | 'verified' | 'rejected';
}

// Risk Acknowledgment Schema
export interface RiskAcknowledgment {
  id: string;
  userId: string;
  gid: string;
  acknowledgedAt: string;
  logHash: string;
  ipAddress: string;
  userAgent: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// Notification Settings
export interface NotificationSettings {
  userId: string;
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
  preferences: {
    distributions: boolean;
    contractUpdates: boolean;
    systemAlerts: boolean;
    marketing: boolean;
  };
}

// Reinvestment Settings
export interface ReinvestmentSettings {
  userId: string;
  enabled: boolean;
  rules: {
    autoReinvest: boolean;
    minAmount: number;
    preferredPackages: string[];
    maxAllocation: number;
  };
  createdAt: string;
  updatedAt: string;
}