# Phase 4 开发进度 - 紫微斗数 + 易经 + 邮件订阅系统

**项目**: 明道 MINGDAO - 东方命理出海 MVP
**阶段**: Phase 4
**完成日期**: 2026-04
**技术栈**: Next.js 16 + Tailwind CSS 4 + shadcn/ui + Supabase

---

## ✅ 已完成功能

### 1. 紫微斗数模块（MVP简化版）

#### 1.1 核心算法
- **文件**: `src/lib/ziwei-calculator.ts`
- **功能**:
  - 十四主星完整数据（名称、五行、阴阳、基本特质）
  - 十二宫位定义（命宫、兄弟、夫妻、子女、财帛、疾厄、迁移、交友、事业、田宅、福德、父母）
  - 命宫/身宫计算（寅宫起正月 + 顺数生时，真实算法）
  - 主星安星法（简化映射，基于命宫位置和生年偏移计算）
  - 五行局计算（水二局、木三局、金四局、土五局、火六局）
  - 12宫位解读模板生成
  - 整体命盘解读生成

#### 1.2 可视化组件
- **文件**: `src/components/ziwei/ziwei-chart.tsx`
- **功能**:
  - SVG十二宫环形图（传统紫微命盘布局）
  - 宫位详情卡片（主星、辅星、解读）
  - 交互式命盘面板
  - 快速导航锚点
  - 响应式适配

#### 1.3 报告整合
- 紫微斗数完整报告流程：介绍 → 输入 → 生成 → 结果
- 免费版：命宫主星、基本特质、整体运势概要
- 付费版：十二宫详解、主星分析、大运流年、AI对话

---

### 2. 易经模块

#### 2.1 六十四卦数据
- **文件**: `src/lib/iching-data.ts`
- **功能**:
  - 八卦定义（乾兑离震巽坎艮坤，中英双语）
  - 六十四卦完整数据（前10卦详细传统卦辞爻辞 + 后54卦算法生成）
  - 卦辞、爻辞、卦义中英双语
  - 变卦计算函数

#### 2.2 起卦算法
- **文件**: `src/lib/iching-calculator.ts`
- **功能**:
  - 三枚铜钱法（模拟真实起卦流程）
  - 时间起卦法（年+月+日+时起卦）
  - 变爻计算（老阳/老阴变爻）
  - 本卦/变卦解读生成
  - 主入口函数 `castIChing()`

#### 2.3 可视化组件
- **文件**: `src/components/iching/hexagram-display.tsx`
- **功能**:
  - CSS绘制卦象图（阳爻/阴爻）
  - 八卦单卦显示组件
  - 本卦/变卦对照显示
  - 卦象卡片组件
  - 古朴竹简/帛书质感样式

#### 2.4 报告整合
- 易经深度解读报告流程：介绍 → 输入 → 生成 → 结果
- 输入页优化：起卦方式选择（时间起卦/铜钱起卦）
- 铜钱起卦动画交互（三枚铜钱 + 六爻逐步生成）
- 免费版：卦象展示、卦辞、基本解读
- 付费版：变卦详解、爻辞解读、实用指引、时机建议

---

### 3. 邮件订阅系统

#### 3.1 每日运势邮件模板
- **文件**: `emails/daily-fortune/daily-fortune-email.tsx`
- **功能**:
  - React Email组件构建
  - 当日干支 + 五行日
  - 五行运势分数条（5项）
  - 幸运物（颜色/数字/方位）
  - 生肖运势简介
  - 每日寄语
  - 退订链接

#### 3.2 订阅服务
- **文件**: `src/lib/email-subscription.ts`
- **功能**:
  - 每日运势生成算法（基于当日天干地支五行）
  - 订阅/退订/偏好管理
  - Resend集成占位（mock实现，预留接入点）
  - 邮件内容生成

#### 3.3 API路由
- 订阅API: `src/app/api/subscribe/route.ts` (POST)
- 退订API: `src/app/api/unsubscribe/route.ts` (POST + GET)
- Token安全验证

#### 3.4 订阅管理页面
- **文件**: `src/app/subscribe/page.tsx`
- **功能**:
  - 邮箱输入订阅
  - 4项偏好设置（事业/感情/健康/财运）
  - 每日运势权益介绍
  - 退订入口

---

### 4. 数据库迁移
- **文件**: `supabase/migrations/003_phase4_schema.sql`
- **新增表**（7张）:
  1. `ziwei_charts` - 紫微斗数命盘存储
  2. `iching_readings` - 易经占卜记录
  3. `iching_hexagrams` - 六十四卦静态数据
  4. `email_subscriptions` - 邮件订阅（含unsubscribe_token）
  5. `daily_fortunes` - 每日运势缓存
  6. `constellation_mansions` - 二十八星宿静态数据
  7. `seven_governors` - 七政四余静态数据
- **RLS策略**: 所有表均已启用行级安全策略
- **初始数据**: 二十八星宿 + 七政四余完整数据插入

---

### 5. 观星台页面
- **文件**: `src/app/observatory/page.tsx`
- **功能**:
  - Hero区域：观星台主题介绍
  - 今日值日星宿展示（动态计算）
  - 二十八星宿详解（四组x七宿，按四象分类）
  - 七政四余详细介绍（七颗行星 + 四颗余星）
  - 天官知识科普（SEO内容页）
  - CTA引导至紫微斗数/易经报告
  - 完整SEO metadata + keywords

---

### 6. 导航栏更新
- **文件**: `src/components/layout/navbar.tsx`
- **更新内容**:
  - 新增Observatory（观星台）导航入口
  - 用户下拉菜单新增Daily Fortune（每日运势订阅）入口
  - 移动端菜单同步更新
  - 新增Mail图标

---

## 📁 文件清单

### 新增文件
```
src/lib/
├── ziwei-calculator.ts          # 紫微斗数排盘算法
├── iching-data.ts               # 易经六十四卦数据
├── iching-calculator.ts         # 易经起卦算法
└── email-subscription.ts        # 邮件订阅服务

src/components/
├── ziwei/
│   └── ziwei-chart.tsx          # 紫微十二宫环形图
└── iching/
    └── hexagram-display.tsx     # 易经卦象显示组件

src/app/
├── observatory/
│   └── page.tsx                 # 观星台页面
├── subscribe/
│   └── page.tsx                 # 订阅管理页面
└── api/
    ├── subscribe/
    │   └── route.ts             # 订阅API
    └── unsubscribe/
        └── route.ts             # 退订API

emails/
└── daily-fortune/
    └── daily-fortune-email.tsx  # 每日运势邮件模板

supabase/migrations/
└── 003_phase4_schema.sql        # Phase 4数据库迁移
```

### 修改文件
```
src/types/index.ts               # 类型定义扩展
src/lib/report-generator.ts      # 报告生成器（紫微+易经）
src/components/report/report-viewer.ts  # 报告展示组件
src/components/layout/navbar.tsx # 导航栏更新
src/app/reports/[productId]/input/page.tsx  # 易经输入页优化
src/app/reports/[productId]/result/page.tsx # 结果页method参数支持
```

---

## 🎯 技术亮点

### 紫微斗数MVP简化策略
- **命宫计算**：使用真实传统算法（寅宫起正月，顺数生时）
- **主星安星**：简化映射算法，基于命宫位置+生年天干偏移
- **可扩展性**：后续可替换为精准安星法，不影响整体架构

### 易经数据策略
- **前10卦**：完整传统卦辞爻辞（乾坤屯蒙需讼师比小畜履）
- **后54卦**：算法生成简化版本，确保MVP期所有卦都有数据
- **变卦系统**：完整的变爻/变卦计算逻辑

### 邮件系统设计
- **Resend预留**：完整mock实现，真实服务仅需替换API调用
- **安全退订**：unsubscribe_token机制，安全可靠
- **偏好管理**：支持订阅者自定义关注领域

### SEO内容建设
- 观星台页面作为内容SEO入口
- 二十八星宿+七政四余知识库
- 完整metadata + keywords配置

---

## 🧪 验证路径

### 紫微斗数报告流程
1. 访问 `/reports/ziwei_full`
2. 点击"Start Reading"进入输入页
3. 填写出生信息（日期/时间/性别）
4. 点击生成，等待3.5秒动画
5. 查看结果页（免费版概要）
6. 点击解锁查看完整报告（十二宫详解）
7. 右侧AI对话系统可用

### 易经报告流程
1. 访问 `/reports/iching_deep`
2. 点击"Consult"进入输入页
3. 选择起卦方式（时间起卦/铜钱起卦）
4. 输入问题
5. 【铜钱法】点击"起卦"观看六爻生成动画
6. 点击生成，等待动画
7. 查看结果页（卦象+卦辞）
8. 解锁完整报告（变卦/爻辞/指引）
9. 右侧AI对话系统可用

### 邮件订阅流程
1. 访问 `/subscribe`
2. 输入邮箱地址
3. 选择偏好领域
4. 点击订阅
5. 收到确认邮件（mock）
6. 访问退订链接可取消订阅

### 观星台页面
1. 导航栏点击"Observatory"
2. 查看今日值日星宿
3. 浏览二十八星宿四象分类
4. 阅读七政四余介绍
5. 底部CTA跳转至报告页面

---

## 🚀 MVP vs 完整版差异

| 功能 | MVP版本 | 完整版 |
|------|---------|--------|
| 紫微主星安星 | 简化偏移算法 | 精准安星法 |
| 紫微辅星 | 简化数据 | 完整100+星曜 |
| 易经卦辞 | 前10卦完整，后54卦简化 | 全部64卦完整传统原文 |
| 邮件服务 | Mock实现 | Resend真实发送 |
| 数据库 | Schema完整，前端mock计算 | 真实后端计算存储 |

---

## 📌 后续优化建议

1. **紫微算法升级**：替换为精准安星法（紫微/天府定位 + 十四主星顺逆布）
2. **易经数据补全**：补充剩余54卦的完整传统卦辞爻辞
3. **邮件服务接入**：配置Resend API Key，启用真实邮件发送
4. **定时任务**：每日生成运势邮件，定时发送给订阅者
5. **更多星宿内容**：扩充观星台页面，增加每宿详细解读
6. **铜钱动画优化**：增加3D翻转效果，提升起卦仪式感
