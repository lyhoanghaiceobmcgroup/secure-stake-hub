import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Eye,
  Hash,
  MessageSquare,
  Upload,
  Search,
  Filter,
  RefreshCw,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Info,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface PayoutProcessingProps {
  cqid: string;
  onClose?: () => void;
}

interface PayoutRecord {
  id: string;
  period: string;
  scheduledDate: string;
  actualDate?: string;
  estimatedAmount: number;
  actualAmount?: number;
  status: 'scheduled' | 'processing' | 'completed' | 'disputed' | 'delayed';
  statementHash?: string;
  transactionId?: string;
  bankAccount: string;
  notes?: string;
  disputeId?: string;
  reconciliationStatus: 'pending' | 'matched' | 'discrepancy' | 'resolved';
}

interface DisputeCase {
  id: string;
  payoutId: string;
  period: string;
  issueType: 'amount_discrepancy' | 'missing_payment' | 'wrong_account' | 'timing_issue' | 'other';
  description: string;
  expectedAmount: number;
  receivedAmount: number;
  submittedDate: string;
  status: 'submitted' | 'under_review' | 'resolved' | 'rejected';
  resolution?: string;
  attachments: string[];
}

const PayoutProcessing: React.FC<PayoutProcessingProps> = ({ cqid, onClose }) => {
  const [activeTab, setActiveTab] = useState('statements');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRecord | null>(null);
  const [disputeForm, setDisputeForm] = useState({
    issueType: '',
    description: '',
    expectedAmount: '',
    receivedAmount: '',
    attachments: [] as File[]
  });

  // Mock data
  const portfolioInfo = {
    cqid: 'CQĐĐT #AQ-2214',
    packageName: 'AquaPure Series A',
    businessName: 'AquaPure Technologies',
    bankAccount: '**** **** **** 1234 (Vietcombank)'
  };

  const payoutRecords: PayoutRecord[] = [
    {
      id: '1',
      period: 'Kỳ 1 - Q4/2024',
      scheduledDate: '2024-12-31',
      actualDate: '2024-12-31',
      estimatedAmount: 1560000,
      actualAmount: 1580000,
      status: 'completed',
      statementHash: '0x7b2e91f8c3d4a1b9',
      transactionId: 'TXN240001234',
      bankAccount: '**** 1234',
      notes: 'Vượt kế hoạch 1.3%',
      reconciliationStatus: 'matched'
    },
    {
      id: '2',
      period: 'Kỳ 2 - Q1/2025',
      scheduledDate: '2025-03-31',
      actualDate: '2025-04-02',
      estimatedAmount: 1620000,
      actualAmount: 1650000,
      status: 'completed',
      statementHash: '0x9c4f82e1a7b5d3f2',
      transactionId: 'TXN250002156',
      bankAccount: '**** 1234',
      notes: 'Chậm 2 ngày do nghỉ lễ',
      reconciliationStatus: 'matched'
    },
    {
      id: '3',
      period: 'Kỳ 3 - Q2/2025',
      scheduledDate: '2025-06-30',
      actualDate: '2025-06-28',
      estimatedAmount: 1580000,
      actualAmount: 1520000,
      status: 'disputed',
      statementHash: '0x1a3b5c7d9e2f4g6h',
      transactionId: 'TXN250003789',
      bankAccount: '**** 1234',
      notes: 'Có tranh chấp về số tiền',
      disputeId: 'DSP-2025-001',
      reconciliationStatus: 'discrepancy'
    },
    {
      id: '4',
      period: 'Kỳ 4 - Q3/2025',
      scheduledDate: '2025-09-30',
      estimatedAmount: 1600000,
      status: 'processing',
      bankAccount: '**** 1234',
      notes: 'Đang xử lý thanh toán',
      reconciliationStatus: 'pending'
    },
    {
      id: '5',
      period: 'Kỳ 5 - Q4/2025',
      scheduledDate: '2025-12-31',
      estimatedAmount: 1640000,
      status: 'scheduled',
      bankAccount: '**** 1234',
      reconciliationStatus: 'pending'
    }
  ];

  const disputeCases: DisputeCase[] = [
    {
      id: 'DSP-2025-001',
      payoutId: '3',
      period: 'Kỳ 3 - Q2/2025',
      issueType: 'amount_discrepancy',
      description: 'Số tiền nhận được thấp hơn ước tính 60,000 VND. Theo báo cáo kinh doanh Q2, lợi nhuận đạt 102% kế hoạch nhưng số tiền phân phối chỉ đạt 96.2% ước tính.',
      expectedAmount: 1580000,
      receivedAmount: 1520000,
      submittedDate: '2025-07-05',
      status: 'under_review',
      attachments: ['bank_statement_q2.pdf', 'business_report_q2.pdf']
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Đã chi trả', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      processing: { label: 'Đang xử lý', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      scheduled: { label: 'Đã lên lịch', variant: 'outline' as const, icon: Calendar, color: 'text-blue-600' },
      disputed: { label: 'Tranh chấp', variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' },
      delayed: { label: 'Chậm trễ', variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  const getReconciliationBadge = (status: string) => {
    const statusConfig = {
      matched: { label: 'Đã đối chiếu', variant: 'default' as const, color: 'text-green-600' },
      pending: { label: 'Chờ đối chiếu', variant: 'secondary' as const, color: 'text-yellow-600' },
      discrepancy: { label: 'Có sai lệch', variant: 'destructive' as const, color: 'text-red-600' },
      resolved: { label: 'Đã giải quyết', variant: 'default' as const, color: 'text-green-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getDisputeStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { label: 'Đã gửi', variant: 'secondary' as const },
      under_review: { label: 'Đang xem xét', variant: 'default' as const },
      resolved: { label: 'Đã giải quyết', variant: 'default' as const },
      rejected: { label: 'Bị từ chối', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getIssueTypeLabel = (type: string) => {
    const typeLabels = {
      amount_discrepancy: 'Sai lệch số tiền',
      missing_payment: 'Thiếu thanh toán',
      wrong_account: 'Sai tài khoản',
      timing_issue: 'Vấn đề thời gian',
      other: 'Khác'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const filteredPayouts = payoutRecords.filter(payout => {
    const statusMatch = filterStatus === 'all' || payout.status === filterStatus;
    const searchMatch = searchTerm === '' || 
      payout.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleViewStatement = (hash: string) => {
    toast.success(`Đang mở sao kê với hash: ${hash}`);
  };

  const handleDownloadStatement = (payoutId: string) => {
    toast.success('Đang tải xuống sao kê');
  };

  const handleVerifyHash = (hash: string) => {
    toast.success(`Đang xác thực blockchain với hash: ${hash}`);
  };

  const handleCreateDispute = (payout: PayoutRecord) => {
    setSelectedPayout(payout);
    setShowDisputeForm(true);
  };

  const handleSubmitDispute = () => {
    if (!disputeForm.issueType || !disputeForm.description) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    toast.success('Khiếu nại đã được gửi thành công. Chúng tôi sẽ xem xét trong vòng 3-5 ngày làm việc.');
    setShowDisputeForm(false);
    setDisputeForm({
      issueType: '',
      description: '',
      expectedAmount: '',
      receivedAmount: '',
      attachments: []
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDisputeForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleRefreshReconciliation = () => {
    toast.success('Đang cập nhật trạng thái đối chiếu...');
  };

  const totalReceived = payoutRecords
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.actualAmount || 0), 0);
  
  const totalExpected = payoutRecords
    .reduce((sum, p) => sum + p.estimatedAmount, 0);

  const pendingDisputes = disputeCases.filter(d => d.status === 'submitted' || d.status === 'under_review').length;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Quản lý phân phối & Sao kê</h1>
            <p className="text-muted-foreground">
              {portfolioInfo.cqid} • {portfolioInfo.packageName}
            </p>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tổng đã nhận</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {formatCurrency(totalReceived)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tổng ước tính</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {formatCurrency(totalExpected)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Kỳ hoàn tất</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {payoutRecords.filter(p => p.status === 'completed').length}/{payoutRecords.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Khiếu nại đang xử lý</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {pendingDisputes}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="statements">Sao kê & Đối chiếu</TabsTrigger>
            <TabsTrigger value="disputes">Khiếu nại</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          {/* Statements & Reconciliation Tab */}
          <TabsContent value="statements" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm theo kỳ, mã giao dịch..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border rounded px-3 py-2"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="completed">Đã chi trả</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="scheduled">Đã lên lịch</option>
                      <option value="disputed">Tranh chấp</option>
                    </select>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRefreshReconciliation}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Cập nhật
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payout Records */}
            <div className="space-y-4">
              {filteredPayouts.map((payout) => (
                <Card key={payout.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{payout.period}</h3>
                        <p className="text-sm text-muted-foreground">
                          Lên lịch: {formatDate(payout.scheduledDate)}
                          {payout.actualDate && ` • Thực tế: ${formatDate(payout.actualDate)}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getReconciliationBadge(payout.reconciliationStatus)}
                        {getStatusBadge(payout.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ước tính</p>
                        <p className="font-semibold">{formatCurrency(payout.estimatedAmount)}</p>
                      </div>
                      {payout.actualAmount && (
                        <div>
                          <p className="text-sm text-muted-foreground">Thực nhận</p>
                          <p className={`font-semibold ${
                            payout.actualAmount >= payout.estimatedAmount ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(payout.actualAmount)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Tài khoản</p>
                        <p className="font-semibold">{payout.bankAccount}</p>
                      </div>
                    </div>

                    {payout.transactionId && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">Mã giao dịch</p>
                        <p className="font-mono text-sm">{payout.transactionId}</p>
                      </div>
                    )}

                    {payout.notes && (
                      <Alert className="mb-4">
                        <Info className="w-4 h-4" />
                        <AlertDescription>{payout.notes}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {payout.statementHash && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewStatement(payout.statementHash!)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Xem sao kê
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadStatement(payout.id)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Tải xuống
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleVerifyHash(payout.statementHash!)}
                            >
                              <Hash className="w-3 h-3 mr-1" />
                              {payout.statementHash.slice(0, 8)}...
                            </Button>
                          </>
                        )}
                      </div>
                      
                      {(payout.status === 'completed' && payout.reconciliationStatus === 'discrepancy') ||
                       (payout.status === 'disputed') ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCreateDispute(payout)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {payout.disputeId ? 'Xem khiếu nại' : 'Tạo khiếu nại'}
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Khiếu nại & Tranh chấp</h2>
              <Button onClick={() => setShowDisputeForm(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Tạo khiếu nại mới
              </Button>
            </div>

            <div className="space-y-4">
              {disputeCases.map((dispute) => (
                <Card key={dispute.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{dispute.period}</h3>
                        <p className="text-sm text-muted-foreground">Mã: {dispute.id}</p>
                      </div>
                      {getDisputeStatusBadge(dispute.status)}
                    </div>

                    <div className="mb-4">
                      <Badge variant="outline" className="mb-2">
                        {getIssueTypeLabel(dispute.issueType)}
                      </Badge>
                      <p className="text-sm">{dispute.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Số tiền mong đợi</p>
                        <p className="font-semibold">{formatCurrency(dispute.expectedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Số tiền thực nhận</p>
                        <p className="font-semibold text-red-600">{formatCurrency(dispute.receivedAmount)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Gửi ngày: {formatDate(dispute.submittedDate)}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                        {dispute.attachments.length > 0 && (
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Tài liệu ({dispute.attachments.length})
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Thông tin tài khoản nhận
                </CardTitle>
                <CardDescription>
                  Quản lý thông tin tài khoản để nhận phân phối
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tài khoản hiện tại</Label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">
                    {portfolioInfo.bankAccount}
                  </p>
                </div>
                <Button variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Thay đổi tài khoản
                </Button>
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    Thay đổi tài khoản phải được thực hiện trước ngày cutoff của mỗi kỳ phân phối.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Hỗ trợ khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Hotline</p>
                      <p className="text-sm text-muted-foreground">1900 1234</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email hỗ trợ</p>
                      <p className="text-sm text-muted-foreground">support@goldenbook.vn</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Thời gian xử lý khiếu nại</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sai lệch số tiền: 3-5 ngày làm việc</li>
                    <li>• Thiếu thanh toán: 5-7 ngày làm việc</li>
                    <li>• Vấn đề khác: 7-10 ngày làm việc</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dispute Form Modal */}
        {showDisputeForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Tạo khiếu nại</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowDisputeForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {selectedPayout && (
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <h3 className="font-medium">{selectedPayout.period}</h3>
                    <p className="text-sm text-muted-foreground">
                      Ước tính: {formatCurrency(selectedPayout.estimatedAmount)} • 
                      Thực nhận: {selectedPayout.actualAmount ? formatCurrency(selectedPayout.actualAmount) : 'Chưa có'}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="issueType">Loại vấn đề</Label>
                    <select
                      id="issueType"
                      value={disputeForm.issueType}
                      onChange={(e) => setDisputeForm(prev => ({ ...prev, issueType: e.target.value }))}
                      className="w-full border rounded px-3 py-2 mt-1"
                    >
                      <option value="">Chọn loại vấn đề</option>
                      <option value="amount_discrepancy">Sai lệch số tiền</option>
                      <option value="missing_payment">Thiếu thanh toán</option>
                      <option value="wrong_account">Sai tài khoản</option>
                      <option value="timing_issue">Vấn đề thời gian</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expectedAmount">Số tiền mong đợi</Label>
                      <Input
                        id="expectedAmount"
                        type="number"
                        value={disputeForm.expectedAmount}
                        onChange={(e) => setDisputeForm(prev => ({ ...prev, expectedAmount: e.target.value }))}
                        placeholder="VND"
                      />
                    </div>
                    <div>
                      <Label htmlFor="receivedAmount">Số tiền thực nhận</Label>
                      <Input
                        id="receivedAmount"
                        type="number"
                        value={disputeForm.receivedAmount}
                        onChange={(e) => setDisputeForm(prev => ({ ...prev, receivedAmount: e.target.value }))}
                        placeholder="VND"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Mô tả chi tiết</Label>
                    <Textarea
                      id="description"
                      value={disputeForm.description}
                      onChange={(e) => setDisputeForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="attachments">Tài liệu đính kèm</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Kéo thả file hoặc click để chọn
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Chọn file
                        </label>
                      </Button>
                    </div>
                    {disputeForm.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Đã chọn {disputeForm.attachments.length} file:</p>
                        <ul className="text-sm text-muted-foreground">
                          {disputeForm.attachments.map((file, index) => (
                            <li key={index}>• {file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSubmitDispute} className="flex-1">
                    Gửi khiếu nại
                  </Button>
                  <Button variant="outline" onClick={() => setShowDisputeForm(false)}>
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutProcessing;