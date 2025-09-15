// Auction service for API calls and business logic
import { 
  AuctionRound, 
  AuctionListResponse, 
  BidRequest, 
  BidResponse, 
  BidOrder, 
  AllocationResult,
  AuctionFilters,
  AuctionStats,
  UserBidSummary,
  RealtimeUpdate,
  AuctionNotification
} from '../types/auction';

class AuctionService {
  private baseUrl = '/api/auction';
  private wsConnection: WebSocket | null = null;
  private wsCallbacks: Map<string, (data: any) => void> = new Map();

  // Auction rounds management
  async getAuctionRounds(filters?: AuctionFilters, page = 1, limit = 20): Promise<AuctionListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...this.serializeFilters(filters)
    });

    const response = await fetch(`${this.baseUrl}/rounds?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch auction rounds: ${response.statusText}`);
    }
    return response.json();
  }

  async getAuctionRound(roundId: string): Promise<AuctionRound> {
    const response = await fetch(`${this.baseUrl}/rounds/${roundId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch auction round: ${response.statusText}`);
    }
    return response.json();
  }

  async getAuctionStats(): Promise<AuctionStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch auction stats: ${response.statusText}`);
    }
    return response.json();
  }

  // Bidding operations
  async placeBid(bidRequest: BidRequest): Promise<BidResponse> {
    const response = await fetch(`${this.baseUrl}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(bidRequest)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to place bid');
    }
    return result;
  }

  async getUserBids(roundId?: string): Promise<BidOrder[]> {
    const url = roundId 
      ? `${this.baseUrl}/bids?roundId=${roundId}`
      : `${this.baseUrl}/bids`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user bids: ${response.statusText}`);
    }
    return response.json();
  }

  async getUserBidSummary(): Promise<UserBidSummary> {
    const response = await fetch(`${this.baseUrl}/bids/summary`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch bid summary: ${response.statusText}`);
    }
    return response.json();
  }

  async cancelBid(bidId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/bids/${bidId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to cancel bid');
    }
    return result;
  }

  // Document operations
  async downloadDocument(docHash: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/documents/${docHash}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.statusText}`);
    }
    return response.blob();
  }

  async verifyDocumentHash(docHash: string): Promise<{ valid: boolean; chainTxHash?: string }> {
    const response = await fetch(`${this.baseUrl}/documents/${docHash}/verify`);
    if (!response.ok) {
      throw new Error(`Failed to verify document: ${response.statusText}`);
    }
    return response.json();
  }

  // Notifications
  async getNotifications(page = 1, limit = 20): Promise<{ notifications: AuctionNotification[]; hasMore: boolean }> {
    const response = await fetch(`${this.baseUrl}/notifications?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }
    return response.json();
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.statusText}`);
    }
  }

  // WebSocket for real-time updates
  connectWebSocket(callbacks: {
    onAuctionUpdate?: (data: RealtimeUpdate) => void;
    onBidUpdate?: (data: BidOrder) => void;
    onNotification?: (data: AuctionNotification) => void;
    onError?: (error: Event) => void;
    onClose?: (event: CloseEvent) => void;
  }): void {
    const wsUrl = `ws://localhost:8080/ws/auction?token=${this.getAuthToken()}`;
    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case 'auction_update':
            callbacks.onAuctionUpdate?.(message.data);
            break;
          case 'bid_update':
            callbacks.onBidUpdate?.(message.data);
            break;
          case 'notification':
            callbacks.onNotification?.(message.data);
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.wsConnection.onerror = callbacks.onError || ((error) => {
      console.error('WebSocket error:', error);
    });

    this.wsConnection.onclose = callbacks.onClose || ((event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      // Auto-reconnect after 5 seconds
      setTimeout(() => this.connectWebSocket(callbacks), 5000);
    });
  }

  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  // Utility methods
  private serializeFilters(filters?: AuctionFilters): Record<string, string> {
    if (!filters) return {};
    
    const params: Record<string, string> = {};
    
    if (filters.status?.length) {
      params.status = filters.status.join(',');
    }
    if (filters.gTrustMin !== undefined) {
      params.gTrustMin = filters.gTrustMin.toString();
    }
    if (filters.termMonths?.length) {
      params.termMonths = filters.termMonths.join(',');
    }
    if (filters.company) {
      params.company = filters.company;
    }
    if (filters.sortBy) {
      params.sortBy = filters.sortBy;
    }
    if (filters.sortOrder) {
      params.sortOrder = filters.sortOrder;
    }
    
    return params;
  }

  private getAuthToken(): string {
    // Get token from localStorage or context
    return localStorage.getItem('authToken') || '';
  }

  // Business logic helpers
  calculateTimeRemaining(endAt: string): number {
    const endTime = new Date(endAt).getTime();
    const now = Date.now();
    return Math.max(0, endTime - now);
  }

  formatTimeRemaining(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }

  calculateCurrentDelta(round: AuctionRound): number {
    const timeProgress = this.getTimeProgress(round.startAt, round.endAt);
    const coverProgress = round.cover;
    
    // ΔG = ΔG_max × (1 - a × t_progress) × (1 - b × cover_progress)
    return round.deltaMax * (1 - round.a * timeProgress) * (1 - round.b * coverProgress);
  }

  private getTimeProgress(startAt: string, endAt: string): number {
    const start = new Date(startAt).getTime();
    const end = new Date(endAt).getTime();
    const now = Date.now();
    
    if (now <= start) return 0;
    if (now >= end) return 1;
    
    return (now - start) / (end - start);
  }

  generateIdempotencyKey(userId: string, roundId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${userId}-${roundId}-${timestamp}-${random}`;
  }

  validateBidAmount(amount: number, round: AuctionRound, userBalance: number): string | null {
    if (amount <= 0) {
      return 'Số tiền đặt lệnh phải lớn hơn 0';
    }
    
    if (amount > userBalance) {
      return 'Số dư không đủ để đặt lệnh';
    }
    
    const minBidAmount = 1000000; // 1M VND
    if (amount < minBidAmount) {
      return `Số tiền đặt lệnh tối thiểu là ${minBidAmount.toLocaleString('vi-VN')} VND`;
    }
    
    const remainingAmount = round.targetAmount - round.raised;
    if (amount > remainingAmount) {
      return `Số tiền vượt quá số tiền còn lại của vòng (${remainingAmount.toLocaleString('vi-VN')} VND)`;
    }
    
    return null;
  }
}

export const auctionService = new AuctionService();
export default auctionService;