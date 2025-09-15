import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Image, FileText } from "lucide-react";
import BlockchainVerifyButton from "./BlockchainVerifyButton";

interface ProgressUpdate {
  period: string;
  percent: number;
  note: string;
  media?: string[];
  reportHash?: string;
  timestamp: string;
}

interface ProgressCardProps {
  title: string;
  updates: ProgressUpdate[];
  className?: string;
}

const ProgressCard = ({ title, updates, className }: ProgressCardProps) => {
  const latestUpdate = updates[0];
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {latestUpdate && (
            <Badge variant="outline">
              {latestUpdate.percent}% hoàn thành
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestUpdate && (
          <>
            <Progress value={latestUpdate.percent} className="w-full" />
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1">Cập nhật gần nhất:</h4>
                <p className="text-sm text-muted-foreground">{latestUpdate.note}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(latestUpdate.timestamp).toLocaleString('vi-VN')}
                </p>
              </div>
              
              {latestUpdate.media && latestUpdate.media.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Hình ảnh minh chứng:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {latestUpdate.media.slice(0, 3).map((media, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                        asChild
                      >
                        <a href={media} target="_blank" rel="noopener noreferrer">
                          <Image className="w-3 h-3" />
                          Ảnh {index + 1}
                        </a>
                      </Button>
                    ))}
                    {latestUpdate.media.length > 3 && (
                      <Badge variant="secondary" className="h-8 flex items-center">
                        +{latestUpdate.media.length - 3} ảnh
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {latestUpdate.reportHash && (
                  <BlockchainVerifyButton
                    hash={latestUpdate.reportHash}
                    timestamp={latestUpdate.timestamp}
                    type="document"
                  />
                )}
                
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="w-3 h-3" />
                  Tài liệu chi tiết
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </>
        )}
        
        {!latestUpdate && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Chưa có cập nhật tiến độ nào</p>
          </div>
        )}
        
        {updates.length > 1 && (
          <Button variant="ghost" size="sm" className="w-full">
            Xem tất cả cập nhật ({updates.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressCard;