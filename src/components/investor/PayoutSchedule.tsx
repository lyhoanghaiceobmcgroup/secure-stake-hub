import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PayoutPeriod {
  period: string;
  scheduledDate: string;
  actualDate?: string;
  amount: number;
  status: 'scheduled' | 'completed' | 'overdue' | 'processing';
  docHash?: string;
  note?: string;
}

interface PayoutScheduleProps {
  schedule: PayoutPeriod[];
  className?: string;
}

const PayoutSchedule = ({ schedule, className }: PayoutScheduleProps) => {
  const getStatusIcon = (status: PayoutPeriod['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: PayoutPeriod['status']) => {
    const statusConfig = {
      completed: { label: 'Đã chi trả', variant: 'default' as const, class: 'bg-green-100 text-green-800' },
      processing: { label: 'Đang xử lý', variant: 'secondary' as const, class: 'bg-blue-100 text-blue-800' },
      overdue: { label: 'Quá hạn', variant: 'destructive' as const, class: 'bg-red-100 text-red-800' },
      scheduled: { label: 'Dự kiến', variant: 'outline' as const, class: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.class}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Lịch phân phối</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((period, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                {getStatusIcon(period.status)}
                <div>
                  <div className="font-medium">Kỳ {period.period}</div>
                  <div className="text-sm text-muted-foreground">
                    Dự kiến: {formatDate(period.scheduledDate)}
                    {period.actualDate && period.actualDate !== period.scheduledDate && (
                      <span className="ml-2">• Thực tế: {formatDate(period.actualDate)}</span>
                    )}
                  </div>
                  {period.note && (
                    <div className="text-xs text-amber-600 mt-1">{period.note}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(period.amount)}</div>
                  {getStatusBadge(period.status)}
                </div>
                
                {period.docHash && period.status === 'completed' && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {schedule.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Chưa có lịch phân phối nào được lập</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayoutSchedule;