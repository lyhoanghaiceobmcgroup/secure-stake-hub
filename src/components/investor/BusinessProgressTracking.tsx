import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Building2,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  Video,
  Bell,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Target,
  DollarSign,
  Hash,
  Eye,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import BlockchainVerifyButton from './BlockchainVerifyButton';

interface BusinessProgressTrackingProps {
  businessId: string;
  packageName: string;
  onClose?: () => void;
}

interface ProgressUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'milestone' | 'financial' | 'operational' | 'market';
  status: 'completed' | 'in_progress' | 'planned';
  reportHash?: string;
  attachments?: {
    id: string;
    name: string;
    type: 'pdf' | 'image' | 'video';
    url: string;
    hash?: string;
  }[];
  metrics?: {
    label: string;
    value: string;
    change?: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  type: 'livestream' | 'ama' | 'presentation';
  status: 'upcoming' | 'live' | 'completed';
  registrationRequired: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  streamUrl?: string;
}

interface QAItem {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  askedDate: string;
  answeredDate?: string;
  status: 'pending' | 'answered' | 'escalated';
  category: 'business' | 'financial' | 'technical' | 'general';
  upvotes: number;
}

const BusinessProgressTracking: React.FC<BusinessProgressTrackingProps> = ({ 
  businessId, 
  packageName, 
  onClose 
}) => {
  const [selectedTab, setSelectedTab] = useState('updates');
  const [followingBusiness, setFollowingBusiness] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Mock data
  const businessInfo = {
    name: 'AquaPure Technologies',
    sector: 'Công nghệ xanh',
    description: 'Phát triển giải pháp lọc nước thông minh cho gia đình và doanh nghiệp',
    foundedYear: 2020,
    employees: 45,
    headquarters: 'TP. Hồ Chí Minh',
    website: 'https://aquapure.vn',
    slaResponseTime: '48 giờ'
  };

  const progressUpdates: ProgressUpdate[] = [
    {
      id: '1',
      date: '2024-12-15T10:00:00Z',
      title: 'Hoàn thành giai đoạn R&D sản phẩm mới',
      description: 'Đã hoàn tất nghiên cứu và phát triển hệ thống lọc nước thông minh thế hệ 3.0 với công nghệ AI tích hợp.',
      category: 'milestone',
      status: 'completed',
      reportHash: '0x9b1f8c7e2a5d3f1b',
      attachments: [
        {
          id: '1',
          name: 'Báo cáo R&D Q4 2024.pdf',
          type: 'pdf',
          url: '/docs/rd_report_q4_2024.pdf',
          hash: '0x7a3c9e1f4b8d2a6c'
        },
        {
          id: '2',
          name: 'Demo sản phẩm 3.0.mp4',
          type: 'video',
          url: '/videos/product_demo_3_0.mp4'
        }
      ],
      metrics: [
        { label: 'Hiệu suất lọc', value: '99.8%', change: '+2.1%', trend: 'up' },
        { label: 'Tiết kiệm năng lượng', value: '35%', change: '+8%', trend: 'up' },
        { label: 'Chi phí sản xuất', value: '-15%', change: '-5%', trend: 'up' }
      ]
    },
    {
      id: '2',
      date: '2024-11-30T14:30:00Z',
      title: 'Mở rộng thị trường miền Bắc',
      description: 'Khai trương văn phòng đại diện tại Hà Nội và ký kết hợp tác với 15 đại lý phân phối.',
      category: 'market',
      status: 'completed',
      reportHash: '0x5e2a8c4f1d9b7e3a',
      metrics: [
        { label: 'Số đại lý mới', value: '15', change: '+15', trend: 'up' },
        { label: 'Doanh thu dự kiến', value: '2.5 tỷ', change: '+25%', trend: 'up' },
        { label: 'Thị phần miền Bắc', value: '8%', change: '+8%', trend: 'up' }
      ]
    },
    {
      id: '3',
      date: '2024-10-15T09:00:00Z',
      title: 'Tăng cường đội ngũ kỹ thuật',
      description: 'Tuyển dụng thêm 12 kỹ sư phần mềm và 8 kỹ sư phần cứng để đáp ứng nhu cầu phát triển.',
      category: 'operational',
      status: 'completed',
      metrics: [
        { label: 'Nhân sự kỹ thuật', value: '32', change: '+20', trend: 'up' },
        { label: 'Năng suất phát triển', value: '+40%', change: '+15%', trend: 'up' }
      ]
    }
  ];

  const upcomingMilestones = [
    {
      id: '1',
      title: 'Ra mắt sản phẩm 3.0',
      description: 'Chính thức giới thiệu hệ thống lọc nước thông minh thế hệ 3.0',
      targetDate: '2025-02-15',
      progress: 85,
      status: 'in_progress' as const
    },
    {
      id: '2',
      title: 'IPO trên sàn UPCoM',
      description: 'Niêm yết cổ phiếu trên sàn giao dịch UPCoM',
      targetDate: '2025-06-30',
      progress: 45,
      status: 'planned' as const
    },
    {
      id: '3',
      title: 'Mở rộng xuất khẩu',
      description: 'Xuất khẩu sản phẩm sang thị trường Đông Nam Á',
      targetDate: '2025-09-30',
      progress: 20,
      status: 'planned' as const
    }
  ];

  const liveEvents: LiveEvent[] = [
    {
      id: '1',
      title: 'AMA với CEO - Chiến lược 2025',
      description: 'Phiên hỏi đáp trực tiếp với CEO về kế hoạch phát triển năm 2025',
      scheduledDate: '2025-01-20T19:00:00Z',
      type: 'ama',
      status: 'upcoming',
      registrationRequired: true,
      maxParticipants: 500,
      currentParticipants: 287
    },
    {
      id: '2',
      title: 'Demo sản phẩm 3.0 trực tiếp',
      description: 'Trình diễn trực tiếp các tính năng mới của hệ thống lọc nước 3.0',
      scheduledDate: '2025-02-10T14:00:00Z',
      type: 'presentation',
      status: 'upcoming',
      registrationRequired: false
    }
  ];

  const qaItems: QAItem[] = [
    {
      id: '1',
      question: 'Khi nào sản phẩm 3.0 sẽ được bán ra thị trường?',
      answer: 'Dự kiến sản phẩm 3.0 sẽ được ra mắt vào tháng 2/2025 và bán ra thị trường từ tháng 3/2025.',
      askedBy: 'Nhà đầu tư A',
      askedDate: '2024-12-10T10:30:00Z',
      answeredDate: '2024-12-11T09:15:00Z',
      status: 'answered',
      category: 'business',
      upvotes: 15
    },
    {
      id: '2',
      question: 'Chi phí R&D cho sản phẩm 3.0 là bao nhiêu?',
      answer: 'Tổng chi phí R&D cho sản phẩm 3.0 là 8.5 tỷ VND, đã được phân bổ trong 18 tháng qua.',
      askedBy: 'Nhà đầu tư B',
      askedDate: '2024-12-08T15:20:00Z',
      answeredDate: '2024-12-09T11:45:00Z',
      status: 'answered',
      category: 'financial',
      upvotes: 12
    },
    {
      id: '3',
      question: 'Kế hoạch mở rộng ra nước ngoài như thế nào?',
      askedBy: 'Nhà đầu tư C',
      askedDate: '2024-12-15T08:00:00Z',
      status: 'pending',
      category: 'business',
      upvotes: 8
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryIcon = (category: ProgressUpdate['category']) => {
    switch (category) {
      case 'milestone': return Target;
      case 'financial': return DollarSign;
      case 'operational': return Users;
      case 'market': return TrendingUp;
      default: return BarChart3;
    }
  };

  const getCategoryColor = (category: ProgressUpdate['category']) => {
    switch (category) {
      case 'milestone': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'operational': return 'bg-purple-100 text-purple-800';
      case 'market': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'planned': return AlertCircle;
      default: return Clock;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
    }
  };

  const handleFollowBusiness = () => {
    setFollowingBusiness(!followingBusiness);
    toast.success(followingBusiness ? 'Đã hủy theo dõi doanh nghiệp' : 'Đã bật theo dõi doanh nghiệp');
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(notificationsEnabled ? 'Đã tắt thông báo' : 'Đã bật thông báo');
  };

  const handleRegisterEvent = (eventId: string) => {
    toast.success('Đã đăng ký tham gia sự kiện thành công');
  };

  const handleAskQuestion = () => {
    toast.success('Câu hỏi đã được gửi. Doanh nghiệp sẽ trả lời trong vòng 48 giờ.');
  };

  const handleVerifyHash = (hash: string) => {
    toast.success(`Đang xác thực blockchain với hash: ${hash}`);
  };

  const handleDownloadDocument = (attachment: any) => {
    toast.success(`Đang tải xuống: ${attachment.name}`);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-golden to-golden-light rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{businessInfo.name}</h1>
              <p className="text-muted-foreground">{packageName} • {businessInfo.sector}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={followingBusiness ? 'default' : 'outline'}
              onClick={handleFollowBusiness}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              {followingBusiness ? 'Đang theo dõi' : 'Theo dõi'}
            </Button>
            <Button
              variant={notificationsEnabled ? 'default' : 'outline'}
              onClick={handleToggleNotifications}
              className="gap-2"
            >
              <Bell className="w-4 h-4" />
              Thông báo
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            )}
          </div>
        </div>

        {/* Business Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Thông tin doanh nghiệp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Năm thành lập</p>
                <p className="font-semibold">{businessInfo.foundedYear}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nhân sự</p>
                <p className="font-semibold">{businessInfo.employees} người</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trụ sở</p>
                <p className="font-semibold">{businessInfo.headquarters}</p>
              </div>
              <div>
                <p className="text-muted-foreground">SLA trả lời</p>
                <p className="font-semibold">{businessInfo.slaResponseTime}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">{businessInfo.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-3 h-3" />
                Website
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="updates">Cập nhật tiến độ</TabsTrigger>
            <TabsTrigger value="milestones">Mốc quan trọng</TabsTrigger>
            <TabsTrigger value="events">Sự kiện</TabsTrigger>
            <TabsTrigger value="qa">Hỏi đáp</TabsTrigger>
          </TabsList>

          {/* Progress Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <div className="space-y-4">
              {progressUpdates.map((update) => {
                const CategoryIcon = getCategoryIcon(update.category);
                const StatusIcon = getStatusIcon(update.status);
                
                return (
                  <Card key={update.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-golden to-golden-light rounded-lg flex items-center justify-center">
                            <CategoryIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{update.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getCategoryColor(update.category)}>
                                {update.category === 'milestone' && 'Mốc quan trọng'}
                                {update.category === 'financial' && 'Tài chính'}
                                {update.category === 'operational' && 'Vận hành'}
                                {update.category === 'market' && 'Thị trường'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(update.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-5 h-5 ${
                            update.status === 'completed' ? 'text-green-600' :
                            update.status === 'in_progress' ? 'text-yellow-600' : 'text-gray-600'
                          }`} />
                          {update.reportHash && (
                            <BlockchainVerifyButton 
                              hash={update.reportHash}
                              timestamp={update.date}
                              type="document"
                            />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{update.description}</p>
                      
                      {/* Metrics */}
                      {update.metrics && update.metrics.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {update.metrics.map((metric, index) => (
                            <div key={index} className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{metric.label}</span>
                                <span className="text-xs">{getTrendIcon(metric.trend)}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold">{metric.value}</span>
                                {metric.change && (
                                  <span className={`text-xs ${
                                    metric.trend === 'up' ? 'text-green-600' :
                                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {metric.change}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Attachments */}
                      {update.attachments && update.attachments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Tài liệu đính kèm</h4>
                          <div className="flex flex-wrap gap-2">
                            {update.attachments.map((attachment) => (
                              <Button
                                key={attachment.id}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleDownloadDocument(attachment)}
                              >
                                {attachment.type === 'pdf' && <FileText className="w-3 h-3" />}
                                {attachment.type === 'video' && <Play className="w-3 h-3" />}
                                {attachment.type === 'image' && <Eye className="w-3 h-3" />}
                                {attachment.name}
                                <Download className="w-3 h-3" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <div className="space-y-4">
              {upcomingMilestones.map((milestone) => {
                const StatusIcon = getStatusIcon(milestone.status);
                
                return (
                  <Card key={milestone.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`w-6 h-6 ${
                            milestone.status === 'in_progress' ? 'text-yellow-600' : 'text-gray-600'
                          }`} />
                          <div>
                            <h3 className="font-semibold">{milestone.title}</h3>
                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {formatDate(milestone.targetDate)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Tiến độ</span>
                          <span className="font-medium">{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="space-y-4">
              {liveEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          {event.type === 'livestream' && <Video className="w-5 h-5 text-white" />}
                          {event.type === 'ama' && <MessageSquare className="w-5 h-5 text-white" />}
                          {event.type === 'presentation' && <Play className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(event.scheduledDate)}
                            </div>
                            {event.maxParticipants && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.currentParticipants}/{event.maxParticipants}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={event.status === 'live' ? 'destructive' : 'outline'}
                          className={event.status === 'live' ? 'animate-pulse' : ''}
                        >
                          {event.status === 'upcoming' && 'Sắp diễn ra'}
                          {event.status === 'live' && 'Đang live'}
                          {event.status === 'completed' && 'Đã kết thúc'}
                        </Badge>
                        {event.status === 'upcoming' && (
                          <Button 
                            size="sm"
                            onClick={() => handleRegisterEvent(event.id)}
                          >
                            {event.registrationRequired ? 'Đăng ký' : 'Tham gia'}
                          </Button>
                        )}
                        {event.status === 'live' && (
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Tham gia ngay
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Q&A Tab */}
          <TabsContent value="qa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Đặt câu hỏi mới
                </CardTitle>
                <CardDescription>
                  Doanh nghiệp cam kết trả lời trong vòng {businessInfo.slaResponseTime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAskQuestion} className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Đặt câu hỏi
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {qaItems.map((qa) => (
                <Card key={qa.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{qa.question}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Bởi {qa.askedBy}</span>
                            <span>{formatDate(qa.askedDate)}</span>
                            <Badge variant="outline" className={getCategoryColor(
                              qa.category === 'business' ? 'operational' :
                              qa.category === 'technical' ? 'milestone' :
                              qa.category === 'general' ? 'market' : 'financial'
                            )}>
                              {qa.category === 'business' && 'Kinh doanh'}
                              {qa.category === 'financial' && 'Tài chính'}
                              {qa.category === 'technical' && 'Kỹ thuật'}
                              {qa.category === 'general' && 'Chung'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={qa.status === 'answered' ? 'default' : 'secondary'}
                          >
                            {qa.status === 'answered' && 'Đã trả lời'}
                            {qa.status === 'pending' && 'Chờ trả lời'}
                            {qa.status === 'escalated' && 'Đã chuyển lên'}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <span>{qa.upvotes}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              👍
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {qa.answer && (
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Trả lời từ doanh nghiệp</Badge>
                            <span className="text-sm text-muted-foreground">
                              {qa.answeredDate && formatDate(qa.answeredDate)}
                            </span>
                          </div>
                          <p className="text-sm">{qa.answer}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessProgressTracking;