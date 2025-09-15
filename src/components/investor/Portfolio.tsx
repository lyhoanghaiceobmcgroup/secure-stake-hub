import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PortfolioService, { InvestmentData } from "@/services/portfolioService";
import { 
  TrendingUp, 
  Filter, 
  Download, 
  Eye, 
  Copy, 
  QrCode,
  FileText,
  Calendar,
  Shield,
  RefreshCcw,
  ArrowRightLeft,
  MessageSquare,
  Info,
  ChevronRight,
  Building2,
  Clock,
  DollarSign,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Pause
} from "lucide-react";
import { cn } from "@/lib/utils";
import BlockchainVerifyButton from "./BlockchainVerifyButton";
import ProgressCard from "./ProgressCard";
import PayoutSchedule from "./PayoutSchedule";
import PortfolioDetail from "./PortfolioDetail";

// Sử dụng InvestmentData từ PortfolioService
type Holding = InvestmentData;

interface DistributionRecord {
  period: string;
  scheduledDate: string;
  actualDate?: string;
  estimateAmount: number;
  actualAmount?: number;
  status: 'scheduled' | 'processing' | 'settled' | 'delayed' | 'failed';
  docHash?: string;
  notes?: string;
}

interface Document {
  id: string;
  type: 'contract' | 'appendix' | 'report' | 'payout' | 'statement';
  name: string;
  version: string;
  docHash: string;
  qrLink: string;
  url: string;
  uploadedAt: string;
}

const Portfolio = () => {
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'grouped'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEasyMode, setIsEasyMode] = useState(false);
  const [selectedCqid, setSelectedCqid] = useState<string>('');
  const [isPortfolioDetailOpen, setIsPortfolioDetailOpen] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolioOverview, setPortfolioOverview] = useState({
    totalValue: 0,
    totalDistribution: 0,
    actualRateYTD: 0,
    portfolioUyTin: 0
  });
  // Removed sidebar-related states as we use InvestorApp layout

  const portfolioService = PortfolioService.getInstance();

  // Removed mobile detection as we use InvestorApp layout

  // Load dữ liệu từ PortfolioService
  useEffect(() => {
    const loadPortfolioData = () => {
      const data = portfolioService.getPortfolioData();
      const summary = portfolioService.getPortfolioSummary();
      setHoldings(data);
      setPortfolioOverview(summary);
    };

    // Load dữ liệu ban đầu
    loadPortfolioData();

    // Đăng ký listener để cập nhật khi có thay đổi
    portfolioService.addListener(loadPortfolioData);

    // Cleanup listener khi component unmount
    return () => {
      portfolioService.removeListener(loadPortfolioData);
    };
  }, []);

  // Removed menu items as we use InvestorApp navigation

  // Holdings data được load từ PortfolioService thông qua useEffect

  const distributionHistory: Record<string, DistributionRecord[]> = {
    "1": [
      {
        period: "2025-07",
        scheduledDate: "2025-07-31",
        actualDate: "2025-07-31",
        estimateAmount: 1900000,
        actualAmount: 1900000,
        status: "settled",
        docHash: "a91c7",
        notes: "Phân phối đúng hạn"
      },
      {
        period: "2025-08",
        scheduledDate: "2025-08-31",
        actualDate: "2025-08-31",
        estimateAmount: 1950000,
        actualAmount: 1950000,
        status: "settled",
        docHash: "9b17e",
        notes: "Phân phối đúng hạn"
      },
      {
        period: "2025-09",
        scheduledDate: "2025-09-30",
        estimateAmount: 1950000,
        status: "scheduled"
      }
    ]
  };

  const documents: Record<string, Document[]> = {
    "1": [
      {
        id: "1",
        type: "contract",
        name: "Hợp đồng góp vốn đồng hành",
        version: "v1.2",
        docHash: "3fe4ac",
        qrLink: "https://verify.goldenbook.vn/doc/3fe4ac",
        url: "/documents/contract-aq-2214.pdf",
        uploadedAt: "2025-06-10"
      },
      {
        id: "2",
        type: "report",
        name: "Tài liệu tiến độ 08/2025",
        version: "v1.0",
        docHash: "7b2e91",
        qrLink: "https://verify.goldenbook.vn/doc/7b2e91",
        url: "/documents/progress-aq-08-2025.pdf",
        uploadedAt: "2025-08-31"
      }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'upcoming': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'closed': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'transferred': return <ArrowRightLeft className="w-4 h-4 text-purple-500" />;
      default: return <Pause className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      upcoming: "secondary", 
      closed: "outline",
      transferred: "secondary"
    } as const;
    
    const labels = {
      active: "Đang hoạt động",
      upcoming: "Sắp kỳ",
      closed: "Đã tất toán", 
      transferred: "Đã chuyển nhượng"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status as keyof typeof labels] || status}</span>
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredHoldings = holdings.filter(holding => {
    const statusMatch = filterStatus === 'all' || holding.status === filterStatus;
    const sectorMatch = filterSector === 'all' || holding.sector === filterSector;
    return statusMatch && sectorMatch;
  });

  const handleViewDetail = (holding: Holding) => {
    setSelectedCqid(holding.cqid);
    setIsPortfolioDetailOpen(true);
  };

  const renderHoldingCard = (holding: Holding) => (
    <Card key={holding.id} className="hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-blue-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold text-gray-900 truncate">{holding.companyName}</CardTitle>
              <p className="text-sm text-gray-600 truncate">{holding.packageName}</p>
              <p className="text-xs text-gray-500 mt-1">CQID: {holding.cqid}</p>
            </div>
          </div>
          {getStatusBadge(holding.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Số tiền góp</p>
            <p className="font-semibold text-gray-900 text-sm">{formatCurrency(holding.amountContributed)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Đã nhận</p>
            <p className="font-semibold text-green-700 text-sm">{formatCurrency(holding.distributionReceived)}</p>
          </div>
        </div>
        
        {/* Performance */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600">Hiệu suất</p>
            <Badge variant="outline" className="gap-1 text-xs">
              <Shield className="w-3 h-3" />
              {holding.uyTinScore}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Mục tiêu</p>
              <p className="font-medium text-sm">{holding.targetRate}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Thực tế</p>
              <p className={cn("font-medium text-sm", 
                holding.actualRateYTD > holding.targetRate ? "text-green-600" : 
                holding.actualRateYTD < holding.targetRate ? "text-red-600" : "text-blue-600"
              )}>
                {(holding.actualRateYTD && !isNaN(holding.actualRateYTD) && holding.actualRateYTD > 0) ? `${holding.actualRateYTD}%` : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Next Payout */}
        {holding.nextPayoutDate && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3 text-amber-600" />
              <p className="text-xs font-medium text-amber-800">Kỳ phân phối tiếp theo</p>
            </div>
            <p className="text-sm text-amber-700">
              {formatDate(holding.nextPayoutDate)} • {formatCurrency(holding.nextPayoutEstimate)}
            </p>
          </div>
        )}
        
        {/* Action Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleViewDetail(holding)}
          className="w-full gap-2 group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Xem chi tiết
          <ChevronRight className="w-4 h-4 ml-auto" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderDetailDialog = () => {
    if (!selectedHolding) return null;

    const holdingDistributions = distributionHistory[selectedHolding.id] || [];
    const holdingDocuments = documents[selectedHolding.id] || [];

    return (
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-golden to-golden-light rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl">
                  {selectedHolding.companyName} - {selectedHolding.packageName}
                </DialogTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="gap-1">
                    CQĐĐT: {selectedHolding.cqid}
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </Badge>
                  <BlockchainVerifyButton 
                    hash={selectedHolding.lastProgressHash}
                    timestamp={new Date().toISOString()}
                    type="certificate"
                  />
                </div>
              </div>
              {getStatusBadge(selectedHolding.status)}
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="progress">Tiến độ</TabsTrigger>
              <TabsTrigger value="distributions">Phân phối</TabsTrigger>
              <TabsTrigger value="documents">Tài liệu</TabsTrigger>
              <TabsTrigger value="actions">Hành động</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Số tiền góp</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">
                      {formatCurrency(selectedHolding.amountContributed)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Phân phối nhận</span>
                    </div>
                    <p className="text-lg font-semibold text-green-600 mt-1">
                      {formatCurrency(selectedHolding.distributionReceived)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Tỷ suất thực tế</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">
                      {(selectedHolding.actualRateYTD && !isNaN(selectedHolding.actualRateYTD) && selectedHolding.actualRateYTD > 0) ? `${selectedHolding.actualRateYTD}%` : "—"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Điểm Uy tín</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">{selectedHolding.uyTinScore}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Thông tin chi tiết</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ngày tham gia:</span>
                    <span className="ml-2 font-medium">{formatDate(selectedHolding.joinDate)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ngành:</span>
                    <span className="ml-2 font-medium">{selectedHolding.sector}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tỷ suất mục tiêu:</span>
                    <span className="ml-2 font-medium">{selectedHolding.targetRate}%/năm</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kỳ phân phối:</span>
                    <span className="ml-2 font-medium">Hàng tháng</span>
                  </div>
                </div>
              </div>

              {selectedHolding.nextPayoutDate && (
                <Alert>
                  <Calendar className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Kỳ phân phối tiếp theo:</strong> {formatDate(selectedHolding.nextPayoutDate)} 
                    (Ước tính: {formatCurrency(selectedHolding.nextPayoutEstimate)})
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <ProgressCard 
                title="Tiến độ thực hiện dự án"
                updates={[
                  {
                    period: "08/2025",
                    percent: 85,
                    note: "Hoàn tất lắp đặt hệ thống RO 2.0, đạt công suất 95% theo kế hoạch",
                    media: ["/progress/aquapure-08-2025-1.jpg", "/progress/aquapure-08-2025-2.jpg"],
                    reportHash: "7b2e91f",
                    timestamp: "2025-08-31T10:00:00Z"
                  }
                ]}
              />
            </TabsContent>

            <TabsContent value="distributions" className="space-y-4">
              <PayoutSchedule 
                schedule={holdingDistributions.map(dist => ({
                  period: dist.period,
                  scheduledDate: dist.scheduledDate,
                  actualDate: dist.actualDate,
                  amount: dist.actualAmount || dist.estimateAmount,
                  status: dist.status === 'settled' ? 'completed' : 
                         dist.status === 'delayed' ? 'overdue' : 
                         dist.status as 'scheduled' | 'processing' | 'completed' | 'overdue',
                  docHash: dist.docHash,
                  note: dist.notes
                }))}
              />
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="grid gap-4">
                {holdingDocuments.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.version} • {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <BlockchainVerifyButton 
                            hash={doc.docHash}
                            timestamp={doc.uploadedAt}
                            type="document"
                          />
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-1" />
                              Tải
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid gap-4">
                <Button className="justify-start gap-2" disabled={selectedHolding.status !== 'active'}>
                  <RefreshCcw className="w-4 h-4" />
                  Tái đầu tư thông minh
                </Button>
                
                <Button variant="outline" className="justify-start gap-2">
                  <ArrowRightLeft className="w-4 h-4" />
                  Đổi chứng chỉ
                  <Badge variant="secondary" className="ml-auto">Sắp có</Badge>
                </Button>
                
                <Button variant="outline" className="justify-start gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Mở ticket hỗ trợ
                </Button>
                
                <Button variant="outline" className="justify-start gap-2">
                  <Download className="w-4 h-4" />
                  Tải gói tài liệu
                </Button>
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Một số tính năng đang trong quá trình phát triển và sẽ được cập nhật sớm.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  if (isEasyMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Sổ của tôi</h1>
          <Button onClick={() => setIsEasyMode(false)} variant="outline">
            Chế độ bình thường
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Xem tiến độ</h2>
            <p>Theo dõi tiến độ các dự án bạn đã góp vốn</p>
            <Button className="mt-4">Xem chi tiết</Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lịch phân phối</h2>
            <p>Xem lịch nhận phân phối lợi ích từ các dự án</p>
            <Button className="mt-4">Xem lịch</Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tài liệu</h2>
            <p>Tải xuống hợp đồng và tài liệu liên quan</p>
            <Button className="mt-4">Xem tài liệu</Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tái đầu tư</h2>
            <p>Thiết lập tái đầu tư tự động cho phân phối nhận được</p>
            <Button className="mt-4">Cài đặt</Button>
          </Card>
        </div>
      </div>
    );
  }

  // Easy mode view
  if (isEasyMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sổ của tôi</h2>
            <p className="text-gray-600 mt-1">
              Giao diện dễ hiểu - Quản lý đầu tư đơn giản
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsEasyMode(false)}>
            <Eye className="w-4 h-4 mr-2" />
            Giao diện Chuyên nghiệp
          </Button>
        </div>
        
        {/* Portfolio Overview */}
        {renderPortfolioOverview()}
        
        {/* Holdings Section */}
        <div className="mt-8">
          {renderFiltersAndHoldings()}
        </div>
      </div>
    );
  }

  // Normal view - just return content without layout wrapper
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sổ của tôi</h2>
          <p className="text-gray-600 mt-1">
            Quản lý Chứng chỉ quyền lợi đầu tư (CQĐĐT) và theo dõi hiệu quả
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsEasyMode(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Giao diện Dễ hiểu
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất danh mục
          </Button>
        </div>
      </div>
      
      {/* Portfolio Overview */}
      {renderPortfolioOverview()}
      
      {/* Holdings Section */}
      <div className="mt-8">
        {renderFiltersAndHoldings()}
      </div>
    </div>
  );

  function renderFiltersAndHoldings() {
    return (
      <>
      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Bộ lọc:</span>
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="upcoming">Sắp kỳ</SelectItem>
              <SelectItem value="closed">Đã tất toán</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSector} onValueChange={setFilterSector}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tất cả ngành" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ngành</SelectItem>
              <SelectItem value="real-estate">Bất động sản</SelectItem>
              <SelectItem value="agriculture">Nông nghiệp</SelectItem>
              <SelectItem value="energy">Năng lượng</SelectItem>
              <SelectItem value="technology">Công nghệ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="rounded-r-none"
            >
              Thẻ
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-l-none border-l"
            >
              Bảng
            </Button>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      {filteredHoldings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Không tìm thấy khoản đầu tư nào.</p>
        </div>
      ) : viewMode === 'table' ? (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Dự án</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Số tiền đầu tư</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Tỷ suất mục tiêu</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Trạng thái</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHoldings.map((holding, index) => (
                    <tr key={holding.cqid} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {holding.projectName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{holding.projectName}</div>
                            <div className="text-sm text-muted-foreground">{holding.cqid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{holding.investmentAmount.toLocaleString()} VND</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-green-600">{holding.targetRate}%/năm</div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusVariant(holding.status)}>
                          {getStatusText(holding.status)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedHolding(holding);
                              setIsDetailDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCqid(holding.cqid);
                              setIsPortfolioDetailOpen(true);
                            }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHoldings.map(renderHoldingCard)}
        </div>
      )}

      {/* Detail Dialog */}
      {renderDetailDialog()}

      {/* Portfolio Detail */}
      {isPortfolioDetailOpen && selectedCqid && (
        <PortfolioDetail 
          cqid={selectedCqid}
          onClose={() => setIsPortfolioDetailOpen(false)}
        />
      )}

      {/* Legal Disclaimer */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-2">Tuyên bố pháp lý</p>
              <p className="leading-relaxed">
                Tỷ suất phân phối mục tiêu do Doanh nghiệp công bố; phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế. 
                GoldenBook không cam kết lợi nhuận cố định và không phải sàn chứng khoán.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
    );
  }
  function renderPortfolioOverview() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Tổng giá trị</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(portfolioOverview.totalValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="ml-2 text-sm font-medium">Phân phối YTD</span>
            </div>
            <p className="text-2xl font-bold mt-2 text-green-600">
              {formatCurrency(portfolioOverview.totalDistribution)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Tỷ suất thực tế</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {portfolioOverview.actualRateYTD}%/năm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Uy tín danh mục</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {portfolioOverview.portfolioUyTin}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default Portfolio;