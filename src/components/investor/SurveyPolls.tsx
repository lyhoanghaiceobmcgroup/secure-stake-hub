import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  Clock, 
  Users, 
  CheckCircle, 
  Star, 
  MessageCircle,
  Gift,
  TrendingUp,
  Calendar,
  Award,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Survey {
  id: string;
  title: string;
  description: string;
  type: 'satisfaction' | 'feedback' | 'vote';
  company: {
    id: string;
    name: string;
    logo: string;
  };
  questions: Array<{
    id: string;
    text: string;
    type: 'rating' | 'choice' | 'multiple';
    options?: string[];
    required: boolean;
  }>;
  rewards: {
    points: number;
    description: string;
  };
  status: 'active' | 'completed' | 'expired';
  participantCount: number;
  estimatedTime: number; // in minutes
  createdAt: string;
  expiresAt: string;
  results?: {
    [questionId: string]: {
      [option: string]: number;
    };
  };
}

interface Poll {
  id: string;
  title: string;
  description: string;
  company: {
    id: string;
    name: string;
    logo: string;
  };
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  totalVotes: number;
  hasVoted: boolean;
  userVote?: string;
  createdAt: string;
  expiresAt: string;
  category: 'event_topic' | 'feature_request' | 'general';
}

const SurveyPolls = () => {
  const [activeTab, setActiveTab] = useState<'surveys' | 'polls' | 'results'>('surveys');
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: any}>({});

  // Mock surveys data
  const surveys: Survey[] = [
    {
      id: "s1",
      title: "Khảo sát hài lòng kỳ phân phối 08/2025",
      description: "Đánh giá trải nghiệm về quy trình phân phối và minh bạch thông tin",
      type: "satisfaction",
      company: {
        id: "1",
        name: "AquaPure JSC",
        logo: "/placeholder.svg"
      },
      questions: [
        {
          id: "q1",
          text: "Mức độ hài lòng tổng thể về kỳ phân phối 08/2025?",
          type: "rating",
          options: ["1 - Rất không hài lòng", "2 - Không hài lòng", "3 - Bình thường", "4 - Hài lòng", "5 - Rất hài lòng"],
          required: true
        },
        {
          id: "q2", 
          text: "Thông tin nào bạn quan tâm nhất trong báo cáo?",
          type: "multiple",
          options: ["Tiến độ dự án", "Tình hình tài chính", "Kế hoạch tương lai", "Rủi ro và thách thức"],
          required: true
        }
      ],
      rewards: {
        points: 50,
        description: "50 điểm cộng đồng + cơ hội nhận voucher"
      },
      status: "active",
      participantCount: 1204,
      estimatedTime: 2,
      createdAt: "2025-09-01T00:00:00Z",
      expiresAt: "2025-09-15T23:59:59Z",
      results: {
        q1: {
          "1 - Rất không hài lòng": 3,
          "2 - Không hài lòng": 7,
          "3 - Bình thường": 28,
          "4 - Hài lòng": 62,
          "5 - Rất hài lòng": 0
        }
      }
    },
    {
      id: "s2",
      title: "Góp ý cải thiện dịch vụ khách hàng",
      description: "Chia sẻ ý kiến để cải thiện trải nghiệm dịch vụ",
      type: "feedback",
      company: {
        id: "2",
        name: "UrbanFoods Co.",
        logo: "/placeholder.svg"
      },
      questions: [
        {
          id: "q3",
          text: "Kênh thông tin nào bạn ưa thích nhất?",
          type: "choice",
          options: ["Email", "SMS", "App notification", "Website"],
          required: true
        }
      ],
      rewards: {
        points: 30,
        description: "30 điểm cộng đồng"
      },
      status: "completed",
      participantCount: 856,
      estimatedTime: 1,
      createdAt: "2025-08-25T00:00:00Z",
      expiresAt: "2025-08-31T23:59:59Z"
    }
  ];

  // Mock polls data
  const polls: Poll[] = [
    {
      id: "p1",
      title: "Chủ đề nào bạn muốn nghe trong AMA tháng 9?",
      description: "Bình chọn chủ đề cho buổi livestream AMA sắp tới của AquaPure JSC",
      company: {
        id: "1",
        name: "AquaPure JSC", 
        logo: "/placeholder.svg"
      },
      options: [
        { id: "o1", text: "Kế hoạch mở rộng Q4/2025", votes: 342 },
        { id: "o2", text: "Công nghệ lọc nước mới nhất", votes: 289 },
        { id: "o3", text: "Chiến lược ESG và bền vững", votes: 156 },
        { id: "o4", text: "Tình hình tài chính chi tiết", votes: 198 }
      ],
      totalVotes: 985,
      hasVoted: false,
      createdAt: "2025-09-01T10:00:00Z",
      expiresAt: "2025-09-05T18:00:00Z",
      category: "event_topic"
    },
    {
      id: "p2", 
      title: "Tính năng nào bạn muốn có trong app GoldenBook?",
      description: "Góp ý để cải thiện ứng dụng",
      company: {
        id: "1",
        name: "GoldenBook Platform",
        logo: "/placeholder.svg"
      },
      options: [
        { id: "o5", text: "Thông báo push thông minh", votes: 245 },
        { id: "o6", text: "Tính toán lợi nhuận tự động", votes: 378 },
        { id: "o7", text: "Chat trực tiếp với DN", votes: 167 },
        { id: "o8", text: "Báo cáo đầu tư cá nhân hóa", votes: 203 }
      ],
      totalVotes: 993,
      hasVoted: true,
      userVote: "o6",
      createdAt: "2025-08-28T00:00:00Z",
      expiresAt: "2025-09-10T23:59:59Z", 
      category: "feature_request"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="text-green-600 bg-green-50">Đang mở</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Đã tham gia</Badge>;
      case 'expired':
        return <Badge variant="secondary">Đã hết hạn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'event_topic': return 'Chủ đề sự kiện';
      case 'feature_request': return 'Tính năng mới';
      case 'general': return 'Tổng quát';
      default: return category;
    }
  };

  const handleSurveySubmit = (surveyId: string) => {
    console.log('Submitting survey:', surveyId, selectedAnswers);
    // Handle survey submission
  };

  const handleVote = (pollId: string, optionId: string) => {
    console.log('Voting:', pollId, optionId);
    // Handle poll vote
  };

  const SurveyCard = ({ survey }: { survey: Survey }) => (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={survey.company.logo}
              alt={survey.company.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <CardTitle className="text-base">{survey.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{survey.company.name}</p>
            </div>
          </div>
          {getStatusBadge(survey.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{survey.description}</p>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">{survey.estimatedTime}</div>
            <div className="text-xs text-muted-foreground">phút</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{survey.participantCount}</div>
            <div className="text-xs text-muted-foreground">người tham gia</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{survey.rewards.points}</div>
            <div className="text-xs text-muted-foreground">điểm thưởng</div>
          </div>
        </div>

        {survey.status === 'active' && (
          <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border">
            {survey.questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-sm font-medium">
                  {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {question.type === 'rating' && question.options && (
                  <RadioGroup
                    value={selectedAnswers[question.id] || ""}
                    onValueChange={(value) => 
                      setSelectedAnswers(prev => ({ ...prev, [question.id]: value }))
                    }
                  >
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                        <Label htmlFor={`${question.id}-${index}`} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {question.type === 'choice' && question.options && (
                  <RadioGroup
                    value={selectedAnswers[question.id] || ""}
                    onValueChange={(value) => 
                      setSelectedAnswers(prev => ({ ...prev, [question.id]: value }))
                    }
                  >
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                        <Label htmlFor={`${question.id}-${index}`} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            ))}
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => handleSurveySubmit(survey.id)}
                disabled={!survey.questions.every(q => 
                  !q.required || selectedAnswers[q.id]
                )}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Gửi khảo sát
              </Button>
            </div>
          </div>
        )}

        {survey.status === 'completed' && survey.results && (
          <div className="space-y-3">
            <div className="text-sm font-medium">Kết quả khảo sát:</div>
            {Object.entries(survey.results).map(([questionId, results]) => (
              <div key={questionId} className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  {survey.questions.find(q => q.id === questionId)?.text}
                </div>
                {Object.entries(results).map(([option, percentage]) => (
                  <div key={option} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{option.split(' - ')[1] || option}</span>
                      <span>{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Gift className="w-3 h-3" />
            <span>{survey.rewards.description}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Hết hạn: {new Date(survey.expiresAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PollCard = ({ poll }: { poll: Poll }) => (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={poll.company.logo}
              alt={poll.company.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <CardTitle className="text-base">{poll.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{poll.company.name}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {getCategoryLabel(poll.category)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{poll.description}</p>
        
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
            const isSelected = poll.hasVoted && poll.userVote === option.id;
            
            return (
              <div key={option.id} className="space-y-2">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-between h-auto p-3"
                  onClick={() => !poll.hasVoted && handleVote(poll.id, option.id)}
                  disabled={poll.hasVoted}
                >
                  <span className="text-sm">{option.text}</span>
                  <div className="flex items-center gap-2">
                    {poll.hasVoted && (
                      <span className="text-xs">{percentage}%</span>
                    )}
                    {isSelected && <CheckCircle className="w-4 h-4" />}
                  </div>
                </Button>
                {poll.hasVoted && (
                  <Progress value={percentage} className="h-2" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{poll.totalVotes.toLocaleString('vi-VN')} lượt bình chọn</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Hết hạn: {new Date(poll.expiresAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CommunityInsights = () => (
    <div className="grid gap-6">
      {/* Monthly Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Báo cáo cộng đồng tháng 08/2025
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">342</div>
              <div className="text-sm text-muted-foreground">Phản hồi nhận được</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">97%</div>
              <div className="text-sm text-muted-foreground">Trả lời đúng hạn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.6/5</div>
              <div className="text-sm text-muted-foreground">Điểm hài lòng TB</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Điểm cộng đồng phát</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Helpful Answers */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top câu trả lời hữu ích
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              company: "AquaPure JSC",
              answer: "Kỳ 09/2025 sẽ diễn ra đúng ngày 30/09 như kế hoạch",
              upvotes: 126,
              category: "Lịch phân phối"
            },
            {
              company: "UrbanFoods Co.",
              answer: "Tiến độ dự án giai đoạn 2 hiện đã đạt 65%",
              upvotes: 93,
              category: "Tiến độ"
            },
            {
              company: "EduNext Ltd.",
              answer: "Tài liệu hợp đồng đã được cập nhật với DocHash xác thực",
              upvotes: 78,
              category: "Tài liệu"
            }
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{item.upvotes}</div>
                <div className="text-xs text-muted-foreground">upvotes</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{item.company}</span>
                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Uy tín Score Improvements */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            DN có Điểm Uy tín cải thiện nhiều nhất
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "TechVina Ltd.", from: 65, to: 78, change: "+13" },
            { name: "GreenEnergy JSC", from: 71, to: 82, change: "+11" },  
            { name: "SmartCity Co.", from: 69, to: 79, change: "+10" }
          ].map((company, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border">
              <div>
                <div className="font-semibold text-sm">{company.name}</div>
                <div className="text-xs text-muted-foreground">
                  Điểm Uy tín: {company.from} → {company.to}
                </div>
              </div>
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                {company.change}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Khảo sát & Bình chọn</h1>
          <p className="text-muted-foreground">
            Tham gia khảo sát, bình chọn và nhận điểm thưởng cộng đồng
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'surveys' ? 'default' : 'outline'}
            onClick={() => setActiveTab('surveys')}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Khảo sát
          </Button>
          <Button
            variant={activeTab === 'polls' ? 'default' : 'outline'}
            onClick={() => setActiveTab('polls')}
            className="gap-2"
          >
            <Target className="w-4 h-4" />
            Bình chọn
          </Button>
          <Button
            variant={activeTab === 'results' ? 'default' : 'outline'}
            onClick={() => setActiveTab('results')}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Báo cáo
          </Button>
        </div>
      </div>

      {activeTab === 'surveys' && (
        <div className="grid gap-6">
          {surveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      )}

      {activeTab === 'polls' && (
        <div className="grid gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}

      {activeTab === 'results' && <CommunityInsights />}
    </div>
  );
};

export default SurveyPolls;