# PayPal 生产环境配置指南
# PayPal Production Setup Guide

## 概述

本指南说明如何将 PayPal 支付从**沙盒模式（Sandbox）**切换到**正式模式（Live）**。

---

## 目录

1. [沙盒模式回顾](#沙盒模式回顾)
2. [正式环境前置条件](#正式环境前置条件)
3. [切换步骤](#切换步骤)
4. [Webhook 配置](#webhook-配置)
5. [生产环境验证](#生产环境验证)
6. [安全最佳实践](#安全最佳实践)

---

## 沙盒模式回顾

### 当前配置

| 配置项 | 沙盒值 | 说明 |
|--------|--------|------|
| `PAYPAL_MODE` | `sandbox` | 模式切换开关 |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | 沙盒 Client ID | 客户端使用 |
| `PAYPAL_CLIENT_SECRET` | 沙盒 Secret | 服务端使用 |
| `PAYPAL_WEBHOOK_ID` | 沙盒 Webhook ID | 回调验证 |

### 沙盒测试账号

在 https://developer.paypal.com/dashboard/accounts 中：
- **Business Account**: 商家收款账号（模拟收款）
- **Personal Account**: 买家付款账号（模拟付款）

---

## 正式环境前置条件

### 1. PayPal 商家账号

- [ ] 注册 PayPal 商家账号：https://www.paypal.com/business
- [ ] 完成账号验证（邮箱、手机、身份）
- [ ] 绑定银行账户（用于提现）
- [ ] 开通在线收款功能

### 2. REST API 应用

- [ ] 登录 PayPal Developer: https://developer.paypal.com
- [ ] 切换到 "Live" 模式（右上角 Toggle）
- [ ] 创建 Live App（或使用已有 App）
- [ ] 记录以下信息：
  - **Client ID**（对应 `NEXT_PUBLIC_PAYPAL_CLIENT_ID`）
  - **Secret**（对应 `PAYPAL_CLIENT_SECRET`）

### 3. 域名与 HTTPS

- [ ] 生产环境必须使用 HTTPS
- [ ] 域名已完成备案（如面向国内用户）
- [ ] 回调 URL（Webhook）可公网访问

---

## 切换步骤

### 步骤 1：获取生产环境凭证

1. 访问 https://developer.paypal.com/developer/applications
2. 右上角切换到 **Live** 模式
3. 点击 "Create App" 或选择现有 App
4. 复制 **Client ID** 和 **Secret**

### 步骤 2：更新环境变量

在 Vercel（或你的部署平台）中更新以下环境变量：

| 变量名 | 原值（沙盒） | 新值（生产） |
|--------|-------------|-------------|
| `PAYPAL_MODE` | `sandbox` | `live` |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | 沙盒 Client ID | 生产 Client ID |
| `PAYPAL_CLIENT_SECRET` | 沙盒 Secret | 生产 Secret |

> **重要**：环境变量修改后需要**重新部署**才能生效。

### 步骤 3：验证代码中的模式切换

代码中已根据 `PAYPAL_MODE` 自动切换 API 端点：

- 沙盒: `https://api-m.sandbox.paypal.com`
- 正式: `https://api-m.paypal.com`

相关代码位置：
- `src/app/api/paypal/create-order/route.ts`
- `src/app/api/paypal/capture-order/route.ts`
- `src/app/api/paypal/webhook/route.ts`
- `src/components/payment/paypal-button.tsx`

---

## Webhook 配置

### 1. 创建生产环境 Webhook

1. 登录 PayPal Developer Dashboard
2. 切换到 **Live** 模式
3. 进入你的 App → "Webhooks" 选项卡
4. 点击 "Add Webhook"

### 2. 配置 Webhook

| 配置项 | 值 |
|--------|-----|
| Webhook URL | `https://yourdomain.com/api/paypal/webhook` |
| Events to subscribe | 见下方列表 |

### 3. 订阅以下事件

```
PAYMENT.CAPTURE.COMPLETED        # 支付捕获完成
PAYMENT.CAPTURE.DENIED           # 支付被拒绝
PAYMENT.CAPTURE.REFUNDED         # 支付退款
PAYMENT.CAPTURE.REVERSED         # 支付冲正
CHECKOUT.ORDER.APPROVED          # 订单已批准
CHECKOUT.ORDER.COMPLETED         # 订单已完成
```

### 4. 更新 Webhook ID

将生成的 Webhook ID 填入环境变量：

```
PAYPAL_WEBHOOK_ID=你的生产环境Webhook_ID
```

### 5. 测试 Webhook

在 PayPal Dashboard 中使用 "Simulate" 功能发送测试事件，验证：

- [ ] Webhook 端点正确接收到请求
- [ ] 签名验证通过
- [ ] 订单状态正确更新
- [ ] 报告/内容正确解锁

---

## 生产环境验证

### 1. 小额测试

**强烈建议**：上线后先用小额真实支付测试整个流程。

1. 创建一个 $1 的测试产品（或临时修改价格）
2. 使用真实 PayPal 账号完成支付
3. 检查以下环节：
   - [ ] 支付页面正常打开
   - [ ] 支付成功后正确跳转
   - [ ] 订单状态更新为 "paid"
   - [ ] 报告内容正确解锁
   - [ ] 确认邮件正常发送
   - [ ] PayPal 后台能看到交易记录

### 2. 退款测试

1. 在 PayPal Dashboard 中对测试交易发起退款
2. 验证：
   - [ ] Webhook 接收到退款事件
   - [ ] 系统正确处理退款（可选：撤销权限/标记退款）
   - [ ] 用户收到退款通知

### 3. 并发测试（可选）

如果预期有高流量，建议进行简单的并发测试：

- 使用 Apache Bench 或 k6 测试 API 端点
- 验证支付回调在并发下的幂等性

---

## 安全最佳实践

### 1. 密钥管理

- [ ] **永远不要**将 Client Secret 提交到 Git 仓库
- [ ] 使用环境变量管理密钥，不要硬编码
- [ ] 定期轮换密钥（建议每 6 个月一次）
- [ ] 不同环境使用不同的 API Key

### 2. 支付安全

- [ ] 始终在服务端验证支付金额（不要信任客户端传来的价格）
- [ ] 使用 Webhook 作为最终支付确认，而不仅仅依赖前端回调
- [ ] 验证 Webhook 签名（代码中已实现）
- [ ] 实现订单幂等性（防止重复支付）

### 3. PCI 合规

- 本项目使用 PayPal 托管的支付页面，**不处理信用卡数据**
- 因此不需要 PCI DSS 合规认证
- 如果将来集成直接信用卡支付，需要评估 PCI 合规要求

### 4. 欺诈防护

- 启用 PayPal 的内置欺诈检测：
  - PayPal Seller Protection
  - Fraud Management Filters
- 考虑以下措施：
  - 新用户首单限制金额
  - 异常 IP/地区的订单人工审核
  - 同一支付方式短时间内多次尝试拦截

---

## 故障排查

### Webhook 未收到

1. 检查 Webhook URL 是否可公网访问
2. 确认 URL 使用 HTTPS
3. 在 PayPal Dashboard 查看 Webhook 的 "Last delivery" 状态
4. 检查 Vercel 日志中 `/api/paypal/webhook` 的请求记录

### 签名验证失败

1. 确认 `PAYPAL_WEBHOOK_ID` 正确
2. 确认使用的是对应环境（sandbox/live）的 Webhook ID
3. 检查请求体是否被中间件修改

### 支付后状态未更新

1. 检查 Webhook 是否成功到达
2. 检查数据库中订单状态
3. 查看服务端日志中的错误信息
4. 确认 `PAYPAL_MODE` 环境变量正确

---

## 相关代码文件

| 文件路径 | 功能 |
|----------|------|
| `src/app/api/paypal/create-order/route.ts` | 创建订单 API |
| `src/app/api/paypal/capture-order/route.ts` | 捕获订单 API |
| `src/app/api/paypal/webhook/route.ts` | Webhook 回调处理 |
| `src/components/payment/paypal-button.tsx` | PayPal 按钮组件 |

---

**文档版本**: v1.0  
**最后更新**: 2025-01
