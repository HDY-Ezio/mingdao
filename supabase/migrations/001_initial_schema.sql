-- ============================================================================
-- Mingdao Database Schema
-- 明道数据库表设计
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. Users Profile Table - 用户信息表（扩展 auth.users）
-- ============================================================================
create table if not exists public.users (
    id uuid references auth.users(id) primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    gender text check (gender in ('male', 'female', 'other')),
    birth_date date,
    birth_place text,
    timezone text default 'UTC',
    is_subscribed boolean default true,        -- 是否订阅邮件
    subscription_type text default 'free',     -- free, premium, pro
    credits integer default 10,                -- AI对话积分
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 自动更新 updated_at 的触发器函数
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- users 表的 updated_at 触发器
drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at
    before update on public.users
    for each row
    execute function public.handle_updated_at();

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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- ============================================================================
-- 2. Bazi Readings Table - 八字排盘记录表
-- ============================================================================
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
    
    -- 排盘结果（JSON 存储，方便查询）
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
    
    -- 完整排盘数据（JSON，前端可直接使用）
    chart_data jsonb,
    
    -- 是否为完整报告（付费）
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

-- ============================================================================
-- 3. Subscriptions Table - 订阅记录表
-- ============================================================================
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

-- ============================================================================
-- 4. Chat Messages Table - AI对话记录表
-- ============================================================================
create table if not exists public.chat_messages (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    conversation_id uuid,
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

-- ============================================================================
-- 5. Orders Table - 订单记录表
-- ============================================================================
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    order_type text not null check (order_type in ('subscription', 'bazi_report', 'iching_reading', 'credits')),
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
-- 6. Email Subscriptions Table - 邮件订阅表（运势推送等）
-- ============================================================================
create table if not exists public.email_subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    email text not null unique,
    daily_fortune boolean default true,
    weekly_horoscope boolean default true,
    special_alerts boolean default false,
    marketing boolean default false,
    unsubscribe_token text unique,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists email_subscriptions_updated_at on public.email_subscriptions;
create trigger email_subscriptions_updated_at
    before update on public.email_subscriptions
    for each row
    execute function public.handle_updated_at();

-- ============================================================================
-- RLS (Row Level Security) Policies
-- ============================================================================

-- 启用 RLS
alter table public.users enable row level security;
alter table public.bazi_readings enable row level security;
alter table public.subscriptions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.orders enable row level security;
alter table public.email_subscriptions enable row level security;

-- Users: 用户只能查看和修改自己的资料
create policy "Users can view their own profile"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.users for update
    using (auth.uid() = id);

-- Bazi Readings: 用户只能查看自己的排盘记录
create policy "Users can view their own bazi readings"
    on public.bazi_readings for select
    using (auth.uid() = user_id);

create policy "Users can create their own bazi readings"
    on public.bazi_readings for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own bazi readings"
    on public.bazi_readings for update
    using (auth.uid() = user_id);

create policy "Users can delete their own bazi readings"
    on public.bazi_readings for delete
    using (auth.uid() = user_id);

-- Subscriptions: 用户只能查看自己的订阅
create policy "Users can view their own subscriptions"
    on public.subscriptions for select
    using (auth.uid() = user_id);

-- Chat Messages: 用户只能查看自己的对话
create policy "Users can view their own chat messages"
    on public.chat_messages for select
    using (auth.uid() = user_id);

create policy "Users can create their own chat messages"
    on public.chat_messages for insert
    with check (auth.uid() = user_id);

-- Orders: 用户只能查看自己的订单
create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

-- Email Subscriptions: 用户只能管理自己的订阅
create policy "Users can view their own email subscriptions"
    on public.email_subscriptions for select
    using (auth.uid() = user_id or email = current_setting('request.jwt.claims', true)::json ->> 'email');

create policy "Users can update their own email subscriptions"
    on public.email_subscriptions for update
    using (auth.uid() = user_id or email = current_setting('request.jwt.claims', true)::json ->> 'email');
