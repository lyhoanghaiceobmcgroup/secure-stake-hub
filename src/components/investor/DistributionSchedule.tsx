import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  DollarSign,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  CreditCard,
  Download,
  Eye,
  Hash
} from 'lucide-react';
import { toast } from 'sonner';

interface DistributionScheduleProps {
  cqid: string;
  onClose?: () => void;
}

interface DistributionPeriod {
  id: string;
  period: string;
  scheduledDate: string;
  cutoffDate: string;
  estimatedAmount: number;
  actualAmount?: number;
  status: 'upcoming' | 'processing' | 'completed' | 'delayed';
  notes?: string;
  statementHash?: string;
  reminderEnabled: boolean;
}

interface NotificationSettings {
  email: boolean;
  app: boolean;
  sms: boolean;
  reminderDays: number;
}

const DistributionSchedule: React.FC<DistributionScheduleProps> = ({ cqid, onClose }) => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    app: true,
    sms: false,
    reminderDays: 7
  });

  // Mock data for distribution schedule
  const portfolioInfo = {
    cqid: 'CQĐĐT #AQ-2214',
    packageName: 'AquaPure Series A',
    businessName: 'AquaPure Technologies',
    contributionAmount: 50000000,
    targetRate: 12.5,
    term: '24 tháng',
    joinDate: '2024-08-15'
  };

  const distributionSchedule: DistributionPeriod[] = [
    {
      id: '1',
      period: 'Kỳ 1 - Q4/2024',
      scheduledDate: '2024-12-31',
      cutoffDate: '2024-12-25',
      estimatedAmount: 1560000,
      actualAmount: 1580000,
      status: 'completed',
      notes: 'Đã chi trả đúng hạn',
      statementHash: '0x7b2e91f8c3d4a1b9',
      reminderEnabled: true
    },
    {
      id: '2',
      period: 'Kỳ 2 - Q1/2025',
      scheduledDate: '2025-03-31',
      cutoffDate: '2025-03-25',
      estimatedAmount: 1620000,
      actualAmount: 1650000,
      status: 'completed',
      notes: 'Vượt kế hoạch 1.9%',
      statementHash: '0x9c4f82e1a7b5d3f2',
      reminderEnabled: true
    },
    {
      id: '3',
      period: 'Kỳ 3 - Q2/2025',
      scheduledDate: '2025-06-30',
      cutoffDate: '2025-06-25',
      estimatedAmount: 1580000,
      status: 'processing',
      notes: 'Đang xử lý thanh toán',
      reminderEnabled: true
    },
    {
      id: '4',
      period: 'Kỳ 4 - Q3/2025',
      scheduledDate: '2025-09-30',
      cutoffDate: '2025-09-25',
      estimatedAmount: 1600000,
      status: 'upcoming',
      reminderEnabled: true
    },
    {
      id: '5',
      period: 'Kỳ 5 - Q4/2025',
      scheduledDate: '2025-12-31',
      cutoffDate: '2025-12-25',
      estimatedAmount: 1640000,
      status: 'upcoming',
      reminderEnabled: false
    },
    {
      id: '6',
      period: 'Kỳ 6 - Q1/2026',
      scheduledDate: '2026-03-31',
      cutoffDate: '2026-03-25',
      estimatedAmount: 1660000,
      status: 'upcoming',
      reminderEnabled: false
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Đã chi trả', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      processing: { label: 'Đang xử lý', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      upcoming: { label: 'Sắp tới', variant: 'outline' as const, icon: Calendar, color: 'text-blue-600' },
      delayed: { label: 'Chậm trễ', variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  const getDaysUntilDate = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleToggleReminder = (periodId: string) => {
    toast.success('Đã cập nhật cài đặt nhắc lịch');
  };

  const handleUpdateNotifications = (key: keyof NotificationSettings, value: boolean | number) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Đã cập nhật cài đặt thông báo');
  };

  const handleViewStatement = (hash: string) => {
    toast.success(`Đang mở sao kê với hash: ${hash}`);
  };

  const handleDownloadStatement = (periodId: string) => {
    toast.success('Đang tải xuống sao kê');
  };

  const handleChangeAccountInfo = () => {
    toast.info('Chuyển đến trang cài đặt tài khoản');
  };

  const nextDistribution = distributionSchedule.find(d => d.status === 'upcoming' || d.status === 'processing');
  const completedDistributions = distributionSchedule.filter(d => d.status === 'completed');
  const totalReceived = completedDistributions.reduce((sum, d) => sum + (d.actualAmount || 0), 0);
  const totalEstimated = distributionSchedule.reduce((sum, d) => sum + d.estimatedAmount, 0);

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Lịch & Kết quả phân phối</h1>
            <p className="text-muted-foreground">
              {portfolioInfo.cqid} • {portfolioInfo.packageName}
            </p>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Đã nhận</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {formatCurrency(totalReceived)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tổng ước tính</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {formatCurrency(totalEstimated)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Kỳ đã chi</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {completedDistributions.length}/{distributionSchedule.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Kỳ tiếp theo</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {nextDistribution ? getDaysUntilDate(nextDistribution.scheduledDate) + ' ngày' : '—'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Next Distribution Alert */}
        {nextDistribution && (
          <Alert className="mb-6">
            <Calendar className="w-4 h-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Kỳ phân phối tiếp theo:</strong> {formatDate(nextDistribution.scheduledDate)} 
                  (Ước tính: {formatCurrency(nextDistribution.estimatedAmount)})
                  <br />
                  <span className="text-sm text-muted-foreground">
                    Cutoff thay đổi STK: {formatDate(nextDistribution.cutoffDate)}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleChangeAccountInfo}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Đổi STK
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Distribution Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Lịch phân phối
                </CardTitle>
                <CardDescription>
                  Phân phối phụ thuộc kết quả kinh doanh. Số tiền hiển thị là ước tính.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {distributionSchedule.map((period) => {
                    const daysUntil = getDaysUntilDate(period.scheduledDate);
                    const isUpcoming = daysUntil > 0 && period.status === 'upcoming';
                    const isCutoffSoon = getDaysUntilDate(period.cutoffDate) <= 7 && getDaysUntilDate(period.cutoffDate) > 0;

                    return (
                      <div key={period.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{period.period}</h4>
                            <p className="text-sm text-muted-foreground">
                              Ngày chi trả: {formatDate(period.scheduledDate)}
                            </p>
                          </div>
                          {getStatusBadge(period.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Ước tính</p>
                            <p className="font-semibold">{formatCurrency(period.estimatedAmount)}</p>
                          </div>
                          {period.actualAmount && (
                            <div>
                              <p className="text-sm text-muted-foreground">Thực nhận</p>
                              <p className="font-semibold text-green-600">
                                {formatCurrency(period.actualAmount)}
                              </p>
                            </div>
                          )}
                        </div>

                        {period.notes && (
                          <p className="text-sm text-muted-foreground mb-3">{period.notes}</p>
                        )}

                        {isCutoffSoon && (
                          <Alert className="mb-3">
                            <AlertTriangle className="w-4 h-4" />
                            <AlertDescription>
                              Hạn chót thay đổi STK: {formatDate(period.cutoffDate)} 
                              ({getDaysUntilDate(period.cutoffDate)} ngày nữa)
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {period.status === 'completed' && period.statementHash && (
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewStatement(period.statementHash!)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Xem sao kê
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDownloadStatement(period.id)}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Tải xuống
                                </Button>
                              </div>
                            )}
                            {period.statementHash && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="gap-1"
                                onClick={() => toast.success(`Xác thực hash: ${period.statementHash}`)}
                              >
                                <Hash className="w-3 h-3" />
                                {period.statementHash.slice(0, 8)}...
                              </Button>
                            )}
                          </div>
                          
                          {isUpcoming && (
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`reminder-${period.id}`} className="text-sm">
                                Nhắc lịch
                              </Label>
                              <Switch
                                id={`reminder-${period.id}`}
                                checked={period.reminderEnabled}
                                onCheckedChange={() => handleToggleReminder(period.id)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notification Settings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Cài đặt thông báo
                </CardTitle>
                <CardDescription>
                  Quản lý thông báo về kỳ phân phối
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notify">Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi thông báo qua email
                    </p>
                  </div>
                  <Switch
                    id="email-notify"
                    checked={notificationSettings.email}
                    onCheckedChange={(value) => handleUpdateNotifications('email', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-notify">Ứng dụng</Label>
                    <p className="text-sm text-muted-foreground">
                      Thông báo trong ứng dụng
                    </p>
                  </div>
                  <Switch
                    id="app-notify"
                    checked={notificationSettings.app}
                    onCheckedChange={(value) => handleUpdateNotifications('app', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notify">SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi tin nhắn SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notify"
                    checked={notificationSettings.sms}
                    onCheckedChange={(value) => handleUpdateNotifications('sms', value)}
                  />
                </div>

                <Separator />

                <div>
                  <Label>Nhắc trước</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Số ngày nhắc trước kỳ phân phối
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 7, 14].map((days) => (
                      <Button
                        key={days}
                        variant={notificationSettings.reminderDays === days ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateNotifications('reminderDays', days)}
                      >
                        {days} ngày
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    Thông báo sẽ được gửi tự động theo lịch đã cài đặt. 
                    Bạn có thể thay đổi cài đặt bất kỳ lúc nào.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Cài đặt tài khoản
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={handleChangeAccountInfo}
                >
                  <CreditCard className="w-4 h-4" />
                  Thay đổi thông tin STK
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Lưu ý: Thay đổi STK phải thực hiện trước ngày cutoff của mỗi kỳ
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionSchedule;