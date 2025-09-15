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
    cqidNumber: string;
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Đầu tư thành công!</h1>
          <p className="text-center text-green-100">
            Chúc mừng bạn đã hoàn tất góp vốn đồng hành
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Investment Summary */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800">Thông tin đầu tư</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gói đầu tư</p>
                  <p className="font-semibold">{investmentData.packageName}</p>
                  <p className="text-sm text-muted-foreground">{investmentData.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số tiền góp vốn</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(investmentData.investmentAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày hiệu lực</p>
                  <p className="font-semibold">{investmentData.effectiveDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tỷ suất phân phối mục tiêu</p>
                  <p className="font-semibold text-blue-600">{investmentData.targetReturn}%/năm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CQĐĐT Information */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Chứng chỉ quyền lợi đầu tư (CQĐĐT)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground">CQĐĐT-ID</p>
                  <p className="font-mono text-lg font-bold text-blue-600">
                    {investmentData.cqidNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <QrCode className="w-12 h-12 text-gray-600" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(investmentData.cqidNumber, 'CQĐĐT-ID')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  Chứng chỉ đã được ghi nhận trên blockchain với hash: 
                  <code className="ml-1 text-xs bg-muted px-1 py-0.5 rounded">
                    {investmentData.contractHash}
                  </code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Các bước tiếp theo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                onClick={onViewPortfolio}
                className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-5 h-5" />
                <span className="text-sm font-medium">Xem Sổ mới</span>
                <span className="text-xs opacity-90">Chi tiết sổ đầu tư</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={downloadContract}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">Tải hợp đồng</span>
                <span className="text-xs text-muted-foreground">PDF + hash</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={setupDistributionReminder}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Bell className="w-5 h-5" />
                <span className="text-sm font-medium">Đặt nhắc kỳ</span>
                <span className="text-xs text-muted-foreground">Phân phối lợi ích</span>
              </Button>
            </div>
          </div>

          {/* Distribution Schedule Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Lịch phân phối dự kiến
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{investmentData.distributionSchedule}</p>
                  <p className="text-sm text-muted-foreground">
                    Kỳ hạn: {investmentData.term} • Phân phối theo kết quả kinh doanh
                  </p>
                </div>
                <Badge variant="secondary">
                  Ước tính
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={verifyBlockchain}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Xác thực blockchain
            </Button>
            
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Theo dõi doanh nghiệp
            </Button>
          </div>

          <Separator />

          {/* Footer Actions */}
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={onClose}>
              Đóng
            </Button>
            
            <Button onClick={onViewPortfolio} className="flex items-center gap-2">
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