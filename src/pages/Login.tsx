import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/investor');
    }
  }, [user, loading, navigate]);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCredentials = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCredentials()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData.email, formData.password);
        if (!result.error) {
          setErrors({ success: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.' });
          setIsSignUp(false);
        }
      } else {
        result = await signIn(formData.email, formData.password);
        if (!result.error) {
          navigate('/investor');
        }
      }
      
      if (result.error) {
        if (result.error.message === 'Invalid login credentials') {
          setErrors({ general: 'Email hoặc mật khẩu không đúng' });
        } else if (result.error.message === 'User already registered') {
          setErrors({ general: 'Email đã được đăng ký' });
        } else {
          setErrors({ general: result.error.message });
        }
      }
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-golden/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-golden/30 border-t-golden rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

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
              <h2 className="text-xl font-semibold text-navy">
                {isSignUp ? 'Tạo tài khoản mới' : 'Chào mừng trở lại!'}
              </h2>
              <p className="text-gray-600">
                {isSignUp ? 'Đăng ký để bắt đầu hành trình đầu tư' : 'Đăng nhập để tiếp tục hành trình đầu tư của bạn'}
              </p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-lg hover:shadow-3xl transition-all duration-500">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-navy via-navy-light to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <CardTitle className="text-2xl text-center font-bold text-navy">
                {isSignUp ? 'Đăng ký tài khoản' : 'Đăng nhập'}
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                {isSignUp ? 'Nhập thông tin để tạo tài khoản mới' : 'Nhập email và mật khẩu để tiếp tục'}
              </CardDescription>
            </CardHeader>
          
            <CardContent className="space-y-6 pt-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-navy">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={cn("h-12 pl-10 border-2 border-muted focus:border-golden transition-all duration-300 bg-white/50", errors.email && "border-red-500")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
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

                {!isSignUp && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input type="checkbox" className="rounded border-2 border-muted focus:ring-golden" />
                      <span className="text-muted-foreground group-hover:text-navy transition-colors">Ghi nhớ đăng nhập</span>
                    </label>
                    <a href="#" className="text-golden hover:text-golden-light transition-colors font-medium hover:underline">
                      Quên mật khẩu?
                    </a>
                  </div>
                )}

                {errors.general && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                {errors.success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">{errors.success}</AlertDescription>
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
                      {isSignUp ? 'Đang đăng ký...' : 'Đang đăng nhập...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setErrors({});
                    }}
                    className="text-navy hover:text-golden transition-colors"
                  >
                    {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;