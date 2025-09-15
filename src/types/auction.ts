// Auction module types based on MODULE_DAU_GIA_QUYEN_LOI_PHAN_PHOI.md

export interface AuctionRound {
  id: string;
  roundId: string;
  gid: string;
  company: string;
  businessName: string;
  packageName: string;
  termMonths: number;
  startAt: string;
  endAt: string;
  baseRate: number;
  deltaMax: number;
  deltaFloor: number;
  a: number;
  b: number;
  targetAmount: number;
  raised: number;
  cover: number;
  deltaNow: number;
  rOffer: number;
  roundIndex: number;
  roundCount: number;
  status: 'pending' | 'open' | 'clearing' | 'closed';
  docs: AuctionDocument[];
  gTrust?: number;
  antiSnipingExtensions?: number;
  currentPrice: number;
  priceDecrement: number;
  reservePrice: number;
  totalBids: number;
  participantCount: number;
  interestRate: number;
  currentAmount: number;
  trustScore?: number;
  lotSize: number;
  capPercentage: number;
}

export interface AuctionDocument {
  id?: string;
  title: string;
  docHash: string;
  url?: string;
  type?: 'terms' | 'allocation' | 'receipt' | 'prospectus' | 'financial_report' | 'legal_opinion';
}

export interface BidOrder {
  id: string;
  bidId: string;
  roundId: string;
  userId: string;
  userName?: string;
  amount: number;
  type: 'market' | 'limit';
  deltaMin?: number;
  status: 'pending' | 'filled' | 'partial' | 'cancelled' | 'expired';
  filledAmount?: number;
  clearRate?: number;
  createdAt: string;
  updatedAt: string;
  idempotencyKey: string;
  receiptHash?: string;
  auctionId: string;
}

export interface BidRequest {
  roundId: string;
  amount: number;
  type: 'market' | 'limit';
  deltaMin?: number;
  idempotencyKey: string;
}

export interface AllocationResult {
  id: string;
  roundId: string;
  clearRate: number;
  totalFilled: number;
  allocationDocUrl: string;
  docHash: string;
  contractsInitiated: number;
  chainTxHash: string;
}

export interface AuctionFilters {
  status?: string[];
  gTrustMin?: number;
  termMonths?: number[];
  company?: string;
  sortBy?: 'endAt' | 'gTrust' | 'rOffer' | 'cover';
  sortOrder?: 'asc' | 'desc';
}

export interface AuctionStats {
  totalRounds: number;
  activeRounds: number;
  totalRaised: number;
  averageCover: number;
  averageRClear: number;
}

export interface UserBidSummary {
  totalBids: number;
  totalAmount: number;
  filledAmount: number;
  pendingAmount: number;
  activeBids: BidOrder[];
  recentBids: BidOrder[];
}

export interface UserPortfolio {
  id: string;
  userId: string;
  investments: any[];
  totalValue: number;
  performance: number;
  availableBalance: number;
}

export interface AuctionNotification {
  id: string;
  type: 'round_ending' | 'extension' | 'cleared' | 'bid_filled' | 'bid_failed' | 'bid_placed' | 'price_alert' | 'auction_starting' | 'allocation_confirmed' | 'auction_paused';
  roundId: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface RealtimeUpdate {
  roundId: string;
  deltaNow: number;
  rOffer: number;
  cover: number;
  raised: number;
  timeRemaining: number;
  lastUpdate: string;
}

// API Response types
export interface AuctionListResponse {
  rounds: AuctionRound[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface BidResponse {
  success: boolean;
  bidId?: string;
  message?: string;
  receiptUrl?: string;
  receiptHash?: string;
}

export interface AuctionError {
  code: string;
  message: string;
  details?: any;
}

// WebSocket message types
export interface WSMessage {
  type: 'auction_update' | 'bid_update' | 'notification';
  data: RealtimeUpdate | BidOrder | AuctionNotification;
}

// Form validation types
export interface BidFormData {
  amount: string;
  type: 'market' | 'limit';
  deltaMin?: string;
}

export interface BidFormErrors {
  amount?: string;
  deltaMin?: string;
  general?: string;
}

// Constants
export const AUCTION_STATUS_LABELS = {
  pending: 'Sắp mở',
  open: 'Đang mở',
  clearing: 'Đang chốt',
  closed: 'Đã đóng'
} as const;

export const BID_TYPE_LABELS = {
  market: 'Nhận ngay',
  limit: 'Giới hạn'
} as const;

export const BID_STATUS_LABELS = {
  pending: 'Chờ xử lý',
  filled: 'Đã khớp',
  partial: 'Khớp một phần',
  cancelled: 'Đã hủy',
  expired: 'Hết hạn'
} as const;