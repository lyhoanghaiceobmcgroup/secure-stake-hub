import { Button } from "@/components/ui/button";
import { Link2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface BlockchainVerifyButtonProps {
  hash: string;
  timestamp?: string;
  version?: string;
  type?: 'document' | 'transaction' | 'certificate';
  size?: 'sm' | 'default' | 'lg';
}

const BlockchainVerifyButton = ({ 
  hash, 
  timestamp, 
  version = "1.0", 
  type = 'document',
  size = 'sm'
}: BlockchainVerifyButtonProps) => {
  const getTypeLabel = () => {
    switch (type) {
      case 'document':
        return 'Tài liệu';
      case 'transaction':
        return 'Giao dịch';
      case 'certificate':
        return 'Chứng chỉ';
      default:
        return 'Dữ liệu';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={size} className="gap-2">
          <Link2 className="w-4 h-4" />
          Xác thực blockchain
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xác thực blockchain</DialogTitle>
          <DialogDescription>
            Thông tin xác thực cho {getTypeLabel().toLowerCase()} này
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-sm font-medium">Loại:</label>
            <div className="col-span-3">
              <Badge variant="outline">{getTypeLabel()}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-sm font-medium">Hash:</label>
            <div className="col-span-3">
              <code className="text-xs font-mono bg-muted p-2 rounded block break-all">
                {hash}
              </code>
            </div>
          </div>
          
          {timestamp && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-sm font-medium">Thời gian:</label>
              <div className="col-span-3 text-sm">
                {new Date(timestamp).toLocaleString('vi-VN')}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-sm font-medium">Phiên bản:</label>
            <div className="col-span-3 text-sm">{version}</div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-800 font-medium">
              Đã xác thực trên blockchain
            </span>
          </div>
          
          <Button variant="outline" className="w-full gap-2" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Xem trên blockchain explorer
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockchainVerifyButton;