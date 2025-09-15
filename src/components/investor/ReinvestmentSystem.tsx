import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  RefreshCw,
  TrendingUp,
  DollarSign,
  Calendar,
  Settings,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  Filter,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Info,
  X,
  ArrowRight,
  Percent,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

interface ReinvestmentSystemProps {
  cqid: string;
  onClose?: () => void;
}

interface ReinvestmentRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed_amount' | 'threshold';
  isActive: boolean;
  conditions: {
    minAmount?: number;
    maxAmount?: number;
    percentage?: number;
    fixedAmount?: number;
    threshold?: number;
    targetPackages?: string[];
    frequency?: 'immediate' | 'monthly' | 'quarterly';
  };
  priority: number;
  createdDate: string;
  lastTriggered?: string;
  totalReinvested: number;
  successRate: number;
}

interface ReinvestmentHistory {
  id: string;
  date: string;
  sourceAmount: number;
  reinvestedAmount: number;
  targetPackage: string;
  targetCqid: string;
  method: 'manual' | 'auto';
  ruleId?: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
}

interface AvailablePackage {
  id: string;
  name: string;
  businessName: string;
  minInvestment: number;
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  sector: string;
  isAvailable: boolean;
}

const ReinvestmentSystem: React.FC<ReinvestmentSystemProps> = ({ cqid, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [editingRule, setEditingRule] = useState<ReinvestmentRule | null>(null);
  const [ruleForm, setRuleForm] = useState({
    name: '',
    type: 'percentage' as const,
    percentage: '',
    fixedAmount: '',
    threshold: '',
    minAmount: '',
    maxAmount: '',
    targetPackages: [] as string[],
    frequency: 'immediate' as const
  });
  const [manualForm, setManualForm] = useState({
    amount: '',
    targetPackage: '',
    notes: ''
  });

  // Mock data
  const portfolioInfo = {
    cqid: 'CQĐĐT #AQ-2214',
    packageName: 'AquaPure Series A',
    currentValue: 15600000,
    availableForReinvestment: 3200000,
    totalReinvested: 8400000,
    autoReinvestEnabled: true
  };

  const reinvestmentRules: ReinvestmentRule[] = [
    {
      id: '1',
      name: 'Tái đầu tư 70% lợi nhuận',
      type: 'percentage',
      isActive: true,
      conditions: {
        percentage: 70,
        minAmount: 1000000,
        targetPackages: ['aqua-series-b', 'green-energy-a'],
        frequency: 'immediate'
      },
      priority: 1,
      createdDate: '2024-01-15',
      lastTriggered: '2024-12-31',
      totalReinvested: 5600000,
      successRate: 95
    },
    {
      id: '2',
      name: 'Đầu tư cố định 2M/tháng',
      type: 'fixed_amount',
      isActive: true,
      conditions: {
        fixedAmount: 2000000,
        targetPackages: ['tech-innovation-fund'],
        frequency: 'monthly'
      },
      priority: 2,
      createdDate: '2024-02-01',
      lastTriggered: '2024-12-01',
      totalReinvested: 22000000,
      successRate: 100
    },
    {
      id: '3',
      name: 'Tái đầu tư khi đạt 5M',
      type: 'threshold',
      isActive: false,
      conditions: {
        threshold: 5000000,
        percentage: 80,
        targetPackages: ['sustainable-agriculture'],
        frequency: 'immediate'
      },
      priority: 3,
      createdDate: '2024-03-10',
      totalReinvested: 800000,
      successRate: 85
    }
  ];

  const reinvestmentHistory: ReinvestmentHistory[] = [
    {
      id: '1',
      date: '2024-12-31',
      sourceAmount: 1580000,
      reinvestedAmount: 1106000,
      targetPackage: 'AquaPure Series B',
      targetCqid: 'CQĐĐT #AQ-2215',
      method: 'auto',
      ruleId: '1',
      status: 'completed',
      notes: 'Tự động theo quy tắc 70%'
    },
    {
      id: '2',
      date: '2024-12-01',
      sourceAmount: 2000000,
      reinvestedAmount: 2000000,
      targetPackage: 'Tech Innovation Fund',
      targetCqid: 'CQĐĐT #TI-1001',
      method: 'auto',
      ruleId: '2',
      status: 'completed',
      notes: 'Đầu tư định kỳ hàng tháng'
    },
    {
      id: '3',
      date: '2024-11-15',
      sourceAmount: 3000000,
      reinvestedAmount: 3000000,
      targetPackage: 'Green Energy Series A',
      targetCqid: 'CQĐĐT #GE-3001',
      method: 'manual',
      status: 'completed',
      notes: 'Đầu tư thủ công vào năng lượng xanh'
    },
    {
      id: '4',
      date: '2024-10-30',
      sourceAmount: 1650000,
      reinvestedAmount: 1155000,
      targetPackage: 'AquaPure Series B',
      targetCqid: 'CQĐĐT #AQ-2216',
      method: 'auto',
      ruleId: '1',
      status: 'completed'
    },
    {
      id: '5',
      date: '2024-10-15',
      sourceAmount: 1200000,
      reinvestedAmount: 0,
      targetPackage: 'Sustainable Agriculture',
      targetCqid: '',
      method: 'auto',
      ruleId: '3',
      status: 'failed',
      notes: 'Gói đầu tư không còn khả dụng'
    }
  ];

  const availablePackages: AvailablePackage[] = [
    {
      id: 'aqua-series-b',
      name: 'AquaPure Series B',
      businessName: 'AquaPure Technologies',
      minInvestment: 1000000,
      expectedReturn: 18.5,
      riskLevel: 'medium',
      sector: 'Công nghệ nước',
      isAvailable: true
    },
    {
      id: 'green-energy-a',
      name: 'Green Energy Series A',
      businessName: 'GreenTech Solutions',
      minInvestment: 2000000,
      expectedReturn: 22.0,
      riskLevel: 'medium',
      sector: 'Năng lượng tái tạo',
      isAvailable: true
    },
    {
      id: 'tech-innovation-fund',
      name: 'Tech Innovation Fund',
      businessName: 'Innovation Ventures',
      minInvestment: 500000,
      expectedReturn: 25.0,
      riskLevel: 'high',
      sector: 'Công nghệ',
      isAvailable: true
    },
    {
      id: 'sustainable-agriculture',
      name: 'Sustainable Agriculture',
      businessName: 'AgriTech Corp',
      minInvestment: 1500000,
      expectedReturn: 16.0,
      riskLevel: 'low',
      sector: 'Nông nghiệp',
      isAvailable: false
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRiskBadge = (risk: string) => {
    const riskConfig = {
      low: { label: 'Thấp', variant: 'default' as const, color: 'text-green-600' },
      medium: { label: 'Trung bình', variant: 'secondary' as const, color: 'text-yellow-600' },
      high: { label: 'Cao', variant: 'destructive' as const, color: 'text-red-600' }
    };

    const config = riskConfig[risk as keyof typeof riskConfig];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Hoàn thành', variant: 'default' as const, icon: CheckCircle },
      pending: { label: 'Đang xử lý', variant: 'secondary' as const, icon: Clock },
      failed: { label: 'Thất bại', variant: 'destructive' as const, icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getMethodBadge = (method: string) => {
    return (
      <Badge variant={method === 'auto' ? 'default' : 'outline'} className="text-xs">
        {method === 'auto' ? (
          <><Zap className="w-3 h-3 mr-1" />Tự động</>
        ) : (
          <>Thủ công</>
        )}
      </Badge>
    );
  };

  const handleToggleRule = (ruleId: string) => {
    toast.success('Đã cập nhật trạng thái quy tắc');
  };

  const handleDeleteRule = (ruleId: string) => {
    toast.success('Đã xóa quy tắc tái đầu tư');
  };

  const handleEditRule = (rule: ReinvestmentRule) => {
    setEditingRule(rule);
    setRuleForm({
      name: rule.name,
      type: rule.type as any,
      percentage: rule.conditions.percentage?.toString() || '',
      fixedAmount: rule.conditions.fixedAmount?.toString() || '',
      threshold: rule.conditions.threshold?.toString() || '',
      minAmount: rule.conditions.minAmount?.toString() || '',
      maxAmount: rule.conditions.maxAmount?.toString() || '',
      targetPackages: rule.conditions.targetPackages || [],
      frequency: rule.conditions.frequency as 'immediate' || 'immediate'
    });
    setShowRuleForm(true);
  };

  const handleSaveRule = () => {
    if (!ruleForm.name) {
      toast.error('Vui lòng nhập tên quy tắc');
      return;
    }

    if (ruleForm.type === 'percentage' && !ruleForm.percentage) {
      toast.error('Vui lòng nhập phần trăm tái đầu tư');
      return;
    }

    if ((ruleForm.type as any) === 'fixed_amount' && !ruleForm.fixedAmount) {
      toast.error('Vui lòng nhập số tiền cố định');
      return;
    }

    if ((ruleForm.type as any) === 'threshold' && !ruleForm.threshold) {
      toast.error('Vui lòng nhập ngưỡng kích hoạt');
      return;
    }

    toast.success(editingRule ? 'Đã cập nhật quy tắc' : 'Đã tạo quy tắc mới');
    setShowRuleForm(false);
    setEditingRule(null);
    setRuleForm({
      name: '',
      type: 'percentage',
      percentage: '',
      fixedAmount: '',
      threshold: '',
      minAmount: '',
      maxAmount: '',
      targetPackages: [],
      frequency: 'immediate'
    });
  };

  const handleManualReinvest = () => {
    if (!manualForm.amount || !manualForm.targetPackage) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const amount = parseFloat(manualForm.amount);
    if (amount > portfolioInfo.availableForReinvestment) {
      toast.error('Số tiền vượt quá số dư khả dụng');
      return;
    }

    toast.success('Đã gửi yêu cầu tái đầu tư thủ công');
    setShowManualForm(false);
    setManualForm({ amount: '', targetPackage: '', notes: '' });
  };

  const handleToggleAutoReinvest = () => {
    toast.success(portfolioInfo.autoReinvestEnabled ? 'Đã tắt tái đầu tư tự động' : 'Đã bật tái đầu tư tự động');
  };

  const totalReinvestedThisYear = reinvestmentHistory
    .filter(h => h.date.startsWith('2024') && h.status === 'completed')
    .reduce((sum, h) => sum + h.reinvestedAmount, 0);

  const autoReinvestmentRate = reinvestmentHistory
    .filter(h => h.method === 'auto').length / reinvestmentHistory.length * 100;

  const successRate = reinvestmentHistory
    .filter(h => h.status === 'completed').length / reinvestmentHistory.length * 100;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hệ thống tái đầu tư</h1>
            <p className="text-muted-foreground">
              {portfolioInfo.cqid} • {portfolioInfo.packageName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch 
                checked={portfolioInfo.autoReinvestEnabled}
                onCheckedChange={handleToggleAutoReinvest}
              />
              <span className="text-sm font-medium">
                Tái đầu tư tự động
              </span>
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Khả dụng tái đầu tư</span>
              </div>
              <p className="text-lg font-semibold mt-1 text-green-600">
                {formatCurrency(portfolioInfo.availableForReinvestment)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tổng đã tái đầu tư</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {formatCurrency(portfolioInfo.totalReinvested)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tái đầu tư năm nay</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {formatCurrency(totalReinvestedThisYear)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tỷ lệ thành công</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {successRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="rules">Quy tắc tự động</TabsTrigger>
            <TabsTrigger value="manual">Tái đầu tư thủ công</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hành động nhanh</CardTitle>
                <CardDescription>
                  Thực hiện các thao tác tái đầu tư phổ biến
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setShowManualForm(true)}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Plus className="w-6 h-6" />
                    <div className="text-center">
                      <p className="font-medium">Tái đầu tư ngay</p>
                      <p className="text-xs opacity-80">Đầu tư thủ công</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setShowRuleForm(true)}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Settings className="w-6 h-6" />
                    <div className="text-center">
                      <p className="font-medium">Tạo quy tắc</p>
                      <p className="text-xs opacity-80">Tự động hóa</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <div className="text-center">
                      <p className="font-medium">Phân tích</p>
                      <p className="text-xs opacity-80">Hiệu quả đầu tư</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Phân bổ tái đầu tư
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tự động</span>
                      <span className="text-sm font-medium">{autoReinvestmentRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={autoReinvestmentRate} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thủ công</span>
                      <span className="text-sm font-medium">{(100 - autoReinvestmentRate).toFixed(1)}%</span>
                    </div>
                    <Progress value={100 - autoReinvestmentRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Hiệu suất quy tắc
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reinvestmentRules.filter(r => r.isActive).map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{rule.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(rule.totalReinvested)}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {rule.successRate}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reinvestmentHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{item.targetPackage}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(item.date)} • {formatCurrency(item.reinvestedAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getMethodBadge(item.method)}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Quy tắc tái đầu tư tự động</h2>
              <Button onClick={() => setShowRuleForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo quy tắc mới
              </Button>
            </div>

            <div className="space-y-4">
              {reinvestmentRules.map((rule) => (
                <Card key={rule.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={rule.isActive}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                        />
                        <div>
                          <h3 className="font-semibold">{rule.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Ưu tiên: {rule.priority} • Tạo: {formatDate(rule.createdDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Điều kiện</p>
                        <p className="font-medium">
                          {rule.type === 'percentage' && `${rule.conditions.percentage}% lợi nhuận`}
                          {rule.type === 'fixed_amount' && formatCurrency(rule.conditions.fixedAmount!)}
                          {rule.type === 'threshold' && `Khi đạt ${formatCurrency(rule.conditions.threshold!)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tổng đã tái đầu tư</p>
                        <p className="font-medium">{formatCurrency(rule.totalReinvested)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tỷ lệ thành công</p>
                        <p className="font-medium">{rule.successRate}%</p>
                      </div>
                    </div>

                    {rule.conditions.targetPackages && rule.conditions.targetPackages.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Gói đầu tư mục tiêu</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.conditions.targetPackages.map((packageId) => {
                            const pkg = availablePackages.find(p => p.id === packageId);
                            return (
                              <Badge key={packageId} variant="outline">
                                {pkg?.name || packageId}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {rule.lastTriggered && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Lần cuối kích hoạt: {formatDate(rule.lastTriggered)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tái đầu tư thủ công</h2>
              <Button onClick={() => setShowManualForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tái đầu tư ngay
              </Button>
            </div>

            {/* Available Packages */}
            <Card>
              <CardHeader>
                <CardTitle>Gói đầu tư khả dụng</CardTitle>
                <CardDescription>
                  Chọn gói đầu tư phù hợp để tái đầu tư
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availablePackages.map((pkg) => (
                    <Card key={pkg.id} className={`${!pkg.isAvailable ? 'opacity-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{pkg.name}</h4>
                            <p className="text-sm text-muted-foreground">{pkg.businessName}</p>
                          </div>
                          {getRiskBadge(pkg.riskLevel)}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Đầu tư tối thiểu:</span>
                            <span className="font-medium">{formatCurrency(pkg.minInvestment)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Lợi nhuận kỳ vọng:</span>
                            <span className="font-medium text-green-600">{pkg.expectedReturn}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Lĩnh vực:</span>
                            <span className="font-medium">{pkg.sector}</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          disabled={!pkg.isAvailable}
                          onClick={() => {
                            setManualForm(prev => ({ ...prev, targetPackage: pkg.id }));
                            setShowManualForm(true);
                          }}
                        >
                          {pkg.isAvailable ? 'Đầu tư ngay' : 'Không khả dụng'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Lịch sử tái đầu tư</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc
                </Button>
                <Button variant="outline" size="sm">
                  Xuất dữ liệu
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {reinvestmentHistory.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{item.targetPackage}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(item.date)} • {item.targetCqid || 'Đang xử lý'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getMethodBadge(item.method)}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nguồn tiền</p>
                        <p className="font-semibold">{formatCurrency(item.sourceAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Số tiền tái đầu tư</p>
                        <p className="font-semibold text-green-600">
                          {item.status === 'failed' ? 'N/A' : formatCurrency(item.reinvestedAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phương thức</p>
                        <p className="font-semibold">
                          {item.method === 'auto' ? (
                            item.ruleId ? `Quy tắc #${item.ruleId}` : 'Tự động'
                          ) : (
                            'Thủ công'
                          )}
                        </p>
                      </div>
                    </div>

                    {item.notes && (
                      <Alert>
                        <Info className="w-4 h-4" />
                        <AlertDescription>{item.notes}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Rule Form Modal */}
        {showRuleForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingRule ? 'Chỉnh sửa quy tắc' : 'Tạo quy tắc mới'}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowRuleForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ruleName">Tên quy tắc</Label>
                    <Input
                      id="ruleName"
                      value={ruleForm.name}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ví dụ: Tái đầu tư 70% lợi nhuận"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ruleType">Loại quy tắc</Label>
                    <select
                      id="ruleType"
                      value={ruleForm.type}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full border rounded px-3 py-2 mt-1"
                    >
                      <option value="percentage">Phần trăm lợi nhuận</option>
                      <option value="fixed_amount">Số tiền cố định</option>
                      <option value="threshold">Ngưỡng kích hoạt</option>
                    </select>
                  </div>

                  {ruleForm.type === 'percentage' && (
                    <div>
                      <Label htmlFor="percentage">Phần trăm tái đầu tư (%)</Label>
                      <Input
                        id="percentage"
                        type="number"
                        value={ruleForm.percentage}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, percentage: e.target.value }))}
                        placeholder="70"
                        min="1"
                        max="100"
                      />
                    </div>
                  )}

                  {(ruleForm.type as any) === 'fixed_amount' && (
                    <div>
                      <Label htmlFor="fixedAmount">Số tiền cố định (VND)</Label>
                      <Input
                        id="fixedAmount"
                        type="number"
                        value={ruleForm.fixedAmount}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, fixedAmount: e.target.value }))}
                        placeholder="2000000"
                      />
                    </div>
                  )}

                  {(ruleForm.type as any) === 'threshold' && (
                    <>
                      <div>
                        <Label htmlFor="threshold">Ngưỡng kích hoạt (VND)</Label>
                        <Input
                          id="threshold"
                          type="number"
                          value={ruleForm.threshold}
                          onChange={(e) => setRuleForm(prev => ({ ...prev, threshold: e.target.value }))}
                          placeholder="5000000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="thresholdPercentage">Phần trăm tái đầu tư khi đạt ngưỡng (%)</Label>
                        <Input
                          id="thresholdPercentage"
                          type="number"
                          value={ruleForm.percentage}
                          onChange={(e) => setRuleForm(prev => ({ ...prev, percentage: e.target.value }))}
                          placeholder="80"
                          min="1"
                          max="100"
                        />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minAmount">Số tiền tối thiểu (VND)</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        value={ruleForm.minAmount}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, minAmount: e.target.value }))}
                        placeholder="1000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxAmount">Số tiền tối đa (VND)</Label>
                      <Input
                        id="maxAmount"
                        type="number"
                        value={ruleForm.maxAmount}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, maxAmount: e.target.value }))}
                        placeholder="10000000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="frequency">Tần suất thực hiện</Label>
                    <select
                      id="frequency"
                      value={ruleForm.frequency}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, frequency: e.target.value as any }))}
                      className="w-full border rounded px-3 py-2 mt-1"
                    >
                      <option value="immediate">Ngay lập tức</option>
                      <option value="monthly">Hàng tháng</option>
                      <option value="quarterly">Hàng quý</option>
                    </select>
                  </div>

                  <div>
                    <Label>Gói đầu tư mục tiêu</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-3">
                      {availablePackages.filter(p => p.isAvailable).map((pkg) => (
                        <label key={pkg.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ruleForm.targetPackages.includes(pkg.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRuleForm(prev => ({
                                  ...prev,
                                  targetPackages: [...prev.targetPackages, pkg.id]
                                }));
                              } else {
                                setRuleForm(prev => ({
                                  ...prev,
                                  targetPackages: prev.targetPackages.filter(id => id !== pkg.id)
                                }));
                              }
                            }}
                          />
                          <span className="text-sm">{pkg.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {pkg.expectedReturn}%
                          </Badge>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSaveRule} className="flex-1">
                    {editingRule ? 'Cập nhật' : 'Tạo quy tắc'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowRuleForm(false)}>
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Reinvestment Form Modal */}
        {showManualForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Tái đầu tư thủ công</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowManualForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">Số dư khả dụng</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(portfolioInfo.availableForReinvestment)}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Số tiền tái đầu tư (VND)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={manualForm.amount}
                      onChange={(e) => setManualForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Nhập số tiền"
                      max={portfolioInfo.availableForReinvestment}
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetPackage">Gói đầu tư</Label>
                    <select
                      id="targetPackage"
                      value={manualForm.targetPackage}
                      onChange={(e) => setManualForm(prev => ({ ...prev, targetPackage: e.target.value }))}
                      className="w-full border rounded px-3 py-2 mt-1"
                    >
                      <option value="">Chọn gói đầu tư</option>
                      {availablePackages.filter(p => p.isAvailable).map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.expectedReturn}% ({formatCurrency(pkg.minInvestment)} tối thiểu)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                    <Textarea
                      id="notes"
                      value={manualForm.notes}
                      onChange={(e) => setManualForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Ghi chú về lý do tái đầu tư..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handleManualReinvest} className="flex-1">
                    Xác nhận tái đầu tư
                  </Button>
                  <Button variant="outline" onClick={() => setShowManualForm(false)}>
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReinvestmentSystem;