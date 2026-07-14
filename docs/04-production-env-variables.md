# 生产环境环境变量清单
# Production Environment Variables

## 概述

本文档列出 Mingdao 项目生产环境所需的全部环境变量，按功能分类，包含详细说明和示例值。

---

## 目录

1. [环境变量总览](#环境变量总览)
2. [应用基础配置](#应用基础配置)
3. [Supabase 配置](#supabase-配置)
4. [OpenAI 配置](#openai-配置)
5. [Resend 邮件配置](#resend-邮件配置)
6. [PayPal 配置](#paypal-配置)
7. [管理配置](#管理配置)
8. [可选配置](#可选配置)
9. [Vercel 环境变量配置方法](#vercel-环境变量配置方法)

---

## 环境变量总览

| 分类 | 数量 | 必需 |
|------|------|------|
| 应用基础 | 2 | 2 |
| Supabase | 3 | 3 |
| OpenAI | 2 | 1 |
| Resend | 3 | 3 |
| PayPal | 4 | 4 |
| 管理 | 1 | 0 |
| 可选 | 3 | 0 |
| **合计** | **18** | **13** |

---

## 应用基础配置

### `NEXT_PUBLIC_APP_URL`

- **说明**: 应用的公开 URL，用于邮件链接、OAuth 重定向等
- **必需**: ✅
- **类型**: string
- **示例**: `https://mingdao.space`
- **作用域**: Production / Preview / Development
- **注意**: 不要包含末尾的斜杠

```
NEXT_PUBLIC_APP_URL=https://mingdao.space
```

### `NODE_ENV`

- **说明**: Node.js 运行环境
- **必需**: ❌（Vercel 自动设置）
- **类型**: string
- **可选值**: `development`, `production`, `test`
- **默认**: `production`（Vercel 自动设置）

```
NODE_ENV=production
```

---

## Supabase 配置

### `NEXT_PUBLIC_SUPABASE_URL`

- **说明**: Supabase 项目 URL
- **必需**: ✅
- **类型**: string
- **获取路径**: Supabase Dashboard → Project Settings → API → Project URL
- **作用域**: 全部环境
- **安全性**: 公开（可在客户端暴露）

```
NEXT_PUBLIC_SUPABASE_URL=https://oqiwcisjpclimeckjazg.supabase.co
```

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- **说明**: Supabase 匿名公钥，用于客户端连接
- **必需**: ✅
- **类型**: string
- **获取路径**: Supabase Dashboard → Project Settings → API → anon public
- **作用域**: 全部环境
- **安全性**: 公开（安全暴露，受 RLS 约束）

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### `SUPABASE_SERVICE_ROLE_KEY`

- **说明**: Supabase 服务角色密钥，用于服务端管理操作（绕过 RLS）
- **必需**: ✅
- **类型**: string
- **获取路径**: Supabase Dashboard → Project Settings → API → service_role
- **作用域**: Production 仅
- **安全性**: ⚠️ **最高机密**，绝不能暴露给客户端
- **使用场景**: Webhook 处理、管理员操作、批量任务

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## OpenAI 配置

### `OPENAI_API_KEY`

- **说明**: OpenAI API 密钥，用于 AI 对话和报告生成
- **必需**: ✅
- **类型**: string
- **获取路径**: https://platform.openai.com/api-keys
- **作用域**: Production 仅
- **安全性**: ⚠️ 机密，仅服务端使用
- **费用**: 按调用量计费

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### `OPENAI_MODEL`

- **说明**: 使用的 AI 模型
- **必需**: ❌
- **类型**: string
- **默认**: `gpt-4o-mini`
- **可选值**: `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`
- **作用域**: 全部环境
- **费用参考**: 
  - gpt-4o-mini: $0.15 / 1M input tokens
  - gpt-4o: $5 / 1M input tokens

```
OPENAI_MODEL=gpt-4o-mini
```

---

## Resend 邮件配置

### `RESEND_API_KEY`

- **说明**: Resend API 密钥，用于发送邮件
- **必需**: ✅
- **类型**: string
- **获取路径**: https://resend.com/api-keys
- **作用域**: Production 仅
- **安全性**: ⚠️ 机密，仅服务端使用

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### `RESEND_FROM_EMAIL`

- **说明**: 发件人邮箱地址
- **必需**: ✅
- **类型**: string（email）
- **要求**: 必须在 Resend 中验证过的域名
- **作用域**: 全部环境

```
RESEND_FROM_EMAIL=noreply@mingdao.space
```

### `RESEND_FROM_NAME`

- **说明**: 发件人显示名称
- **必需**: ❌
- **类型**: string
- **默认**: `Mingdao`
- **作用域**: 全部环境

```
RESEND_FROM_NAME=Mingdao 明道
```

---

## PayPal 配置

### `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

- **说明**: PayPal 客户端 ID，用于前端支付按钮
- **必需**: ✅
- **类型**: string
- **获取路径**: PayPal Developer → My Apps & Credentials → Live → Client ID
- **作用域**: 全部环境
- **安全性**: 公开（可在客户端暴露）

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### `PAYPAL_CLIENT_SECRET`

- **说明**: PayPal 客户端密钥，用于服务端支付验证
- **必需**: ✅
- **类型**: string
- **获取路径**: PayPal Developer → My Apps & Credentials → Live → Secret
- **作用域**: Production 仅
- **安全性**: ⚠️ 机密，仅服务端使用

```
PAYPAL_CLIENT_SECRET=EDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### `PAYPAL_MODE`

- **说明**: PayPal 运行模式
- **必需**: ✅
- **类型**: string
- **可选值**: `sandbox`（沙盒测试）, `live`（正式生产）
- **作用域**: 全部环境
- **生产环境必须设置为**: `live`

```
PAYPAL_MODE=live
```

### `PAYPAL_WEBHOOK_ID`

- **说明**: PayPal Webhook ID，用于验证回调签名
- **必需**: ✅
- **类型**: string
- **获取路径**: PayPal Developer → My Apps → Webhooks → Webhook ID
- **作用域**: Production 仅
- **安全性**: 中等机密

```
PAYPAL_WEBHOOK_ID=4XX000000X000000X
```

---

## 管理配置

### `ADMIN_EMAILS`

- **说明**: 管理员邮箱列表，逗号分隔
- **必需**: ❌
- **类型**: string（逗号分隔的 email 列表）
- **作用域**: 全部环境
- **用途**: 访问管理后台、查看统计数据等

```
ADMIN_EMAILS=admin@mingdao.space,founder@mingdao.space
```

---

## 可选配置

### `NEXT_PUBLIC_SITE_URL`

- **说明**: 站点 URL，用于 sitemap.xml 和 robots.txt 生成
- **必需**: 推荐
- **类型**: string
- **示例**: `https://mingdao.space`
- **作用域**: 全部环境

```
NEXT_PUBLIC_SITE_URL=https://mingdao.space
```

### `NEXT_PUBLIC_GA_ID`

- **说明**: Google Analytics 跟踪 ID
- **必需**: ❌
- **类型**: string
- **格式**: `G-XXXXXXXXXX`
- **作用域**: 全部环境

```
NEXT_PUBLIC_GA_ID=G-ABC123DEF4
```

### `NEXT_PUBLIC_VERCEL_ANALYTICS`

- **说明**: Vercel Analytics 开关
- **必需**: ❌（Vercel 自动处理）
- **类型**: string
- **默认**: Vercel 部署时自动启用

---

## Vercel 环境变量配置方法

### 方法一：通过 Dashboard 配置

1. 进入 Vercel Dashboard
2. 选择项目 → Settings → Environment Variables
3. 逐行添加变量，选择作用域（Production / Preview / Development）
4. 点击 "Save"
5. **重新部署**才能生效

### 方法二：通过 CLI 配置

```bash
# 添加单个变量
echo "your-value" | vercel env add VAR_NAME production

# 批量添加（从 .env.local 文件）
cat .env.local | grep -v '^#' | grep -v '^$' | while read line; do
  key="${line%%=*}"
  value="${line#*=}"
  echo "$value" | vercel env add "$key" production
done
```

### 方法三：通过 vercel.json 配置（不推荐用于密钥）

```json
{
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://mingdao.space"
  }
}
```

> **注意**：不要在 vercel.json 中存放敏感密钥，该文件会提交到 Git。

---

## 安全最佳实践

1. **绝不提交密钥到 Git**
   - `.env.local` 应在 `.gitignore` 中
   - 所有密钥通过部署平台环境变量管理

2. **最小权限原则**
   - 只授予必要的权限
   - 不同环境使用不同的 API Key

3. **定期轮换**
   - 建议每 6 个月轮换一次密钥
   - 人员变动时立即轮换

4. **使用 Secret Manager**
   - 企业级可用 AWS Secrets Manager / Vercel KV 等

5. **审计访问**
   - 定期审查谁能访问生产环境密钥
   - 使用团队协作平台的权限管理

---

## 快速配置模板

复制以下内容到 Vercel Environment Variables 页面，逐一填写：

```
# 应用基础
NEXT_PUBLIC_APP_URL=https://mingdao.space

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@mingdao.space
RESEND_FROM_NAME=Mingdao

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=live
PAYPAL_WEBHOOK_ID=

# 管理
ADMIN_EMAILS=admin@mingdao.space

# SEO
NEXT_PUBLIC_SITE_URL=https://mingdao.space
```

---

**文档版本**: v1.0  
**最后更新**: 2025-01
