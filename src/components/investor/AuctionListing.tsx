import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, TrendingUp, Building2, Star, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { AuctionRound, AuctionFilters, AUCTION_STATUS_LABELS } from '../../types/auction';
import { auctionService } from '../../services/auctionService';
import { enhancedMockAuctionRounds } from '../../data/auctionMockData';

interface AuctionListingProps {
  onSelectRound: (round: AuctionRound) => void;
}

const AuctionListing: React.FC<AuctionListingProps> = ({ onSelectRound }) => {
  const [rounds, setRounds] = useState<AuctionRound[]>(enhancedMockAuctionRounds);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AuctionFilters>({
    sortBy: 'endAt',
    sortOrder: 'asc'
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [filters, searchTerm]);

  const loadRounds = async (reset = false) => {
    try {
      setLoading(true);
      // Use mock data instead of API call
      const filteredRounds = enhancedMockAuctionRounds.filter(round => {
         if (searchTerm && !round.businessName.toLowerCase().includes(searchTerm.toLowerCase()) && 
             !round.packageName.toLowerCase().includes(searchTerm.toLowerCase())) {
           return false;
         }
         if (filters.status && !filters.status.includes(round.status)) {
           return false;
         }
         return true;
       });
      
      setRounds(filteredRounds);
      setHasMore(false);
    } catch (error) {
      console.error('Failed to load auction rounds:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadRounds(false);
    }
  };

  const updateFilters = (newFilters: Partial<AuctionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'clearing': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatRate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  const TimeRemaining: React.FC<{ endAt: string }> = ({ endAt }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      const updateTime = () => {
        const remaining = auctionService.calculateTimeRemaining(endAt);
        setTimeLeft(auctionService.formatTimeRemaining(remaining));
      };

      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }, [endAt]);

    return (
      <div className="flex items-center gap-1 text-sm text-orange-600">
        <Clock className="w-4 h-4" />
        <span>{timeLeft}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Đấu giá quyền lợi phân phối</h2>
          <p className="text-gray-600 mt-1">Tham gia đấu giá để nhận quyền lợi phân phối từ các dự án</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên công ty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Lọc
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => updateFilters({ status: ['open'] })}>
                Chỉ vòng đang mở
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateFilters({ sortBy: 'gTrust', sortOrder: 'desc' })}>
                G-Trust cao nhất
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateFilters({ sortBy: 'rOffer', sortOrder: 'desc' })}>
                R_offer cao nhất
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateFilters({ sortBy: 'endAt', sortOrder: 'asc' })}>
                Sắp kết thúc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ sortBy: 'endAt', sortOrder: 'asc' })}>
                Xóa bộ lọc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Auction Rounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rounds.map((round) => (
          <Card 
            key={round.roundId} 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500"
            onClick={() => onSelectRound(round)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                    {round.company}
                  </CardTitle>
                </div>
                <Badge className={getStatusColor(round.status)}>
                  {AUCTION_STATUS_LABELS[round.status]}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Vòng {round.roundIndex}/{round.roundCount}</span>
                <span>•</span>
                <span>{round.termMonths} tháng</span>
                {round.gTrust && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{round.gTrust.toFixed(1)}</span>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress & Amount */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiến độ lấp đầy</span>
                  <span className="font-medium">{(round.cover * 100).toFixed(1)}%</span>
                </div>
                <Progress value={round.cover * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(round.raised)}</span>
                  <span>{formatCurrency(round.targetAmount)}</span>
                </div>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">R_offer hiện tại</div>
                  <div className="font-semibold text-blue-600">{formatRate(round.rOffer)}</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">ΔG hiện tại</div>
                  <div className="font-semibold text-green-600">{formatRate(round.deltaNow)}</div>
                </div>
              </div>

              {/* Time & Action */}
              <div className="flex items-center justify-between pt-2 border-t">
                {round.status === 'open' ? (
                  <TimeRemaining endAt={round.endAt} />
                ) : (
                  <div className="text-sm text-gray-500">
                    {round.status === 'pending' ? 'Chưa bắt đầu' : 'Đã kết thúc'}
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant={round.status === 'open' ? 'default' : 'outline'}
                  className="text-xs px-3 py-1"
                >
                  {round.status === 'open' ? 'Đặt lệnh' : 'Xem chi tiết'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading & Load More */}
      {loading && rounds.length === 0 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {hasMore && !loading && rounds.length > 0 && (
        <div className="flex justify-center py-6">
          <Button onClick={loadMore} variant="outline">
            Tải thêm
          </Button>
        </div>
      )}

      {!hasMore && rounds.length > 0 && (
        <div className="text-center py-6 text-gray-500">
          Đã hiển thị tất cả vòng đấu giá
        </div>
      )}

      {!loading && rounds.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có vòng đấu giá nào</h3>
          <p className="text-gray-500">Hiện tại không có vòng đấu giá nào phù hợp với bộ lọc của bạn.</p>
        </div>
      )}
    </div>
  );
};

export default AuctionListing;