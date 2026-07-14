-- ============================================================================
-- Phase 3 Schema - Reports, Products, Chat, Payments
-- 明道 Phase 3 数据库表设计
-- ============================================================================

-- ============================================================================
-- 1. Products Table - 产品表
-- ============================================================================
create table if not exists public.products (
    id text primary key,                    -- 产品ID，如 bazi_full, ziwei_full
    name text not null,                     -- 产品名称（英文）
    name_cn text not null,                  -- 产品名称（中文）
    description text,                       -- 产品描述
    category text not null check (category in ('bazi', 'ziwei', 'iching', 'relationship', 'career', 'compatibility')),
    price decimal(10, 2) not null,          -- 单次价格
    currency text default 'USD',
    base_questions integer not null default 10,  -- 基础问道次数
    is_active boolean default true,
    features text[] default '{}',           -- 功能特性列表
    sort_order integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
    before update on public.products
    for each row
    execute function public.handle_updated_at();

-- 插入6款报告产品
insert into public.products (id, name, name_cn, description, category, price, base_questions, features, sort_order)
values
    ('bazi_full', 'Bazi Complete Report', '八字完整报告', 'Complete 100+ page Bazi analysis with 10-year fortune cycles, yearly predictions, and detailed life guidance.', 'bazi', 19.99, 10,
     ARRAY['10-Year Fortune Cycles 大运十年', 'Yearly Predictions 流年运势', 'Career & Wealth Timing', 'Relationship Compatibility', 'Health & Vitality Analysis', 'Favorable Directions & Colors', 'Lucky Numbers & Elements', 'AI Daoist Chat (10 questions)'], 1),
    ('ziwei_full', 'Ziwei Dou Shu Report', '紫微斗数完整报告', 'Comprehensive Purple Star Astrology reading with palace analysis, major stars interpretation, and life path guidance.', 'ziwei', 29.99, 25,
     ARRAY['12 Palace Analysis 十二宫', 'Major Stars Interpretation 主星', '10-Year Cycles 十年大运', 'Career & Finance Palace', 'Relationship & Marriage Palace', 'Health & Vitality Palace', 'AI Daoist Chat (25 questions)'], 2),
    ('iching_deep', 'I Ching Deep Reading', '易经深度解读', 'Deep divination reading with hexagram analysis, changing lines interpretation, and practical guidance for your question.', 'iching', 14.99, 10,
     ARRAY['Hexagram Analysis 卦象解析', 'Changing Lines Interpretation 变爻解读', 'Practical Guidance & Advice', 'Timing & Action Items', 'Relationship with Your Question', 'AI Daoist Chat (10 questions)'], 3),
    ('relationship_report', 'Relationship Report', '感情专项报告', 'Deep dive into your love and relationship destiny — patterns, timing, compatibility, and guidance for harmonious partnerships.', 'relationship', 19.99, 15,
     ARRAY['Love Destiny Analysis 感情命盘', 'Partner Compatibility', 'Best Timing for Love', 'Relationship Patterns to Heal', 'Marriage Outlook 婚姻运势', 'AI Daoist Chat (15 questions)'], 4),
    ('career_wealth_report', 'Career & Wealth Report', '事业财运专项', 'Comprehensive career and wealth analysis — ideal industries, timing for opportunities, wealth accumulation strategies.', 'career', 19.99, 15,
     ARRAY['Career Path Analysis 事业方向', 'Wealth Destiny 财运格局', 'Best Industries & Roles', 'Opportunity Timing 时机把握', 'Investment Guidance', 'AI Daoist Chat (15 questions)'], 5),
    ('couple_compatibility', 'Couple Compatibility Report', '双人合盘', 'Side-by-side comparison of two Bazi charts — relationship dynamics, strengths, challenges, and harmony guidance.', 'compatibility', 39.99, 30,
     ARRAY['Dual Chart Comparison 双人排盘', 'Five Elements Harmony 五行合婚', 'Relationship Dynamics', 'Strengths & Challenges', 'Communication Patterns', 'Timing for Major Decisions', 'AI Daoist Chat (30 questions)'], 6)
on conflict (id) do nothing;

-- ============================================================================
-- 2. Reports Table - 报告表（用户购买的报告）
-- ============================================================================
create table if not exists public.reports (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    product_id text references public.products(id) not null,
    title text not null,                    -- 报告标题
    report_type text not null check (report_type in ('bazi', 'ziwei', 'iching', 'relationship', 'career', 'compatibility')),
    
    -- 输入数据（JSON，不同报告类型有不同结构）
    input_data jsonb default '{}'::jsonb,
    
    -- 报告内容（JSON，结构化存储）
    report_data jsonb default '{}'::jsonb,
    
    -- 问道次数
    questions_used integer default 0,
    questions_total integer not null default 10,
    
    -- 状态
    status text not null check (status in ('generating', 'ready', 'failed')) default 'generating',
    
    -- 是否解锁49问
    is_deep_unlocked boolean default false,
    
    -- 关联订单
    order_id uuid references public.orders(id),
    
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists reports_updated_at on public.reports;
create trigger reports_updated_at
    before update on public.reports
    for each row
    execute function public.handle_updated_at();

create index if not exists idx_reports_user_id on public.reports(user_id);
create index if not exists idx_reports_product_id on public.reports(product_id);
create index if not exists idx_reports_status on public.reports(status);
create index if not exists idx_reports_created_at on public.reports(created_at desc);

-- ============================================================================
-- 3. Conversations Table - 对话会话表
-- ============================================================================
create table if not exists public.conversations (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    report_id uuid references public.reports(id) on delete cascade,
    title text,                              -- 对话标题
    context_type text not null check (context_type in ('bazi', 'ziwei', 'iching', 'relationship', 'career', 'compatibility', 'general')),
    context_data jsonb default '{}'::jsonb,  -- 上下文数据（如排盘结果）
    
    -- 对话次数计数
    message_count integer default 0,
    
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists conversations_updated_at on public.conversations;
create trigger conversations_updated_at
    before update on public.conversations
    for each row
    execute function public.handle_updated_at();

create index if not exists idx_conversations_user_id on public.conversations(user_id);
create index if not exists idx_conversations_report_id on public.conversations(report_id);
create index if not exists idx_conversations_created_at on public.conversations(created_at desc);

-- 为现有 chat_messages 添加 report_id 和 conversation_id 外键
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'chat_messages' and column_name = 'report_id') then
        alter table public.chat_messages add column report_id uuid references public.reports(id) on delete set null;
    end if;
end $$;

-- ============================================================================
-- 4. Subscription Plans Table - 订阅计划表
-- ============================================================================
create table if not exists public.subscription_plans (
    id text primary key,                     -- plan ID: mingdao_member, daoist_personal
    name text not null,                      -- 计划名称
    name_cn text not null,                   -- 中文名称
    description text,                        -- 描述
    price_monthly decimal(10, 2) not null,   -- 月费
    price_yearly decimal(10, 2) not null,    -- 年费
    currency text default 'USD',
    features text[] default '{}',            -- 功能列表
    questions_per_month integer default 49,  -- 每月问道次数
    report_discount numeric(3, 2) default 1.0,  -- 报告折扣（1.0=原价，0.7=7折）
    free_reports_per_month integer default 0,  -- 每月免费报告数
    priority_support boolean default false,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists subscription_plans_updated_at on public.subscription_plans;
create trigger subscription_plans_updated_at
    before update on public.subscription_plans
    for each row
    execute function public.handle_updated_at();

-- 插入两档订阅会员
insert into public.subscription_plans (id, name, name_cn, description, price_monthly, price_yearly, features, questions_per_month, report_discount, free_reports_per_month, priority_support, sort_order)
values
    ('mingdao_member', 'Mingdao Member', '明道会员', 'Unlock daily fortune emails, report discounts, and monthly AI questions — perfect for regular guidance seekers.', 
     9.99, 79.00,
     ARRAY['Daily Fortune Email 每日运势', '30% off all reports 报告7折', '49 AI Questions/month 问道', 'Member-only content 会员专属', 'Priority email support'],
     49, 0.70, 0, false, 1),
    ('daoist_personal', 'Daoist Personal', '道长亲传', 'The ultimate guidance experience — free reports, deepest discounts, priority responses, and monthly deep dives.', 
     29.99, 249.00,
     ARRAY['Everything in Mingdao Member', '2 Free Reports/month 每月2份', '40% off all reports 报告6折', 'Priority AI Response 优先响应', 'Monthly Deep Dive 每月专题', '49 AI Questions/month 问道', 'VIP Support 专属客服'],
     49, 0.60, 2, true, 2)
on conflict (id) do nothing;

-- ============================================================================
-- 5. Deep Question Upgrades - 深度问道加购记录
-- ============================================================================
create table if not exists public.deep_question_purchases (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    report_id uuid references public.reports(id) on delete cascade,
    amount decimal(10, 2) not null default 9.90,
    currency text default 'USD',
    order_id uuid references public.orders(id),
    status text not null check (status in ('pending', 'completed', 'failed')) default 'pending',
    created_at timestamptz default now()
);

create index if not exists idx_deep_question_user_id on public.deep_question_purchases(user_id);
create index if not exists idx_deep_question_report_id on public.deep_question_purchases(report_id);

-- ============================================================================
-- 6. PayPal Orders Table - PayPal 支付订单表
-- ============================================================================
create table if not exists public.paypal_orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    paypal_order_id text unique,            -- PayPal 订单ID
    paypal_capture_id text,                 -- PayPal 捕获ID
    order_type text not null check (order_type in ('subscription', 'report', 'deep_questions')),
    product_id text,                        -- 关联产品ID
    report_id uuid references public.reports(id) on delete set null,
    amount decimal(10, 2) not null,
    currency text default 'USD',
    status text not null check (status in ('created', 'approved', 'completed', 'failed', 'refunded')) default 'created',
    payer_email text,
    payer_name text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists paypal_orders_updated_at on public.paypal_orders;
create trigger paypal_orders_updated_at
    before update on public.paypal_orders
    for each row
    execute function public.handle_updated_at();

create index if not exists idx_paypal_orders_user_id on public.paypal_orders(user_id);
create index if not exists idx_paypal_orders_status on public.paypal_orders(status);
create index if not exists idx_paypal_orders_paypal_order_id on public.paypal_orders(paypal_order_id);

-- 更新 orders 表的 order_type，增加更多类型
alter table public.orders drop constraint if exists orders_order_type_check;
alter table public.orders add constraint orders_order_type_check 
    check (order_type in ('subscription', 'bazi_report', 'iching_reading', 'credits', 'report', 'deep_questions'));

-- ============================================================================
-- RLS Policies for New Tables
-- ============================================================================

alter table public.products enable row level security;
alter table public.reports enable row level security;
alter table public.conversations enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.deep_question_purchases enable row level security;
alter table public.paypal_orders enable row level security;

-- Products: 所有人可查看（产品目录公开）
create policy "Products are viewable by everyone"
    on public.products for select
    using (true);

-- Reports: 用户只能查看自己的报告
create policy "Users can view their own reports"
    on public.reports for select
    using (auth.uid() = user_id);

create policy "Users can create their own reports"
    on public.reports for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own reports"
    on public.reports for update
    using (auth.uid() = user_id);

-- Conversations: 用户只能查看自己的对话
create policy "Users can view their own conversations"
    on public.conversations for select
    using (auth.uid() = user_id);

create policy "Users can create their own conversations"
    on public.conversations for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own conversations"
    on public.conversations for update
    using (auth.uid() = user_id);

-- Subscription Plans: 公开可查看
create policy "Subscription plans are viewable by everyone"
    on public.subscription_plans for select
    using (true);

-- Deep Question Purchases: 用户只能查看自己的
create policy "Users can view their own deep question purchases"
    on public.deep_question_purchases for select
    using (auth.uid() = user_id);

create policy "Users can create their own deep question purchases"
    on public.deep_question_purchases for insert
    with check (auth.uid() = user_id);

-- PayPal Orders: 用户只能查看自己的
create policy "Users can view their own paypal orders"
    on public.paypal_orders for select
    using (auth.uid() = user_id);

create policy "Users can create their own paypal orders"
    on public.paypal_orders for insert
    with check (auth.uid() = user_id);
