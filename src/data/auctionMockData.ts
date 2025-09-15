import { AuctionRound, BidOrder, AllocationResult, AuctionDocument, AuctionNotification, UserPortfolio } from '../types/auction';
import { urbanFoodsAuctionData, techStartupAuctionData, formatVND, formatPercentage, calculateTimeRemaining, getDetailedAuctionData } from './detailedAuctionMockData';
import type { DetailedAuctionData } from './detailedAuctionMockData';

// Mock Auction Rounds với các trạng thái khác nhau
export const mockAuctionRounds: AuctionRound[] = [
  {
    id: 'AUC-2025-001',
    packageId: 'PKG-TECH-001',
    packageName: 'Gói Công nghệ Xanh VinTech',
    businessName: 'VinTech Solutions JSC',
    businessLogo: '/placeholder.svg',
    status: 'active',
    currentPrice: 8.5,
    startPrice: 12.0,
    reservePrice: 7.0,
    targetAmount: 50000000000, // 50 tỷ VND
    raisedAmount: 32500000000, // 32.5 tỷ VND
    totalShares: 5000000,
    availableShares: 1875000,
    minBidAmount: 10000000, // 10 triệu VND
    maxBidAmount: 1000000000, // 1 tỷ VND
    startTime: '2025-01-20T09:00:00Z',
    endTime: '2025-01-20T17:00:00Z',
    extendedEndTime: null,
    priceDecrement: 0.1,
    decrementInterval: 300, // 5 phút
    antiSnipingDuration: 300, // 5 phút
    participantCount: 247,
    bidCount: 1523,
    description: 'Gói góp vốn phát triển công nghệ năng lượng tái tạo và giải pháp IoT thông minh cho doanh nghiệp.',
    riskLevel: 'medium',
    expectedReturn: 15.5,
    term: '24 tháng',
    distributionSchedule: 'Hàng quý',
    documents: ['prospectus', 'financial_report', 'legal_opinion'],
    tags: ['Công nghệ', 'Xanh', 'IoT', 'Năng lượng'],
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z'
  },
  {
    id: 'AUC-2025-002',
    packageId: 'PKG-FOOD-002',
    packageName: 'Chuỗi Thực phẩm Organic FreshMart',
    businessName: 'FreshMart Organic Co., Ltd',
    businessLogo: '/placeholder.svg',
    status: 'upcoming',
    currentPrice: 0,
    startPrice: 9.5,
    reservePrice: 6.5,
    targetAmount: 30000000000, // 30 tỷ VND
    raisedAmount: 0,
    totalShares: 3000000,
    availableShares: 3000000,
    minBidAmount: 5000000, // 5 triệu VND
    maxBidAmount: 500000000, // 500 triệu VND
    startTime: '2025-01-21T10:00:00Z',
    endTime: '2025-01-21T16:00:00Z',
    extendedEndTime: null,
    priceDecrement: 0.05,
    decrementInterval: 600, // 10 phút
    antiSnipingDuration: 300,
    participantCount: 0,
    bidCount: 0,
    description: 'Mở rộng chuỗi cửa hàng thực phẩm organic và phát triển hệ thống logistics từ nông trại đến bàn ăn.',
    riskLevel: 'low',
    expectedReturn: 12.8,
    term: '18 tháng',
    distributionSchedule: 'Hàng quý',
    documents: ['prospectus', 'financial_report'],
    tags: ['Thực phẩm', 'Organic', 'Bán lẻ', 'Logistics'],
    createdAt: '2025-01-16T09:00:00Z',
    updatedAt: '2025-01-20T15:00:00Z'
  },
  {
    id: 'AUC-2025-003',
    packageId: 'PKG-EDU-003',
    packageName: 'Nền tảng Giáo dục Trực tuyến EduSmart',
    businessName: 'EduSmart Technology JSC',
    businessLogo: '/placeholder.svg',
    status: 'completed',
    currentPrice: 7.2,
    startPrice: 11.0,
    reservePrice: 7.0,
    targetAmount: 25000000000, // 25 tỷ VND
    raisedAmount: 25000000000, // Đã huy động đủ
    totalShares: 2500000,
    availableShares: 0,
    minBidAmount: 8000000, // 8 triệu VND
    maxBidAmount: 800000000, // 800 triệu VND
    startTime: '2025-01-18T09:00:00Z',
    endTime: '2025-01-18T15:30:00Z',
    extendedEndTime: '2025-01-18T15:45:00Z',
    priceDecrement: 0.08,
    decrementInterval: 450, // 7.5 phút
    antiSnipingDuration: 300,
    participantCount: 189,
    bidCount: 892,
    description: 'Phát triển nền tảng giáo dục trực tuyến với AI và VR, kết nối giáo viên và học sinh toàn cầu.',
    riskLevel: 'high',
    expectedReturn: 18.2,
    term: '36 tháng',
    distributionSchedule: 'Hàng quý',
    documents: ['prospectus', 'financial_report', 'legal_opinion', 'tech_roadmap'],
    tags: ['Giáo dục', 'AI', 'VR', 'EdTech'],
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2025-01-18T15:45:00Z'
  },
  {
    id: 'AUC-2025-004',
    packageId: 'PKG-HEALTH-004',
    packageName: 'Hệ thống Y tế Thông minh HealthTech',
    businessName: 'HealthTech Innovation Ltd',
    businessLogo: '/placeholder.svg',
    status: 'paused',
    currentPrice: 10.2,
    startPrice: 14.5,
    reservePrice: 9.0,
    targetAmount: 75000000000, // 75 tỷ VND
    raisedAmount: 15000000000, // 15 tỷ VND
    totalShares: 7500000,
    availableShares: 6000000,
    minBidAmount: 15000000, // 15 triệu VND
    maxBidAmount: 1500000000, // 1.5 tỷ VND
    startTime: '2025-01-19T08:00:00Z',
    endTime: '2025-01-19T18:00:00Z',
    extendedEndTime: null,
    priceDecrement: 0.12,
    decrementInterval: 360, // 6 phút
    antiSnipingDuration: 600, // 10 phút
    participantCount: 98,
    bidCount: 234,
    description: 'Xây dựng hệ thống quản lý bệnh viện thông minh và ứng dụng telemedicine cho chăm sóc sức khỏe từ xa.',
    riskLevel: 'medium',
    expectedReturn: 16.8,
    term: '30 tháng',
    distributionSchedule: 'Hàng quý',
    documents: ['prospectus', 'financial_report', 'regulatory_approval'],
    tags: ['Y tế', 'HealthTech', 'Telemedicine', 'AI'],
    createdAt: '2025-01-14T07:00:00Z',
    updatedAt: '2025-01-19T12:30:00Z'
  },
  {
    id: 'AUC-2025-005',
    packageId: 'PKG-FINTECH-005',
    packageName: 'Nền tảng Thanh toán Số PayNext',
    businessName: 'PayNext Financial Services',
    businessLogo: '/placeholder.svg',
    status: 'cancelled',
    currentPrice: 0,
    startPrice: 13.8,
    reservePrice: 10.0,
    targetAmount: 40000000000, // 40 tỷ VND
    raisedAmount: 0,
    totalShares: 4000000,
    availableShares: 4000000,
    minBidAmount: 12000000, // 12 triệu VND
    maxBidAmount: 1200000000, // 1.2 tỷ VND
    startTime: '2025-01-17T09:30:00Z',
    endTime: '2025-01-17T17:30:00Z',
    extendedEndTime: null,
    priceDecrement: 0.15,
    decrementInterval: 300,
    antiSnipingDuration: 300,
    participantCount: 0,
    bidCount: 0,
    description: 'Phát triển nền tảng thanh toán số và ví điện tử với công nghệ blockchain và bảo mật cao.',
    riskLevel: 'high',
    expectedReturn: 20.5,
    term: '42 tháng',
    distributionSchedule: 'Hàng quý',
    documents: ['prospectus'],
    tags: ['FinTech', 'Blockchain', 'Thanh toán', 'Bảo mật'],
    createdAt: '2025-01-10T11:00:00Z',
    updatedAt: '2025-01-17T08:00:00Z'
  }
];

// Mock Bid Orders
export const mockBidOrders: BidOrder[] = [
  {
    id: 'BID-001',
    auctionId: 'AUC-2025-001',
    userId: 'USER-001',
    userName: 'Nguyễn Văn A',
    type: 'market',
    quantity: 1000,
    price: 8.5,
    amount: 8500000,
    status: 'filled',
    timestamp: '2025-01-20T14:25:00Z',
    filledQuantity: 1000,
    filledPrice: 8.5,
    remainingQuantity: 0
  },
  {
    id: 'BID-002',
    auctionId: 'AUC-2025-001',
    userId: 'USER-002',
    userName: 'Trần Thị B',
    type: 'limit',
    quantity: 2500,
    price: 8.2,
    amount: 20500000,
    status: 'pending',
    timestamp: '2025-01-20T14:20:00Z',
    filledQuantity: 0,
    filledPrice: 0,
    remainingQuantity: 2500
  },
  {
    id: 'BID-003',
    auctionId: 'AUC-2025-001',
    userId: 'USER-003',
    userName: 'Lê Minh C',
    type: 'market',
    quantity: 500,
    price: 8.5,
    amount: 4250000,
    status: 'filled',
    timestamp: '2025-01-20T14:28:00Z',
    filledQuantity: 500,
    filledPrice: 8.5,
    remainingQuantity: 0
  },
  {
    id: 'BID-004',
    auctionId: 'AUC-2025-001',
    userId: 'USER-004',
    userName: 'Phạm Thị D',
    type: 'limit',
    quantity: 1500,
    price: 8.0,
    amount: 12000000,
    status: 'cancelled',
    timestamp: '2025-01-20T14:15:00Z',
    filledQuantity: 0,
    filledPrice: 0,
    remainingQuantity: 1500
  },
  {
    id: 'BID-005',
    auctionId: 'AUC-2025-003',
    userId: 'USER-005',
    userName: 'Hoàng Văn E',
    type: 'market',
    quantity: 3000,
    price: 7.2,
    amount: 21600000,
    status: 'filled',
    timestamp: '2025-01-18T15:30:00Z',
    filledQuantity: 3000,
    filledPrice: 7.2,
    remainingQuantity: 0
  }
];

// Mock Allocation Results
export const mockAllocationResults: AllocationResult[] = [
  {
    id: 'ALLOC-001',
    auctionId: 'AUC-2025-003',
    userId: 'USER-005',
    userName: 'Hoàng Văn E',
    allocatedShares: 3000,
    allocatedPrice: 7.2,
    allocatedAmount: 21600000,
    allocationRatio: 1.0,
    refundAmount: 0,
    status: 'confirmed',
    timestamp: '2025-01-18T16:00:00Z'
  },
  {
    id: 'ALLOC-002',
    auctionId: 'AUC-2025-003',
    userId: 'USER-006',
    userName: 'Vũ Thị F',
    allocatedShares: 1500,
    allocatedPrice: 7.2,
    allocatedAmount: 10800000,
    allocationRatio: 0.75,
    refundAmount: 2700000,
    status: 'confirmed',
    timestamp: '2025-01-18T16:00:00Z'
  }
];

// Mock Documents
export const mockDocuments: AuctionDocument[] = [
  {
    id: 'DOC-001',
    auctionId: 'AUC-2025-001',
    type: 'prospectus',
    title: 'Bản cáo bạch - Gói Công nghệ Xanh VinTech',
    description: 'Tài liệu chi tiết về dự án, kế hoạch kinh doanh và dự báo tài chính',
    fileUrl: '/documents/vintech-prospectus.pdf',
    fileSize: 2048576, // 2MB
    uploadedAt: '2025-01-15T10:00:00Z',
    isRequired: true,
    downloadCount: 156
  },
  {
    id: 'DOC-002',
    auctionId: 'AUC-2025-001',
    type: 'financial_report',
    title: 'Báo cáo tài chính kiểm toán 2024',
    description: 'Báo cáo tài chính đã được kiểm toán bởi công ty kiểm toán độc lập',
    fileUrl: '/documents/vintech-financial-2024.pdf',
    fileSize: 1536000, // 1.5MB
    uploadedAt: '2025-01-15T11:00:00Z',
    isRequired: true,
    downloadCount: 134
  },
  {
    id: 'DOC-003',
    auctionId: 'AUC-2025-001',
    type: 'legal_opinion',
    title: 'Ý kiến pháp lý về dự án',
    description: 'Đánh giá pháp lý từ văn phòng luật sư về tính hợp pháp của dự án',
    fileUrl: '/documents/vintech-legal-opinion.pdf',
    fileSize: 512000, // 512KB
    uploadedAt: '2025-01-15T12:00:00Z',
    isRequired: false,
    downloadCount: 89
  }
];

// Mock Notifications
export const mockNotifications: AuctionNotification[] = [
  {
    id: 'NOTIF-001',
    userId: 'USER-001',
    auctionId: 'AUC-2025-001',
    type: 'bid_placed',
    title: 'Lệnh đặt thành công',
    message: 'Lệnh mua 1,000 cổ phần với giá 8.5₫/cổ phần đã được đặt thành công',
    isRead: false,
    timestamp: '2025-01-20T14:25:00Z',
    actionUrl: '/investor/auction/AUC-2025-001'
  },
  {
    id: 'NOTIF-002',
    userId: 'USER-001',
    auctionId: 'AUC-2025-001',
    type: 'price_alert',
    title: 'Cảnh báo giá',
    message: 'Giá hiện tại 8.5₫ đã đạt mức giá mong muốn của bạn',
    isRead: true,
    timestamp: '2025-01-20T14:20:00Z',
    actionUrl: '/investor/auction/AUC-2025-001'
  },
  {
    id: 'NOTIF-003',
    userId: 'USER-001',
    auctionId: 'AUC-2025-002',
    type: 'auction_starting',
    title: 'Vòng đấu giá sắp bắt đầu',
    message: 'Vòng đấu giá "Chuỗi Thực phẩm Organic FreshMart" sẽ bắt đầu trong 30 phút',
    isRead: false,
    timestamp: '2025-01-21T09:30:00Z',
    actionUrl: '/investor/auction/AUC-2025-002'
  },
  {
    id: 'NOTIF-004',
    userId: 'USER-005',
    auctionId: 'AUC-2025-003',
    type: 'allocation_confirmed',
    title: 'Phân bổ cổ phần đã xác nhận',
    message: 'Bạn đã được phân bổ 3,000 cổ phần với giá 7.2₫/cổ phần',
    isRead: false,
    timestamp: '2025-01-18T16:00:00Z',
    actionUrl: '/investor/portfolio'
  },
  {
    id: 'NOTIF-005',
    userId: 'USER-001',
    auctionId: 'AUC-2025-004',
    type: 'auction_paused',
    title: 'Vòng đấu giá tạm dừng',
    message: 'Vòng đấu giá "Hệ thống Y tế Thông minh HealthTech" đã tạm dừng do vấn đề kỹ thuật',
    isRead: false,
    timestamp: '2025-01-19T12:30:00Z',
    actionUrl: '/investor/auction/AUC-2025-004'
  }
];

// Mock User Portfolio Data
export const mockUserPortfolio = {
  userId: 'USER-001',
  totalInvested: 45000000, // 45 triệu VND
  totalShares: 5500,
  activeAuctions: 2,
  completedAuctions: 1,
  pendingBids: 1,
  walletBalance: 150000000, // 150 triệu VND
  availableBalance: 120000000, // 120 triệu VND
  heldBalance: 30000000 // 30 triệu VND
};

// Mock Real-time Price Data
export const mockPriceHistory = {
  'AUC-2025-001': [
    { timestamp: '2025-01-20T09:00:00Z', price: 12.0 },
    { timestamp: '2025-01-20T09:05:00Z', price: 11.9 },
    { timestamp: '2025-01-20T09:10:00Z', price: 11.8 },
    { timestamp: '2025-01-20T09:15:00Z', price: 11.7 },
    { timestamp: '2025-01-20T09:20:00Z', price: 11.6 },
    { timestamp: '2025-01-20T09:25:00Z', price: 11.5 },
    { timestamp: '2025-01-20T14:25:00Z', price: 8.5 }
  ]
};

// Helper functions
export const getAuctionById = (id: string): AuctionRound | undefined => {
  return mockAuctionRounds.find(auction => auction.id === id);
};

export const getBidsByAuctionId = (auctionId: string): BidOrder[] => {
  return mockBidOrders.filter(bid => bid.auctionId === auctionId);
};

export const getBidsByUserId = (userId: string): BidOrder[] => {
  return mockBidOrders.filter(bid => bid.userId === userId);
};

export const getDocumentsByAuctionId = (auctionId: string): AuctionDocument[] => {
  return mockDocuments.filter(doc => doc.auctionId === auctionId);
};

export const getNotificationsByUserId = (userId: string): AuctionNotification[] => {
  return mockNotifications.filter(notif => notif.userId === userId);
};

export const getActiveAuctions = (): AuctionRound[] => {
  return mockAuctionRounds.filter(auction => auction.status === 'active');
};

export const getUpcomingAuctions = (): AuctionRound[] => {
  return mockAuctionRounds.filter(auction => auction.status === 'upcoming');
};

export const getCompletedAuctions = (): AuctionRound[] => {
  return mockAuctionRounds.filter(auction => auction.status === 'completed');
};

// Helper function to convert detailed auction data to AuctionRound format
export const convertDetailedToAuctionRound = (detailedData: DetailedAuctionData): AuctionRound => {
  return {
    id: detailedData.round.round_id,
    businessName: detailedData.company.name,
    packageName: detailedData.opportunity.gid,
    sector: detailedData.company.sector,
    startPrice: detailedData.round.r_offer * 1000000, // Convert to VND
    currentPrice: (detailedData.round.r_offer - detailedData.round.delta_now) * 1000000,
    reservePrice: (detailedData.round.r_offer - detailedData.round.delta_max) * 1000000,
    priceDecrement: (detailedData.round.delta_max - detailedData.round.delta_floor) / 100,
    decrementInterval: 30, // seconds
    startTime: detailedData.round.start_at,
    endTime: detailedData.round.end_at,
    status: detailedData.round.status as 'upcoming' | 'active' | 'completed',
    totalBids: detailedData.my_bids.length,
    participantCount: Math.floor(detailedData.round.raised_vnd / detailedData.round.lot_vnd),
    targetAmount: detailedData.round.target_vnd,
    raisedAmount: detailedData.round.raised_vnd,
    coverageRatio: detailedData.round.cover,
    description: `Đấu giá quyền lợi ${detailedData.company.name} - ${detailedData.opportunity.gid}`,
    riskLevel: detailedData.company.gtrust > 80 ? 'low' : detailedData.company.gtrust > 60 ? 'medium' : 'high',
    minimumBid: detailedData.round.lot_vnd,
    documents: detailedData.round.docs.map(doc => ({
      id: doc.doc_hash,
      name: doc.title,
      type: doc.type as 'prospectus' | 'terms' | 'financial',
      url: `#${doc.doc_hash}`,
      size: '2.5 MB',
      uploadDate: detailedData.round.start_at
    }))
  };
};

// Add detailed auction rounds to existing mock data
export const detailedAuctionRounds: AuctionRound[] = [
  convertDetailedToAuctionRound(urbanFoodsAuctionData),
  convertDetailedToAuctionRound(techStartupAuctionData)
];

// Additional detailed auction data based on user requirements
const urbanFoodsDetailedData = {
  now_ict: "2025-09-15T12:55:00+07:00",
  company: { id: "UrbanFoods", name: "UrbanFoods", sector: "F&B", gtrust: 82 },
  opportunity: { gid: "UF-FOOD-3M", tenor_months: 3, r_base: 0.072 },
  round: {
    round_id: "UF-2025Q3-R2",
    start_at: "2025-09-15T10:00:00+07:00",
    end_at: "2025-09-15T13:00:00+07:00",
    target_vnd: 12000000000,
    raised_vnd: 8760000000,
    cover: 0.73,
    delta_max: 0.0040,
    delta_floor: 0.0010,
    delta_now: 0.0028,
    r_offer: 0.0748,
    lot_vnd: 100000,
    cap_pct: 0.20,
    status: "open",
    docs: [
      { type: "terms", title: "Điều khoản vòng UF R2", doc_hash: "5a0f…d4a1" }
    ]
  },
  my_precheck: { kyc: "verified", twofa: "on", primary_bank: "ok", balance_ok: true },
  my_bids: [
    { bid_id: "BID-UF-MKT-001", type: "market", amount_vnd: 2000000, hold_tx_id: "HOLD-88A1", state: "active", r_offer_at_place: 0.0748, receipt_hash: "c0de…91aa" },
    { bid_id: "BID-UF-LMT-002", type: "limit", amount_vnd: 3000000, delta_g_min: 0.0025, state: "triggered_hold", hold_tx_id: "HOLD-88B2", receipt_hash: "ab77…21ef" }
  ],
  clear: {
    cleared_at: "2025-09-15T13:00:06+07:00",
    delta_g_clear: 0.0026,
    r_clear: 0.0746,
    pro_rata: 0.95,
    allocation_doc_hash: "e3aa…9b10"
  },
  allocations: [
    { bid_id: "BID-UF-MKT-001", requested_vnd: 2000000, filled_vnd: 1900000, refund_vnd: 100000, cqid: "CQ-UF-22791", cert_hash: "9c1d…77e3", receipt_hash: "4b5a…1cc9" },
    { bid_id: "BID-UF-LMT-002", requested_vnd: 3000000, filled_vnd: 2850000, refund_vnd: 150000, cqid: "CQ-UF-22792", cert_hash: "81de…a4b1", receipt_hash: "6d2f…aa08" }
  ],
  wallet_tx: [
    { t: "2025-09-15T12:40:27+07:00", type: "hold", ref: "HOLD-88A1", gid: "UF-FOOD-3M", amount_vnd: 2000000, state: "success", proof_hash: "c0de…91aa" },
    { t: "2025-09-15T12:44:10+07:00", type: "hold", ref: "HOLD-88B2", gid: "UF-FOOD-3M", amount_vnd: 3000000, state: "success", proof_hash: "ab77…21ef" },
    { t: "2025-09-15T13:00:06+07:00", type: "allocate_cqid", ref: "CQ-UF-22791", gid: "UF-FOOD-3M", amount_vnd: 1900000, state: "success", proof_hash: "4b5a…1cc9" },
    { t: "2025-09-15T13:00:07+07:00", type: "allocate_cqid", ref: "CQ-UF-22792", gid: "UF-FOOD-3M", amount_vnd: 2850000, state: "success", proof_hash: "6d2f…aa08" },
    { t: "2025-09-15T13:00:08+07:00", type: "release_hold", ref: "HOLD-REFUND-UF-R2", gid: "UF-FOOD-3M", amount_vnd: 250000, state: "success", proof_hash: "beef…cafe" }
  ],
  documents: [
    { type: "terms", doc_id: "UF-R2-TERMS", doc_hash: "5a0f…d4a1" },
    { type: "allocation", doc_id: "UF-R2-ALLOCATION", doc_hash: "e3aa…9b10" },
    { type: "certificate", cqid: "CQ-UF-22791", doc_hash: "9c1d…77e3" },
    { type: "certificate", cqid: "CQ-UF-22792", doc_hash: "81de…a4b1" }
  ],
  events: [
    { type: "AUCTION_TICK", round_id: "UF-2025Q3-R2", delta_now: 0.0028, cover: 0.73, chain_tx_hash: "0x7e…91d" },
    { type: "AUCTION_BID_PLACED", bid_id: "BID-UF-MKT-001", proof_hash: "c0de…91aa" },
    { type: "AUCTION_BID_PLACED", bid_id: "BID-UF-LMT-002", proof_hash: "ab77…21ef" },
    { type: "AUCTION_CLEARED", round_id: "UF-2025Q3-R2", r_clear: 0.0746, allocation_doc_hash: "e3aa…9b10" },
    { type: "CERTIFICATE_ALLOCATED", cqid: "CQ-UF-22791", cert_hash: "9c1d…77e3" }
  ]
};

// Enhanced mock auction rounds combining original and detailed data
export const enhancedMockAuctionRounds: AuctionRound[] = [
  ...mockAuctionRounds,
  ...[urbanFoodsAuctionData, techStartupAuctionData].map(convertDetailedToAuctionRound),
  // Add UrbanFoods round from detailed data
  {
    id: urbanFoodsDetailedData.round.round_id,
    businessName: urbanFoodsDetailedData.company.name,
    packageName: urbanFoodsDetailedData.opportunity.gid,
    sector: urbanFoodsDetailedData.company.sector,
    targetAmount: urbanFoodsDetailedData.round.target_vnd,
    currentAmount: urbanFoodsDetailedData.round.raised_vnd,
    interestRate: urbanFoodsDetailedData.round.r_offer,
    duration: urbanFoodsDetailedData.opportunity.tenor_months,
    minInvestment: urbanFoodsDetailedData.round.lot_vnd,
    maxInvestment: urbanFoodsDetailedData.round.target_vnd * urbanFoodsDetailedData.round.cap_pct,
    startTime: urbanFoodsDetailedData.round.start_at,
    endTime: urbanFoodsDetailedData.round.end_at,
    status: urbanFoodsDetailedData.round.status as 'active' | 'upcoming' | 'completed',
    riskLevel: 'medium' as const,
    description: `Cơ hội đầu tư vào ${urbanFoodsDetailedData.company.name} - ${urbanFoodsDetailedData.company.sector}`,
    documents: urbanFoodsDetailedData.round.docs.map(doc => ({
      name: doc.title,
      url: `#${doc.doc_hash}`,
      type: doc.type as 'prospectus' | 'financial' | 'legal'
    }))
  }
];

// Helper function to get detailed auction data by round ID
export const getDetailedAuctionByRoundIdLocal = (roundId: string): DetailedAuctionData | null => {
  // Check existing detailed auction data
  const existingData = [urbanFoodsAuctionData, techStartupAuctionData].find(data => data.round.round_id === roundId);
  if (existingData) return existingData;
  
  // Check UrbanFoods detailed data
  if (roundId === urbanFoodsDetailedData.round.round_id) {
    // Convert urbanFoodsDetailedData to DetailedAuctionData format
    return {
      round: {
        round_id: urbanFoodsDetailedData.round.round_id,
        start_at: urbanFoodsDetailedData.round.start_at,
        end_at: urbanFoodsDetailedData.round.end_at,
        target_vnd: urbanFoodsDetailedData.round.target_vnd,
        raised_vnd: urbanFoodsDetailedData.round.raised_vnd,
        cover: urbanFoodsDetailedData.round.cover,
        delta_max: urbanFoodsDetailedData.round.delta_max,
        delta_floor: urbanFoodsDetailedData.round.delta_floor,
        delta_now: urbanFoodsDetailedData.round.delta_now,
        r_offer: urbanFoodsDetailedData.round.r_offer,
        lot_vnd: urbanFoodsDetailedData.round.lot_vnd,
        cap_pct: urbanFoodsDetailedData.round.cap_pct,
        status: urbanFoodsDetailedData.round.status,
        docs: urbanFoodsDetailedData.round.docs
      },
      company: urbanFoodsDetailedData.company,
      opportunity: urbanFoodsDetailedData.opportunity,
      my_precheck: urbanFoodsDetailedData.my_precheck,
      my_bids: urbanFoodsDetailedData.my_bids,
      clear: urbanFoodsDetailedData.clear,
      allocations: urbanFoodsDetailedData.allocations,
      wallet_tx: urbanFoodsDetailedData.wallet_tx,
      documents: urbanFoodsDetailedData.documents,
      events: urbanFoodsDetailedData.events
    };
  }
  
  return null;
};

// Helper function to get all detailed auction data
const getAllDetailedAuctionDataLocal = (): DetailedAuctionData[] => {
  return [urbanFoodsAuctionData, techStartupAuctionData];
};

// Export all mock data and helper functions
export {
  // Detailed auction data exports
  urbanFoodsAuctionData,
  techStartupAuctionData,
  formatVND,
  formatPercentage,
  calculateTimeRemaining
};