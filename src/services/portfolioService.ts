// Service để quản lý dữ liệu Portfolio và tích hợp với quy trình đầu tư

export interface InvestmentData {
  id: string;
  companyName: string;
  packageName: string;
  sector: string;
  amountContributed: number;
  joinDate: string;
  status: 'active' | 'upcoming' | 'closed' | 'transferred';
  targetRate: number;
  actualRateYTD: number;
  uyTinScore: number;
  cqid: string;
  qrLink: string;
  distributionReceived: number;
  nextPayoutDate: string;
  nextPayoutEstimate: number;
  lastProgressHash?: string;
  transactionId: string;
  contractHash: string;
  eSignDate: string;
  effectiveDate: string;
}

export interface ESignCompletionData {
  opportunity: {
    id: string;
    companyName: string;
    projectName: string;
    sector: string;
    targetRate: number;
    uyTinScore: number;
    duration: string;
  };
  investmentAmount: number;
  transactionId: string;
  contractHash: string;
  cqidNumber: string;
  eSignDate: string;
  qrCodeUrl: string;
}

class PortfolioService {
  private static instance: PortfolioService;
  private portfolioData: InvestmentData[] = [];
  private listeners: ((data: InvestmentData[]) => void)[] = [];

  private constructor() {
    // Load existing data from localStorage
    this.loadFromStorage();
  }

  public static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
  }

  // Lưu dữ liệu vào localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('portfolio_data', JSON.stringify(this.portfolioData));
    } catch (error) {
      console.error('Error saving portfolio data to storage:', error);
    }
  }

  // Tải dữ liệu từ localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('portfolio_data');
      if (stored) {
        this.portfolioData = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading portfolio data from storage:', error);
      this.portfolioData = [];
    }
  }

  // Thêm listener để theo dõi thay đổi dữ liệu
  public addListener(callback: (data: InvestmentData[]) => void): void {
    this.listeners.push(callback);
  }

  // Xóa listener
  public removeListener(callback: (data: InvestmentData[]) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Thông báo cho tất cả listeners
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback([...this.portfolioData]));
  }

  // Lấy tất cả dữ liệu portfolio
  public getPortfolioData(): InvestmentData[] {
    return [...this.portfolioData];
  }

  // Thêm khoản đầu tư mới sau khi ký điện tử thành công
  public addInvestmentFromESign(eSignData: ESignCompletionData): InvestmentData {
    const newInvestment: InvestmentData = {
      id: Date.now().toString(),
      companyName: eSignData.opportunity.companyName,
      packageName: eSignData.opportunity.projectName,
      sector: eSignData.opportunity.sector,
      amountContributed: eSignData.investmentAmount,
      joinDate: eSignData.eSignDate,
      status: 'active',
      targetRate: eSignData.opportunity.targetRate,
      actualRateYTD: 0,
      uyTinScore: eSignData.opportunity.uyTinScore,
      cqid: eSignData.cqidNumber,
      qrLink: `https://verify.goldenbook.vn/cqid/${eSignData.cqidNumber}`,
      distributionReceived: 0,
      nextPayoutDate: this.calculateNextPayoutDate(eSignData.opportunity.duration),
      nextPayoutEstimate: this.calculateNextPayoutEstimate(eSignData.investmentAmount, eSignData.opportunity.targetRate),
      transactionId: eSignData.transactionId,
      contractHash: eSignData.contractHash,
      eSignDate: eSignData.eSignDate,
      effectiveDate: new Date().toISOString().split('T')[0]
    };

    this.portfolioData.push(newInvestment);
    this.saveToStorage();
    this.notifyListeners();

    return newInvestment;
  }

  // Tính toán ngày phân phối tiếp theo
  private calculateNextPayoutDate(duration: string): string {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Cuối tháng tiếp theo
    return nextMonth.toISOString().split('T')[0];
  }

  // Tính toán ước tính phân phối tiếp theo
  private calculateNextPayoutEstimate(amount: number, targetRate: number): number {
    return Math.round((amount * targetRate / 100) / 12); // Ước tính hàng tháng
  }

  // Cập nhật trạng thái khoản đầu tư
  public updateInvestmentStatus(id: string, status: InvestmentData['status']): void {
    const investment = this.portfolioData.find(item => item.id === id);
    if (investment) {
      investment.status = status;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Cập nhật thông tin phân phối
  public updateDistribution(id: string, distributionAmount: number): void {
    const investment = this.portfolioData.find(item => item.id === id);
    if (investment) {
      investment.distributionReceived += distributionAmount;
      investment.actualRateYTD = (investment.distributionReceived / investment.amountContributed) * 100;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Xóa khoản đầu tư
  public removeInvestment(id: string): void {
    this.portfolioData = this.portfolioData.filter(item => item.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  // Lấy thống kê tổng quan
  public getPortfolioSummary() {
    // Kiểm tra an toàn cho tất cả các phép tính để tránh NaN
    const validContributions = this.portfolioData.filter(item => 
      typeof item.amountContributed === 'number' && !isNaN(item.amountContributed)
    );
    const validDistributions = this.portfolioData.filter(item => 
      typeof item.distributionReceived === 'number' && !isNaN(item.distributionReceived)
    );
    
    const totalValue = validContributions.reduce((sum, item) => sum + item.amountContributed, 0);
    const totalDistribution = validDistributions.reduce((sum, item) => sum + item.distributionReceived, 0);
    const avgRate = totalValue > 0 ? (totalDistribution / totalValue) * 100 : 0;
    
    // Tính avgUyTin với kiểm tra an toàn để tránh NaN
    const validUyTinScores = this.portfolioData.filter(item => 
      typeof item.uyTinScore === 'number' && !isNaN(item.uyTinScore)
    );
    const avgUyTin = validUyTinScores.length > 0 
      ? validUyTinScores.reduce((sum, item) => sum + item.uyTinScore, 0) / validUyTinScores.length 
      : 0;

    return {
      totalValue: isNaN(totalValue) ? 0 : totalValue,
      totalDistribution: isNaN(totalDistribution) ? 0 : totalDistribution,
      actualRateYTD: isNaN(avgRate) ? 0 : Math.round(avgRate * 100) / 100,
      portfolioUyTin: isNaN(avgUyTin) ? 0 : Math.round(avgUyTin)
    };
  }
}

export default PortfolioService;