import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import WalletDeposit from "./WalletDeposit";
import { useWallet } from "@/contexts/WalletContext";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Search, 
  Filter,
  Plus,
  Minus,
  RefreshCw,
  ShieldCheck,
  QrCode,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  ExternalLink,
  Copy,
  Calendar,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const WalletTransactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  // Get wallet data from context
  const { walletBalance } = useWallet();

  // Mock transaction data
  const transactions = [
    {
      id: "tx_001",
      date: "2025-09-02 14:21:00",
      type: "distribution",
      description: "Phân phối lợi ích kỳ 08/2025",
      package: "AquaPure Series A",
      cqid: "CQĐĐT #AQ-2214",
      amount: 1950000,
      direction: "+",
      status: "success",
      docHash: "9b1f8c7e",
      docUrl: "/docs/distribution_08_2025.pdf"
    },
    {
      id: "tx_002", 
      date: "2025-09-01 10:03:00",
      type: "allocate_cqid",
      description: "Ghi nhận CQĐĐT - eSign hoàn tất",
      package: "UrbanFoods Q4",
      cqid: "CQĐĐT #UF-1199",
      amount: -20000000,
      direction: "-",
      status: "success",
      docHash: "5a0d4c2b",
      docUrl: "/docs/contract_uf_1199.pdf"
    },
    {
      id: "tx_003",
      date: "2025-08-30 18:42:00", 
      type: "topup",
      description: "Nạp số dư - Napas QR VPBank",
      package: "—",
      cqid: "—",
      amount: 20000000,
      direction: "+",
      status: "success",
      docHash: "1c2f9a8b",
      docUrl: "/docs/topup_receipt.pdf"
    },
    {
      id: "tx_004",
      date: "2025-08-28 09:57:00",
      type: "internal_transfer_receive",
      description: "Đổi chứng chỉ - nhận từ user #1832",
      package: "AquaPure Series A",
      cqid: "CQĐĐT #AQ-2177",
      amount: 0,
      direction: "",
      status: "success",
      docHash: "3fa7c2d1",
      docUrl: "/docs/transfer_aq_2177.pdf"
    },
    {
      id: "tx_005",
      date: "2025-08-25 16:15:00",
      type: "withdraw",
      description: "Rút về ngân hàng - Vietcombank ••1234",
      package: "—",
      cqid: "—",
      amount: -5000000,
      direction: "-",
      status: "processing",
      docHash: "8e4b6f9c",
      docUrl: "/docs/withdraw_request.pdf"
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "topup": return <Plus className="w-4 h-4 text-green-600" />;
      case "withdraw": return <Minus className="w-4 h-4 text-red-600" />;
      case "distribution": return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "allocate_cqid": return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case "internal_transfer_send": return <ArrowUpRight className="w-4 h-4 text-orange-600" />;
      case "internal_transfer_receive": return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case "reinvest": return <RefreshCw className="w-4 h-4 text-indigo-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Thành công</Badge>;
      case "processing":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case "failed":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Lỗi</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Chưa rõ</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào clipboard");
  };

  const verifyBlockchain = (docHash: string) => {
    toast.success(`Đang xác thực tài liệu với hash: ${docHash}`);
    // Implementation for blockchain verification
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === "all" || tx.type === filterType;
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.package.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.cqid.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Ví & Giao dịch</h1>
        <p className="text-muted-foreground">
          Quản lý số dư, theo dõi giao dịch và xem lịch sử phân phối lợi ích
        </p>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư khả dụng</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(walletBalance.available)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Có thể sử dụng để góp vốn hoặc rút
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư tạm giữ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(walletBalance.held)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Đang chờ xử lý ghi nhận CQĐĐT
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư chờ đối soát</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreforce" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(walletBalance.reconciling)}
            </div>
            <p className="text-xs text-muted-forepower mt-1">
              Đang đối soát với ngân hàng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>Hệ thống hoạt động bình thường • Kết nối ngân hàng OK • Đối soát realtime</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              Cập nhật: {walletBalance.lastUpdated}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Wallet Deposit Component */}
      <WalletDeposit />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">

        <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Minus className="w-4 h-4 mr-2" />
              Rút về ngân hàng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rút tiền về ngân hàng</DialogTitle>
              <DialogDescription>
                Chuyển tiền từ ví GoldenBook về tài khoản ngân hàng đã KYC
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="withdraw_amount">Số tiền rút</Label>
                <Input id="withdraw_amount" placeholder="Nhập số tiền (VNĐ)" />
                <p className="text-sm text-muted-foreground mt-1">
                  Số dư khả dụng: {formatCurrency(walletBalance.available)}
                </p>
              </div>
              <div>
                <Label htmlFor="bank_account">Tài khoản ngân hàng</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tài khoản đã KYC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vcb1234">Vietcombank ••1234</SelectItem>
                    <SelectItem value="tcb5678">Techcombank ••5678</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Thời gian xử lý: 1-3 ngày làm việc. Phí rút: 0₫
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
                Hủy
              </Button>
              <Button onClick={() => {
                toast.success("Đã tạo lệnh rút tiền");
                setShowWithdrawDialog(false);
              }}>
                Tạo lệnh rút
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Chuyển nội bộ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đổi chứng chỉ (Chuyển nhượng nội bộ)</DialogTitle>
              <DialogDescription>
                Chuyển giao CQĐĐT cho tài khoản GoldenBook khác theo quy định
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient">Người nhận</Label>
                <Input id="recipient" placeholder="ID người dùng hoặc email" />
              </div>
              <div>
                <Label htmlFor="cqid_transfer">CQĐĐT chuyển nhượng</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn CQĐĐT sở hữu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aq2214">CQĐĐT #AQ-2214 - AquaPure</SelectItem>
                    <SelectItem value="aq2177">CQĐĐT #AQ-2177 - AquaPure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Chuyển nhượng có thể phát sinh phí và cần xác minh KYC của cả hai bên
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
                Hủy
              </Button>
              <Button onClick={() => {
                toast.success("Đã tạo lệnh chuyển nhượng");
                setShowTransferDialog(false);
              }}>
                Tạo lệnh chuyển
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Tải sao kê
        </Button>
      </div>

      {/* Recent Distribution Summary */}
      <Card className="glass-card border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Phân phối kỳ 08/2025 đã ghi có</p>
                <p className="text-sm text-blue-700">1.950.000đ từ AquaPure Series A</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Xem chứng từ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle>Lịch sử giao dịch</CardTitle>
              <CardDescription>
                Toàn bộ giao dịch với mã xác thực blockchain
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm giao dịch..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="topup">Nạp tiền</SelectItem>
                    <SelectItem value="withdraw">Rút tiền</SelectItem>
                    <SelectItem value="distribution">Phân phối</SelectItem>
                    <SelectItem value="allocate_cqid">Ghi nhận CQĐĐT</SelectItem>
                    <SelectItem value="internal_transfer_receive">Chuyển nội bộ</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="success">Thành công</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="failed">Lỗi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Icon & Date */}
                  <div className="lg:col-span-2 flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(transaction.date).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-3">
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.package}</p>
                  </div>

                  {/* CQĐĐT */}
                  <div className="lg:col-span-2">
                    <p className="text-sm text-muted-foreground">{transaction.cqid}</p>
                  </div>

                  {/* Amount */}
                  <div className="lg:col-span-2">
                    <p className={cn(
                      "font-bold text-sm",
                      transaction.direction === "+" ? "text-green-600" : 
                      transaction.direction === "-" ? "text-red-600" : "text-gray-600"
                    )}>
                      {transaction.amount !== 0 && (
                        <>
                          {transaction.direction}{formatCurrency(Math.abs(transaction.amount))}
                        </>
                      )}
                      {transaction.amount === 0 && "—"}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="lg:col-span-2">
                    {getStatusBadge(transaction.status)}
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTransaction(transaction)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => verifyBlockchain(transaction.docHash)}
                      className="h-8 w-8 p-0"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không tìm thấy giao dịch nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTransactionIcon(selectedTransaction.type)}
                Chi tiết giao dịch
              </DialogTitle>
              <DialogDescription>
                ID: {selectedTransaction.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Thời gian</Label>
                  <p className="text-sm">{selectedTransaction.date}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Loại giao dịch</Label>
                  <p className="text-sm">{selectedTransaction.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Số tiền</Label>
                  <p className={cn(
                    "text-sm font-bold",
                    selectedTransaction.direction === "+" ? "text-green-600" : 
                    selectedTransaction.direction === "-" ? "text-red-600" : "text-gray-600"
                  )}>
                    {selectedTransaction.amount !== 0 ? 
                      `${selectedTransaction.direction}${formatCurrency(Math.abs(selectedTransaction.amount))}` : 
                      "—"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Xác thực Blockchain</Label>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Document Hash:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-white px-2 py-1 rounded border">
                        {selectedTransaction.docHash}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTransaction.docHash)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => verifyBlockchain(selectedTransaction.docHash)}
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Xác thực blockchain
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4 mr-2" />
                      Xem QR Code
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Tải chứng từ
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Legal Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Tuyên bố pháp lý</p>
              <p>
                GoldenBook là nền tảng công nghệ kết nối góp vốn đồng hành vào doanh nghiệp/dự án đã thẩm định. 
                Thông tin "tỷ suất phân phối mục tiêu" do Doanh nghiệp công bố; phân phối lợi ích phụ thuộc kết quả 
                kinh doanh thực tế. GoldenBook không cam kết lợi nhuận cố định và không phải sàn chứng khoán.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletTransactions;