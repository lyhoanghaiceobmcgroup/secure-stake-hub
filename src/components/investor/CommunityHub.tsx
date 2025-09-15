import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag,
  ExternalLink,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  ChevronDown,
  Bell,
  BellOff,
  Star,
  Activity,
  Globe,
  Zap,
  BarChart3,
  Building2,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import UyTinBadge from "./UyTinBadge";
import BlockchainVerifyButton from "./BlockchainVerifyButton";

interface Company {
  id: string;
  name: string;
  logo: string;
  sector: string;
  uyTinScore: number;
  uyTinPillars: { B: number; U: number; Fd: number; Fl: number };
  onTimeUpdate: number;
  followers: number;
  lastStatus: string;
  isFollowing: boolean;
  hasNotification: boolean;
}

interface Post {
  id: string;
  companyId: string;
  company: Company;
  type: 'progress' | 'payout' | 'document' | 'event' | 'faq';
  title: string;
  excerpt: string;
  content: string;
  media: string[];
  docHash?: string;
  createdAt: string;
  views: number;
  likes: number;
  commentsCount: number;
  isVerified: boolean;
}

const CommunityHub = () => {
  const [activeView, setActiveView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [minUyTin, setMinUyTin] = useState(0);
  const [feedFilter, setFeedFilter] = useState("all");

  // Mock data
  const followedCompanies: Company[] = [
    {
      id: "1",
      name: "AquaPure JSC",
      logo: "/placeholder.svg",
      sector: "Sản xuất",
      uyTinScore: 86,
      uyTinPillars: { B: 88, U: 85, Fd: 87, Fl: 84 },
      onTimeUpdate: 96,
      followers: 12540,
      lastStatus: "Đã công bố bảng phân phối 08/2025",
      isFollowing: true,
      hasNotification: true
    },
    {
      id: "2", 
      name: "UrbanFoods Co.",
      logo: "/placeholder.svg",
      sector: "F&B",
      uyTinScore: 78,
      uyTinPillars: { B: 80, U: 75, Fd: 78, Fl: 79 },
      onTimeUpdate: 91,
      followers: 9203,
      lastStatus: "Tiến độ nhà máy giai đoạn 2 đạt 65%",
      isFollowing: true,
      hasNotification: false
    },
    {
      id: "3",
      name: "EduNext Ltd.",
      logo: "/placeholder.svg", 
      sector: "Giáo dục",
      uyTinScore: 72,
      uyTinPillars: { B: 74, U: 70, Fd: 73, Fl: 71 },
      onTimeUpdate: 88,
      followers: 5611,
      lastStatus: "Cập nhật hợp đồng nhà cung cấp – DocHash #3fa…c2",
      isFollowing: true,
      hasNotification: true
    }
  ];

  const posts: Post[] = [
    {
      id: "1",
      companyId: "1",
      company: followedCompanies[0],
      type: "progress",
      title: "Hoàn tất lắp đặt dây chuyền lọc RO 2.0",
      excerpt: "Hoàn tất lắp đặt dây chuyền lọc RO 2.0; nghiệm thu PCCC xong.",
      content: "Chi tiết tiến độ tháng 08/2025...",
      media: ["progress1.jpg", "progress2.jpg", "video.mp4"],
      docHash: "9b1...7e",
      createdAt: "2025-08-29T10:30:00Z",
      views: 2341,
      likes: 156,
      commentsCount: 23,
      isVerified: true
    },
    {
      id: "2", 
      companyId: "2",
      company: followedCompanies[1],
      type: "payout",
      title: "Đã hoàn tất phân phối kỳ 08/2025",
      excerpt: "Đã hoàn tất phân phối kỳ 08/2025. Tỷ lệ đạt mục tiêu: 97%.",
      content: "Sao kê batch và chi tiết phân phối...",
      media: [],
      docHash: "5a0...d4", 
      createdAt: "2025-08-31T16:45:00Z",
      views: 1876,
      likes: 234,
      commentsCount: 45,
      isVerified: true
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'progress': return 'Tiến độ';
      case 'payout': return 'Phân phối';  
      case 'document': return 'Tài liệu';
      case 'event': return 'Sự kiện';
      case 'faq': return 'Hỏi đáp';
      default: return '';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'progress': return 'default';
      case 'payout': return 'secondary';
      case 'document': return 'outline';
      case 'event': return 'secondary';
      case 'faq': return 'outline';
      default: return 'default';
    }
  };

  const CompanyCard = ({ company }: { company: Company }) => (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.02]">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img 
              src={company.logo} 
              alt={company.name}
              className="w-14 h-14 rounded-xl object-cover shadow-md"
            />
            {company.hasNotification && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 truncate mb-1">{company.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700">
                    <Building2 className="w-3 h-3 mr-1" />
                    {company.sector}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost" 
                size="sm"
                className="shrink-0 ml-2 h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle notification
                }}
              >
                {company.hasNotification ? 
                  <Bell className="w-4 h-4 text-blue-600" /> : 
                  <BellOff className="w-4 h-4 text-gray-400" />
                }
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <UyTinBadge score={company.uyTinScore} size="sm" />
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Activity className="w-3 h-3 text-green-500" />
                <span className="font-medium">{company.onTimeUpdate}%</span>
                <span className="text-gray-500">đúng hạn</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {company.lastStatus}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span className="font-medium text-gray-700">{company.followers.toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="font-medium text-gray-700">{(company.uyTinScore / 10).toFixed(1)}</span>
                </div>
              </div>
              <Button 
                variant={company.isFollowing ? "outline" : "default"}
                size="sm"
                className={cn(
                  "h-8 text-xs font-medium px-4 transition-all duration-200",
                  company.isFollowing 
                    ? "border-blue-200 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                )}
              >
                {company.isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PostCard = ({ post }: { post: Post }) => (
    <Card className="bg-gradient-to-br from-white to-gray-50/30 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.01]">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img 
              src={post.company.logo}
              alt={post.company.name}
              className="w-12 h-12 rounded-xl object-cover shadow-md"
            />
            {post.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-sm text-gray-900">{post.company.name}</h3>
              {post.isVerified && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  ĐÃ XÁC THỰC
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <Badge 
                variant={getTypeBadgeVariant(post.type)} 
                className={cn(
                  "text-xs px-2 py-1 font-medium",
                  post.type === 'progress' && "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-700",
                  post.type === 'payout' && "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700",
                  post.type === 'document' && "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 text-purple-700",
                  post.type === 'event' && "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-700",
                  post.type === 'faq' && "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700"
                )}
              >
                {getTypeLabel(post.type)}
              </Badge>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-gray-900 mb-2 leading-relaxed">{post.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{post.excerpt}</p>
          </div>
          
          {post.media.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Tài liệu đính kèm:
              </p>
              <div className="flex gap-2 flex-wrap">
                {post.media.slice(0, 3).map((media, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-gray-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {media.includes('video') ? `Video ${index + 1}` : `Ảnh ${index + 1}`}
                  </Button>
                ))}
                {post.media.length > 3 && (
                  <Badge variant="secondary" className="h-8 flex items-center text-xs bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700">
                    +{post.media.length - 3} file
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 pt-2">
            {post.docHash && (
              <BlockchainVerifyButton
                hash={post.docHash}
                timestamp={post.createdAt}
                type="document"
                size="sm"
              />
            )}
            <Button variant="outline" size="sm" className="gap-2 text-xs h-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
              <FileText className="w-3 h-3" />
              Xem chi tiết
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1 font-medium">
                <Eye className="w-3 h-3" />
                <span className="text-gray-700">{post.views.toLocaleString('vi-VN')}</span>
                <span>lượt xem</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="gap-1 h-8 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-medium">{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 h-8 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-medium">{post.commentsCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 h-8 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-200">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 h-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-600 transition-all duration-200">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RightPanel = () => (
    <div className="space-y-6">
      {/* Company Transparency Metrics */}
      <Card className="glass-card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-800/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-semibold">
              Chỉ số minh bạch
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-sm">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">97%</div>
            <div className="text-xs text-muted-foreground font-medium">DN cập nhật đúng hạn</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-sm">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">95%</div>
            <div className="text-xs text-muted-foreground font-medium">Phân phối đúng kế hoạch</div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="glass-card bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-100 dark:border-orange-800/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-md">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-semibold">
              Sự kiện sắp diễn ra
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-700/30 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Livestream AMA - AquaPure</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  05/09/2025 - 19:30
                </div>
                <div className="text-xs bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-medium">
                  1.538 đăng ký
                </div>
              </div>
              <div className="p-1 rounded-full bg-gradient-to-br from-orange-500 to-red-600">
                <Activity className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Survey */}
      <Card className="glass-card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-100 dark:border-purple-800/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
              Khảo sát nhanh
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bạn hài lòng mức nào về minh bạch kỳ 08/2025?</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">5★ Rất hài lòng</span>
                </span>
                <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">62%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full shadow-sm transition-all duration-500" style={{ width: '62%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left Column - Following Companies */}
      <div className="col-span-3 space-y-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Doanh nghiệp tôi theo dõi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Tìm kiếm DN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
              
              <div className="flex gap-2">
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Ngành" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Sản xuất">Sản xuất</SelectItem>
                    <SelectItem value="F&B">F&B</SelectItem>
                    <SelectItem value="Giáo dục">Giáo dục</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              {followedCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Column - Community Feed */}
      <div className="col-span-6 space-y-4">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Bảng tin cộng đồng</CardTitle>
              <Select value={feedFilter} onValueChange={setFeedFilter}>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="progress">Tiến độ</SelectItem>
                  <SelectItem value="payout">Phân phối</SelectItem>
                  <SelectItem value="document">Tài liệu</SelectItem>
                  <SelectItem value="event">Sự kiện</SelectItem>
                  <SelectItem value="faq">Hỏi đáp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Metrics & Events */}
      <div className="col-span-3">
        <RightPanel />
      </div>
    </div>
  );

  // Tablet Layout  
  const TabletLayout = () => (
    <div className="grid grid-cols-10 gap-4">
      <div className="col-span-7 space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Doanh nghiệp theo dõi
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Doanh nghiệp tôi theo dõi</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Input
                  placeholder="Tìm kiếm DN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="space-y-3">
                  {followedCompanies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Select value={feedFilter} onValueChange={setFeedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="progress">Tiến độ</SelectItem>
              <SelectItem value="payout">Phân phối</SelectItem>
              <SelectItem value="document">Tài liệu</SelectItem>
              <SelectItem value="event">Sự kiện</SelectItem>
              <SelectItem value="faq">Hỏi đáp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      
      <div className="col-span-3">
        <RightPanel />
      </div>
    </div>
  );

  // Mobile Layout
  const MobileLayout = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Bộ lọc & Theo dõi</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <Tabs defaultValue="filter" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="filter">Bộ lọc</TabsTrigger>
                  <TabsTrigger value="following">Theo dõi</TabsTrigger>
                </TabsList>
                <TabsContent value="filter" className="space-y-4">
                  <Select value={feedFilter} onValueChange={setFeedFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả bài viết</SelectItem>
                      <SelectItem value="progress">Tiến độ</SelectItem>
                      <SelectItem value="payout">Phân phối</SelectItem>
                      <SelectItem value="document">Tài liệu</SelectItem>
                      <SelectItem value="event">Sự kiện</SelectItem>
                      <SelectItem value="faq">Hỏi đáp</SelectItem>
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="following" className="space-y-3">
                  <Input
                    placeholder="Tìm kiếm DN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {followedCompanies.map((company) => (
                      <CompanyCard key={company.id} company={company} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Collapsible Right Panel for Mobile */}
      <div className="space-y-4">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <Button variant="ghost" className="w-full justify-between p-0">
              <CardTitle className="text-base">Thông tin tổng quan</CardTitle>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <RightPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-blue-800/30 shadow-xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Cộng đồng & Theo dõi DN
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Kết nối minh bạch với doanh nghiệp đã thẩm định
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{followedCompanies.length}</div>
                  <div className="text-xs text-muted-foreground">DN theo dõi</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{posts.length}</div>
                  <div className="text-xs text-muted-foreground">Bài viết mới</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">97%</div>
                  <div className="text-xs text-muted-foreground">Minh bạch</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">24</div>
                  <div className="text-xs text-muted-foreground">Sự kiện</div>
                </div>
              </div>
            </div>
            
            {/* Layout Toggle for Demo */}
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-muted-foreground">Chế độ xem</div>
              <div className="flex gap-2">
                <Button
                  variant={activeView === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('desktop')}
                  className="hidden lg:flex bg-white/80 hover:bg-white border-white/20 shadow-sm"
                >
                  <Building2 className="w-4 h-4 mr-1" />
                  Desktop
                </Button>
                <Button
                  variant={activeView === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('tablet')}
                  className="hidden md:flex lg:flex bg-white/80 hover:bg-white border-white/20 shadow-sm"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Tablet
                </Button>
                <Button
                  variant={activeView === 'mobile' ? 'default' : 'outline'}
                  size="sm" 
                  onClick={() => setActiveView('mobile')}
                  className="bg-white/80 hover:bg-white border-white/20 shadow-sm"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Mobile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Layout Based on Screen Size */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
      
      <div className="hidden md:block lg:hidden">
        <TabletLayout />
      </div>
      
      <div className="block md:hidden">
        <MobileLayout />
      </div>
    </div>
  );
};

export default CommunityHub;