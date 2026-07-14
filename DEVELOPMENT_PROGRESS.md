# 明道 MINGDAO - 开发进度说明

## Phase 1: 项目初始化 + 设计系统 + 首页开发 ✅ 完成

### 完成情况总览

| 模块 | 状态 | 说明 |
|------|------|------|
| 项目初始化 | ✅ 完成 | Next.js 16 + TypeScript + Tailwind CSS 4 + ESLint |
| 设计系统 | ✅ 完成 | 东方水墨风格 + 四象二十八星宿体系 |
| 斜对角双背景 | ✅ 完成 | 古籍书封风格，响应式适配 |
| 首页开发 | ✅ 完成 | Hero + 三大服务 + 为什么选我们 + 用户评价 + FAQ |
| 基础页面 | ✅ 完成 | Services / About / Blog / Login / Register |
| 邮件模板 | ✅ 完成 | React Email 风格 + 三层降级方案 + 季节主题 |
| 星宿日历系统 | ✅ 完成 | 二十八宿日轮换 + 四象季节切换 |

---

## Phase 2: 用户系统 + 八字排盘模块 ✅ 完成

### 完成情况总览

| 模块 | 状态 | 说明 |
|------|------|------|
| Supabase Auth 集成 | ✅ 完成 | 邮箱密码登录/注册 + OAuth + 路由保护 |
| 用户状态管理 | ✅ 完成 | Zustand store + 导航栏用户菜单 |
| 用户仪表盘 | ✅ 完成 | Dashboard 基础框架 + 排盘记录 |
| 八字排盘算法 | ✅ 完成 | 纯 TypeScript 实现，1900-2100 年范围 |
| 八字输入页 | ✅ 完成 | 罗盘时辰选择器 + 干支同步显示 |
| 八字结果报告页 | ✅ 完成 | 中文原字+英文注释双轨制 |
| 数据库表设计 | ✅ 完成 | 6张核心表 + RLS 策略 |
| 书法字体系统 | ✅ 完成 | Ma Shan Zheng 楷书字体 |

---

### 2.1 Supabase 用户系统 ✅

**技术方案：**
- 客户端：`@supabase/ssr` 的 `createBrowserClient`
- 服务端：`@supabase/ssr` 的 `createServerClient` + cookies
- 路由保护：`middleware.ts` 官方方案
- 状态管理：Zustand store

**核心文件：**
```
src/lib/supabase/
├── client.ts          # 浏览器端 Supabase 客户端
└── server.ts          # 服务端 Supabase 客户端
src/middleware.ts      # 路由保护中间件
src/store/useAuthStore.ts  # 用户状态管理
```

**功能特性：**
- ✅ 邮箱密码登录/注册
- ✅ OAuth 登录（Google / GitHub）
- ✅ 忘记密码重置
- ✅ 邮箱验证
- ✅ 路由保护（`/dashboard` 等需登录）
- ✅ 已登录用户重定向（已登录不显示登录页）
- ✅ 导航栏用户菜单（头像 + 下拉菜单）
- ✅ 注册默认加入邮件订阅

---

### 2.2 八字排盘算法 ✅

**核心文件：**
```
src/lib/
├── lunar-calendar.ts    # 农历转换 + 天干地支基础
└── bazi-calculator.ts   # 八字排盘核心算法
```

**已实现功能：**

| 功能 | 说明 |
|------|------|
| 阳历转农历 | 支持 1900-2100 年，含闰月处理 |
| 真太阳时 | 基于经度调整（默认120°E东八区） |
| 年柱计算 | 基于农历年份，天干地支 |
| 月柱计算 | 五虎遁法，正月起寅 |
| 日柱计算 | 基准日推算（2000.1.1=戊午日） |
| 时柱计算 | 五鼠遁法，23点起子时 |
| 五行分布 | 天干+地支本气+藏干权重计算 |
| 十神计算 | 以日主为基准，生克关系 |
| 藏干 | 本气/中气/余气三层 |
| 纳音 | 60甲子纳音表 |
| 日主强弱 | 得令+得地+得势综合评分 |
| 喜用神 | 基于身强/身弱推断 |
| 大运计算 | 阳男阴女顺行，阴男阳女逆行 |
| 模板化解码 | 性格/事业/感情/财运/健康 |

**算法精度：**
- 农历转换：基于标准农历数据表，1900-2100 年准确
- 日柱：以 2000年1月1日=戊午日 为基准推算
- 月柱：基于农历月份 + 五虎遁法
- 时柱：基于小时 + 五鼠遁法

---

### 2.3 八字输入页 `/bazi` ✅

**设计亮点：**

1. **罗盘时辰选择器** 🎯
   - 十二时辰环绕圆形排列
   - 支持拖拽旋转/点击选择
   - 选中高亮 + 朱砂色指示
   - 中心显示时辰名+时间段
   - 移动端友好的触摸交互

2. **干支同步显示**
   - 选完日期后实时显示月柱/日柱干支
   - 中文大字 + 拼音注释
   - 金色边框宣纸质感

3. **表单字段：**
   - 姓名（选填）
   - 性别（男/女，乾造/坤造）
   - 出生日期（日期选择器）
   - 出生时间（罗盘+精确时间双输入）
   - 出生地点（文本输入）

---

### 2.4 八字结果报告页 `/bazi/result` ✅

**核心设计：中文原字 + 英文注释双轨制**

```
┌─────────┬─────────┬─────────┬─────────┐
│  年柱   │  月柱   │  日柱   │  时柱   │
│  甲子   │  辛未   │  丙午   │  壬辰   │  ← 中文大字号（楷书字体）
│Jiǎ Zǐ   │Xīn Wèi  │Bǐng Wǔ  │Rén Chén │  ← 拼音
│Wood Rat │Metal Goat│Fire Horse│Water Dragon│ ← 英文元素+生肖
│ 正印    │ 正财    │ 日主    │ 七杀    │  ← 十神中文
│Direct Res│Direct W│—       │Seven Kill│ ← 十神英文
└─────────┴─────────┴─────────┴─────────┘
```

**页面结构：**
1. **顶部信息区** — 基本信息 + 农历年份 + 纳音
2. **四柱排盘区** — 核心命盘，大字中文+小字英文
3. **五行分布** — 柱状图 + 太极图分布可视化
4. **日主强弱** — 强弱指示器 + 喜用神/忌神
5. **免费解读** — 性格/事业/感情/财运/健康
6. **升级引导** — 完整报告 $19.99 + AI 对话
7. **底部操作** — 新建排盘 / 保存排盘

**视觉风格：**
- 宣纸质感卡片
- 金色装饰边框
- 楷书书法字体（Ma Shan Zheng）
- 朱砂色强调（日主/喜用）
- 玉石青色辅助

---

### 2.5 数据库表设计 ✅

**SQL 迁移文件：** `supabase/migrations/001_initial_schema.sql`

| 表名 | 说明 |
|------|------|
| `users` | 用户资料表（扩展 auth.users） |
| `bazi_readings` | 八字排盘记录表 |
| `subscriptions` | 订阅记录表 |
| `chat_messages` | AI对话记录表 |
| `orders` | 订单记录表 |
| `email_subscriptions` | 邮件订阅表 |

**安全策略：**
- 所有表启用 Row Level Security (RLS)
- 用户只能访问自己的数据
- 新用户注册自动创建 profile（触发器）
- 自动更新 `updated_at` 时间戳

---

### 2.6 书法字体系统 ✅

**字体配置：**
- **主标题**：Cormorant Garamond（英文衬线，东方气质）
- **正文**：Inter（现代清晰）
- **书法字**：Ma Shan Zheng（马善政楷书，排盘专用）
- **备用书法**：ZCOOL XiaoWei

**使用方式：**
```tsx
<span style={{ fontFamily: 'var(--font-kaishu), serif' }}>甲子</span>
```

应用场景：
- 排盘中的天干地支大字
- 十神、五行、藏干等命理术语
- 页面标题中的中文点缀
- 时辰选择器中的时辰名

---

## 项目结构总览

```
mingdao/
├── src/
│   ├── app/
│   │   ├── bazi/              # 八字排盘
│   │   │   ├── page.tsx       # 输入页（罗盘选择器）
│   │   │   └── result/
│   │   │       └── page.tsx   # 结果报告页
│   │   ├── dashboard/         # 用户仪表盘
│   │   │   └── page.tsx
│   │   ├── auth/callback/     # OAuth 回调
│   │   │   └── page.tsx
│   │   ├── login/             # 登录页
│   │   ├── register/          # 注册页
│   │   ├── layout.tsx         # 根布局（含书法字体）
│   │   └── globals.css        # 全局样式+设计系统
│   ├── components/
│   │   ├── bazi/
│   │   │   ├── shichen-wheel.tsx    # 时辰罗盘选择器
│   │   │   └── bazi-chart.tsx       # 排盘展示组件
│   │   ├── layout/
│   │   │   ├── navbar.tsx     # 导航栏（含用户菜单）
│   │   │   └── footer.tsx
│   │   └── ui/                # 基础UI组件
│   ├── lib/
│   │   ├── bazi-calculator.ts # 八字排盘算法
│   │   ├── lunar-calendar.ts  # 农历转换
│   │   ├── supabase/          # Supabase 客户端
│   │   ├── star-calendar.ts   # 星宿日历
│   │   └── utils.ts
│   ├── store/
│   │   └── useAuthStore.ts    # 用户状态管理
│   └── middleware.ts          # 路由保护中间件
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── emails/                    # 邮件模板
├── package.json
└── tsconfig.json
```

---

## Next Steps — 下一步计划

### Phase 3: AI对话 + 支付系统
- [ ] AI对话系统（问道长功能）
- [ ] 支付集成（Stripe）
- [ ] 八字完整报告（付费版）
- [ ] 紫微斗数排盘
- [ ] 易经占卜交互

### Phase 4: 内容与增长
- [ ] 博客文章内容（SEO）
- [ ] 每日运势邮件自动化
- [ ] 分享功能
- [ ] 推荐系统
- [ ] 多语言支持

### Phase 5: 优化与上线
- [ ] 用户测试与迭代
- [ ] 性能优化
- [ ] SEO 完善
- [ ] Vercel 部署
- [ ] 域名与品牌邮箱配置

---

## 本地运行说明

```bash
cd mingdao
npm install
cp .env.example .env.local
# 编辑 .env.local 填入 Supabase 配置
npm run dev
# 访问 http://localhost:3000
```

**核心页面：**
- `/` — 首页
- `/bazi` — 八字排盘输入页
- `/bazi/result` — 八字排盘结果页（需传参：?date=1990-01-15&time=12:00&gender=male）
- `/login` — 登录
- `/register` — 注册
- `/dashboard` — 用户仪表盘（需登录）
