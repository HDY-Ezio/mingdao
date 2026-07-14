# Supabase 生产环境检查表
# Supabase Production Checklist

## 概述

在将应用部署到生产环境之前，请按照本清单逐项检查 Supabase 项目配置，确保安全、稳定、可扩展。

---

## 目录

1. [项目基础配置](#项目基础配置)
2. [数据库配置](#数据库配置)
3. [认证配置](#认证配置)
4. [RLS 策略验证](#rls-策略验证)
5. [存储桶配置](#存储桶配置)
6. [API 配置](#api-配置)
7. [安全配置](#安全配置)
8. [监控与备份](#监控与备份)
9. [性能优化](#性能优化)

---

## 项目基础配置

### 1.1 项目信息

- [ ] 项目名称已设置为生产环境名称（如 "Mingdao Production"）
- [ ] 项目区域选择正确（建议选择离用户最近的区域）
- [ ] 数据库密码已妥善保存（不会显示第二次）

### 1.2 套餐升级

- [ ] 确认项目套餐满足生产需求
  - 免费版：适合测试和小规模使用（500MB 数据库，1GB 存储）
  - Pro 版：$25/月（8GB 数据库，100GB 存储，每日备份）
  - Team 版：$59/月，适合团队协作

> **建议**：正式上线前升级到 Pro 版，确保稳定性和备份能力。

---

## 数据库配置

### 2.1 Schema 完整性验证

执行以下 SQL 检查表是否存在：

```sql
-- 检查表是否全部创建
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

预期的表列表：

| 表名 | 用途 | 必需 |
|------|------|------|
| `users` | 用户资料 | ✅ |
| `bazi_readings` | 八字排盘记录 | ✅ |
| `subscriptions` | 订阅记录 | ✅ |
| `chat_messages` | AI 对话记录 | ✅ |
| `orders` | 订单记录 | ✅ |
| `email_subscriptions` | 邮件订阅 | ✅ |
| `products` | 产品目录 | ✅ |
| `reports` | 用户报告 | ✅ |
| `conversations` | 对话会话 | ✅ |
| `subscription_plans` | 订阅计划 | ✅ |
| `deep_question_purchases` | 深度问道购买 | ✅ |
| `paypal_orders` | PayPal 订单 | ✅ |
| `ziwei_charts` | 紫微斗数命盘 | ✅ |
| `iching_readings` | 易经卦象 | ✅ |
| `iching_hexagrams` | 易经卦象数据 | ✅ |
| `daily_fortunes` | 每日运势 | ✅ |
| `constellation_mansions` | 二十八星宿 | ✅ |
| `seven_governors` | 七政 | ✅ |
| `four_remainders` | 四余 | ✅ |

### 2.2 扩展验证

```sql
-- 检查已启用的扩展
SELECT extname FROM pg_extension;
```

必需扩展：
- [ ] `uuid-ossp`（UUID 生成）
- [ ] `pgcrypto`（加密函数）

### 2.3 索引验证

```sql
-- 检查索引
SELECT 
  tablename, 
  indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

关键索引：
- [ ] `bazi_readings.user_id`
- [ ] `bazi_readings.created_at`
- [ ] `reports.user_id`
- [ ] `reports.status`
- [ ] `reports.created_at`
- [ ] `chat_messages.user_id`
- [ ] `chat_messages.conversation_id`
- [ ] `orders.user_id`
- [ ] `orders.status`
- [ ] `email_subscriptions.email`
- [ ] `email_subscriptions.unsubscribe_token`

### 2.4 触发器验证

```sql
-- 检查触发器
SELECT event_object_table, trigger_name 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

必需触发器：
- [ ] `on_auth_user_created` — 新用户自动创建 profile
- [ ] `*_updated_at` — 各表的 updated_at 自动更新

### 2.5 种子数据验证

```sql
-- 检查产品数据
SELECT id, name, price, is_active FROM products ORDER BY sort_order;

-- 检查订阅计划
SELECT id, name, price_monthly, price_yearly FROM subscription_plans ORDER BY sort_order;

-- 检查二十八星宿数据
SELECT COUNT(*) FROM constellation_mansions; -- 应为 28

-- 检查七政四余
SELECT COUNT(*) FROM seven_governors;       -- 应为 7
SELECT COUNT(*) FROM four_remainders;       -- 应为 4
```

---

## 认证配置

### 3.1 Provider 配置

进入 Supabase Dashboard → Authentication → Providers：

- [ ] **Email**：已启用
- [ ] **Confirm email**：根据需求决定是否启用
  - 建议：生产环境启用，防止垃圾注册
- [ ] **Secure email change**：启用
- [ ] **Custom email template**：根据品牌定制邮件模板

### 3.2 URL Configuration

进入 Authentication → URL Configuration：

- [ ] **Site URL**：设置为生产环境域名（如 `https://mingdao.space`）
- [ ] **Redirect URLs**：添加所有需要的回调 URL
  - `https://mingdao.space/auth/callback`
  - `https://mingdao.space/dashboard`

### 3.3 邮件模板自定义

建议自定义以下邮件模板：

- [ ] Confirm signup
- [ ] Invite user
- [ ] Magic link
- [ ] Reset password
- [ ] Change email address

模板中可使用变量： `{{ .ConfirmationURL }}`、`{{ .SiteURL }}` 等。

---

## RLS 策略验证

### 4.1 RLS 启用状态

```sql
-- 检查所有表的 RLS 状态
SELECT 
  relname AS table_name,
  relrowsecurity AS rls_enabled
FROM pg_class
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE nspname = 'public'
  AND relkind = 'r'
ORDER BY relname;
```

所有用户数据表都应启用 RLS。

### 4.2 RLS 策略列表

```sql
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4.3 关键策略验证

手动验证以下策略：

- [ ] **users 表**：用户只能查看/修改自己的 profile
- [ ] **bazi_readings**：用户只能查看/修改自己的排盘
- [ ] **reports**：用户只能查看自己的报告
- [ ] **chat_messages**：用户只能查看自己的对话
- [ ] **orders**：用户只能查看自己的订单
- [ ] **products**：所有人可读
- [ ] **subscription_plans**：所有人可读
- [ ] **iching_hexagrams**：所有人可读
- [ ] **constellation_mansions**：所有人可读

### 4.4 Service Role 注意事项

- Service Role Key 会绕过 RLS
- **只能在服务端代码中使用**，绝不能暴露给客户端
- 当前项目使用场景：
  - Webhook 处理（PayPal 回调更新订单状态）
  - 管理员操作

---

## 存储桶配置

### 5.1 存储桶创建

如果需要存储用户上传的文件（如头像、报告 PDF 等）：

```sql
-- 创建存储桶（在 Supabase Dashboard 操作，或使用 SQL）
-- Storage → Buckets → New bucket

-- 头像存储桶
-- Bucket name: avatars
-- Public: false (私有，需认证访问)

-- 报告存储桶
-- Bucket name: reports
-- Public: false (私有，需认证访问)
```

### 5.2 存储策略

```sql
-- 用户只能上传自己的头像
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 用户只能查看自己的文件
create policy "Users can view their own files"
on storage.objects for select
using (
  bucket_id in ('avatars', 'reports')
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

> **注意**：当前 MVP 阶段可能还不需要存储桶，按需创建即可。

---

## API 配置

### 6.1 API URL 和 Keys

记录以下信息用于部署：

- [ ] **Project URL**（如 `https://oqiwcisjpclimeckjazg.supabase.co`）
- [ ] **anon public key**（公开，客户端使用）
- [ ] **service_role key**（保密，服务端使用）

位置：Supabase Dashboard → Project Settings → API

### 6.2 CORS 配置

Storage 的 CORS 配置（如果使用存储功能）：

- [ ] 允许的 Origin 包含生产域名
- [ ] 允许的 Method：GET, POST, PUT, DELETE, OPTIONS

---

## 安全配置

### 7.1 数据库安全

- [ ] 数据库密码强度足够（16+ 位，混合字符）
- [ ] 不使用默认密码
- [ ] 密码存储在安全的密码管理器中
- [ ] 只在必要时共享数据库访问权限

### 7.2 API 安全

- [ ] anon key 只授予最小必要权限
- [ ] service_role key 不泄露到客户端
- [ ] 定期轮换 API Key（建议每 6 个月）

### 7.3 网络安全

- [ ] 考虑启用 IP 白名单（Enterprise 套餐）
- [ ] 生产环境不使用 `*` 通配符的 CORS

### 7.4 敏感数据保护

- [ ] 用户密码由 Supabase Auth 管理（bcrypt 加密）
- [ ] 不存储信用卡信息（PayPal 处理）
- [ ] 邮箱地址不公开显示

---

## 监控与备份

### 8.1 备份策略

- [ ] 确认自动备份已启用（Pro 版及以上）
- [ ] 备份保留周期：7 天（Pro）/ 30 天（Team）
- [ ] 测试过从备份恢复流程（建议每季度一次）

### 8.2 日志与监控

在 Supabase Dashboard 中关注：

- [ ] **Database**: 查询性能、慢查询、连接数
- [ ] **API**: 请求量、错误率、响应时间
- [ ] **Auth**: 注册量、登录量、失败率
- [ ] **Storage**: 存储使用量、请求量

### 8.3 告警配置

配置以下告警（通过 Supabase 或第三方监控）：

- [ ] 数据库 CPU 使用率 > 80%
- [ ] 数据库内存使用率 > 85%
- [ ] 存储空间使用率 > 80%
- [ ] API 错误率 > 5%
- [ ] 认证失败率突增

---

## 性能优化

### 9.1 数据库性能

- [ ] 所有高频查询都有适当的索引
- [ ] 避免全表扫描（使用 `EXPLAIN ANALYZE` 检查）
- [ ] 大表考虑分区（用户量上来后）

### 9.2 连接管理

- [ ] 应用端使用连接池（Supabase 客户端已处理）
- [ ] 监控活跃连接数
- [ ] 避免长事务

### 9.3 缓存策略

- [ ] 静态数据（products、iching_hexagrams 等）考虑应用层缓存
- [ ] 使用 Redis 或 Vercel KV 缓存高频查询
- [ ] 合理设置 HTTP 缓存头

---

## 上线前最终检查

- [ ] 所有表创建完成
- [ ] 所有 RLS 策略配置正确
- [ ] 种子数据已插入
- [ ] 触发器正常工作
- [ ] 认证 URL 配置正确
- [ ] API Key 已保存到部署平台
- [ ] 数据库备份已启用
- [ ] 至少一次完整的端到端测试通过

---

**文档版本**: v1.0  
**最后更新**: 2025-01
