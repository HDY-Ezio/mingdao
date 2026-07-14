# SEO 优化策略与实施指南
# SEO Optimization Strategy & Implementation Guide

## 概述

本文档详细说明 Mingdao 项目的 SEO 优化策略，包括技术 SEO、内容 SEO、
本地 SEO 以及 Bing 搜索优化建议。

---

## 目录

1. [技术 SEO 优化](#技术-seo-优化)
2. [页面 Meta 标签优化](#页面-meta-标签优化)
3. [结构化数据 (Schema.org)](#结构化数据-schemaorg)
4. [观星台页面 SEO 增强](#观星台页面-seo-增强)
5. [Bing SEO 着陆页优化建议](#bing-seo-着陆页优化建议)
6. [内容 SEO 策略](#内容-seo-策略)
7. [外链建设](#外链建设)
8. [SEO 工具与监控](#seo-工具与监控)

---

## 技术 SEO 优化

### 1.1 已实施的技术 SEO

- ✅ **Sitemap.xml**: `src/app/sitemap.ts`（自动生成）
- ✅ **Robots.txt**: `src/app/robots.ts`（自动生成）
- ✅ **语义化 HTML**: 使用 `<h1>`, `<article>`, `<section>`, `<nav>` 等标签
- ✅ **响应式设计**: 移动端优先，适配各种屏幕尺寸
- ✅ **Next.js 16 App Router**: 自动服务端渲染，SEO 友好

### 1.2 性能优化建议

| 优化项 | 当前状态 | 建议 | 预期收益 |
|--------|---------|------|---------|
| 图片优化 | 使用 next/image | 确保所有图片都用 next/image | LCP 提升 |
| 字体优化 | 使用 next/font | ✅ 已实施 | CLS 提升 |
| 代码分割 | Next.js 自动 | ✅ 已实施 | 首屏加载更快 |
| CDN 缓存 | Vercel Edge | ✅ 已实施 | 全球访问加速 |
| 懒加载 | next/image 自动 | 考虑 Intersection Observer | 减少初始加载 |

### 1.3 Core Web Vitals 目标

| 指标 | 目标 | 测量工具 |
|------|------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| FID (First Input Delay) | < 100ms | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| TTFB (Time to First Byte) | < 600ms | WebPageTest |

### 1.4 移动端优化

- [ ] 使用 Chrome DevTools 移动端模拟器测试
- [ ] 确保所有点击目标 > 48x48px
- [ ] 文字大小在移动端不小于 14px
- [ ] 横向滚动测试（确保无溢出）

---

## 页面 Meta 标签优化

### 2.1 首页 (Home)

**当前状态**: 已有基础 meta 标签

**优化建议**:

```typescript
// 建议的首页 metadata
export const metadata: Metadata = {
  title: {
    default: 'Mingdao — Bazi Reading & Chinese Astrology | Light Your Path',
    template: '%s | Mingdao',
  },
  description:
    'Discover your destiny through ancient Eastern wisdom. Free Bazi (八字) reading, Zi Wei Dou Shu (紫微斗数), and I Ching (易经) divination — guided by tradition, enhanced by AI.',
  keywords: [
    'bazi reading',
    'bazi calculator',
    'chinese astrology',
    'four pillars of destiny',
    'i ching',
    'zi wei dou shu',
    'purple star astrology',
    'chinese numerology',
    'destiny reading',
    'free bazi chart',
    'ba zi 八字',
    'mingdao',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mingdao.space',
    title: 'Mingdao — Bazi Reading & Chinese Astrology',
    description: 'Discover your destiny through ancient Eastern wisdom. Free Bazi reading, Zi Wei Dou Shu, and I Ching divination.',
    siteName: 'Mingdao',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mingdao — Light Your Path',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mingdao — Bazi Reading & Chinese Astrology',
    description: 'Discover your destiny through ancient Eastern wisdom.',
    images: ['/og-image.png'],
  },
}
```

### 2.2 各页面 Title & Description 建议

| 页面 | Title 建议 | Description 建议 |
|------|-----------|-----------------|
| 首页 | Mingdao — Bazi Reading & Chinese Astrology | Free Bazi calculator, Zi Wei Dou Shu chart, and I Ching readings. Discover your destiny through ancient Chinese wisdom. |
| 八字排盘 | Free Bazi Calculator — Four Pillars of Destiny | Generate your free Bazi chart (八字排盘) with detailed analysis of your day master, five elements, and destiny patterns. |
| 紫微斗数 | Zi Wei Dou Shu Chart — Purple Star Astrology | Generate your complete Zi Wei Dou Shu (紫微斗数) chart with 12 palace analysis and star interpretation. |
| 易经 | I Ching Reading — Book of Changes | Consult the I Ching (易经) online. Free hexagram casting with detailed interpretation for your question. |
| 观星台 | Celestial Observatory — 28 Lunar Mansions | Explore the 28 lunar mansions (二十八星宿), seven governors (七政), and four remainders (四余) of Chinese astronomy. |
| 定价 | Pricing — Mingdao Reports & Memberships | Choose your destiny guidance plan. From free Bazi readings to premium reports and AI Daoist consultations. |
| 关于 | About Mingdao — Our Story & Mission | Learn about Mingdao's mission to bring ancient Eastern wisdom to the modern world through technology. |
| 服务 | Services — Bazi, Ziwei, I Ching & More | Explore our full range of metaphysical services: Bazi reading, Zi Wei Dou Shu, I Ching divination, relationship compatibility, and more. |

### 2.3 Canonical URL

确保所有页面都有正确的 canonical URL（Next.js App Router 可自动处理，但需确认）。

---

## 结构化数据 (Schema.org)

### 3.1 首页 — Organization + WebSite

在首页添加以下结构化数据：

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Mingdao",
  "alternateName": "明道",
  "url": "https://mingdao.space",
  "logo": "https://mingdao.space/logo.png",
  "description": "Ancient Eastern wisdom meets modern AI — Bazi, Zi Wei Dou Shu, and I Ching readings",
  "foundingDate": "2025",
  "sameAs": [
    "https://twitter.com/mingdao_space",
    "https://www.reddit.com/r/mingdao",
    "https://www.producthunt.com/products/mingdao"
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Mingdao",
  "url": "https://mingdao.space",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://mingdao.space/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 3.2 产品/报告页面 — Product

每个报告页面添加 Product Schema：

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Bazi Complete Report",
  "alternateName": "八字完整报告",
  "image": "https://mingdao.space/images/bazi-report-og.png",
  "description": "Complete 100+ page Bazi analysis with 10-year fortune cycles, yearly predictions, and detailed life guidance.",
  "brand": {
    "@type": "Brand",
    "name": "Mingdao"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "19.99",
    "availability": "https://schema.org/InStock",
    "url": "https://mingdao.space/reports/bazi_full"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

### 3.3 观星台 — Article + EducationalOrganization

观星台页面使用 Article 和 Education 类型的 Schema：

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The 28 Lunar Mansions of Chinese Astrology",
  "description": "Explore the 28 lunar mansions, seven governors, and four remainders of traditional Chinese astronomy.",
  "image": "https://mingdao.space/images/observatory-og.png",
  "author": {
    "@type": "Organization",
    "name": "Mingdao"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Mingdao"
  },
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-15",
  "mainEntityOfPage": "https://mingdao.space/observatory"
}
```

### 3.4 FAQ 页面 — FAQPage

定价页和首页的 FAQ 部分使用 FAQPage Schema：

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How accurate are the readings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our readings are based on traditional Chinese metaphysics systems that have been refined over thousands of years..."
      }
    }
  ]
}
```

---

## 观星台页面 SEO 增强

### 4.1 关键词策略

**主关键词**:
- 28 lunar mansions
- chinese constellations
- 二十八星宿
- seven governors four remainders
- 七政四余

**长尾关键词**:
- what are the 28 mansions in chinese astrology
- 二十八星宿 详解
- chinese lunar mansions meaning
- 七政四余 详解
- purple star astrology stars

### 4.2 内容结构优化

建议观星台页面增加以下内容区块：

1. **H2: What Are the 28 Lunar Mansions?**
   - 简短定义和历史背景
   - 与西方星座的区别

2. **H2: The Four Celestial Animals (四象)**
   - 青龙、朱雀、白虎、玄武各一段说明

3. **H2: Each Mansion Explained**
   - 每个星宿的详细介绍（可折叠或跳转）

4. **H2: How Are the 28 Mansions Used in Astrology?**
   - 择日、紫微斗数、七政四余中的应用

5. **H2: Seven Governors (七政) Explained**
   - 日月金木水火土的含义

6. **H2: FAQ About Chinese Constellations**
   - 常见问题解答（增加 FAQ Schema）

### 4.3 内链策略

观星台页面应链向：
- /reports/ziwei_full（紫微斗数完整报告）
- /bazi（八字排盘）
- /blog/xxx（相关博客文章）
- /services（服务页）

---

## Bing SEO 着陆页优化建议

### 5.1 Bing 搜索特点

- Bing 用户平均年龄稍大（35-54 岁占比较高）
- Bing 用户收入水平相对较高
- Bing 对技术 SEO 的权重更高
- Bing 更重视明确的关键词匹配
- Bing 与 ChatGPT 集成，AI 搜索流量增长快

### 5.2 目标关键词（Bing 重点）

**高意图关键词**:
- "free bazi reading"
- "bazi calculator free"
- "chinese astrology birth chart"
- "i ching reading online"
- "zi wei dou shu calculator"

**信息类关键词**:
- "what is bazi"
- "how to read bazi chart"
- "chinese zodiac elements explained"
- "28 mansions chinese astrology"
- "book of changes explained"

### 5.3 Bing 着陆页优化清单

#### 首页优化

- [ ] **Title Tag**: 60 字符以内，包含主关键词 "Free Bazi Reading"
- [ ] **Meta Description**: 160 字符以内，包含 CTA
- [ ] **H1**: 明确包含目标关键词
- [ ] **首屏内容**: 在首屏即展示核心价值主张
- [ ] **URL 结构**: 简短、含关键词
- [ ] **图片 ALT**: 所有图片都有描述性 ALT 文本

#### 内容深度

- [ ] 每篇关键内容至少 1000+ 字
- [ ] 覆盖完整的主题（从入门到进阶）
- [ ] 使用列表、表格等结构化内容
- [ ] 引用权威来源（增加可信度）
- [ ] 定期更新内容（显示更新日期）

#### Bing Webmaster Tools

- [ ] 注册并验证 Bing Webmaster Tools
- [ ] 提交 sitemap.xml
- [ ] 提交 URL 进行即时索引
- [ ] 监控搜索表现和关键词排名
- [ ] 检查抓取错误和索引问题

### 5.4 Bing AI 搜索优化

随着 Bing Chat / Copilot 的普及，优化 AI 搜索结果也很重要：

- 使用清晰的 FAQ 结构（Bing Chat 常引用 FAQ）
- 内容使用 Schema.org 标记
- 提供简明扼要的定义和解释
- 使用 "What is X"、"How to Y" 等问题式标题
- 在文章开头给出总结性回答

---

## 内容 SEO 策略

### 6.1 内容支柱 (Content Pillars)

#### 支柱 1：八字 (Bazi)
- What is Bazi? (入门介绍)
- How to Calculate Your Bazi Chart (教程)
- Day Master Analysis (日主分析)
- Five Elements in Bazi (五行详解)
- 10-Year Luck Cycles (大运)
- Bazi Compatibility (八字合婚)
- Bazi for Career (事业财运)

#### 支柱 2：紫微斗数 (Zi Wei Dou Shu)
- What is Zi Wei Dou Shu? (入门介绍)
- 12 Palaces Explained (十二宫详解)
- Major Stars Interpretation (主星解读)
- Zi Wei vs Bazi: What's the Difference?
- How to Read Your Zi Wei Chart

#### 支柱 3：易经 (I Ching)
- What is the I Ching? (易经入门)
- How to Cast I Ching Hexagrams (起卦方法)
- 64 Hexagrams Explained (六十四卦详解)
- I Ching for Decision Making (决策应用)
- Changing Lines Interpretation (变爻解读)

#### 支柱 4：东方玄学文化
- History of Chinese Astrology (历史渊源)
- Five Elements Theory (五行学说)
- Yin Yang Balance (阴阳平衡)
- Chinese Zodiac vs Bazi (生肖 vs 八字)
- Feng Shui Basics (风水入门)

### 6.2 博客文章节奏

- **上线首月**: 发布 5 篇（每个支柱至少 1 篇）
- **前 3 个月**: 每周 2 篇（共约 24 篇）
- **稳定期**: 每周 1 篇深度长文

---

## 外链建设

### 7.1 高质量外链来源

| 来源类型 | 具体平台 | 难度 | 权重 |
|---------|---------|------|------|
| 产品目录 | ProductHunt | 低 | 高 |
| 问答社区 | Quora, Reddit | 中 | 中 |
| 客座博客 | 灵性/命理类博客 | 高 | 高 |
| 资源页面 | 占星/玄学资源站 | 中 | 中 |
| 社交媒体 | Twitter/X, Pinterest | 低 | 低 |
| 新闻报道 | 科技/生活方式媒体 | 高 | 很高 |

### 7.2 外链建设策略

**第 1 个月（基础）**:
- ProductHunt 发布
- 在 Quora 回答相关问题（签名放链接）
- Reddit 相关板块分享有价值内容

**第 2-3 个月（增长）**:
- 客座博客投稿
- 寻找资源页面合作
- YouTube 评论区分享

**长期（权威建设）**:
- 与 KOL/博主合作
- 发布原创研究/数据
- 争取媒体报道

---

## SEO 工具与监控

### 8.1 必备工具

| 工具 | 用途 | 价格 |
|------|------|------|
| Google Search Console | 谷歌搜索表现监控 | 免费 |
| Bing Webmaster Tools | Bing 搜索表现监控 | 免费 |
| Google Analytics 4 | 流量分析 | 免费 |
| Vercel Analytics | 性能监控 | 免费/付费 |
| Ahrefs / SEMrush | 关键词研究与外链分析 | 付费 |
| Screaming Frog | 技术 SEO 爬虫 | 免费版/付费 |

### 8.2 关键 SEO KPI

| 指标 | 3 个月目标 | 6 个月目标 | 12 个月目标 |
|------|-----------|-----------|------------|
| 自然搜索流量 | 500/月 | 2,000/月 | 10,000/月 |
| 排名关键词数 | 50 | 200 | 500+ |
| Top 10 关键词 | 5 | 30 | 100+ |
| 域名权威度 (DR) | 10 | 25 | 40+ |
| 自然流量转化率 | 3% | 4% | 5% |

---

## 已实施文件

- `src/app/sitemap.ts` — 站点地图
- `src/app/robots.ts` — Robots 协议
- `src/app/layout.ts` — 全局 metadata（需根据本文档优化）

---

**文档版本**: v1.0  
**最后更新**: 2025-01
