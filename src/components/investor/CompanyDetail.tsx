import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Bell,
  BellOff,
  Calendar,
  FileText,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
  ExternalLink,
  Heart,
  Share2,
  Flag,
  ThumbsUp,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import UyTinBadge from "./UyTinBadge";
import BlockchainVerifyButton from "./BlockchainVerifyButton";

interface CompanyDetailProps {
  companyId: string;
  onBack: () => void;
}

interface QAItem {
  id: string;
  question: string;
  answer?: string;
  upvotes: number;
  createdAt: string;
  answeredAt?: string;
  tags: string[];
  isOfficialAnswer: boolean;
}

interface Event {
  id: string;
  title: string;
  type: 'livestream' | 'ama' | 'webinar';
  startsAt: string;
  registered: number;
  questionsCount: number;
  replayUrl?: string;
  documents: Array<{
    name: string;
    hash: string;
    url: string;
  }>;
}

const CompanyDetail = ({ companyId, onBack }: CompanyDetailProps) => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [hasNotification, setHasNotification] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock company data
  const company = {
    id: companyId,
    name: "AquaPure JSC",
    logo: "/placeholder.svg",
    sector: "Sản xuất",
    description: "Công ty sản xuất hệ thống lọc nước tiên tiến",
    uyTinScore: 86,
    uyTinPillars: { B: 88, U: 85, Fd: 87, Fl: 84 },
    onTimeUpdate: 96,
    payoutOnTime: 94,
    debtAge: 12,
    followers: 12540,
    totalRaised: "125 tỷ VNĐ",
    currentProjects: 3,
    lastUpdate: "2025-08-29"
  };

  const progressUpdates = [
    {
      period: "08/2025",
      percent: 85,
      note: "Hoàn tất lắp đặt dây chuyền lọc RO 2.0; nghiệm thu PCCC xong",
      media: ["progress1.jpg", "progress2.jpg", "video.mp4"],
      reportHash: "9b1...7e",
      timestamp: "2025-08-29T10:30:00Z"
    },
    {
      period: "07/2025", 
      percent: 70,
      note: "Tiến độ xây dựng nhà máy giai đoạn 2 đạt 70%",
      media: ["construction1.jpg", "construction2.jpg"],
      reportHash: "8a2...6d",
      timestamp: "2025-07-31T15:20:00Z"
    }
  ];

  const payoutHistory = [
    {
      period: "08/2025",
      targetRate: 0.85,
      actualRate: 0.83,
      amount: "2.1 tỷ VNĐ", 
      recipients: 2138,
      status: "settled",
      settledAt: "2025-08-31T16:45:00Z",
      docHash: "5a0...d4"
    },
    {
      period: "07/2025",
      targetRate: 0.85,
      actualRate: 0.87,
      amount: "2.3 tỷ VNĐ",
      recipients: 2089,
      status: "settled", 
      settledAt: "2025-07-31T17:12:00Z",
      docHash: "4b1...e5"
    }
  ];

  const qaItems: QAItem[] = [
    {
      id: "1",
      question: "Kỳ 09/2025 có điều chỉnh lịch không?",
      answer: "Không. Dự kiến 30/09 như kế hoạch.",
      upvotes: 126,
      createdAt: "2025-09-01T09:15:00Z",
      answeredAt: "2025-09-02T10:30:00Z",
      tags: ["phân phối", "lịch kỳ"],
      isOfficialAnswer: true
    },
    {
      id: "2",
      question: "Sao kê thanh toán kỳ 08/2025 tải ở đâu?",
      answer: "Trong 'Tài liệu' → Sao kê 08/2025 (PDF, DocHash #5a0…d4).",
      upvotes: 93,
      createdAt: "2025-08-31T20:45:00Z", 
      answeredAt: "2025-09-01T08:20:00Z",
      tags: ["tài liệu", "sao kê"],
      isOfficialAnswer: true
    }
  ];

  const upcomingEvents: Event[] = [
    {
      id: "1",
      title: "Livestream AMA - Kế hoạch Q4/2025",
      type: "ama",
      startsAt: "2025-09-05T19:30:00Z",
      registered: 1538,
      questionsCount: 247,
      documents: [
        {
          name: "Kế hoạch Q4/2025",
          hash: "1c2...9a",
          url: "/docs/q4-plan.pdf"
        }
      ]
    }
  ];

  const documents = [
    {
      id: "1",
      name: "Tài liệu tiến độ 08/2025",
      type: "report",
      uploadedAt: "2025-08-29T10:30:00Z",
      hash: "9b1...7e",
      size: "2.1 MB",
      isVerified: true
    },
    {
      id: "2", 
      name: "Sao kê phân phối 08/2025",
      type: "statement",
      uploadedAt: "2025-08-31T16:45:00Z",
      hash: "5a0...d4", 
      size: "856 KB",
      isVerified: true
    }
  ];

  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Company Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <img 
                src={company.logo} 
                alt={company.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{company.name}</h2>
                <p className="text-muted-foreground">{company.description}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{company.totalRaised}</div>
                <div className="text-xs text-muted-foreground">Tổng gọi vốn</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{company.currentProjects}</div>
                <div className="text-xs text-muted-foreground">Dự án đang triển khai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{company.followers.toLocaleString('vi-VN')}</div>
                <div className="text-xs text-muted-foreground">Người theo dõi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{company.onTimeUpdate}%</div>
                <div className="text-xs text-muted-foreground">Đúng hạn cập nhật</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Cập nhật gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressUpdates.slice(0, 2).map((update, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/50 border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Tiến độ {update.period}</h4>
                    <p className="text-sm text-muted-foreground">{update.note}</p>
                  </div>
                  <Badge variant="outline">{update.percent}%</Badge>
                </div>
                <Progress value={update.percent} className="mb-2" />
                <div className="flex items-center gap-2">
                  {update.reportHash && (
                    <BlockchainVerifyButton
                      hash={update.reportHash}
                      timestamp={update.timestamp}
                      type="document"
                      size="sm"
                    />
                  )}
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="w-3 h-3" />
                    Xem tài liệu
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Uy tín Score Breakdown */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Điểm Uy tín</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <UyTinBadge score={company.uyTinScore} size="lg" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Minh bạch (B)</span>
                <div className="flex items-center gap-2">
                  <Progress value={company.uyTinPillars.B} className="w-20 h-2" />
                  <span className="text-sm font-semibold">{company.uyTinPillars.B}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sử dụng vốn (U)</span>
                <div className="flex items-center gap-2">
                  <Progress value={company.uyTinPillars.U} className="w-20 h-2" />
                  <span className="text-sm font-semibold">{company.uyTinPillars.U}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Độ tin cậy (Fd)</span>
                <div className="flex items-center gap-2">
                  <Progress value={company.uyTinPillars.Fd} className="w-20 h-2" />
                  <span className="text-sm font-semibold">{company.uyTinPillars.Fd}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Thanh khoản (Fl)</span>
                <div className="flex items-center gap-2">
                  <Progress value={company.uyTinPillars.Fl} className="w-20 h-2" />
                  <span className="text-sm font-semibold">{company.uyTinPillars.Fl}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Uy tín là chỉ số tham khảo do GoldenBook tính toán; không phải tư vấn đầu tư.
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Chỉ số minh bạch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{company.onTimeUpdate}%</div>
              <div className="text-xs text-muted-foreground">Cập nhật đúng hạn (12 tháng)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{company.payoutOnTime}%</div>
              <div className="text-xs text-muted-foreground">Kỳ phân phối đúng kế hoạch</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{company.debtAge}</div>
              <div className="text-xs text-muted-foreground">Tuổi công nợ (ngày)</div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sự kiện sắp diễn ra
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.map((event) => (
              <div key={event.id} className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">{event.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.startsAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.registered.toLocaleString('vi-VN')} đăng ký
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {event.questionsCount} câu hỏi
                  </span>
                </div>
                <Button size="sm" className="w-full">
                  Đăng ký tham gia
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const PayoutTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">94%</div>
            <div className="text-xs text-muted-foreground">Kỳ đúng hạn</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">0.84%</div>
            <div className="text-xs text-muted-foreground">Tỷ suất TB/tháng</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-xs text-muted-foreground">Kỳ phân phối</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Lịch sử phân phối</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {payoutHistory.map((payout, index) => (
            <div key={index} className="p-4 rounded-lg border bg-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">Kỳ {payout.period}</h4>
                  <p className="text-sm text-muted-foreground">
                    Tỷ suất thực tế: {(payout.actualRate * 100).toFixed(2)}% 
                    {payout.actualRate >= payout.targetRate ? (
                      <CheckCircle className="inline w-4 h-4 ml-1 text-green-500" />
                    ) : (
                      <AlertTriangle className="inline w-4 h-4 ml-1 text-yellow-500" />
                    )}
                  </p>
                </div>
                <Badge variant={payout.status === 'settled' ? 'secondary' : 'outline'}>
                  {payout.status === 'settled' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-sm text-muted-foreground">Số tiền</div>
                  <div className="font-semibold">{payout.amount}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Người nhận</div>
                  <div className="font-semibold">{payout.recipients.toLocaleString('vi-VN')}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {payout.docHash && (
                  <BlockchainVerifyButton
                    hash={payout.docHash}
                    timestamp={payout.settledAt || ''}
                    type="document"
                    size="sm"
                  />
                )}
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="w-3 h-3" />
                  Sao kê chi tiết
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const QATab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hỏi đáp công khai</h3>
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          Đặt câu hỏi
        </Button>
      </div>

      <div className="space-y-4">
        {qaItems.map((qa) => (
          <Card key={qa.id} className="glass-card">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">{qa.question}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(qa.createdAt).toLocaleDateString('vi-VN')}
                    <div className="flex gap-1">
                      {qa.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {qa.answer && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {qa.isOfficialAnswer ? 'Giải đáp chính thức' : 'Trả lời'}
                      </Badge>
                      {qa.answeredAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(qa.answeredAt).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{qa.answer}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    Hữu ích ({qa.upvotes})
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="glass-card">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{doc.name}</h4>
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                  </div>
                  {doc.isVerified && (
                    <Badge variant="secondary" className="text-xs">
                      Đã xác thực
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Tải lên: {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                </div>
                
                <div className="flex items-center gap-2">
                  <BlockchainVerifyButton
                    hash={doc.hash}
                    timestamp={doc.uploadedAt}
                    type="document"
                    size="sm"
                  />
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="w-3 h-3" />
                    Tải về
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="text-muted-foreground">{company.sector}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHasNotification(!hasNotification)}
          >
            {hasNotification ? 
              <Bell className="w-4 h-4 text-primary" /> : 
              <BellOff className="w-4 h-4" />
            }
          </Button>
          <Button
            variant={isFollowing ? "outline" : "default"}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            <Star className={cn("w-4 h-4 mr-2", isFollowing && "fill-current")} />
            {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </Button>
          <Button>
            <MessageCircle className="w-4 h-4 mr-2" />
            Mở ticket
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="progress">Tiến độ & KH</TabsTrigger>
          <TabsTrigger value="payout">Phân phối & Lịch kỳ</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="qa">Hỏi đáp</TabsTrigger>
          <TabsTrigger value="events">Sự kiện</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <div className="space-y-4">
            {progressUpdates.map((update, index) => (
              <Card key={index} className="glass-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Tiến độ {update.period}</CardTitle>
                    <Badge variant="outline">{update.percent}% hoàn thành</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={update.percent} className="w-full" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Cập nhật:</h4>
                    <p className="text-sm text-muted-foreground">{update.note}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {update.reportHash && (
                      <BlockchainVerifyButton
                        hash={update.reportHash}
                        timestamp={update.timestamp}
                        type="document"
                      />
                    )}
                    <Button variant="outline" size="sm" className="gap-1">
                      <FileText className="w-3 h-3" />
                      Tài liệu chi tiết
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="payout" className="space-y-6">
          <PayoutTab />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <DocumentsTab />
        </TabsContent>
        
        <TabsContent value="qa" className="space-y-6">
          <QATab />
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <div className="grid gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(event.startsAt).toLocaleString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.registered.toLocaleString('vi-VN')} đăng ký
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {event.questionsCount} câu hỏi
                    </span>
                  </div>
                  
                  {event.documents.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Tài liệu kèm theo:</h4>
                      <div className="space-y-2">
                        {event.documents.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <FileText className="w-3 h-3" />
                              {doc.name}
                            </Button>
                            <BlockchainVerifyButton
                              hash={doc.hash}
                              timestamp={event.startsAt}
                              type="document"
                              size="sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button>Đăng ký tham gia</Button>
                    <Button variant="outline">Đặt câu hỏi trước</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetail;