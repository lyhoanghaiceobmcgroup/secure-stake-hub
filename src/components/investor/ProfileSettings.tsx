import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import KYCUpload from "./KYCUpload";
import DocumentsContracts from "./DocumentsContracts";
import OffersReinvest from "./OffersReinvest";
import CommunityHub from "./CommunityHub";
import {
  User,
  Shield,
  Bell,
  Globe,
  Eye,
  Download,
  Trash2,
  Smartphone,
  Laptop,
  Eye as EyeOff,
  CheckCircle,
  AlertCircle,
  XCircle,
  QrCode,
  FileText,
  Camera,
  Edit,
  Settings,
  LogOut,
  Pause,
  Archive,
  History,
  KeyRound,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Fingerprint,
  Languages,
  SunMoon,
  Accessibility,
  Gift,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    payout: { email: true, app: true, sms: false },
    progress: { email: true, app: true, sms: false },
    wallet: { email: true, app: true, sms: true },
    contract: { email: true, app: true, sms: false },
    security: { email: true, app: true, sms: true },
    offers: { email: false, app: true, sms: false }
  });
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [address, setAddress] = useState("123 Nguyễn Huệ, Q1, TP.HCM");

  // Mock user data
  const userProfile = {
    fullName: "Nguyễn Văn A",
    email: "user@example.com",
    emailVerified: true,
    phone: "09•••1234",
    phoneVerified: true,
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
    idNumber: "079•••••123",
    dateOfBirth: "01/01/1990",
    kycStatus: "verified",
    kycDate: "02/09/2025 14:20",
    kycHash: "#e2f...9a",
    avatar: null
  };

  const bankAccounts = [
    {
      id: 1,
      bankName: "Vietcombank",
      accountMasked: "••1234",
      holderName: "NGUYEN VAN A",
      isPrimary: true,
      verifiedAt: "01/09/2025",
      proofHash: "#4a9...c8"
    },
    {
      id: 2,
      bankName: "VPBank",
      accountMasked: "••9981",
      holderName: "NGUYEN VAN A",
      isPrimary: false,
      verifiedAt: "15/08/2025",
      proofHash: "#7bf...d1"
    }
  ];

  const trustedDevices = [
    {
      id: 1,
      name: "iPhone 14",
      os: "iOS 18",
      lastAccess: "02/09 10:02",
      isCurrent: true,
      trusted: true
    },
    {
      id: 2,
      name: "Laptop-GB-01",
      os: "Windows 11",
      lastAccess: "01/09 21:31",
      isCurrent: false,
      trusted: true
    },
    {
      id: 3,
      name: "Chrome-Mac",
      os: "macOS 14",
      lastAccess: "28/08 08:12",
      isCurrent: false,
      trusted: false
    }
  ];

  const auditEvents = [
    {
      id: 1,
      type: "KYCVerified",
      description: "Xác thực KYC thành công",
      timestamp: "02/09/2025 14:20",
      hash: "#e2f...9a",
      actor: "System"
    },
    {
      id: 2,
      type: "TwoFAEnabled",
      description: "Bật xác thực 2 yếu tố",
      timestamp: "01/09/2025 09:15",
      hash: "#d91...fa",
      actor: "User"
    },
    {
      id: 3,
      type: "BankAccountSetPrimary",
      description: "Đặt tài khoản Vietcombank làm chính",
      timestamp: "01/09/2025 08:30",
      hash: "#7bf...d1",
      actor: "User"
    }
  ];

  const getKYCStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Đã xác thực</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Đang thẩm định</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cần cập nhật</Badge>;
      default:
        return <Badge variant="outline">Chưa gửi</Badge>;
    }
  };

  const getDeviceIcon = (os: string) => {
    if (os.includes('iOS') || os.includes('iPhone')) return <Smartphone className="w-4 h-4" />;
    if (os.includes('Android')) return <Smartphone className="w-4 h-4" />;
    return <Laptop className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-xl border">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="w-20 h-20 shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-golden to-golden-light text-white text-2xl font-bold">
                {userProfile.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-navy">Hồ sơ & Cài đặt</h1>
              <p className="text-muted-foreground">{userProfile.fullName} • {userProfile.email}</p>
              <div className="flex flex-wrap items-center gap-2">
                {getKYCStatusBadge(userProfile.kycStatus)}
                {twoFAEnabled && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Shield className="w-3 h-3 mr-1" />
                    2FA Bật
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setAccessibilityMode(!accessibilityMode)}>
              <Accessibility className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{accessibilityMode ? 'Tắt' : 'Bật'} Dễ hiểu</span>
              <span className="sm:hidden">{accessibilityMode ? 'Tắt' : 'Bật'}</span>
            </Button>
            <Button variant="outline" size="sm">
              <Languages className="w-4 h-4 mr-2" />
              VI
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">KYC</h3>
                <p className="text-sm font-medium text-muted-foreground">Đã xác thực</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">2FA</h3>
                <p className="text-sm font-medium text-muted-foreground">Đang bật</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-purple-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">Ngân hàng</h3>
                <p className="text-sm font-medium text-muted-foreground">2 tài khoản</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-orange-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">Thiết bị</h3>
                <p className="text-sm font-medium text-muted-foreground">2 tin cậy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Navigation Tabs - Responsive Layout */}
        <div className="space-y-4">
          {/* Primary Navigation - Always Visible */}
          <TabsList className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg h-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <User className="w-4 h-4" />
              <span>Hồ sơ</span>
            </TabsTrigger>
            <TabsTrigger value="banks" className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CreditCard className="w-4 h-4" />
              <span>Ngân hàng</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Shield className="w-4 h-4" />
              <span>Bảo mật</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Tài liệu</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
          </TabsList>

          {/* Secondary Navigation - Grouped */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 h-auto bg-transparent p-0">
            <TabsTrigger value="offers" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Ưu đãi</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Cộng đồng</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">Thông báo</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Tuỳ chọn</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Riêng tư</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Xuất dữ liệu</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Archive className="w-4 h-4" />
              <span className="text-sm font-medium">Tài khoản</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Accessibility className="w-4 h-4" />
              <span className="text-sm font-medium">Dễ hiểu</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">Nhật ký</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-primary" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Họ và tên</Label>
                    <Input value={userProfile.fullName} readOnly className="bg-muted/30" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Ngày sinh</Label>
                    <Input value={userProfile.dateOfBirth} readOnly className="bg-muted/30" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <div className="flex gap-3">
                    <Input value={userProfile.email} readOnly className="flex-1 bg-muted/30" />
                    {userProfile.emailVerified && (
                      <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã xác minh
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Số điện thoại</Label>
                  <div className="flex gap-3">
                    <Input value={userProfile.phone} readOnly className="flex-1 bg-muted/30" />
                    {userProfile.phoneVerified && (
                      <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã xác minh
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Địa chỉ</Label>
                  <Input 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">CCCD/CMND</Label>
                  <Input value={userProfile.idNumber} readOnly className="bg-muted/30" />
                </div>
                
                <div className="pt-4">
                  <Button className="w-full sm:w-auto">
                    <Edit className="w-4 h-4 mr-2" />
                    Cập nhật thông tin
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <KYCUpload />
          </div>
        </TabsContent>

        {/* Banks Tab */}
        <TabsContent value="banks" className="space-y-8">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="w-5 h-5 text-primary" />
                Tài khoản ngân hàng nhận phân phối
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{account.bankName}</h4>
                          <p className="text-sm text-muted-foreground font-medium">
                            {account.accountMasked} • {account.holderName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {account.isPrimary && (
                          <Badge className="bg-green-500 hover:bg-green-600">Chính</Badge>
                        )}
                        <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">Đã xác minh</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium">Xác minh: {account.verifiedAt}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs">Hash: {account.proofHash}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {!account.isPrimary && (
                        <Button variant="outline" size="sm">
                          Đặt làm chính
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4">
                  <Button className="w-full sm:w-auto" size="lg">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Thêm tài khoản ngân hàng
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="w-5 h-5 text-primary" />
                  Mật khẩu & Xác thực
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border">
                    <div>
                      <h4 className="font-bold text-lg">Mật khẩu</h4>
                      <p className="text-sm text-muted-foreground font-medium">
                        Cập nhật lần cuối: 01/09/2025
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <KeyRound className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border">
                    <div>
                      <h4 className="font-bold text-lg">Xác thực 2 yếu tố (2FA)</h4>
                      <p className="text-sm text-muted-foreground font-medium">
                        TOTP App • Recovery codes: 8/10
                      </p>
                    </div>
                    <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
                  </div>
                  
                  {twoFAEnabled && (
                    <div className="ml-4 space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Button variant="ghost" size="sm" className="justify-start">
                        <QrCode className="w-4 h-4 mr-2" />
                        Xem QR Code
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Recovery Codes
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Thiết bị & Phiên đăng nhập
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trustedDevices.map((device) => (
                    <div key={device.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getDeviceIcon(device.os)}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg flex items-center gap-2">
                            {device.name}
                            {device.isCurrent && (
                              <Badge variant="outline" className="text-xs bg-blue-50 border-blue-500 text-blue-600">
                                Hiện tại
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground font-medium">
                            {device.os} • {device.lastAccess}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {device.trusted ? (
                          <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                            Tin cậy
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">
                            Không tin cậy
                          </Badge>
                        )}
                        {!device.isCurrent && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <LogOut className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="destructive" size="sm" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Thu hồi tất cả phiên
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-8">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bell className="w-5 h-5 text-primary" />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Object.entries(notificationSettings).map(([key, settings]) => (
                  <div key={key} className="space-y-4 p-6 bg-white rounded-xl border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          {key === 'payout' && <><Gift className="w-5 h-5 text-green-600" />Kỳ phân phối</>}
                          {key === 'progress' && <><Clock className="w-5 h-5 text-blue-600" />Cập nhật tiến độ DN</>}
                          {key === 'wallet' && <><CreditCard className="w-5 h-5 text-purple-600" />Giao dịch ví</>}
                          {key === 'contract' && <><FileText className="w-5 h-5 text-orange-600" />eSign & Hợp đồng</>}
                          {key === 'security' && <><Shield className="w-5 h-5 text-red-600" />Bảo mật (bắt buộc)</>}
                          {key === 'offers' && <><Gift className="w-5 h-5 text-indigo-600" />Ưu đãi & Tái đầu tư</>}
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium mt-1">
                          {key === 'security' ? 'Không thể tắt vì lý do bảo mật' : 'Chọn kênh nhận thông báo'}
                        </p>
                      </div>
                      {key === 'security' && (
                        <Badge variant="outline" className="bg-red-50 border-red-500 text-red-600">
                          Bắt buộc
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <Label htmlFor={`${key}-email`} className="flex items-center gap-2 font-medium">
                          <Mail className="w-4 h-4" />
                          Email
                        </Label>
                        <Switch
                          id={`${key}-email`}
                          checked={settings.email}
                          disabled={key === 'security'}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({
                              ...prev,
                              [key]: { ...prev[key], email: checked }
                            }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <Label htmlFor={`${key}-app`} className="flex items-center gap-2 font-medium">
                          <Smartphone className="w-4 h-4" />
                          In-app
                        </Label>
                        <Switch
                          id={`${key}-app`}
                          checked={settings.app}
                          disabled={key === 'security'}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({
                              ...prev,
                              [key]: { ...prev[key], app: checked }
                            }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <Label htmlFor={`${key}-sms`} className="flex items-center gap-2 font-medium">
                          <Phone className="w-4 h-4" />
                          SMS
                        </Label>
                        <Switch
                          id={`${key}-sms`}
                          checked={settings.sms}
                          disabled={key === 'security'}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({
                              ...prev,
                              [key]: { ...prev[key], sms: checked }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Tần suất gửi
                  </h4>
                  <Select defaultValue="instant">
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Tức thì</SelectItem>
                      <SelectItem value="daily">Gộp hàng ngày</SelectItem>
                      <SelectItem value="weekly">Gộp hàng tuần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Languages className="w-5 h-5 text-primary" />
                  Ngôn ngữ & Khu vực
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-bold text-base flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Ngôn ngữ
                  </Label>
                  <Select defaultValue="vi">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="font-bold text-base flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Múi giờ
                  </Label>
                  <Select defaultValue="asia-bangkok">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="asia-ho-chi-minh">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="font-bold text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Định dạng tiền tệ
                  </Label>
                  <Select defaultValue="vnd">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vnd">VND (123.456.789đ)</SelectItem>
                      <SelectItem value="vnd-space">VND (123,456,789 VND)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <SunMoon className="w-5 h-5 text-primary" />
                  Giao diện
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <Label className="font-bold text-base flex items-center gap-2">
                      <SunMoon className="w-4 h-4" />
                      Chế độ tối
                    </Label>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Tự động theo hệ thống</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <Label className="font-bold text-base flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Ẩn số dư khi trình chiếu
                    </Label>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Bảo vệ thông tin cá nhân</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <Label className="font-bold text-base flex items-center gap-2">
                      <Accessibility className="w-4 h-4" />
                      Giao diện Dễ hiểu
                    </Label>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Font lớn, tương phản cao</p>
                  </div>
                  <Switch checked={accessibilityMode} onCheckedChange={setAccessibilityMode} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-8">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="w-5 h-5 text-primary" />
                Quyền riêng tư & Chia sẻ dữ liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-bold text-base flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Cho phép DN xem thông tin cơ bản
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      Tên, email, số điện thoại (tối thiểu theo hợp đồng)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-50 border-gray-500 text-gray-600">
                      Bắt buộc
                    </Badge>
                    <Switch defaultChecked disabled />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-bold text-base flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Nhận thông tin ưu đãi
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      Từ GoldenBook và các đối tác
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-bold text-base flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Chia sẻ dữ liệu phân tích
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      Giúp cải thiện sản phẩm (ẩn danh)
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Chia sẻ an toàn
                </h4>
                <p className="text-sm text-muted-foreground font-medium">
                  Tạo link tạm thời để chia sẻ báo cáo/sao kê với kế toán
                </p>
                
                <div className="space-y-3">
                  <Label className="font-bold text-base">Link đang hoạt động (0)</Label>
                  <div className="border border-gray-300 rounded-lg p-6 text-center text-muted-foreground bg-white">
                    Chưa có link chia sẻ nào
                  </div>
                </div>
                
                <Button variant="outline" className="bg-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Tạo link chia sẻ
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-8">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Download className="w-5 h-5 text-primary" />
                Xuất dữ liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-lg text-blue-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Gói dữ liệu cá nhân
                </h4>
                <p className="text-sm text-blue-700 mb-6 font-medium">
                  Bao gồm: Hồ sơ KYC, Hợp đồng eSign, Phụ lục, Bảng phân phối, Sao kê ví, Báo cáo
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" size="sm" className="bg-white border-blue-300 hover:bg-blue-100">
                    <Download className="w-4 h-4 mr-2" />
                    Tháng này
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white border-blue-300 hover:bg-blue-100">
                    <Download className="w-4 h-4 mr-2" />
                    Quý này
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white border-blue-300 hover:bg-blue-100">
                    <Download className="w-4 h-4 mr-2" />
                    Năm này
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Lịch sử xuất gần đây
                </h4>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow duration-200">
                    <div>
                      <h5 className="font-bold text-base">Gói dữ liệu Q3/2025</h5>
                      <p className="text-sm text-muted-foreground font-medium mt-1">
                        Tạo: 01/09/2025 • Hash: #a91...c7
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                        Sẵn sàng
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h4 className="font-bold text-lg text-amber-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Lưu ý quan trọng
                </h4>
                <ul className="text-sm text-amber-700 space-y-2 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    Yêu cầu xác thực 2FA trước khi tải
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    File ZIP có chữ ký số và DocHash
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    Link tải có hiệu lực 48 giờ
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    Không chia sẻ link với người khác
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Archive className="w-5 h-5 text-primary" />
                  Bảo lưu tài khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h4 className="font-bold text-lg text-orange-800 mb-3 flex items-center gap-2">
                    <Pause className="w-5 h-5" />
                    Tạm khoá tài khoản
                  </h4>
                  <p className="text-sm text-orange-700 mb-6 font-medium">
                    Khoá đăng nhập/rút/chuyển nhượng, vẫn xem được tài liệu
                  </p>
                  <Button variant="outline" size="sm" className="bg-white border-orange-300 hover:bg-orange-100">
                    <Pause className="w-4 h-4 mr-2" />
                    Bảo lưu tài khoản
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-4">
                  <h5 className="font-bold text-base text-gray-700">Khi bảo lưu:</h5>
                  <ul className="space-y-2 ml-0">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      Không thể đăng nhập
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      Không thể rút tiền
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      Không thể chuyển nhượng CQĐĐT
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      Vẫn nhận phân phối (nếu có)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      Có thể khôi phục trong 90 ngày
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  Đóng tài khoản vĩnh viễn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="font-bold text-lg text-red-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Xoá tài khoản
                  </h4>
                  <p className="text-sm text-red-700 mb-6 font-medium">
                    Chỉ khả dụng khi không còn CQĐĐT đang hoạt động
                  </p>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Đóng tài khoản
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận đóng tài khoản</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xoá vĩnh viễn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                          Đóng tài khoản
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-4">
                  <h5 className="font-bold text-base text-red-600">Điều kiện đóng tài khoản:</h5>
                  <ul className="space-y-2 ml-0">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">❌</span>
                      Không còn CQĐĐT đang hoạt động
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">❌</span>
                      Không còn công nợ
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">❌</span>
                      Số dư ví = 0
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✅</span>
                      Đã tải xuất dữ liệu
                    </li>
                  </ul>
                  
                  <p className="text-sm text-red-600 mt-4 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                    Hiện tại bạn còn 2 CQĐĐT đang hoạt động
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="space-y-8">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Accessibility className="w-5 h-5 text-primary" />
                Giao diện Dễ hiểu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-lg text-blue-800 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  4 tính năng chính
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" size="lg" className="h-24 flex-col bg-white border-blue-300 hover:bg-blue-100 transition-colors">
                    <User className="w-8 h-8 mb-2 text-blue-600" />
                    <span className="font-medium">Cập nhật KYC</span>
                  </Button>
                  <Button variant="outline" size="lg" className="h-24 flex-col bg-white border-blue-300 hover:bg-blue-100 transition-colors">
                    <Shield className="w-8 h-8 mb-2 text-blue-600" />
                    <span className="font-medium">Bật 2FA</span>
                  </Button>
                  <Button variant="outline" size="lg" className="h-24 flex-col bg-white border-blue-300 hover:bg-blue-100 transition-colors">
                    <CreditCard className="w-8 h-8 mb-2 text-blue-600" />
                    <span className="font-medium">Đổi STK</span>
                  </Button>
                  <Button variant="outline" size="lg" className="h-24 flex-col bg-white border-blue-300 hover:bg-blue-100 transition-colors">
                    <Download className="w-8 h-8 mb-2 text-blue-600" />
                    <span className="font-medium">Xuất dữ liệu</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Cài đặt hiển thị
                </h4>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white">
                    <div>
                      <Label className="font-bold text-base">Font lớn</Label>
                      <p className="text-sm text-muted-foreground font-medium mt-1">Tăng kích thước chữ 120%</p>
                    </div>
                    <Switch checked={accessibilityMode} onCheckedChange={setAccessibilityMode} />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white">
                    <div>
                      <Label className="font-bold text-base">Tương phản cao</Label>
                      <p className="text-sm text-muted-foreground font-medium mt-1">Màu sắc rõ ràng hơn</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white">
                    <div>
                      <Label className="font-bold text-base">Giảm hiệu ứng động</Label>
                      <p className="text-sm text-muted-foreground font-medium mt-1">Tắt animation</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-bold text-lg text-green-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Hướng dẫn video
                </h4>
                <p className="text-sm text-green-700 mb-6 font-medium">
                  Video hướng dẫn 60 giây sử dụng GoldenBook
                </p>
                <Button variant="outline" size="sm" className="bg-white border-green-300 hover:bg-green-100">
                  <FileText className="w-4 h-4 mr-2" />
                  Xem hướng dẫn
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents & Contracts Tab */}
        <TabsContent value="documents" className="space-y-6">
          <DocumentsContracts />
        </TabsContent>

        {/* Offers & Reinvestment Tab */}
        <TabsContent value="offers" className="space-y-6">
          <OffersReinvest />
        </TabsContent>

        {/* Community Hub Tab */}
        <TabsContent value="community" className="space-y-6">
          <CommunityHub />
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-8">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <History className="w-5 h-5 text-primary" />
                Nhật ký xác thực blockchain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {auditEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <h4 className="font-bold text-base">{event.description}</h4>
                        <p className="text-sm text-muted-foreground font-medium mt-1">
                          {event.timestamp} • Bởi: {event.actor}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 border-blue-300 text-blue-700">
                        {event.type}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Hash:</span>
                        <code className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg font-mono border">
                          {event.hash}
                        </code>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <QrCode className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Shield className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legal Disclaimer */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Tuyên bố pháp lý:</strong> Thông tin "tỷ suất phân phối mục tiêu" do Doanh nghiệp công bố; 
            phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế. GoldenBook không cam kết lợi nhuận cố định 
            và không phải sàn chứng khoán. Cơ chế xác thực blockchain dùng để kiểm chứng tài liệu/giao dịch; 
            không phát hành tài sản số.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;