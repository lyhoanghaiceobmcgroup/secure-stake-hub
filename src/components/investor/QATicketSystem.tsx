import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageCircle, 
  Plus, 
  Search, 
  ThumbsUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Building2,
  Tag,
  Flag,
  Send,
  Paperclip,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QAItem {
  id: string;
  question: string;
  answer?: string;
  upvotes: number;
  views: number;
  createdAt: string;
  answeredAt?: string;
  tags: string[];
  isOfficialAnswer: boolean;
  status: 'pending' | 'answered' | 'escalated';
  company: {
    id: string;
    name: string;
    logo: string;
  };
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'payout' | 'document' | 'progress' | 'technical' | 'other';
  createdAt: string;
  updatedAt: string;
  responseTime?: number; // in hours
  company: {
    id: string;
    name: string;
    logo: string;
  };
  assignee?: {
    name: string;
    role: string;
  };
  messages: Array<{
    id: string;
    content: string;
    sender: 'investor' | 'company' | 'support';
    createdAt: string;
    attachments?: string[];
  }>;
}

const QATicketSystem = () => {
  const [activeTab, setActiveTab] = useState("qa");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "other" as const,
    priority: "medium" as const
  });

  // Mock Q&A data
  const qaItems: QAItem[] = [
    {
      id: "1",
      question: "Kỳ 09/2025 có điều chỉnh lịch phân phối không?",
      answer: "Không có điều chỉnh. Kỳ 09/2025 sẽ diễn ra đúng ngày 30/09/2025 như kế hoạch đã công bố.",
      upvotes: 126,
      views: 1847,
      createdAt: "2025-09-01T09:15:00Z",
      answeredAt: "2025-09-02T10:30:00Z",
      tags: ["phân phối", "lịch kỳ"],
      isOfficialAnswer: true,
      status: "answered",
      company: {
        id: "1",
        name: "AquaPure JSC",
        logo: "/placeholder.svg"
      }
    },
    {
      id: "2",
      question: "Làm thế nào để tải sao kê thanh toán kỳ 08/2025?",
      answer: "Bạn có thể tải sao kê tại mục 'Tài liệu' → 'Sao kê phân phối' → Chọn kỳ 08/2025. File có DocHash #5a0…d4 để xác thực.",
      upvotes: 93,
      views: 1234,
      createdAt: "2025-08-31T20:45:00Z",
      answeredAt: "2025-09-01T08:20:00Z",
      tags: ["tài liệu", "sao kê", "thanh toán"],
      isOfficialAnswer: true,
      status: "answered",
      company: {
        id: "1",
        name: "AquaPure JSC", 
        logo: "/placeholder.svg"
      }
    },
    {
      id: "3",
      question: "Tiến độ dự án giai đoạn 2 hiện tại như thế nào?",
      upvotes: 45,
      views: 892,
      createdAt: "2025-09-03T14:20:00Z",
      tags: ["tiến độ", "dự án"],
      isOfficialAnswer: false,
      status: "pending",
      company: {
        id: "2",
        name: "UrbanFoods Co.",
        logo: "/placeholder.svg"
      }
    }
  ];

  // Mock Ticket data
  const tickets: Ticket[] = [
    {
      id: "T001",
      title: "Chưa nhận được phân phối kỳ 08/2025",
      description: "Tôi chưa nhận được khoản phân phối kỳ 08/2025 mặc dù đã qua hạn thanh toán. Xin kiểm tra lại tài khoản của tôi.",
      status: "in_progress",
      priority: "high",
      category: "payout",
      createdAt: "2025-09-01T10:30:00Z",
      updatedAt: "2025-09-02T14:15:00Z",
      responseTime: 4.5,
      company: {
        id: "1", 
        name: "AquaPure JSC",
        logo: "/placeholder.svg"
      },
      assignee: {
        name: "Nguyễn Văn A",
        role: "Chuyên viên quan hệ nhà đầu tư"
      },
      messages: [
        {
          id: "m1",
          content: "Chúng tôi đã nhận được yêu cầu của bạn và đang kiểm tra thông tin tài khoản. Dự kiến sẽ có phản hồi trong 24h.",
          sender: "company",
          createdAt: "2025-09-01T15:20:00Z"
        },
        {
          id: "m2", 
          content: "Cảm ơn bạn đã phản hồi nhanh chóng. Tôi sẽ chờ thông tin cập nhật.",
          sender: "investor",
          createdAt: "2025-09-01T16:45:00Z"
        }
      ]
    },
    {
      id: "T002",
      title: "Yêu cầu cập nhật thông tin liên hệ",
      description: "Tôi muốn thay đổi số điện thoại và email nhận thông báo. Xin hướng dẫn thủ tục.",
      status: "resolved",
      priority: "low", 
      category: "other",
      createdAt: "2025-08-28T09:15:00Z",
      updatedAt: "2025-08-29T11:30:00Z",
      responseTime: 2.2,
      company: {
        id: "1",
        name: "AquaPure JSC",
        logo: "/placeholder.svg"
      },
      assignee: {
        name: "Trần Thị B",
        role: "Chuyên viên hỗ trợ khách hàng"
      },
      messages: [
        {
          id: "m3",
          content: "Đã cập nhật thông tin theo yêu cầu. Bạn sẽ nhận được xác nhận qua email mới trong 15 phút.",
          sender: "company", 
          createdAt: "2025-08-29T11:30:00Z"
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Chờ trả lời</Badge>;
      case 'answered':
        return <Badge variant="secondary" className="text-green-600 bg-green-50">Đã trả lời</Badge>;
      case 'escalated':
        return <Badge variant="destructive">Đã chuyển ticket</Badge>;
      case 'open':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Mới tạo</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Đang xử lý</Badge>;
      case 'resolved':
        return <Badge variant="secondary" className="text-green-600 bg-green-50">Đã giải quyết</Badge>;
      case 'closed':
        return <Badge variant="secondary">Đã đóng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Thấp</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Trung bình</Badge>;
      case 'high':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Cao</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Khẩn cấp</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'payout': return 'Phân phối';
      case 'document': return 'Tài liệu';
      case 'progress': return 'Tiến độ';
      case 'technical': return 'Kỹ thuật';
      case 'other': return 'Khác';
      default: return category;
    }
  };

  const QAList = () => (
    <div className="space-y-4">
      {qaItems
        .filter(qa => 
          qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          qa.company.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(qa => selectedCategory === "all" || qa.tags.includes(selectedCategory))
        .map((qa) => (
        <Card key={qa.id} className="glass-card hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-2">{qa.question}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <img 
                      src={qa.company.logo} 
                      alt={qa.company.name}
                      className="w-4 h-4 rounded object-cover"
                    />
                    <span>{qa.company.name}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{new Date(qa.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {qa.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(qa.status)}
                </div>
              </div>
              
              {qa.answer && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {qa.isOfficialAnswer ? 'Giải đáp chính thức' : 'Trả lời từ DN'}
                    </Badge>
                    {qa.answeredAt && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(qa.answeredAt).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{qa.answer}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {qa.upvotes} hữu ích
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {qa.views} lượt xem
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    Hữu ích
                  </Button>
                  {qa.status === 'answered' && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Chuyển ticket
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <Flag className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const TicketList = () => (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="glass-card hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-muted-foreground">{ticket.id}</span>
                    {getPriorityBadge(ticket.priority)}
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(ticket.category)}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{ticket.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <img 
                      src={ticket.company.logo}
                      alt={ticket.company.name}
                      className="w-4 h-4 rounded object-cover"
                    />
                    <span>{ticket.company.name}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</span>
                    {ticket.responseTime && (
                      <>
                        <span>•</span>
                        <span>Phản hồi trong {ticket.responseTime}h</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  {getStatusBadge(ticket.status)}
                  {ticket.assignee && (
                    <div className="text-xs text-muted-foreground">
                      <User className="w-3 h-3 inline mr-1" />
                      {ticket.assignee.name}
                    </div>
                  )}
                </div>
              </div>
              
              {ticket.messages.length > 0 && (
                <div className="p-3 rounded-lg bg-secondary/30 border">
                  <div className="text-xs text-muted-foreground mb-1">Tin nhắn gần nhất:</div>
                  <p className="text-sm line-clamp-2">{ticket.messages[ticket.messages.length - 1].content}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground">
                  Cập nhật: {new Date(ticket.updatedAt).toLocaleDateString('vi-VN')}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const CreateTicketDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Tạo ticket mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo ticket hỗ trợ mới</DialogTitle>
          <DialogDescription>
            Mô tả vấn đề của bạn để nhận được hỗ trợ nhanh nhất
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Danh mục</label>
              <Select value={newTicket.category} onValueChange={(value: any) => 
                setNewTicket(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payout">Phân phối</SelectItem>
                  <SelectItem value="document">Tài liệu</SelectItem>
                  <SelectItem value="progress">Tiến độ</SelectItem>
                  <SelectItem value="technical">Kỹ thuật</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Mức độ ưu tiên</label>
              <Select value={newTicket.priority} onValueChange={(value: any) =>
                setNewTicket(prev => ({ ...prev, priority: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="urgent">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Tiêu đề</label>
            <Input
              placeholder="Mô tả ngắn gọn vấn đề..."
              value={newTicket.title}
              onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Mô tả chi tiết</label>
            <Textarea
              placeholder="Mô tả chi tiết vấn đề, bao gồm thời gian, số tiền, mã giao dịch (nếu có)..."
              rows={4}
              value={newTicket.description}
              onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Paperclip className="w-4 h-4 mr-1" />
              Đính kèm file
            </Button>
            <span className="text-xs text-muted-foreground">
              Hỗ trợ: PDF, JPG, PNG tối đa 10MB
            </span>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => {
                // Handle create ticket
                console.log('Creating ticket:', newTicket);
                setIsCreateDialogOpen(false);
                setNewTicket({ title: "", description: "", category: "other", priority: "medium" });
              }}
              disabled={!newTicket.title.trim() || !newTicket.description.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Tạo ticket
            </Button>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hỏi đáp & Hỗ trợ</h1>
          <p className="text-muted-foreground">
            Câu hỏi công khai và hệ thống ticket hỗ trợ riêng tư
          </p>
        </div>
        <CreateTicketDialog />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="qa" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Hỏi đáp công khai
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Ticket của tôi
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === 'qa' ? "Tìm câu hỏi..." : "Tìm ticket..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {activeTab === 'qa' && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="phân phối">Phân phối</SelectItem>
                <SelectItem value="tài liệu">Tài liệu</SelectItem>
                <SelectItem value="tiến độ">Tiến độ</SelectItem>
                <SelectItem value="thanh toán">Thanh toán</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <TabsContent value="qa">
          <QAList />
        </TabsContent>

        <TabsContent value="tickets">
          <TicketList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QATicketSystem;