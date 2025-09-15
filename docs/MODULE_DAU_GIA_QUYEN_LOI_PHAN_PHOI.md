# MODULE "ĐẤU GIÁ QUYỀN LỢI PHÂN PHỐI" - GoldenBook v1.0

## 0. TẦM NHÌN & VỊ TRÍ MODULE

### Mục tiêu
Tạo một không gian minh bạch–realtime–định giá theo cung/cầu thời gian hữu hạn để:
- **Doanh nghiệp (DN)**: Mở "cửa sổ phân bổ" quyền lợi phân phối bổ sung
- **Nhà đầu tư (NĐT)**: Tiếp cận biên ưu đãi ΔG hợp lý so với R_base trong giới hạn rủi ro chấp nhận được

### Giá trị cốt lõi
- **Realtime, rõ luật chơi**: đếm ngược, % lấp đầy, đồ thị ΔG, lịch sử vòng trước (R_clear) kèm doc_hash
- **Cơ chế chuẩn**: Dutch-like giảm ΔG theo thời gian & mức lấp đầy + chốt đồng nhất (uniform clear)
- **Kỷ luật & an toàn**: KYC/2FA, hạn mức, hold/allocate/clear idempotent, biên nhận PDF + hash, neo blockchain

---

## 1. THUẬT NGỮ & NGUYÊN TẮC PHÁP LÝ

### Định nghĩa thuật ngữ (hiển thị nhất quán)

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| **Quyền lợi phân phối** | Lợi ích kinh tế dự kiến NĐT nhận theo kết quả kinh doanh của DN |
| **Tỷ suất phân phối mục tiêu (R_base)** | Mức DN công bố cho gói, không phải cam kết |
| **Biên ưu đãi phân phối (ΔG)** | Phần ưu đãi thêm so với R_base trong vòng đấu giá |
| **Mức đề nghị hiện hành (R_offer)** | R_offer = R_base + ΔG_now |
| **Mức chốt vòng (R_clear)** | Mức đồng nhất áp vào tất cả lệnh trúng khi vòng kết thúc |
| **CQĐĐT** | Chứng chỉ quyền lợi đầu tư; phát hành sau khi ký điện tử đủ 2 phía |
| **G-Trust (0–100)** | Chỉ số tin cậy GoldenBook (T/U/D/F), chỉ mang tính tham khảo |

### Tuyên bố pháp lý (hiển thị trên mọi màn hình)
```
"Tỷ suất phân phối mục tiêu do Doanh nghiệp công bố; phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế. GoldenBook không cam kết lợi nhuận cố định và không phải sàn chứng khoán. Blockchain dùng để xác thực chứng từ/sự kiện; không phát hành tài sản số."
```

---

## 2. CƠ CHẾ ĐẤU GIÁ (DUTCH-LIKE + UNIFORM CLEAR)

### 2.1 Quy tắc ΔG (giảm dần theo thời gian & mức lấp đầy)

#### Ký hiệu
- `τ = 1 − (time_remaining / time_total) ∈ [0,1]` (tỷ lệ thời gian đã trôi)
- `cover = raised / target ∈ [0,1]` (tỷ lệ lấp đầy)

#### Công thức ΔG hiện hành
```
ΔG_now = clamp(ΔG_max * (1 − a·τ) * (1 − b·cover), ΔG_floor, ΔG_max)
```

#### Tham số gợi ý v1.0
- `a = 0.8`, `b = 0.7`
- Chu kỳ cập nhật (tick): 5–15 phút và/hoặc khi cover thay đổi >2–5%

### 2.2 Chốt đồng nhất (Uniform Clear)
- Đến thời điểm kết thúc (hoặc đạt đủ target sớm): tính R_clear
- Tất cả lệnh trúng (nhận ngay/giới hạn) được xác lập ở cùng một mức R_clear
- Tránh "ai bấm trước được rẻ hơn", giảm khiếu nại

### 2.3 Chống "sniping" (tuỳ chọn)
- **Gia hạn mềm**: 5 phút nếu có lệnh lớn trong 2 phút cuối (tối đa 2 lần)
- **Chốt theo snapshot**: đúng giờ (không gia hạn)
- Lựa chọn mô hình cố định trong v1.0 để dễ truyền thông

### 2.4 Biên ưu đãi theo G-Trust (khuyến nghị)

| G-Trust | ΔG_max |
|---------|--------|
| ≥ 85 | 0–40 bps |
| 75–84 | 20–80 bps |
| 60–74 | 50–150 bps |
| <60 | Khuyến nghị nâng minh bạch trước khi mở vòng |

---

## 3. HÀNH VI NGƯỜI DÙNG (UX FLOWS)

### 3.1 Từ Khám phá → Đấu giá
- Card gói có badge "ĐANG MỞ ĐẤU GIÁ"
- Deep-link: `/auction/rounds?gid=...&prefAmount=...` giữ mức tiền dự định nếu người dùng đã nhập

### 3.2 Marketplace (Danh sách vòng)

#### Mỗi card vòng hiển thị realtime:
- DN/gói (logo), G-Trust
- Mục tiêu & Đã lấp đầy (% & VNĐ)
- Đếm ngược (mm:ss)
- R_base, ΔG_now, R_offer
- Vòng N/M (1–3–6 tháng)
- Lịch sử vòng trước (R_clear + doc_hash)
- CTA: [Nhận ngay] · [Đặt giới hạn] · [Chi tiết & Tài liệu]

#### Bộ lọc/sắp xếp:
**Lọc:**
- G-Trust tối thiểu
- Thời gian còn lại
- Ngành
- Dải ΔG
- Mức góp tối thiểu

**Sắp theo:**
- Kết thúc sớm nhất
- ΔG cao nhất
- % lấp đầy cao
- G-Trust cao

### 3.3 Trang chi tiết vòng

#### Khối thông tin:
**Hero:**
- Đếm ngược
- Mục tiêu, % lấp đầy
- Vòng N/M, thời lượng (1/3/6 tháng)

**Tham số:**
- R_base, ΔG_max, ΔG_floor, ΔG_now, R_offer
- Bước tick, anti-sniping (on/off)

**Đồ thị:**
- Đường ΔG(t)
- Cột cover(t)
- Đường gợi ý R_clear ước tính (không cam kết)

**Tài liệu vòng (PDF + doc_hash):**
- Điều khoản vòng
- Báo cáo tiến độ
- BCTC liên quan

**Lịch sử vòng trước:**
- Bảng R_clear, phân bổ, số NĐT trúng (doc_hash)

#### Form đặt lệnh:
**Số tiền:** ≥100k & ≥ min vòng

**Kiểu lệnh:**
- **Nhận ngay**: khớp tại R_offer hiện hành; hold tức thì
- **Giới hạn**: điền ΔG_min; hệ thống tự khớp khi ΔG_now ≤ ΔG_min → hold

**Kiểm tra điều kiện trước lệnh (precheck):**
- KYC = Verified
- 2FA (nếu policy)
- Có STK chính
- available ≥ amount

**Lưu ý an toàn:** tooltips nhấn mạnh "R_offer/R_clear là tỷ suất phân phối mục tiêu hiện hành/chốt, không phải cam kết"

### 3.4 Nhật ký lệnh & trạng thái

#### Bảng mini:
| Thời điểm | Kiểu | Số tiền | Điều kiện | Trạng thái | Biên nhận (PDF+hash) |
|-----------|------|---------|-----------|------------|----------------------|

**Trạng thái lệnh:** active / filled / cancelled / expired

**Hành động:** sửa ΔG_min (giới hạn) / huỷ trước khi khớp

### 3.5 Kết thúc vòng (Clear)

1. Module hiển thị "Đang chốt vòng…" + spinner; 3–10s sau:
2. Thông báo R_clear, Số tiền trúng, Biên bản chốt vòng (PDF+hash)
3. eSign tự động khởi tạo hợp đồng → điều hướng luồng #4
4. Khi eSign xong → Cấp CQĐĐT; "Ví & Giao dịch" ghi allocate_cqid; "Sổ của tôi" xuất hiện sổ mới

### 3.6 Không trúng lệnh

- Hiển thị: "Lệnh không trúng – đã giải phóng tạm giữ (PDF+hash)"
- Gợi ý: Theo dõi vòng kế tiếp hoặc gói tương tự

---

## 4. KIẾN TRÚC GIAO DIỆN (PC/TABLET/MOBILE)

### Layout responsive:
- **PC**: 2–3 cột; cột trái filter, giữa cards, phải nhật ký tick
- **Tablet**: 2 cột; filter trong drawer
- **Mobile**: một cột; sticky CTA [Nhận ngay] / [Đặt giới hạn]; biểu đồ ΔG/cover dạng mini

### Realtime indicators:
- Chip "Cập nhật 30s trước"
- Nút Làm mới khi mạng yếu

### Giao diện Dễ hiểu:
- Giảm thuật ngữ
- 4 bước cố định "Đọc – Xác nhận – Nhập – Đặt lệnh"

---

## 5. KIẾN TRÚC KỸ THUẬT

### 5.1 Database Schema

```sql
-- Bảng vòng đấu giá
CREATE TABLE auction_rounds (
    id UUID PRIMARY KEY,
    package_id UUID REFERENCES investment_packages(id),
    round_number INTEGER,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    target_amount DECIMAL(15,2),
    raised_amount DECIMAL(15,2) DEFAULT 0,
    r_base DECIMAL(5,4), -- Tỷ suất cơ bản (%)
    delta_g_max DECIMAL(5,4), -- Biên ưu đãi tối đa (bps)
    delta_g_floor DECIMAL(5,4), -- Biên ưu đãi tối thiểu (bps)
    delta_g_current DECIMAL(5,4), -- Biên ưu đãi hiện tại (bps)
    r_clear DECIMAL(5,4), -- Mức chốt vòng (sau khi kết thúc)
    status ENUM('pending', 'active', 'clearing', 'completed', 'cancelled'),
    anti_sniping_enabled BOOLEAN DEFAULT true,
    tick_interval_minutes INTEGER DEFAULT 10,
    doc_hash VARCHAR(64), -- Hash tài liệu vòng
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lệnh đấu giá
CREATE TABLE auction_orders (
    id UUID PRIMARY KEY,
    round_id UUID REFERENCES auction_rounds(id),
    investor_id UUID REFERENCES users(id),
    amount DECIMAL(15,2),
    order_type ENUM('market', 'limit'), -- Nhận ngay / Giới hạn
    delta_g_min DECIMAL(5,4), -- Chỉ cho lệnh giới hạn
    r_offer_at_time DECIMAL(5,4), -- R_offer tại thời điểm đặt lệnh
    status ENUM('active', 'filled', 'cancelled', 'expired'),
    hold_transaction_id UUID, -- ID giao dịch tạm giữ
    filled_at TIMESTAMP,
    receipt_hash VARCHAR(64), -- Hash biên nhận
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lịch sử tick (cập nhật ΔG)
CREATE TABLE auction_ticks (
    id UUID PRIMARY KEY,
    round_id UUID REFERENCES auction_rounds(id),
    tick_time TIMESTAMP,
    time_progress DECIMAL(5,4), -- τ
    cover_progress DECIMAL(5,4), -- cover
    delta_g_value DECIMAL(5,4), -- ΔG_now
    r_offer DECIMAL(5,4), -- R_offer = R_base + ΔG_now
    total_orders INTEGER,
    total_amount DECIMAL(15,2)
);
```

### 5.2 API Endpoints

```typescript
// Lấy danh sách vòng đấu giá
GET /api/v1/auction/rounds
Query: {
  status?: 'active' | 'pending' | 'completed',
  g_trust_min?: number,
  sector?: string,
  delta_g_min?: number,
  delta_g_max?: number,
  sort_by?: 'ending_soon' | 'delta_g_desc' | 'cover_desc' | 'g_trust_desc'
}

// Chi tiết vòng đấu giá
GET /api/v1/auction/rounds/:roundId

// Lịch sử tick realtime
GET /api/v1/auction/rounds/:roundId/ticks
Query: { from?: timestamp, limit?: number }

// Đặt lệnh
POST /api/v1/auction/orders
Body: {
  round_id: string,
  amount: number,
  order_type: 'market' | 'limit',
  delta_g_min?: number // Chỉ cho lệnh limit
}

// Lấy lệnh của investor
GET /api/v1/auction/orders/my
Query: { round_id?: string, status?: string }

// Hủy lệnh
DELETE /api/v1/auction/orders/:orderId

// WebSocket cho realtime updates
WS /ws/auction/rounds/:roundId
Events: {
  'tick_update': { delta_g_current, r_offer, cover_progress, time_remaining },
  'order_filled': { order_id, amount, r_clear },
  'round_completed': { r_clear, total_filled }
}
```

### 5.3 Business Logic Components

```typescript
// Service tính toán ΔG
class AuctionPricingService {
  calculateDeltaG(round: AuctionRound, currentTime: Date): number {
    const timeProgress = this.calculateTimeProgress(round, currentTime);
    const coverProgress = round.raised_amount / round.target_amount;
    
    const deltaG = round.delta_g_max * 
      (1 - 0.8 * timeProgress) * 
      (1 - 0.7 * coverProgress);
    
    return Math.max(
      Math.min(deltaG, round.delta_g_max),
      round.delta_g_floor
    );
  }
}

// Service xử lý lệnh
class OrderProcessingService {
  async placeOrder(orderData: OrderRequest): Promise<Order> {
    // 1. Validate precheck conditions
    await this.validatePrecheck(orderData.investor_id);
    
    // 2. Hold funds
    const holdTx = await this.walletService.holdFunds(
      orderData.investor_id, 
      orderData.amount
    );
    
    // 3. Create order
    const order = await this.createOrder({
      ...orderData,
      hold_transaction_id: holdTx.id
    });
    
    // 4. Try immediate fill for market orders
    if (orderData.order_type === 'market') {
      await this.tryFillOrder(order);
    }
    
    return order;
  }
}

// Service chốt vòng
class RoundClearingService {
  async clearRound(roundId: string): Promise<void> {
    const round = await this.getRound(roundId);
    const filledOrders = await this.getFilledOrders(roundId);
    
    // Tính R_clear (uniform price)
    const rClear = this.calculateUniformPrice(filledOrders, round);
    
    // Cập nhật tất cả lệnh trúng với R_clear
    await this.updateOrdersWithClearPrice(filledOrders, rClear);
    
    // Tạo biên bản chốt vòng
    const clearingReport = await this.generateClearingReport(round, rClear);
    
    // Neo hash lên blockchain
    await this.blockchainService.anchorHash(clearingReport.hash);
    
    // Khởi tạo eSign cho các lệnh trúng
    await this.initiateESignForWinners(filledOrders);
  }
}
```

---

## 6. TÍCH HỢP VỚI CÁC MODULE KHÁC

### 6.1 Module #1 (Khám phá & Thẩm định)
- Hiển thị badge "ĐANG MỞ ĐẤU GIÁ" trên opportunity cards
- Deep-link từ chi tiết gói sang trang đấu giá

### 6.2 Module #2 (Góp vốn đồng hành)
- Sử dụng chung wallet service cho hold/release funds
- Tích hợp KYC/2FA validation

### 6.3 Module #3 (Ký điện tử)
- Auto-trigger eSign flow sau khi vòng clear
- Sử dụng chung document hash system

### 6.4 Module #4 (CQĐĐT)
- Tự động cấp CQĐĐT sau eSign hoàn tất
- Link allocation với auction order

### 6.5 Module #5 (Ví & Giao dịch)
- Hold/release funds cho auction orders
- Ghi nhận transaction history

### 6.6 Module #6 (Sổ của tôi)
- Hiển thị CQĐĐT mới sau auction
- Track performance theo R_clear

---

## 7. BẢO MẬT & TUÂN THỦ

### 7.1 Bảo mật giao dịch
- Idempotent operations cho hold/allocate/clear
- Rate limiting cho API calls
- Audit trail cho mọi thao tác

### 7.2 Blockchain anchoring
- Hash các document quan trọng: điều khoản vòng, biên bản clear, biên nhận
- Permissioned blockchain chỉ để verify, không phát hành token

### 7.3 Compliance
- Tuyên bố pháp lý hiển thị rõ ràng
- Không cam kết lợi nhuận cố định
- Minh bạch về rủi ro đầu tư

---

## 8. METRICS & MONITORING

### 8.1 Business Metrics
- Tỷ lệ fill rate của các vòng
- Spread giữa R_base và R_clear trung bình
- Số lượng NĐT tham gia/vòng
- Volume đấu giá theo thời gian

### 8.2 Technical Metrics
- Latency của tick updates
- WebSocket connection stability
- API response times
- Database query performance

### 8.3 Risk Metrics
- Concentration risk (% volume từ top investors)
- Volatility của ΔG trong vòng
- Anti-sniping effectiveness

---

## 9. ROADMAP TRIỂN KHAI

### Phase 1 (MVP - 8 tuần)
- Core auction engine
- Basic UI (PC/Mobile)
- Integration với wallet service
- Manual round creation

### Phase 2 (Enhancement - 4 tuần)
- Advanced filtering/sorting
- Realtime charts
- Anti-sniping mechanism
- Automated round scheduling

### Phase 3 (Scale - 4 tuần)
- Performance optimization
- Advanced analytics
- Mobile app integration
- API for third-party access

---

## 10. QUY TẮC RÀNG BUỘC & KIỂM SOÁT RỦI RO

### 10.1 Điều kiện bắt buộc trước đặt lệnh
- **KYC = Verified**: Hoàn tất xác minh danh tính
- **2FA enabled**: Bật xác thực 2 lớp
- **Bank account linked**: Liên kết tài khoản ngân hàng chính
- **Available balance**: Đủ số dư khả dụng

### 10.2 Hạn mức và kiểm soát tập trung

#### Hạn mức theo người dùng
- **Theo ngày**: Tối đa 5 tỷ VNĐ/người/ngày
- **Theo gói**: Tối đa 2 tỷ VNĐ/người/gói
- **Trần sở hữu**: ≤ 20% tổng volume vòng để tránh tập trung rủi ro

#### Kiểm soát động
- Hạn mức tăng theo G-Trust và lịch sử giao dịch
- Alert khi tiệm cận ngưỡng tập trung
- Từ chối lệnh vượt hạn mức với thông báo rõ ràng

### 10.3 Cơ chế Hold funds

#### Lệnh "Nhận ngay"
- Hold ngay khi đặt lệnh thành công
- Trạng thái: `available -= amount`, `hold += amount`

#### Lệnh "Giới hạn"
- Hold khi ΔG_now ≤ ΔG_min (điều kiện khớp)
- Pre-check balance trước khi khớp

### 10.4 Gia hạn mềm (Anti-sniping)

#### Điều kiện kích hoạt
- Lệnh khối lượng lớn (≥ 5% target) trong 2 phút cuối
- Tối đa 2 lần gia hạn, mỗi lần 5 phút
- Thông báo realtime cho tất cả người tham gia

### 10.5 Audit trail đầy đủ

#### Ghi nhận mọi thao tác
- **Đặt lệnh**: `bid_id`, `amount`, `type`, `timestamp`, `doc_hash`
- **Sửa lệnh**: `old_delta_min`, `new_delta_min`, `reason`
- **Hủy lệnh**: `cancel_reason`, `refund_tx_id`
- **Khớp lệnh**: `fill_price`, `fill_amount`, `hold_tx_id`
- **Clear vòng**: `r_clear`, `allocation_doc_hash`, `chain_tx_hash`

### 10.6 Ngôn ngữ an toàn

#### Từ ngữ KHÔNG được sử dụng
- "Lãi", "Lợi nhuận", "Cổ phần", "Chứng khoán"
- "Cam kết", "Đảm bảo", "Cố định"

#### Từ ngữ khuyến khích
- "Quyền lợi phân phối", "Tỷ suất mục tiêu", "Dự kiến"
- "Phụ thuộc kết quả kinh doanh", "Không cam kết"

---

## 11. DỮ LIỆU & MÔ HÌNH (SUPABASE/POSTGRES)

### 11.1 Schema chính (rút gọn)

```sql
-- Bảng vòng đấu giá (cập nhật)
CREATE TABLE auction_rounds (
    round_id UUID PRIMARY KEY,
    gid UUID REFERENCES investment_packages(id),
    company_id UUID REFERENCES companies(id),
    start_at TIMESTAMP,
    end_at TIMESTAMP,
    base_rate DECIMAL(5,4), -- R_base (%)
    delta_max DECIMAL(5,4), -- ΔG_max (bps)
    delta_floor DECIMAL(5,4), -- ΔG_floor (bps)
    a DECIMAL(3,2) DEFAULT 0.8, -- Hệ số thời gian
    b DECIMAL(3,2) DEFAULT 0.7, -- Hệ số cover
    target_amount DECIMAL(15,2),
    raised DECIMAL(15,2) DEFAULT 0,
    cover DECIMAL(5,4) DEFAULT 0, -- raised/target
    delta_now DECIMAL(5,4), -- ΔG hiện tại
    round_index INTEGER, -- Vòng thứ N
    round_count INTEGER, -- Tổng M vòng
    term_months INTEGER, -- 1/3/6 tháng
    status ENUM('scheduled','open','clearing','cleared','cancelled'),
    anti_sniping_enabled BOOLEAN DEFAULT true,
    doc_hash VARCHAR(64), -- Hash tài liệu vòng
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lệnh đấu giá (cập nhật)
CREATE TABLE bids (
    bid_id UUID PRIMARY KEY,
    round_id UUID REFERENCES auction_rounds(round_id),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(15,2),
    type ENUM('market','limit'), -- Nhận ngay/Giới hạn
    delta_min DECIMAL(5,4), -- Chỉ cho lệnh limit
    state ENUM('active','filled','cancelled','expired'),
    hold_tx_id UUID, -- ID giao dịch tạm giữ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    filled_at TIMESTAMP,
    receipt_hash VARCHAR(64)
);

-- Bảng lịch sử tick
CREATE TABLE auction_ticks (
    id UUID PRIMARY KEY,
    round_id UUID REFERENCES auction_rounds(round_id),
    at TIMESTAMP,
    delta_now DECIMAL(5,4),
    cover DECIMAL(5,4),
    raised DECIMAL(15,2)
);

-- Bảng kết quả chốt vòng
CREATE TABLE auction_clear_results (
    round_id UUID PRIMARY KEY REFERENCES auction_rounds(round_id),
    clear_rate DECIMAL(5,4), -- R_clear
    total_filled DECIMAL(15,2),
    allocation_doc_url TEXT,
    doc_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng tài liệu vòng
CREATE TABLE auction_docs (
    doc_id UUID PRIMARY KEY,
    round_id UUID REFERENCES auction_rounds(round_id),
    title VARCHAR(255),
    url TEXT,
    doc_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11.2 Row Level Security (RLS)

```sql
-- Bảng bids: chỉ user sở hữu
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own bids" ON bids
    FOR ALL USING (user_id = auth.uid());

-- Các bảng khác: read-public (không chứa PII)
ALTER TABLE auction_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON auction_rounds
    FOR SELECT USING (true);

ALTER TABLE auction_ticks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON auction_ticks
    FOR SELECT USING (true);

ALTER TABLE auction_clear_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON auction_clear_results
    FOR SELECT USING (true);

ALTER TABLE auction_docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON auction_docs
    FOR SELECT USING (true);
```

---

## 12. API THIẾT KẾ (REST)

### 12.1 Listing & Realtime

```typescript
// Danh sách vòng đấu giá
GET /auction/rounds
Query: {
  gid?: string,
  status?: 'scheduled' | 'open' | 'clearing' | 'cleared',
  closingIn?: number, // phút
  gtrustMin?: number,
  sort?: 'ending_soon' | 'delta_desc' | 'cover_desc',
  page?: number,
  limit?: number
}

Response: {
  rounds: [
    {
      round_id: string,
      company_name: string,
      package_title: string,
      g_trust: number,
      target_amount: number,
      raised: number,
      cover: number,
      time_remaining: number, // seconds
      base_rate: number,
      delta_now: number,
      r_offer: number,
      round_index: number,
      round_count: number,
      term_months: number,
      previous_clear_rate?: number,
      doc_hash: string
    }
  ],
  total: number,
  page: number
}

// Chi tiết vòng
GET /auction/rounds/:id
Response: {
  round: { /* chi tiết đầy đủ */ },
  ticks: [ /* lịch sử tick gần đây */ ],
  docs: [ /* tài liệu vòng */ ],
  previous_results?: { /* kết quả vòng trước */ }
}

// Stream realtime
GET /auction/rounds/:id/stream (SSE)
Events: {
  "tick": { delta_now, cover, time_remaining },
  "bid_update": { total_bids, raised },
  "round_completed": { clear_rate, total_filled }
}
```

### 12.2 Đặt/sửa/hủy lệnh

```typescript
// Đặt lệnh
POST /auction/bids
Body: {
  roundId: string,
  amount: number,
  type: 'market' | 'limit',
  deltaMin?: number // Chỉ cho limit
}

Response: {
  bidId: string,
  holdTxId?: string,
  receiptPdfUrl: string,
  docHash: string,
  status: 'active' | 'filled'
}

// Sửa lệnh (chỉ deltaMin cho limit orders)
PATCH /auction/bids/:bidId
Body: {
  deltaMin?: number,
  action?: 'cancel'
}

// Idempotency
Headers: {
  "Idempotency-Key": "${bidId}|${roundId}|${userId}|${nonce}"
}
```

### 12.3 Clear vòng (Internal)

```typescript
// Chốt vòng (job nội bộ)
POST /auction/rounds/:id/clear
Response: {
  clearRate: number,
  totalFilled: number,
  allocationDocUrl: string,
  docHash: string,
  contractsInitiated: number
}
```

### 12.4 Ràng buộc

```typescript
// Kiểm tra điều kiện
POST /auction/precheck
Body: {
  roundId: string,
  amount: number
}

Response: {
  eligible: boolean,
  checks: {
    kyc: boolean,
    twofa: boolean,
    bank_linked: boolean,
    sufficient_balance: boolean,
    within_limits: boolean
  },
  limits: {
    daily_remaining: number,
    package_remaining: number,
    round_concentration_ok: boolean
  }
}
```

---

## 13. SỰ KIỆN HỆ THỐNG & NEO BLOCKCHAIN

### 13.1 App Events (Append-only)

```sql
CREATE TABLE app_events (
    event_id UUID PRIMARY KEY,
    event_type VARCHAR(50),
    entity_id UUID, -- round_id, bid_id, etc.
    user_id UUID,
    payload JSONB,
    doc_hash VARCHAR(64),
    chain_tx_hash VARCHAR(64), -- Hash neo blockchain
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 13.2 Các loại sự kiện

```typescript
// Sự kiện vòng đấu giá
AUCTION_ROUND_CREATED: {
  round_id: string,
  doc_hash: string // Hash điều khoản vòng
}

AUCTION_TICK: {
  round_id: string,
  delta_now: number,
  cover: number,
  timestamp: string
}

// Sự kiện lệnh
AUCTION_BID_PLACED: {
  bid_id: string,
  round_id: string,
  amount: number,
  type: string,
  proof_hash: string
}

AUCTION_BID_UPDATED: {
  bid_id: string,
  old_delta_min: number,
  new_delta_min: number
}

AUCTION_BID_CANCELLED: {
  bid_id: string,
  reason: string,
  refund_tx_id: string
}

// Sự kiện chốt vòng
AUCTION_CLEARED: {
  round_id: string,
  clear_rate: number,
  total_filled: number,
  allocation_doc_hash: string
}

// Sự kiện hợp đồng
CONTRACT_DRAFTED: {
  contract_id: string,
  bid_id: string,
  doc_hash: string
}

CONTRACT_SIGNED_ALL: {
  contract_id: string,
  completion_hash: string
}

// Sự kiện chứng chỉ
CERTIFICATE_ISSUED: {
  cqid: string,
  bid_id: string,
  amount: number,
  certificate_hash: string
}

// Sự kiện ví
HOLD_CREATED: {
  hold_tx_id: string,
  user_id: string,
  amount: number,
  reason: 'auction_bid'
}

HOLD_RELEASED: {
  hold_tx_id: string,
  reason: 'bid_cancelled' | 'bid_not_filled'
}

ALLOCATE_CQID: {
  allocation_id: string,
  cqid: string,
  amount: number
}
```

### 13.3 Neo blockchain

```typescript
// Service neo hash lên blockchain
class BlockchainAnchorService {
  async anchorHash(docHash: string, eventType: string): Promise<string> {
    // Gọi API blockchain permissioned
    const txHash = await this.blockchainClient.anchor({
      hash: docHash,
      metadata: {
        source: 'goldenbook_auction',
        event_type: eventType,
        timestamp: new Date().toISOString()
      }
    });
    
    return txHash;
  }
  
  async verifyHash(docHash: string): Promise<VerificationResult> {
    return await this.blockchainClient.verify(docHash);
  }
}

// Viewer "Xác thực blockchain"
// QR code hoặc link: /verify?hash={doc_hash}
// Hiển thị: timestamp, tx_hash, verification status
```

---

## 14. VÍ & GIAO DỊCH (LIÊN THÔNG)

### 14.1 Luồng giao dịch

#### Đặt lệnh "Nhận ngay"
1. Tạo hold ngay: `available -= amount`, `hold += amount`
2. Ghi transaction: "Tạm giữ – Đấu giá {roundId}"
3. Trả về `holdTxId` và receipt PDF

#### Đặt lệnh "Giới hạn"
1. Đặt lệnh không hold
2. Khi khớp điều kiện: tạo hold tương tự "Nhận ngay"
3. Nếu không đủ balance khi khớp: hủy lệnh, thông báo

#### Clear vòng
1. Tính R_clear và danh sách trúng
2. Ghi `allocate_cqid` cho các lệnh trúng
3. Sinh biên bản chốt vòng (PDF + hash)
4. Khởi tạo eSign workflow
5. Sau eSign: phát hành CQĐĐT, ghi "Phát hành CQĐĐT từ đấu giá"

#### Không trúng lệnh
1. Release hold tức thì: `hold -= amount`, `available += amount`
2. Ghi transaction: "Giải phóng tạm giữ – Đấu giá {roundId}"
3. Tạo biên nhận không trúng (PDF + hash)

### 14.2 Hiển thị trong Ví & Giao dịch

```typescript
// Các loại transaction hiển thị
interface AuctionTransaction {
  type: 'auction_hold' | 'auction_allocate' | 'auction_release',
  description: string,
  amount: number,
  round_id: string,
  status: 'pending' | 'completed' | 'failed',
  receipt_url?: string,
  doc_hash?: string
}

// Ví dụ descriptions:
"Tạm giữ – Đấu giá R-102"
"Phát hành CQĐĐT từ đấu giá R-102"
"Giải phóng tạm giữ – Đấu giá R-102 (không trúng)"
```

---

## 15. TÀI LIỆU & MINH BẠCH

### 15.1 Tài liệu bắt buộc DN tải

#### Trước khi mở vòng
- **Điều khoản vòng**: Quy tắc đấu giá, R_base, ΔG_max/floor, thời hạn
- **Phụ lục**: Chi tiết dự án, milestone, rủi ro
- **BCTC/Báo cáo tiến độ**: Tài chính và tiến độ liên quan

#### Sau khi clear
- **Bảng phân bổ**: Danh sách trúng (ẩn danh), R_clear, tổng volume
- **Biên bản chốt vòng**: Kết quả chính thức, chữ ký số DN

### 15.2 Hiển thị tài liệu

#### Trang chi tiết vòng
```typescript
interface RoundDocument {
  title: string,
  type: 'terms' | 'appendix' | 'financial' | 'allocation' | 'clearing',
  url: string,
  doc_hash: string,
  version: string, // v1.0, v1.1
  uploaded_at: string,
  verification_status: 'verified' | 'pending' | 'failed'
}
```

#### Tài liệu & Hợp đồng của người dùng
- Hiển thị sau khi trúng và hoàn tất eSign
- Bao gồm: Hợp đồng CQĐĐT, Biên bản chốt vòng, Biên nhận
- Tất cả có watermark và doc_hash

---

## 16. THÔNG BÁO & MICROCOPY

### 16.1 Thông báo in-app/email

#### Trong vòng đấu giá
```
"Vòng R-102 còn 15:30. ΔG hiện hành 0.25%; bạn có lệnh giới hạn đang mở."

"Đã khớp lệnh Nhận ngay ở R_offer 8.75%. Số tiền 500,000 VNĐ đã tạm giữ."

"Lệnh giới hạn của bạn đã khớp tại ΔG 0.20%. Số tiền đã tạm giữ."
```

#### Kết thúc vòng
```
"Chốt vòng R-102. R_clear 8.60%. Lệnh của bạn trúng 500,000 VNĐ. Hãy ký điện tử để phát hành CQĐĐT."

"Lệnh R-102 không trúng. Đã giải phóng tạm giữ 500,000 VNĐ. [Xem biên nhận]"

"CQĐĐT từ vòng R-102 đã phát hành. [Xem trong Sổ của tôi]"
```

#### Cảnh báo
```
"Vòng R-102 sẽ kết thúc trong 5 phút. Kiểm tra lệnh của bạn."

"Gia hạn mềm: Vòng R-102 gia hạn thêm 5 phút do lệnh lớn."

"Số dư không đủ để khớp lệnh giới hạn. [Nạp tiền]"
```

### 16.2 Microcopy an toàn

#### Disclaimer (hiển thị mọi nơi)
```
"R_offer/R_clear là tỷ suất phân phối mục tiêu tại thời điểm hiển thị/chốt; không phải cam kết."

"Phân phối lợi ích phụ thuộc kết quả kinh doanh thực tế của doanh nghiệp."

"GoldenBook không cam kết lợi nhuận cố định và không phải sàn chứng khoán."
```

#### Tooltips
```
"ΔG": "Biên ưu đãi phân phối so với tỷ suất cơ bản, giảm dần theo thời gian và mức lấp đầy."

"R_clear": "Mức chốt đồng nhất áp dụng cho tất cả lệnh trúng, được tính khi vòng kết thúc."

"Lệnh giới hạn": "Lệnh chỉ khớp khi ΔG giảm xuống mức bạn chỉ định hoặc thấp hơn."
```

---

## 17. EDGE CASES & XỬ LÝ

### 17.1 Xử lý idempotent

#### Trùng webhook
```typescript
class WebhookHandler {
  async handlePaymentGateway(payload: any, idempotencyKey: string) {
    const existing = await this.getProcessedWebhook(idempotencyKey);
    if (existing) {
      return { status: 200, message: 'Already processed' };
    }
    
    // Xử lý logic
    await this.processPayment(payload);
    await this.markWebhookProcessed(idempotencyKey);
    
    return { status: 200, message: 'Processed' };
  }
}
```

### 17.2 Mạng yếu

#### UI handling
```typescript
// Hiển thị trạng thái kết nối
<div className="connection-status">
  {isOnline ? (
    <span className="text-green-600">Dữ liệu cập nhật {lastUpdate}s trước</span>
  ) : (
    <span className="text-red-600">
      Mất kết nối <button onClick={refresh}>Làm mới</button>
    </span>
  )}
</div>

// Retry logic
const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### 17.3 Lệnh lớn sát giờ (Anti-sniping)

```typescript
class AntiSnipingService {
  async checkLargeBidNearEnd(bid: Bid, round: AuctionRound): Promise<boolean> {
    const timeRemaining = round.end_at.getTime() - Date.now();
    const isNearEnd = timeRemaining <= 2 * 60 * 1000; // 2 phút
    const isLargeBid = bid.amount >= round.target_amount * 0.05; // ≥5%
    
    if (isNearEnd && isLargeBid && round.anti_sniping_enabled) {
      await this.extendRound(round.round_id, 5 * 60 * 1000); // +5 phút
      await this.notifyExtension(round.round_id);
      return true;
    }
    
    return false;
  }
}
```

### 17.4 Pre-hold thất bại

```typescript
// Kiểm tra balance trước khi khớp lệnh limit
async function tryFillLimitOrder(bid: Bid): Promise<boolean> {
  const currentBalance = await this.walletService.getAvailableBalance(bid.user_id);
  
  if (currentBalance < bid.amount) {
    await this.cancelBid(bid.bid_id, 'insufficient_balance');
    await this.notifyUser(bid.user_id, {
      type: 'bid_cancelled',
      message: 'Số dư không đủ để khớp lệnh. Vui lòng nạp thêm tiền.',
      action_url: '/wallet/deposit'
    });
    return false;
  }
  
  // Tiếp tục khớp lệnh
  return await this.fillBid(bid);
}
```

### 17.5 DN thay đổi tài liệu vòng

```typescript
// Versioning tài liệu
interface DocumentVersion {
  doc_id: string,
  version: string, // v1.0 -> v1.1
  changes_summary: string,
  requires_reacknowledgment: boolean
}

// Xử lý khi DN upload tài liệu mới
async function handleDocumentUpdate(roundId: string, newDoc: Document) {
  const existingBids = await this.getActiveBids(roundId);
  
  if (newDoc.requires_reacknowledgment && existingBids.length > 0) {
    // Hiển thị thông báo cho users có lệnh
    await this.notifyBidders(existingBids, {
      type: 'document_updated',
      message: 'Tài liệu vòng đã cập nhật. Vui lòng xem lại và xác nhận.',
      old_version: 'v1.0',
      new_version: 'v1.1',
      action_required: true
    });
    
    // Tùy chọn: pause vòng cho đến khi users ack
    // hoặc giữ nguyên lệnh theo chính sách minh bạch
  }
}
```

### 17.6 Clear lỗi giữa chừng

```typescript
class RoundClearingService {
  async clearRoundWithRollback(roundId: string): Promise<void> {
    const transaction = await this.db.beginTransaction();
    
    try {
      // Bước 1: Tính R_clear
      const rClear = await this.calculateClearPrice(roundId);
      
      // Bước 2: Cập nhật orders
      await this.updateFilledOrders(roundId, rClear, transaction);
      
      // Bước 3: Tạo documents
      const clearingDoc = await this.generateClearingDocument(roundId, rClear);
      
      // Bước 4: Neo blockchain
      const chainTxHash = await this.blockchainService.anchor(clearingDoc.hash);
      
      // Bước 5: Commit
      await transaction.commit();
      
      // Bước 6: Khởi tạo eSign (ngoài transaction)
      await this.initiateESignWorkflow(roundId);
      
    } catch (error) {
      await transaction.rollback();
      
      // Rollback về trạng thái "open" nếu chưa công bố R_clear
      await this.revertRoundToOpen(roundId);
      
      // Ghi sự cố
      await this.logIncident({
        type: 'clearing_failed',
        round_id: roundId,
        error: error.message,
        doc_hash: this.hashIncidentReport(error)
      });
      
      // Thông báo Ops & users
      await this.notifyOpsTeam(roundId, error);
      await this.notifyAffectedUsers(roundId, 'clearing_delayed');
      
      throw error;
    }
  }
}
```

### 17.7 Khiếu nại

```typescript
// Tự động tạo ticket từ lệnh/clear
interface ComplaintTicket {
  ticket_id: string,
  user_id: string,
  type: 'bid_issue' | 'clearing_dispute' | 'document_error',
  related_bid_id?: string,
  related_round_id?: string,
  doc_hash: string, // Evidence
  description: string,
  status: 'open' | 'investigating' | 'resolved' | 'closed'
}

// Auto-fill form
function createComplaintFromBid(bidId: string) {
  const bid = this.getBid(bidId);
  return {
    type: 'bid_issue',
    related_bid_id: bidId,
    related_round_id: bid.round_id,
    doc_hash: bid.receipt_hash,
    pre_filled_data: {
      bid_amount: bid.amount,
      bid_type: bid.type,
      bid_time: bid.created_at,
      round_status: bid.round.status
    }
  };
}
```

---

## 18. BẢO MẬT – TUÂN THỦ – QUYỀN RIÊNG TƯ

### 18.1 2FA bắt buộc

```typescript
// Middleware 2FA cho các thao tác nhạy cảm
const require2FA = async (req: Request, res: Response, next: NextFunction) => {
  const sensitiveActions = [
    'place_bid', 'cancel_bid', 'sign_contract', 
    'download_sensitive_document'
  ];
  
  if (sensitiveActions.includes(req.body.action)) {
    const twoFAValid = await this.verify2FA(req.user.id, req.body.twofa_code);
    if (!twoFAValid) {
      return res.status(401).json({ error: 'Invalid 2FA code' });
    }
  }
  
  next();
};
```

### 18.2 RLS/Mask - Không rò rỉ PII

```sql
-- Mask PII trong logs public
CREATE VIEW public_auction_stats AS
SELECT 
    round_id,
    COUNT(*) as total_bids,
    SUM(amount) as total_amount,
    AVG(amount) as avg_bid_size,
    -- KHÔNG hiển thị user_id, email, phone
    NULL as user_info
FROM bids 
GROUP BY round_id;

-- Audit logs chỉ ghi hash
INSERT INTO audit_logs (action, user_hash, details)
VALUES ('bid_placed', SHA256(user_id), jsonb_build_object(
    'round_id', round_id,
    'amount_range', CASE 
        WHEN amount < 100000 THEN 'small'
        WHEN amount < 1000000 THEN 'medium'
        ELSE 'large'
    END
));
```

### 18.3 Rate limiting & Device trust

```typescript
// Rate limiting cho đặt lệnh
const bidRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 5, // Tối đa 5 lệnh/phút
  keyGenerator: (req) => `bid_${req.user.id}`,
  message: 'Quá nhiều lệnh. Vui lòng thử lại sau 1 phút.'
});

// Device trust
class DeviceTrustService {
  async checkDeviceTrust(userId: string, deviceFingerprint: string): Promise<boolean> {
    const knownDevice = await this.getKnownDevice(userId, deviceFingerprint);
    
    if (!knownDevice) {
      // Thiết bị mới - yêu cầu xác thực bổ sung
      await this.sendDeviceVerificationEmail(userId);
      return false;
    }
    
    return knownDevice.trusted;
  }
}

// Re-auth cho thao tác nhạy cảm
const requireReauth = async (req: Request, res: Response, next: NextFunction) => {
  const lastAuth = req.session.last_auth_time;
  const now = Date.now();
  const authTimeout = 15 * 60 * 1000; // 15 phút
  
  if (!lastAuth || (now - lastAuth) > authTimeout) {
    return res.status(401).json({ 
      error: 'Re-authentication required',
      redirect_url: '/auth/reauth'
    });
  }
  
  next();
};
```

### 18.4 PDF watermark & doc_hash

```typescript
class DocumentService {
  async generateWatermarkedPDF(content: any, userId: string): Promise<{url: string, hash: string}> {
    const watermark = {
      text: `${user.full_name} - ${new Date().toISOString()} - ${userId.slice(0,8)}`,
      position: 'bottom-right',
      opacity: 0.3
    };
    
    const pdfBuffer = await this.pdfGenerator.create(content, { watermark });
    const docHash = this.calculateSHA256(pdfBuffer);
    
    const url = await this.uploadToSecureStorage(pdfBuffer, docHash);
    
    return { url, hash: docHash };
  }
  
  private calculateSHA256(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
```

---

## 19. QUAN TRẮC (OBSERVABILITY) & KPI

### 19.1 KPI kinh doanh

```typescript
// Metrics collection
interface BusinessMetrics {
  // Fill rate theo vòng
  fill_rate: {
    round_id: string,
    target_amount: number,
    filled_amount: number,
    fill_percentage: number,
    time_to_fill: number // minutes
  },
  
  // ΔG path efficiency
  delta_g_efficiency: {
    round_id: string,
    delta_g_start: number,
    delta_g_end: number,
    delta_g_clear: number,
    efficiency_score: number // 0-1
  },
  
  // Conversion funnel
  conversion: {
    views: number,
    bids_placed: number,
    bids_filled: number,
    contracts_signed: number,
    certificates_issued: number,
    view_to_bid: number,
    bid_to_fill: number,
    fill_to_sign: number,
    sign_to_issue: number
  },
  
  // Order type distribution
  order_distribution: {
    market_orders: number,
    limit_orders: number,
    market_percentage: number,
    avg_market_size: number,
    avg_limit_size: number
  },
  
  // G-Trust band analysis
  gtrust_analysis: {
    band_85_plus: { count: number, volume: number },
    band_75_84: { count: number, volume: number },
    band_60_74: { count: number, volume: number },
    band_below_60: { count: number, volume: number }
  }
}
```

### 19.2 KPI trải nghiệm

```typescript
interface ExperienceMetrics {
  // SLA cập nhật tick
  tick_sla: {
    target_interval: number, // seconds
    actual_avg_interval: number,
    sla_compliance: number, // percentage
    max_delay: number
  },
  
  // Độ trễ realtime
  realtime_latency: {
    websocket_ping: number,
    tick_propagation: number,
    bid_confirmation: number
  },
  
  // Tỷ lệ "mạng yếu"
  connectivity: {
    total_sessions: number,
    poor_connection_sessions: number,
    poor_connection_rate: number,
    avg_reconnection_time: number
  },
  
  // Khiếu nại sau clear
  complaints: {
    total_clears: number,
    complaints_filed: number,
    complaint_rate: number,
    avg_resolution_time: number,
    complaint_categories: Record<string, number>
  },
  
  // Thời gian hoàn tất eSign
  esign_completion: {
    avg_time_to_sign: number, // hours
    sign_completion_rate: number,
    abandonment_rate: number
  }
}
```

### 19.3 KPI an toàn

```typescript
interface SafetyMetrics {
  // Giao dịch nhạy cảm
  sensitive_trading: {
    bids_in_last_2min: number,
    large_bids_near_end: number,
    anti_sniping_triggers: number,
    suspicious_patterns: number
  },
  
  // Kiểm soát truy cập
  access_control: {
    failed_kyc_attempts: number,
    failed_2fa_attempts: number,
    blocked_by_limits: number,
    device_trust_failures: number
  },
  
  // Tập trung rủi ro
  concentration_risk: {
    max_single_user_percentage: number,
    top_10_users_percentage: number,
    concentration_alerts: number,
    rejected_for_concentration: number
  }
}
```

### 19.4 Dashboard & Alerting

```typescript
// Real-time monitoring dashboard
class MonitoringDashboard {
  async getSystemHealth(): Promise<SystemHealth> {
    return {
      active_rounds: await this.countActiveRounds(),
      total_active_bids: await this.countActiveBids(),
      websocket_connections: await this.getWSConnectionCount(),
      avg_response_time: await this.getAvgResponseTime(),
      error_rate: await this.getErrorRate(),
      blockchain_sync_status: await this.getBlockchainSyncStatus()
    };
  }
  
  // Alerts
  async checkAlerts(): Promise<Alert[]> {
    const alerts = [];
    
    // High error rate
    if (await this.getErrorRate() > 0.05) {
      alerts.push({
        type: 'high_error_rate',
        severity: 'critical',
        message: 'Error rate above 5%'
      });
    }
    
    // Slow tick updates
    const avgTickDelay = await this.getAvgTickDelay();
    if (avgTickDelay > 30) {
      alerts.push({
        type: 'slow_tick_updates',
        severity: 'warning',
        message: `Tick updates delayed by ${avgTickDelay}s`
      });
    }
    
    // Concentration risk
    const maxConcentration = await this.getMaxUserConcentration();
    if (maxConcentration > 0.25) {
      alerts.push({
        type: 'concentration_risk',
        severity: 'warning',
        message: `Single user holds ${maxConcentration * 100}% of round`
      });
    }
    
    return alerts;
  }
}
```

---

## 20. KẾ HOẠCH VẬN HÀNH & TRIỂN KHAI

### 20.1 Giai đoạn A (MVP v1.0) - 8 tuần

#### Tuần 1-2: Core Infrastructure
- Database schema & migrations
- Basic API endpoints (CRUD)
- Authentication & authorization
- Wallet service integration

#### Tuần 3-4: Auction Engine
- ΔG calculation service
- Tick scheduling system
- Order matching logic
- Hold/release funds integration

#### Tuần 5-6: Frontend MVP
- Marketplace listing page
- Round detail page
- Bid placement forms
- Basic realtime updates (polling)

#### Tuần 7-8: Integration & Testing
- eSign workflow integration
- Document generation (PDF + hash)
- End-to-end testing
- Security audit

#### Tính năng MVP v1.0
- ✅ 1 loại vòng (Dutch + uniform clear)
- ✅ 2 kiểu lệnh (Nhận ngay/Giới hạn)
- ✅ Tick theo lịch + theo %cover thay đổi
- ❌ Gia hạn mềm tắt (để đơn giản)
- ✅ Báo cáo clear & biên nhận CQĐĐT đầy đủ
- ✅ Blockchain anchoring cơ bản

### 20.2 Giai đoạn B (v1.1-v1.2) - 6 tuần

#### v1.1 (4 tuần): Enhanced Features
- ✅ Bật anti-sniping có điều kiện
- ✅ WebSocket realtime updates
- ✅ Advanced filtering/sorting
- ✅ Mobile optimization
- ✅ Performance monitoring

#### v1.2 (2 tuần): Advanced Risk Management
- ✅ Hạn mức động theo hồ sơ rủi ro
- ✅ Biểu đồ Order Book ẩn danh
- ✅ Advanced analytics dashboard
- ❓ Chuyển nhượng CQĐĐT nội bộ (nếu chính sách cho phép)

### 20.3 Deployment Strategy

#### Environment Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - BLOCKCHAIN_API_URL=${BLOCKCHAIN_API_URL}
    
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=goldenbook_auction
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    
  redis:
    image: redis:7-alpine
    
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

#### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Auction Module
on:
  push:
    branches: [main]
    paths: ['src/auction/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm test
          npm run test:integration
          npm run test:security
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: |
          docker build -t auction-module .
          docker push $REGISTRY/auction-module:$GITHUB_SHA
          kubectl set image deployment/auction-module app=$REGISTRY/auction-module:$GITHUB_SHA
```

#### Rollback Strategy
```typescript
// Feature flags cho rollback nhanh
class FeatureFlags {
  static AUCTION_MODULE_ENABLED = process.env.AUCTION_MODULE_ENABLED === 'true';
  static ANTI_SNIPING_ENABLED = process.env.ANTI_SNIPING_ENABLED === 'true';
  static REALTIME_UPDATES_ENABLED = process.env.REALTIME_UPDATES_ENABLED === 'true';
  
  static canPlaceBid(): boolean {
    return this.AUCTION_MODULE_ENABLED;
  }
  
  static canExtendRound(): boolean {
    return this.AUCTION_MODULE_ENABLED && this.ANTI_SNIPING_ENABLED;
  }
}

// Circuit breaker cho external services
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute
  
  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private isOpen(): boolean {
    return this.failures >= this.threshold && 
           (Date.now() - this.lastFailTime) < this.timeout;
  }
}
```

---

## 16. VÍ DỤ PAYLOAD & CHỨNG TỪ (RÚT GỌN)

### 16.1 GET /auction/rounds/:id

```json
{
  "roundId": "R-102",
  "gid": "AQ-A",
  "company": "AquaPure",
  "termMonths": 12,
  "startAt": "2025-09-02T09:00:00+07:00",
  "endAt": "2025-10-02T09:00:00+07:00",
  "baseRate": 0.072,
  "deltaMax": 0.003,
  "deltaFloor": 0.0005,
  "a": 0.8,
  "b": 0.7,
  "targetAmount": 12000000000,
  "raised": 8760000000,
  "cover": 0.73,
  "deltaNow": 0.0028,
  "rOffer": 0.0748,
  "roundIndex": 2,
  "roundCount": 3,
  "status": "open",
  "docs": [
    {
      "title": "Điều khoản vòng",
      "docHash": "#5a0…d4"
    }
  ]
}
```

### 16.2 POST /auction/bids (limit)

```json
{
  "roundId": "R-102",
  "amount": 5000000,
  "type": "limit",
  "deltaMin": 0.0025,
  "idempotencyKey": "u21-R102-0001"
}
```

### 16.3 POST /auction/rounds/:id/clear → allocation document (PDF + hash)

Ghi danh sách bidId → filledAmount, R_clear, chữ ký số DN/GB; doc_hash neo blockchain.

```json
{
  "roundId": "R-102",
  "clearRate": 0.0746,
  "totalFilled": 11850000000,
  "allocationDocUrl": "https://docs.goldenbook.vn/allocation/R-102-final.pdf",
  "docHash": "7f3a8b2c9d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "contractsInitiated": 247,
  "chainTxHash": "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"
}
```

---

## 17. MẪU MICROCOPY (VI/EN)

### 17.1 Trạng thái vòng đấu giá

#### Tiếng Việt
```
"Đấu giá đang mở. Thời gian còn: {mm:ss} · Lấp đầy {cover%} · R_offer {x}% (mục tiêu)."

"Nhận ngay để giữ R_offer hiện hành."

"Giới hạn: khớp khi ΔG ≤ {deltaMin}."

"Đã khớp lệnh. Đã tạm giữ {amount}."

"Chốt vòng: R_clear {x}%. Vui lòng ký điện tử để phát hành CQĐĐT."

"Lệnh không trúng. Đã giải phóng tạm giữ (PDF + hash)."

"Phân phối lợi ích phụ thuộc kết quả kinh doanh. GoldenBook không cam kết lợi nhuận cố định."
```

#### English
```
"Auction is live. Time remaining: {mm:ss} · Fill rate {cover%} · R_offer {x}% (target)."

"Market order to secure current R_offer."

"Limit order: fills when ΔG ≤ {deltaMin}."

"Order filled. Amount {amount} held."

"Round cleared: R_clear {x}%. Please e-sign to issue distribution certificates."

"Order not filled. Hold released (PDF + hash)."

"Distribution depends on actual business results. GoldenBook does not guarantee fixed returns."
```

### 17.2 Thông báo hệ thống

#### Tiếng Việt
```
"Vòng R-102 sẽ kết thúc trong 5 phút. Kiểm tra lệnh của bạn."

"Gia hạn mềm: Vòng R-102 gia hạn thêm 5 phút do lệnh lớn."

"Số dư không đủ để khớp lệnh giới hạn. [Nạp tiền]"

"Tài liệu vòng đã cập nhật. Vui lòng xem lại và xác nhận."

"Hệ thống bảo trì trong 10 phút. Các lệnh đang mở sẽ được bảo toàn."
```

#### English
```
"Round R-102 ends in 5 minutes. Check your orders."

"Soft extension: Round R-102 extended by 5 minutes due to large bid."

"Insufficient balance to fill limit order. [Add funds]"

"Round documents updated. Please review and acknowledge."

"System maintenance in 10 minutes. Active orders will be preserved."
```

### 17.3 Tooltips & Help text

#### Tiếng Việt
```
"ΔG (Delta G)": "Biên ưu đãi phân phối so với tỷ suất cơ bản, giảm dần theo thời gian và mức lấp đầy."

"R_clear": "Mức chốt đồng nhất áp dụng cho tất cả lệnh trúng, được tính khi vòng kết thúc."

"Lệnh giới hạn": "Lệnh chỉ khớp khi ΔG giảm xuống mức bạn chỉ định hoặc thấp hơn."

"G-Trust": "Điểm tin cậy doanh nghiệp dựa trên lịch sử hoạt động và minh bạch tài chính."

"CQĐĐT": "Chứng quyền đại diện tài sản - chứng nhận quyền lợi phân phối từ dự án."
```

#### English
```
"ΔG (Delta G)": "Distribution premium over base rate, decreasing with time and fill rate."

"R_clear": "Uniform clearing rate applied to all winning bids, calculated at round end."

"Limit Order": "Order fills only when ΔG drops to your specified level or below."

"G-Trust": "Company trust score based on operational history and financial transparency."

"CQĐĐT": "Asset Representative Certificate - certifies distribution rights from projects."
```

---

## 18. KIỂM THỬ & DoD (DEFINITION OF DONE)

### 18.1 Functional Testing

#### Listing hoạt động
- ✅ Lọc/sort theo status, G-Trust, thời gian kết thúc
- ✅ Card hiển thị đúng ΔG_now & cover theo tick realtime
- ✅ Pagination và infinite scroll hoạt động mượt
- ✅ Mobile responsive và touch-friendly

#### Chi tiết vòng
- ✅ Đồ thị ΔG/cover mượt, cập nhật realtime
- ✅ Tài liệu (PDF + doc_hash) mở được và verify được
- ✅ Precheck rõ ràng (KYC, 2FA, balance, limits)
- ✅ Countdown timer chính xác đến giây

#### Đặt lệnh
- ✅ Market/limit orders với validation đầy đủ
- ✅ Hold chính xác cho market orders
- ✅ Biên nhận PDF + hash tạo ngay
- ✅ Idempotency key hoạt động đúng
- ✅ Rate limiting và error handling

### 18.2 Business Logic Testing

#### Clear vòng
- ✅ Tính R_clear chính xác theo công thức
- ✅ Phát allocation PDF + hash với chữ ký số
- ✅ Tự động chuyển eSign workflow
- ✅ Phát hành CQĐĐT sau khi eSign hoàn tất
- ✅ "Ví & Giao dịch" và "Sổ của tôi" cập nhật đồng bộ

#### Không trúng lệnh
- ✅ Release hold tức thì
- ✅ Biên nhận không trúng (PDF + hash)
- ✅ Thông báo rõ ràng và actionable
- ✅ Transaction history cập nhật đúng

### 18.3 Security & Compliance Testing

#### Audit + blockchain
- ✅ Mọi sự kiện quan trọng có app_events
- ✅ Doc_hash và chain_tx_hash đầy đủ
- ✅ Blockchain verification hoạt động
- ✅ Audit trail không thể chỉnh sửa

#### RLS/An toàn
- ✅ Không lộ PII trong logs public
- ✅ 2FA bắt buộc cho thao tác nhạy cảm
- ✅ Rate-limit hiệu quả
- ✅ Watermark tài liệu với user info
- ✅ Device trust và re-authentication

### 18.4 Edge Cases Testing

#### Mạng yếu
- ✅ Offline indicator và retry logic
- ✅ Graceful degradation khi mất kết nối
- ✅ Data sync khi reconnect
- ✅ Optimistic UI updates

#### Idempotency
- ✅ Duplicate requests không tạo multiple orders
- ✅ Webhook replay protection
- ✅ Concurrent request handling

#### Anti-sniping
- ✅ Large bids near end trigger extension
- ✅ Extension notifications realtime
- ✅ Maximum 2 extensions per round
- ✅ Fair play enforcement

### 18.5 Performance Testing

#### Load Testing
- ✅ 1000+ concurrent users
- ✅ Tick updates < 2s latency
- ✅ API response times < 500ms
- ✅ Database query optimization

#### Stress Testing
- ✅ High bid volume near round end
- ✅ Multiple rounds clearing simultaneously
- ✅ Document generation under load
- ✅ Blockchain anchoring queue management

### 18.6 User Experience Testing

#### Mobile Experience
- ✅ Touch targets ≥ 44px
- ✅ Swipe gestures intuitive
- ✅ Loading states clear
- ✅ Error messages actionable

#### Accessibility
- ✅ Screen reader compatible
- ✅ Keyboard navigation
- ✅ Color contrast compliance
- ✅ Focus indicators clear

### 18.7 Integration Testing

#### Wallet Integration
- ✅ Hold/release funds accurate
- ✅ Transaction history sync
- ✅ Balance updates realtime
- ✅ Payment gateway webhooks

#### eSign Integration
- ✅ Document preparation automated
- ✅ Signing workflow smooth
- ✅ Completion callbacks handled
- ✅ Certificate issuance triggered

#### Blockchain Integration
- ✅ Hash anchoring reliable
- ✅ Verification API stable
- ✅ Fallback mechanisms
- ✅ Error recovery procedures

---

## KẾT LUẬN

Module **"Đấu giá quyền lợi phân phối"** của GoldenBook v1.0 cung cấp cơ chế định giá động, minh bạch, realtime, bảo đảm kỷ luật pháp lý & vận hành thông qua:

### Đặc điểm cốt lõi
- **Biên nhận PDF + doc_hash** cho mọi giao dịch
- **Audit on-chain** với blockchain anchoring
- **Quy trình eSign → CQĐĐT** liền mạch
- **Tích hợp "Ví & Giao dịch"** và **"Sổ của tôi"**

### Thiết kế Dutch-like + Uniform Clear
- **DN**: Phân bổ hiệu quả với price discovery tối ưu
- **NĐT**: Ưu đãi hợp lý với cơ chế fair clearing
- **Hệ thống**: Minh bạch, audit-able, compliant

### Trải nghiệm người dùng
- **Gọn**: Interface đơn giản, workflow rõ ràng
- **Rõ**: Thông tin realtime, documentation đầy đủ
- **An toàn**: 2FA, RLS, rate limiting, device trust

Module này đáp ứng đầy đủ yêu cầu pháp lý, kỹ thuật và trải nghiệm người dùng cho việc triển khai hệ thống đấu giá quyền lợi phân phối trong môi trường fintech Việt Nam.

---

*Tài liệu này tuân thủ ngôn ngữ an toàn GoldenBook và đồng bộ với các module #1–#6. Blockchain chỉ dùng để neo hash chứng từ & sự kiện, không phát hành tài sản số.*