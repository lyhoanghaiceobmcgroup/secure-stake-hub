import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@/contexts/WalletContext";
import {
  Wallet,
  QrCode,
  CreditCard,
  Smartphone,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Download,
  RefreshCw,
  Info,
  ExternalLink,
  Banknote
} from "lucide-react";
import { toast } from "sonner";

interface DepositTransaction {
  id: string;
  amount: number;
  method: 'napas' | 'bank_transfer' | 'cash';
  status: 'init' | 'processing' | 'success' | 'failed';
  createdAt: string;
  completedAt?: string;
  txHash?: string;
  receiptHash?: string;
}

const WalletDeposit = () => {
  const [activeMethod, setActiveMethod] = useState<'napas' | 'bank_transfer' | 'cash'>('napas');
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<DepositTransaction | null>(null);
  const { updateAvailableBalance } = useWallet();
  const [recentTransactions] = useState<DepositTransaction[]>([
    {
      id: 'tx001',
      amount: 5000000,
      method: 'napas',
      status: 'success',
      createdAt: '2025-01-20T10:30:00Z',
      completedAt: '2025-01-20T10:32:15Z',
      txHash: '0x1a2b3c4d',
      receiptHash: '0x5e6f7g8h'
    },
    {
      id: 'tx002',
      amount: 10000000,
      method: 'bank_transfer',
      status: 'success',
      createdAt: '2025-01-19T14:20:00Z',
      completedAt: '2025-01-19T14:25:30Z',
      txHash: '0x9i0j1k2l',
      receiptHash: '0x3m4n5o6p'
    }
  ]);

  const paymentMethods = {
    napas: {
      name: 'QR Napas',
      icon: QrCode,
      description: 'Quét mã QR để thanh toán qua ứng dụng ngân hàng',
      processingTime: '1-3 phút'
    },
    bank_transfer: {
      name: 'Chuyển khoản ngân hàng',
      icon: CreditCard,
      description: 'Chuyển khoản trực tiếp đến tài khoản GoldenBook',
      processingTime: '5-15 phút'
    },
    cash: {
      name: 'Tiền mặt',
      icon: Banknote,
      description: 'Nạp tiền mặt tại văn phòng hoặc qua đại lý',
      processingTime: 'Ngay lập tức'
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) < 100000) {
      toast.error('Số tiền nạp tối thiểu là 100,000 VNĐ');
      return;
    }

    setIsProcessing(true);
    
    const newTransaction: DepositTransaction = {
      id: `tx${Date.now()}`,
      amount: parseFloat(depositAmount),
      method: activeMethod,
      status: 'init',
      createdAt: new Date().toISOString()
    };
    
    setCurrentTransaction(newTransaction);
    
    // Simulate payment processing based on method
    if (activeMethod === 'cash') {
      // For cash deposits, simulate manual processing
      setTimeout(() => {
        setCurrentTransaction(prev => prev ? { ...prev, status: 'processing' } : null);
        toast.info('Vui lòng đến văn phòng để hoàn tất giao dịch');
        
        // Simulate longer processing time for cash
        setTimeout(() => {
          setCurrentTransaction(prev => prev ? {
            ...prev,
            status: 'success',
            completedAt: new Date().toISOString(),
            txHash: `CASH${Date.now()}`,
            receiptHash: `RCP${Date.now()}`
          } : null);
          setIsProcessing(false);
          updateAvailableBalance(parseFloat(depositAmount));
          toast.success('Nạp tiền mặt thành công! Số dư đã được cập nhật.');
        }, 5000);
      }, 1000);
    } else {
      // For electronic payments
      setTimeout(() => {
        setCurrentTransaction(prev => prev ? { ...prev, status: 'processing' } : null);
        
        setTimeout(() => {
          setCurrentTransaction(prev => prev ? {
            ...prev,
            status: 'success',
            completedAt: new Date().toISOString(),
            txHash: `0x${Math.random().toString(16).substr(2, 8)}`,
            receiptHash: `0x${Math.random().toString(16).substr(2, 8)}`
          } : null);
          setIsProcessing(false);
          updateAvailableBalance(parseFloat(depositAmount));
          toast.success('Nạp tiền thành công!');
        }, 3000);
      }, 2000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Thành công</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'init':
        return <Badge className="bg-blue-500"><Clock className="w-3 h-3 mr-1" />Khởi tạo</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Thất bại</Badge>;
      default:
        return null;
    }
  };

  if (currentTransaction && isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đang xử lý giao dịch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Đang xử lý nạp tiền</h3>
              <p className="text-muted-foreground">
                Số tiền: {formatCurrency(currentTransaction.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                Phương thức: {paymentMethods[currentTransaction.method].name}
              </p>
            </div>
            {getStatusBadge(currentTransaction.status)}
          </div>

          {activeMethod === 'napas' && currentTransaction.status === 'init' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Quét mã QR bằng ứng dụng ngân hàng của bạn
                </p>
              </div>
            </div>
          )}

          {activeMethod === 'bank_transfer' && currentTransaction.status === 'init' && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Vui lòng chuyển khoản đến thông tin tài khoản bên dưới
                </AlertDescription>
              </Alert>
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ngân hàng:</span>
                  <span>Vietcombank</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span>1234567890</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard('1234567890')}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Chủ tài khoản:</span>
                  <span>GOLDENBOOK JSC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Nội dung:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">GB{currentTransaction.id}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`GB${currentTransaction.id}`)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMethod === 'cash' && currentTransaction.status === 'init' && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Vui lòng đến văn phòng hoặc đại lý để nạp tiền mặt
                </AlertDescription>
              </Alert>
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Địa chỉ văn phòng:</span>
                  <span>123 Nguyễn Huệ, Q1, TP.HCM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Giờ làm việc:</span>
                  <span>8:00 - 17:00 (T2-T6)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Mã giao dịch:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">GB{currentTransaction.id}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`GB${currentTransaction.id}`)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <Alert>
                <Banknote className="h-4 w-4" />
                <AlertDescription>
                  Vui lòng mang theo mã giao dịch và CMND/CCCD khi đến nạp tiền
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => {
              setCurrentTransaction(null);
              setIsProcessing(false);
            }}>
              Hủy giao dịch
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentTransaction && currentTransaction.status === 'success') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nạp tiền thành công</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-700">Giao dịch hoàn tất</h3>
              <p className="text-muted-foreground">
                Số tiền: {formatCurrency(currentTransaction.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                Hoàn thành lúc: {new Date(currentTransaction.completedAt!).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Biên nhận nạp:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {currentTransaction.receiptHash}
                </code>
                <Button variant="ghost" size="sm">
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Mã giao dịch:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {currentTransaction.txHash}
                </code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(currentTransaction.txHash!)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Số dư khả dụng của bạn đã được cập nhật. Bạn có thể bắt đầu khám phá các cơ hội đầu tư.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => {
              setCurrentTransaction(null);
              setDepositAmount('');
            }}>
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Khám phá cơ hội
            </Button>
            <Button variant="outline" onClick={() => {
              setCurrentTransaction(null);
              setDepositAmount('');
            }}>
              Nạp thêm
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nạp số dư vào ví</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="amount">Số tiền nạp (VNĐ)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Nhập số tiền (tối thiểu 100,000)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="100000"
              step="10000"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Số tiền nạp tối thiểu: 100,000 VNĐ
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[500000, 1000000, 5000000, 10000000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setDepositAmount(amount.toString())}
              >
                {formatCurrency(amount)}
              </Button>
            ))}
          </div>

          <Separator />

          <div>
            <Label>Chọn phương thức thanh toán</Label>
            <Tabs value={activeMethod} onValueChange={(value) => setActiveMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                {Object.entries(paymentMethods).map(([key, method]) => {
                  const Icon = method.icon;
                  return (
                    <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{method.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(paymentMethods).map(([key, method]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <method.icon className="w-6 h-6" />
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Thời gian xử lý: {method.processingTime}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <Button 
            onClick={handleDeposit} 
            className="w-full" 
            disabled={!depositAmount || parseFloat(depositAmount) < 100000}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Nạp {depositAmount ? formatCurrency(parseFloat(depositAmount)) : 'tiền'}
          </Button>
        </CardContent>
      </Card>

      {recentTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{formatCurrency(tx.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethods[tx.method].name} • {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(tx.status)}
                    {tx.receiptHash && (
                      <div className="flex items-center gap-1 mt-1">
                        <Button variant="ghost" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletDeposit;