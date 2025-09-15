import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Hash,
  QrCode,
  CheckCircle,
  AlertCircle,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Download,
  Search,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface BlockchainVerificationProps {
  cqid: string;
  onClose: () => void;
}

interface VerificationResult {
  hash: string;
  status: 'verified' | 'pending' | 'failed';
  timestamp: string;
  blockNumber: string;
  transactionId: string;
  documentName: string;
  documentType: string;
  fileSize: string;
  lastModified: string;
}

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'appendix' | 'statement' | 'report' | 'certificate';
  hash: string;
  status: 'verified' | 'pending' | 'failed';
  uploadDate: string;
  size: string;
  blockchainTx?: string;
}

const BlockchainVerification: React.FC<BlockchainVerificationProps> = ({ cqid, onClose }) => {
  const [searchHash, setSearchHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  // Mock data for documents
  const documents: Document[] = [
    {
      id: '1',
      name: 'Hợp đồng đầu tư AquaPure Series A',
      type: 'contract',
      hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
      status: 'verified',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      blockchainTx: '0xabc123def456789'
    },
    {
      id: '2',
      name: 'Phụ lục 1 - Điều khoản bổ sung',
      type: 'appendix',
      hash: '0x2b3c4d5e6f7890ab1234567890abcdef1234567890abcdef1234567890abcdef',
      status: 'verified',
      uploadDate: '2024-01-16',
      size: '1.2 MB',
      blockchainTx: '0xdef456ghi789abc'
    },
    {
      id: '3',
      name: 'Sao kê tháng 12/2024',
      type: 'statement',
      hash: '0x3c4d5e6f7890ab121234567890abcdef1234567890abcdef1234567890abcdef',
      status: 'pending',
      uploadDate: '2024-12-31',
      size: '856 KB'
    },
    {
      id: '4',
      name: 'Báo cáo tiến độ Q4 2024',
      type: 'report',
      hash: '0x4d5e6f7890ab12341234567890abcdef1234567890abcdef1234567890abcdef',
      status: 'verified',
      uploadDate: '2024-12-28',
      size: '3.1 MB',
      blockchainTx: '0xghi789jkl012mno'
    },
    {
      id: '5',
      name: 'Chứng chỉ đầu tư',
      type: 'certificate',
      hash: '0x5e6f7890ab123451234567890abcdef1234567890abcdef1234567890abcdef',
      status: 'failed',
      uploadDate: '2024-01-20',
      size: '1.8 MB'
    }
  ];

  const handleVerifyHash = async () => {
    if (!searchHash.trim()) {
      toast.error('Vui lòng nhập hash để xác thực');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult: VerificationResult = {
        hash: searchHash,
        status: 'verified',
        timestamp: '2024-01-15T10:30:00Z',
        blockNumber: '18,234,567',
        transactionId: '0xabc123def456789ghi012jkl345mno678pqr901stu234vwx567yz890',
        documentName: 'Hợp đồng đầu tư AquaPure Series A',
        documentType: 'Hợp đồng đầu tư',
        fileSize: '2.4 MB',
        lastModified: '2024-01-15T09:15:00Z'
      };
      
      setVerificationResult(mockResult);
      setIsVerifying(false);
      toast.success('Xác thực thành công!');
    }, 2000);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Đã sao chép hash');
  };

  const handleDownloadQR = (hash: string) => {
    // Mock QR code download
    toast.success('Đang tải QR code...');
  };

  const handleViewOnBlockchain = (txId: string) => {
    // Mock blockchain explorer
    toast.info('Đang mở blockchain explorer...');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Đã xác thực</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Thất bại</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'contract': return 'Hợp đồng';
      case 'appendix': return 'Phụ lục';
      case 'statement': return 'Sao kê';
      case 'report': return 'Báo cáo';
      case 'certificate': return 'Chứng chỉ';
      default: return 'Tài liệu';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Xác thực Blockchain
            </h2>
            <p className="text-muted-foreground mt-1">
              Xác thực tính toàn vẹn và xác thực của tài liệu thông qua blockchain
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="verify" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="verify">Xác thực Hash</TabsTrigger>
              <TabsTrigger value="documents">Tài liệu {cqid}</TabsTrigger>
            </TabsList>

            {/* Hash Verification Tab */}
            <TabsContent value="verify" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Xác thực Hash
                  </CardTitle>
                  <CardDescription>
                    Nhập hash của tài liệu để xác thực trên blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hash-input">Hash SHA-256</Label>
                    <div className="flex gap-2">
                      <Input
                        id="hash-input"
                        placeholder="0x1a2b3c4d5e6f7890abcdef..."
                        value={searchHash}
                        onChange={(e) => setSearchHash(e.target.value)}
                        className="font-mono text-sm"
                      />
                      <Button 
                        onClick={handleVerifyHash} 
                        disabled={isVerifying}
                        className="flex items-center gap-2"
                      >
                        {isVerifying ? (
                          <Clock className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        {isVerifying ? 'Đang xác thực...' : 'Xác thực'}
                      </Button>
                    </div>
                  </div>

                  {verificationResult && (
                    <div className="mt-6">
                      <Alert className={`border-2 ${
                        verificationResult.status === 'verified' 
                          ? 'border-green-200 bg-green-50' 
                          : verificationResult.status === 'pending'
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <div className="flex items-start gap-3">
                          {verificationResult.status === 'verified' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : verificationResult.status === 'pending' ? (
                            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <AlertDescription className="text-base font-medium mb-3">
                              {verificationResult.status === 'verified' 
                                ? 'Tài liệu đã được xác thực thành công trên blockchain'
                                : verificationResult.status === 'pending'
                                ? 'Tài liệu đang được xử lý trên blockchain'
                                : 'Không thể xác thực tài liệu trên blockchain'
                              }
                            </AlertDescription>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-muted-foreground">Tên tài liệu:</p>
                                <p className="font-semibold">{verificationResult.documentName}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Loại tài liệu:</p>
                                <p className="font-semibold">{verificationResult.documentType}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Block số:</p>
                                <p className="font-mono">{verificationResult.blockNumber}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Thời gian xác thực:</p>
                                <p>{new Date(verificationResult.timestamp).toLocaleString('vi-VN')}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="font-medium text-muted-foreground mb-1">Transaction ID:</p>
                                <div className="flex items-center gap-2">
                                  <p className="font-mono text-xs bg-gray-100 p-2 rounded flex-1 break-all">
                                    {verificationResult.transactionId}
                                  </p>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleCopyHash(verificationResult.transactionId)}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleViewOnBlockchain(verificationResult.transactionId)}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Tài liệu đã xác thực
                  </CardTitle>
                  <CardDescription>
                    Danh sách tất cả tài liệu và trạng thái xác thực blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{doc.name}</h4>
                              {getStatusBadge(doc.status)}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Loại:</span> {getDocumentTypeLabel(doc.type)}
                              </div>
                              <div>
                                <span className="font-medium">Kích thước:</span> {doc.size}
                              </div>
                              <div>
                                <span className="font-medium">Ngày tải:</span> {new Date(doc.uploadDate).toLocaleDateString('vi-VN')}
                              </div>
                              {doc.blockchainTx && (
                                <div>
                                  <span className="font-medium">TX:</span> 
                                  <span className="font-mono text-xs ml-1">
                                    {doc.blockchainTx.substring(0, 10)}...
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadQR(doc.hash)}
                            >
                              <QrCode className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCopyHash(doc.hash)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            {doc.blockchainTx && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewOnBlockchain(doc.blockchainTx!)}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Hash SHA-256:</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                            >
                              {selectedDocument === doc.id ? 'Ẩn' : 'Hiện'}
                            </Button>
                          </div>
                          {selectedDocument === doc.id && (
                            <div className="bg-gray-50 p-3 rounded border">
                              <p className="font-mono text-xs break-all">{doc.hash}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BlockchainVerification;