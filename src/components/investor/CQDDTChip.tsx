import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, QrCode, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface CQDDTChipProps {
  id: string;
  qrLink?: string;
  className?: string;
}

const CQDDTChip = ({ id, qrLink, className }: CQDDTChipProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      toast({
        title: "Đã sao chép",
        description: "Mã CQĐĐT đã được sao chép vào clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể sao chép mã CQĐĐT",
        variant: "destructive",
      });
    }
  };

  const openQR = () => {
    if (qrLink) {
      window.open(qrLink, '_blank');
    }
  };

  // Shorten ID for display
  const displayId = id.length > 16 ? `${id.slice(0, 8)}...${id.slice(-8)}` : id;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge variant="outline" className="font-mono text-xs">
        CQĐĐT: {displayId}
      </Badge>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
        
        {qrLink && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={openQR}
          >
            <QrCode className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CQDDTChip;