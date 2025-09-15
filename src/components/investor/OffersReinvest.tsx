import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BlockchainVerifyButton from "./BlockchainVerifyButton";
import { 
  Gift, 
  Users, 
  TrendingUp, 
  Settings, 
  History, 
  Award,
  Target,
  RefreshCw,
  Copy,
  Share2,
  Calendar,
  Wallet,
  FileText,
  Info,
  CheckCircle2,
  Clock,
  DollarSign,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OffersReinvest = () => {
  const [smartReinvestEnabled, setSmartReinvestEnabled] = useState(false);
  const [reinvestCriteria, setReinvestCriteria] = useState({
    termLength: "",
    minUyTin: "",
    targetRate: "",
    sourceType: "",
    maxAmount: "",
    maxPackages: ""
  });
  const { toast } = useToast();

  const offers = [
    {
      id: "early-participation",
      title: "Góp sớm – hoàn 0.3% phí",
      description: "Hoàn 0,3% phí nền tảng khi tham gia trong 72 giờ kể từ khi gói mở",
      conditions: "Áp dụng cho khoản góp mới; tối đa 150.000đ/CQĐĐT; không cộng dồn với ưu đãi hoàn phí khác",
      reward: "0.3% phí nền tảng",
      timeLeft: "48 giờ",
      icon: Clock,
      color: "bg-blue-500",
      available: true
    },
    {
      id: "referral",
      title: "Mời bạn – mỗi bên nhận 50K",
      description: "Người mời và người được mời đều nhận 50.000đ vào ví khi người được mời hoàn tất KYC và góp vốn hợp lệ",
      conditions: "Mỗi tài khoản tối đa 10 lượt/tháng; khoản góp từ 1.000.000đ",
      reward: "50.000đ x2",
      referralCode: "HAI50GOLDEN",
      icon: Users,
      color: "bg-green-500",
      available: true
    },
    {
      id: "combo-consistent",
      title: "Combo Góp đều – thưởng 1 kỳ phí nền tảng",
      description: "Góp 4 kỳ liên tiếp (theo lịch DN công bố) → thưởng phí nền tảng kỳ 5",
      conditions: "Áp dụng cho cùng một gói; không trễ hạn quá 48h/kỳ",
      reward: "Miễn phí kỳ 5",
      progress: 2,
      total: 4,
      icon: Target,
      color: "bg-purple-500",
      available: true
    },
    {
      id: "group-premium",
      title: "Ưu đãi nhóm uy tín – Top 5 nhóm",
      description: "Top 5 nhóm có tỷ lệ góp đúng hạn & tái đầu tư cao nhận quỹ thưởng nhóm (chia theo tỷ lệ góp)",
      conditions: "Nhóm ≥ 5 thành viên, nhóm trưởng xác minh KYC",
      reward: "Quỹ thưởng nhóm",
      icon: Award,
      color: "bg-orange-500",
      available: true
    },
    {
      id: "uy-tin-booster",
      title: "Uy tín Booster – giảm phí nền tảng cho gói minh bạch cao",
      description: "Chọn gói có Uy tín ≥ 80 sẽ được giảm phí nền tảng",
      conditions: "Áp dụng cho gói có Uy tín từ 80 điểm trở lên",
      reward: "Giảm 15-25% phí",
      icon: TrendingUp,
      color: "bg-yellow-500",
      available: true
    },
    {
      id: "seamless-reinvest",
      title: "Ưu đãi tái đầu tư liền mạch",
      description: "Khi phân phối kỳ này về ví → tái đầu tư vào gói phù hợp theo tiêu chí đã cài → nhận giảm phí hoặc điểm cộng đồng",
      conditions: "Bật Smart Reinvest, chọn Uy tín tối thiểu, kỳ hạn ưa thích",
      reward: "Giảm phí + điểm cộng đồng",
      icon: RefreshCw,
      color: "bg-indigo-500",
      available: !smartReinvestEnabled
    }
  ];

  const offerHistory = [
    {
      date: "02/09/2025",
      offer: "Góp sớm – hoàn 0.3%",
      package: "AquaPure – Series A",
      reward: "90.000đ",
      docHash: "#91f...7b",
      status: "completed"
    },
    {
      date: "28/08/2025",
      offer: "Mời bạn – 50K",
      package: "Code: HAI50",
      reward: "50.000đ",
      docHash: "#6ae...c0",
      status: "completed"
    },
    {
      date: "15/08/2025",
      offer: "Uy tín Booster",
      package: "UrbanFoods – Q4",
      reward: "Giảm 20% phí",
      docHash: "#7bc...d1",
      status: "completed"
    }
  ];

  const handleCopyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Đã sao chép",
      description: "Mã giới thiệu đã được sao chép vào clipboard",
    });
  };

  const handleEnableSmartReinvest = () => {
    if (!reinvestCriteria.termLength || !reinvestCriteria.minUyTin || !reinvestCriteria.sourceType) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các tiêu chí bắt buộc",
        variant: "destructive"
      });
      return;
    }
    setSmartReinvestEnabled(true);
    toast({
      title: "Đã kích hoạt Smart Reinvest",
      description: "Hệ thống sẽ tự động tái đầu tư theo tiêu chí của bạn",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-golden/10 via-golden-light/5 to-transparent rounded-xl sm:rounded-2xl border border-golden/20 shadow-lg">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.1),transparent_50%)]" />
        
        <div className="relative p-4 sm:p-6 lg:p-8">
          {/* Header with Badge */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-golden to-golden-light rounded-lg flex items-center justify-center shadow-lg">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <Badge variant="outline" className="text-golden border-golden bg-golden/5">
                  Verified via blockchain
                </Badge>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-golden via-golden-light to-golden bg-clip-text text-transparent leading-tight">
                ƯU ĐÃI & TÁI ĐẦU TƯ
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                Tối ưu quyền lợi – Tái đầu tư thông minh – Minh bạch bằng mã blockchain
              </p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="group flex items-center gap-3 p-3 sm:p-4 bg-white/50 dark:bg-background/50 rounded-lg border border-blue-200/50 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">Hoàn phí góp sớm</p>
                <p className="text-xs sm:text-sm text-muted-foreground">0.3% phí nền tảng</p>
              </div>
            </div>
            
            <div className="group flex items-center gap-3 p-3 sm:p-4 bg-white/50 dark:bg-background/50 rounded-lg border border-green-200/50 hover:border-green-300 transition-all duration-200 hover:shadow-md">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">Thưởng giới thiệu</p>
                <p className="text-xs sm:text-sm text-muted-foreground">50K cho mỗi bên</p>
              </div>
            </div>
            
            <div className="group flex items-center gap-3 p-3 sm:p-4 bg-white/50 dark:bg-background/50 rounded-lg border border-purple-200/50 hover:border-purple-300 transition-all duration-200 hover:shadow-md">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">Ưu đãi nhóm uy tín</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Top 5 nhóm</p>
              </div>
            </div>
            
            <div className="group flex items-center gap-3 p-3 sm:p-4 bg-white/50 dark:bg-background/50 rounded-lg border border-indigo-200/50 hover:border-indigo-300 transition-all duration-200 hover:shadow-md col-span-2 lg:col-span-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">Smart Reinvest</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Tự động tái đầu tư</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-gradient-to-r from-golden to-golden-light hover:from-golden-light hover:to-golden text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 sm:flex-none">
              <Gift className="w-4 h-4 mr-2" />
              Kích hoạt ưu đãi của tôi
            </Button>
            <Button variant="outline" className="border-golden/30 text-golden hover:bg-golden/5 flex-1 sm:flex-none">
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt tái đầu tư
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-golden flex-1 sm:flex-none">
              <History className="w-4 h-4 mr-2" />
              Xem lịch sử ưu đãi
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="offers" className="w-full">
        {/* Mobile Scrollable Tabs */}
        <div className="sm:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 p-1 min-w-max">
              <TabsTrigger 
                value="offers" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-golden data-[state=active]:text-white data-[state=active]:shadow-lg min-w-[120px]"
              >
                <Gift className="w-4 h-4 mr-2" />
                Ưu đãi hiện tại
              </TabsTrigger>
              <TabsTrigger 
                value="smart-reinvest" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-golden data-[state=active]:text-white data-[state=active]:shadow-lg min-w-[120px]"
              >
                <Zap className="w-4 h-4 mr-2" />
                Smart Reinvest
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-golden data-[state=active]:text-white data-[state=active]:shadow-lg min-w-[120px]"
              >
                <History className="w-4 h-4 mr-2" />
                Lịch sử
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-golden data-[state=active]:text-white data-[state=active]:shadow-lg min-w-[120px]"
              >
                <FileText className="w-4 h-4 mr-2" />
                Báo cáo
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl">
            <TabsTrigger 
              value="offers" 
              className="flex items-center gap-2 py-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-golden data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg"
            >
              <Gift className="w-4 h-4" />
              Ưu đãi hiện tại
            </TabsTrigger>
            <TabsTrigger 
              value="smart-reinvest" 
              className="flex items-center gap-2 py-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-golden data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg"
            >
              <Zap className="w-4 h-4" />
              Smart Reinvest
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center gap-2 py-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-golden data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg"
            >
              <History className="w-4 h-4" />
              Lịch sử
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-2 py-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-golden data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg"
            >
              <FileText className="w-4 h-4" />
              Báo cáo
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Current Offers */}
        <TabsContent value="offers" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="group relative overflow-hidden border-2 hover:border-golden/30 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                {offer.timeLeft && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-200 text-xs animate-pulse">
                      Còn {offer.timeLeft}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${offer.color.replace('bg-', 'bg-gradient-to-br from-')} to-opacity-80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <offer.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg leading-tight mb-2 group-hover:text-golden transition-colors">
                        {offer.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-golden border-golden bg-golden/5 text-xs">
                        {offer.reward}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4 pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {offer.description}
                  </CardDescription>
                  
                  <div className="text-xs text-muted-foreground p-3 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-muted/40 shadow-sm">
                    <strong className="text-foreground font-semibold">Điều kiện:</strong> {offer.conditions}
                  </div>
                  
                  {offer.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Tiến độ</span>
                        <span className="text-golden">{offer.progress}/{offer.total} kỳ</span>
                      </div>
                      <Progress value={(offer.progress / offer.total) * 100} className="h-2" />
                    </div>
                  )}
                  
                  {offer.referralCode && (
                    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-golden/5 to-golden-light/5 rounded-lg border border-golden/20">
                      <code className="flex-1 text-sm font-mono font-semibold text-golden">{offer.referralCode}</code>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-golden/10"
                        onClick={() => handleCopyReferralCode(offer.referralCode!)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-golden/10">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-3">
                    {offer.available ? (
                      <Button 
                        className="flex-1 bg-gradient-to-r from-golden to-golden-light hover:from-golden-light hover:to-golden text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold" 
                        disabled={!offer.available}
                      >
                        <span className="text-sm">
                          {offer.id === 'seamless-reinvest' ? 'Bật Smart Reinvest' : 'Tham gia ngay'}
                        </span>
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1" disabled>
                        Không khả dụng
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="h-10 w-10 hover:bg-golden/5 hover:border-golden/30 transition-all duration-200">
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Smart Reinvest */}
        <TabsContent value="smart-reinvest" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Card className="border-2 border-golden/20 shadow-lg">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-golden to-golden-light rounded-lg flex items-center justify-center shadow-lg">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    Smart Reinvest – Tái đầu tư tự động
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm sm:text-base">
                    Giảm thao tác – tăng hiệu quả quay vòng vốn – giữ kỷ luật đầu tư
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {smartReinvestEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                  </span>
                  <Switch 
                    checked={smartReinvestEnabled}
                    onCheckedChange={setSmartReinvestEnabled}
                    className="data-[state=checked]:bg-golden"
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!smartReinvestEnabled ? (
                <div className="space-y-6">
                  {/* Configuration Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Package Criteria */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                          <Target className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="font-semibold text-base">Tiêu chí gói đầu tư</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="term-length" className="text-sm font-medium flex items-center gap-1">
                            Kỳ hạn <span className="text-red-500">*</span>
                          </Label>
                          <Select value={reinvestCriteria.termLength} onValueChange={(value) => 
                            setReinvestCriteria({...reinvestCriteria, termLength: value})
                          }>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Chọn kỳ hạn" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Ngắn (≤6 tháng)</SelectItem>
                              <SelectItem value="medium">Trung (6–12 tháng)</SelectItem>
                              <SelectItem value="long">Dài (≥12 tháng)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="min-uy-tin" className="text-sm font-medium flex items-center gap-1">
                            Uy tín tối thiểu <span className="text-red-500">*</span>
                          </Label>
                          <Select value={reinvestCriteria.minUyTin} onValueChange={(value) => 
                            setReinvestCriteria({...reinvestCriteria, minUyTin: value})
                          }>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Chọn Uy tín tối thiểu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="70">70 điểm</SelectItem>
                              <SelectItem value="80">80 điểm</SelectItem>
                              <SelectItem value="85">85 điểm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="target-rate" className="text-sm font-medium">
                            Tỷ suất phân phối mục tiêu
                          </Label>
                          <Select value={reinvestCriteria.targetRate} onValueChange={(value) => 
                            setReinvestCriteria({...reinvestCriteria, targetRate: value})
                          }>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Chọn khoảng tỷ suất" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6-8">6-8%/năm</SelectItem>
                              <SelectItem value="8-10">8-10%/năm</SelectItem>
                              <SelectItem value="10+">Trên 10%/năm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Source & Limits */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                          <Wallet className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="font-semibold text-base">Nguồn vốn & hạn mức</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="source-type" className="text-sm font-medium flex items-center gap-1">
                            Nguồn tái đầu tư <span className="text-red-500">*</span>
                          </Label>
                          <Select value={reinvestCriteria.sourceType} onValueChange={(value) => 
                            setReinvestCriteria({...reinvestCriteria, sourceType: value})
                          }>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Chọn nguồn vốn" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="payout">Phân phối nhận được</SelectItem>
                              <SelectItem value="wallet">Dư ví</SelectItem>
                              <SelectItem value="both">Cả hai</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max-amount" className="text-sm font-medium">
                            Tối đa mỗi kỳ (triệu đồng)
                          </Label>
                          <Input 
                            id="max-amount"
                            placeholder="VD: 50"
                            value={reinvestCriteria.maxAmount}
                            onChange={(e) => setReinvestCriteria({...reinvestCriteria, maxAmount: e.target.value})}
                            className="h-10"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max-packages" className="text-sm font-medium">
                            Tối đa gói mỗi tháng
                          </Label>
                          <Input 
                            id="max-packages"
                            placeholder="VD: 3"
                            value={reinvestCriteria.maxPackages}
                            onChange={(e) => setReinvestCriteria({...reinvestCriteria, maxPackages: e.target.value})}
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={handleEnableSmartReinvest} 
                      className="bg-gradient-to-r from-golden to-golden-light hover:from-golden-light hover:to-golden text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-2"
                      size="lg"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Kích hoạt Smart Reinvest
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800 dark:text-green-200 text-lg">Smart Reinvest đã kích hoạt</h3>
                      <p className="text-sm text-green-600 dark:text-green-300 mt-1">Hệ thống sẽ tự động tái đầu tư theo tiêu chí của bạn</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                      <span className="font-medium">Kỳ hạn:</span>
                      <span className="text-golden font-semibold">{reinvestCriteria.termLength}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                      <span className="font-medium">Uy tín tối thiểu:</span>
                      <span className="text-golden font-semibold">{reinvestCriteria.minUyTin} điểm</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                      <span className="font-medium">Nguồn vốn:</span>
                      <span className="text-golden font-semibold">{reinvestCriteria.sourceType}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                      <span className="font-medium">Tối đa mỗi kỳ:</span>
                      <span className="text-golden font-semibold">{reinvestCriteria.maxAmount || 'Không giới hạn'} triệu</span>
                    </div>
                  </div>
                </div>
              )}
              
              {!smartReinvestEnabled && (
                <div className="flex gap-3">
                  <Button onClick={handleEnableSmartReinvest} className="bg-golden hover:bg-golden-light text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Kích hoạt Smart Reinvest
                  </Button>
                  <Button variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Xem trước dòng tiền
                  </Button>
                </div>
              )}
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Lưu ý:</strong> Bạn có thể hoàn tác giao dịch trong 60 phút nếu chưa sinh hợp đồng. 
                  Khi có ≥2 gói phù hợp, hệ thống ưu tiên Uy tín cao hơn và phí thấp hơn.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          {/* Example Cash Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Ví dụ dòng tiền minh họa</CardTitle>
              <CardDescription>
                Minh họa cách Smart Reinvest phân bổ vốn khi nhận phân phối
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-green-600" />
                  <span>Bạn nhận 3.200.000đ phân phối tháng 9</span>
                </div>
                
                <div className="ml-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>2.000.000đ → UrbanFoods (Uy tín 86, 9m) → giảm 15% phí</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>1.200.000đ → AquaPure (Uy tín 82, 6m) → voucher hoàn 0.2%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>Biên nhận & giảm phí được lưu vào Ví & Giao dịch với mã hash</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Card className="border-2 border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <History className="w-4 h-4 text-white" />
                </div>
                Lịch sử ưu đãi
              </CardTitle>
              <CardDescription className="text-base">
                Theo dõi tất cả ưu đãi đã nhận và chứng từ blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offerHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {item.status === 'completed' ? 'Hoàn tất' : 'Đang xử lý'}
                        </Badge>
                        <span className="font-medium">{item.offer}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.date} • {item.package}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-golden">{item.reward}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <BlockchainVerifyButton 
                          hash={item.docHash.replace('#', '')}
                          type="document"
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Tổng quyền lợi</CardTitle>
                <CardDescription className="text-sm">Tháng 09/2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-golden mb-1">1.247.000đ</div>
                <div className="text-sm text-green-600 font-medium">+23% so với tháng trước</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Tỷ lệ tái đầu tư</CardTitle>
                <CardDescription className="text-sm">Sau nhận ưu đãi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-golden mb-1">87%</div>
                <div className="text-sm text-muted-foreground font-medium">Trong vòng 7 ngày</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Gói hiệu quả nhất</CardTitle>
                <CardDescription className="text-sm">Theo quyền lợi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold mb-1">UrbanFoods Q4</div>
                <div className="text-sm text-muted-foreground font-medium">Uy tín 86 • ROI 9.2%</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border-2 border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Xuất báo cáo
              </CardTitle>
              <CardDescription className="text-base">
                Tạo báo cáo chi tiết với mã xác thực blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="outline" className="flex-1 sm:flex-none hover:bg-muted/50 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Xuất PDF
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none hover:bg-muted/50 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Xuất Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legal Disclaimer */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-2">Tuyên bố pháp lý</p>
              <p>
                GoldenBook là nền tảng công nghệ kết nối góp vốn đồng hành vào doanh nghiệp/dự án đã thẩm định. 
                Mọi thông tin về tỷ suất phân phối mục tiêu do Doanh nghiệp công bố; việc phân phối lợi ích phụ thuộc 
                kết quả kinh doanh thực tế. GoldenBook không cam kết lợi nhuận cố định và không phải sàn chứng khoán.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OffersReinvest;