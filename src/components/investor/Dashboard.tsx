import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  Calendar,
  Bell,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  DollarSign
} from "lucide-react";
import KPICard from "./KPICard";
import UyTinBadge from "./UyTinBadge";
import ProgressCard from "./ProgressCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  // Mock data - in real app this would come from API
  const kpiData = [
    {
      label: "Tổng giá trị đang hoạt động",
      value: 125000000,
      delta: { value: 5.2, type: 'increase' as const },
      format: 'currency' as const
    },
    {
      label: "Tổng phân phối đã nhận", 
      value: 8750000,
      delta: { value: 12.1, type: 'increase' as const },
      format: 'currency' as const
    },
    {
      label: "Tỷ suất phân phối thực tế (YTD)",
      value: 8.4,
      delta: { value: 0.8, type: 'increase' as const },
      format: 'percentage' as const
    },
    {
      label: "Kỳ phân phối sắp tới",
      value: "15 ngày",
      format: 'number' as const
    },
    {
      label: "Điểm Uy tín danh mục",
      value: 85,
      format: 'number' as const
    },
    {
      label: "Số sổ đang nắm giữ",
      value: 7,
      delta: { value: 1, type: 'increase' as const },
      format: 'number' as const
    }
  ];

  const cashflowData = [
    { month: 'T1', inflow: 20, outflow: 0, payout: 0, reinvest: 0 },
    { month: 'T2', inflow: 35, outflow: 0, payout: 2.5, reinvest: 2.5 },
    { month: 'T3', inflow: 15, outflow: 0, payout: 3.2, reinvest: 3.2 },
    { month: 'T4', inflow: 25, outflow: 5, payout: 4.1, reinvest: 3.5 },
    { month: 'T5', inflow: 30, outflow: 0, payout: 4.8, reinvest: 4.8 },
    { month: 'T6', inflow: 10, outflow: 0, payout: 5.2, reinvest: 3.0 },
  ];

  const portfolioData = [
    { name: 'Bất động sản', value: 45, color: '#C8A75A' },
    { name: 'Công nghệ', value: 25, color: '#0B2342' },
    { name: 'Sản xuất', value: 20, color: '#2BAA6A' },
    { name: 'Dịch vụ', value: 10, color: '#F5AF3D' },
  ];

  const recentActivities = [
    {
      type: 'payout',
      title: 'Nhận phân phối kỳ Q2/2024',
      amount: 2750000,
      source: 'Tech Solutions JSC',
      time: '2 giờ trước',
      icon: ArrowDownRight,
      iconColor: 'text-green-600'
    },
    {
      type: 'reinvest', 
      title: 'Tái đầu tư tự động',
      amount: 2000000,
      source: 'Smart Manufacturing Co.',
      time: '1 ngày trước',
      icon: RotateCcw,
      iconColor: 'text-blue-600'
    },
    {
      type: 'investment',
      title: 'Góp vốn mới',
      amount: 50000000,
      source: 'Green Energy Project',
      time: '3 ngày trước', 
      icon: ArrowUpRight,
      iconColor: 'text-golden'
    }
  ];

  const todos = [
    {
      id: 1,
      title: 'Ký hợp đồng điện tử - Dự án Solar Farm',
      priority: 'high',
      deadline: '2024-12-31'
    },
    {
      id: 2,
      title: 'Cập nhật thông tin KYC',
      priority: 'medium', 
      deadline: '2025-01-15'
    },
    {
      id: 3,
      title: 'Xem tài liệu kỳ Q4 - Real Estate Fund',
      priority: 'low',
      deadline: '2025-01-30'
    }
  ];

  const upcomingPayouts = [
    {
      company: 'Tech Solutions JSC',
      amount: 3200000,
      date: '2025-01-15'
    },
    {
      company: 'Manufacturing Plus',
      amount: 1800000,
      date: '2025-01-20'
    }
  ];

  const progressUpdates = [
    {
      period: 'Q4/2024',
      percent: 75,
      note: 'Dự án Solar Farm đã hoàn thành 75% tiến độ xây dựng. Các tấm pin năng lượng mặt trời đã được lắp đặt hoàn chỉnh.',
      media: ['/api/progress/img1.jpg', '/api/progress/img2.jpg'],
      reportHash: '0x1234567890abcdef...',
      timestamp: '2024-12-20T10:30:00Z'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Section */}
      <div className="hero-section relative p-4 sm:p-8 rounded-2xl text-white">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
            <Badge className="glass-button text-white border-white/30">
              Đã xác thực blockchain
            </Badge>
            <UyTinBadge 
              score={85} 
              pillars={{ B: 88, U: 82, Fd: 90, Fl: 80 }}
              size="md"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            Chào mừng trở lại, Nguyễn Văn A
          </h1>
          <p className="text-white/80 mb-6 max-w-2xl text-sm sm:text-base">
            Danh mục đầu tư của bạn đang hoạt động tốt với tỷ suất phân phối thực tế 8.4% YTD. 
            Hãy khám phá thêm cơ hội đầu tư mới được thẩm định.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button variant="default" size="lg" className="bg-white text-navy hover:bg-white/90">
              Khám phá cơ hội
            </Button>
            <Button variant="outline" size="lg" className="glass-button border-white/30 text-white hover:bg-white/20">
              Xem tài liệu
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            format={kpi.format}
          />
        ))}
      </div>

      {/* Alerts & Todo */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Việc cần làm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{todo.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Hạn: {new Date(todo.deadline).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <Badge variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'}>
                  {todo.priority === 'high' ? 'Cao' : todo.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Phân phối sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPayouts.map((payout, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{payout.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payout.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(payout.amount)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              Dòng tiền 6 tháng gần nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={cashflowData}>
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} triệu VNĐ`,
                    name === 'inflow' ? 'Góp vốn' : 
                    name === 'outflow' ? 'Rút tiền' :
                    name === 'payout' ? 'Phân phối' : 'Tái đầu tư'
                  ]}
                />
                <Area type="monotone" dataKey="inflow" stroke="hsl(var(--golden))" fill="hsl(var(--golden))" fillOpacity={0.3} />
                <Area type="monotone" dataKey="payout" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} />
                <Area type="monotone" dataKey="reinvest" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                <Area type="monotone" dataKey="outflow" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5" />
              Phân bổ danh mục theo ngành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  dataKey="value"
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ trọng']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Progress Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 border rounded-lg">
                <div className={`p-1.5 sm:p-2 rounded-full bg-muted ${activity.iconColor}`}>
                  <activity.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.source} • {activity.time}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-semibold text-xs sm:text-sm ${activity.type === 'payout' ? 'text-green-600' : activity.type === 'investment' ? 'text-golden' : 'text-blue-600'}`}>
                    {activity.type === 'payout' ? '+' : '-'}{formatCurrency(activity.amount)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <ProgressCard
          title="Cập nhật tiến độ mới nhất"
          updates={progressUpdates}
        />
      </div>
    </div>
  );
};

export default Dashboard;