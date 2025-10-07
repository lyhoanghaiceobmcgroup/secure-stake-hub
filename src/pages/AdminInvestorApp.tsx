import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, TrendingUp, FileText, Search, RefreshCw, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';

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
}

const AdminInvestorApp = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<InvestorData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalInvestors: 0,
    totalInvested: 0,
    totalPayouts: 0,
    activeInvestments: 0
  });

  useEffect(() => {
    // TEMPORARY: Disable auth check for demo
    setIsAdmin(true);
    setLoading(false);
    loadInvestorsData();
  }, []);

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
      const totalStats = investorsWithStats.reduce((acc, inv) => ({
        totalInvestors: acc.totalInvestors + 1,
        totalInvested: acc.totalInvested + inv.total_invested,
        totalPayouts: acc.totalPayouts + inv.total_payouts,
        activeInvestments: acc.activeInvestments + inv.active_investments
      }), { totalInvestors: 0, totalInvested: 0, totalPayouts: 0, activeInvestments: 0 });

      setStats(totalStats);
    } catch (error) {
      console.error('Error loading investors:', error);
      toast.error('Không thể tải dữ liệu investors');
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

  const filteredInvestors = investors.filter(inv =>
    inv.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.phone_number.includes(searchQuery)
  );

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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <CardTitle className="text-sm font-medium">Đầu Tư Đang Hoạt Động</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeInvestments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="investors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="investors">Danh Sách Investors</TabsTrigger>
            <TabsTrigger value="kyc">Xác Thực KYC</TabsTrigger>
            <TabsTrigger value="investments">Quản Lý Đầu Tư</TabsTrigger>
          </TabsList>

          <TabsContent value="investors" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tất Cả Investors</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm theo tên, email, SĐT..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-80"
                      />
                    </div>
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

          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>Xác Thực KYC</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Chức năng quản lý KYC đang được phát triển...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments">
            <Card>
              <CardHeader>
                <CardTitle>Quản Lý Đầu Tư</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Chức năng quản lý đầu tư đang được phát triển...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminInvestorApp;
