-- ============================================================================
-- Mingdao Database Initialization Script
-- 明道数据库完整初始化脚本
-- ============================================================================
-- 用途：在新的 Supabase 项目中从零创建完整的数据库结构
-- 执行方式：
--   1. 登录 Supabase Dashboard → SQL Editor
--   2. 新建查询，粘贴本文件全部内容
--   3. 点击 "Run" 执行
--
-- 注意：
--   - 本脚本是幂等的（idempotent），可重复执行不会出错
--   - 执行顺序很重要，不要打乱
--   - 生产环境执行前建议先在测试环境验证
-- ============================================================================

-- ============================================================================
-- Part 0: Extensions 扩展
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- Part 1: Common Functions 公共函数
-- ============================================================================

-- 自动更新 updated_at 的触发器函数
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 新用户注册时自动创建 profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

-- 生成随机退订 token 的函数
create or replace function public.generate_unsubscribe_token()
returns text as $$
begin
    return encode(gen_random_bytes(32), 'hex');
end;
$$ language plpgsql;

-- ============================================================================
-- Part 2: Tables — Core 用户与核心表
-- ============================================================================

-- ------------------------------------------------------------
-- 2.1 Users Table
-- ------------------------------------------------------------
create table if not exists public.users (
    id uuid references auth.users(id) primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    gender text check (gender in ('male', 'female', 'other')),
    birth_date date,
    birth_place text,
    timezone text default 'UTC',
    is_subscribed boolean default true,
    subscription_type text default 'free',
    credits integer default 10,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at
    before update on public.users
    for each row
    execute function public.handle_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 2.2 Bazi Readings Table
-- ------------------------------------------------------------
create table if not exists public.bazi_readings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    name text,
    gender text not null check (gender in ('male', 'female')),
    birth_date timestamptz not null,
    birth_place text,
    longitude numeric(9, 6),
    latitude numeric(9, 6),
    timezone text,
    year_stem integer not null,
    year_branch integer not null,
    month_stem integer not null,
    month_branch integer not null,
    day_stem integer not null,
    day_branch integer not null,
    hour_stem integer not null,
    hour_branch integer not null,
    day_master_element text,
    day_master_strength text check (day_master_strength in ('strong', 'balanced', 'weak')),
    favorable_elements text[],
    unfavorable_elements text[],
    chart_data jsonb,
    is_premium boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists bazi_readings_updated_at on public.bazi_readings;
create trigger bazi_readings_updated_at
    before update on public.bazi_readings
    for each row
    execute function public.handle_updated_at();

create index if not exists idx_bazi_readings_user_id on public.bazi_readings(user_id);
create index if not exists idx_bazi_readings_day_stem on public.bazi_readings(day_stem);
create index if not exists idx_bazi_readings_created_at on public.bazi_readings(created_at desc);

-- ------------------------------------------------------------
-- 2.3 Subscriptions Table
-- ------------------------------------------------------------
create table if not exists public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    plan text not null check (plan in ('free', 'premium', 'pro')),
    status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
    stripe_subscription_id text unique,
    stripe_customer_id text,
    current_period_start timestamptz,
    current_period_end timestamptz,
    cancel_at_period_end boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
    before update on public.subscriptions
    for each row
    execute function public.handle_updated_at();

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- ------------------------------------------------------------
-- 2.4 Chat Messages Table
-- ------------------------------------------------------------
create table if not exists public.chat_messages (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    conversation_id uuid,
    report_id uuid,
    role text not null check (role in ('user', 'assistant', 'system')),
    content text not null,
    message_type text default 'text' check (message_type in ('text', 'bazi_reading', 'iching')),
    metadata jsonb default '{}'::jsonb,
    tokens_used integer default 0,
    created_at timestamptz default now()
);

create index if not exists idx_chat_messages_user_id on public.chat_messages(user_id);
create index if not exists idx_chat_messages_conversation_id on public.chat_messages(conversation_id);
create index if not exists idx_chat_messages_created_at on public.chat_messages(created_at desc);

-- ------------------------------------------------------------
-- 2.5 Orders Table
-- ------------------------------------------------------------
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    order_type text not null check (order_type in ('subscription', 'bazi_report', 'iching_reading', 'credits', 'report', 'deep_questions')),
    amount decimal(10, 2) not null,
    currency text default 'USD',
    status text not null check (status in ('pending', 'paid', 'failed', 'refunded')),
    stripe_payment_intent_id text,
    stripe_checkout_session_id text,
    product_id text,
    quantity integer default 1,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at();

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- ============================================================================
-- Part 3: Tables — Products & Reports (Phase 3)
-- ============================================================================

-- ------------------------------------------------------------
-- 3.1 Products Table
-- ------------------------------------------------------------
create table if not exists public.products (
    id text primary key,
    name text not null,
    name_cn text not null,
    description text,
    category text not null check (category in ('bazi', 'ziwei', 'iching', 'relationship', 'career', 'compatibility')),
    price decimal(10, 2) not null,
    currency text default 'USD',
    base_questions integer not null default 10,
    is_active boolean default true,
    features text[] default '{}',
    sort_order integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
    before update on public.products
    for each row
    execute function public.handle_updated_at();

-- ------------------------------------------------------------
-- 3.2 Reports Table
-- ------------------------------------------------------------
create table if not exists public.reports (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    product_id text references public.products(id) not null,
    title text not null,
    report_type text not null check (report_type in ('bazi', 'ziwei', 'iching', 'relationship', 'career', 'compatibility')),
    input_data jsonb default '{}'::jsonb,
    report_data jsonb default '{}'::jsonb,
    questions_used integer default 0,
    questions_total integer not null default 10,
    status text not null check (status in ('generating', 'ready', 'failed')) default 'generating',
    is_deep_unlocked boolean default false,
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

-- ------------------------------------------------------------
-- 3.3 Conversations Table
-- ------------------------------------------------------------
create table if not exists public.conversations (
    id uuid primary default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    report_id uuid references public.reports(id) on delete cascade,
    title text,
    context_type text not null check (context_type in ('bazi', 'ziwei', 'iching', 'relationship', 'career', 'compatibility', 'general')),
    context_data jsonb default '{}'::jsonb,
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

-- 为 chat_messages 添加 report_id 外键（如果不存在）
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'chat_messages' and column_name = 'report_id') then
        alter table public.chat_messages add column report_id uuid references public.reports(id) on delete set null;
    end if;
end $$;

-- ------------------------------------------------------------
-- 3.4 Subscription Plans Table
-- ------------------------------------------------------------
create table if not exists public.subscription_plans (
    id text primary key,
    name text not null,
    name_cn text not null,
    description text,
    price_monthly decimal(10, 2) not null,
    price_yearly decimal(10, 2) not null,
    currency text default 'USD',
    features text[] default '{}',
    questions_per_month integer default 49,
    report_discount numeric(3, 2) default 1.0,
    free_reports_per_month integer default 0,
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

-- ------------------------------------------------------------
-- 3.5 Deep Question Purchases Table
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- 3.6 PayPal Orders Table
-- ------------------------------------------------------------
create table if not exists public.paypal_orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    paypal_order_id text unique,
    paypal_capture_id text,
    order_type text not null check (order_type in ('subscription', 'report', 'deep_questions')),
    product_id text,
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

-- ============================================================================
-- Part 4: Tables — Ziwei, I Ching, Email (Phase 4)
-- ============================================================================

-- ------------------------------------------------------------
-- 4.1 Ziwei Charts Table
-- ------------------------------------------------------------
create table if not exists public.ziwei_charts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    report_id uuid references public.reports(id) on delete cascade,
    name text,
    gender text check (gender in ('male', 'female', 'other')),
    birth_date timestamptz not null,
    birth_place text,
    longitude decimal(8, 4),
    life_palace_branch integer not null,
    life_palace_stem integer not null,
    body_palace text not null,
    life_palace_stars text[] default '{}',
    five_element_bureau text,
    pattern_name text,
    pattern_name_cn text,
    palaces jsonb default '[]'::jsonb,
    overall_reading jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists ziwei_charts_updated_at on public.ziwei_charts;
create trigger ziwei_charts_updated_at
    before update on public.ziwei_charts
    for each row
    execute function public.handle_updated_at();

create index if not exists idx_ziwei_charts_user_id on public.ziwei_charts(user_id);
create index if not exists idx_ziwei_charts_report_id on public.ziwei_charts(report_id);

-- ------------------------------------------------------------
-- 4.2 I Ching Readings Table
-- ------------------------------------------------------------
create table if not exists public.iching_readings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    report_id uuid references public.reports(id) on delete cascade,
    question text not null,
    casting_method text check (casting_method in ('coins', 'time', 'manual')) default 'coins',
    cast_time timestamptz default now(),
    hexagram_number integer not null,
    hexagram_name text,
    hexagram_name_cn text,
    hexagram_lines integer[] not null,
    changing_lines integer[] default '{}',
    changed_hexagram_number integer,
    changed_hexagram_name text,
    changed_hexagram_name_cn text,
    changed_hexagram_lines integer[],
    interpretation jsonb default '{}'::jsonb,
    tags text[] default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists iching_readings_updated_at on public.iching_readings;
create trigger iching_readings_updated_at
    before update on public.iching_readings
    for each row
    execute function public.handle_updated_at();

create index if not exists idx_iching_readings_user_id on public.iching_readings(user_id);
create index if not exists idx_iching_readings_report_id on public.iching_readings(report_id);
create index if not exists idx_iching_readings_hexagram on public.iching_readings(hexagram_number);

-- ------------------------------------------------------------
-- 4.3 I Ching Hexagrams Table (静态数据)
-- ------------------------------------------------------------
create table if not exists public.iching_hexagrams (
    number integer primary key,
    name text not null,
    name_cn text not null,
    pinyin text,
    category text,
    judgment text,
    judgment_cn text,
    image_text text,
    image_text_cn text,
    upper_trigram integer not null,
    lower_trigram integer not null,
    lines jsonb default '[]'::jsonb,
    element text,
    created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 4.4 Email Subscriptions Table
-- ------------------------------------------------------------
create table if not exists public.email_subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    email text not null,
    is_active boolean default true,
    frequency text check (frequency in ('daily', 'weekly')) default 'daily',
    preferences jsonb default '{
        "dailyFortune": true,
        "weeklyForecast": true,
        "specialOccasions": true,
        "productUpdates": false
    }'::jsonb,
    unsubscribe_token text not null unique default public.generate_unsubscribe_token(),
    last_sent_at timestamptz,
    subscribed_at timestamptz default now(),
    unsubscribed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists email_subscriptions_updated_at on public.email_subscriptions;
create trigger email_subscriptions_updated_at
    before update on public.email_subscriptions
    for each row
    execute function public.handle_updated_at();

create index if not exists idx_email_subscriptions_email on public.email_subscriptions(email);
create index if not exists idx_email_subscriptions_user_id on public.email_subscriptions(user_id);
create index if not exists idx_email_subscriptions_active on public.email_subscriptions(is_active) where is_active = true;
create index if not exists idx_email_subscriptions_token on public.email_subscriptions(unsubscribe_token);

-- ------------------------------------------------------------
-- 4.5 Daily Fortunes Table
-- ------------------------------------------------------------
create table if not exists public.daily_fortunes (
    id uuid primary key default uuid_generate_v4(),
    subscription_id uuid references public.email_subscriptions(id) on delete cascade,
    user_id uuid references public.users(id) on delete set null,
    fortune_date date not null,
    day_stem text,
    day_branch text,
    overall_score integer default 50,
    love_score integer default 50,
    career_score integer default 50,
    wealth_score integer default 50,
    health_score integer default 50,
    lucky_color text,
    lucky_number integer,
    lucky_direction text,
    daily_message text,
    daily_message_cn text,
    zodiac_fortunes jsonb default '{}'::jsonb,
    sent_at timestamptz,
    delivery_status text check (delivery_status in ('pending', 'sent', 'failed', 'bounced')) default 'pending',
    created_at timestamptz default now()
);

create index if not exists idx_daily_fortunes_user_id on public.daily_fortunes(user_id);
create index if not exists idx_daily_fortunes_date on public.daily_fortunes(fortune_date);
create index if not exists idx_daily_fortunes_subscription on public.daily_fortunes(subscription_id);

-- ------------------------------------------------------------
-- 4.6 Constellation Mansions Table (静态数据 - 二十八星宿)
-- ------------------------------------------------------------
create table if not exists public.constellation_mansions (
    number integer primary key,
    name text not null,
    name_cn text not null,
    pinyin text,
    symbol text check (symbol in ('dragon', 'phoenix', 'tiger', 'tortoise')),
    direction text check (direction in ('east', 'south', 'west', 'north')),
    animal text,
    animal_cn text,
    element text,
    stars_count integer default 0,
    meaning text,
    meaning_cn text,
    nature text check (nature in ('auspicious', 'neutral', 'inauspicious')),
    created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 4.7 Seven Governors Table (静态数据 - 七政)
-- ------------------------------------------------------------
create table if not exists public.seven_governors (
    id text primary key,
    name text not null,
    name_cn text not null,
    planet text,
    element text,
    nature text,
    nature_cn text,
    governs text,
    governs_cn text,
    description text,
    description_cn text,
    created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 4.8 Four Remainders Table (静态数据 - 四余)
-- ------------------------------------------------------------
create table if not exists public.four_remainders (
    id text primary key,
    name text not null,
    name_cn text not null,
    nature text,
    nature_cn text,
    meaning text,
    meaning_cn text,
    description text,
    description_cn text,
    created_at timestamptz default now()
);

-- ============================================================================
-- Part 5: Seed Data — 种子数据
-- ============================================================================

-- ------------------------------------------------------------
-- 5.1 Products (6款付费报告)
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- 5.2 Subscription Plans (两档会员)
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- 5.3 Constellation Mansions (二十八星宿)
-- ------------------------------------------------------------
insert into public.constellation_mansions 
    (number, name, name_cn, pinyin, symbol, direction, animal, animal_cn, element, stars_count, meaning, meaning_cn, nature)
values
    -- 东方青龙 (七宿)
    (1, 'Horn', '角木蛟', 'Jiǎo', 'dragon', 'east', 'Dragon', '蛟', 'Wood', 2, 'Beginning and initiation', '万物之始，主宰开端', 'auspicious'),
    (2, 'Neck', '亢金龙', 'Kàng', 'dragon', 'east', 'Dragon', '龙', 'Metal', 4, 'Neck passage, transition', '咽喉要道，过渡变化', 'neutral'),
    (3, 'Root', '氐土貉', 'Dī', 'dragon', 'east', 'Badger', '貉', 'Earth', 4, 'Foundation and roots', '根基根本，稳如磐石', 'auspicious'),
    (4, 'Room', '房日兔', 'Fáng', 'dragon', 'east', 'Rabbit', '兔', 'Sun', 4, 'Chamber and secrets', '房室幽秘，内藏玄机', 'neutral'),
    (5, 'Heart', '心月狐', 'Xīn', 'dragon', 'east', 'Fox', '狐', 'Moon', 3, 'Heart and core', '心之核心，情感中枢', 'auspicious'),
    (6, 'Tail', '尾火虎', 'Wěi', 'dragon', 'east', 'Tiger', '虎', 'Fire', 9, 'Tail end, completion', '末尾终结，善始善终', 'neutral'),
    (7, 'Winnowing Basket', '箕水豹', 'Jī', 'dragon', 'east', 'Leopard', '豹', 'Water', 4, 'Sifting and selection', '筛选甄别，去伪存真', 'auspicious'),
    -- 北方玄武 (七宿)
    (8, 'Dipper', '斗木獬', 'Dǒu', 'tortoise', 'north', 'Xie', '獬', 'Wood', 6, 'Measure and judgment', '衡量判断，明辨是非', 'auspicious'),
    (9, 'Ox', '牛金牛', 'Niú', 'tortoise', 'north', 'Bull', '牛', 'Metal', 6, 'Endurance and effort', '坚韧耐劳，默默耕耘', 'neutral'),
    (10, 'Girl', '女土蝠', 'Nǚ', 'tortoise', 'north', 'Bat', '蝠', 'Earth', 4, 'Feminine wisdom', '女性智慧，阴柔之美', 'auspicious'),
    (11, 'Emptiness', '虚日鼠', 'Xū', 'tortoise', 'north', 'Rat', '鼠', 'Sun', 2, 'Void and potential', '虚空无为，蕴含潜能', 'neutral'),
    (12, 'Rooftop', '危月燕', 'Wēi', 'tortoise', 'north', 'Swallow', '燕', 'Moon', 3, 'Danger and height', '高处不胜寒，危机并存', 'inauspicious'),
    (13, 'Encampment', '室火猪', 'Shì', 'tortoise', 'north', 'Pig', '猪', 'Fire', 2, 'Shelter and rest', '安营扎寨，休养生息', 'auspicious'),
    (14, 'Wall', '壁水貐', 'Bì', 'tortoise', 'north', 'Yu', '貐', 'Water', 2, 'Protection and boundary', '屏障守护，界限分明', 'auspicious'),
    -- 西方白虎 (七宿)
    (15, 'Legs', '奎木狼', 'Kuí', 'tiger', 'west', 'Wolf', '狼', 'Wood', 16, 'First steps, legs', '初始步履，万事开头', 'neutral'),
    (16, 'Bond', '娄金狗', 'Lóu', 'tiger', 'west', 'Dog', '狗', 'Metal', 3, 'Gathering together', '聚集联合，众志成城', 'auspicious'),
    (17, 'Stomach', '胃土雉', 'Wèi', 'tiger', 'west', 'Pheasant', '雉', 'Earth', 3, 'Storage and nourishment', '积蓄滋养，厚积薄发', 'auspicious'),
    (18, 'Hairy Head', '昴日鸡', 'Mǎo', 'tiger', 'west', 'Rooster', '鸡', 'Sun', 7, 'Brightness and clarity', '光明磊落，清晰明朗', 'auspicious'),
    (19, 'Net', '毕月乌', 'Bì', 'tiger', 'west', 'Crow', '乌', 'Moon', 8, 'Net and capture', '天网恢恢，疏而不漏', 'neutral'),
    (20, 'Beak', '觜火猴', 'Zī', 'tiger', 'west', 'Monkey', '猴', 'Fire', 3, 'Beak and speech', '嘴舌言语，谨慎表达', 'neutral'),
    (21, 'Three Stars', '参水猿', 'Shēn', 'tiger', 'west', 'Ape', '猿', 'Water', 7, 'Three stars, triad', '三星高照，三位一体', 'auspicious'),
    -- 南方朱雀 (七宿)
    (22, 'Well', '井木犴', 'Jǐng', 'phoenix', 'south', 'Han', '犴', 'Wood', 8, 'Wellspring and depth', '源泉深远，取之不竭', 'auspicious'),
    (23, 'Ghost', '鬼金羊', 'Guǐ', 'phoenix', 'south', 'Sheep', '羊', 'Metal', 4, 'Spirit and mystery', '鬼神莫测，神秘难测', 'inauspicious'),
    (24, 'Willow', '柳土獐', 'Liǔ', 'phoenix', 'south', 'Deer', '獐', 'Earth', 8, 'Flexibility and grace', '柔顺优雅，灵活应变', 'neutral'),
    (25, 'Star', '星日马', 'Xīng', 'phoenix', 'south', 'Horse', '马', 'Sun', 7, 'Starlight and guidance', '星光指引，照亮前路', 'auspicious'),
    (26, 'Extended Net', '张月鹿', 'Zhāng', 'phoenix', 'south', 'Deer', '鹿', 'Moon', 6, 'Expansion and spread', '扩张延展，大展宏图', 'auspicious'),
    (27, 'Wings', '翼火蛇', 'Yì', 'phoenix', 'south', 'Snake', '蛇', 'Fire', 22, 'Wings and flight', '展翅高飞，青云直上', 'auspicious'),
    (28, 'Chariot', '轸水蚓', 'Zhěn', 'phoenix', 'south', 'Earthworm', '蚓', 'Water', 4, 'Chariot and movement', '车轮滚滚，生生不息', 'neutral')
on conflict (number) do nothing;

-- ------------------------------------------------------------
-- 5.4 Seven Governors (七政)
-- ------------------------------------------------------------
insert into public.seven_governors (id, name, name_cn, planet, element, nature, nature_cn, governs, governs_cn, description, description_cn)
values
    ('sun', 'Sun', '太阳', 'Sun', 'Fire', 'Benevolent', '仁德', 'Fame and vitality', '名誉与生机', 'The Sun represents vitality, fame, and leadership. It governs the heart and spirit.', '太阳主生机、名誉与领导，掌管心与神明。'),
    ('moon', 'Moon', '太阴', 'Moon', 'Water', 'Nurturing', '滋养', 'Emotions and intuition', '情感与直觉', 'The Moon represents emotions, intuition, and the inner world. It governs the kidneys and fluids.', '太阴主情感、直觉与内心世界，掌管肾与水液。'),
    ('mercury', 'Mercury', '水星', 'Mercury', 'Water', 'Wise', '智慧', 'Intellect and communication', '智慧与沟通', 'Mercury represents wisdom, communication, and adaptability. It governs the nervous system.', '水星主智慧、沟通与应变，掌管神经系统。'),
    ('venus', 'Venus', '金星', 'Venus', 'Metal', 'Beautiful', '美丽', 'Love and aesthetics', '爱情与审美', 'Venus represents love, beauty, and harmony. It governs relationships and artistic taste.', '金星主爱情、美丽与和谐，掌管感情与审美。'),
    ('mars', 'Mars', '火星', 'Mars', 'Fire', 'Courageous', '勇武', 'Action and courage', '行动与勇气', 'Mars represents courage, action, and drive. It governs energy and competitive spirit.', '火星主勇气、行动与魄力，掌管精力与竞争心。'),
    ('jupiter', 'Jupiter', '木星', 'Jupiter', 'Wood', 'Expansive', '扩张', 'Growth and fortune', '成长与福气', 'Jupiter represents expansion, growth, and good fortune. It governs generosity and optimism.', '木星主扩张、成长与福气，掌管宽厚与乐观。'),
    ('saturn', 'Saturn', '土星', 'Saturn', 'Earth', 'Disciplined', '严谨', 'Discipline and structure', '纪律与结构', 'Saturn represents discipline, responsibility, and limitation. It governs structure and endurance.', '土星主纪律、责任与限制，掌管结构与耐力。')
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 5.5 Four Remainders (四余)
-- ------------------------------------------------------------
insert into public.four_remainders (id, name, name_cn, nature, nature_cn, meaning, meaning_cn, description, description_cn)
values
    ('luohou', 'Rahu', '罗睺', 'Turbulent', '动荡', 'Eclipse and obstruction', '蚀星与阻滞', 'Rahu (North Node) represents karmic patterns, sudden changes, and obstacles.', '罗睺（北交点）主业力模式、突变与阻滞。'),
    ('jidu', 'Ketu', '计都', 'Mysterious', '玄秘', 'Spirit and spirituality', '灵性与超自然', 'Ketu (South Node) represents spirituality, the unseen, and past life patterns.', '计都（南交点）主灵性、幽冥与前世模式。'),
    ('ziqi', 'Purple Qi', '紫气', 'Auspicious', '祥瑞', 'Noble qi and blessings', '贵气与福泽', 'Purple Qi represents hidden virtues, blessings, and unexpected good fortune.', '紫气主隐德、福报与意外之喜。'),
    ('yuebo', 'Yue Bo', '月孛', 'Eccentric', '怪异', 'Unconventional energy', '奇异能量', 'Yue Bo represents eccentric energy, rebellion, and unconventional paths.', '月孛主奇异能量、叛逆与非传统路径。')
on conflict (id) do nothing;

-- ============================================================================
-- Part 6: RLS Policies — 行级安全策略
-- ============================================================================

-- 启用 RLS
alter table public.users enable row level security;
alter table public.bazi_readings enable row level security;
alter table public.subscriptions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.orders enable row level security;
alter table public.products enable row level security;
alter table public.reports enable row level security;
alter table public.conversations enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.deep_question_purchases enable row level security;
alter table public.paypal_orders enable row level security;
alter table public.ziwei_charts enable row level security;
alter table public.iching_readings enable row level security;
alter table public.iching_hexagrams enable row level security;
alter table public.email_subscriptions enable row level security;
alter table public.daily_fortunes enable row level security;
alter table public.constellation_mansions enable row level security;
alter table public.seven_governors enable row level security;
alter table public.four_remainders enable row level security;

-- ------------------------------------------------------------
-- 6.1 Users
-- ------------------------------------------------------------
drop policy if exists "Users can view their own profile" on public.users;
create policy "Users can view their own profile"
    on public.users for select
    using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can update their own profile"
    on public.users for update
    using (auth.uid() = id);

-- ------------------------------------------------------------
-- 6.2 Bazi Readings
-- ------------------------------------------------------------
drop policy if exists "Users can view their own bazi readings" on public.bazi_readings;
create policy "Users can view their own bazi readings"
    on public.bazi_readings for select
    using (auth.uid() = user_id);

drop policy if exists "Users can create their own bazi readings" on public.bazi_readings;
create policy "Users can create their own bazi readings"
    on public.bazi_readings for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can update their own bazi readings" on public.bazi_readings;
create policy "Users can update their own bazi readings"
    on public.bazi_readings for update
    using (auth.uid() = user_id);

drop policy if exists "Users can delete their own bazi readings" on public.bazi_readings;
create policy "Users can delete their own bazi readings"
    on public.bazi_readings for delete
    using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.3 Subscriptions
-- ------------------------------------------------------------
drop policy if exists "Users can view their own subscriptions" on public.subscriptions;
create policy "Users can view their own subscriptions"
    on public.subscriptions for select
    using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.4 Chat Messages
-- ------------------------------------------------------------
drop policy if exists "Users can view their own chat messages" on public.chat_messages;
create policy "Users can view their own chat messages"
    on public.chat_messages for select
    using (auth.uid() = user_id);

drop policy if exists "Users can create their own chat messages" on public.chat_messages;
create policy "Users can create their own chat messages"
    on public.chat_messages for insert
    with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.5 Orders
-- ------------------------------------------------------------
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.6 Products (公开)
-- ------------------------------------------------------------
drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone"
    on public.products for select
    using (true);

-- ------------------------------------------------------------
-- 6.7 Reports
-- ------------------------------------------------------------
drop policy if exists "Users can view their own reports" on public.reports;
create policy "Users can view their own reports"
    on public.reports for select
    using (auth.uid() = user_id);

drop policy if exists "Users can create their own reports" on public.reports;
create policy "Users can create their own reports"
    on public.reports for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can update their own reports" on public.reports;
create policy "Users can update their own reports"
    on public.reports for update
    using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.8 Conversations
-- ------------------------------------------------------------
drop policy if exists "Users can view their own conversations" on public.conversations;
create policy "Users can view their own conversations"
    on public.conversations for select
    using (auth.uid() = user_id);

drop policy if exists "Users can create their own conversations" on public.conversations;
create policy "Users can create their own conversations"
    on public.conversations for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can update their own conversations" on public.conversations;
create policy "Users can update their own conversations"
    on public.conversations for update
    using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.9 Subscription Plans (公开)
-- ------------------------------------------------------------
drop policy if exists "Subscription plans are viewable by everyone" on public.subscription_plans;
create policy "Subscription plans are viewable by everyone"
    on public.subscription_plans for select
    using (true);

-- ------------------------------------------------------------
-- 6.10 Deep Question Purchases
-- ------------------------------------------------------------
drop policy if exists "Users can view their own deep question purchases" on public.deep_question_purchases;
create policy "Users can view their own deep question purchases"
    on public.deep_question_purchases for select
    using (auth.uid() = user_id);

drop policy if exists "Users can create their own deep question purchases" on public.deep_question_purchases;
create policy "Users can create their own deep question purchases"
    on public.deep_question_purchases for insert
    with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.11 PayPal Orders
-- ------------------------------------------------------------
drop policy if exists "Users can view their own paypal orders" on public.paypal_orders;
create policy "Users can view their own paypal orders"
    on public.paypal_orders for select
    using (auth.uid() = user_id);

drop policy if exists "Users can create their own paypal orders" on public.paypal_orders;
create policy "Users can create their own paypal orders"
    on public.paypal_orders for insert
    with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.12 Ziwei Charts
-- ------------------------------------------------------------
drop policy if exists "Users can view their own ziwei charts" on public.ziwei_charts;
create policy "Users can view their own ziwei charts"
    on public.ziwei_charts for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert their own ziwei charts" on public.ziwei_charts;
create policy "Users can insert their own ziwei charts"
    on public.ziwei_charts for insert
    with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.13 I Ching Readings
-- ------------------------------------------------------------
drop policy if exists "Users can view their own iching readings" on public.iching_readings;
create policy "Users can view their own iching readings"
    on public.iching_readings for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert their own iching readings" on public.iching_readings;
create policy "Users can insert their own iching readings"
    on public.iching_readings for insert
    with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.14 I Ching Hexagrams (公开)
-- ------------------------------------------------------------
drop policy if exists "I Ching hexagrams are publicly viewable" on public.iching_hexagrams;
create policy "I Ching hexagrams are publicly viewable"
    on public.iching_hexagrams for select
    using (true);

-- ------------------------------------------------------------
-- 6.15 Email Subscriptions
-- ------------------------------------------------------------
drop policy if exists "Users can view their own email subscriptions" on public.email_subscriptions;
create policy "Users can view their own email subscriptions"
    on public.email_subscriptions for select
    using (auth.uid() = user_id or email = current_setting('request.jwt.claims', true)::jsonb->>'email');

drop policy if exists "Users can insert subscriptions" on public.email_subscriptions;
create policy "Users can insert subscriptions"
    on public.email_subscriptions for insert
    with check (true);

drop policy if exists "Users can update their own email subscriptions" on public.email_subscriptions;
create policy "Users can update their own email subscriptions"
    on public.email_subscriptions for update
    using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.16 Daily Fortunes
-- ------------------------------------------------------------
drop policy if exists "Users can view their own daily fortunes" on public.daily_fortunes;
create policy "Users can view their own daily fortunes"
    on public.daily_fortunes for select
    using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6.17 Static Data (公开)
-- ------------------------------------------------------------
drop policy if exists "Constellation mansions are publicly viewable" on public.constellation_mansions;
create policy "Constellation mansions are publicly viewable"
    on public.constellation_mansions for select
    using (true);

drop policy if exists "Seven governors are publicly viewable" on public.seven_governors;
create policy "Seven governors are publicly viewable"
    on public.seven_governors for select
    using (true);

drop policy if exists "Four remainders are publicly viewable" on public.four_remainders;
create policy "Four remainders are publicly viewable"
    on public.four_remainders for select
    using (true);

-- ============================================================================
-- Part 7: Verification — 验证
-- ============================================================================

-- 执行完成后，可以运行以下查询验证：

-- 1. 表数量（应为 21 张公开表）
-- SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- 2. 产品数据
-- SELECT id, name, price, is_active FROM products ORDER BY sort_order;

-- 3. 二十八星宿数量（应为 28）
-- SELECT COUNT(*) FROM constellation_mansions;

-- 4. 七政四余数量（7 + 4）
-- SELECT COUNT(*) FROM seven_governors;
-- SELECT COUNT(*) FROM four_remainders;

-- ============================================================================
-- 初始化完成
-- ============================================================================
