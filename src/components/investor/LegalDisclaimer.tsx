import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';

interface LegalDisclaimerProps {
  type: 'esign' | 'report' | 'general';
  className?: string;
  variant?: 'default' | 'warning' | 'info';
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ 
  type, 
  className = '', 
  variant = 'info' 
}) => {
  const getDisclaimerContent = () => {
    const baseContent = `Thông tin "tỷ suất phân phối mục tiêu" do Doanh nghiệp công bố; phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế. GoldenBook là nền tảng công nghệ kết nối góp vốn đồng hành, không cam kết lợi nhuận cố định và không phải sàn chứng khoán. Cơ chế blockchain chỉ dùng để xác thực/chứng cứ, không phát hành tài sản số.`;
    
    switch (type) {
      case 'esign':
        return {
          title: 'Tuyên bố quan trọng trước khi ký',
          content: `${baseContent}\n\nBằng việc ký điện tử, bạn xác nhận đã đọc hiểu và đồng ý với các điều khoản góp vốn đồng hành. Việc phân phối lợi ích sẽ được thực hiện theo kết quả kinh doanh thực tế của doanh nghiệp.`
        };
      case 'report':
        return {
          title: 'Lưu ý về báo cáo phân phối',
          content: `${baseContent}\n\nCác báo cáo phân phối được tạo dựa trên kết quả kinh doanh thực tế. Số liệu có thể thay đổi theo từng kỳ phân phối và phụ thuộc vào hiệu quả hoạt động của doanh nghiệp.`
        };
      default:
        return {
          title: 'Thông tin pháp lý',
          content: baseContent
        };
    }
  };

  const { title, content } = getDisclaimerContent();
  
  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = () => {
    switch (variant) {
      case 'warning':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getAlertVariant()} className={`border-l-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-2">{title}</h4>
          <AlertDescription className="text-xs leading-relaxed whitespace-pre-line">
            {content}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

// Component cho hiển thị compact trong form
export const CompactLegalDisclaimer: React.FC<{ type: 'esign' | 'report' }> = ({ type }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
      <div className="flex items-start space-x-2">
        <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
        <div>
          <p className="font-medium mb-1">
            {type === 'esign' ? 'Lưu ý quan trọng:' : 'Thông tin pháp lý:'}
          </p>
          <p className="leading-relaxed">
            GoldenBook là nền tảng kết nối góp vốn đồng hành, không cam kết lợi nhuận cố định. 
            Phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế của doanh nghiệp.
          </p>
        </div>
      </div>
    </div>
  );
};

// Component cho footer disclaimer
export const FooterLegalDisclaimer: React.FC = () => {
  return (
    <div className="text-xs text-gray-500 text-center py-4 border-t">
      <p>
        GoldenBook là nền tảng công nghệ kết nối góp vốn đồng hành. 
        Không cam kết lợi nhuận cố định và không phải sàn chứng khoán.
      </p>
    </div>
  );
};

export default LegalDisclaimer;