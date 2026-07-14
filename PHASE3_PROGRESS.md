# 明道 MINGDAO - Phase 3 开发进度说明

## Phase 3: 付费报告体系 + AI对话系统 + 支付集成 ✅ 完成

### 完成情况总览

| 模块 | 状态 | 说明 |
|------|------|------|
| 6款付费报告产品页 | ✅ 完成 | 产品介绍+输入+生成等待+结果展示，完整四步流程 |
| AI对话系统（七七四十九问） | ✅ 完成 | 清风道长假面 + 报告绑定 + 次数限制 + 深度解锁 |
| 定价与会员页面 | ✅ 完成 | 两档会员 + 6款报告 + 按月/按年切换 + FAQ |
| 支付集成 | ✅ 完成 | PayPal 按钮组件 + mock支付 + Webhook 占位 + 派安盈预留 |
| 我的报告页面 | ✅ 完成 | 报告列表 + 筛选 + 问道进度 + 继续对话入口 |
| 数据库设计 | ✅ 完成 | 7张新表 + RLS 策略 + 数据迁移 |
| API 接口 | ✅ 完成 | 聊天/支付/报告生成 API 路由 |

---

### 3.1 付费报告体系（6款产品）✅

**技术方案：**
- 动态路由 `/reports/[productId]` 统一管理6款报告
- 每款报告包含4个页面：介绍页 → 输入页 → 生成等待页 → 结果页
- 结果页采用左右布局（桌面端）/上下切换（移动端）：左侧报告，右侧聊天

**6款报告：**

| 报告ID | 名称 | 价格 | 基础问道次数 | 说明 |
|--------|------|------|-------------|------|
| `bazi_full` | 八字完整报告 | $19.99 | 10次 | 完整八字+大运+流年+喜用 |
| `ziwei_full` | 紫微斗数完整报告 | $29.99 | 25次 | MVP占位页，算法后续补 |
| `iching_deep` | 易经深度解读 | $14.99 | 10次 | 卦象+变爻+实用建议 |
| `relationship_report` | 感情专项报告 | $19.99 | 15次 | 感情命盘+桃花运+婚姻 |
| `career_wealth_report` | 事业财运专项 | $19.99 | 15次 | 事业方向+财运周期 |
| `couple_compatibility` | 双人合盘 | $39.99 | 30次 | 五行合婚+相处模式 |

**核心文件：**
```
src/app/reports/[productId]/
├── page.tsx              # 产品介绍页
├── input/page.tsx        # 输入信息页
├── generating/page.tsx   # 生成等待页（动画效果）
└── result/page.tsx       # 报告结果页（含聊天面板）

src/components/report/
└── report-viewer.tsx     # 报告展示组件（免费/付费分层）

src/lib/
├── products.ts           # 产品配置
└── report-generator.ts   # 报告生成器（6种报告）
```

**输入页差异化：**
- 八字类报告（bazi/relationship/career/ziwei）：姓名+性别+出生日期+时间+地点
- 易经报告（iching）：问题输入 + 占卜须知
- 双人合盘（compatibility）：双人各自的出生信息

---

### 3.2 AI对话系统 - 七七四十九问体系 ✅

**核心特性：**

1. **清风道长老话头** 👤
   - 武当山年轻道长人设
   - 古风但易懂的表达方式
   - 中英文双语回答（中文为主，英文为辅）
   - 引用道家经典，富有禅意
   - 强调"命由己造，福自我求"

2. **对话限制机制** 🔒
   - 每份报告有基础问道次数（10-30次不等）
   - $9.9 可解锁至七七四十九次深度问道
   - 会员每月49次问道额度
   - 对话必须围绕当前报告内容

3. **UI设计** 🎨
   - 桌面端：左侧报告内容 + 右侧聊天面板
   - 移动端：顶部 Tab 切换（Report / Chat）
   - 道长头像 + 在线状态指示
   - 打字动画效果
   - 问道次数实时显示

4. **技术实现**
   - MVP期使用 mock 响应（6种问题类型智能匹配）
   - 预留 OpenAI API 调用接口
   - 系统提示词包含完整人设 + 报告上下文
   - 对话历史 Supabase 存储（表已设计）

**核心文件：**
```
src/components/chat/
└── chat-panel.tsx        # 聊天面板组件

src/lib/
└── ai-chat.ts            # AI对话逻辑 + 清风道长老话头
```

---

### 3.3 定价与会员页面 ✅

**页面地址：** `/pricing`

**两档订阅会员：**

| 档位 | 月费 | 年费 | 核心权益 |
|------|------|------|---------|
| 明道会员 | $9.99 | $79 | 每日运势邮件 + 所有报告7折 + 49次问道/月 |
| 道长亲传 | $29.99 | $249 | 每日运势 + 每月2份免费报告 + 6折 + 优先响应 + 每月专题 + 49次问道/月 |

**页面结构：**
1. Hero 区域 — 主标题 + 价值主张
2. 会员订阅方案 — 两档对比卡片
3. 单次报告展示 — 6款报告卡片
4. 深度问道加购 — $9.9/份
5. FAQ — 常见问题解答

**核心文件：**
```
src/app/pricing/page.tsx  # 定价页面
```

---

### 3.4 支付集成 ✅

**技术方案：**
- MVP期使用 mock 支付模拟完整流程
- 真实 PayPal 接口预留接入位置
- 派安盈（Payoneer）预留接口，暂不实现

**支付流程：**
```
选择产品 → 填写信息 → 支付 → 生成报告 → 可对话
```

**组件与API：**
- `PayPalButton` 组件 — 可复用的支付按钮
- `PaymentModal` 组件 — 支付模态框（订单摘要+支付方式选择）
- 支付方式切换（PayPal / 信用卡）
- 安全支付 + 即时获取 标识

**API 路由：**
```
src/app/api/
├── chat/route.ts              # AI对话接口
├── paypal/
│   ├── create-order/route.ts  # 创建订单
│   ├── capture-order/route.ts # 捕获支付
│   └── webhook/route.ts       # Webhook通知
└── reports/route.ts           # 报告生成/列表
```

**核心文件：**
```
src/components/payment/
└── paypal-button.tsx          # PayPal支付组件
```

---

### 3.5 我的报告页面 ✅

**页面地址：** `/dashboard/reports`

**功能特性：**
1. **统计卡片** — 总报告数、已用问道次数、付费报告数、深度解锁数
2. **类型筛选** — 全部/八字/紫微/易经/感情/事业/合盘
3. **报告卡片**
   - 报告名称+中文名
   - 创建日期
   - 问道次数进度条
   - 剩余次数显示
   - 继续对话按钮
   - 查看报告按钮
4. **空状态** — 引导用户购买首份报告
5. **底部CTA** — 探索更多报告

**核心文件：**
```
src/app/dashboard/reports/page.tsx  # 我的报告页面
```

---

### 3.6 数据库表设计 ✅

**迁移文件：** `supabase/migrations/002_phase3_schema.sql`

| 表名 | 说明 |
|------|------|
| `products` | 产品表（6款报告） |
| `reports` | 用户报告表（购买的报告） |
| `conversations` | 对话会话表 |
| `subscription_plans` | 订阅计划表（两档会员） |
| `deep_question_purchases` | 深度问道加购记录 |
| `paypal_orders` | PayPal支付订单表 |

**已有表更新：**
- `chat_messages` — 增加 `report_id` 字段
- `orders` — 扩展 `order_type` 枚举

**安全策略：**
- 所有新表启用 RLS
- 用户只能访问自己的数据
- 产品表和订阅计划表公开可读

---

### 3.7 导航与入口更新 ✅

**导航栏更新：**
- 新增 Pricing 菜单项
- 用户下拉菜单新增 "My Reports" 入口
- 移动端菜单同步更新

**仪表盘更新：**
- 快捷操作卡片更新为4个入口：八字排盘/我的报告/易经占卜/升级会员
- 订阅卡片链接到 /pricing
- 文案更新匹配 Phase 3 功能

---

## 新增文件清单

```
# 数据库迁移
supabase/migrations/002_phase3_schema.sql

# 类型定义（更新）
src/types/index.ts

# 产品与报告
src/lib/products.ts
src/lib/report-generator.ts
src/lib/ai-chat.ts

# 组件
src/components/chat/chat-panel.tsx
src/components/report/report-viewer.tsx
src/components/payment/paypal-button.tsx

# 页面
src/app/pricing/page.tsx
src/app/reports/[productId]/page.tsx
src/app/reports/[productId]/input/page.tsx
src/app/reports/[productId]/generating/page.tsx
src/app/reports/[productId]/result/page.tsx
src/app/dashboard/reports/page.tsx

# API 路由
src/app/api/chat/route.ts
src/app/api/paypal/create-order/route.ts
src/app/api/paypal/capture-order/route.ts
src/app/api/paypal/webhook/route.ts
src/app/api/reports/route.ts

# 环境变量（更新）
.env.example
```

---

## 技术亮点

1. **东方水墨设计系统延续** — 所有新页面沿用Phase 1/2的宣纸质感、金色装饰、书法字体
2. **中文原字+英文注释双轨制** — 排盘展示方式保持一致
3. **响应式设计** — 所有页面移动端适配，聊天面板智能切换布局
4. **Mock优先，真实接口预留** — MVP期可用mock数据完整体验，真实接口已留好接入位置
5. **清风道长老话头** — 完整的人设系统，6种问题类型智能回复
6. **分层报告展示** — 免费内容可见，付费内容有明确的解锁引导

---

## MVP 验证路径

1. 访问 `/pricing` — 查看定价体系
2. 访问 `/reports/bazi_full` — 查看八字完整报告产品页
3. 点击 "Start Your Reading" → 进入输入页
4. 填写信息 → 点击生成 → 观看生成动画
5. 到达结果页 → 查看免费报告内容
6. 点击右侧聊天面板 → 与清风道长对话
7. 点击 "Unlock Full Report" → 模拟解锁完整报告
8. 访问 `/dashboard/reports` → 查看我的报告列表（mock数据）

---

## 待完善项（生产环境）

- [ ] 真实 PayPal SDK 集成（替换 mock 支付）
- [ ] OpenAI API 真实调用（替换 mock 响应）
- [ ] 紫微斗数算法实现（当前为占位数据）
- [ ] 数据库真实读写（当前组件多为前端状态）
- [ ] 用户认证与报告关联
- [ ] 支付成功后的邮件通知
- [ ] 订阅管理（取消/升级/降级）
- [ ] 派安盈支付集成

---

## 本地运行

```bash
cd mingdao
npm run dev
```

**Phase 3 核心页面：**
- `/pricing` — 定价页
- `/reports/bazi_full` — 八字完整报告产品页
- `/reports/ziwei_full` — 紫微斗数报告
- `/reports/iching_deep` — 易经深度解读
- `/reports/relationship_report` — 感情专项报告
- `/reports/career_wealth_report` — 事业财运专项
- `/reports/couple_compatibility` — 双人合盘
- `/dashboard/reports` — 我的报告（需登录）
