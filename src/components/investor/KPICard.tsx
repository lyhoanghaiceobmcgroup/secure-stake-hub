import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  delta?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  format?: 'currency' | 'percentage' | 'number';
  className?: string;
  help?: string;
}

const KPICard = ({ label, value, delta, format = 'currency', className, help }: KPICardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('vi-VN');
    }
  };

  const getDeltaIcon = () => {
    switch (delta?.type) {
      case 'increase':
        return <TrendingUp className="w-3 h-3" />;
      case 'decrease':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getDeltaColor = () => {
    switch (delta?.type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn("hover-lift", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {help && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              ?
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-navy">{formatValue(value)}</div>
          {delta && (
            <div className={cn("flex items-center text-xs", getDeltaColor())}>
              {getDeltaIcon()}
              <span className="ml-1">
                {delta.type === 'increase' ? '+' : delta.type === 'decrease' ? '-' : ''}
                {Math.abs(delta.value).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;