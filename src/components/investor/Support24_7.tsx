import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  HelpCircle,
  Ticket,
  Phone,
  Activity,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  Paperclip,
  Download,
  QrCode,
  Shield,
  ExternalLink,
  Calendar,
  User,
  Globe,
  PhoneCall
} from "lucide-react";
import { cn } from "@/lib/utils";

const Support24_7 = () => {
  const [activeTab, setActiveTab] = useState('ai-chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  // Mock data
  const faqs = [
    {
      id: 1,
      category: "Bắt đầu",
      question: "Chứng chỉ quyền lợi đầu tư (CQĐĐT) là gì?",
      answer: "CQĐĐT là chứng nhận quyền lợi khi bạn góp vốn đồng hành vào doanh nghiệp/dự án đã thẩm định. Phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế của DN.",
      views: 1250,
      helpful: 95
    },
    {
      id: 2,
      category: "Ví & Giao dịch",
      question: "Tại sao khoản nạp tiền chưa vào ví?",
      answer: "Thời gian xử lý nạp tiền qua Napas QR: 5-15 phút; chuyển khoản IBFT: 15-60 phút. Vui lòng kiểm tra nội dung chuyển tiền có đúng mã tham chiếu không.",
      views: 890,
      helpful: 88
    },
    {
      id: 3,
      category: "Phân phối",
      question: "Tỷ suất phân phối mục tiêu có được đảm bảo không?",
      answer: "Tỷ suất phân phối mục tiêu do Doanh nghiệp công bố, phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế. GoldenBook không cam kết lợi nhuận cố định.",
      views: 2100,
      helpful: 92
    }
  ];

  const tickets = [
    {
      id: "TK-20831",
      type: "Giao dịch",
      title: "Nạp 5.000.000đ chưa vào ví",
      status: "processing",
      priority: "urgent",
      slaRemaining: "5h 12m",
      lastUpdate: "02/09 10:21",
      messages: 3,
      hash: "#d91...fa"
    },
    {
      id: "TK-20812",
      type: "eSign",
      title: "Hợp đồng UF-1199 bị treo",
      status: "need_info",
      priority: "standard",
      slaRemaining: "1d 03h",
      lastUpdate: "01/09 18:05",
      messages: 5,
      hash: "#a82...c4"
    },
    {
      id: "TK-20777",
      type: "Phân phối",
      title: "Kỳ 08/2025 thiếu 50.000đ",
      status: "resolved",
      priority: "normal",
      slaRemaining: null,
      lastUpdate: "31/08 21:44",
      messages: 8,
      hash: "#7bf...e9"
    }
  ];

  const systemStatus = [
    { service: "Nạp tiền - Napas QR", status: "up", uptime: "99.9%" },
    { service: "Nạp tiền - IBFT", status: "up", uptime: "99.8%" },
    { service: "Rút tiền", status: "up", uptime: "99.7%" },
    { service: "eSign", status: "degraded", uptime: "98.5%" },
    { service: "Blockchain Verify", status: "up", uptime: "100%" },
    { service: "Đối soát", status: "up", uptime: "99.9%" }
  ];

  const incidents = [
    {
      id: 1,
      title: "PGW – Napas QR: Degraded",
      status: "monitoring",
      startTime: "02/09 08:05",
      endTime: "10:30",
      impact: "Ghi nhận chậm ≤ 60p",
      solution: "Xử lý thủ công theo lượt",
      hash: "#d91...fa"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline">Tiếp nhận</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Đang xử lý</Badge>;
      case 'need_info':
        return <Badge variant="secondary">Cần bổ sung</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Đã giải quyết</Badge>;
      case 'closed':
        return <Badge variant="outline">Đóng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Khẩn</Badge>;
      case 'standard':
        return <Badge className="bg-orange-500">Chuẩn</Badge>;
      case 'normal':
        return <Badge variant="outline">Thường</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'incident':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            Hỗ trợ 24/7
          </h1>
          <p className="text-muted-foreground mt-2">Minh bạch – Kịp thời – An tâm vận hành</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm hỗ trợ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Globe className="w-4 h-4 mr-2" />
            VI
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('ai-chat')}>
          <CardContent className="p-4 text-center">
            <Bot className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">Chat AI</h3>
            <p className="text-sm text-muted-foreground">Trả lời tức thì</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('faq')}>
          <CardContent className="p-4 text-center">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">FAQ</h3>
            <p className="text-sm text-muted-foreground">Câu hỏi thường gặp</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('tickets')}>
          <CardContent className="p-4 text-center">
            <Ticket className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <h3 className="font-semibold">Tạo yêu cầu</h3>
            <p className="text-sm text-muted-foreground">Hỗ trợ chuyên sâu</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('hotline')}>
          <CardContent className="p-4 text-center">
            <Phone className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold">Gọi hỗ trợ</h3>
            <p className="text-sm text-muted-foreground">Hotline 24/7</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ai-chat" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Trợ lý AI
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Ticket
          </TabsTrigger>
          <TabsTrigger value="hotline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Hotline
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Trạng thái
          </TabsTrigger>
        </TabsList>

        {/* AI Chat Tab */}
        <TabsContent value="ai-chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                Trợ lý AI GoldenBook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-96 border rounded-lg p-4 bg-muted/30 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-500 text-white">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-white rounded-lg p-3 shadow-sm max-w-md">
                        <p>Xin chào! Tôi là trợ lý AI của GoldenBook. Tôi có thể giúp bạn:</p>
                        <ul className="mt-2 text-sm space-y-1">
                          <li>• Giải thích về CQĐĐT và góp vốn đồng hành</li>
                          <li>• Hướng dẫn nạp/rút tiền và giao dịch</li>
                          <li>• Thông tin phân phối lợi ích</li>
                          <li>• Hỗ trợ eSign và hợp đồng</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập câu hỏi của bạn..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && setChatMessage('')}
                  />
                  <Button onClick={() => setChatMessage('')}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setChatMessage('CQĐĐT là gì?')}>
                    CQĐĐT là gì?
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setChatMessage('Cách nạp tiền?')}>
                    Cách nạp tiền?
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setChatMessage('Tỷ suất phân phối?')}>
                    Tỷ suất phân phối?
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline">{faq.category}</Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{faq.views} lượt xem</span>
                      <span>{faq.helpful}% hữu ích</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground mb-4">{faq.answer}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Hữu ích
                      </Button>
                      <Button variant="outline" size="sm">
                        Cần cải thiện
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Yêu cầu của tôi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {ticket.id}
                            </code>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <QrCode className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Shield className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold mb-2">{ticket.title}</h4>
                        
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>Loại: {ticket.type}</span>
                            <span>{ticket.messages} tin nhắn</span>
                            <span>Hash: {ticket.hash}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            {ticket.slaRemaining && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {ticket.slaRemaining}
                              </span>
                            )}
                            <span>{ticket.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tạo yêu cầu mới</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ticket-type">Loại yêu cầu</Label>
                    <Select value={selectedTicketType} onValueChange={setSelectedTicketType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại yêu cầu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qa">Hỏi đáp</SelectItem>
                        <SelectItem value="transaction">Khiếu nại giao dịch</SelectItem>
                        <SelectItem value="contract">Hợp đồng & eSign</SelectItem>
                        <SelectItem value="distribution">Phân phối lợi ích</SelectItem>
                        <SelectItem value="security">Bảo mật tài khoản</SelectItem>
                        <SelectItem value="reinvest">Tái đầu tư</SelectItem>
                        <SelectItem value="offers">Ưu đãi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ticket-title">Tiêu đề</Label>
                    <Input
                      id="ticket-title"
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      placeholder="Mô tả ngắn gọn vấn đề"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ticket-description">Mô tả chi tiết</Label>
                    <Textarea
                      id="ticket-description"
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>Đính kèm tệp</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Paperclip className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Kéo thả hoặc click để chọn tệp
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, JPG, PNG, XLSX (tối đa 10MB)
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Gửi yêu cầu
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Hotline Tab */}
        <TabsContent value="hotline" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-500" />
                  Hotline 24/7
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <Phone className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold text-green-700 mb-2">1900 0000</h3>
                  <p className="text-green-600">Miễn phí từ điện thoại cố định</p>
                  <p className="text-sm text-green-600 mt-2">
                    Mã phiên: <code className="bg-white px-2 py-1 rounded">GB-2025-001</code>
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Thời gian hỗ trợ:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Thứ 2 - Thứ 6:</span>
                      <span>8:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thứ 7 - Chủ nhật:</span>
                      <span>9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Khẩn cấp:</span>
                      <span className="text-green-600 font-semibold">24/7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Đặt lịch gọi lại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Chủ đề</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chủ đề cần hỗ trợ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wallet">Ví & Giao dịch</SelectItem>
                      <SelectItem value="cqid">CQĐĐT & Góp vốn</SelectItem>
                      <SelectItem value="distribution">Phân phối lợi ích</SelectItem>
                      <SelectItem value="contract">Hợp đồng & eSign</SelectItem>
                      <SelectItem value="security">Bảo mật tài khoản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Thời gian mong muốn</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khung giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Sáng (8:00 - 12:00)</SelectItem>
                      <SelectItem value="afternoon">Chiều (13:00 - 17:00)</SelectItem>
                      <SelectItem value="evening">Tối (18:00 - 22:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Số điện thoại</Label>
                  <Input placeholder="Nhập số điện thoại nhận cuộc gọi" />
                </div>
                
                <div>
                  <Label>Ghi chú</Label>
                  <Textarea 
                    placeholder="Mô tả ngắn gọn vấn đề cần hỗ trợ..."
                    rows={3}
                  />
                </div>
                
                <Button className="w-full">
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Đặt lịch gọi lại
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemStatus.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getServiceStatusIcon(service.status)}
                        <div>
                          <h4 className="font-medium">{service.service}</h4>
                          <p className="text-sm text-muted-foreground">Uptime: {service.uptime}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={service.status === 'up' ? 'default' : 
                                service.status === 'degraded' ? 'secondary' : 'destructive'}
                      >
                        {service.status === 'up' ? 'Hoạt động' : 
                         service.status === 'degraded' ? 'Suy giảm' : 'Sự cố'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sự cố & Bảo trì</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{incident.title}</h4>
                        <Badge variant="secondary">{incident.status}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Thời gian:</span>
                          <span>{incident.startTime} → {incident.endTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ảnh hưởng:</span>
                          <span>{incident.impact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Giải pháp:</span>
                          <span>{incident.solution}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Hash:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs">{incident.hash}</code>
                            <Button variant="ghost" size="sm">
                              <QrCode className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Legal Disclaimer */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Tuyên bố pháp lý:</strong> Thông tin "tỷ suất phân phối mục tiêu" do Doanh nghiệp công bố; 
            phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế. GoldenBook không cam kết lợi nhuận cố định 
            và không phải sàn chứng khoán.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support24_7;