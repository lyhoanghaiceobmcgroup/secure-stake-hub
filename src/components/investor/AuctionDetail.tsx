import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  FileText, 
  Shield, 
  AlertCircle, 
  Download,
  ExternalLink,
  Star,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { AuctionRound, BidOrder, RealtimeUpdate } from '../../types/auction';
import { auctionService } from '../../services/auctionService';
import BidForm from './BidForm';
import { getBidsByAuctionId, getDocumentsByAuctionId, mockPriceHistory } from '../../data/auctionMockData';

interface AuctionDetailProps {
  round: AuctionRound;
  onBack: () => void;
  onBidPlaced: (bid: BidOrder) => void;
}

const AuctionDetail: React.FC<AuctionDetailProps> = ({ round: initialRound, onBack, onBidPlaced }) => {
  const [round, setRound] = useState<AuctionRound>(initialRound);
  const [userBids, setUserBids] = useState<BidOrder[]>(getBidsByAuctionId(initialRound.id).filter(bid => bid.userId === 'USER-001'));
  const [loading, setLoading] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [chartData, setChartData] = useState<{ time: string; deltaG: number; cover: number }[]>([]);
  const [documents] = useState(getDocumentsByAuctionId(initialRound.id));
  const [priceHistory] = useState(mockPriceHistory[initialRound.id] || []);

  useEffect(() => {
    loadUserBids();
    setupRealtimeUpdates();
    
    // Simulate real-time updates for mock data
     const interval = setInterval(() => {
       if (round.status === 'open') {
         setRound(prev => ({
           ...prev,
           currentPrice: Math.max(prev.currentPrice - prev.priceDecrement, prev.reservePrice),
           totalBids: prev.totalBids + Math.floor(Math.random() * 3),
           participantCount: prev.participantCount + Math.floor(Math.random() * 2)
         }));
       }
     }, 5000);
     
     return () => {
       auctionService.disconnectWebSocket();
       clearInterval(interval);
     };
   }, [round.id, round.status]);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = auctionService.calculateTimeRemaining(round.endAt);
      setTimeRemaining(auctionService.formatTimeRemaining(remaining));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [round.endAt]);

  const loadUserBids = async () => {
    try {
      // Use mock data instead of API call
       const bids = getBidsByAuctionId(round.id).filter(bid => bid.userId === 'USER-001');
      setUserBids(bids);
    } catch (error) {
      console.error('Failed to load user bids:', error);
    }
  };

  const setupRealtimeUpdates = () => {
    auctionService.connectWebSocket({
      onAuctionUpdate: (update: RealtimeUpdate) => {
        if (update.roundId === round.roundId) {
          setRound(prev => ({
            ...prev,
            deltaNow: update.deltaNow,
            rOffer: update.rOffer,
            cover: update.cover,
            raised: update.raised
          }));
          
          // Add to chart data
          setChartData(prev => [
            ...prev.slice(-19), // Keep last 20 points
            {
              time: new Date().toLocaleTimeString(),
              deltaG: update.deltaNow,
              cover: update.cover
            }
          ]);
        }
      },
      onBidUpdate: (bid: BidOrder) => {
        if (bid.roundId === round.roundId) {
          setUserBids(prev => {
            const existing = prev.find(b => b.bidId === bid.bidId);
            if (existing) {
              return prev.map(b => b.bidId === bid.bidId ? bid : b);
            }
            return [...prev, bid];
          });
        }
      }
    });
  };

  const handleBidSuccess = (bid: BidOrder) => {
    setUserBids(prev => [...prev, bid]);
    setShowBidForm(false);
    onBidPlaced(bid);
  };

  const downloadDocument = async (docHash: string, title: string) => {
    try {
      setLoading(true);
      const blob = await auctionService.downloadDocument(docHash);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}-${round.company}-${round.roundId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download document:', error);
    } finally {
      setLoading(false);
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
    return `${(rate * 100).toFixed(3)}%`;
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

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'filled': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">{round.company}</h1>
            <Badge className={getStatusColor(round.status)}>
              {round.status === 'open' ? 'Đang mở' : 
               round.status === 'pending' ? 'Sắp mở' :
               round.status === 'clearing' ? 'Đang chốt' : 'Đã đóng'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Vòng {round.roundIndex}/{round.roundCount}</span>
            <span>•</span>
            <span>Kỳ hạn {round.termMonths} tháng</span>
            {round.gTrust && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>G-Trust: {round.gTrust.toFixed(1)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {round.status === 'open' && (
          <Button onClick={() => setShowBidForm(true)} className="bg-blue-600 hover:bg-blue-700">
            Đặt lệnh
          </Button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">R_offer hiện tại</p>
                <p className="text-2xl font-bold text-blue-600">{formatRate(round.rOffer)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ΔG hiện tại</p>
                <p className="text-2xl font-bold text-green-600">{formatRate(round.deltaNow)}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">Δ</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lấp đầy</p>
                <p className="text-2xl font-bold text-purple-600">{(round.cover * 100).toFixed(1)}%</p>
              </div>
              <div className="w-8 h-8">
                <Progress value={round.cover * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thời gian còn lại</p>
                <p className="text-lg font-bold text-orange-600">{timeRemaining}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="mybids">Lệnh của tôi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Details */}
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết tiến độ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Đã huy động</span>
                    <span className="font-medium">{formatCurrency(round.raised)}</span>
                  </div>
                  <Progress value={round.cover * 100} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{formatCurrency(round.targetAmount)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Tỷ suất cơ bản</p>
                    <p className="font-semibold">{formatRate(round.baseRate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ΔG tối đa</p>
                    <p className="font-semibold">{formatRate(round.deltaMax)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ΔG tối thiểu</p>
                    <p className="font-semibold">{formatRate(round.deltaFloor)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Còn lại</p>
                    <p className="font-semibold">{formatCurrency(round.targetAmount - round.raised)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk & Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin quan trọng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế. 
                    GoldenBook không cam kết lợi nhuận cố định.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Tài liệu được bảo mật bằng blockchain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Biên nhận PDF cho mọi giao dịch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Cập nhật realtime mỗi giây</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ ΔG & Cover theo thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-64 flex items-center justify-center border rounded">
                  <p className="text-gray-500">Biểu đồ realtime sẽ được hiển thị ở đây</p>
                  {/* TODO: Implement chart component */}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border rounded">
                  <p className="text-gray-500">Chưa có dữ liệu biểu đồ</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu vòng đấu giá</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-gray-500">Hash: {doc.docHash}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadDocument(doc.docHash, doc.title)}
                        disabled={loading}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Tải về
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Xác minh
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mybids">
          <Card>
            <CardHeader>
              <CardTitle>Lệnh đặt của tôi</CardTitle>
            </CardHeader>
            <CardContent>
              {userBids.length > 0 ? (
                <div className="space-y-3">
                  {userBids.map((bid) => (
                    <div key={bid.bidId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getBidStatusColor(bid.status)}>
                            {bid.status === 'filled' ? 'Đã khớp' :
                             bid.status === 'pending' ? 'Chờ xử lý' :
                             bid.status === 'partial' ? 'Khớp một phần' :
                             bid.status === 'cancelled' ? 'Đã hủy' : 'Hết hạn'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {bid.type === 'market' ? 'Nhận ngay' : 'Giới hạn'}
                          </span>
                        </div>
                        <p className="font-medium">{formatCurrency(bid.amount)}</p>
                        {bid.deltaMin && (
                          <p className="text-sm text-gray-500">ΔG tối thiểu: {formatRate(bid.deltaMin)}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(bid.createdAt).toLocaleString('vi-VN')}
                        </p>
                        {bid.filledAmount && (
                          <p className="text-sm font-medium text-green-600">
                            Khớp: {formatCurrency(bid.filledAmount)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Bạn chưa có lệnh nào cho vòng này</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setShowBidForm(true)}
                    disabled={round.status !== 'open'}
                  >
                    Đặt lệnh đầu tiên
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bid Form Modal */}
      {showBidForm && (
        <BidForm
          round={round}
          onSuccess={handleBidSuccess}
          onCancel={() => setShowBidForm(false)}
        />
      )}
    </div>
  );
};

export default AuctionDetail;