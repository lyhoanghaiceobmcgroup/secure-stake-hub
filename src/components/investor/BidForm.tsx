import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Info, Calculator, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { AuctionRound, BidRequest, BidOrder, BidFormData, BidFormErrors } from '../../types/auction';
import { auctionService } from '../../services/auctionService';
import { useWallet } from '../../contexts/WalletContext';
import { mockUserPortfolio } from '../../data/auctionMockData';

interface BidFormProps {
  round: AuctionRound;
  onSuccess: (bid: BidOrder) => void;
  onCancel: () => void;
}

const BidForm: React.FC<BidFormProps> = ({ round, onSuccess, onCancel }) => {
  const { balance } = useWallet();
  const [userBalance] = useState(mockUserPortfolio.availableBalance);
  const [formData, setFormData] = useState<BidFormData>({
    amount: '',
    type: 'market',
    deltaMin: ''
  });
  const [errors, setErrors] = useState<BidFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<{
    estimatedRate: number;
    estimatedReturn: number;
    holdAmount: number;
  } | null>(null);

  useEffect(() => {
    if (formData.amount && !isNaN(Number(formData.amount))) {
      calculatePreview();
    } else {
      setPreviewData(null);
    }
  }, [formData.amount, formData.type, formData.deltaMin]);

  const calculatePreview = () => {
    const amount = Number(formData.amount);
    if (amount <= 0) return;

    let estimatedRate = round.rOffer;
    if (formData.type === 'limit' && formData.deltaMin) {
      const deltaMin = Number(formData.deltaMin) / 100;
      estimatedRate = round.baseRate + deltaMin;
    }

    const estimatedReturn = amount * estimatedRate * (round.termMonths / 12);
    const holdAmount = formData.type === 'market' ? amount : 0;

    setPreviewData({
      estimatedRate,
      estimatedReturn,
      holdAmount
    });
  };

  const validateForm = (): boolean => {
    const newErrors: BidFormErrors = {};
    const amount = Number(formData.amount);

    // Validate amount
    if (!formData.amount || isNaN(amount)) {
      newErrors.amount = 'Vui lòng nhập số tiền hợp lệ';
    } else {
      const amountError = auctionService.validateBidAmount(amount, round, balance);
      if (amountError) {
        newErrors.amount = amountError;
      }
    }

    // Validate deltaMin for limit orders
    if (formData.type === 'limit') {
      if (!formData.deltaMin || isNaN(Number(formData.deltaMin))) {
        newErrors.deltaMin = 'Vui lòng nhập ΔG tối thiểu';
      } else {
        const deltaMin = Number(formData.deltaMin) / 100;
        if (deltaMin < round.deltaFloor) {
          newErrors.deltaMin = `ΔG tối thiểu phải ≥ ${(round.deltaFloor * 100).toFixed(3)}%`;
        }
        if (deltaMin > round.deltaNow) {
          newErrors.deltaMin = `ΔG tối thiểu phải ≤ ${(round.deltaNow * 100).toFixed(3)}% (hiện tại)`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const bidRequest: BidRequest = {
        roundId: round.roundId,
        amount: Number(formData.amount),
        type: formData.type,
        deltaMin: formData.type === 'limit' ? Number(formData.deltaMin) / 100 : undefined,
        idempotencyKey: auctionService.generateIdempotencyKey('USER-001', round.roundId)
      };

      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = { success: true, bidId: `BID-${Date.now()}`, receiptHash: `HASH-${Date.now()}` };
      
      if (response.success && response.bidId) {
        // Create bid object for callback
        const bid: BidOrder = {
          bidId: response.bidId,
          roundId: round.roundId,
          userId: 'USER-001',
          amount: Number(formData.amount),
          type: formData.type,
          deltaMin: formData.type === 'limit' ? Number(formData.deltaMin) / 100 : undefined,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          idempotencyKey: bidRequest.idempotencyKey,
          receiptHash: response.receiptHash
        };
        
        onSuccess(bid);
      } else {
        setErrors({ general: response.message || 'Đặt lệnh thất bại' });
      }
    } catch (error) {
      console.error('Failed to place bid:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Có lỗi xảy ra khi đặt lệnh' });
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Đặt lệnh đấu giá</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Round Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900">{round.company}</h3>
              <Badge className="bg-blue-100 text-blue-800">Vòng {round.roundIndex}/{round.roundCount}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">R_offer hiện tại:</span>
                <span className="font-semibold ml-2">{formatRate(round.rOffer)}</span>
              </div>
              <div>
                <span className="text-blue-700">ΔG hiện tại:</span>
                <span className="font-semibold ml-2">{formatRate(round.deltaNow)}</span>
              </div>
              <div>
                <span className="text-blue-700">Lấp đầy:</span>
                <span className="font-semibold ml-2">{(round.cover * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-blue-700">Còn lại:</span>
                <span className="font-semibold ml-2">{formatCurrency(round.targetAmount - round.raised)}</span>
              </div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Wallet className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Số dư khả dụng:</span>
            <span className="font-semibold">{formatCurrency(userBalance)}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bid Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Loại lệnh</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: 'market' | 'limit') => 
                  setFormData(prev => ({ ...prev, type: value, deltaMin: value === 'market' ? '' : prev.deltaMin }))
                }
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="market" id="market" />
                  <div className="flex-1">
                    <Label htmlFor="market" className="cursor-pointer font-medium">Nhận ngay</Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Khớp ngay với R_offer hiện tại ({formatRate(round.rOffer)})
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="limit" id="limit" />
                  <div className="flex-1">
                    <Label htmlFor="limit" className="cursor-pointer font-medium">Giới hạn</Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Khớp khi ΔG giảm xuống mức bạn chỉ định
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-medium">Số tiền đặt lệnh</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  placeholder="Nhập số tiền (VND)"
                  value={formData.amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData(prev => ({ ...prev, amount: value }));
                  }}
                  className={errors.amount ? 'border-red-500' : ''}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  VND
                </div>
              </div>
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount}</p>
              )}
              <p className="text-xs text-gray-500">
                Số tiền tối thiểu: {formatCurrency(1000000)}
              </p>
            </div>

            {/* Delta Min for Limit Orders */}
            {formData.type === 'limit' && (
              <div className="space-y-2">
                <Label htmlFor="deltaMin" className="text-base font-medium">ΔG tối thiểu (%)</Label>
                <div className="relative">
                  <Input
                    id="deltaMin"
                    type="text"
                    placeholder="Ví dụ: 0.250"
                    value={formData.deltaMin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      setFormData(prev => ({ ...prev, deltaMin: value }));
                    }}
                    className={errors.deltaMin ? 'border-red-500' : ''}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    %
                  </div>
                </div>
                {errors.deltaMin && (
                  <p className="text-sm text-red-600">{errors.deltaMin}</p>
                )}
                <p className="text-xs text-gray-500">
                  Khoảng: {formatRate(round.deltaFloor)} - {formatRate(round.deltaNow)}
                </p>
              </div>
            )}

            {/* Preview */}
            {previewData && (
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Dự kiến</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Tỷ suất dự kiến:</span>
                    <span className="font-semibold ml-2">{formatRate(previewData.estimatedRate)}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Lợi ích dự kiến:</span>
                    <span className="font-semibold ml-2">{formatCurrency(previewData.estimatedReturn)}</span>
                  </div>
                  {previewData.holdAmount > 0 && (
                    <div className="col-span-2">
                      <span className="text-green-700">Số tiền tạm giữ:</span>
                      <span className="font-semibold ml-2">{formatCurrency(previewData.holdAmount)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Important Notes */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Lưu ý quan trọng:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Lệnh nhận ngay sẽ tạm giữ toàn bộ số tiền cho đến khi vòng kết thúc</li>
                  <li>Lệnh giới hạn chỉ khớp khi ΔG giảm xuống mức bạn chỉ định</li>
                  <li>Mọi giao dịch đều có biên nhận PDF + hash bảo mật</li>
                  <li>Phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* General Error */}
            {errors.general && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading || !formData.amount}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đặt lệnh'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BidForm;