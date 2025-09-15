// Detailed Auction Mock Data based on provided JSON structure

interface DetailedAuctionData {
  now_ict: string;
  company: {
    id: string;
    name: string;
    sector: string;
    gtrust: number;
  };
  opportunity: {
    gid: string;
    tenor_months: number;
    r_base: number;
  };
  round: {
    round_id: string;
    start_at: string;
    end_at: string;
    target_vnd: number;
    raised_vnd: number;
    cover: number;
    delta_max: number;
    delta_floor: number;
    delta_now: number;
    r_offer: number;
    lot_vnd: number;
    cap_pct: number;
    status: string;
    docs: Array<{
      type: string;
      title: string;
      doc_hash: string;
    }>;
  };
  my_precheck: {
    kyc: string;
    twofa: string;
    primary_bank: string;
    balance_ok: boolean;
  };
  my_bids: Array<{
    bid_id: string;
    type: string;
    amount_vnd: number;
    hold_tx_id?: string;
    state: string;
    r_offer_at_place?: number;
    delta_g_min?: number;
    receipt_hash: string;
  }>;
  clear: {
    cleared_at: string;
    delta_g_clear: number;
    r_clear: number;
    pro_rata: number;
    allocation_doc_hash: string;
  };
  allocations: Array<{
    bid_id: string;
    requested_vnd: number;
    filled_vnd: number;
    refund_vnd: number;
    cqid: string;
    cert_hash: string;
    receipt_hash: string;
  }>;
  wallet_tx: Array<{
    t: string;
    type: string;
    ref: string;
    gid: string;
    amount_vnd: number;
    state: string;
    proof_hash: string;
  }>;
  documents: Array<{
    type: string;
    doc_id?: string;
    cqid?: string;
    doc_hash: string;
  }>;
  events: Array<{
    type: string;
    round_id?: string;
    bid_id?: string;
    cqid?: string;
    delta_now?: number;
    cover?: number;
    r_clear?: number;
    chain_tx_hash?: string;
    proof_hash?: string;
    allocation_doc_hash?: string;
    cert_hash?: string;
  }>;
}

// Mock data for UrbanFoods auction
export const urbanFoodsAuctionData: DetailedAuctionData = {
  now_ict: "2025-09-15T12:55:00+07:00",
  company: {
    id: "UrbanFoods",
    name: "UrbanFoods",
    sector: "F&B",
    gtrust: 82
  },
  opportunity: {
    gid: "UF-FOOD-3M",
    tenor_months: 3,
    r_base: 0.072
  },
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
      {
        type: "terms",
        title: "Điều khoản vòng UF R2",
        doc_hash: "5a0f…d4a1"
      }
    ]
  },
  my_precheck: {
    kyc: "verified",
    twofa: "on",
    primary_bank: "ok",
    balance_ok: true
  },
  my_bids: [
    {
      bid_id: "BID-UF-MKT-001",
      type: "market",
      amount_vnd: 2000000,
      hold_tx_id: "HOLD-88A1",
      state: "active",
      r_offer_at_place: 0.0748,
      receipt_hash: "c0de…91aa"
    },
    {
      bid_id: "BID-UF-LMT-002",
      type: "limit",
      amount_vnd: 3000000,
      delta_g_min: 0.0025,
      state: "triggered_hold",
      hold_tx_id: "HOLD-88B2",
      receipt_hash: "ab77…21ef"
    }
  ],
  clear: {
    cleared_at: "2025-09-15T13:00:06+07:00",
    delta_g_clear: 0.0026,
    r_clear: 0.0746,
    pro_rata: 0.95,
    allocation_doc_hash: "e3aa…9b10"
  },
  allocations: [
    {
      bid_id: "BID-UF-MKT-001",
      requested_vnd: 2000000,
      filled_vnd: 1900000,
      refund_vnd: 100000,
      cqid: "CQ-UF-22791",
      cert_hash: "9c1d…77e3",
      receipt_hash: "4b5a…1cc9"
    },
    {
      bid_id: "BID-UF-LMT-002",
      requested_vnd: 3000000,
      filled_vnd: 2850000,
      refund_vnd: 150000,
      cqid: "CQ-UF-22792",
      cert_hash: "81de…a4b1",
      receipt_hash: "6d2f…aa08"
    }
  ],
  wallet_tx: [
    {
      t: "2025-09-15T12:40:27+07:00",
      type: "hold",
      ref: "HOLD-88A1",
      gid: "UF-FOOD-3M",
      amount_vnd: 2000000,
      state: "success",
      proof_hash: "c0de…91aa"
    },
    {
      t: "2025-09-15T12:44:10+07:00",
      type: "hold",
      ref: "HOLD-88B2",
      gid: "UF-FOOD-3M",
      amount_vnd: 3000000,
      state: "success",
      proof_hash: "ab77…21ef"
    },
    {
      t: "2025-09-15T13:00:06+07:00",
      type: "allocate_cqid",
      ref: "CQ-UF-22791",
      gid: "UF-FOOD-3M",
      amount_vnd: 1900000,
      state: "success",
      proof_hash: "4b5a…1cc9"
    },
    {
      t: "2025-09-15T13:00:07+07:00",
      type: "allocate_cqid",
      ref: "CQ-UF-22792",
      gid: "UF-FOOD-3M",
      amount_vnd: 2850000,
      state: "success",
      proof_hash: "6d2f…aa08"
    },
    {
      t: "2025-09-15T13:00:08+07:00",
      type: "release_hold",
      ref: "HOLD-REFUND-UF-R2",
      gid: "UF-FOOD-3M",
      amount_vnd: 250000,
      state: "success",
      proof_hash: "beef…cafe"
    }
  ],
  documents: [
    {
      type: "terms",
      doc_id: "UF-R2-TERMS",
      doc_hash: "5a0f…d4a1"
    },
    {
      type: "allocation",
      doc_id: "UF-R2-ALLOCATION",
      doc_hash: "e3aa…9b10"
    },
    {
      type: "certificate",
      cqid: "CQ-UF-22791",
      doc_hash: "9c1d…77e3"
    },
    {
      type: "certificate",
      cqid: "CQ-UF-22792",
      doc_hash: "81de…a4b1"
    }
  ],
  events: [
    {
      type: "AUCTION_TICK",
      round_id: "UF-2025Q3-R2",
      delta_now: 0.0028,
      cover: 0.73,
      chain_tx_hash: "0x7e…91d"
    },
    {
      type: "AUCTION_BID_PLACED",
      bid_id: "BID-UF-MKT-001",
      proof_hash: "c0de…91aa"
    },
    {
      type: "AUCTION_BID_PLACED",
      bid_id: "BID-UF-LMT-002",
      proof_hash: "ab77…21ef"
    },
    {
      type: "AUCTION_CLEARED",
      round_id: "UF-2025Q3-R2",
      r_clear: 0.0746,
      allocation_doc_hash: "e3aa…9b10"
    },
    {
      type: "CERTIFICATE_ALLOCATED",
      cqid: "CQ-UF-22791",
      cert_hash: "9c1d…77e3"
    }
  ]
};

// Additional mock data for different companies and scenarios
export const techStartupAuctionData: DetailedAuctionData = {
  now_ict: "2025-09-16T14:30:00+07:00",
  company: {
    id: "TechVenture",
    name: "TechVenture Solutions",
    sector: "Technology",
    gtrust: 78
  },
  opportunity: {
    gid: "TV-TECH-6M",
    tenor_months: 6,
    r_base: 0.085
  },
  round: {
    round_id: "TV-2025Q3-R1",
    start_at: "2025-09-16T09:00:00+07:00",
    end_at: "2025-09-16T15:00:00+07:00",
    target_vnd: 8000000000,
    raised_vnd: 5200000000,
    cover: 0.65,
    delta_max: 0.0050,
    delta_floor: 0.0015,
    delta_now: 0.0032,
    r_offer: 0.0818,
    lot_vnd: 50000,
    cap_pct: 0.25,
    status: "active",
    docs: [
      {
        type: "terms",
        title: "Điều khoản vòng TV R1",
        doc_hash: "7b1e…f5c2"
      }
    ]
  },
  my_precheck: {
    kyc: "verified",
    twofa: "on",
    primary_bank: "ok",
    balance_ok: true
  },
  my_bids: [
    {
      bid_id: "BID-TV-MKT-003",
      type: "market",
      amount_vnd: 1500000,
      hold_tx_id: "HOLD-99C3",
      state: "active",
      r_offer_at_place: 0.0818,
      receipt_hash: "d1ef…82bb"
    }
  ],
  clear: {
    cleared_at: "2025-09-16T15:00:05+07:00",
    delta_g_clear: 0.0030,
    r_clear: 0.0815,
    pro_rata: 0.88,
    allocation_doc_hash: "f4bb…8c21"
  },
  allocations: [
    {
      bid_id: "BID-TV-MKT-003",
      requested_vnd: 1500000,
      filled_vnd: 1320000,
      refund_vnd: 180000,
      cqid: "CQ-TV-33801",
      cert_hash: "8e2f…66d4",
      receipt_hash: "5c6b…2dd0"
    }
  ],
  wallet_tx: [
    {
      t: "2025-09-16T13:15:42+07:00",
      type: "hold",
      ref: "HOLD-99C3",
      gid: "TV-TECH-6M",
      amount_vnd: 1500000,
      state: "success",
      proof_hash: "d1ef…82bb"
    },
    {
      t: "2025-09-16T15:00:05+07:00",
      type: "allocate_cqid",
      ref: "CQ-TV-33801",
      gid: "TV-TECH-6M",
      amount_vnd: 1320000,
      state: "success",
      proof_hash: "5c6b…2dd0"
    },
    {
      t: "2025-09-16T15:00:06+07:00",
      type: "release_hold",
      ref: "HOLD-REFUND-TV-R1",
      gid: "TV-TECH-6M",
      amount_vnd: 180000,
      state: "success",
      proof_hash: "cafe…beef"
    }
  ],
  documents: [
    {
      type: "terms",
      doc_id: "TV-R1-TERMS",
      doc_hash: "7b1e…f5c2"
    },
    {
      type: "allocation",
      doc_id: "TV-R1-ALLOCATION",
      doc_hash: "f4bb…8c21"
    },
    {
      type: "certificate",
      cqid: "CQ-TV-33801",
      doc_hash: "8e2f…66d4"
    }
  ],
  events: [
    {
      type: "AUCTION_TICK",
      round_id: "TV-2025Q3-R1",
      delta_now: 0.0032,
      cover: 0.65,
      chain_tx_hash: "0x9f…82e"
    },
    {
      type: "AUCTION_BID_PLACED",
      bid_id: "BID-TV-MKT-003",
      proof_hash: "d1ef…82bb"
    },
    {
      type: "AUCTION_CLEARED",
      round_id: "TV-2025Q3-R1",
      r_clear: 0.0815,
      allocation_doc_hash: "f4bb…8c21"
    },
    {
      type: "CERTIFICATE_ALLOCATED",
      cqid: "CQ-TV-33801",
      cert_hash: "8e2f…66d4"
    }
  ]
};

// Helper functions to get mock data
export const getDetailedAuctionData = (companyId: string): DetailedAuctionData | null => {
  switch (companyId) {
    case 'UrbanFoods':
      return urbanFoodsAuctionData;
    case 'TechVenture':
      return techStartupAuctionData;
    default:
      return null;
  }
};

export const getAllDetailedAuctionData = (): DetailedAuctionData[] => {
  return [urbanFoodsAuctionData, techStartupAuctionData];
};

// Format currency helper
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format percentage helper
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Calculate time remaining helper
export const calculateTimeRemaining = (endTime: string): string => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Đã kết thúc';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export type { DetailedAuctionData };