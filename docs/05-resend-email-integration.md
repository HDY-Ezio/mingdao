# Resend 邮件服务集成指南
# Resend Email Service Integration Guide

## 概述

Mingdao 使用 **Resend** 作为邮件发送服务，配合 React Email 构建邮件模板。
本文档说明如何配置和使用 Resend 邮件服务。

---

## 目录

1. [Resend 账号注册与配置](#resend-账号注册与配置)
2. [API Key 配置](#api-key-配置)
3. [域名验证与 DKIM 设置](#域名验证与-dkim-设置)
4. [环境变量配置](#环境变量配置)
5. [邮件模板适配生产环境](#邮件模板适配生产环境)
6. [邮件发送代码说明](#邮件发送代码说明)
7. [订阅/退订链路验证](#订阅退订链路验证)
8. [监控与分析](#监控与分析)
9. [常见问题](#常见问题)

---

## Resend 账号注册与配置

### 1.1 注册账号

1. 访问 https://resend.com
2. 使用邮箱或 GitHub 注册
3. 验证邮箱地址

### 1.2 套餐选择

| 套餐 | 价格 | 月发送量 | 适用场景 |
|------|------|---------|---------|
| Free | $0 | 3,000 封 | 开发测试、MVP 早期 |
| Pro | $20/月 | 100,000 封 | 正式运营 |
| Scale | 自定义 | 1M+ | 大规模 |

> **建议**：MVP 阶段使用 Free 套餐，用户量上来后升级到 Pro。

---

## API Key 配置

### 2.1 创建 API Key

1. 登录 Resend Dashboard
2. 进入 **API Keys** 页面
3. 点击 **Create API Key**
4. 填写信息：
   - **Name**: `mingdao-production`（自定义）
   - **Permission**: Full access（或 Sending only，最小权限原则）
   - **Domain**: 选择你的发件域名
5. 点击 **Create**
6. **立即复制保存**（只显示一次）

### 2.2 权限说明

- **Full access**: 完整权限，可以管理域名、模板等
- **Sending only**: 只能发送邮件，推荐用于生产环境
- **Scheduling access**: 可以发送和计划邮件

> **最佳实践**: 生产环境使用 **Sending only** 权限。

---

## 域名验证与 DKIM 设置

### 3.1 添加域名

1. 进入 Resend Dashboard → **Domains**
2. 点击 **Add Domain**
3. 输入域名：`mingdao.space`（替换为你的域名）
4. 选择发件区域：**US East (N. Virginia)**（默认，延迟最低）
5. 点击 **Add**

### 3.2 DNS 记录配置

Resend 会提供 3 组 DNS 记录，需要在你的 DNS 服务商处添加：

#### 记录 1：SPF（TXT 记录）

```
主机记录: @
记录类型: TXT
记录值: v=spf1 include:sendalot.net ~all
```

> 注意：如果已有 SPF 记录，不要新建，而是合并两个 include。

#### 记录 2：DKIM（CNAME 记录）

```
主机记录: rs._domainkey
记录类型: CNAME
记录值: _dkim.resend.com
```

#### 记录 3：Return-Path（CNAME 记录）

```
主机记录: rp._resend
记录类型: CNAME
记录值: rp.resend.com
```

### 3.3 使用 Cloudflare 的注意事项

如果使用 Cloudflare 作为 DNS 提供商：

- **SPF / TXT 记录**: 直接添加，云图标设为灰色（DNS only）
- **DKIM CNAME**: 云图标设为灰色（DNS only），不要代理
- **Return-Path CNAME**: 云图标设为灰色（DNS only）

> **重要**：DKIM 和 Return-Path 的 CNAME 记录必须关闭代理（灰色云），
> 否则 Resend 无法正确验证。

### 3.4 验证域名

添加 DNS 记录后：

1. 回到 Resend Dashboard → Domains
2. 点击你的域名
3. 点击 **Verify** 或等待自动验证
4. 验证通过后状态变为 **Verified**

> DNS 传播可能需要几分钟到几小时。

---

## 环境变量配置

在 `.env.local` 或 Vercel Environment Variables 中配置：

```env
# Resend API Key（必需）
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 发件人邮箱（必需，必须使用验证过的域名）
RESEND_FROM_EMAIL=noreply@mingdao.space

# 发件人名称（可选）
RESEND_FROM_NAME=Mingdao 明道
```

---

## 邮件模板适配生产环境

### 5.1 当前邮件模板

项目中的邮件模板位于 `emails/` 目录：

| 模板文件 | 用途 | 触发时机 |
|----------|------|---------|
| `emails/welcome-email.tsx` | 欢迎邮件 | 用户注册后 |
| `emails/daily-fortune/daily-fortune-email.tsx` | 每日运势 | 每日定时发送 |

### 5.2 生产环境适配清单

- [ ] 修改发件人为生产域名
- [ ] 修改邮件中的链接指向生产环境 URL
- [ ] 替换 Logo 和品牌图片（如有）
- [ ] 检查邮件在各种客户端的显示效果
- [ ] 添加退订链接（必需，合规要求）
- [ ] 添加物理地址（CAN-SPAM 合规要求）

### 5.3 React Email 本地预览

```bash
# 启动邮件预览服务器
npm run email

# 访问 http://localhost:3000 查看模板
```

### 5.4 邮件测试

使用 Resend 的测试功能发送测试邮件：

```bash
# 通过 API 发送测试邮件（示例）
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@mingdao.space",
    "to": "test@example.com",
    "subject": "Test Email from Mingdao",
    "html": "<h1>Hello from Mingdao!</h1><p>This is a test email.</p>"
  }'
```

---

## 邮件发送代码说明

### 6.1 基础发送函数

项目中的邮件发送功能在以下位置：

- `src/lib/email-subscription.ts` — 订阅相关邮件
- API routes 中调用邮件服务

### 6.2 使用 Resend SDK

```typescript
import { Resend } from 'resend';
import WelcomeEmail from '../../../emails/welcome-email';

const resend = new Resend(process.env.RESEND_API_KEY);

// 发送欢迎邮件
async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'noreply@mingdao.space',
    to,
    subject: 'Welcome to Mingdao — Light Your Path',
    react: WelcomeEmail({ name }),
  });
}
```

### 6.3 批量发送（每日运势）

每日运势邮件建议使用批量发送 API 以提高效率：

```typescript
// 批量发送（最多 100 封/次）
await resend.batch.send([
  {
    from: 'fortune@mingdao.space',
    to: 'user1@example.com',
    subject: 'Your Daily Fortune — 今日运势',
    react: DailyFortuneEmail({ ... }),
  },
  // ... 更多收件人
]);
```

---

## 订阅/退订链路验证

### 7.1 订阅流程

```
用户输入邮箱 → /api/subscribe → 存入 email_subscriptions 表 → 发送确认邮件
                                                              ↓
                                                         欢迎邮件
```

**验证清单**：
- [ ] 订阅接口正常工作
- [ ] 邮箱格式验证
- [ ] 重复邮箱去重
- [ ] 自动生成退订 token
- [ ] 发送欢迎邮件

### 7.2 退订流程

```
邮件中的退订链接 → /api/unsubscribe?token=xxx → 标记 is_active = false
                                                              ↓
                                                         退订确认邮件
```

**验证清单**：
- [ ] 退订链接有效且安全（使用 token 而非 email）
- [ ] 退订后立即停止发送
- [ ] 退订确认页面友好
- [ ] 符合 CAN-SPAM / GDPR 要求
- [ ] 一封邮件中同时包含退订链接和"管理订阅"链接

### 7.3 List-Unsubscribe 头

建议添加 List-Unsubscribe 头，提高邮件送达率：

```typescript
await resend.emails.send({
  from: 'fortune@mingdao.space',
  to: user.email,
  subject: 'Your Daily Fortune',
  headers: {
    'List-Unsubscribe': `<https://mingdao.space/unsubscribe?token=${token}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  },
  react: DailyFortuneEmail({ ... }),
});
```

---

## 监控与分析

### 8.1 Resend Dashboard 监控

在 Resend Dashboard 中可以查看：

- **发送量**: 每日/每月发送邮件数
- **送达率**: 成功送达比例（目标 > 95%）
- **打开率**: 邮件打开比例（行业平均 20-30%）
- **点击率**: 链接点击比例
- **退信率**: 硬退信 + 软退信（目标 < 2%）
- **投诉率**: 垃圾邮件投诉（目标 < 0.1%）

### 8.2 关键指标监控

| 指标 | 健康范围 | 警告阈值 |
|------|---------|---------|
| 送达率 | > 95% | < 90% |
| 打开率 | 25-40% | < 15% |
| 点击率 | 3-8% | < 2% |
| 退订率 | < 0.5% | > 1% |
| 垃圾邮件投诉 | < 0.1% | > 0.3% |

### 8.3 告警设置

建议设置以下告警：

- 送达率骤降（日环比下降 > 10%）
- 退信率超过 2%
- 投诉率超过 0.1%

---

## 常见问题

### Q1: 邮件进了垃圾邮件文件夹怎么办？

**可能原因和解决方案**：

1. **域名未完全验证**
   - 检查 SPF、DKIM 记录是否正确配置
   - 在 Resend Dashboard 确认域名状态为 Verified

2. **发件域名声誉差**
   - 新域名需要预热（逐步增加发送量）
   - 避免大量发送到无效邮箱

3. **邮件内容触发垃圾邮件规则**
   - 避免使用 "free", "win", "money" 等敏感词
   - 保持文本/图片比例合理
   - 添加退订链接

4. **发送频率过高**
   - 控制每日发送频率
   - 给用户选择发送频率（每日/每周）

### Q2: 邮件发送失败，提示 "from address not verified"

**原因**: 使用了未验证的发件域名或邮箱

**解决**:
1. 在 Resend 中验证发件域名
2. 确保 `RESEND_FROM_EMAIL` 的域名与验证的域名一致
3. 不能使用 gmail/outlook 等公共邮箱作为发件人

### Q3: 如何预热新域名？

新域名需要逐步增加发送量以建立声誉：

| 天数 | 日发送量 |
|------|---------|
| 1-3 | 50 |
| 4-7 | 100 |
| 8-14 | 500 |
| 15-21 | 1000 |
| 22+ | 逐步增加 |

> 只发送给真实订阅用户，不要购买邮件列表。

### Q4: GDPR / CAN-SPAM 合规要求

必须遵守的要求：

1. **明确的发件人身份**
2. **准确的主题行**
3. **物理地址**（邮件底部）
4. **退订链接**
5. **及时处理退订**（10 天内）

---

## 相关文件

| 文件路径 | 说明 |
|----------|------|
| `emails/welcome-email.tsx` | 欢迎邮件模板 |
| `emails/daily-fortune/daily-fortune-email.tsx` | 每日运势模板 |
| `emails/layout.tsx` | 邮件布局组件 |
| `emails/theme.ts` | 邮件主题配置 |
| `src/lib/email-subscription.ts` | 订阅逻辑 |
| `src/app/api/subscribe/route.ts` | 订阅 API |
| `src/app/api/unsubscribe/route.ts` | 退订 API |

---

**文档版本**: v1.0  
**最后更新**: 2025-01
