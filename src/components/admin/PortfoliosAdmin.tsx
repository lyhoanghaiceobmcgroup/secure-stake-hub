import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Edit, Shield } from "lucide-react";
import { InvestmentData } from "@/services/portfolioService";

interface PortfoliosAdminProps {
  portfolios: InvestmentData[];
}

export const PortfoliosAdmin = ({ portfolios }: PortfoliosAdminProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default' as const,
      upcoming: 'secondary' as const,
      closed: 'outline' as const,
      transferred: 'secondary' as const
    };
    const labels = {
      active: 'Đang hoạt động',
      upcoming: 'Sắp tới',
      closed: 'Đã đóng',
      transferred: 'Đã chuyển nhượng'
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Quản Lý Sổ Đầu Tư ({portfolios.length})
        </CardTitle>
        <CardDescription>Theo dõi tất cả danh mục đầu tư của investors</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CQID</TableHead>
              <TableHead>Doanh Nghiệp / Gói</TableHead>
              <TableHead>Lĩnh Vực</TableHead>
              <TableHead>Số Tiền Góp</TableHead>
              <TableHead>Đã Nhận</TableHead>
              <TableHead>Tỷ Suất</TableHead>
              <TableHead>Uy Tín</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead>Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Chưa có danh mục đầu tư nào
                </TableCell>
              </TableRow>
            ) : (
              portfolios.map((portfolio) => (
                <TableRow key={portfolio.id}>
                  <TableCell className="font-mono text-sm">{portfolio.cqid}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{portfolio.companyName}</p>
                      <p className="text-sm text-muted-foreground">{portfolio.packageName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{portfolio.sector}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(portfolio.amountContributed)}</TableCell>
                  <TableCell className="text-green-600 font-semibold">{formatCurrency(portfolio.distributionReceived)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-semibold">{portfolio.actualRateYTD}%</p>
                      <p className="text-muted-foreground text-xs">Mục tiêu: {portfolio.targetRate}%</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {portfolio.uyTinScore}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(portfolio.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};