import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2, Building2, Calendar, Eye } from "lucide-react";
import { toast } from "sonner";
import { opportunityService, InvestmentOpportunity } from "@/services/opportunityService";

export const OpportunitiesAdmin = () => {
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await opportunityService.getAll();
      setOpportunities(data);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const loadActivitiesForOpportunity = async (opportunityId: string) => {
    try {
      const data = await opportunityService.getOpportunityActivities(opportunityId);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleCreate = () => {
    setEditingOpportunity(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (opportunity: InvestmentOpportunity) => {
    setEditingOpportunity(opportunity);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      try {
        await opportunityService.delete(id);
        toast.success('Đã xóa dự án thành công');
        loadOpportunities();
      } catch (error) {
        toast.error('Không thể xóa dự án');
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const opportunityData: Partial<InvestmentOpportunity> = {
      company_name: formData.get('companyName') as string,
      project_name: formData.get('projectName') as string,
      description: formData.get('description') as string,
      target_rate: parseFloat(formData.get('targetRate') as string),
      payout_frequency: formData.get('payoutFrequency') as string,
      min_investment: parseFloat(formData.get('minInvestment') as string),
      total_target: parseFloat(formData.get('totalTarget') as string),
      raised: parseFloat(formData.get('raised') as string) || 0,
      sector: formData.get('sector') as string,
      duration: formData.get('duration') as string,
      uy_tin_score: parseFloat(formData.get('uyTinScore') as string),
      risk_level: formData.get('riskLevel') as string,
      deadline: formData.get('deadline') as string,
      status: formData.get('status') as string,
    };

    try {
      if (editingOpportunity) {
        await opportunityService.update(editingOpportunity.id, opportunityData);
        toast.success('Đã cập nhật dự án thành công');
      } else {
        await opportunityService.create(opportunityData);
        toast.success('Đã tạo dự án mới thành công');
      }
      
      setIsDialogOpen(false);
      setEditingOpportunity(null);
      loadOpportunities();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const getRiskBadgeVariant = (risk: string): "default" | "secondary" | "destructive" | "outline" => {
    if (risk === 'low') return 'default';
    if (risk === 'medium') return 'secondary';
    if (risk === 'high') return 'destructive';
    return 'outline';
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'open') return 'default';
    if (status === 'closing_soon') return 'secondary';
    if (status === 'closed') return 'outline';
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Quản Lý Cơ Hội Đầu Tư ({opportunities.length})
            </CardTitle>
            <CardDescription>Tạo và cập nhật các dự án đầu tư hiển thị cho investors</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Dự Án Mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOpportunity ? 'Chỉnh Sửa Dự Án' : 'Tạo Dự Án Mới'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Tên Công Ty *</Label>
                    <Input id="companyName" name="companyName" defaultValue={editingOpportunity?.company_name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Tên Dự Án *</Label>
                    <Input id="projectName" name="projectName" defaultValue={editingOpportunity?.project_name} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Mô Tả *</Label>
                  <Textarea id="description" name="description" defaultValue={editingOpportunity?.description} required rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sector">Lĩnh Vực *</Label>
                    <Input id="sector" name="sector" defaultValue={editingOpportunity?.sector} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Thời Gian *</Label>
                    <Input id="duration" name="duration" defaultValue={editingOpportunity?.duration} required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetRate">Lãi Suất (%) *</Label>
                    <Input id="targetRate" name="targetRate" type="number" step="0.1" defaultValue={editingOpportunity?.target_rate} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uyTinScore">Điểm Uy Tín *</Label>
                    <Input id="uyTinScore" name="uyTinScore" type="number" min="0" max="100" defaultValue={editingOpportunity?.uy_tin_score} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riskLevel">Mức Rủi Ro *</Label>
                    <Select name="riskLevel" defaultValue={editingOpportunity?.risk_level || 'medium'}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Thấp</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minInvestment">Đầu Tư Tối Thiểu *</Label>
                    <Input id="minInvestment" name="minInvestment" type="number" defaultValue={editingOpportunity?.min_investment} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalTarget">Mục Tiêu Huy Động *</Label>
                    <Input id="totalTarget" name="totalTarget" type="number" defaultValue={editingOpportunity?.total_target} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="raised">Đã Huy Động *</Label>
                    <Input id="raised" name="raised" type="number" defaultValue={editingOpportunity?.raised || 0} required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payoutFrequency">Tần Suất Phân Phối *</Label>
                    <Select name="payoutFrequency" defaultValue={editingOpportunity?.payout_frequency || 'monthly'}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                        <SelectItem value="quarterly">Hàng quý</SelectItem>
                        <SelectItem value="yearly">Hàng năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng Thái *</Label>
                    <Select name="status" defaultValue={editingOpportunity?.status || 'open'}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Đang mở</SelectItem>
                        <SelectItem value="closing_soon">Sắp đóng</SelectItem>
                        <SelectItem value="closed">Đã đóng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Hạn Chót *</Label>
                    <Input id="deadline" name="deadline" type="date" defaultValue={editingOpportunity?.deadline} required />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                  <Button type="submit">{editingOpportunity ? 'Cập Nhật' : 'Tạo Mới'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Công Ty / Dự Án</TableHead>
              <TableHead>Lĩnh Vực</TableHead>
              <TableHead>Lãi Suất</TableHead>
              <TableHead>Huy Động / Mục Tiêu</TableHead>
              <TableHead>Rủi Ro</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead>Hạn Chót</TableHead>
              <TableHead>Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Chưa có dự án nào. Nhấn "Tạo Dự Án Mới" để thêm dự án đầu tiên.
                </TableCell>
              </TableRow>
            ) : (
              opportunities.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{opp.company_name}</p>
                      <p className="text-sm text-muted-foreground">{opp.project_name}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{opp.sector}</Badge></TableCell>
                  <TableCell className="font-semibold text-green-600">{opp.target_rate}%</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{formatCurrency(opp.raised)}</span>
                        <span className="text-muted-foreground">/</span>
                        <span>{formatCurrency(opp.total_target)}</span>
                      </div>
                      <Progress value={(opp.raised / opp.total_target) * 100} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(opp.risk_level)}>
                      {opp.risk_level === 'low' ? 'Thấp' : opp.risk_level === 'medium' ? 'TB' : 'Cao'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(opp.status)}>
                      {opp.status === 'open' ? 'Mở' : opp.status === 'closing_soon' ? 'Sắp đóng' : 'Đã đóng'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(opp.deadline).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => loadActivitiesForOpportunity(opp.id)}
                        title="Xem hoạt động"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(opp)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(opp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
};