import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DollarSign, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Download,
  QrCode,
  Signature,
  Lock,
  ArrowRight,
  Building2,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import UyTinBadge from "./UyTinBadge";
import LegalDisclaimer, { CompactLegalDisclaimer } from "./LegalDisclaimer";
import InvestmentSuccessScreen from "./InvestmentSuccessScreen";
import PortfolioService from "@/services/portfolioService";

interface InvestmentFlowProps {
  opportunity: {
    id: string;
    companyName: string;
    projectName: string;
    description: string;
    targetRate: number;
    minInvestment: number;
    uyTinScore: number;
    sector: string;
    duration: string;
    documents: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

type FlowStep = 'amount' | 'risk_acknowledgment' | 'esign' | 'confirmation' | 'completed';

const InvestmentFlow = ({ opportunity, isOpen, onClose }: InvestmentFlowProps) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('amount');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [eSignCompleted, setESignCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [cqidNumber, setCqidNumber] = useState('');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Mock wallet balance
  const availableBalance = 4000000000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStepProgress = () => {
    const steps = ['amount', 'risk_acknowledgment', 'esign', 'confirmation', 'completed'];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  const handleAmountSubmit = () => {
    const amount = parseInt(investmentAmount.replace(/[^0-9]/g, ''));
    
    if (!amount || amount < opportunity.minInvestment) {
      toast.error(`Số tiền tối thiểu là ${formatCurrency(opportunity.minInvestment)}`);
      return;
    }
    
    if (amount > availableBalance) {
      toast.error('Số dư không đủ. Vui lòng nạp thêm tiền.');
      return;
    }
    
    setCurrentStep('risk_acknowledgment');
  };

  const handleRiskAcknowledgment = () => {
    if (!riskAcknowledged) {
      toast.error('Vui lòng xác nhận hiểu rủi ro đầu tư');
      return;
    }
    setCurrentStep('esign');
  };

  const handleESign = async () => {
    setIsProcessing(true);
    
    // Simulate eSign process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setESignCompleted(true);
    const newTransactionId = `TX${Date.now()}`;
    const newCqidNumber = `${opportunity.companyName.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    setTransactionId(newTransactionId);
    setCqidNumber(newCqidNumber);
    setCurrentStep('confirmation');
    setIsProcessing(false);
    
    // Lưu dữ liệu vào Portfolio sau khi ký điện tử thành công
    const portfolioService = PortfolioService.getInstance();
    const eSignData = {
      opportunity: {
        id: opportunity.id,
        companyName: opportunity.companyName,
        projectName: opportunity.projectName,
        sector: opportunity.sector,
        targetRate: opportunity.targetRate,
        uyTinScore: opportunity.uyTinScore,
        duration: opportunity.duration
      },
      investmentAmount: parseInt(investmentAmount.replace(/[^0-9]/g, '')) || 0,
      transactionId: newTransactionId,
      contractHash: `0x${Math.random().toString(16).substr(2, 8)}`,
      cqidNumber: newCqidNumber,
      eSignDate: new Date().toISOString().split('T')[0],
      qrCodeUrl: `/qr/${newCqidNumber}`
    };
    
    portfolioService.addInvestmentFromESign(eSignData);
    
    toast.success(
      "🎉 Ký điện tử thành công!", 
      {
        description: `Thông tin đầu tư đã được lưu vào Sổ của tôi. CQĐĐT: ${newCqidNumber}`,
        duration: 5000,
      }
    );
  };

  const handleFinalConfirmation = async () => {
    setIsProcessing(true);
    
    // Simulate final processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCqidNumber(`CQĐĐT #${opportunity.id.toUpperCase()}-${Math.floor(Math.random() * 9999)}`);
    setShowSuccessScreen(true);
    setIsProcessing(false);
    
    toast.success('Đầu tư thành công! CQĐĐT đã được cấp.');
  };

  const resetFlow = () => {
    setCurrentStep('amount');
    setInvestmentAmount('');
    setRiskAcknowledged(false);
    setTermsAccepted(false);
    setESignCompleted(false);
    setIsProcessing(false);
    setTransactionId('');
    setCqidNumber('');
    setShowSuccessScreen(false);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'amount':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Nhập số tiền góp vốn</h3>
              <p className="text-sm text-muted-foreground">
                Số tiền sẽ được tạm giữ cho đến khi hoàn tất eSign
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Số tiền góp vốn (VNĐ)</Label>
                <Input
                  id="amount"
                  placeholder={`Tối thiểu ${formatCurrency(opportunity.minInvestment)}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Số dư khả dụng:</span>
                  <span className="font-semibold">{formatCurrency(availableBalance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mức góp tối thiểu:</span>
                  <span className="font-semibold">{formatCurrency(opportunity.minInvestment)}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={handleAmountSubmit} className="w-full" size="lg">
              Tiếp tục
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );
        
      case 'risk_acknowledgment':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Xác nhận hiểu rủi ro</h3>
              <p className="text-sm text-muted-foreground">
                Vui lòng đọc kỹ và xác nhận hiểu rủi ro đầu tư
              </p>
            </div>
            
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Tuyên bố rủi ro quan trọng:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Đây là hình thức góp vốn đồng hành, không phải gửi tiết kiệm</li>
                    <li>Tỷ suất phân phối phụ thuộc vào kết quả kinh doanh thực tế</li>
                    <li>Có thể mất một phần hoặc toàn bộ số tiền góp vốn</li>
                    <li>Không có cam kết lợi nhuận cố định</li>
                    <li>Thời gian hoàn vốn có thể dài hơn dự kiến</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="risk" 
                  checked={riskAcknowledged}
                  onCheckedChange={(checked) => setRiskAcknowledged(checked as boolean)}
                />
                <Label htmlFor="risk" className="text-sm leading-relaxed">
                  Tôi đã đọc, hiểu và chấp nhận các rủi ro nêu trên. Tôi xác nhận rằng đây là quyết định đầu tư tự nguyện và phù hợp với khả năng tài chính của tôi.
                </Label>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('amount')} className="flex-1">
                Quay lại
              </Button>
              <Button onClick={handleRiskAcknowledgment} className="flex-1">
                Xác nhận & Tiếp tục
              </Button>
            </div>
          </div>
        );
        
      case 'esign':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Ký điện tử hợp đồng</h3>
              <p className="text-sm text-muted-foreground">
                Ký hợp đồng góp vốn đồng hành để hoàn tất đầu tư
              </p>
            </div>
            
            {/* Legal Disclaimer */}
            <LegalDisclaimer type="esign" variant="warning" />
            
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Hợp đồng góp vốn đồng hành</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Số tiền: {formatCurrency(parseInt(investmentAmount.replace(/[^0-9]/g, '')) || 0)}</p>
                <p>• Dự án: {opportunity.projectName}</p>
                <p>• Doanh nghiệp: {opportunity.companyName}</p>
                <p>• Tỷ suất mục tiêu: {opportunity.targetRate}%/năm</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Xem trước
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Tôi đã đọc, hiểu và đồng ý với các điều khoản trong hợp đồng góp vốn đồng hành
                </Label>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('risk_acknowledgment')} className="flex-1">
                Quay lại
              </Button>
              <Button 
                onClick={handleESign} 
                disabled={!termsAccepted || isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Đang ký...
                  </>
                ) : (
                  <>
                    <Signature className="w-4 h-4 mr-2" />
                    Ký điện tử
                  </>
                )}
              </Button>
            </div>
          </div>
        );
        
      case 'confirmation':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-semibold">Chờ doanh nghiệp xác nhận</h3>
              <p className="text-sm text-muted-foreground">
                Hợp đồng đã được ký thành công. Đang chờ doanh nghiệp xác nhận phát hành CQĐĐT.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Mã giao dịch:</span>
                  <span className="font-mono">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số tiền tạm giữ:</span>
                  <span className="font-semibold">{formatCurrency(parseInt(investmentAmount.replace(/[^0-9]/g, '')) || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Chờ xác nhận
                  </Badge>
                </div>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Số tiền đã được chuyển từ "khả dụng" sang "tạm giữ". Doanh nghiệp có 48h để xác nhận phát hành CQĐĐT.
              </AlertDescription>
            </Alert>
            
            <Button onClick={handleFinalConfirmation} className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Mô phỏng xác nhận DN'
              )}
            </Button>
          </div>
        );
        
      case 'completed':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <h3 className="text-xl font-bold text-green-600">Đầu tư thành công!</h3>
              <p className="text-muted-foreground">
                CQĐĐT đã được cấp và ghi nhận vào sổ của bạn
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">{cqidNumber}</div>
                <QrCode className="w-12 h-12 mx-auto text-gray-600" />
                <p className="text-sm text-muted-foreground mt-2">Mã QR xác thực blockchain</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Số tiền đầu tư:</span>
                  <span className="font-semibold">{formatCurrency(parseInt(investmentAmount.replace(/[^0-9]/g, '')) || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dự án:</span>
                  <span className="font-medium">{opportunity.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày cấp:</span>
                  <span>{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                Tải chứng từ
              </Button>
              <Button onClick={() => {
                resetFlow();
                onClose();
                // Trigger navigation to portfolio tab
                window.dispatchEvent(new CustomEvent('navigate-to-portfolio'));
              }} className="flex-1">
                Xem sổ của tôi
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Show InvestmentSuccessScreen if investment is completed
  if (showSuccessScreen) {
    const investmentData = {
      packageName: opportunity.projectName,
      businessName: opportunity.companyName,
      cqidNumber: cqidNumber,
      investmentAmount: parseInt(investmentAmount.replace(/[^0-9]/g, '')) || 0,
      effectiveDate: new Date().toLocaleDateString('vi-VN'),
      contractHash: `0x${Math.random().toString(16).substr(2, 8)}`,
      qrCodeUrl: `/qr/${cqidNumber}`,
      targetReturn: opportunity.targetRate,
      term: opportunity.duration,
      distributionSchedule: 'Hàng quý'
    };

    return (
      <InvestmentSuccessScreen
        investmentData={investmentData}
        onViewPortfolio={() => {
          resetFlow();
          // Navigate to portfolio page
          window.location.href = '/portfolio';
        }}
        onClose={() => {
          setShowSuccessScreen(false);
          resetFlow();
        }}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Luồng đầu tư - {opportunity.projectName}
          </DialogTitle>
          <DialogDescription>
            Hoàn tất các bước để góp vốn đồng hành vào dự án
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tiến độ</span>
            <span>{Math.round(getStepProgress())}%</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>
        
        {/* Project Summary */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Doanh nghiệp:</span>
                <p className="font-medium">{opportunity.companyName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tỷ suất mục tiêu:</span>
                <p className="font-semibold text-golden">{opportunity.targetRate}%/năm</p>
              </div>
              <div>
                <span className="text-muted-foreground">Kỳ hạn:</span>
                <p className="font-medium">{opportunity.duration}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Điểm Uy tín:</span>
                    <UyTinBadge score={opportunity.uyTinScore} size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Step Content */}
        <div className="py-4">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentFlow;