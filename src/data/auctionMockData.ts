// Mock auction data following the specification
import { AuctionRound, BidOrder, AllocationResult, AuctionDocument, AuctionNotification, UserPortfolio } from '../types/auction';

// Sample auction rounds data
export const mockAuctionRounds: AuctionRound[] = [
  {
    id: 'UF-2025Q3-R2',
    roundId: 'UF-2025Q3-R2',
    gid: 'UF-FOOD-3M',
    company: 'UrbanFoods',
    businessName: 'UrbanFoods',
    packageName: 'Gói mở rộng F&B',
    termMonths: 3,
    startAt: '2025-09-15T10:00:00+07:00',
    endAt: '2025-09-15T13:00:00+07:00',
    baseRate: 0.072,
    deltaMax: 0.0040,
    deltaFloor: 0.0010,
    a: 0.3,
    b: 0.5,
    targetAmount: 12000000000,
    raised: 8760000000,
    cover: 0.73,
    deltaNow: 0.0028,
    rOffer: 0.0748,
    roundIndex: 2,
    roundCount: 3,
    status: 'open',
    docs: [{
      title: 'Điều khoản vòng UF R2',
      docHash: '5a0f…d4a1',
      type: 'terms'
    }],
    gTrust: 82,
    antiSnipingExtensions: 0,
    currentPrice: 7.48,
    priceDecrement: 0.1,
    reservePrice: 7.10,
    totalBids: 45,
    participantCount: 23,
    interestRate: 7.48,
    currentAmount: 8760000000,
    trustScore: 82,
    lotSize: 100000,
    capPercentage: 0.20
  },
  {
    id: 'TV-2025Q3-R1',
    roundId: 'TV-2025Q3-R1',
    gid: 'TV-TECH-6M',
    company: 'TechVenture',
    businessName: 'TechVenture Solutions',
    packageName: 'Gói công nghệ AI',
    termMonths: 6,
    startAt: '2025-09-16T09:00:00+07:00',
    endAt: '2025-09-16T15:00:00+07:00',
    baseRate: 0.085,
    deltaMax: 0.0050,
    deltaFloor: 0.0015,
    a: 0.4,
    b: 0.6,
    targetAmount: 8000000000,
    raised: 5200000000,
    cover: 0.65,
    deltaNow: 0.0032,
    rOffer: 0.0818,
    roundIndex: 1,
    roundCount: 2,
    status: 'open',
    docs: [{
      title: 'Điều khoản vòng TV R1',
      docHash: '7b1e…f5c2',
      type: 'terms'
    }],
    gTrust: 78,
    antiSnipingExtensions: 0,
    currentPrice: 8.18,
    priceDecrement: 0.08,
    reservePrice: 8.35,
    totalBids: 32,
    participantCount: 18,
    interestRate: 8.18,
    currentAmount: 5200000000,
    trustScore: 78,
    lotSize: 50000,
    capPercentage: 0.25
  },
  {
    id: 'ED-2025Q3-R3',
    roundId: 'ED-2025Q3-R3',
    gid: 'ED-EDU-12M',
    company: 'EduSmart',
    businessName: 'EduSmart Technology',
    packageName: 'Nền tảng giáo dục AI',
    termMonths: 12,
    startAt: '2025-09-17T08:00:00+07:00',
    endAt: '2025-09-17T16:00:00+07:00',
    baseRate: 0.095,
    deltaMax: 0.0060,
    deltaFloor: 0.0020,
    a: 0.35,
    b: 0.45,
    targetAmount: 15000000000,
    raised: 15000000000,
    cover: 1.0,
    deltaNow: 0.0020,
    rOffer: 0.0930,
    roundIndex: 3,
    roundCount: 3,
    status: 'closed',
    docs: [{
      title: 'Điều khoản vòng ED R3',
      docHash: '8c2f…e3b4',
      type: 'terms'
    }],
    gTrust: 85,
    antiSnipingExtensions: 2,
    currentPrice: 9.30,
    priceDecrement: 0.05,
    reservePrice: 9.50,
    totalBids: 67,
    participantCount: 42,
    interestRate: 9.30,
    currentAmount: 15000000000,
    trustScore: 85,
    lotSize: 200000,
    capPercentage: 0.15
  }
];

// Mock bid orders
export const mockBidOrders: BidOrder[] = [
  {
    id: 'BID-UF-001',
    bidId: 'BID-UF-001',
    roundId: 'UF-2025Q3-R2',
    userId: 'USER-001',
    userName: 'Nguyễn Văn A',
    amount: 2000000,
    type: 'market',
    status: 'filled',
    filledAmount: 2000000,
    clearRate: 0.0748,
    createdAt: '2025-09-15T12:40:27+07:00',
    updatedAt: '2025-09-15T12:40:27+07:00',
    idempotencyKey: 'user001-uf-1726379227-abc123',
    receiptHash: 'c0de…91aa',
    auctionId: 'UF-2025Q3-R2'
  },
  {
    id: 'BID-UF-002',
    bidId: 'BID-UF-002',
    roundId: 'UF-2025Q3-R2',
    userId: 'USER-001',
    userName: 'Nguyễn Văn A',
    amount: 3000000,
    type: 'limit',
    deltaMin: 0.0025,
    status: 'pending',
    createdAt: '2025-09-15T12:44:10+07:00',
    updatedAt: '2025-09-15T12:44:10+07:00',
    idempotencyKey: 'user001-uf-1726379450-def456',
    receiptHash: 'ab77…21ef',
    auctionId: 'UF-2025Q3-R2'
  },
  {
    id: 'BID-TV-001',
    bidId: 'BID-TV-001',
    roundId: 'TV-2025Q3-R1',
    userId: 'USER-002',
    userName: 'Trần Thị B',
    amount: 1500000,
    type: 'market',
    status: 'filled',
    filledAmount: 1320000,
    clearRate: 0.0815,
    createdAt: '2025-09-16T13:15:42+07:00',
    updatedAt: '2025-09-16T13:15:42+07:00',
    idempotencyKey: 'user002-tv-1726466142-ghi789',
    receiptHash: 'd1ef…82bb',
    auctionId: 'TV-2025Q3-R1'
  }
];

// Mock allocation results
export const mockAllocationResults: AllocationResult[] = [
  {
    id: 'ALLOC-UF-001',
    roundId: 'UF-2025Q3-R2',
    clearRate: 0.0746,
    totalFilled: 11400000000,
    allocationDocUrl: '/docs/allocation-uf-r2.pdf',
    docHash: 'e3aa…9b10',
    contractsInitiated: 156,
    chainTxHash: '0x7e91d…abc123'
  },
  {
    id: 'ALLOC-TV-001',
    roundId: 'TV-2025Q3-R1',
    clearRate: 0.0815,
    totalFilled: 7040000000,
    allocationDocUrl: '/docs/allocation-tv-r1.pdf',
    docHash: 'f4bb…8c21',
    contractsInitiated: 98,
    chainTxHash: '0x9f82e…def456'
  }
];

// Mock documents
export const mockDocuments: AuctionDocument[] = [
  {
    id: 'DOC-UF-001',
    title: 'Điều khoản vòng UF R2',
    docHash: '5a0f…d4a1',
    type: 'terms',
    url: '/docs/uf-r2-terms.pdf'
  },
  {
    id: 'DOC-TV-001',
    title: 'Điều khoản vòng TV R1',
    docHash: '7b1e…f5c2',
    type: 'terms',
    url: '/docs/tv-r1-terms.pdf'
  },
  {
    id: 'DOC-UF-002',
    title: 'Báo cáo tài chính UrbanFoods 2024',
    docHash: '9d3c…a2f1',
    type: 'financial_report',
    url: '/docs/uf-financial-2024.pdf'
  }
];

// Mock notifications
export const mockNotifications: AuctionNotification[] = [
  {
    id: 'NOTIF-001',
    type: 'bid_filled',
    roundId: 'UF-2025Q3-R2',
    message: 'Lệnh market 2.000.000 VND đã được khớp thành công',
    timestamp: '2025-09-15T12:40:30+07:00',
    read: false,
    actionUrl: '/investor/auction/UF-2025Q3-R2'
  },
  {
    id: 'NOTIF-002',
    type: 'round_ending',
    roundId: 'UF-2025Q3-R2',
    message: 'Vòng đấu giá sẽ kết thúc trong 15 phút',
    timestamp: '2025-09-15T12:45:00+07:00',
    read: false,
    actionUrl: '/investor/auction/UF-2025Q3-R2'
  },
  {
    id: 'NOTIF-003',
    type: 'cleared',
    roundId: 'ED-2025Q3-R3',
    message: 'Vòng đấu giá đã kết thúc với R_clear = 9.30%',
    timestamp: '2025-09-17T16:00:10+07:00',
    read: true,
    actionUrl: '/investor/auction/ED-2025Q3-R3'
  }
];

// Mock user portfolio
export const mockUserPortfolio: UserPortfolio = {
  id: 'PORTFOLIO-001',
  userId: 'USER-001',
  investments: [],
  totalValue: 45000000,
  performance: 0.125,
  availableBalance: 120000000
};

// Helper functions
export const getAuctionById = (id: string): AuctionRound | undefined => {
  return mockAuctionRounds.find(auction => auction.id === id);
};

export const getBidsByRoundId = (roundId: string): BidOrder[] => {
  return mockBidOrders.filter(bid => bid.roundId === roundId);
};

export const getBidsByUserId = (userId: string): BidOrder[] => {
  return mockBidOrders.filter(bid => bid.userId === userId);
};

export const getNotificationsByUserId = (userId: string): AuctionNotification[] => {
  return mockNotifications;
};

export const getActiveAuctions = (): AuctionRound[] => {
  return mockAuctionRounds.filter(auction => auction.status === 'open');
};

export const getUpcomingAuctions = (): AuctionRound[] => {
  return mockAuctionRounds.filter(auction => auction.status === 'pending');
};

export const getCompletedAuctions = (): AuctionRound[] => {
  return mockAuctionRounds.filter(auction => auction.status === 'closed');
};

// Helper function to get detailed auction data by roundId
export const getDetailedAuctionByRoundIdLocal = (roundId: string) => {
  // Implementation to get detailed auction data
  return null; // Placeholder
};

// Add missing exports and functions
export const getBidsByAuctionId = getBidsByRoundId;
export const getDocumentsByAuctionId = (auctionId: string): AuctionDocument[] => {
  return mockDocuments.filter(doc => doc.id?.includes(auctionId.split('-')[0]));
};

export const mockPriceHistory = {
  'UF-2025Q3-R2': [
    { timestamp: '2025-09-15T10:00:00+07:00', price: 7.20 },
    { timestamp: '2025-09-15T11:00:00+07:00', price: 7.35 },
    { timestamp: '2025-09-15T12:00:00+07:00', price: 7.48 },
    { timestamp: '2025-09-15T12:55:00+07:00', price: 7.48 }
  ],
  'TV-2025Q3-R1': [
    { timestamp: '2025-09-16T09:00:00+07:00', price: 8.50 },
    { timestamp: '2025-09-16T10:00:00+07:00', price: 8.35 },
    { timestamp: '2025-09-16T11:00:00+07:00', price: 8.25 },
    { timestamp: '2025-09-16T14:30:00+07:00', price: 8.18 }
  ]
};

export const enhancedMockAuctionRounds = mockAuctionRounds;

export const getDetailedAuctionByRoundId = getDetailedAuctionByRoundIdLocal;
