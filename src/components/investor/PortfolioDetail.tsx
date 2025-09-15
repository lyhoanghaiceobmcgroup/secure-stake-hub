import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Download,
  Shield,
  Bell,
  Calendar,
  TrendingUp,
  Building2,
  QrCode,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ExternalLink,
  Hash,
  Target,
  DollarSign,
  BarChart3,
  Users,
  Flag,
  FileCheck
} from 'lucide-react';
import { toast } from 'sonner';
import UyTinBadge from './UyTinBadge';
import BusinessProgressTracking from './BusinessProgressTracking';
import DistributionSchedule from './DistributionSchedule';
import ReinvestmentSystem from './ReinvestmentSystem';

import BlockchainVerification from './BlockchainVerification';

interface PortfolioDetailProps {
  cqid: string;
  onClose: () => void;
}

interface TimelineEvent {
  id: string;
  date: string;
  type: 'contribution' | 'esign' | 'certificate' | 'distribution' | 'progress';
  title: string;
  description: string;
  amount?: number;
  status: 'completed' | 'pending' | 'processing';
  hash?: string;
  documentUrl?: string;
}

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'appendix' | 'statement' | 'report';
  uploadDate: string;
  hash: string;
  url: string;
  size: string;
}

const PortfolioDetail: React.FC<PortfolioDetailProps> = ({ cqid, onClose }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    distribution: true,
    progress: true,
    email: true,
    app: true
  });
  const [showBusinessProgress, setShowBusinessProgress] = useState(false);
  const [showDistributionSchedule, setShowDistributionSchedule] = useState(false);
  const [showReinvestmentSystem, setShowReinvestmentSystem] = useState(false);
  const [showReportsDocuments, setShowReportsDocuments] = useState(false);
  const [showBlockchainVerification, setShowBlockchainVerification] = useState(false);

  // Mock data for portfolio detail
  const portfolioData = {
    cqid: 'CQĐĐT #AQ-2214',
    packageName: 'AquaPure Series A',
    businessName: 'AquaPure Technologies',
    sector: 'Công nghệ xanh',
    contributionAmount: 50000000,
    targetRate: 12.5,
    actualRateYTD: 11.8,
    term: '24 tháng',
    joinDate: '2024-08-15',
    effectiveDate: '2024-08-20',
    nextDistributionDate: '2025-02-15',
    estimatedDistribution: 1560000,
    uyTinScore: 85,
    qrLink: '/qr/aq-2214',
    contractHash: '0x9b1f8c7e2a5d3f1b',
    status: 'active' as const
  };

  const uyTinBreakdown = {
    business: { score: 22, max: 25, label: 'Kinh doanh' },
    utility: { score: 18, max: 20, label: 'Tiện ích' },
    financial: { score: 23, max: 25, label: 'Tài chính' },
    future: { score: 22, max: 30, label: 'Tương lai' }
  };

  const timeline: TimelineEvent[] = [
    {
      id: '1',
      date: '2024-08-20T10:30:00Z',
      type: 'certificate',
      title: 'Cấp CQĐĐT',
      description: 'Chứng quyền đại diện đầu tư đã được cấp và ghi nhận',
      status: 'completed',
      hash: '0x9b1f8c7e2a5d3f1b'
    },
    {
      id: '2',
      date: '2024-08-18T14:20:00Z',
      type: 'esign',
      title: 'Hoàn tất eSign',
      description: 'Hợp đồng góp vốn đã được ký điện tử bởi tất cả các bên',
      status: 'completed',
      hash: '0x7a3c9e1f4b8d2a6c',
      documentUrl: '/docs/contract_aq_2214.pdf'
    },
    {
      id: '3',
      date: '2024-08-15T09:15:00Z',
      type: 'contribution',
      title: 'Góp vốn đồng hành',
      description: 'Số tiền góp vốn đã được ghi nhận và chuyển sang trạng thái tạm giữ',
      amount: 50000000,
      status: 'completed',
      hash: '0x5e2a8c4f1d9b7e3a'
    }
  ];

  const documents: Document[] = [
    {
      id: '1',
      name: 'Hợp đồng góp vốn AquaPure Series A',
      type: 'contract',
      uploadDate: '2024-08-18',
      hash: '0x7a3c9e1f4b8d2a6c',
      url: '/docs/contract_aq_2214.pdf',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Phụ lục điều khoản đặc biệt',
      type: 'appendix',
      uploadDate: '2024-08-18',
      hash: '0x3f7b1e9c5a2d8f4e',
      url: '/docs/appendix_aq_2214.pdf',
      size: '856 KB'
    },
    {
      id: '3',
      name: 'Tài liệu tiến độ Q3/2024',
      type: 'report',
      uploadDate: '2024-09-30',
      hash: '0x8d4a2f6e1c9b5e7a',
      url: '/docs/progress_q3_2024.pdf',
      size: '1.8 MB'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimelineIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'contribution': return DollarSign;
      case 'esign': return FileCheck;
      case 'certificate': return Shield;
      case 'distribution': return TrendingUp;
      case 'progress': return BarChart3;
      default: return CheckCircle;
    }
  };

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleNotificationToggle = (type: keyof typeof notificationsEnabled) => {
    setNotificationsEnabled(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast.success('Cài đặt thông báo đã được cập nhật');
  };

  const handleVerifyBlockchain = (hash: string) => {
    toast.success(`Đang xác thực blockchain với hash: ${hash}`);
  };

  const handleDownloadDocument = (doc: Document) => {
    toast.success(`Đang tải xuống: ${doc.name}`);
  };

  const handleFollowBusiness = () => {
    setShowBusinessProgress(true);
    toast.success('Đã bật theo dõi doanh nghiệp AquaPure Technologies');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{portfolioData.cqid}</h1>
              <p className="text-blue-100">{portfolioData.packageName}</p>
              <p className="text-blue-200 text-sm">{portfolioData.businessName}</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-lg p-3 mb-2">
                <QrCode className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs">QR xác thực</p>
              </div>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="documents">Tài liệu</TabsTrigger>
              <TabsTrigger value="buff">Uy tín</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Investment Summary */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Thông tin đầu tư
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Số tiền góp vốn</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(portfolioData.contributionAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tỷ suất mục tiêu</p>
                        <p className="text-xl font-bold text-green-600">
                          {portfolioData.targetRate}%/năm
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Thực tế YTD</p>
                        <p className="text-lg font-semibold text-green-500">
                          {portfolioData.actualRateYTD}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Kỳ hạn</p>
                        <p className="text-lg font-semibold">{portfolioData.term}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày tham gia</p>
                        <p className="font-medium">{formatDate(portfolioData.joinDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày hiệu lực</p>
                        <p className="font-medium">{formatDate(portfolioData.effectiveDate)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Kỳ phân phối tiếp theo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày dự kiến</p>
                      <p className="font-semibold">{formatDate(portfolioData.nextDistributionDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ước tính số tiền</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(portfolioData.estimatedDistribution)}
                      </p>
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Phân phối phụ thuộc kết quả kinh doanh. Con số hiển thị là ước tính.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hành động nên làm ngay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleFollowBusiness}>
                      <Users className="w-4 h-4" />
                      Theo dõi doanh nghiệp
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowDistributionSchedule(true)}>
                      <Bell className="w-4 h-4" />
                      Bật thông báo kỳ phân phối
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowReinvestmentSystem(true)}>
                      <TrendingUp className="w-4 h-4" />
                      Tái đầu tư
                    </Button>

                    <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowBlockchainVerification(true)}>
                      <Shield className="w-4 h-4" />
                      Xác thực blockchain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Lịch sử giao dịch
                  </CardTitle>
                  <CardDescription>
                    Theo dõi các mốc quan trọng trong quá trình đầu tư
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {timeline.map((event, index) => {
                      const Icon = getTimelineIcon(event.type);
                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`p-2 rounded-full ${getStatusColor(event.status)} bg-gray-100`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            {index < timeline.length - 1 && (
                              <div className="w-px h-12 bg-gray-200 mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold">{event.title}</h4>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(event.date)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.description}
                            </p>
                            {event.amount && (
                              <p className="text-sm font-semibold text-blue-600">
                                {formatCurrency(event.amount)}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {event.hash && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleVerifyBlockchain(event.hash!)}
                                >
                                  <Hash className="w-3 h-3 mr-1" />
                                  {event.hash.substring(0, 10)}...
                                </Button>
                              )}
                              {event.documentUrl && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Xem tài liệu
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Tài liệu & Hợp đồng
                  </CardTitle>
                  <CardDescription>
                    Tất cả tài liệu liên quan đến khoản đầu tư của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium">{doc.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(doc.uploadDate)} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerifyBlockchain(doc.hash)}
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Uy tín Tab */}
            <TabsContent value="buff" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Điểm Uy tín Breakdown
                  </CardTitle>
                  <CardDescription>
                    Phân tích chi tiết điểm Uy tín của dự án
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <UyTinBadge score={portfolioData.uyTinScore} size="lg" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Điểm tổng: {portfolioData.uyTinScore}/100
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(uyTinBreakdown).map(([key, data]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{data.label}</span>
                          <span className="text-sm text-muted-foreground">
                            {data.score}/{data.max}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.score / data.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Cài đặt thông báo
                  </CardTitle>
                  <CardDescription>
                    Quản lý thông báo cho khoản đầu tư này
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="distribution-notify">Thông báo kỳ phân phối</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo trước ngày phân phối lợi ích
                        </p>
                      </div>
                      <Switch
                        id="distribution-notify"
                        checked={notificationsEnabled.distribution}
                        onCheckedChange={() => handleNotificationToggle('distribution')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="progress-notify">Cập nhật tiến độ</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo về tiến độ doanh nghiệp
                        </p>
                      </div>
                      <Switch
                        id="progress-notify"
                        checked={notificationsEnabled.progress}
                        onCheckedChange={() => handleNotificationToggle('progress')}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notify">Thông báo Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Gửi thông báo qua email
                        </p>
                      </div>
                      <Switch
                        id="email-notify"
                        checked={notificationsEnabled.email}
                        onCheckedChange={() => handleNotificationToggle('email')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-notify">Thông báo trong ứng dụng</Label>
                        <p className="text-sm text-muted-foreground">
                          Hiển thị thông báo trong ứng dụng
                        </p>
                      </div>
                      <Switch
                        id="app-notify"
                        checked={notificationsEnabled.app}
                        onCheckedChange={() => handleNotificationToggle('app')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    )
    
    {/* Business Progress Tracking Modal */}
    {showBusinessProgress && (
      <BusinessProgressTracking
        businessId={portfolioData.cqid}
        packageName={portfolioData.packageName}
        onClose={() => setShowBusinessProgress(false)}
      />
    )}
    
    {/* Distribution Schedule Modal */}
    {showDistributionSchedule && (
      <DistributionSchedule
        cqid={portfolioData.cqid}
        onClose={() => setShowDistributionSchedule(false)}
      />
    )}
    
    {/* Reinvestment System Modal */}
    {showReinvestmentSystem && (
      <ReinvestmentSystem
        cqid={portfolioData.cqid}
        onClose={() => setShowReinvestmentSystem(false)}
      />
    )}
    
    {/* Reports Documents Modal */}
    {showReportsDocuments && (
      <div className="space-y-4">
        <h3 className="font-medium">Reports & Documents</h3>
        <p>No reports available for CQID: {portfolioData.cqid}</p>
      </div>
    )}
    
    {/* Blockchain Verification Modal */}
    {showBlockchainVerification && (
      <BlockchainVerification
        cqid={portfolioData.cqid}
        onClose={() => setShowBlockchainVerification(false)}
      />
    )}
};

export default PortfolioDetail;