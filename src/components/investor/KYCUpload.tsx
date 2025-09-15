import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  FileText,
  QrCode,
  Download,
  Eye,
  Loader2
} from "lucide-react";

interface KYCDocument {
  id: string;
  type: 'front' | 'back' | 'selfie';
  file?: File;
  preview?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  hash?: string;
}

const KYCUpload = () => {
  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'pending_review' | 'verified' | 'rejected'>('not_started');
  const [documents, setDocuments] = useState<KYCDocument[]>([
    { id: '1', type: 'front', status: 'pending' },
    { id: '2', type: 'back', status: 'pending' },
    { id: '3', type: 'selfie', status: 'pending' }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentLabels = {
    front: 'CCCD/CMND mặt trước',
    back: 'CCCD/CMND mặt sau',
    selfie: 'Ảnh chân dung (Selfie)'
  };

  const handleFileUpload = (documentId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, file, preview: e.target?.result as string, status: 'uploaded' }
          : doc
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitKYC = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setKycStatus('pending_review');
          // Simulate verification after 3 seconds
          setTimeout(() => {
            setKycStatus('verified');
            setDocuments(prev => prev.map(doc => ({
              ...doc,
              status: 'verified',
              hash: `0x${Math.random().toString(16).substr(2, 8)}`
            })));
          }, 3000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const allDocumentsUploaded = documents.every(doc => doc.status === 'uploaded' || doc.status === 'verified');

  if (kycStatus === 'verified') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Xác thực KYC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold text-green-700 mb-2">KYC đã được xác thực</h3>
            <p className="text-sm text-green-600">
              Hoàn thành vào {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Biên bản KYC:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  0x{Math.random().toString(16).substr(2, 16)}
                </code>
                <Button variant="ghost" size="sm">
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Tài liệu KYC</h4>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center text-sm">
                  <span>{documentLabels[doc.type]}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Đã xác thực
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Cập nhật KYC
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xác thực KYC</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {kycStatus === 'not_started' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Để sử dụng đầy đủ tính năng của GoldenBook, bạn cần hoàn thành xác thực KYC bằng cách tải lên CCCD/CMND và ảnh chân dung.
            </AlertDescription>
          </Alert>
        )}

        {kycStatus === 'pending_review' && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Tài liệu KYC của bạn đang được xem xét. Quá trình này thường mất 1-2 ngày làm việc.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">{documentLabels[doc.type]}</h4>
                {doc.status === 'verified' && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đã xác thực
                  </Badge>
                )}
                {doc.status === 'uploaded' && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Đã tải lên
                  </Badge>
                )}
              </div>
              
              {doc.preview ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img 
                      src={doc.preview} 
                      alt={documentLabels[doc.type]}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          setDocuments(prev => prev.map(d => 
                            d.id === doc.id 
                              ? { ...d, file: undefined, preview: undefined, status: 'pending' }
                              : d
                          ));
                        }}
                      >
                        Thay đổi
                      </Button>
                    </div>
                  </div>
                  {doc.hash && (
                    <div className="flex justify-between items-center text-xs">
                      <span>Hash: {doc.hash}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <QrCode className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">
                    {doc.type === 'selfie' 
                      ? 'Chụp ảnh chân dung hoặc tải lên từ thiết bị'
                      : 'Chụp ảnh hoặc tải lên từ thiết bị'
                    }
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Chụp ảnh
                    </Button>
                    <Label htmlFor={`file-${doc.id}`}>
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Tải lên
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id={`file-${doc.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(doc.id, file);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Đang xử lý tài liệu KYC...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {allDocumentsUploaded && !isUploading && kycStatus === 'not_started' && (
          <Button 
            onClick={handleSubmitKYC} 
            className="w-full"
            disabled={isUploading}
          >
            <FileText className="w-4 h-4 mr-2" />
            Gửi tài liệu KYC
          </Button>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Tài liệu phải rõ nét, đầy đủ thông tin</p>
          <p>• Ảnh chân dung phải khớp với thông tin trên CCCD/CMND</p>
          <p>• Quá trình xác thực thường mất 1-2 ngày làm việc</p>
          <p>• Tất cả tài liệu sẽ được mã hóa và lưu trữ an toàn</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KYCUpload;