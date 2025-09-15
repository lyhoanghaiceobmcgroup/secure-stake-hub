import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Plus, 
  BarChart3, 
  Wallet, 
  Users, 
  FileText, 
  Settings, 
  ArrowLeft,
  Search,
  Bell,
  User,
  ChevronDown,
  Sparkles,
  Star,
  Shield,
  Award,
  Home,
  TrendingUp,
  CreditCard,
  MessageCircle,
  Menu,
  X,
  Target,
  Briefcase,
  PieChart,
  Calendar,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const BusinessApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Trang chủ', 
      icon: Home, 
      description: 'Tổng quan doanh nghiệp',
      badge: null 
    },
    { 
      id: 'create-package', 
      label: 'Tạo gói góp vốn', 
      icon: Plus, 
      description: 'Khởi tạo dự án mới',
      badge: 'Hot' 
    },
    { 
      id: 'progress-tracking', 
      label: 'Theo dõi tiến độ', 
      icon: TrendingUp, 
      description: 'Quản lý dự án',
      badge: null 
    },
    { 
      id: 'transactions', 
      label: 'Giao dịch & Đối soát', 
      icon: CreditCard, 
      description: 'Tài chính doanh nghiệp',
      badge: null 
    },
    { 
      id: 'community', 
      label: 'Tương tác cộng đồng', 
      icon: Users, 
      description: 'Kết nối nhà đầu tư',
      badge: null 
    },
    { 
      id: 'documents', 
      label: 'Tài liệu pháp lý', 
      icon: FileText, 
      description: 'Quản lý hồ sơ',
      badge: null 
    },
    { 
      id: 'settings', 
      label: 'Cài đặt', 
      icon: Settings, 
      description: 'Quản lý tài khoản',
      badge: null 
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-navy/10 via-navy-light/10 to-golden/5 border-navy/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-golden/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <CardContent className="p-8 relative">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-navy mb-2">Chào mừng đến với GoldenBook Business</h1>
                    <p className="text-muted-foreground text-lg">
                      Nền tảng huy động vốn minh bạch từ cộng đồng nhà đầu tư. Tạo gói góp vốn và quản lý tiến độ dự án.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      <Shield className="w-3 h-3 mr-1" />
                      Đã xác thực
                    </Badge>
                    <Badge variant="secondary" className="bg-golden/10 text-golden border-golden/20">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-gradient-to-r from-navy to-navy-light hover:from-navy-light hover:to-navy">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo gói góp vốn đầu tiên
                  </Button>
                  <Button variant="outline" className="border-navy/20 hover:bg-navy/5">
                    <FileText className="w-4 h-4 mr-2" />
                    Tìm hiểu về quy trình
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-navy" />
                  </div>
                  <div className="text-2xl font-bold text-navy mb-1">0</div>
                  <div className="text-sm text-muted-foreground">Số gói đang mở</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-golden/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Wallet className="w-6 h-6 text-golden" />
                  </div>
                  <div className="text-2xl font-bold text-golden mb-1">0 VNĐ</div>
                  <div className="text-sm text-muted-foreground">Tổng vốn đã huy động</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">0%</div>
                  <div className="text-sm text-muted-foreground">Tỷ lệ cập nhật đúng hạn</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <PieChart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                  <div className="text-sm text-muted-foreground">Tổng số phân phối đã thực hiện</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-golden" />
                  Tiện ích nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col gap-3 hover:bg-navy/5 hover:border-navy/30 transition-all duration-300 hover:scale-105"
                    onClick={() => setActiveTab('create-package')}
                  >
                    <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6 text-navy" />
                    </div>
                    <span className="font-medium">Tạo gói mới</span>
                    <span className="text-xs text-muted-foreground">Khởi tạo dự án huy động vốn</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col gap-3 hover:bg-golden/5 hover:border-golden/30 transition-all duration-300 hover:scale-105"
                    onClick={() => setActiveTab('progress-tracking')}
                  >
                    <div className="w-12 h-12 bg-golden/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-golden" />
                    </div>
                    <span className="font-medium">Cập nhật tiến độ</span>
                    <span className="text-xs text-muted-foreground">Báo cáo tiến độ dự án</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col gap-3 hover:bg-green-50 hover:border-green-200 transition-all duration-300 hover:scale-105"
                    onClick={() => setActiveTab('documents')}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="font-medium">Tải báo cáo phân phối</span>
                    <span className="text-xs text-muted-foreground">Xuất báo cáo chi tiết</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-navy" />
                  Bắt đầu huy động vốn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-navy/50 transition-all duration-300 hover:shadow-md cursor-pointer">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-16 h-16 bg-navy/10 rounded-2xl mx-auto flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-navy" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-navy">Hoàn thiện hồ sơ pháp nhân</h3>
                        <p className="text-sm text-muted-foreground">Cung cấp thông tin doanh nghiệp và giấy tờ pháp lý</p>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-navy/5">
                        <Shield className="w-4 h-4 mr-2" />
                        Cập nhật hồ sơ
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-golden/50 transition-all duration-300 hover:shadow-md cursor-pointer">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-16 h-16 bg-golden/10 rounded-2xl mx-auto flex items-center justify-center">
                        <FileText className="w-8 h-8 text-golden" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-navy">Chuẩn bị tài liệu dự án</h3>
                        <p className="text-sm text-muted-foreground">Kế hoạch kinh doanh, báo cáo tài chính</p>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-golden/5">
                        <Calendar className="w-4 h-4 mr-2" />
                        Tải tài liệu
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-20 h-20 bg-muted/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-medium text-navy mb-2">Chưa có hoạt động nào</h3>
                  <p className="text-sm">Hãy tạo gói góp vốn đầu tiên của bạn!</p>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-navy to-navy-light hover:from-navy-light hover:to-navy"
                    onClick={() => setActiveTab('create-package')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Bắt đầu ngay
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Notice */}
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 text-lg font-bold">!</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-amber-800 mb-2 text-base">Lưu ý tuân thủ pháp lý</p>
                    <p className="text-amber-700 leading-relaxed">
                      Mọi gói góp vốn phải tuân thủ quy định pháp luật về huy động vốn. 
                      Sử dụng ngôn ngữ "phân phối lợi ích mục tiêu" thay vì "cam kết lãi".
                    </p>
                    <Button variant="outline" size="sm" className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Tìm hiểu thêm
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-navy mb-4">
              {navigationItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-muted-foreground mb-6">
              {navigationItems.find(item => item.id === activeTab)?.description}
            </p>
            <div className="w-20 h-20 bg-muted/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
               {(() => {
                 const activeItem = navigationItems.find(item => item.id === activeTab);
                 if (activeItem?.icon) {
                   const Icon = activeItem.icon;
                   return <Icon className="w-10 h-10 text-muted-foreground/50" />;
                 }
                 return null;
               })()}
            </div>
            <p className="text-sm text-muted-foreground">Tính năng đang được phát triển...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-muted/20" 
          : "bg-white/80 backdrop-blur-sm border-b border-muted/10"
      )}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hidden lg:flex hover:scale-105 transition-all duration-300 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Quay lại
                </Button>
              </Link>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:scale-105 transition-all duration-300"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-navy via-navy-light to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">GB</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-navy">GoldenBook</h1>
                  <p className="text-xs text-muted-foreground -mt-1">Business Portal</p>
                </div>
                <Badge variant="secondary" className="bg-navy/10 text-navy border-navy/20 hidden md:flex">
                  <Building2 className="w-3 h-3 mr-1" />
                  Doanh nghiệp
                </Badge>
              </div>
            </div>
            
            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu, dự án..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-muted/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative hover:scale-105 transition-all duration-300">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </span>
              </Button>
              
              {/* User Menu */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 hover:scale-105 transition-all duration-300"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-golden to-golden-light rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block font-medium">Công ty ABC</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showUserMenu && "rotate-180")} />
                </Button>
                
                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-muted/20 py-2 z-50">
                    <div className="px-4 py-3 border-b border-muted/20">
                      <p className="font-semibold text-navy">Công ty ABC</p>
                      <p className="text-sm text-muted-foreground">business@goldenbook.vn</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          <Shield className="w-3 h-3 mr-1" />
                          Đã xác thực
                        </Badge>
                        <Badge variant="secondary" className="bg-navy/10 text-navy border-navy/20">
                          <Award className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    </div>
                    <div className="py-2">
                      <Button variant="ghost" className="w-full justify-start px-4 py-2" onClick={() => setActiveTab('settings')}>
                        <Settings className="w-4 h-4 mr-3" />
                        Cài đặt doanh nghiệp
                      </Button>
                      <Button variant="ghost" className="w-full justify-start px-4 py-2">
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Trung tâm trợ giúp
                      </Button>
                      <div className="border-t border-muted/20 mt-2 pt-2">
                        <Button variant="ghost" className="w-full justify-start px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <ArrowLeft className="w-4 h-4 mr-3" />
                          Đăng xuất
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 bg-white/80 backdrop-blur-sm border-r border-muted/20 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
          <div className="p-6">
            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-auto p-4 transition-all duration-300 hover:scale-105",
                      activeTab === item.id 
                        ? "bg-gradient-to-r from-navy to-navy-light text-white shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                        activeTab === item.id 
                          ? "bg-white/20" 
                          : "bg-muted/30"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          activeTab === item.id ? "text-white" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={cn(
                          "font-medium text-sm",
                          activeTab === item.id ? "text-white" : "text-foreground"
                        )}>
                          {item.label}
                        </div>
                        <div className={cn(
                          "text-xs",
                          activeTab === item.id ? "text-white/70" : "text-muted-foreground"
                        )}>
                          {item.description}
                        </div>
                      </div>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-xs",
                            activeTab === item.id 
                              ? "bg-white/20 text-white border-white/30" 
                              : "bg-red-100 text-red-700 border-red-200"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                );
              })}
            </nav>

            {/* Premium Upgrade Section */}
            <div className="mt-8 p-4 bg-gradient-to-br from-golden/10 to-golden/5 rounded-xl border border-golden/20">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-golden/20 rounded-xl mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-golden" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy text-sm">Nâng cấp Premium</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mở khóa tính năng cao cấp và báo cáo chi tiết
                  </p>
                </div>
                <Button size="sm" className="w-full bg-gradient-to-r from-golden to-golden-light hover:from-golden-light hover:to-golden text-white">
                  <Star className="w-4 h-4 mr-2" />
                  Nâng cấp ngay
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <aside className="relative w-80 bg-white shadow-2xl h-full overflow-y-auto">
              <div className="p-6">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-navy via-navy-light to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">GB</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-navy">GoldenBook</h2>
                      <p className="text-xs text-muted-foreground">Business Portal</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start h-auto p-4 transition-all duration-300",
                          activeTab === item.id 
                            ? "bg-gradient-to-r from-navy to-navy-light text-white" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            activeTab === item.id 
                              ? "bg-white/20" 
                              : "bg-muted/30"
                          )}>
                            <Icon className={cn(
                              "w-5 h-5",
                              activeTab === item.id ? "text-white" : "text-muted-foreground"
                            )} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className={cn(
                              "font-medium text-sm",
                              activeTab === item.id ? "text-white" : "text-foreground"
                            )}>
                              {item.label}
                            </div>
                            <div className={cn(
                              "text-xs",
                              activeTab === item.id ? "text-white/70" : "text-muted-foreground"
                            )}>
                              {item.description}
                            </div>
                          </div>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-xs",
                                activeTab === item.id 
                                  ? "bg-white/20 text-white border-white/30" 
                                  : "bg-red-100 text-red-700 border-red-200"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </nav>

                {/* Mobile Premium Section */}
                <div className="mt-8 p-4 bg-gradient-to-br from-golden/10 to-golden/5 rounded-xl border border-golden/20">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-golden/20 rounded-xl mx-auto flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-golden" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy text-sm">Nâng cấp Premium</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mở khóa tính năng cao cấp
                      </p>
                    </div>
                    <Button size="sm" className="w-full bg-gradient-to-r from-golden to-golden-light hover:from-golden-light hover:to-golden text-white">
                      <Star className="w-4 h-4 mr-2" />
                      Nâng cấp ngay
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessApp;