import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, Eye, Edit, Plus } from "lucide-react";
import { AuctionRound, BidOrder } from "@/types/auction";

interface AuctionsAdminProps {
  auctions: AuctionRound[];
  bids: BidOrder[];
}

export const AuctionsAdmin = ({ auctions, bids }: AuctionsAdminProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary' as const,
      open: 'default' as const,
      clearing: 'secondary' as const,
      closed: 'outline' as const
    };
    const labels = {
      pending: 'Sắp mở',
      open: 'Đang mở',
      clearing: 'Đang chốt',
      closed: 'Đã đóng'
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Quản Lý Vòng Đấu Giá ({auctions.length})
              </CardTitle>
              <CardDescription>Theo dõi và quản lý các vòng đấu giá quyền lợi phân phối</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Vòng Mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Vòng</TableHead>
                <TableHead>Doanh Nghiệp</TableHead>
                <TableHead>Gói / Kỳ Hạn</TableHead>
                <TableHead>Mục Tiêu / Huy Động</TableHead>
                <TableHead>Lãi Suất Hiện Tại</TableHead>
                <TableHead>Độ Phủ</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auctions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Chưa có vòng đấu giá nào
                  </TableCell>
                </TableRow>
              ) : (
                auctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell className="font-mono text-sm">{auction.roundId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{auction.company}</p>
                        <p className="text-xs text-muted-foreground">GID: {auction.gid}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{auction.packageName}</p>
                        <p className="text-xs text-muted-foreground">{auction.termMonths} tháng</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-semibold">{formatCurrency(auction.raised)}</p>
                        <p className="text-muted-foreground">/ {formatCurrency(auction.targetAmount)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">{auction.rOffer}%</TableCell>
                    <TableCell>
                      <Badge variant={auction.cover >= 1 ? 'default' : 'secondary'}>
                        {auction.cover.toFixed(2)}x
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(auction.status)}</TableCell>
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

      <Card>
        <CardHeader>
          <CardTitle>Lệnh Đặt Gần Đây ({bids.length})</CardTitle>
          <CardDescription>Theo dõi tất cả lệnh đặt từ investors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Lệnh</TableHead>
                <TableHead>Investor</TableHead>
                <TableHead>Vòng Đấu Giá</TableHead>
                <TableHead>Số Tiền</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Lãi Suất Chốt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Chưa có lệnh đặt nào
                  </TableCell>
                </TableRow>
              ) : (
                bids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell className="font-mono text-sm">{bid.bidId}</TableCell>
                    <TableCell>{bid.userName || 'N/A'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{bid.roundId}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(bid.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={bid.type === 'market' ? 'default' : 'secondary'}>
                        {bid.type === 'market' ? 'Nhận ngay' : 'Giới hạn'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        bid.status === 'filled' ? 'default' : 
                        bid.status === 'pending' ? 'secondary' : 'outline'
                      }>
                        {bid.status === 'filled' ? 'Đã khớp' : 
                         bid.status === 'pending' ? 'Chờ xử lý' : 
                         bid.status === 'cancelled' ? 'Đã hủy' : bid.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {bid.clearRate ? `${bid.clearRate}%` : '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};