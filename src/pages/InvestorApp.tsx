import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Wallet, 
  BookOpen, 
  FileText, 
  Gift, 
  Settings, 
  ArrowLeft,
  Users,
  HelpCircle,
  Menu,
  X,
  Bell,
  User,
  Search,
  ChevronDown,
  Sparkles,
  Star,
  Shield,
  Award,
  Home,
  PieChart,
  CreditCard,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Dashboard from "@/components/investor/Dashboard";
import OpportunityExplorer from "@/components/investor/OpportunityExplorer";
import WalletTransactions from "@/components/investor/WalletTransactions";
import Portfolio from "@/components/investor/Portfolio";
import Support24_7 from "@/components/investor/Support24_7";
import ProfileSettings from "@/components/investor/ProfileSettings";
import ProgressWidget from "@/components/investor/ProgressWidget";
import AuctionApp from "./AuctionApp";
import { ProgressProfile } from "@/types/data-schema";

const InvestorApp = () => {
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

  // Listen for navigation events
  useEffect(() => {
    const handleNavigateToPortfolio = () => {
      setActiveTab('portfolio');
    };

    window.addEventListener('navigate-to-portfolio', handleNavigateToPortfolio);
    
    return () => {
      window.removeEventListener('navigate-to-portfolio', handleNavigateToPortfolio);
    };
  }, []);

  // Mock progress profile data
  const mockProgressProfile: ProgressProfile = {
    kycStatus: 'verified',
    bankPrimary: true,
    twoFA: {
      enabled: false
    },
    wallet: {
      available: 4000000000,
      held: 5000000,
      total: 4005000000
    },
    riskAcknowledgedAt: '2025-01-15T10:30:00Z',
    intentDraft: {
      gid: 'AQ-A',
      amount: 20000000,
      id: 'INT-8821',
      expiresAt: '2025-01-16T10:30:00Z'
    },
    contract: {
      status: 'signed_investor',
      id: 'CT-5521',
      signedAt: '2025-01-15T14:20:00Z'
    },
    certificate: {
      status: 'pending',
      cqid: 'AQ-2214'
    }
  };

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Trang chủ', 
      icon: Home, 
      description: 'Tổng quan tài khoản',
      badge: null 
    },
    { 
      id: 'opportunities', 
      label: 'Khám phá cơ hội', 
      icon: BookOpen, 
      description: 'Tìm kiếm đầu tư',
      badge: 'Mới' 
    },
    { 
      id: 'auction', 
      label: 'Đấu giá quyền lợi', 
      icon: TrendingUp, 
      description: 'Đấu giá phân phối',
      badge: 'Hot' 
    },
    { 
      id: 'portfolio', 
      label: 'Sổ của tôi', 
      icon: PieChart, 
      description: 'Quản lý đầu tư',
      badge: null 
    },
    { 
      id: 'wallet', 
      label: 'Ví & Giao dịch', 
      icon: CreditCard, 
      description: 'Tài chính cá nhân',
      badge: null 
    },
    { 
      id: 'support', 
      label: 'Hỗ trợ 24/7', 
      icon: MessageCircle, 
      description: 'Trợ giúp khách hàng',
      badge: null 
    },
    { 
      id: 'settings', 
      label: 'Hồ sơ & Cài đặt', 
      icon: Settings, 
      description: 'Quản lý tài khoản',
      badge: null 
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'opportunities':
        return <OpportunityExplorer />;
      case 'auction':
        return <AuctionApp />;
      case 'portfolio':
        return <Portfolio />;
      case 'wallet':
        return <WalletTransactions />;
      case 'support':
        return <Support24_7 />;
      case 'settings':
        return <ProfileSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex flex-col">
      {/* Mobile-First Header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300 lg:relative",
        isScrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-muted/20" 
          : "bg-white/80 backdrop-blur-sm border-b border-muted/10"
      )}>
        <div className="px-4 lg:px-6">
          <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16">
            {/* Left Section - Mobile Optimized */}
            <div className="flex items-center gap-2">
              {/* Mobile: Only show back button on small screens */}
              <Link to="/" className="lg:hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              
              {/* Desktop: Show full back button */}
              <Link to="/" className="hidden lg:block">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              
              {/* Logo & Brand - Mobile Optimized */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-golden via-golden-light to-yellow-400 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm lg:text-lg">GB</span>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-base sm:text-lg lg:text-xl font-bold text-navy">GoldenBook</h1>
                  <p className="text-xs text-muted-foreground -mt-1 hidden lg:block">Investor Portal</p>
                </div>
              </div>
            </div>
            
            {/* Right Section - Mobile Optimized */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Button - Mobile */}
              <Button variant="ghost" size="sm" className="lg:hidden p-2">
                <Search className="w-4 h-4" />
              </Button>
              
              {/* Search Bar - Desktop Only */}
              <div className="hidden lg:flex flex-1 max-w-sm mx-6">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-10 pr-4 bg-muted/50 border border-muted/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden/20 focus:border-golden transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full">
                  <span className="sr-only">3 notifications</span>
                </span>
              </Button>
              
              {/* User Menu - Mobile Optimized */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 sm:gap-2 p-2"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-navy to-navy-light rounded-lg flex items-center justify-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="hidden sm:block font-medium text-sm max-w-20 truncate">Nguyễn Văn A</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-300 hidden sm:block", showUserMenu && "rotate-180")} />
                </Button>
                
                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-muted/20 py-2 z-50">
                    <div className="px-4 py-3 border-b border-muted/20">
                      <p className="font-semibold text-navy">Nguyễn Văn A</p>
                      <p className="text-sm text-muted-foreground">investor@goldenbook.vn</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          <Shield className="w-3 h-3 mr-1" />
                          Đã xác thực
                        </Badge>
                        <Badge variant="secondary" className="bg-golden/10 text-golden border-golden/20">
                          <Award className="w-3 h-3 mr-1" />
                          VIP
                        </Badge>
                      </div>
                    </div>
                    <div className="py-2">
                      <Button variant="ghost" className="w-full justify-start px-4 py-2" onClick={() => setActiveTab('settings')}>
                        <Settings className="w-4 h-4 mr-3" />
                        Cài đặt tài khoản
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

      {/* Main Layout Container */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16 lg:bg-white/50 lg:backdrop-blur-sm lg:border-r lg:border-muted/20 px-3 py-4 space-y-1">
          {/* Sidebar Header */}
          <div className="mb-4 px-2">
            <h2 className="text-base font-bold text-navy mb-1">Điều hướng</h2>
          </div>
          
          {/* Navigation Items */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 sm:h-10 px-3 transition-all duration-300 touch-manipulation",
                  "min-h-[44px] sm:min-h-auto", // Touch-friendly minimum height
                  activeTab === item.id 
                    ? "bg-gradient-to-r from-golden to-golden-light text-white shadow-md" 
                    : "hover:bg-muted/50"
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <div className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300",
                  activeTab === item.id 
                    ? "bg-white/20" 
                    : "bg-muted/30"
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.label}</div>
                </div>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-1.5 py-0.5",
                      activeTab === item.id 
                        ? "bg-white/20 text-white border-white/30" 
                        : "bg-golden/10 text-golden border-golden/20"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          
          {/* Sidebar Footer */}
          <div className="mt-auto pt-6 border-t border-muted/20">
            <div className="bg-gradient-to-br from-navy/5 to-golden/5 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-golden to-golden-light rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy text-sm">Nâng cấp Premium</h3>
                  <p className="text-xs text-muted-foreground">Mở khóa tính năng cao cấp</p>
                </div>
              </div>
              <Button size="sm" className="w-full bg-gradient-to-r from-golden to-golden-light hover:from-golden-light hover:to-golden">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-muted/20 px-2 py-2">
          <div className="flex items-center justify-around">
            {navigationItems.slice(0, 5).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-14 sm:h-12 px-2 py-1 transition-all duration-300 relative touch-manipulation",
                  "min-h-[44px]", // Touch-friendly minimum height
                  activeTab === item.id 
                    ? "text-golden" 
                    : "text-muted-foreground hover:text-navy"
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
                  activeTab === item.id 
                    ? "bg-golden/10" 
                    : ""
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium truncate max-w-12">
                  {item.label.split(' ')[0]}
                </span>
                {item.badge && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-golden rounded-full" />
                )}
                {activeTab === item.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-golden rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className={cn(
          "flex-1 lg:ml-64 transition-all duration-300",
          "px-3 sm:px-4 lg:px-6 pt-2 sm:pt-4 pb-20 lg:pb-8"
        )}>
          {/* Quick Actions - Mobile Optimized */}
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Search className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-golden to-golden-light">
                <Sparkles className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Hành động</span>
              </Button>
            </div>
          </div>
          
          {/* Content Area - Mobile Optimized */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl border border-muted/20 shadow-lg p-3 sm:p-4 lg:p-6 min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-160px)] lg:min-h-[calc(100vh-200px)]">
            {renderContent()}
          </div>
        </main>

        {/* Progress Widget */}
        <ProgressWidget 
          profile={mockProgressProfile}
          intentId={mockProgressProfile.intentDraft?.id}
          onStepClick={(step) => {
            console.log('Step clicked:', step);
            // Analytics tracking
            // trackEvent('progress.jump_click', { step: step.id, fromRoute: activeTab });
          }}
        />
      </div>
    </div>
  );
};

export default InvestorApp;