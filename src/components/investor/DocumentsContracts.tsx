import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Shield, 
  Search, 
  Filter,
  FolderOpen,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Share2,
  QrCode,
  Archive,
  FileCheck,
  PenTool,
  Hash,
  ExternalLink,
  ChevronRight,
  Folder,
  File,
  X,
  Calendar as CalendarIcon,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";
import BlockchainVerifyButton from "./BlockchainVerifyButton";

interface Document {
  id: string;
  type: 'contract' | 'appendix' | 'payout' | 'statement' | 'progress' | 'finance' | 'personal' | 'other';
  title: string;
  company?: string;
  gid?: string;
  cqid?: string;
  date: string;
  language: 'vi' | 'en';
  version: string;
  eSignStatus: 'none' | 'pending' | 'partial' | 'completed';
  docHash: string;
  source: 'business' | 'system' | 'investor';
  size: string;
  mime: string;
  url: string;
  signers?: Array<{ name: string; signedAt?: string; status: 'pending' | 'signed' }>;
  hasWatermark?: boolean;
  isImportant?: boolean;
}

const DocumentsContracts = () => {
  const [activeFolder, setActiveFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedESignStatus, setSelectedESignStatus] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [easyMode, setEasyMode] = useState(false);

  // Mock data
  const documents: Document[] = [
    {
      id: 'doc-001',
      type: 'contract',
      title: 'HĐ góp vốn – AquaPure Series A v1.0',
      company: 'AquaPure',
      gid: 'AQ-A',
      cqid: 'AQ-2214',
      date: '2025-06-10',
      language: 'vi',
      version: 'v1.0',
      eSignStatus: 'completed',
      docHash: 'a91...c7',
      source: 'business',
      size: '2.4 MB',
      mime: 'application/pdf',
      url: '/docs/contract-001.pdf',
      signers: [
        { name: 'Nguyễn Văn A', signedAt: '2025-06-10T10:30:00Z', status: 'signed' },
        { name: 'AquaPure Co.', signedAt: '2025-06-10T14:15:00Z', status: 'signed' },
        { name: 'GoldenBook', signedAt: '2025-06-10T16:00:00Z', status: 'signed' }
      ],
      isImportant: true
    },
    {
      id: 'doc-002',
      type: 'payout',
      title: 'Bảng phân phối kỳ 08/2025 – AquaPure',
      company: 'AquaPure',
      gid: 'AQ-A',
      cqid: 'AQ-2214',
      date: '2025-08-31',
      language: 'vi',
      version: 'v1.0',
      eSignStatus: 'none',
      docHash: '9b1...7e',
      source: 'business',
      size: '856 KB',
      mime: 'application/pdf',
      url: '/docs/payout-002.pdf',
      isImportant: true
    },
    {
      id: 'doc-003',
      type: 'statement',
      title: 'Sao kê batch payout 08/2025',
      company: 'AquaPure',
      gid: 'AQ-A',
      date: '2025-08-31',
      language: 'vi',
      version: 'v1.0',
      eSignStatus: 'none',
      docHash: '5a0...d4',
      source: 'system',
      size: '1.2 MB',
      mime: 'application/pdf',
      url: '/docs/statement-003.pdf'
    },
    {
      id: 'doc-004',
      type: 'progress',
      title: 'Báo cáo tiến độ tháng 08/2025 – AquaPure',
      company: 'AquaPure',
      gid: 'AQ-A',
      date: '2025-08-29',
      language: 'vi',
      version: 'v1.0',
      eSignStatus: 'none',
      docHash: '3fe...0ac',
      source: 'business',
      size: '4.7 MB',
      mime: 'application/pdf',
      url: '/docs/progress-004.pdf'
    },
    {
      id: 'doc-005',
      type: 'other',
      title: 'Biên nhận phân phối 08/2025',
      date: '2025-08-31',
      language: 'vi',
      version: 'v1.0',
      eSignStatus: 'none',
      docHash: '11a...f9',
      source: 'system',
      size: '324 KB',
      mime: 'application/pdf',
      url: '/docs/receipt-005.pdf'
    },
    {
      id: 'doc-006',
      type: 'personal',
      title: 'Giấy uỷ quyền nhận thay',
      date: '2025-09-02',
      language: 'vi',
      version: 'v1.0',
      eSignStatus: 'none',
      docHash: '77d...b2',
      source: 'investor',
      size: '1.8 MB',
      mime: 'application/pdf',
      url: '/docs/personal-006.pdf'
    }
  ];

  const folders = [
    { id: 'all', label: 'Tất cả tài liệu', icon: FolderOpen, count: documents.length },
    { id: 'contract', label: 'Hợp đồng góp vốn', icon: FileCheck, count: documents.filter(d => d.type === 'contract').length },
    { id: 'appendix', label: 'Phụ lục & thoả thuận', icon: FileText, count: documents.filter(d => d.type === 'appendix').length },
    { id: 'payout', label: 'Bảng phân phối & sao kê', icon: FileText, count: documents.filter(d => ['payout', 'statement'].includes(d.type)).length },
    { id: 'progress', label: 'Báo cáo tiến độ & tài chính', icon: FileText, count: documents.filter(d => ['progress', 'finance'].includes(d.type)).length },
    { id: 'wallet', label: 'Chứng từ Ví & Giao dịch', icon: FileText, count: documents.filter(d => d.type === 'other' && d.source === 'system').length },
    { id: 'personal', label: 'Hồ sơ của tôi', icon: Folder, count: documents.filter(d => d.type === 'personal').length }
  ];

  const getDocumentTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      contract: 'Hợp đồng eSign',
      appendix: 'Phụ lục',
      payout: 'Bảng phân phối',
      statement: 'Sao kê',
      progress: 'Báo cáo tiến độ',
      finance: 'Báo cáo tài chính',
      personal: 'Hồ sơ cá nhân',
      other: 'Khác'
    };
    return typeLabels[type] || type;
  };

  const getESignStatusBadge = (status: string, signers?: Array<any>) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✔︎ Đã ký</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Chờ ký</Badge>;
      case 'partial':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">📝 Ký một phần</Badge>;
      default:
        return null;
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Folder filter
      if (activeFolder !== 'all') {
        if (activeFolder === 'payout' && !['payout', 'statement'].includes(doc.type)) return false;
        if (activeFolder === 'progress' && !['progress', 'finance'].includes(doc.type)) return false;
        if (activeFolder === 'wallet' && !(doc.type === 'other' && doc.source === 'system')) return false;
        if (activeFolder !== 'payout' && activeFolder !== 'progress' && activeFolder !== 'wallet' && doc.type !== activeFolder) return false;
      }

      // Search filter
      if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !doc.docHash.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(doc.company && doc.company.toLowerCase().includes(searchQuery.toLowerCase())) &&
          !(doc.gid && doc.gid.toLowerCase().includes(searchQuery.toLowerCase())) &&
          !(doc.cqid && doc.cqid.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Company filter
      if (selectedCompany !== 'all' && doc.company !== selectedCompany) return false;

      // eSign status filter
      if (selectedESignStatus !== 'all' && doc.eSignStatus !== selectedESignStatus) return false;

      // Language filter
      if (selectedLanguage !== 'all' && doc.language !== selectedLanguage) return false;

      return true;
    });
  }, [documents, activeFolder, searchQuery, selectedCompany, selectedESignStatus, selectedLanguage]);

  const companies = Array.from(new Set(documents.filter(d => d.company).map(d => d.company)));

  if (easyMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tài liệu & Hợp đồng</h1>
            <p className="text-lg text-muted-foreground">Giao diện dễ hiểu</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setEasyMode(false)}
            className="text-lg px-6 py-3"
          >
            Giao diện đầy đủ
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
            <FileCheck className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Hợp đồng</h3>
            <p className="text-3xl font-bold text-primary">{documents.filter(d => d.type === 'contract').length}</p>
          </Card>

          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
            <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Bảng phân phối</h3>
            <p className="text-3xl font-bold text-primary">{documents.filter(d => d.type === 'payout').length}</p>
          </Card>

          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
            <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Sao kê</h3>
            <p className="text-3xl font-bold text-primary">{documents.filter(d => d.type === 'statement').length}</p>
          </Card>

          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
            <Archive className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Tải ZIP</h3>
            <Button className="w-full mt-2 text-lg py-3">
              <Download className="w-5 h-5 mr-2" />
              Tải gói tài liệu
            </Button>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Tài liệu gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.slice(0, 5).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="text-lg font-medium">{doc.title}</h4>
                    <p className="text-muted-foreground">{new Date(doc.date).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="lg" className="px-6">
                      <Eye className="w-5 h-5 mr-2" />
                      Xem
                    </Button>
                    <Button variant="outline" size="lg" className="px-6">
                      <Download className="w-5 h-5 mr-2" />
                      Tải
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative px-6 py-8 md:px-8 md:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Blockchain Verified
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                    <PenTool className="w-3 h-3 mr-1" />
                    eSign Ready
                  </Badge>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                  Tài liệu & Hợp đồng
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Kho tài liệu trung tâm với xác thực blockchain và eSign. Quản lý, ký số và theo dõi tất cả tài liệu đầu tư một cách an toàn và minh bạch.
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{documents.filter(d => d.eSignStatus === 'completed').length}</span>
                  <span>Đã ký</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">{documents.length}</span>
                  <span>Tổng tài liệu</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">{companies.length}</span>
                  <span>Doanh nghiệp</span>
                </div>
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-auto">
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 h-auto"
              >
                <Upload className="w-4 h-4 mr-2" />
                <span>Tải lên tài liệu</span>
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 px-4 py-3 h-auto"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Tải ZIP kỳ này</span>
                  <span className="sm:hidden">ZIP</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setEasyMode(true)}
                  className="hidden md:flex border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 px-4 py-3 h-auto"
                >
                  Giao diện Dễ hiểu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left Sidebar - Folders & Filters */}
        <div className="w-full lg:w-72 lg:flex-shrink-0 space-y-4">
          {/* Mobile Folder Tabs */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto pb-3 gap-2 scrollbar-hide">
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={activeFolder === folder.id ? "default" : "outline"}
                  className={cn(
                    "flex-shrink-0 text-xs px-4 py-3 h-auto rounded-xl transition-all duration-200",
                    activeFolder === folder.id 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md" 
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setActiveFolder(folder.id)}
                >
                  <folder.icon className="w-3 h-3 mr-2" />
                  <span className="whitespace-nowrap">{folder.label}</span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-2 text-xs px-2 py-0.5",
                      activeFolder === folder.id 
                        ? "bg-white/20 text-white border-white/20" 
                        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    )}
                  >
                    {folder.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop Folder Tree */}
          <Card className="hidden lg:block border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Thư mục tài liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={activeFolder === folder.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-sm py-3 px-3 rounded-lg transition-all duration-200",
                    activeFolder === folder.id
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:from-blue-700 hover:to-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                  onClick={() => setActiveFolder(folder.id)}
                >
                  <folder.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="flex-1 text-left font-medium">{folder.label}</span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-2 text-xs px-2 py-0.5 font-medium",
                      activeFolder === folder.id
                        ? "bg-white/20 text-white border-white/20"
                        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    )}
                  >
                    {folder.count}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Enhanced Filters */}
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Bộ lọc nâng cao
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building2 className="w-3 h-3" />
                    Doanh nghiệp
                  </Label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger className="h-10 text-sm border-gray-200 dark:border-gray-700 rounded-lg">
                      <SelectValue placeholder="Chọn doanh nghiệp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả doanh nghiệp</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <PenTool className="w-3 h-3" />
                    Trạng thái eSign
                  </Label>
                  <Select value={selectedESignStatus} onValueChange={setSelectedESignStatus}>
                    <SelectTrigger className="h-10 text-sm border-gray-200 dark:border-gray-700 rounded-lg">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="completed">✅ Đã ký</SelectItem>
                      <SelectItem value="pending">⏳ Chờ ký</SelectItem>
                      <SelectItem value="none">📄 Không cần ký</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Languages className="w-3 h-3" />
                    Ngôn ngữ
                  </Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="h-10 text-sm border-gray-200 dark:border-gray-700 rounded-lg">
                      <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả ngôn ngữ</SelectItem>
                      <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Filter Summary */}
              {(selectedCompany !== 'all' || selectedESignStatus !== 'all' || selectedLanguage !== 'all') && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Bộ lọc đang áp dụng</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCompany('all');
                        setSelectedESignStatus('all');
                        setSelectedLanguage('all');
                      }}
                      className="text-xs h-6 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Xóa tất cả
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search & View Controls */}
          <Card className="p-4 bg-gradient-to-r from-white/80 to-blue-50/50 dark:from-gray-800/80 dark:to-blue-900/20 border-0 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Enhanced Search */}
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 z-10">
                  <Search className="w-4 h-4" />
                </div>
                <Input
                  placeholder="Tìm kiếm tài liệu, DocHash, GID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-10 text-sm bg-white/80 dark:bg-gray-900/80 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex gap-1 flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "text-xs px-3 h-8 transition-all duration-200",
                    viewMode === 'grid' 
                      ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" 
                      : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                  )}
                >
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3 mr-1.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                  <span className="hidden sm:inline font-medium">Lưới</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "text-xs px-3 h-8 transition-all duration-200",
                    viewMode === 'list' 
                      ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" 
                      : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                  )}
                >
                  <div className="flex flex-col gap-0.5 w-3 h-3 mr-1.5">
                    <div className="bg-current h-0.5 rounded-sm"></div>
                    <div className="bg-current h-0.5 rounded-sm"></div>
                    <div className="bg-current h-0.5 rounded-sm"></div>
                  </div>
                  <span className="hidden sm:inline font-medium">Danh sách</span>
                </Button>
              </div>
            </div>
            
            {/* Quick Filter Pills */}
            {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all' || selectedESignStatus !== 'all' || selectedLanguage !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-700/50">
                <span className="text-xs text-muted-foreground font-medium">Bộ lọc đang áp dụng:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Tìm kiếm: "{searchQuery}"
                  </Badge>
                )}
                {selectedType !== 'all' && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Loại: {getDocumentTypeLabel(selectedType as any)}
                  </Badge>
                )}
                {selectedStatus !== 'all' && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Trạng thái: {selectedStatus === 'important' ? 'Quan trọng' : selectedStatus === 'watermark' ? 'Có watermark' : selectedStatus}
                  </Badge>
                )}
                {selectedESignStatus !== 'all' && (
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                    eSign: {selectedESignStatus === 'none' ? 'Chưa ký' : selectedESignStatus === 'pending' ? 'Chờ ký' : selectedESignStatus === 'partial' ? 'Ký một phần' : 'Hoàn thành'}
                  </Badge>
                )}
                {selectedLanguage !== 'all' && (
                  <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                    Ngôn ngữ: {selectedLanguage === 'vi' ? 'Tiếng Việt' : 'English'}
                  </Badge>
                )}
              </div>
            )}
          </Card>

          {/* Documents Grid/List */}
          {filteredDocuments.length === 0 ? (
            <Card className="p-8 md:p-12 text-center border-dashed border-2 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                <FileText className="relative w-12 h-12 md:w-16 md:h-16 mx-auto text-blue-500/70 mb-3 md:mb-4" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Không tìm thấy tài liệu</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md mx-auto">
                Thử thay đổi bộ lọc hoặc tải lên tài liệu mới để bắt đầu quản lý
              </p>
              <Button 
                onClick={() => setShowUploadDialog(true)} 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Tải lên tài liệu
              </Button>
            </Card>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6"
                : "space-y-3"
            )}>
              {filteredDocuments.map((doc) => (
                <Card 
                  key={doc.id}
                  className={cn(
                    "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                    viewMode === 'list' && "hover:shadow-lg hover:translate-y-0 hover:scale-[1.02]",
                    doc.isImportant && "ring-2 ring-red-200 dark:ring-red-800"
                  )}
                  onClick={() => setSelectedDocument(doc)}
                >
                  {viewMode === 'grid' ? (
                    <CardContent className="p-4 md:p-5 relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                              <File className="w-3 h-3 md:w-4 md:h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <Badge 
                              variant="outline" 
                              className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium"
                            >
                              {getDocumentTypeLabel(doc.type)}
                            </Badge>
                          </div>
                          {doc.isImportant && (
                            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 shadow-lg animate-pulse">
                              <span className="hidden sm:inline">Quan trọng</span>
                              <span className="sm:hidden">!</span>
                            </Badge>
                          )}
                        </div>
                        
                        <h4 className="font-semibold mb-3 line-clamp-2 text-sm md:text-base leading-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {doc.title}
                        </h4>
                        
                        <div className="space-y-2 text-xs text-muted-foreground">
                          {doc.company && (
                            <div className="flex items-center gap-2 min-w-0">
                              <Building2 className="w-3 h-3 flex-shrink-0 text-blue-500" />
                              <span className="truncate font-medium">{doc.company} • {doc.gid}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-3 h-3 flex-shrink-0 text-green-500" />
                            <span>{new Date(doc.date).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <Hash className="w-3 h-3 flex-shrink-0 text-purple-500" />
                            <span className="font-mono text-xs truncate bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{doc.docHash}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 gap-2">
                          <div className="min-w-0 flex-1">
                            {getESignStatusBadge(doc.eSignStatus, doc.signers)}
                          </div>
                          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                              <Eye className="w-3 h-3 text-blue-600" />
                            </Button>
                            <BlockchainVerifyButton
                              hash={doc.docHash}
                              type="document"
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 md:p-5 relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-xl"></div>
                      
                      <div className="flex items-start gap-3 flex-1 min-w-0 relative">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex-shrink-0">
                          <File className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <h4 className="font-semibold text-sm md:text-base leading-tight flex-1 min-w-0 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc.title}</h4>
                            {doc.isImportant && (
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 shadow-lg animate-pulse flex-shrink-0">
                                <span className="hidden sm:inline">Quan trọng</span>
                                <span className="sm:hidden">!</span>
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-muted-foreground mb-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium"
                            >
                              {getDocumentTypeLabel(doc.type)}
                            </Badge>
                            {doc.company && (
                              <span className="hidden sm:inline font-medium">{doc.company} • {doc.gid}</span>
                            )}
                            <span className="font-medium">{new Date(doc.date).toLocaleDateString('vi-VN')}</span>
                            <span className="font-mono text-xs hidden md:inline bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{doc.docHash}</span>
                          </div>
                          {/* Mobile-only company info */}
                          {doc.company && (
                            <div className="sm:hidden text-xs text-muted-foreground mt-1 font-medium">
                              {doc.company} • {doc.gid}
                            </div>
                          )}
                          {/* Mobile-only hash */}
                          <div className="md:hidden text-xs text-muted-foreground font-mono mt-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded inline-block">
                            {doc.docHash}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 justify-between sm:justify-end">
                        <div className="flex-1 sm:flex-initial">
                          {getESignStatusBadge(doc.eSignStatus, doc.signers)}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <BlockchainVerifyButton
                            hash={doc.docHash}
                            type="document"
                            size="sm"
                          />
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                            <Eye className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20">
                            <Download className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Detail Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20 border-0 shadow-2xl">
          {selectedDocument && (
            <>
              <DialogHeader className="relative">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex items-start justify-between relative">
                  <div className="flex-1">
                    <DialogTitle className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                      {selectedDocument.title}
                    </DialogTitle>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <Badge 
                        variant="outline" 
                        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium"
                      >
                        {getDocumentTypeLabel(selectedDocument.type)}
                      </Badge>
                      {selectedDocument.company && (
                        <span className="font-medium">{selectedDocument.company} • {selectedDocument.gid}</span>
                      )}
                      <span className="font-medium">{new Date(selectedDocument.date).toLocaleDateString('vi-VN')}</span>
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">{selectedDocument.version}</span>
                      {selectedDocument.isImportant && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                          Quan trọng
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white/80 dark:bg-gray-800/80 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
                    >
                      <Download className="w-4 h-4 mr-2 text-green-600" />
                      Tải về
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4 mr-2 text-blue-600" />
                      Chia sẻ
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Document Preview */}
                <div className="lg:col-span-2">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50/80 to-blue-50/50 dark:from-gray-800/80 dark:to-blue-900/20">
                    <CardContent className="p-8 text-center min-h-[450px] flex items-center justify-center relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
                      
                      <div className="relative">
                        <div className="p-4 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-6 inline-block">
                          <FileText className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">PDF Preview</h3>
                        <p className="text-muted-foreground mb-4">
                          Xem trước tài liệu sẽ hiển thị tại đây
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80">
                            {selectedDocument.size}
                          </Badge>
                          <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80">
                            {selectedDocument.mime}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Document Info */}
                <div className="space-y-4">
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        Thông tin xác thực
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs text-muted-foreground font-medium">DocHash</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs bg-gradient-to-r from-gray-100 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 px-3 py-2 rounded-lg font-mono flex-1 border">
                            {selectedDocument.docHash}
                          </code>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                            <QrCode className="w-4 h-4 text-blue-600" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="w-full">
                        <BlockchainVerifyButton
                          hash={selectedDocument.docHash}
                          type="document"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {selectedDocument.eSignStatus !== 'none' && (
                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader className="pb-3 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <PenTool className="w-4 h-4 text-green-600" />
                          Chữ ký điện tử
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg">
                          <span className="text-sm font-medium">Trạng thái</span>
                          {getESignStatusBadge(selectedDocument.eSignStatus, selectedDocument.signers)}
                        </div>
                        
                        {selectedDocument.signers && (
                          <div className="space-y-3">
                            <Label className="text-xs text-muted-foreground font-medium">Người ký</Label>
                            <div className="space-y-2">
                              {selectedDocument.signers.map((signer, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20 rounded-lg border">
                                  <span className="font-medium text-sm">{signer.name}</span>
                                  {signer.status === 'signed' ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span className="text-xs font-medium">
                                        {signer.signedAt && new Date(signer.signedAt).toLocaleDateString('vi-VN')}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-yellow-600">
                                      <Clock className="w-4 h-4" />
                                      <span className="text-xs font-medium">Chờ ký</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-purple-600" />
                        Chi tiết
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors">
                        <span className="text-muted-foreground font-medium">Nguồn</span>
                        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                          {selectedDocument.source === 'business' ? 'Doanh nghiệp' : 
                           selectedDocument.source === 'system' ? 'Hệ thống' : 'Người dùng'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors">
                        <span className="text-muted-foreground font-medium">Kích thước</span>
                        <span className="font-medium">{selectedDocument.size}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors">
                        <span className="text-muted-foreground font-medium">Định dạng</span>
                        <span className="font-medium">{selectedDocument.mime}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors">
                        <span className="text-muted-foreground font-medium">Ngôn ngữ</span>
                        <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                          {selectedDocument.language === 'vi' ? 'Tiếng Việt' : 'English'}
                        </Badge>
                      </div>
                      {selectedDocument.cqid && (
                        <div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors">
                          <span className="text-muted-foreground font-medium">CQĐĐT-ID</span>
                          <code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{selectedDocument.cqid}</code>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tải lên tài liệu</DialogTitle>
            <DialogDescription>
              Tải lên tài liệu cá nhân, giấy uỷ quyền, hoặc chứng từ bổ sung
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Kéo thả file hoặc click để chọn
              </p>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ PDF, JPG, PNG, XLSX, DOCX (tối đa 10MB)
              </p>
              <Button className="mt-4">
                Chọn file
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phân loại</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tài liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Hồ sơ cá nhân</SelectItem>
                    <SelectItem value="authorization">Giấy uỷ quyền</SelectItem>
                    <SelectItem value="kyc">Bổ sung KYC</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Liên kết</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn GID/CQĐĐT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không liên kết</SelectItem>
                    <SelectItem value="AQ-A">AquaPure (AQ-A)</SelectItem>
                    <SelectItem value="UF-Q4">UrbanFoods (UF-Q4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Hủy
              </Button>
              <Button>
                Tải lên
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legal Disclaimer */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Tuyên bố pháp lý</p>
              <p>
                Tài liệu "tỷ suất phân phối mục tiêu" và "phân phối lợi ích" là theo công bố của Doanh nghiệp. 
                GoldenBook không cam kết lợi nhuận cố định, không phải sàn chứng khoán. 
                Việc xác thực blockchain là cơ chế kiểm chứng tài liệu/giao dịch, không phải phát hành tài sản số.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsContracts;