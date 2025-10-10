import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Users, TrendingUp, FileText, RefreshCw, Activity, Clock, DollarSign, AlertCircle, CheckCircle, Building2, Gavel, BookOpen, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import { AuctionRound, BidOrder } from '@/types/auction';
import PortfolioService, { InvestmentData } from '@/services/portfolioService';
import { OpportunitiesAdmin } from '@/components/admin/OpportunitiesAdmin';
import { AuctionsAdmin } from '@/components/admin/AuctionsAdmin';
import { PortfoliosAdmin } from '@/components/admin/PortfoliosAdmin';

interface InvestorData {
  id: string;
  full_name: string;
  phone: string;
  total_invested: number;
  total_payouts: number;
  active_investments: number;
  kyc_status: string;
  created_at: string;
  last_activity?: string;
  wallet_balance?: number;
}

interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

interface InvestmentOpportunity {
  id: string;
  companyName: string;
  projectName: string;
  description: string;
  targetRate: number;
  payoutFrequency: string;
  minInvestment: number;
  totalTarget: number;
  raised: number;
  sector: string;
  duration: string;
  uyTinScore: number;
  riskLevel: string;
  deadline: string;
  status: string;
  created_at?: string;
}

const AdminInvestorApp = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<InvestorData[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [adminSection, setAdminSection] = useState<'dashboard' | 'opportunities' | 'auctions' | 'portfolios'>('dashboard');
  
  // Auction Management State
  const [auctions, setAuctions] = useState<AuctionRound[]>([]);
  const [auctionBids, setAuctionBids] = useState<BidOrder[]>([]);
  
  // Portfolio Management State
  const [portfolios, setPortfolios] = useState<InvestmentData[]>([]);
  
  const [stats, setStats] = useState({
    totalInvestors: 0,
    totalInvested: 0,
    totalPayouts: 0,
    activeInvestments: 0,
    pendingKYC: 0,
    totalTransactions: 0,
    avgInvestment: 0,
    successRate: 0
  });

  useEffect(() => {
    setIsAdmin(true);
    setLoading(false);
    loadAllData();
    
    const channel = supabase
      .channel('admin-activities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'intents' }, () => {
        loadActivitiesData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        loadActivitiesData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadInvestorsData(),
      loadActivitiesData(),
      loadOpportunitiesData(),
      loadAuctionsData(),
      loadPortfoliosData()
    ]);
  };

  const loadInvestorsData = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const investorsList: InvestorData[] = await Promise.all((profiles || []).map(async (profile) => {
        const { data: intentsData } = await supabase
          .from('intents')
          .select('amount, status')
          .eq('user_id', profile.id);

        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('amount, type')
          .eq('user_id', profile.id)
          .eq('type', 'distribution');

        const { data: walletData } = await supabase
          .from('wallets')
          .select('available_balance')
          .eq('user_id', profile.id)
          .maybeSingle();

        const totalInvested = (intentsData || []).reduce((sum, intent) => sum + (intent.amount || 0), 0);
        const totalPayouts = (transactionsData || []).reduce((sum, tx) => sum + (tx.amount || 0), 0);
        const activeInvestments = (intentsData || []).filter(i => i.status === 'signed_all').length;

        return {
          id: profile.id,
          full_name: profile.full_name || 'N/A',
          phone: profile.phone || 'N/A',
          total_invested: totalInvested,
          total_payouts: totalPayouts,
          active_investments: activeInvestments,
          kyc_status: 'verified',
          created_at: profile.created_at,
          last_activity: profile.updated_at,
          wallet_balance: walletData?.available_balance || 0
        };
      }));

      setInvestors(investorsList);

      const newStats = {
        totalInvestors: investorsList.length,
        totalInvested: investorsList.reduce((sum, inv) => sum + inv.total_invested, 0),
        totalPayouts: investorsList.reduce((sum, inv) => sum + inv.total_payouts, 0),
        activeInvestments: investorsList.reduce((sum, inv) => sum + inv.active_investments, 0),
        pendingKYC: investorsList.filter(inv => inv.kyc_status === 'pending').length,
        totalTransactions: investorsList.reduce((sum, inv) => sum + inv.active_investments, 0),
        avgInvestment: investorsList.length > 0 ? Math.round(investorsList.reduce((sum, inv) => sum + inv.total_invested, 0) / investorsList.length) : 0,
        successRate: 95
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error loading investors:', error);
    }
  };

  const loadActivitiesData = async () => {
    try {
      const { data: intentsData } = await supabase
        .from('intents')
        .select(`
          id,
          amount,
          status,
          created_at,
          user_id,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(15);

      const { data: transactionsData } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          type,
          status,
          created_at,
          user_id,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false})
        .limit(15);

      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
      };

      const activities: ActivityLog[] = [
        ...(intentsData || []).map(intent => ({
          id: intent.id,
          user_id: intent.user_id,
          user_name: (intent.profiles as any)?.full_name || 'N/A',
          action: 'investment',
          description: `Đầu tư ${formatCurrency(intent.amount || 0)}`,
          timestamp: intent.created_at,
          status: intent.status === 'signed_all' ? 'success' as const : intent.status === 'cancelled' ? 'failed' as const : 'pending' as const
        })),
        ...(transactionsData || []).map(tx => ({
          id: tx.id,
          user_id: tx.user_id,
          user_name: (tx.profiles as any)?.full_name || 'N/A',
          action: tx.type || 'transaction',
          description: `${tx.type === 'distribution' ? 'Nhận' : 'Giao dịch'} ${formatCurrency(tx.amount || 0)}`,
          timestamp: tx.created_at,
          status: tx.status === 'completed' ? 'success' as const : tx.status === 'failed' ? 'failed' as const : 'pending' as const
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 30);

      setActivities(activities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const loadOpportunitiesData = async () => {
    const mockOpportunities: InvestmentOpportunity[] = [
      {
        id: "1",
        companyName: "Green Energy Solutions JSC",
        projectName: "Dự án Solar Farm Bình Thuận",
        description: "Dự án năng lượng mặt trời quy mô 50MW",
        targetRate: 12.5,
        payoutFrequency: 'quarterly',
        minInvestment: 50000000,
        totalTarget: 2000000000,
        raised: 1200000000,
        sector: "Năng lượng",
        duration: "24 tháng",
        uyTinScore: 88,
        riskLevel: 'medium',
        deadline: "2025-12-31",
        status: 'open',
      }
    ];
    setOpportunities(mockOpportunities);
  };

  const loadAuctionsData = async () => {
    const mockAuctions: AuctionRound[] = [
      {
        id: "1",
        roundId: "AUC-2025-001",
        gid: "GID-001",
        company: "TechViet JSC",
        businessName: "TechViet Corporation",
        packageName: "Gói A - Mở rộng thị trường",
        termMonths: 24,
        startAt: "2025-10-01T00:00:00Z",
        endAt: "2025-10-15T23:59:59Z",
        baseRate: 8.5,
        deltaMax: 2.5,
        deltaFloor: 0.5,
        a: 0.02,
        b: 0.05,
        targetAmount: 5000000000,
        raised: 3500000000,
        cover: 1.4,
        deltaNow: 1.2,
        rOffer: 9.7,
        roundIndex: 1,
        roundCount: 3,
        status: 'open',
        docs: [],
        gTrust: 88,
        antiSnipingExtensions: 0,
        currentPrice: 9.7,
        priceDecrement: 0.1,
        reservePrice: 8.5,
        totalBids: 45,
        participantCount: 32,
        interestRate: 9.7,
        currentAmount: 3500000000,
        trustScore: 88,
        lotSize: 10000000,
        capPercentage: 20
      }
    ];
    setAuctions(mockAuctions);
    
    const mockBids: BidOrder[] = [
      {
        id: "1",
        bidId: "BID-001",
        roundId: "AUC-2025-001",
        userId: "user1",
        userName: "Nguyễn Văn A",
        amount: 100000000,
        type: "market",
        status: "filled",
        filledAmount: 100000000,
        clearRate: 9.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        idempotencyKey: "key-001",
        auctionId: "1"
      }
    ];
    setAuctionBids(mockBids);
  };

  const loadPortfoliosData = async () => {
    const mockPortfolios: InvestmentData[] = [
      {
        id: "1",
        cqid: "CQID-2025-001",
        companyName: "AquaTech Solutions",
        packageName: "Gói Standard",
        sector: "CleanTech",
        amountContributed: 100000000,
        joinDate: "2025-06-15",
        status: "active",
        targetRate: 9.5,
        actualRateYTD: 9.2,
        distributionReceived: 7500000,
        nextPayoutDate: "2025-11-30",
        nextPayoutEstimate: 800000,
        uyTinScore: 92,
        lastProgressHash: "0x123abc",
        qrLink: "https://verify.goldenbook.vn/CQID-2025-001",
        transactionId: "TXN-001",
        contractHash: "0xabc123",
        eSignDate: "2025-06-15",
        effectiveDate: "2025-06-16"
      }
    ];
    setPortfolios(mockPortfolios);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'investment':
        return <TrendingUp className="h-4 w-4" />;
      case 'distribution':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Quản trị toàn diện</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setAdminSection('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              adminSection === 'dashboard' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setAdminSection('opportunities')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              adminSection === 'opportunities' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
            }`}
          >
            <Building2 className="h-5 w-5" />
            <span className="font-medium">Khám phá cơ hội đầu tư</span>
          </button>

          <button
            onClick={() => setAdminSection('auctions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              adminSection === 'auctions' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
            }`}
          >
            <Gavel className="h-5 w-5" />
            <span className="font-medium">Đấu giá quyền lợi</span>
          </button>

          <button
            onClick={() => setAdminSection('portfolios')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              adminSection === 'portfolios' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Sổ của tôi</span>
          </button>
        </nav>

        <div className="p-4 border-t mt-auto">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/investor')}
          >
            Chế độ Investor
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {adminSection === 'dashboard' && 'Dashboard Tổng Quan'}
                  {adminSection === 'opportunities' && 'Quản Lý Cơ Hội Đầu Tư'}
                  {adminSection === 'auctions' && 'Quản Lý Đấu Giá Quyền Lợi'}
                  {adminSection === 'portfolios' && 'Quản Lý Sổ Đầu Tư'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {adminSection === 'dashboard' && 'Theo dõi và quản lý toàn bộ hoạt động'}
                  {adminSection === 'opportunities' && 'Tạo và cập nhật các dự án đầu tư'}
                  {adminSection === 'auctions' && 'Quản lý vòng đấu giá và lệnh đặt'}
                  {adminSection === 'portfolios' && 'Theo dõi danh mục đầu tư của investors'}
                </p>
              </div>
              <Button variant="outline" onClick={loadAllData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Dashboard Section */}
          {adminSection === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng Investors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalInvestors}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng Đầu Tư</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalInvested)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng Phân Phối</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalPayouts)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đầu Tư Hoạt Động</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeInvestments}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">KYC Chờ Duyệt</CardTitle>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingKYC}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Trung Bình Đầu Tư</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.avgInvestment)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tỷ Lệ Thành Công</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.successRate}%</div>
                    <Progress value={stats.successRate} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Hoạt Động Gần Đây
                      </CardTitle>
                      <CardDescription>Theo dõi luồng hoạt động của tất cả tài khoản</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadActivitiesData}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Làm mới
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activities.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Chưa có hoạt động nào</p>
                    ) : (
                      activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                          <div className={`mt-1 ${getActivityColor(activity.status)}`}>
                            {getActivityIcon(activity.action)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{activity.user_name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDate(activity.timestamp)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <Badge variant={activity.status === 'success' ? 'default' : activity.status === 'failed' ? 'destructive' : 'secondary'} className="text-xs">
                              {activity.status === 'success' ? 'Thành công' : activity.status === 'failed' ? 'Thất bại' : 'Đang xử lý'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Opportunities Section */}
          {adminSection === 'opportunities' && (
            <OpportunitiesAdmin 
              opportunities={opportunities} 
              onUpdate={setOpportunities}
            />
          )}

          {/* Auctions Section */}
          {adminSection === 'auctions' && (
            <AuctionsAdmin 
              auctions={auctions}
              bids={auctionBids}
            />
          )}

          {/* Portfolios Section */}
          {adminSection === 'portfolios' && (
            <PortfoliosAdmin 
              portfolios={portfolios}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminInvestorApp;