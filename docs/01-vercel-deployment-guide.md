# Vercel 部署指南
# Mingdao Vercel Deployment Guide

## 目录

1. [准备工作](#准备工作)
2. [部署步骤](#部署步骤)
3. [环境变量配置](#环境变量配置)
4. [域名绑定](#域名绑定)
5. [DNS 配置](#dns-配置)
6. [部署验证](#部署验证)
7. [常见问题](#常见问题)

---

## 准备工作

### 1.1 前置条件

- [ ] Vercel 账号（免费版即可开始）
- [ ] GitHub/GitLab/Bitbucket 账号（代码托管）
- [ ] Supabase 项目（已配置好数据库）
- [ ] 域名（可选，也可使用 Vercel 提供的子域名）

### 1.2 代码准备

确保代码已推送到 Git 仓库，且包含以下关键文件：

- `package.json` — 项目依赖和脚本
- `next.config.ts` — Next.js 配置
- `.env.example` — 环境变量模板
- `supabase/migrations/` — 数据库迁移文件

---

## 部署步骤

### 方式一：通过 Vercel Dashboard 部署（推荐新手）

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "Add New" → "Project"
   - 选择你的 Mingdao 代码仓库
   - 点击 "Import"

3. **配置项目**
   - **Project Name**: `mingdao`（自定义）
   - **Framework Preset**: Next.js（Vercel 会自动检测）
   - **Root Directory**: 保持默认（如果代码在根目录）
   - **Build Command**: `next build`（自动填充）
   - **Output Directory**: `.next`（自动填充）
   - **Install Command**: `npm install`（自动填充）

4. **配置环境变量**
   - 展开 "Environment Variables" 部分
   - 按照 [环境变量配置](#环境变量配置) 一节逐一添加
   - Environment 选择 "Production" + "Preview" + "Development"

5. **点击 Deploy**
   - 等待首次构建完成（通常 2-5 分钟）
   - 构建成功后会自动分配一个 `*.vercel.app` 域名

### 方式二：通过 Vercel CLI 部署

```bash
# 1. 全局安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在项目根目录执行
cd mingdao
vercel

# 4. 按提示回答：
# ? Set up and deploy "~/mingdao"? [Y/n] Y
# ? Which scope do you want to deploy to? <你的账号>
# ? Link to existing project? [y/N] N
# ? What's your project's name? mingdao
# ? In which directory is your code located? ./
# ? Want to modify these settings? [y/N] N

# 5. 配置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... 添加其他环境变量

# 6. 生产部署
vercel --prod
```

---

## 环境变量配置

在 Vercel Dashboard → Project → Settings → Environment Variables 中添加：

| 变量名 | 说明 | 必需 | 作用域 |
|--------|------|------|--------|
| `NEXT_PUBLIC_APP_URL` | 应用的公开 URL | ✅ | 全部 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ | 全部 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ | 全部 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 | ✅ | Production |
| `OPENAI_API_KEY` | OpenAI API Key | ✅ | 全部 |
| `OPENAI_MODEL` | AI 模型（默认 gpt-4o-mini） | ❌ | 全部 |
| `RESEND_API_KEY` | Resend 邮件 API Key | ✅ | 全部 |
| `RESEND_FROM_EMAIL` | 发件人邮箱 | ✅ | 全部 |
| `RESEND_FROM_NAME` | 发件人名称 | ❌ | 全部 |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal 客户端 ID | ✅ | 全部 |
| `PAYPAL_CLIENT_SECRET` | PayPal 客户端密钥 | ✅ | Production |
| `PAYPAL_MODE` | PayPal 模式（sandbox/live） | ✅ | 全部 |
| `PAYPAL_WEBHOOK_ID` | PayPal Webhook ID | ✅ | Production |
| `ADMIN_EMAILS` | 管理员邮箱列表 | ❌ | 全部 |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL（用于 sitemap） | ✅ | 全部 |

> **注意**：以 `NEXT_PUBLIC_` 开头的变量会暴露给客户端浏览器，
> 不要在其中存放任何敏感信息（如密钥、密码）。

### 批量导入环境变量

可以将 `.env.example` 复制并填写后，通过 Vercel CLI 批量导入：

```bash
# 从 .env.local 文件导入所有变量（Production 环境）
cat .env.local | grep -v '^#' | grep -v '^$' | while read line; do
  key="${line%%=*}"
  value="${line#*=}"
  echo "$value" | vercel env add "$key" production
done
```

---

## 域名绑定

### 5.1 添加自定义域名

1. 进入 Vercel Dashboard → Project → Settings → Domains
2. 点击 "Add"
3. 输入你的域名（如 `mingdao.space`）
4. 点击 "Add" 确认

### 5.2 配置 www 重定向（可选）

如果添加了 `mingdao.space`，Vercel 会自动建议添加 `www.mingdao.space` 并重定向到主域名。

---

## DNS 配置

### 方式一：使用 Vercel Nameservers（推荐）

将域名的 Nameserver 改为 Vercel 提供的，由 Vercel 全权管理 DNS：

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

在你的域名注册商处修改 Nameserver，修改后等待生效（可能需要几小时到 48 小时）。

### 方式二：使用你自己的 DNS 提供商

如果你使用 Cloudflare、Namecheap 等 DNS 服务，添加以下记录：

| 类型 | 主机记录 | 值 | TTL |
|------|---------|-----|-----|
| `A` | `@` | `76.76.21.21` | 自动 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 自动 |

> `76.76.21.21` 是 Vercel 的 Anycast IP 地址。
> 如果你的主域名是 `mingdao.space`，`@` 指向 A 记录，`www` 指向 CNAME。

### 使用 Cloudflare 代理（可选）

如果使用 Cloudflare，建议：

- 开启 **橙色云**（代理模式），获得 CDN 和 DDoS 防护
- SSL/TLS 设置为 **Full (strict)**
- 开启 **Auto Minify**（HTML/CSS/JS）
- 开启 **Brotli** 压缩
- 配置 **Page Rules**：`*mingdao.space/*` → Cache Level: Cache Everything

---

## 部署验证

### 7.1 基础验证清单

- [ ] 首页正常加载（无白屏、无控制台错误）
- [ ] 所有导航链接可点击
- [ ] 图片正常显示
- [ ] 字体正确加载
- [ ] 响应式布局正常（手机/平板/桌面）

### 7.2 功能验证清单

- [ ] 注册/登录流程正常（Supabase Auth）
- [ ] 八字排盘功能正常
- [ ] 紫微斗数排盘正常
- [ ] 易经起卦正常
- [ ] PayPal 支付流程（沙盒模式测试）
- [ ] 邮件订阅功能
- [ ] AI 对话功能
- [ ] 用户仪表盘

### 7.3 性能检测

使用以下工具检测性能：

- **Lighthouse**: Chrome DevTools → Lighthouse
- **WebPageTest**: https://webpagetest.org
- **Vercel Analytics**: Vercel Dashboard → Analytics

**目标指标**：
- LCP（最大内容绘制）< 2.5s
- FID（首次输入延迟）< 100ms
- CLS（累计布局偏移）< 0.1

---

## 常见问题

### Q1: 构建失败，提示 "Module not found"

**原因**: 本地 node_modules 有但 package.json 中没有声明

**解决**:
```bash
# 检查并安装缺失的依赖
npm install <missing-package>
```

### Q2: Supabase 认证不工作

**原因**: 可能是环境变量未正确配置，或 Supabase 的 URL/Key 错误

**解决**:
1. 确认环境变量在 Vercel 中已正确设置
2. 重新部署（环境变量修改后需要重新部署才能生效）
3. 检查 Supabase Dashboard → Authentication → URL Configuration 中的 Site URL

### Q3: 图片不显示

**原因**: next.config.ts 中的 remotePatterns 配置问题

**解决**: 确认 `next.config.ts` 中的 images.remotePatterns 包含你的图片域名。

### Q4: 环境变量修改后不生效

**原因**: Vercel 的环境变量在构建时注入，修改后需要重新部署

**解决**:
- 在 Vercel Dashboard 中点击 "Redeploy"
- 或执行 `vercel --prod` 重新部署

### Q5: PayPal Webhook 不工作

**原因**: Webhook URL 或 Webhook ID 配置错误

**解决**:
1. 确认 PayPal Developer Dashboard 中的 Webhook URL 为 `https://yourdomain.com/api/paypal/webhook`
2. 确认环境变量 `PAYPAL_WEBHOOK_ID` 正确
3. 在 PayPal Dashboard 中使用 "Test Webhook" 功能测试

### Q6: 邮件发送失败

**原因**: Resend API Key 未配置或发件域名未验证

**解决**:
1. 确认 `RESEND_API_KEY` 环境变量正确
2. 在 Resend Dashboard 中验证发件域名
3. 检查 DNS 记录（DKIM、SPF）是否正确配置

---

## 附录：Vercel 部署架构图

```
                    ┌─────────────────┐
                    │   User's DNS    │
                    │  (Cloudflare)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Vercel Edge    │
                    │  Network (CDN)  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
     ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
     │  Static     │  │  Serverless │  │  Edge       │
     │  Assets     │  │  Functions  │  │  Middleware │
     │  (CDN Cache)│  │  (API Routes)│ │  (Auth)     │
     └─────────────┘  └──────┬──────┘  └─────────────┘
                             │
                    ┌────────▼────────┐
                    │    Supabase     │
                    │  (DB + Auth)    │
                    └─────────────────┘
```

---

**文档版本**: v1.0  
**最后更新**: 2025-01
