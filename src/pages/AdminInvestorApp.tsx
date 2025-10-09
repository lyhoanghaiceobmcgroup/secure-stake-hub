import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Users, TrendingUp, FileText, Search, RefreshCw, Eye, Edit, Activity, Clock, DollarSign, AlertCircle, CheckCircle, XCircle, Filter, Download, Plus, Trash2, Building2, Calendar, PieChart, Gavel, BookOpen, LayoutDashboard, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AuctionRound, BidOrder } from '@/types/auction';
import PortfolioService, { InvestmentData } from '@/services/portfolioService';

interface InvestorData {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
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

interface InvestmentDetail {
  id: string;
  investor_name: string;
  company_name: string;
  amount: number;
  status: string;
  created_at: string;
  expected_return: number;
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
  const [investments, setInvestments] = useState<InvestmentDetail[]>([]);
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kycFilter, setKycFilter] = useState<string>('all');
  const [isOpportunityDialogOpen, setIsOpportunityDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<InvestmentOpportunity | null>(null);
  
  // Admin Menu State
  const [adminSection, setAdminSection] = useState<'dashboard' | 'opportunities' | 'auctions' | 'portfolios'>('dashboard');
  
  // Auction Management State
  const [auctions, setAuctions] = useState<AuctionRound[]>([]);
  const [auctionBids, setAuctionBids] = useState<BidOrder[]>([]);
  const [isAuctionDialogOpen, setIsAuctionDialogOpen] = useState(false);
  const [editingAuction, setEditingAuction] = useState<AuctionRound | null>(null);
  
  // Portfolio Management State
  const [portfolios, setPortfolios] = useState<InvestmentData[]>([]);
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<InvestmentData | null>(null);
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
    // TEMPORARY: Disable auth check for demo
    setIsAdmin(true);
    setLoading(false);
    loadAllData();
    
    // Set up real-time subscription for activities
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
      loadInvestmentsData(),
      loadOpportunitiesData(),
      loadAuctionsData(),
      loadPortfoliosData()
    ]);
  };

  const loadAuctionsData = async () => {
    // Mock auction data - Replace with real API call
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
      },
      {
        id: "2",
        roundId: "AUC-2025-002",
        gid: "GID-002",
        company: "GreenEnergy Corp",
        businessName: "Green Energy Solutions",
        packageName: "Trang trại năng lượng mặt trời",
        termMonths: 36,
        startAt: "2025-10-05T00:00:00Z",
        endAt: "2025-10-20T23:59:59Z",
        baseRate: 9.0,
        deltaMax: 3.0,
        deltaFloor: 0.8,
        a: 0.015,
        b: 0.04,
        targetAmount: 8000000000,
        raised: 6500000000,
        cover: 1.6,
        deltaNow: 1.5,
        rOffer: 10.5,
        roundIndex: 2,
        roundCount: 4,
        status: 'open',
        docs: [],
        gTrust: 92,
        antiSnipingExtensions: 0,
        currentPrice: 10.5,
        priceDecrement: 0.15,
        reservePrice: 9.0,
        totalBids: 68,
        participantCount: 48,
        interestRate: 10.5,
        currentAmount: 6500000000,
        trustScore: 92,
        lotSize: 20000000,
        capPercentage: 15
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
      },
      {
        id: "2",
        bidId: "BID-002",
        roundId: "AUC-2025-002",
        userId: "user2",
        userName: "Trần Thị B",
        amount: 200000000,
        type: "limit",
        deltaMin: 1.0,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        idempotencyKey: "key-002",
        auctionId: "2"
      }
    ];
    setAuctionBids(mockBids);
  };

  const loadPortfoliosData = async () => {
    // Mock portfolio data - Replace with real API call from PortfolioService
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
      },
      {
        id: "2",
        cqid: "CQID-2025-002",
        companyName: "TechManufacturing Co.",
        packageName: "Gói Premium",
        sector: "Technology",
        amountContributed: 200000000,
        joinDate: "2025-07-01",
        status: "active",
        targetRate: 12.0,
        actualRateYTD: 12.5,
        distributionReceived: 18000000,
        nextPayoutDate: "2025-11-15",
        nextPayoutEstimate: 2000000,
        uyTinScore: 95,
        lastProgressHash: "0x456def",
        qrLink: "https://verify.goldenbook.vn/CQID-2025-002",
        transactionId: "TXN-002",
        contractHash: "0xdef456",
        eSignDate: "2025-07-01",
        effectiveDate: "2025-07-02"
      }
    ];
    setPortfolios(mockPortfolios);
  };

  const loadInvestorsData = async () => {
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Get investment stats for each user using intents table
      const investorsWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: intents } = await supabase
            .from('intents')
            .select('amount, status')
            .eq('user_id', profile.id);

          const totalInvested = intents?.filter(i => i.status === 'investor_signed' || i.status === 'issuer_signed' || i.status === 'signed_all').reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
          const activeInvestments = intents?.filter(i => i.status === 'investor_signed' || i.status === 'issuer_signed' || i.status === 'signed_all').length || 0;

          // Get transactions for payout calculation
          const { data: transactions } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', profile.id)
            .eq('type', 'distribution');

          const totalPayouts = transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

          const { data: kyc } = await supabase
            .from('kyc_verifications')
            .select('status')
            .eq('user_id', profile.id)
            .maybeSingle();

          return {
            id: profile.id,
            full_name: profile.full_name || 'Chưa cập nhật',
            email: 'N/A',
            phone_number: profile.phone || '',
            total_invested: totalInvested,
            total_payouts: totalPayouts,
            active_investments: activeInvestments,
            kyc_status: kyc?.status || 'pending',
            created_at: profile.created_at
          };
        })
      );

      setInvestors(investorsWithStats);

      // Calculate overall stats
      const pendingKYC = investorsWithStats.filter(inv => inv.kyc_status === 'pending').length;
      const totalTransactions = investorsWithStats.reduce((sum, inv) => sum + inv.active_investments, 0);
      const avgInvestment = investorsWithStats.length > 0 
        ? investorsWithStats.reduce((sum, inv) => sum + inv.total_invested, 0) / investorsWithStats.length 
        : 0;
      
      const totalStats = {
        totalInvestors: investorsWithStats.length,
        totalInvested: investorsWithStats.reduce((sum, inv) => sum + inv.total_invested, 0),
        totalPayouts: investorsWithStats.reduce((sum, inv) => sum + inv.total_payouts, 0),
        activeInvestments: investorsWithStats.reduce((sum, inv) => sum + inv.active_investments, 0),
        pendingKYC,
        totalTransactions,
        avgInvestment,
        successRate: 94.5 // Mock data - would calculate from actual success/fail rates
      };

      setStats(totalStats);
    } catch (error) {
      console.error('Error loading investors:', error);
      toast.error('Không thể tải dữ liệu investors');
    }
  };

  const loadActivitiesData = async () => {
    try {
      // Get recent intents as activities
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
        .limit(20);

      // Get recent transactions
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
        .order('created_at', { ascending: false })
        .limit(20);

      // Combine and format activities
      const activities: ActivityLog[] = [
        ...(intentsData || []).map(intent => ({
          id: intent.id,
          user_id: intent.user_id,
          user_name: (intent.profiles as any)?.full_name || 'N/A',
          action: 'investment',
          description: `Đầu tư ${formatCurrency(intent.amount || 0)}`,
          timestamp: intent.created_at,
          status: intent.status === 'signed_all' ? 'success' as const : 'pending' as const
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

  const loadInvestmentsData = async () => {
    try {
      const { data: intentsData } = await supabase
        .from('intents')
        .select(`
          id,
          amount,
          status,
          created_at,
          user_id,
          profiles!inner(full_name),
          opportunities!inner(company_name, expected_roi)
        `)
        .order('created_at', { ascending: false });

      const investments: InvestmentDetail[] = (intentsData || []).map(intent => ({
        id: intent.id,
        investor_name: (intent.profiles as any)?.full_name || 'N/A',
        company_name: (intent.opportunities as any)?.company_name || 'N/A',
        amount: intent.amount || 0,
        status: intent.status || 'pending',
        created_at: intent.created_at,
        expected_return: ((intent.opportunities as any)?.expected_roi || 0) * (intent.amount || 0) / 100
      }));

      setInvestments(investments);
    } catch (error) {
      console.error('Error loading investments:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getKYCBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      approved: 'default',
      pending: 'secondary',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
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

  const filteredInvestors = investors.filter(inv => {
    const matchesSearch = inv.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.phone_number.includes(searchQuery);
    
    const matchesKYC = kycFilter === 'all' || inv.kyc_status === kycFilter;
    
    return matchesSearch && matchesKYC;
  });

  const filteredInvestments = investments.filter(inv => {
    const matchesSearch = inv.investor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const loadOpportunitiesData = async () => {
    try {
      // Mock data - in production this would fetch from Supabase
      const mockOpportunities: InvestmentOpportunity[] = [
        {
          id: "1",
          companyName: "Green Energy Solutions JSC",
          projectName: "Dự án Solar Farm Bình Thuận",
          description: "Dự án năng lượng mặt trời quy mô 50MW tại tỉnh Bình Thuận với công nghệ tiên tiến và cam kết mua điện 20 năm.",
          targetRate: 12.5,
          payoutFrequency: 'quarterly',
          minInvestment: 50000000,
          totalTarget: 2000000000,
          raised: 1200000000,
          sector: "Năng lượng",
          duration: "24 tháng",
          uyTinScore: 88,
          riskLevel: 'medium',
          deadline: "2025-01-31",
          status: 'open',
        },
        {
          id: "2", 
          companyName: "Tech Manufacturing Co.",
          projectName: "Nhà máy sản xuất linh kiện điện tử",
          description: "Mở rộng dây chuyền sản xuất linh kiện điện tử phục vụ xuất khẩu với đơn hàng đã có sẵn từ các khách hàng quốc tế.",
          targetRate: 15.8,
          payoutFrequency: 'monthly',
          minInvestment: 100000000,
          totalTarget: 5000000000,
          raised: 3500000000,
          sector: "Công nghệ",
          duration: "18 tháng",
          uyTinScore: 92,
          riskLevel: 'low',
          deadline: "2025-02-15",
          status: 'closing_soon',
        },
        {
          id: "3",
          companyName: "Real Estate Development Ltd.",
          projectName: "Khu đô thị sinh thái Eco Park",
          description: "Phát triển khu đô thị sinh thái cao cấp tại vùng ven thành phố với đầy đủ tiện ích và không gian xanh.",
          targetRate: 18.2,
          payoutFrequency: 'yearly',
          minInvestment: 200000000,
          totalTarget: 10000000000,
          raised: 2000000000,
          sector: "Bất động sản",
          duration: "36 tháng",
          uyTinScore: 76,
          riskLevel: 'high',
          deadline: "2025-03-01",
          status: 'open',
        },
        {
          id: "4",
          companyName: "Fintech Innovation Corp.",
          projectName: "Nền tảng thanh toán số AI",
          description: "Phát triển nền tảng thanh toán số tích hợp AI để tối ưu hóa trải nghiệm người dùng và bảo mật.",
          targetRate: 22.5,
          payoutFrequency: 'quarterly',
          minInvestment: 50000000,
          totalTarget: 2000000000,
          raised: 800000000,
          sector: "Fintech",
          duration: "24 tháng",
          uyTinScore: 88,
          riskLevel: 'medium',
          deadline: "2025-02-15",
          status: 'open',
        }
      ];
      setOpportunities(mockOpportunities);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      toast.error('Không thể tải dữ liệu dự án');
    }
  };

  const handleCreateOpportunity = () => {
    setEditingOpportunity(null);
    setIsOpportunityDialogOpen(true);
  };

  const handleEditOpportunity = (opportunity: InvestmentOpportunity) => {
    setEditingOpportunity(opportunity);
    setIsOpportunityDialogOpen(true);
  };

  const handleDeleteOpportunity = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      setOpportunities(prev => prev.filter(opp => opp.id !== id));
      toast.success('Đã xóa dự án thành công');
    }
  };

  const handleSaveOpportunity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const opportunityData: InvestmentOpportunity = {
      id: editingOpportunity?.id || `${Date.now()}`,
      companyName: formData.get('companyName') as string,
      projectName: formData.get('projectName') as string,
      description: formData.get('description') as string,
      targetRate: parseFloat(formData.get('targetRate') as string),
      payoutFrequency: formData.get('payoutFrequency') as string,
      minInvestment: parseFloat(formData.get('minInvestment') as string),
      totalTarget: parseFloat(formData.get('totalTarget') as string),
      raised: parseFloat(formData.get('raised') as string) || 0,
      sector: formData.get('sector') as string,
      duration: formData.get('duration') as string,
      uyTinScore: parseFloat(formData.get('uyTinScore') as string),
      riskLevel: formData.get('riskLevel') as string,
      deadline: formData.get('deadline') as string,
      status: formData.get('status') as string,
      created_at: editingOpportunity?.created_at || new Date().toISOString()
    };

    if (editingOpportunity) {
      setOpportunities(prev => prev.map(opp => opp.id === editingOpportunity.id ? opportunityData : opp));
      toast.success('Đã cập nhật dự án thành công');
    } else {
      setOpportunities(prev => [...prev, opportunityData]);
      toast.success('Đã tạo dự án mới thành công');
    }
    
    setIsOpportunityDialogOpen(false);
    setEditingOpportunity(null);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Họ Tên', 'Email', 'SĐT', 'Tổng Đầu Tư', 'Tổng Nhận', 'Đầu Tư Active', 'KYC'],
      ...filteredInvestors.map(inv => [
        inv.full_name,
        inv.email,
        inv.phone_number,
        inv.total_invested,
        inv.total_payouts,
        inv.active_investments,
        inv.kyc_status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investors_${new Date().toISOString()}.csv`;
    a.click();
    toast.success('Đã xuất dữ liệu thành công');
  };

  const getRiskBadgeVariant = (risk: string): "default" | "secondary" | "destructive" | "outline" => {
    if (risk === 'low') return 'default';
    if (risk === 'medium') return 'secondary';
    if (risk === 'high') return 'destructive';
    return 'outline';
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'open') return 'default';
    if (status === 'closing_soon') return 'secondary';
    if (status === 'closed') return 'outline';
    return 'outline';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Quản Trị Investor</h1>
                <p className="text-sm text-muted-foreground">Quản lý toàn bộ investor và dữ liệu đầu tư</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/investor')}>
                Chế độ Investor
              </Button>
              <Button variant="outline" onClick={loadInvestorsData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
              <p className="text-xs text-muted-foreground mt-1">
                +{stats.totalTransactions} giao dịch
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KYC Chờ Duyệt</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingKYC}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cần xử lý
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trung Bình Đầu Tư</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.avgInvestment)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Mỗi investor
              </p>
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

        {/* Activity Timeline Section */}
        <div className="mb-8">
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="investors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="investors">
              <Users className="h-4 w-4 mr-2" />
              Danh Sách Investors
            </TabsTrigger>
            <TabsTrigger value="investments">
              <TrendingUp className="h-4 w-4 mr-2" />
              Quản Lý Đầu Tư
            </TabsTrigger>
            <TabsTrigger value="opportunities">
              <Building2 className="h-4 w-4 mr-2" />
              Quản Lý Dự Án
            </TabsTrigger>
            <TabsTrigger value="kyc">
              <Shield className="h-4 w-4 mr-2" />
              Xác Thực KYC
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investors" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle>Tất Cả Investors ({filteredInvestors.length})</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-60"
                      />
                    </div>
                    <Select value={kycFilter} onValueChange={setKycFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Lọc KYC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả KYC</SelectItem>
                        <SelectItem value="approved">Đã duyệt</SelectItem>
                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Xuất CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ Tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số Điện Thoại</TableHead>
                      <TableHead>Tổng Đầu Tư</TableHead>
                      <TableHead>Tổng Nhận</TableHead>
                      <TableHead>Đầu Tư Đang Hoạt Động</TableHead>
                      <TableHead>KYC</TableHead>
                      <TableHead>Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvestors.map((investor) => (
                      <TableRow key={investor.id}>
                        <TableCell className="font-medium">{investor.full_name}</TableCell>
                        <TableCell>{investor.email}</TableCell>
                        <TableCell>{investor.phone_number}</TableCell>
                        <TableCell>{formatCurrency(investor.total_invested)}</TableCell>
                        <TableCell>{formatCurrency(investor.total_payouts)}</TableCell>
                        <TableCell>{investor.active_investments}</TableCell>
                        <TableCell>{getKYCBadge(investor.kyc_status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedInvestor(investor.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Quản Lý Đầu Tư ({filteredInvestments.length})</CardTitle>
                    <CardDescription>Theo dõi tất cả các khoản đầu tư và trạng thái</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Lọc trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="signed_all">Đã ký</SelectItem>
                        <SelectItem value="investor_signed">Chờ doanh nghiệp</SelectItem>
                        <SelectItem value="issuer_signed">Chờ investor</SelectItem>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investor</TableHead>
                      <TableHead>Doanh Nghiệp</TableHead>
                      <TableHead>Số Tiền</TableHead>
                      <TableHead>Lợi Nhuận Dự Kiến</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Ngày Tạo</TableHead>
                      <TableHead>Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvestments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Không tìm thấy dữ liệu đầu tư
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvestments.map((investment) => (
                        <TableRow key={investment.id}>
                          <TableCell className="font-medium">{investment.investor_name}</TableCell>
                          <TableCell>{investment.company_name}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(investment.amount)}</TableCell>
                          <TableCell className="text-green-600">+{formatCurrency(investment.expected_return)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              investment.status === 'signed_all' ? 'default' : 
                              investment.status.includes('signed') ? 'secondary' : 'outline'
                            }>
                              {investment.status === 'signed_all' ? 'Hoàn tất' : 
                               investment.status === 'investor_signed' ? 'Chờ DN ký' :
                               investment.status === 'issuer_signed' ? 'Chờ investor ký' : 'Chờ xử lý'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(investment.created_at)}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Quản Lý Dự Án Đầu Tư ({opportunities.length})</CardTitle>
                    <CardDescription>Quản lý các cơ hội đầu tư hiển thị cho investors</CardDescription>
                  </div>
                  <Dialog open={isOpportunityDialogOpen} onOpenChange={setIsOpportunityDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleCreateOpportunity}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo Dự Án Mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingOpportunity ? 'Chỉnh Sửa Dự Án' : 'Tạo Dự Án Mới'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSaveOpportunity} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="companyName">Tên Công Ty *</Label>
                            <Input 
                              id="companyName" 
                              name="companyName" 
                              defaultValue={editingOpportunity?.companyName}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="projectName">Tên Dự Án *</Label>
                            <Input 
                              id="projectName" 
                              name="projectName" 
                              defaultValue={editingOpportunity?.projectName}
                              required 
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Mô Tả *</Label>
                          <Textarea 
                            id="description" 
                            name="description" 
                            rows={3}
                            defaultValue={editingOpportunity?.description}
                            required 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sector">Lĩnh Vực *</Label>
                            <Input 
                              id="sector" 
                              name="sector" 
                              defaultValue={editingOpportunity?.sector}
                              placeholder="VD: Năng lượng, Công nghệ"
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="duration">Thời Gian *</Label>
                            <Input 
                              id="duration" 
                              name="duration" 
                              defaultValue={editingOpportunity?.duration}
                              placeholder="VD: 24 tháng"
                              required 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="targetRate">Lãi Suất Mục Tiêu (%) *</Label>
                            <Input 
                              id="targetRate" 
                              name="targetRate" 
                              type="number"
                              step="0.1"
                              defaultValue={editingOpportunity?.targetRate}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="uyTinScore">Điểm Uy Tín *</Label>
                            <Input 
                              id="uyTinScore" 
                              name="uyTinScore" 
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={editingOpportunity?.uyTinScore}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="riskLevel">Mức Rủi Ro *</Label>
                            <Select name="riskLevel" defaultValue={editingOpportunity?.riskLevel || 'medium'}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Thấp</SelectItem>
                                <SelectItem value="medium">Trung bình</SelectItem>
                                <SelectItem value="high">Cao</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="minInvestment">Đầu Tư Tối Thiểu (VND) *</Label>
                            <Input 
                              id="minInvestment" 
                              name="minInvestment" 
                              type="number"
                              defaultValue={editingOpportunity?.minInvestment}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="totalTarget">Mục Tiêu Tổng (VND) *</Label>
                            <Input 
                              id="totalTarget" 
                              name="totalTarget" 
                              type="number"
                              defaultValue={editingOpportunity?.totalTarget}
                              required 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="raised">Đã Huy Động (VND)</Label>
                            <Input 
                              id="raised" 
                              name="raised" 
                              type="number"
                              defaultValue={editingOpportunity?.raised || 0}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="payoutFrequency">Tần Suất Chi Trả *</Label>
                            <Select name="payoutFrequency" defaultValue={editingOpportunity?.payoutFrequency || 'quarterly'}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Hàng tháng</SelectItem>
                                <SelectItem value="quarterly">Hàng quý</SelectItem>
                                <SelectItem value="yearly">Hàng năm</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Trạng Thái *</Label>
                            <Select name="status" defaultValue={editingOpportunity?.status || 'open'}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Đang mở</SelectItem>
                                <SelectItem value="closing_soon">Sắp đóng</SelectItem>
                                <SelectItem value="closed">Đã đóng</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deadline">Hạn Chót *</Label>
                          <Input 
                            id="deadline" 
                            name="deadline" 
                            type="date"
                            defaultValue={editingOpportunity?.deadline}
                            required 
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsOpportunityDialogOpen(false)}
                          >
                            Hủy
                          </Button>
                          <Button type="submit">
                            {editingOpportunity ? 'Cập Nhật' : 'Tạo Mới'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Công Ty / Dự Án</TableHead>
                      <TableHead>Lĩnh Vực</TableHead>
                      <TableHead>Lãi Suất</TableHead>
                      <TableHead>Huy Động / Mục Tiêu</TableHead>
                      <TableHead>Rủi Ro</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Hạn Chót</TableHead>
                      <TableHead>Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Chưa có dự án nào. Nhấn "Tạo Dự Án Mới" để thêm dự án đầu tiên.
                        </TableCell>
                      </TableRow>
                    ) : (
                      opportunities.map((opp) => (
                        <TableRow key={opp.id}>
                          <TableCell>
                            <div>
                              <p className="font-semibold">{opp.companyName}</p>
                              <p className="text-sm text-muted-foreground">{opp.projectName}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{opp.sector}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {opp.targetRate}%
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold">{formatCurrency(opp.raised)}</span>
                                <span className="text-muted-foreground">/</span>
                                <span>{formatCurrency(opp.totalTarget)}</span>
                              </div>
                              <Progress value={(opp.raised / opp.totalTarget) * 100} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRiskBadgeVariant(opp.riskLevel)}>
                              {opp.riskLevel === 'low' ? 'Thấp' : opp.riskLevel === 'medium' ? 'TB' : 'Cao'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(opp.status)}>
                              {opp.status === 'open' ? 'Mở' : opp.status === 'closing_soon' ? 'Sắp đóng' : 'Đã đóng'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(opp.deadline).toLocaleDateString('vi-VN')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditOpportunity(opp)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteOpportunity(opp.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-4">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Xác Thực KYC ({stats.pendingKYC} chờ duyệt)</CardTitle>
                  <CardDescription>Quản lý và phê duyệt yêu cầu xác thực danh tính</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ Tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số Điện Thoại</TableHead>
                      <TableHead>Trạng Thái KYC</TableHead>
                      <TableHead>Ngày Đăng Ký</TableHead>
                      <TableHead>Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investors.filter(inv => inv.kyc_status === 'pending').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Không có yêu cầu KYC nào đang chờ xử lý
                        </TableCell>
                      </TableRow>
                    ) : (
                      investors.filter(inv => inv.kyc_status === 'pending').map((investor) => (
                        <TableRow key={investor.id}>
                          <TableCell className="font-medium">{investor.full_name}</TableCell>
                          <TableCell>{investor.email}</TableCell>
                          <TableCell>{investor.phone_number}</TableCell>
                          <TableCell>{getKYCBadge(investor.kyc_status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(investor.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Duyệt
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <XCircle className="h-4 w-4 mr-1" />
                                Từ chối
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminInvestorApp;
