import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Smartphone, 
  QrCode, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  KeyRound,
  Fingerprint,
  Lock,
  User,
  Sparkles,
  Star,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LoginFormData {
  emailOrPhone: string;
  password: string;
  twoFACode?: string;
}

interface UserSecurityStatus {
  kycStatus: 'pending' | 'verified' | 'rejected';
  bankAccountLinked: boolean;
  twoFAEnabled: boolean;
  securityScore: number;
}

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | '2fa' | 'security-check'>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrPhone: '',
    password: '',
    twoFACode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsAnimating(true);
  }, []);
  
  // Mock security status - in real app this would come from API
  const [securityStatus] = useState<UserSecurityStatus>({
    kycStatus: 'verified',
    bankAccountLinked: true,
    twoFAEnabled: true,
    securityScore: 85
  });

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCredentials = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'Vui lòng nhập email hoặc số điện thoại';
    } else if (!formData.emailOrPhone.includes('@') && !/^[0-9]{10,11}$/.test(formData.emailOrPhone)) {
      newErrors.emailOrPhone = 'Email hoặc số điện thoại không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCredentials()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call for credential verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if 2FA is enabled
      if (securityStatus.twoFAEnabled) {
        setStep('2fa');
      } else {
        setStep('security-check');
      }
    } catch (error) {
      setErrors({ general: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.twoFACode || formData.twoFACode.length !== 6) {
      setErrors({ twoFACode: 'Vui lòng nhập mã 6 số từ ứng dụng xác thực' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate 2FA verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('security-check');
    } catch (error) {
      setErrors({ twoFACode: 'Mã xác thực không đúng. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityCheckComplete = () => {
    // Navigate to investor app after successful login
    navigate('/investor');
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, text: 'Tốt', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { variant: 'secondary' as const, text: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' };
    return { variant: 'destructive' as const, text: 'Cần cải thiện', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-golden/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-transparent to-golden/5" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-golden/20 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-navy/30 rounded-full animate-ping" />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-golden-light/10 rounded-full animate-bounce" />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-navy-light/20 rounded-full animate-pulse" />
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-md transition-all duration-1000 ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="mb-6 text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Quay lại trang chủ
            </Button>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-golden via-golden-light to-yellow-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold text-lg">GB</span>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-navy">GoldenBook</h1>
                <p className="text-xs text-muted-foreground">Transparent Investment</p>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-navy/10 text-navy border-navy/20">
                <Shield className="w-3 h-3 mr-1" />
                Bảo mật cao
              </Badge>
              <Badge variant="secondary" className="bg-golden/10 text-golden border-golden/20">
                <Star className="w-3 h-3 mr-1" />
                Tin cậy
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-navy">Chào mừng trở lại!</h2>
              <p className="text-gray-600">
                Đăng nhập để tiếp tục hành trình đầu tư của bạn
              </p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-lg hover:shadow-3xl transition-all duration-500">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-navy via-navy-light to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {step === 'credentials' && <User className="w-8 h-8 text-white" />}
                  {step === '2fa' && <Smartphone className="w-8 h-8 text-white" />}
                  {step === 'security-check' && <Shield className="w-8 h-8 text-white" />}
                </div>
              </div>
              
              <CardTitle className="text-2xl text-center font-bold text-navy">
                {step === 'credentials' && 'Thông tin đăng nhập'}
                {step === '2fa' && 'Xác thực 2 yếu tố'}
                {step === 'security-check' && 'Kiểm tra bảo mật'}
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                {step === 'credentials' && 'Nhập email/SĐT và mật khẩu để tiếp tục'}
                {step === '2fa' && 'Nhập mã 6 số từ ứng dụng xác thực của bạn'}
                {step === 'security-check' && 'Đang kiểm tra trạng thái KYC, STK và bảo mật'}
              </CardDescription>
            </CardHeader>
          
            <CardContent className="space-y-6 pt-2">
              {/* Step 1: Credentials */}
              {step === 'credentials' && (
                <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="emailOrPhone" className="text-sm font-medium text-navy">Email hoặc Số điện thoại</Label>
                    <div className="relative">
                      {formData.emailOrPhone.includes('@') ? (
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      ) : (
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      )}
                      <Input
                        id="emailOrPhone"
                        type="text"
                        placeholder="user@example.com hoặc 0901234567"
                        value={formData.emailOrPhone}
                        onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
                        className={cn("h-12 pl-10 border-2 border-muted focus:border-golden transition-all duration-300 bg-white/50", errors.emailOrPhone && "border-red-500")}
                      />
                    </div>
                    {errors.emailOrPhone && (
                      <p className="text-sm text-red-600">{errors.emailOrPhone}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-medium text-navy">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={cn("h-12 pl-10 pr-12 border-2 border-muted focus:border-golden transition-all duration-300 bg-white/50", errors.password && "border-red-500")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-golden/10 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input type="checkbox" className="rounded border-2 border-muted focus:ring-golden" />
                      <span className="text-muted-foreground group-hover:text-navy transition-colors">Ghi nhớ đăng nhập</span>
                    </label>
                    <a href="#" className="text-golden hover:text-golden-light transition-colors font-medium hover:underline">
                      Quên mật khẩu?
                    </a>
                  </div>

                  {errors.general && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.general}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-golden via-golden-light to-yellow-400 hover:from-golden-light hover:to-golden text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang xác thực...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Đăng nhập
                      </div>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: 2FA */}
              {step === '2fa' && (
                <form onSubmit={handle2FASubmit} className="space-y-6">
                  <div className="text-center space-y-6">
                    <div className="bg-navy/5 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground text-center leading-relaxed">
                        Mở ứng dụng xác thực của bạn (Google Authenticator, Authy, v.v.) và nhập mã 6 chữ số hiển thị
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <Label htmlFor="twoFACode" className="text-sm font-medium text-navy">Mã xác thực 2FA</Label>
                      <div className="relative">
                        <Input
                          id="twoFACode"
                          type="text"
                          placeholder="000000"
                          maxLength={6}
                          value={formData.twoFACode}
                          onChange={(e) => handleInputChange('twoFACode', e.target.value.replace(/\D/g, ''))}
                          className={cn("h-14 text-center text-2xl tracking-[0.5em] font-mono border-2 border-muted focus:border-navy transition-all duration-300 bg-white/50", errors.twoFACode && "border-red-500")}
                        />
                      </div>
                      {errors.twoFACode && (
                        <p className="text-sm text-red-600">{errors.twoFACode}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep('credentials')}
                      className="flex-1 h-12 border-2 hover:bg-muted/50 transition-all duration-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Quay lại
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-gradient-to-r from-navy via-navy-light to-blue-600 hover:from-navy-light hover:to-navy text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" 
                      disabled={isLoading || formData.twoFACode?.length !== 6}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Đang xác thực...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Xác nhận
                        </div>
                      )}
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button variant="link" size="sm">
                      <QrCode className="w-4 h-4 mr-2" />
                      Không có ứng dụng xác thực?
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 3: Security Check */}
              {step === 'security-check' && (
                <div className="space-y-8">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-golden rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-navy">Kiểm tra bảo mật hoàn tất</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Hệ thống đã xác thực thông tin của bạn
                      </p>
                    </div>
                  </div>

                  {/* Security Status */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <span className="font-medium text-green-800">Trạng thái KYC</span>
                      </div>
                      <Badge 
                        variant={securityStatus.kycStatus === 'verified' ? 'default' : 'secondary'}
                        className={securityStatus.kycStatus === 'verified' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {securityStatus.kycStatus === 'verified' ? 'Đã xác thực' : 'Chưa xác thực'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <span className="font-medium text-green-800">Tài khoản ngân hàng</span>
                      </div>
                      <Badge 
                        variant={securityStatus.bankAccountLinked ? 'default' : 'secondary'}
                        className={securityStatus.bankAccountLinked ? 'bg-green-100 text-green-800' : ''}
                      >
                        {securityStatus.bankAccountLinked ? 'Đã liên kết' : 'Chưa liên kết'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <span className="font-medium">Điểm bảo mật</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-semibold", getSecurityScoreColor(securityStatus.securityScore))}>
                          {securityStatus.securityScore}/100
                        </span>
                        <Badge className={getSecurityScoreBadge(securityStatus.securityScore).color}>
                          {getSecurityScoreBadge(securityStatus.securityScore).text}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {securityStatus.securityScore < 80 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Để tăng độ bảo mật, hãy cập nhật thông tin KYC và liên kết tài khoản ngân hàng trong phần Cài đặt.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    onClick={handleSecurityCheckComplete} 
                    className="w-full h-12 bg-gradient-to-r from-golden via-golden-light to-yellow-400 hover:from-golden-light hover:to-golden text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Tiếp tục vào ứng dụng
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 space-y-6">
            <Separator className="bg-gradient-to-r from-transparent via-muted to-transparent" />
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center gap-2 p-3 bg-navy/5 rounded-lg">
                <Shield className="w-5 h-5 text-navy" />
                <span className="text-navy font-medium">Bảo mật SSL</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-golden/5 rounded-lg">
                <CheckCircle className="w-5 h-5 text-golden" />
                <span className="text-golden font-medium">Xác thực 2FA</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Tin cậy</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản? {' '}
                <Button variant="link" className="p-0 h-auto font-semibold text-golden hover:text-golden-light">
                  Đăng ký ngay
                </Button>
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bằng việc đăng nhập, bạn đồng ý với {' '}
                  <Button variant="link" className="p-0 h-auto text-xs text-golden hover:text-golden-light font-medium hover:underline">
                    Điều khoản sử dụng
                  </Button>
                  {' '} và {' '}
                  <Button variant="link" className="p-0 h-auto text-xs text-golden hover:text-golden-light font-medium hover:underline">
                    Chính sách bảo mật
                  </Button>
                  {' '} của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;