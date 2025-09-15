import { Badge } from "@/components/ui/badge";
import { Shield, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UyTinBadgeProps {
  score: number;
  pillars?: {
    B: number; // Business Transparency
    U: number; // Utilization
    Fd: number; // Financial Distribution Reliability  
    Fl: number; // Flow & Liquidity
  };
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const UyTinBadge = ({ score, pillars, size = 'md', showDetails = false }: UyTinBadgeProps) => {
  const getGrade = (score: number) => {
    if (score >= 80) return { grade: 'A', class: 'uy-tin-badge-a' };
    if (score >= 60) return { grade: 'B', class: 'uy-tin-badge-b' };
    return { grade: 'C', class: 'uy-tin-badge-c' };
  };

  const { grade, class: badgeClass } = getGrade(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  const tooltipContent = pillars ? (
    <div className="space-y-2">
      <div className="font-semibold">Chỉ số Uy tín: {score}/100</div>
      <div className="space-y-1 text-xs">
        <div>• Business Transparency: {pillars.B}/100</div>
        <div>• Utilization: {pillars.U}/100</div>
        <div>• Financial Distribution: {pillars.Fd}/100</div>
        <div>• Flow & Liquidity: {pillars.Fl}/100</div>
      </div>
    </div>
  ) : (
    <div>
      <div className="font-semibold">Chỉ số Uy tín: {score}/100</div>
      <div className="text-xs mt-1">
        Thang điểm đánh giá độ tin cậy doanh nghiệp
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              badgeClass,
              sizeClasses[size],
              "inline-flex items-center gap-1 font-semibold cursor-help"
            )}
          >
            <Shield className={iconSizes[size]} />
            Uy tín {grade}
            {showDetails && <span className="text-muted-foreground">({score})</span>}
            <Info className={cn(iconSizes[size], "opacity-60")} />
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UyTinBadge;