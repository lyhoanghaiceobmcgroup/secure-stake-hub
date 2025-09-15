import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  Info,
  Smartphone,
  Shield,
  CreditCard,
  FileText,
  Award,
  Bell,
  RotateCcw
} from 'lucide-react';
import { StepStatus, ProgressProfile } from '@/types/data-schema';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProgressWidgetProps {
  profile: ProgressProfile;
  intentId?: string;
  onStepClick?: (step: StepStatus) => void;
}

const ProgressWidget: React.FC<ProgressWidgetProps> = ({ 
  profile, 
  intentId,
  onStepClick 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<StepStatus[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Định nghĩa các bước và trọng số
  const stepDefinitions = [
    {
      id: 'kyc',
      name: 'KYC danh tính',
      required: true,
      weight: 25,
      icon: Shield,
      description: 'Xác minh danh tính để đảm bảo an toàn',
      completionCriteria: 'kycStatus === "verified" & có biên bản KYC',
      deepLink: '/settings/kyc'
    },
    {
      id: 'bank',
      name: 'Thêm STK nhận phân phối',
      required: true,
      weight: 15,
      icon: CreditCard,
      description: 'Thêm tài khoản ngân hàng để nhận phân phối',
      completionCriteria: 'Có ≥1 STK đã xác minh & đặt chính',
      deepLink: '/settings/banks?setup=primary'
    },
    {
      id: '2fa',
      name: 'Bật 2FA',
      required: false,
      weight: 10,
      icon: Smartphone,
      description: 'Tăng cường bảo mật tài khoản',
      completionCriteria: 'twoFA.enabled === true',
      deepLink: '/settings/security?focus=2fa'
    },
    {
      id: 'topup',
      name: 'Nạp số dư',
      required: true,
      weight: 15,
      icon: CreditCard,
      description: 'Nạp đủ số dư để tham gia góp vốn',
      completionCriteria: 'wallet.available >= minContribution',
      deepLink: '/wallet/topup'
    },
    {
      id: 'risk',
      name: 'Xác nhận hiểu rủi ro',
      required: true,
      weight: 10,
      icon: AlertCircle,
      description: 'Xác nhận hiểu rõ các rủi ro đầu tư',
      completionCriteria: 'riskAcknowledgedAt có timestamp',
      deepLink: `/invest/intent/${intentId}/ack`
    },
    {
      id: 'esign',
      name: 'eSign hợp đồng',
      required: true,
      weight: 15,
      icon: FileText,
      description: 'Ký điện tử hợp đồng góp vốn',
      completionCriteria: 'contract.status === "signed_all"',
      deepLink: `/invest/intent/${intentId}/esign`
    },
    {
      id: 'certificate',
      name: 'Cấp CQĐĐT',
      required: true,
      weight: 10,
      icon: Award,
      description: 'Nhận chứng quyền đại diện đầu tư',
      completionCriteria: 'certificate.status === "allocated"',
      deepLink: `/portfolio/certificate/${profile.certificate?.cqid}`
    },
    {
      id: 'notify',
      name: 'Bật thông báo',
      required: false,
      weight: 0,
      icon: Bell,
      description: 'Nhận thông báo về phân phối và cập nhật',
      completionCriteria: 'Có channel ít nhất: In-app/Email',
      deepLink: '/settings/notifications'
    },
    {
      id: 'reinvest',
      name: 'Thiết lập tái đầu tư',
      required: false,
      weight: 0,
      icon: RotateCcw,
      description: 'Tự động tái đầu tư lợi ích phân phối',
      completionCriteria: 'reinvest.enabled === true',
      deepLink: '/offers/reinvest/setup'
    }
  ];

  // Tính toán trạng thái các bước
  useEffect(() => {
    const calculatedSteps: StepStatus[] = stepDefinitions.map(def => {
      let status: StepStatus['status'] = 'not_started';
      let blockingReason: string | undefined;

      switch (def.id) {
        case 'kyc':
          if (profile.kycStatus === 'verified') status = 'completed';
          else if (profile.kycStatus === 'processing') status = 'in_progress';
          else if (profile.kycStatus === 'rejected') {
            status = 'blocked';
            blockingReason = 'KYC bị từ chối, vui lòng thực hiện lại';
          }
          break;
        
        case 'bank':
          if (profile.bankPrimary) status = 'completed';
          else if (profile.kycStatus !== 'verified') {
            status = 'blocked';
            blockingReason = 'Cần hoàn tất KYC trước';
          }
          break;
        
        case '2fa':
          if (profile.twoFA.enabled) status = 'completed';
          break;
        
        case 'topup':
          // Giả sử minContribution = 1,000,000
          const minContribution = 1000000;
          if (profile.wallet.available >= minContribution) status = 'completed';
          else if (profile.wallet.available > 0) status = 'in_progress';
          break;
        
        case 'risk':
          if (profile.riskAcknowledgedAt) status = 'completed';
          else if (!profile.bankPrimary || profile.kycStatus !== 'verified') {
            status = 'blocked';
            blockingReason = 'Cần hoàn tất KYC và thêm STK trước';
          }
          break;
        
        case 'esign':
          if (profile.contract?.status === 'signed_all') status = 'completed';
          else if (profile.contract?.status === 'signed_investor') status = 'in_progress';
          else if (!profile.riskAcknowledgedAt) {
            status = 'blocked';
            blockingReason = 'Cần xác nhận hiểu rủi ro trước';
          }
          break;
        
        case 'certificate':
          if (profile.certificate?.status === 'allocated') status = 'completed';
          else if (profile.certificate?.status === 'pending') status = 'in_progress';
          else if (profile.contract?.status !== 'signed_all') {
            status = 'blocked';
            blockingReason = 'Cần hoàn tất eSign hợp đồng trước';
          }
          break;
        
        case 'notify':
        case 'reinvest':
          // Các bước tùy chọn, mặc định not_started
          break;
      }

      return {
        id: def.id,
        name: def.name,
        required: def.required,
        status,
        weight: def.weight,
        deepLink: def.deepLink,
        description: def.description,
        completionCriteria: def.completionCriteria,
        blockingReason
      };
    });

    setSteps(calculatedSteps);

    // Tính % hoàn tất
    const completedWeight = calculatedSteps
      .filter(step => step.status === 'completed')
      .reduce((sum, step) => sum + step.weight, 0);
    
    setProgressPercentage(completedWeight);
  }, [profile, intentId]);

  // Tìm bước kế tiếp cần làm
  const getNextStep = () => {
    const requiredOrder = ['kyc', 'bank', 'topup', 'risk', 'esign', 'certificate'];
    const optionalOrder = ['2fa', 'notify', 'reinvest'];
    
    const requiredNotDone = requiredOrder
      .map(id => steps.find(s => s.id === id))
      .filter(step => step && step.status !== 'completed');
    
    const optionalNotDone = optionalOrder
      .map(id => steps.find(s => s.id === id))
      .filter(step => step && step.status !== 'completed');
    
    return [...requiredNotDone, ...optionalNotDone][0];
  };

  const handleStepClick = (step: StepStatus) => {
    if (step.status === 'blocked') return;
    
    // Lưu intent draft nếu có
    if (profile.intentDraft) {
      localStorage.setItem('intentDraft', JSON.stringify({
        ...profile.intentDraft,
        returnTo: window.location.pathname
      }));
    }
    
    // Deep link với query params
    const url = new URL(step.deepLink, window.location.origin);
    if (intentId) {
      url.searchParams.set('returnTo', `/invest/intent/${intentId}`);
    }
    
    navigate(url.pathname + url.search);
    setIsOpen(false);
    
    onStepClick?.(step);
  };

  const getStepIcon = (step: StepStatus) => {
    const IconComponent = stepDefinitions.find(def => def.id === step.id)?.icon || Info;
    
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <IconComponent className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStepBadge = (step: StepStatus) => {
    switch (step.status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Hoàn tất</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Đang xử lý</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Bị chặn</Badge>;
      default:
        return <Badge variant="outline">Chưa bắt đầu</Badge>;
    }
  };

  const isReadyToInvest = () => {
    const requiredSteps = steps.filter(s => s.required);
    return requiredSteps.every(s => s.status === 'completed');
  };

  const getWidgetText = () => {
    if (isReadyToInvest()) {
      return 'Sẵn sàng tham gia!';
    }
    
    const incompleteRequired = steps.filter(s => s.required && s.status !== 'completed').length;
    return `Bạn còn ${incompleteRequired} bước`;
  };

  // Widget trigger cho desktop
  const DesktopTrigger = () => (
    <div className="fixed bottom-6 right-6 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-lg relative"
              variant={isReadyToInvest() ? "default" : "outline"}
            >
              <div className="absolute inset-0 rounded-full">
                <Progress 
                  value={progressPercentage} 
                  className="h-full w-full rounded-full"
                />
              </div>
              <div className="relative z-10 text-xs font-medium">
                {progressPercentage}%
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{getWidgetText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  // Widget trigger cho mobile
  const MobileTrigger = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="w-full py-4 justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-medium text-blue-600">{progressPercentage}%</span>
          </div>
          <span className="text-sm font-medium">{getWidgetText()}</span>
        </div>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <>
      {isMobile ? <MobileTrigger /> : <DesktopTrigger />}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Trợ lý quy trình</span>
              <div className="flex items-center space-x-2">
                <Progress value={progressPercentage} className="w-24" />
                <span className="text-sm text-gray-500">{progressPercentage}%</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {isReadyToInvest() ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 mb-1">Sẵn sàng tham gia!</h3>
                <p className="text-sm text-green-600 mb-3">
                  Bạn đã hoàn tất tất cả các bước bắt buộc
                </p>
                <Button 
                  onClick={() => {
                    if (intentId) {
                      navigate(`/invest/intent/${intentId}`);
                    }
                    setIsOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Tiếp tục đầu tư
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step) => {
                  const stepDef = stepDefinitions.find(def => def.id === step.id);
                  
                  return (
                    <div 
                      key={step.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        step.status === 'blocked' 
                          ? 'bg-red-50 border-red-200' 
                          : 'hover:bg-gray-50 cursor-pointer'
                      }`}
                      onClick={() => handleStepClick(step)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStepIcon(step)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{step.name}</span>
                              {step.required && (
                                <Badge variant="outline" className="text-xs">Bắt buộc</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{step.description}</p>
                            {step.blockingReason && (
                              <p className="text-xs text-red-600 mt-1">{step.blockingReason}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStepBadge(step)}
                          {step.status !== 'blocked' && step.status !== 'completed' && (
                            <Button size="sm" variant="outline">
                              Nhảy tới
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProgressWidget;