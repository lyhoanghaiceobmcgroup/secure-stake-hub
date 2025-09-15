import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  Download,
  Bell,
  Eye,
  QrCode,
  Copy,
  Calendar,
  FileText,
  ShieldCheck,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface InvestmentSuccessScreenProps {
  investmentData: {
    packageName: string;
    businessName: string;
    investmentAmount: number;
    effectiveDate: string;
    contractHash: string;
    qrCodeUrl: string;
    targetReturn: number;
    term: string;
    distributionSchedule: string;
  };
  onViewPortfolio: () => void;
  onClose: () => void;
}

const InvestmentSuccessScreen: React.FC<InvestmentSuccessScreenProps> = ({
  investmentData,
  onViewPortfolio,
  onClose
}) => {
  // Auto-generate CQĐĐT-ID
  const generateCQDDTId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CQĐĐT-${timestamp}-${random}`;
  };

  const cqidNumber = generateCQDDTId();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const downloadContract = () => {
    toast.success('Đang tải hợp đồng đã eSign...');
    // Implementation for contract download
  };

  const setupDistributionReminder = () => {
    toast.success('Đã bật nhắc nhở kỳ phân phối');
    // Implementation for setting up reminders
  };

  const verifyBlockchain = () => {
    toast.success(`Đang xác thực blockchain với hash: ${investmentData.contractHash}`);
    // Implementation for blockchain verification
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border">
        {/* Header */}
        <div className="bg-gradient-to-r from-golden to-golden-light text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center mb-2">Đầu tư thành công!</h1>
          <p className="text-center text-golden-light opacity-90">
            Chúc mừng bạn đã hoàn tất góp vốn đồng hành
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Investment Summary */}
          <Card className="border-golden/20">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Gói đầu tư</p>
                  <p className="font-semibold">{investmentData.packageName}</p>
                  <p className="text-sm text-muted-foreground">{investmentData.businessName}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Số tiền góp vốn</span>
                  <span className="text-lg font-bold text-golden">
                    {formatCurrency(investmentData.investmentAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ngày hiệu lực</span>
                  <span className="font-medium">{investmentData.effectiveDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tỷ suất mục tiêu</span>
                  <span className="font-medium text-navy">{investmentData.targetReturn}%/năm</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CQĐĐT Information */}
          <Card className="border-golden/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-golden" />
                Chứng chỉ quyền lợi đầu tư (CQĐĐT)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-golden/5 rounded-lg border border-golden/20">
                <div>
                  <p className="text-xs text-muted-foreground">CQĐĐT-ID tự động</p>
                  <p className="font-mono text-sm font-bold text-golden">
                    {cqidNumber}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => copyToClipboard(cqidNumber, 'CQĐĐT-ID')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <div className="bg-golden/10 p-2 rounded">
                    <QrCode className="w-4 h-4 text-golden" />
                  </div>
                </div>
              </div>
              
              <Alert className="border-golden/20">
                <ShieldCheck className="h-3 w-3 text-golden" />
                <AlertDescription className="text-xs">
                  Blockchain hash: 
                  <code className="ml-1 text-xs bg-muted px-1 py-0.5 rounded font-mono">
                    {investmentData.contractHash.substring(0, 16)}...
                  </code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-medium text-base">Các bước tiếp theo</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={onViewPortfolio}
                className="h-auto p-3 flex flex-col items-center gap-1 bg-golden hover:bg-golden-dark text-white"
              >
                <Eye className="w-4 h-4" />
                <span className="text-xs font-medium">Xem Sổ mới</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={downloadContract}
                className="h-auto p-3 flex flex-col items-center gap-1 border-golden/20 hover:bg-golden/5"
              >
                <Download className="w-4 h-4" />
                <span className="text-xs font-medium">Tải hợp đồng</span>
              </Button>
            </div>
          </div>

          {/* Distribution Schedule Preview */}
          <Card className="border-golden/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-golden" />
                    <span className="text-sm font-medium">Lịch phân phối</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {investmentData.distributionSchedule} • {investmentData.term}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Ước tính
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" onClick={onClose} className="text-sm">
              Đóng
            </Button>
            
            <Button 
              onClick={onViewPortfolio} 
              className="flex items-center gap-2 bg-golden hover:bg-golden-dark text-white text-sm"
            >
              Đi tới Sổ của tôi
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSuccessScreen;