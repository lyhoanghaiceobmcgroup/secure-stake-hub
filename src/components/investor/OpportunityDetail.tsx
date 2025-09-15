import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Users,
  Calendar,
  Globe,
  Award,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  FileText,
  Download,
  Eye,
  AlertTriangle,
  Shield,
  Target,
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

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
    cto: string;
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

interface ProjectDetails {
  timeline: string;
  expectedROI: string;
  marketSize: string;
  riskFactors: string[];
  mitigationStrategies: string[];
}

interface InvestmentUse {
  breakdown: {
    category: string;
    percentage: number;
    amount: number;
  }[];
  milestones: {
    phase: string;
    timeline: string;
    description: string;
  }[];
}

interface InvestmentOpportunity {
  id: string;
  companyName: string;
  projectName: string;
  description: string;
  targetRate: number;
  payoutFrequency: string;
  minInvestment: number;
  totalTarget: number;
  raised: number;
  sector: string;
  duration: string;
  uyTinScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  documents: string[];
  deadline: string;
  status: 'open' | 'closed' | 'funded';
  businessInfo: BusinessInfo;
  projectDetails: ProjectDetails;
  investmentUse: InvestmentUse;
}

interface OpportunityDetailProps {
  opportunity: InvestmentOpportunity;
  onInvest?: () => void;
}

const OpportunityDetail: React.FC<OpportunityDetailProps> = ({ opportunity, onInvest }) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000000) {
      return `${(amount / 1000000000000).toFixed(1)} nghìn tỷ VND`;
    } else if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ VND`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} triệu VND`;
    }
    return `${amount.toLocaleString()} VND`;
  };

  const calculateProgress = () => {
    return (opportunity.raised / opportunity.totalTarget) * 100;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{opportunity.projectName}</h1>
        <p className="text-xl text-gray-600 mt-2">{opportunity.companyName}</p>
        <div className="flex items-center gap-4 mt-4">
          <Badge className={getRiskColor(opportunity.riskLevel)}>
            {opportunity.riskLevel === 'low' ? 'Rủi ro thấp' : 
             opportunity.riskLevel === 'medium' ? 'Rủi ro trung bình' : 'Rủi ro cao'}
          </Badge>
          <Badge variant="outline">{opportunity.sector}</Badge>
          <Badge variant="outline">{opportunity.duration}</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Lợi nhuận kỳ vọng</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{opportunity.targetRate}%</p>
            <p className="text-xs text-gray-500">{opportunity.payoutFrequency === 'monthly' ? 'hàng tháng' : 
                                                   opportunity.payoutFrequency === 'quarterly' ? 'hàng quý' : 'hàng năm'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Đầu tư tối thiểu</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(opportunity.minInvestment)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Tiến độ gọi vốn</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{calculateProgress().toFixed(1)}%</p>
            <Progress value={calculateProgress()} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-gray-600">Điểm Uy tín</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{opportunity.uyTinScore}/100</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="business">Doanh nghiệp</TabsTrigger>
          <TabsTrigger value="financials">Tài chính</TabsTrigger>
          <TabsTrigger value="investment">Đầu tư</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Mô tả dự án
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Thông tin dự án
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian thực hiện:</span>
                  <span className="font-medium">{opportunity.projectDetails.timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quy mô thị trường:</span>
                  <span className="font-medium">{opportunity.projectDetails.marketSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hạn đầu tư:</span>
                  <span className="font-medium">{new Date(opportunity.deadline).toLocaleDateString('vi-VN')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Quản lý rủi ro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Yếu tố rủi ro:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {opportunity.projectDetails.riskFactors.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Biện pháp giảm thiểu:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {opportunity.projectDetails.mitigationStrategies.map((strategy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Thông tin doanh nghiệp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Năm thành lập</p>
                      <p className="font-medium">{opportunity.businessInfo.foundedYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Số nhân viên</p>
                      <p className="font-medium">{opportunity.businessInfo.employees.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Trụ sở chính</p>
                      <p className="font-medium">{opportunity.businessInfo.headquarters}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a href={opportunity.businessInfo.website} className="font-medium text-blue-600 hover:underline">
                        {opportunity.businessInfo.website}
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Vị thế thị trường</h4>
                  <p className="text-gray-700 mb-4">{opportunity.businessInfo.marketPosition}</p>
                  <p className="text-gray-700">{opportunity.businessInfo.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Thành tích nổi bật
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {opportunity.businessInfo.keyAchievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Đội ngũ lãnh đạo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">CEO</p>
                  <p className="text-gray-600">{opportunity.businessInfo.leadership.ceo}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">CFO</p>
                  <p className="text-gray-600">{opportunity.businessInfo.leadership.cfo}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">CTO</p>
                  <p className="text-gray-600">{opportunity.businessInfo.leadership.cto}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Chứng nhận & Giấy phép
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opportunity.businessInfo.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">{cert}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Đối tác chiến lược
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opportunity.businessInfo.partnerships.map((partner, index) => (
                    <Badge key={index} variant="outline">{partner}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Doanh thu 2023</span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(opportunity.businessInfo.financials.revenue2023)}
                </p>
                <p className="text-xs text-gray-500">
                  +{(((opportunity.businessInfo.financials.revenue2023 - opportunity.businessInfo.financials.revenue2022) / opportunity.businessInfo.financials.revenue2022) * 100).toFixed(1)}% so với 2022
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Lợi nhuận 2023</span>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(opportunity.businessInfo.financials.profit2023)}
                </p>
                <p className="text-xs text-gray-500">
                  +{(((opportunity.businessInfo.financials.profit2023 - opportunity.businessInfo.financials.profit2022) / opportunity.businessInfo.financials.profit2022) * 100).toFixed(1)}% so với 2022
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Tổng tài sản</span>
                </div>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(opportunity.businessInfo.financials.assets)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Vốn chủ sở hữu</span>
                </div>
                <p className="text-xl font-bold text-orange-600">
                  {formatCurrency(opportunity.businessInfo.financials.equity)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tỷ lệ tài chính quan trọng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {((opportunity.businessInfo.financials.profit2023 / opportunity.businessInfo.financials.revenue2023) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Tỷ suất lợi nhuận</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {((opportunity.businessInfo.financials.equity / opportunity.businessInfo.financials.assets) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Tỷ lệ vốn chủ sở hữu</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {(((opportunity.businessInfo.financials.revenue2023 - opportunity.businessInfo.financials.revenue2022) / opportunity.businessInfo.financials.revenue2022) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Tăng trưởng doanh thu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Tab */}
        <TabsContent value="investment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Phân bổ vốn đầu tư
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunity.investmentUse.breakdown.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <p className="text-xs text-gray-500">{formatCurrency(item.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mốc thời gian quan trọng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunity.investmentUse.milestones.map((milestone, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-blue-600">{milestone.phase}</span>
                        <Badge variant="outline" className="text-xs">{milestone.timeline}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin đầu tư</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(opportunity.totalTarget)}</p>
                  <p className="text-sm text-gray-600">Mục tiêu gọi vốn</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(opportunity.raised)}</p>
                  <p className="text-sm text-gray-600">Đã gọi được</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(opportunity.minInvestment)}</p>
                  <p className="text-sm text-gray-600">Đầu tư tối thiểu</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{opportunity.targetRate}%</p>
                  <p className="text-sm text-gray-600">Lợi nhuận kỳ vọng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tài liệu dự án
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {opportunity.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{doc}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Tải
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Báo cáo tiến độ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Tiến độ gọi vốn</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{calculateProgress().toFixed(1)}%</p>
                    <Progress value={calculateProgress()} className="mt-2" />
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Thời gian còn lại</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {Math.ceil((new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ngày
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-800">Số nhà đầu tư</span>
                    </div>
                    <p className="text-lg font-bold text-purple-600">127 nhà đầu tư</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Công cụ kiểm soát & Giám sát
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="font-medium">Báo cáo tài chính</span>
                  <span className="text-xs text-gray-500">Cập nhật hàng quý</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="font-medium">Tiến độ dự án</span>
                  <span className="text-xs text-gray-500">Theo dõi real-time</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  <span className="font-medium">Cảnh báo rủi ro</span>
                  <span className="text-xs text-gray-500">Thông báo tự động</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-medium">Audit độc lập</span>
                  <span className="text-xs text-gray-500">Kiểm toán hàng năm</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Users className="h-6 w-6" />
                  <span className="font-medium">Họp cổ đông</span>
                  <span className="text-xs text-gray-500">Quyền biểu quyết</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span className="font-medium">Phân phối lợi nhuận</span>
                  <span className="text-xs text-gray-500">Theo lịch trình</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t">
        <Button size="lg" className="flex-1" onClick={onInvest}>
          <DollarSign className="h-5 w-5 mr-2" />
          Tham gia đầu tư
        </Button>
        <Button size="lg" variant="outline">
          <FileText className="h-5 w-5 mr-2" />
          Tải tài liệu
        </Button>
        <Button size="lg" variant="outline">
          <Mail className="h-5 w-5 mr-2" />
          Liên hệ tư vấn
        </Button>
      </div>
    </div>
  );
};

export default OpportunityDetail;