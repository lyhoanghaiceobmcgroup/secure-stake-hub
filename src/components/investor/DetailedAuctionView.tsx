import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target, 
  FileText, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Wallet,
  Activity
} from 'lucide-react';
import { formatVND, formatPercentage, calculateTimeRemaining } from '../../data/detailedAuctionMockData';
import type { DetailedAuctionData } from '../../data/detailedAuctionMockData';

interface DetailedAuctionViewProps {
  auctionData: DetailedAuctionData;
  onBack: () => void;
}

const DetailedAuctionView: React.FC<DetailedAuctionViewProps> = ({ auctionData, onBack }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [currentDelta, setCurrentDelta] = useState(
    auctionData.currentMetrics?.deltaNow || auctionData.round?.delta_now || 0.0028
  );
  const [currentCover, setCurrentCover] = useState(
    auctionData.currentMetrics?.cover || auctionData.round?.cover || 0.73
  );

  useEffect(() => {
    const updateTime = () => {
      const endTime = auctionData.round?.endTime || auctionData.round?.end_at;
      if (endTime) {
        setTimeRemaining(calculateTimeRemaining(endTime));
      }
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Simulate real-time delta and cover updates
    const deltaInterval = setInterval(() => {
      const status = auctionData.round?.status;
      if (status === 'open') {
        setCurrentDelta(prev => {
          const newDelta = prev + (Math.random() - 0.5) * 0.0001;
          const deltaMax = auctionData.round?.delta_max || auctionData.currentMetrics?.deltaMax || 0.004;
          const deltaFloor = auctionData.round?.delta_floor || auctionData.currentMetrics?.deltaFloor || 0.001;
          return Math.max(deltaFloor, Math.min(deltaMax, newDelta));
        });
        setCurrentCover(prev => Math.min(prev + Math.random() * 0.01, 1));
      }
    }, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(deltaInterval);
    };
  }, [auctionData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'triggered_hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Đang mở';
      case 'active': return 'Đang hoạt động';
      case 'upcoming': return 'Sắp diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'triggered_hold': return 'Đã kích hoạt';
      default: return status;
    }
  };

  const currentROffer = (auctionData.round?.r_offer || auctionData.round?.interestRate || 0) - currentDelta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <Badge className={getStatusColor(auctionData.round.status)}>
          {getStatusText(auctionData.round.status)}
        </Badge>
      </div>

      {/* Company & Opportunity Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{auctionData.company?.name}</h2>
              <p className="text-gray-600">{auctionData.opportunity?.gid}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">G-Trust Score</div>
              <div className="text-2xl font-bold text-green-600">{auctionData.company?.gtrust || auctionData.company?.trustScore}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Lĩnh vực</div>
              <div className="font-semibold">{auctionData.company?.sector}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Kỳ hạn</div>
              <div className="font-semibold">{auctionData.opportunity?.tenor_months} tháng</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Lãi suất cơ bản</div>
              <div className="font-semibold">{formatPercentage(auctionData.opportunity?.r_base)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auction Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">Thời gian còn lại</div>
                <div className="font-bold text-lg">{timeRemaining}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-sm text-gray-600">Delta hiện tại</div>
                <div className="font-bold text-lg">{formatPercentage(currentDelta, 4)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-600">Tỷ lệ cover</div>
                <div className="font-bold text-lg">{formatPercentage(currentCover)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm text-gray-600">R-Offer hiện tại</div>
                <div className="font-bold text-lg">{formatPercentage(currentROffer, 4)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tiến độ gọi vốn</span>
              <span className="text-sm text-gray-600">
                {formatVND(auctionData.round?.raised_vnd || auctionData.round?.currentAmount || 0)} / {formatVND(auctionData.round?.target_vnd || auctionData.round?.targetAmount || 0)}
              </span>
            </div>
            <Progress value={currentCover * 100} className="h-3" />
            <div className="text-center text-sm text-gray-600">
              {formatPercentage(currentCover)} hoàn thành
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="bids">Lệnh của tôi</TabsTrigger>
          <TabsTrigger value="allocations">Phân bổ</TabsTrigger>
          <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đấu giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Mã vòng:</span>
                  <span className="font-semibold">{auctionData.round.round_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lot tối thiểu:</span>
                  <span className="font-semibold">{formatVND(auctionData.round.lot_vnd)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cap tối đa:</span>
                  <span className="font-semibold">{formatPercentage(auctionData.round.cap_pct)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delta sàn:</span>
                  <span className="font-semibold">{formatPercentage(auctionData.round.delta_floor, 4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delta trần:</span>
                  <span className="font-semibold">{formatPercentage(auctionData.round.delta_max, 4)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kiểm tra điều kiện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>KYC:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-semibold">{auctionData.my_precheck.kyc}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>2FA:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-semibold">{auctionData.my_precheck.twofa}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ngân hàng chính:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-semibold">{auctionData.my_precheck.primary_bank}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Số dư:</span>
                  <div className="flex items-center gap-2">
                    {auctionData.my_precheck.balance_ok ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`font-semibold ${
                      auctionData.my_precheck.balance_ok ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {auctionData.my_precheck.balance_ok ? 'Đủ' : 'Không đủ'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lệnh đặt của tôi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(auctionData.my_bids || []).map((bid, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={bid.type === 'market' ? 'default' : 'secondary'}>
                          {bid.type === 'market' ? 'Market' : 'Limit'}
                        </Badge>
                        <span className="font-semibold">{bid.bid_id}</span>
                      </div>
                      <Badge className={getStatusColor(bid.state)}>
                        {getStatusText(bid.state)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Số tiền:</span>
                        <span className="ml-2 font-semibold">{formatVND(bid.amount_vnd)}</span>
                      </div>
                      {bid.r_offer_at_place && (
                        <div>
                          <span className="text-gray-600">R-Offer khi đặt:</span>
                          <span className="ml-2 font-semibold">{formatPercentage(bid.r_offer_at_place, 4)}</span>
                        </div>
                      )}
                      {bid.delta_g_min && (
                        <div>
                          <span className="text-gray-600">Delta tối thiểu:</span>
                          <span className="ml-2 font-semibold">{formatPercentage(bid.delta_g_min, 4)}</span>
                        </div>
                      )}
                      {bid.hold_tx_id && (
                        <div>
                          <span className="text-gray-600">Hold TX:</span>
                          <span className="ml-2 font-mono text-xs">{bid.hold_tx_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(!auctionData.my_bids || auctionData.my_bids.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có lệnh đặt nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả phân bổ</CardTitle>
            </CardHeader>
            <CardContent>
              {auctionData.clear && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Thông tin clearing</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Thời gian clear:</span>
                      <span className="ml-2 font-semibold">{new Date(auctionData.clear.cleared_at).toLocaleString('vi-VN')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Delta clear:</span>
                      <span className="ml-2 font-semibold">{formatPercentage(auctionData.clear.delta_g_clear, 4)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">R-Clear:</span>
                      <span className="ml-2 font-semibold">{formatPercentage(auctionData.clear.r_clear, 4)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Pro-rata:</span>
                      <span className="ml-2 font-semibold">{formatPercentage(auctionData.clear.pro_rata)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {(auctionData.allocations || []).map((allocation, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{allocation.bid_id}</span>
                      <span className="font-mono text-sm">{allocation.cqid}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Yêu cầu:</span>
                        <span className="ml-2 font-semibold">{formatVND(allocation.requested_vnd)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Được cấp:</span>
                        <span className="ml-2 font-semibold text-green-600">{formatVND(allocation.filled_vnd)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hoàn trả:</span>
                        <span className="ml-2 font-semibold text-blue-600">{formatVND(allocation.refund_vnd)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!auctionData.allocations || auctionData.allocations.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có phân bổ nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử giao dịch ví</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(auctionData.wallet_tx || []).map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        tx.state === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-semibold">{tx.type}</div>
                        <div className="text-sm text-gray-600">{tx.ref}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatVND(tx.amount_vnd)}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(tx.t).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
                {(!auctionData.wallet_tx || auctionData.wallet_tx.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có giao dịch nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(auctionData.documents || []).map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">{doc.type}</div>
                        <div className="text-sm text-gray-600">
                          {doc.doc_id || doc.cqid}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Xem
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Tải
                      </Button>
                    </div>
                  </div>
                ))}
                {(!auctionData.documents || auctionData.documents.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có tài liệu nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedAuctionView;