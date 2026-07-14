# Phase 5: 部署上线 + 冷启动准备
# Deployment & Cold Launch Preparation

## 完成状态：✅ 已完成

---

## 交付清单总览

| 类别 | 交付物 | 状态 | 位置 |
|------|--------|------|------|
| **部署配置** | Vercel 部署指南 | ✅ | `docs/01-vercel-deployment-guide.md` |
| | PayPal 生产环境配置 | ✅ | `docs/02-paypal-production-guide.md` |
| | next.config.ts 完善 | ✅ | `next.config.ts` |
| | .env.example 完善 | ✅ | `.env.example` |
| **生产环境配置** | Supabase 生产环境检查表 | ✅ | `docs/03-supabase-production-checklist.md` |
| | 生产环境环境变量清单 | ✅ | `docs/04-production-env-variables.md` |
| | 数据库初始化 SQL 脚本 | ✅ | `supabase/init_full_schema.sql` |
| **邮件服务对接** | Resend 邮件服务集成指南 | ✅ | `docs/05-resend-email-integration.md` |
| **SEO 优化** | sitemap.xml 生成 | ✅ | `src/app/sitemap.ts` |
| | robots.txt 生成 | ✅ | `src/app/robots.ts` |
| | 全局 metadata 增强 | ✅ | `src/app/layout.tsx` |
| | SEO 优化策略文档 | ✅ | `docs/06-seo-optimization-guide.md` |
| **冷启动内容** | 首批 10 篇博客选题清单 | ✅ | `docs/07-blog-content-plan.md` |
| | 冷启动策略文档 | ✅ | `docs/08-cold-start-strategy.md` |
| | ProductHunt 发布准备清单 | ✅ | `docs/09-producthunt-launch-checklist.md` |
| **上线前 Checklist** | 完整上线检查清单 + SOP | ✅ | `docs/10-pre-launch-checklist.md` |

---

## 详细交付说明

### 一、部署配置（Vercel）

#### 1. Vercel 部署指南 (`docs/01-vercel-deployment-guide.md`)
- Vercel Dashboard 和 CLI 两种部署方式
- 完整的环境变量配置表
- 域名绑定和 DNS 配置（含 Cloudflare 配置）
- 部署验证清单
- 常见问题排查

#### 2. PayPal 生产环境配置指南 (`docs/02-paypal-production-guide.md`)
- 沙盒模式回顾
- 正式环境前置条件
- 详细的切换步骤
- Webhook 配置和订阅事件列表
- 生产环境验证方法
- 安全最佳实践

#### 3. next.config.ts 完善
- 添加 `poweredByHeader: false`（安全）
- 添加 `compress: true`（性能）
- 添加 `generateEtags: true`（缓存）
- 保留了安全 Header 的注释模板

#### 4. .env.example 完善
- 从 10 个变量扩充到 18 个变量
- 按功能分类组织
- 添加详细注释说明
- 新增：SUPABASE_SERVICE_ROLE_KEY、OPENAI_MODEL、RESEND_FROM_EMAIL、RESEND_FROM_NAME、NEXT_PUBLIC_SITE_URL 等

---

### 二、生产环境配置

#### 1. Supabase 生产环境检查表 (`docs/03-supabase-production-checklist.md`)
- 项目基础配置检查
- 数据库 Schema 完整性验证（21 张表）
- 认证配置（Email Provider、URL）
- RLS 策略验证（逐表检查）
- 存储桶配置
- 安全配置
- 监控与备份
- 性能优化

#### 2. 生产环境环境变量清单 (`docs/04-production-env-variables.md`)
- 18 个环境变量的详细说明
- 每个变量的：说明、类型、获取路径、安全性、示例值
- Vercel 三种配置方法
- 安全最佳实践
- 快速配置模板

#### 3. 数据库初始化 SQL 脚本 (`supabase/init_full_schema.sql`)
- 单文件完整脚本，从零初始化
- 幂等设计，可重复执行
- 包含：扩展、公共函数、21 张表、索引、触发器
- 种子数据：6 款产品、2 档会员、28 星宿、7 政、4 余
- 完整的 RLS 策略（所有表）
- 验证查询（执行后可检查）

---

### 三、邮件服务对接

#### Resend 邮件服务集成指南 (`docs/05-resend-email-integration.md`)
- Resend 账号注册与套餐选择
- API Key 创建与权限管理
- 域名验证 + DKIM + SPF 完整配置
- Cloudflare 特殊注意事项
- 邮件模板生产环境适配清单
- React Email 本地预览
- 订阅/退订链路验证
- List-Unsubscribe 头配置
- 监控指标（送达率、打开率、退订率等）
- 常见问题排查

---

### 四、SEO 优化

#### 1. sitemap.xml (`src/app/sitemap.ts`)
- 14 个核心页面
- 包含 priority 和 changeFrequency
- 动态获取站点 URL

#### 2. robots.txt (`src/app/robots.ts`)
- 通用爬虫规则
- 特别的 Bingbot / Googlebot 规则
- 禁止索引的路径（API、仪表盘、报告结果页）
- Sitemap 指向

#### 3. 全局 metadata 增强 (`src/app/layout.tsx`)
- Title 优化（增加关键词）
- Description 优化（更丰富的关键词）
- Keywords 扩充（从 9 个到 14 个）
- 添加 metadataBase
- 添加 robots 配置
- 添加 canonical URL
- Open Graph 完善（添加 images）
- Twitter Card 完善
- Icons / manifest 配置
- Viewport / themeColor 配置
- Verification 占位（Google/Bing）

#### 4. SEO 优化策略文档 (`docs/06-seo-optimization-guide.md`)
- 技术 SEO 优化清单
- 各页面 Title & Description 建议
- 结构化数据（Schema.org）完整方案
  - Organization + WebSite（首页）
  - Product（报告页面）
  - Article（观星台/博客）
  - FAQPage（定价/FAQ）
- 观星台页面 SEO 增强方案
- Bing SEO 着陆页优化建议
- 内容 SEO 策略（4 大内容支柱）
- 外链建设策略
- SEO 工具与 KPI

---

### 五、冷启动内容准备

#### 1. 首批 10 篇博客选题 (`docs/07-blog-content-plan.md`)
- 内容策略和目标读者画像
- 10 篇详细选题，每篇包含：
  - 中英文标题
  - 摘要
  - 内容大纲
  - 目标关键词
  - 预估字数
  - 优先级
  - 转化目标
- 6 周发布计划
- 标准文章结构模板

**10 篇选题概览**：
1. What Is Bazi? — 八字入门（旗舰文）⭐⭐⭐⭐⭐
2. How to Read Your Bazi Chart — 八字解读教程 ⭐⭐⭐⭐⭐
3. Zi Wei Dou Shu Explained — 紫微斗数入门 ⭐⭐⭐⭐
4. The I Ching Guide — 易经入门 ⭐⭐⭐⭐
5. Chinese Zodiac vs Bazi — 生肖 vs 八字 ⭐⭐⭐⭐⭐
6. The Five Elements — 五行详解 ⭐⭐⭐⭐
7. Bazi Compatibility — 八字合婚 ⭐⭐⭐⭐
8. Your Career Destiny in Bazi — 事业财运 ⭐⭐⭐⭐
9. Daoist Wisdom & Astrology — 道家哲学 ⭐⭐⭐
10. The 28 Lunar Mansions — 二十八星宿 ⭐⭐⭐

#### 2. 冷启动策略文档 (`docs/08-cold-start-strategy.md`)
- 3 个月和 6 个月目标
- 详细的用户画像（灵性探索者）
- 渠道优先级矩阵
- Bing SEO 详细策略（关键词 + 执行计划）
- Reddit 运营策略（7 个目标社区 + 内容类型）
- Quora 内容策略（找问题 + 回答结构 + 引流）
- 海外社区矩阵（Medium/Substack/Twitter/Pinterest/TikTok）
- 内容复用飞轮模型
- 详细的 3 个月时间表
- 关键指标与转化漏斗
- 复盘节奏

#### 3. ProductHunt 发布准备清单 (`docs/09-producthunt-launch-checklist.md`)
- 发布目标（200+ Upvotes, Top 5）
- 最佳发布时间（PST 时区换算）
- T-30 天 / T-7 天 / T-1 天准备清单
- 发布当天分时行动计划
- 发布后一周跟进
- 完整素材清单
- 创始人评论模板
- Upvote 获取策略（合法方式）
- 常见问题

---

### 六、上线前 Checklist

#### 完整上线检查清单 + SOP (`docs/10-pre-launch-checklist.md`)

**功能验收**（10 大模块）：
- 用户系统（注册/登录/登出/路由保护）
- 八字排盘（输入/计算/结果）
- 紫微斗数（命盘生成/显示/报告）
- 易经起卦（起卦方式/计算/解读）
- AI 对话（界面/功能/深度问道）
- 支付系统（流程/Webhook/报告解锁）
- 邮件系统（欢迎/每日运势/订阅退订）
- 用户仪表盘
- 内容页面（首页/观星台/关于/服务/定价）
- 响应式测试（5 种尺寸）

**安全检查**（6 大类）：
- 认证与授权
- 数据安全（RLS、加密、输入验证）
- API 安全（鉴权、限流、Webhook）
- 环境变量与密钥管理
- 支付安全
- 其他（HTTPS、安全 Header、错误信息）

**性能优化建议**：
- 前端性能（图片/字体/代码/渲染）
- 后端性能（数据库/缓存/CDN）
- Core Web Vitals 目标
- 监控工具

**上线步骤 SOP**：
- 上线前 24 小时
- 上线前 1 小时
- 上线执行（30 分钟 5 步骤）
- 上线后 2 小时
- 上线后 24 小时

**回滚预案**：
- 触发条件
- 详细回滚步骤
- 数据库回滚

**上线后监控**：
- 实时监控指标
- 每日检查清单
- 每周复盘

---

## 新增/修改文件统计

### 新增文件（14 个）

| 路径 | 类型 | 说明 |
|------|------|------|
| `src/app/sitemap.ts` | 代码 | Sitemap 生成 |
| `src/app/robots.ts` | 代码 | Robots.txt 生成 |
| `supabase/init_full_schema.sql` | SQL | 完整数据库初始化脚本 |
| `docs/01-vercel-deployment-guide.md` | 文档 | Vercel 部署指南 |
| `docs/02-paypal-production-guide.md` | 文档 | PayPal 生产环境配置 |
| `docs/03-supabase-production-checklist.md` | 文档 | Supabase 生产环境检查表 |
| `docs/04-production-env-variables.md` | 文档 | 生产环境环境变量清单 |
| `docs/05-resend-email-integration.md` | 文档 | Resend 邮件服务集成 |
| `docs/06-seo-optimization-guide.md` | 文档 | SEO 优化策略指南 |
| `docs/07-blog-content-plan.md` | 文档 | 首批 10 篇博客选题 |
| `docs/08-cold-start-strategy.md` | 文档 | 冷启动策略 |
| `docs/09-producthunt-launch-checklist.md` | 文档 | ProductHunt 发布清单 |
| `docs/10-pre-launch-checklist.md` | 文档 | 上线前完整 Checklist + SOP |
| `PHASE5_PROGRESS.md` | 文档 | 本文件 |

### 修改文件（3 个）

| 路径 | 修改内容 |
|------|---------|
| `next.config.ts` | 添加生产环境优化配置 |
| `.env.example` | 扩充到 18 个变量，详细分类注释 |
| `src/app/layout.tsx` | 增强 metadata、OG、robots、canonical 等 |

---

## 后续建议

### Phase 5 完成后可进行的工作

1. **实际部署验证**
   - 按 Vercel 部署指南进行真实部署
   - 运行生产环境检查清单
   - 进行完整的端到端测试

2. **内容创作执行**
   - 按博客选题清单开始写文章
   - 先完成 4-5 篇种子内容
   - 同步进行社区账号预热

3. **产品打磨**
   - 收集真实用户反馈
   - 优化核心转化漏斗
   - 完善报告内容质量

4. **增长验证**
   - 执行冷启动策略
   - 验证渠道效果
   - 找到 PMF 后加大投入

---

**Phase 5 状态**: ✅ Complete  
**完成时间**: 2025-01  
**下一个阶段**: 实际部署 & 冷启动执行
