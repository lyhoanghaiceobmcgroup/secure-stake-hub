import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Building2, 
  Clock, 
  TrendingUp, 
  FileText,
  Eye,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import UyTinBadge from "./UyTinBadge";
import InvestmentFlow from "./InvestmentFlow";
import OpportunityDetail from "./OpportunityDetail";
import { cn } from "@/lib/utils";

interface BusinessInfo {
  foundedYear: number;
  employees: number;
  headquarters: string;
  website: string;
  description: string;
  keyAchievements: string[];
  leadership: {
    ceo: string;
    cfo: string;
    cto?: string;
  };
  financials: {
    revenue2023: number;
    revenue2022: number;
    profit2023: number;
    profit2022: number;
    assets: number;
    equity: number;
  };
  certifications: string[];
  partnerships: string[];
  marketPosition: string;
  competitiveAdvantages: string[];
}

interface InvestmentOpportunity {
  id: string;
  companyName: string;
  projectName: string;
  description: string;
  targetRate: number;
  payoutFrequency: 'monthly' | 'quarterly' | 'yearly';
  minInvestment: number;
  totalTarget: number;
  raised: number;
  sector: string;
  duration: string;
  uyTinScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  documents: string[];
  deadline: string;
  status: 'open' | 'closing_soon' | 'closed';
  businessInfo: BusinessInfo;
  projectDetails: {
    timeline: string;
    expectedROI: string;
    marketSize: string;
    riskFactors: string[];
    mitigationStrategies: string[];
  };
  investmentUse: {
    breakdown: { category: string; percentage: number; amount: number }[];
    milestones: { phase: string; timeline: string; description: string }[];
  };
}

const OpportunityExplorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    sector: "all",
    duration: "all",
    minInvestment: [0],
    targetRate: [0, 100],
    uyTinScore: [70],
    riskLevel: "all"
  });
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [isInvestmentFlowOpen, setIsInvestmentFlowOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Mock data
  const opportunities: InvestmentOpportunity[] = [
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
      documents: ["Tài liệu khả thi", "BCTC 2023", "Giấy phép đầu tư"],
      deadline: "2025-01-31",
      status: 'open',
      businessInfo: {
        foundedYear: 2018,
        employees: 245,
        headquarters: "TP. Hồ Chí Minh",
        website: "https://greenenergy.vn",
        description: "Công ty hàng đầu Việt Nam về giải pháp năng lượng tái tạo, chuyên phát triển và vận hành các dự án điện mặt trời, điện gió quy mô lớn.",
        keyAchievements: [
          "Vận hành thành công 15 dự án điện mặt trời với tổng công suất 300MW",
          "Đạt chứng nhận ISO 14001:2015 về quản lý môi trường",
          "Top 10 doanh nghiệp năng lượng tái tạo Việt Nam 2023",
          "Hợp tác chiến lược với 3 tập đoàn năng lượng quốc tế"
        ],
        leadership: {
          ceo: "Nguyễn Văn Minh - 15 năm kinh nghiệm ngành năng lượng",
          cfo: "Trần Thị Lan - CPA, MBA Tài chính",
          cto: "Lê Hoàng Nam - Tiến sĩ Kỹ thuật Điện"
        },
        financials: {
          revenue2023: 1250000000000,
          revenue2022: 980000000000,
          profit2023: 187500000000,
          profit2022: 147000000000,
          assets: 3200000000000,
          equity: 1800000000000
        },
        certifications: ["ISO 9001:2015", "ISO 14001:2015", "OHSAS 18001", "IEC 61215"],
        partnerships: ["Trina Solar", "Huawei Technologies", "ABB Group", "Schneider Electric"],
        marketPosition: "Thứ 3 thị trường điện mặt trời Việt Nam",
        competitiveAdvantages: [
          "Công nghệ tiên tiến từ các đối tác quốc tế",
          "Đội ngũ kỹ thuật giàu kinh nghiệm",
          "Mạng lưới phân phối rộng khắp",
          "Chi phí vận hành thấp nhất ngành"
        ]
      },
      projectDetails: {
        timeline: "Q1/2025 - Q4/2026",
        expectedROI: "12.5%/năm trong 20 năm",
        marketSize: "Thị trường điện mặt trời Việt Nam: 16.5 tỷ USD",
        riskFactors: [
          "Biến động chính sách năng lượng",
          "Thay đổi giá điện quốc gia",
          "Rủi ro thời tiết và thiên tai"
        ],
        mitigationStrategies: [
          "Hợp đồng mua bán điện dài hạn 20 năm",
          "Bảo hiểm toàn diện cho dự án",
          "Đa dạng hóa địa điểm lắp đặt"
        ]
      },
      investmentUse: {
        breakdown: [
          { category: "Thiết bị pin mặt trời", percentage: 45, amount: 900000000 },
          { category: "Hạ tầng và xây dựng", percentage: 30, amount: 600000000 },
          { category: "Thiết bị điện và truyền tải", percentage: 15, amount: 300000000 },
          { category: "Vốn lưu động", percentage: 10, amount: 200000000 }
        ],
        milestones: [
          { phase: "Giai đoạn 1", timeline: "Q1-Q2/2025", description: "Hoàn thành thiết kế và chuẩn bị mặt bằng" },
          { phase: "Giai đoạn 2", timeline: "Q3-Q4/2025", description: "Lắp đặt thiết bị và hạ tầng" },
          { phase: "Giai đoạn 3", timeline: "Q1/2026", description: "Vận hành thử nghiệm và điều chỉnh" },
          { phase: "Giai đoạn 4", timeline: "Q2/2026", description: "Vận hành thương mại chính thức" }
        ]
      }
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
      documents: ["Hợp đồng xuất khẩu", "BCTC 2023", "Kế hoạch mở rộng"],
      deadline: "2025-02-15",
      status: 'closing_soon',
      businessInfo: {
        foundedYear: 2015,
        employees: 1200,
        headquarters: "Bình Dương",
        website: "https://techmanufacturing.com.vn",
        description: "Nhà sản xuất linh kiện điện tử hàng đầu Việt Nam, chuyên cung cấp cho các thương hiệu công nghệ toàn cầu như Samsung, LG, Sony.",
        keyAchievements: [
          "Xuất khẩu 2.5 tỷ USD linh kiện điện tử năm 2023",
          "Đối tác chiến lược của 15 thương hiệu công nghệ quốc tế",
          "Chứng nhận ISO 9001, ISO 14001, IATF 16949",
          "Giải thưởng Doanh nghiệp xuất khẩu xuất sắc 2023"
        ],
        leadership: {
          ceo: "Phạm Minh Tuấn - 20 năm kinh nghiệm sản xuất công nghệ",
          cfo: "Nguyễn Thị Hương - CPA, 15 năm kinh nghiệm tài chính",
          cto: "David Kim - Chuyên gia công nghệ từ Samsung"
        },
        financials: {
          revenue2023: 2800000000000,
          revenue2022: 2200000000000,
          profit2023: 420000000000,
          profit2022: 330000000000,
          assets: 4500000000000,
          equity: 2700000000000
        },
        certifications: ["ISO 9001:2015", "ISO 14001:2015", "IATF 16949", "RoHS", "REACH"],
        partnerships: ["Samsung Electronics", "LG Electronics", "Sony Corporation", "Panasonic", "Foxconn"],
        marketPosition: "Top 5 nhà sản xuất linh kiện điện tử Đông Nam Á",
        competitiveAdvantages: [
          "Công nghệ sản xuất tự động hóa cao",
          "Đội ngũ R&D 200+ kỹ sư",
          "Hệ thống quản lý chất lượng nghiêm ngặt",
          "Chi phí sản xuất cạnh tranh"
        ]
      },
      projectDetails: {
        timeline: "Q2/2025 - Q3/2026",
        expectedROI: "15.8%/năm với đơn hàng đã ký kết",
        marketSize: "Thị trường linh kiện điện tử toàn cầu: 450 tỷ USD",
        riskFactors: [
          "Biến động giá nguyên liệu",
          "Cạnh tranh từ các nhà sản xuất Trung Quốc",
          "Thay đổi chính sách thương mại quốc tế"
        ],
        mitigationStrategies: [
          "Hợp đồng dài hạn với nhà cung cấp nguyên liệu",
          "Đa dạng hóa thị trường xuất khẩu",
          "Đầu tư R&D để nâng cao giá trị sản phẩm"
        ]
      },
      investmentUse: {
        breakdown: [
          { category: "Máy móc thiết bị sản xuất", percentage: 50, amount: 2500000000 },
          { category: "Xây dựng nhà xưởng mới", percentage: 25, amount: 1250000000 },
          { category: "Công nghệ và R&D", percentage: 15, amount: 750000000 },
          { category: "Vốn lưu động", percentage: 10, amount: 500000000 }
        ],
        milestones: [
          { phase: "Giai đoạn 1", timeline: "Q2-Q3/2025", description: "Xây dựng nhà xưởng và chuẩn bị hạ tầng" },
          { phase: "Giai đoạn 2", timeline: "Q4/2025-Q1/2026", description: "Lắp đặt dây chuyền sản xuất" },
          { phase: "Giai đoạn 3", timeline: "Q2/2026", description: "Chạy thử và đào tạo nhân viên" },
          { phase: "Giai đoạn 4", timeline: "Q3/2026", description: "Sản xuất thương mại và xuất khẩu" }
        ]
      }
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
      documents: ["Quy hoạch chi tiết", "Giấy phép xây dựng", "Nghiên cứu thị trường"],
      deadline: "2025-03-01",
      status: 'open',
      businessInfo: {
        foundedYear: 2012,
        employees: 450,
        headquarters: "Hà Nội",
        website: "https://realestate-dev.vn",
        description: "Công ty phát triển bất động sản hàng đầu miền Bắc, chuyên các dự án khu đô thị cao cấp và bất động sản nghỉ dưỡng.",
        keyAchievements: [
          "Phát triển thành công 8 khu đô thị với tổng diện tích 2,000 ha",
          "Bàn giao hơn 15,000 căn hộ và biệt thự cao cấp",
          "Top 10 nhà phát triển bất động sản uy tín Việt Nam",
          "Giải thưởng Dự án bất động sản tốt nhất 2023"
        ],
        leadership: {
          ceo: "Lê Văn Thành - 25 năm kinh nghiệm bất động sản",
          cfo: "Hoàng Thị Mai - CPA, MBA Tài chính Bất động sản",
          cto: "Nguyễn Đức Anh - Kiến trúc sư trưởng"
        },
        financials: {
          revenue2023: 3500000000000,
          revenue2022: 2800000000000,
          profit2023: 525000000000,
          profit2022: 420000000000,
          assets: 12000000000000,
          equity: 4200000000000
        },
        certifications: ["ISO 9001:2015", "LEED Gold", "Green Building Council", "FIABCI"],
        partnerships: ["CapitaLand", "Novaland", "Vingroup", "Masterise Homes", "Sun Group"],
        marketPosition: "Top 5 nhà phát triển bất động sản cao cấp Việt Nam",
        competitiveAdvantages: [
          "Kinh nghiệm phát triển dự án quy mô lớn",
          "Mạng lưới đối tác quốc tế",
          "Thiết kế kiến trúc độc đáo và bền vững",
          "Hệ thống quản lý dự án chuyên nghiệp"
        ]
      },
      projectDetails: {
        timeline: "Q2/2025 - Q1/2028",
        expectedROI: "18.2%/năm từ bán hàng và cho thuê",
        marketSize: "Thị trường bất động sản Việt Nam: 180 tỷ USD",
        riskFactors: [
          "Biến động chính sách bất động sản",
          "Thay đổi lãi suất ngân hàng",
          "Rủi ro pháp lý và thủ tục"
        ],
        mitigationStrategies: [
          "Tuân thủ nghiêm ngặt quy định pháp luật",
          "Đa dạng hóa sản phẩm và phân khúc",
          "Hợp tác với các ngân hàng uy tín"
        ]
      },
      investmentUse: {
        breakdown: [
          { category: "Đầu tư hạ tầng và xây dựng", percentage: 60, amount: 6000000000 },
          { category: "Chi phí thiết kế và quy hoạch", percentage: 15, amount: 1500000000 },
          { category: "Marketing và bán hàng", percentage: 15, amount: 1500000000 },
          { category: "Vốn lưu động", percentage: 10, amount: 1000000000 }
        ],
        milestones: [
          { phase: "Giai đoạn 1", timeline: "Q2-Q4/2025", description: "Hoàn thiện pháp lý và chuẩn bị mặt bằng" },
          { phase: "Giai đoạn 2", timeline: "Q1-Q4/2026", description: "Xây dựng hạ tầng kỹ thuật" },
          { phase: "Giai đoạn 3", timeline: "Q1-Q4/2027", description: "Xây dựng các khu nhà ở và tiện ích" },
          { phase: "Giai đoạn 4", timeline: "Q1/2028", description: "Hoàn thiện và bàn giao" }
        ]
      }
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
      documents: ["Whitepaper", "Demo sản phẩm", "Kế hoạch kinh doanh"],
      deadline: "2025-02-15",
      status: 'open',
      businessInfo: {
        foundedYear: 2019,
        employees: 180,
        headquarters: "TP. Hồ Chí Minh",
        website: "https://fintech-innovation.vn",
        description: "Công ty công nghệ tài chính hàng đầu Việt Nam, chuyên phát triển các giải pháp thanh toán số và AI.",
        keyAchievements: [
          "Xử lý hơn 50 triệu giao dịch/tháng",
          "Phục vụ 2.5 triệu người dùng hoạt động",
          "Đối tác của 15 ngân hàng lớn tại Việt Nam",
          "Giải thưởng Fintech của năm 2023"
        ],
        leadership: {
          ceo: "Trần Minh Tuấn - Cựu VP Engineering Grab Financial",
          cfo: "Lê Thị Hương - CFA, 15 năm kinh nghiệm tài chính",
          cto: "Nguyễn Văn Đức - PhD AI, cựu Google"
        },
        financials: {
          revenue2023: 450000000000,
          revenue2022: 280000000000,
          profit2023: 90000000000,
          profit2022: 42000000000,
          assets: 800000000000,
          equity: 600000000000
        },
        certifications: ["PCI DSS Level 1", "ISO 27001", "SOC 2 Type II", "GDPR Compliant"],
        partnerships: ["Vietcombank", "BIDV", "Techcombank", "MoMo", "ZaloPay"],
        marketPosition: "Top 3 nền tảng Fintech Việt Nam",
        competitiveAdvantages: [
          "Công nghệ AI tiên tiến trong phân tích rủi ro",
          "Hệ thống bảo mật đa lớp",
          "API mở dễ tích hợp",
          "Đội ngũ kỹ thuật chất lượng cao"
        ]
      },
      projectDetails: {
        timeline: "Q1/2025 - Q4/2026",
        expectedROI: "22.5%/năm từ phí giao dịch và dịch vụ",
        marketSize: "Thị trường Fintech Đông Nam Á: 12 tỷ USD",
        riskFactors: [
          "Cạnh tranh gay gắt từ các ông lớn",
          "Thay đổi quy định về fintech",
          "Rủi ro công nghệ và bảo mật"
        ],
        mitigationStrategies: [
          "Đầu tư mạnh vào R&D và bảo mật",
          "Xây dựng quan hệ đối tác chiến lược",
          "Tuân thủ nghiêm ngặt quy định"
        ]
      },
      investmentUse: {
        breakdown: [
          { category: "Phát triển sản phẩm và AI", percentage: 45, amount: 900000000 },
          { category: "Marketing và mở rộng thị trường", percentage: 25, amount: 500000000 },
          { category: "Nhân sự và đào tạo", percentage: 20, amount: 400000000 },
          { category: "Hạ tầng và bảo mật", percentage: 10, amount: 200000000 }
        ],
        milestones: [
          { phase: "Giai đoạn 1", timeline: "Q1-Q2/2025", description: "Hoàn thiện MVP và thử nghiệm beta" },
          { phase: "Giai đoạn 2", timeline: "Q3-Q4/2025", description: "Ra mắt sản phẩm và onboard đối tác" },
          { phase: "Giai đoạn 3", timeline: "Q1-Q3/2026", description: "Mở rộng thị trường và tính năng" },
          { phase: "Giai đoạn 4", timeline: "Q4/2026", description: "Đạt break-even và chuẩn bị IPO" }
        ]
      }
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.round((raised / target) * 100);
  };

  const getStatusBadge = (status: InvestmentOpportunity['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="text-green-600 border-green-600">Đang mở</Badge>;
      case 'closing_soon':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Sắp đóng</Badge>;
      case 'closed':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Đã đóng</Badge>;
    }
  };

  const getPayoutFrequencyText = (frequency: InvestmentOpportunity['payoutFrequency']) => {
    switch (frequency) {
      case 'monthly':
        return 'Hàng tháng';
      case 'quarterly':
        return 'Hàng quý';
      case 'yearly':
        return 'Hàng năm';
    }
  };

  const getRiskBadge = (riskLevel: InvestmentOpportunity['riskLevel']) => {
    switch (riskLevel) {
      case 'low':
        return <Badge variant="outline" className="text-green-600 border-green-600">Thấp</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Trung bình</Badge>;
      case 'high':
        return <Badge variant="outline" className="text-red-600 border-red-600">Cao</Badge>;
    }
  };

  const handleInvestClick = (opportunity: InvestmentOpportunity) => {
    setSelectedOpportunity(opportunity);
    setIsInvestmentFlowOpen(true);
  };

  const handleViewDetail = (opportunity: InvestmentOpportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Khám phá cơ hội đầu tư</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Tìm hiểu các dự án đã được thẩm định và phê duyệt trên nền tảng GoldenBook
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Tên doanh nghiệp, dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div>
              <Label>Ngành</Label>
              <Select value={filters.sector} onValueChange={(value) => setFilters(prev => ({ ...prev, sector: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngành" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Năng lượng">Năng lượng</SelectItem>
                  <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                  <SelectItem value="Bất động sản">Bất động sản</SelectItem>
                  <SelectItem value="Sản xuất">Sản xuất</SelectItem>
                  <SelectItem value="Fintech">Fintech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Kỳ hạn</Label>
              <Select value={filters.duration} onValueChange={(value) => setFilters(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kỳ hạn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="short">Ngắn hạn (&lt; 12 tháng)</SelectItem>
                  <SelectItem value="medium">Trung hạn (12-24 tháng)</SelectItem>
                  <SelectItem value="long">Dài hạn (&gt; 24 tháng)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Uy tín tối thiểu</Label>
                <Select value={filters.uyTinScore[0].toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, uyTinScore: [parseInt(value)] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Uy tín" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tất cả</SelectItem>
                  <SelectItem value="70">≥ 70 điểm</SelectItem>
                  <SelectItem value="80">≥ 80 điểm</SelectItem>
                  <SelectItem value="85">≥ 85 điểm</SelectItem>
                  <SelectItem value="90">≥ 90 điểm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tỷ suất phân phối mục tiêu (%)</Label>
              <div className="px-2 py-4">
                <Slider
                  value={filters.targetRate}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, targetRate: value }))}
                  max={25}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{filters.targetRate[0]}%</span>
                  <span>{filters.targetRate[1]}%</span>
                </div>
              </div>
            </div>

            <div>
              <Label>Mức rủi ro</Label>
              <Select value={filters.riskLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, riskLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức rủi ro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover-lift cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-sm">{opportunity.companyName}</span>
                </div>
                {getStatusBadge(opportunity.status)}
              </div>
              <CardTitle className="text-lg leading-tight">{opportunity.projectName}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3 sm:space-y-4">
              <p className="text-sm text-muted-foreground">
                {opportunity.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tỷ suất mục tiêu:</span>
                  <div className="font-semibold text-golden">{opportunity.targetRate}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Chu kỳ chi trả:</span>
                  <div className="font-medium">{getPayoutFrequencyText(opportunity.payoutFrequency)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Mức góp tối thiểu:</span>
                  <div className="font-medium">{formatCurrency(opportunity.minInvestment)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Kỳ hạn:</span>
                  <div className="font-medium">{opportunity.duration}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Tiến độ gọi vốn</span>
                  <span className="font-medium">{getProgressPercentage(opportunity.raised, opportunity.totalTarget)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-golden rounded-full h-2 transition-all duration-300"
                    style={{ width: `${getProgressPercentage(opportunity.raised, opportunity.totalTarget)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatCurrency(opportunity.raised)}</span>
                  <span>{formatCurrency(opportunity.totalTarget)}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <UyTinBadge score={opportunity.uyTinScore} size="sm" />
                <Badge variant="outline">{opportunity.sector}</Badge>
                {getRiskBadge(opportunity.riskLevel)}
              </div>

              {/* Documents */}
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Tài liệu thẩm định ({opportunity.documents.length})</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {opportunity.documents.slice(0, 2).map((doc, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {doc}
                    </Badge>
                  ))}
                  {opportunity.documents.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{opportunity.documents.length - 2} khác
                    </Badge>
                  )}
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Hạn cuối: {new Date(opportunity.deadline).toLocaleDateString('vi-VN')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => handleViewDetail(opportunity)}
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Xem chi tiết
                </Button>
                <Button 
                  variant="golden" 
                  size="sm" 
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => handleInvestClick(opportunity)}
                >
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Tham gia
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Xem thêm cơ hội
        </Button>
      </div>

      {/* Opportunity Detail Dialog */}
      {selectedOpportunity && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedOpportunity.projectName}</DialogTitle>
            </DialogHeader>
            <OpportunityDetail 
              opportunity={selectedOpportunity}
              onInvest={() => {
                setIsDetailDialogOpen(false);
                setIsInvestmentFlowOpen(true);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Investment Flow Dialog */}
      {selectedOpportunity && (
        <InvestmentFlow
          opportunity={selectedOpportunity}
          isOpen={isInvestmentFlowOpen}
          onClose={() => {
            setIsInvestmentFlowOpen(false);
            setSelectedOpportunity(null);
          }}
        />
      )}
    </div>
  );
};

export default OpportunityExplorer;