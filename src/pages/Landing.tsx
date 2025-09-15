import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, TrendingUp, Users, Building2, Languages, Star, CheckCircle, ArrowRight, Sparkles, Zap, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-fintech.jpg";

const Landing = () => {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const content = {
    vi: {
      hero: {
        tagline: "GoldenBook – Nền tảng góp vốn minh bạch vào doanh nghiệp đã thẩm định.",
        subtitle: "Kết nối nhà đầu tư và doanh nghiệp qua công nghệ blockchain minh bạch"
      },
      systems: {
        investor: {
          title: "Nhà đầu tư",
          subtitle: "Investor App",
          description: "Khám phá cơ hội đầu tư minh bạch và an toàn",
          login: "Đăng nhập",
          register: "Đăng ký"
        },
        business: {
          title: "Doanh nghiệp", 
          subtitle: "Business App",
          description: "Huy động vốn từ cộng đồng đầu tư uy tín",
          login: "Đăng nhập",
          register: "Đăng ký"
        }
      },
      features: [
        {
          icon: Shield,
          title: "Chuẩn minh bạch blockchain",
          description: "Mọi giao dịch được xác thực và lưu trữ bất biến"
        },
        {
          icon: TrendingUp,
          title: "Đối soát realtime 2 chiều",
          description: "Theo dõi tiến độ và phân phối lợi ích minh bạch"
        },
        {
          icon: Users,
          title: "Quyền lợi đầu tư rõ ràng",
          description: "Chứng chỉ quyền lợi đầu tư cá nhân được bảo vệ"
        }
      ],
      footer: {
        terms: "Điều khoản",
        privacy: "Quyền riêng tư", 
        contact: "Liên hệ",
        support: "Trung tâm hỗ trợ 24/7"
      }
    },
    en: {
      hero: {
        tagline: "GoldenBook – Transparent capital contribution platform for verified enterprises.",
        subtitle: "Connecting investors and businesses through transparent blockchain technology"
      },
      systems: {
        investor: {
          title: "Investor",
          subtitle: "Investor App",
          description: "Discover transparent and secure investment opportunities",
          login: "Login",
          register: "Register"
        },
        business: {
          title: "Business",
          subtitle: "Business App", 
          description: "Raise capital from reputable investment community",
          login: "Login",
          register: "Register"
        }
      },
      features: [
        {
          icon: Shield,
          title: "Blockchain Transparency Standard",
          description: "All transactions are verified and stored immutably"
        },
        {
          icon: TrendingUp,
          title: "Real-time 2-way Reconciliation",
          description: "Track progress and benefit distribution transparently"
        },
        {
          icon: Users,
          title: "Clear Investment Rights",
          description: "Personal investment right certificates are protected"
        }
      ],
      footer: {
        terms: "Terms",
        privacy: "Privacy",
        contact: "Contact", 
        support: "24/7 Support Center"
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg border-b border-border shadow-lg' 
          : 'bg-white/80 backdrop-blur-md border-b border-white/20'
      }`}>
        <div className="container mx-auto px-4 lg:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-golden via-golden-light to-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">GB</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-navy leading-none">GoldenBook</span>
              <span className="text-xs text-muted-foreground">Transparent Investment</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-navy transition-colors">Tính năng</a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-navy transition-colors">Về chúng tôi</a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-navy transition-colors">Liên hệ</a>
            </nav>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="gap-2 hover:scale-105 transition-transform"
            >
              <Languages className="w-4 h-4" />
              {language === 'vi' ? 'EN' : 'VI'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-navy/70 via-navy/60 to-navy-light/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-golden/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-golden-light/20 rounded-full animate-bounce"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center text-white">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Shield className="w-3 h-3 mr-1" />
                Blockchain Verified
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1" />
                Trusted Platform
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-white to-golden-light bg-clip-text text-transparent">
              {currentContent.hero.tagline}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {currentContent.hero.subtitle}
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center gap-8 mt-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-golden">1000+</div>
                <div className="text-white/70">Nhà đầu tư</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-golden">500+</div>
                <div className="text-white/70">Doanh nghiệp</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-golden">99.9%</div>
                <div className="text-white/70">Bảo mật</div>
              </div>
            </div>
            
            {/* System Selection Cards */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mt-16 max-w-5xl mx-auto">
              {/* Investor Card */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-golden/30 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-golden/20" onClick={() => navigate('/investor')}>
                <CardContent className="p-8 lg:p-10 text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-golden via-golden-light to-yellow-400 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-golden/30">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2">{currentContent.systems.investor.title}</h3>
                    <Badge variant="secondary" className="bg-golden/20 text-golden border-golden/30 mb-4">
                      {currentContent.systems.investor.subtitle}
                    </Badge>
                    <p className="text-white/90 text-lg leading-relaxed">{currentContent.systems.investor.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={(e) => {e.stopPropagation(); navigate('/login');}}>
                      {currentContent.systems.investor.login}
                    </Button>
                    <Button className="bg-gradient-to-r from-golden to-golden-light hover:from-golden-light hover:to-golden text-white shadow-lg" onClick={(e) => {e.stopPropagation(); navigate('/login');}}>
                      {currentContent.systems.investor.register}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Business Card */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-navy/30 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-navy/20" onClick={() => navigate('/business')}>
                <CardContent className="p-8 lg:p-10 text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-navy via-navy-light to-blue-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-navy/30">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2">{currentContent.systems.business.title}</h3>
                    <Badge variant="secondary" className="bg-navy/20 text-navy-light border-navy/30 mb-4">
                      {currentContent.systems.business.subtitle}
                    </Badge>
                    <p className="text-white/90 text-lg leading-relaxed">{currentContent.systems.business.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={(e) => {e.stopPropagation(); navigate('/login');}}>
                      {currentContent.systems.business.login}
                    </Button>
                    <Button className="bg-gradient-to-r from-navy to-navy-light hover:from-navy-light hover:to-navy text-white shadow-lg" onClick={(e) => {e.stopPropagation(); navigate('/login');}}>
                      {currentContent.systems.business.register}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16 lg:mb-20">
            <Badge variant="outline" className="mb-4 text-navy border-navy/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Tính năng nổi bật
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6 leading-tight">
              Nền tảng đầu tư minh bạch
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Công nghệ blockchain tiên tiến đảm bảo tính minh bạch và bảo mật tuyệt đối cho mọi giao dịch
            </p>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {currentContent.features.map((feature, index) => (
              <Card key={index} className="group text-center p-6 lg:p-8 hover:shadow-xl hover:shadow-navy/10 transition-all duration-500 hover:scale-105 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
                <CardContent className="space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-golden via-golden-light to-yellow-400 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-golden/30">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-navy mb-3 group-hover:text-golden transition-colors duration-300">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Additional CTA */}
          <div className="text-center mt-16 lg:mt-20">
            <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-navy/5 to-golden/5 rounded-2xl border border-navy/10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-golden" />
                <span>Được tin tưởng bởi 1000+ nhà đầu tư và doanh nghiệp</span>
              </div>
              <Button variant="outline" size="sm" className="border-navy/20 hover:bg-navy/5">
                Tìm hiểu thêm
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-br from-navy via-navy-light to-navy text-white py-20 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-golden via-golden-light to-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">GB</span>
                </div>
                <div>
                  <span className="text-2xl font-bold">GoldenBook</span>
                  <div className="text-sm text-golden">Transparent Investment</div>
                </div>
              </div>
              <p className="text-white/90 text-lg leading-relaxed max-w-md">
                Nền tảng đầu tư minh bạch hàng đầu, kết nối nhà đầu tư và doanh nghiệp thông qua công nghệ blockchain tiên tiến.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Blockchain Secured
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  <Award className="w-3 h-3 mr-1" />
                  Licensed Platform
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-golden">Liên kết</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-golden transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-golden transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Tính năng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-golden transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Bảo mật
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-golden">Liên hệ</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-8 h-8 bg-golden/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-golden" />
                  </div>
                  <span>support@goldenbook.vn</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-8 h-8 bg-golden/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-golden" />
                  </div>
                  <span>1900 1234</span>
                </div>
                <div className="flex items-start gap-3 text-white/90">
                  <div className="w-8 h-8 bg-golden/20 rounded-lg flex items-center justify-center mt-1">
                    <Building2 className="w-4 h-4 text-golden" />
                  </div>
                  <span className="leading-relaxed">Tầng 10, Tòa nhà ABC, Quận 1, TP.HCM</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/70 text-center md:text-left">&copy; 2024 GoldenBook. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-white/70 hover:text-golden transition-colors">{currentContent.footer.privacy}</a>
                <a href="#" className="text-white/70 hover:text-golden transition-colors">{currentContent.footer.terms}</a>
                <a href="#" className="text-white/70 hover:text-golden transition-colors">{currentContent.footer.support}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;