-- ============================================================================
-- Phase 4 Schema - 紫微斗数、易经、邮件订阅
-- 明道 Phase 4 数据库表设计
-- ============================================================================

-- 确保 uuid extension 可用
create extension if not exists "uuid-ossp";

-- 确保 updated_at 触发器函数存在
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- ============================================================================
-- 1. 紫微斗数命盘表 - Ziwei Dou Shu Charts
-- ============================================================================
create table if not exists public.ziwei_charts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    report_id uuid references public.reports(id) on delete cascade,
    
    -- 基本信息
    name text,
    gender text check (gender in ('male', 'female', 'other')),
    birth_date timestamptz not null,
    birth_place text,
    longitude decimal(8, 4),
    
    -- 命宫信息
    life_palace_branch integer not null,
    life_palace_stem integer not null,
    body_palace text not null,
    life_palace_stars text[] default '{}',
    
    -- 五行局
    five_element_bureau text,
    
    -- 格局
    pattern_name text,
    pattern_name_cn text,
    
    -- 十二宫完整数据 (JSON)
    palaces jsonb default '[]'::jsonb,
    
    -- 整体解读 (JSON)
    overall_reading jsonb default '{}'::jsonb,
    
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists ziwei_charts_updated_at on public.ziwei_charts;
create trigger ziwei_charts_updated_at
    before update on public.ziwei_charts
    for each row
    execute function public.handle_updated_at();

-- RLS
alter table public.ziwei_charts enable row level security;

drop policy if exists "Users can view their own ziwei charts" on public.ziwei_charts;
create policy "Users can view their own ziwei charts"
    on public.ziwei_charts for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert their own ziwei charts" on public.ziwei_charts;
create policy "Users can insert their own ziwei charts"
    on public.ziwei_charts for insert
    with check (auth.uid() = user_id);

-- 索引
create index if not exists idx_ziwei_charts_user_id on public.ziwei_charts(user_id);
create index if not exists idx_ziwei_charts_report_id on public.ziwei_charts(report_id);

-- ============================================================================
-- 2. 易经卦象表 - I Ching Readings
-- ============================================================================
create table if not exists public.iching_readings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    report_id uuid references public.reports(id) on delete cascade,
    
    -- 问题
    question text not null,
    
    -- 起卦方式
    casting_method text check (casting_method in ('coins', 'time', 'manual')) default 'coins',
    cast_time timestamptz default now(),
    
    -- 本卦
    hexagram_number integer not null,
    hexagram_name text,
    hexagram_name_cn text,
    hexagram_lines integer[] not null,  -- 6个数字，0=阴，1=阳
    
    -- 变爻
    changing_lines integer[] default '{}',  -- 变爻位置 1-6
    
    -- 变卦
    changed_hexagram_number integer,
    changed_hexagram_name text,
    changed_hexagram_name_cn text,
    changed_hexagram_lines integer[],
    
    -- 解读 (JSON)
    interpretation jsonb default '{}'::jsonb,
    
    -- 标签 (用于检索)
    tags text[] default '{}',
    
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

drop trigger if exists iching_readings_updated_at on public.iching_readings;
create trigger iching_readings_updated_at
    before update on public.iching_readings
    for each row
    execute function public.handle_updated_at();

-- RLS
alter table public.iching_readings enable row level security;

drop policy if exists "Users can view their own iching readings" on public.iching_readings;
create policy "Users can view their own iching readings"
    on public.iching_readings for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert their own iching readings" on public.iching_readings;
create policy "Users can insert their own iching readings"
    on public.iching_readings for insert
    with check (auth.uid() = user_id);

-- 索引
create index if not exists idx_iching_readings_user_id on public.iching_readings(user_id);
create index if not exists idx_iching_readings_report_id on public.iching_readings(report_id);
create index if not exists idx_iching_readings_hexagram on public.iching_readings(hexagram_number);

-- ============================================================================
-- 3. 易经卦象数据表 (静态数据) - I Ching Hexagrams Data
-- ============================================================================
create table if not exists public.iching_hexagrams (
    number integer primary key,
    name text not null,
    name_cn text not null,
    pinyin text,
    category text,
    
    -- 卦辞
    judgment text,
    judgment_cn text,
    
    -- 象辞
    image_text text,
    image_text_cn text,
    
    -- 上下卦
    upper_trigram integer not null,  -- 0-7
    lower_trigram integer not null,  -- 0-7
    
    -- 爻辞 (JSON数组)
    lines jsonb default '[]'::jsonb,
    
    -- 五行属性
    element text,
    
    created_at timestamptz default now()
);

-- 公开可读
alter table public.iching_hexagrams enable row level security;

drop policy if exists "I Ching hexagrams are publicly viewable" on public.iching_hexagrams;
create policy "I Ching hexagrams are publicly viewable"
    on public.iching_hexagrams for select
    using (true);

-- ============================================================================
-- 4. 邮件订阅表 - Email Subscriptions
-- ============================================================================
create table if not exists public.email_subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    email text not null,
    
    -- 订阅状态
    is_active boolean default true,
    frequency text check (frequency in ('daily', 'weekly')) default 'daily',
    
    -- 订阅偏好
    preferences jsonb default '{
        "dailyFortune": true,
        "weeklyForecast": true,
        "specialOccasions": true,
        "productUpdates": false
    }'::jsonb,
    
    -- 退订token (用于安全退订)
    unsubscribe_token text not null unique,
    
    -- 上次发送时间
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

-- RLS
alter table public.email_subscriptions enable row level security;

drop policy if exists "Users can view their own subscriptions" on public.email_subscriptions;
create policy "Users can view their own subscriptions"
    on public.email_subscriptions for select
    using (auth.uid() = user_id or email = current_setting('request.jwt.claims', true)::jsonb->>'email');

drop policy if exists "Users can insert subscriptions" on public.email_subscriptions;
create policy "Users can insert subscriptions"
    on public.email_subscriptions for insert
    with check (true);  -- 允许非登录用户订阅

drop policy if exists "Users can update their own subscriptions" on public.email_subscriptions;
create policy "Users can update their own subscriptions"
    on public.email_subscriptions for update
    using (auth.uid() = user_id);

-- 索引
create index if not exists idx_email_subscriptions_email on public.email_subscriptions(email);
create index if not exists idx_email_subscriptions_user_id on public.email_subscriptions(user_id);
create index if not exists idx_email_subscriptions_active on public.email_subscriptions(is_active) where is_active = true;
create index if not exists idx_email_subscriptions_token on public.email_subscriptions(unsubscribe_token);

-- ============================================================================
-- 5. 每日运势表 - Daily Fortunes (邮件内容存档)
-- ============================================================================
create table if not exists public.daily_fortunes (
    id uuid primary key default uuid_generate_v4(),
    subscription_id uuid references public.email_subscriptions(id) on delete cascade,
    user_id uuid references public.users(id) on delete set null,
    
    -- 日期
    fortune_date date not null,
    
    -- 当日干支
    day_stem text,
    day_branch text,
    
    -- 运势分数 (1-100)
    overall_score integer default 50,
    love_score integer default 50,
    career_score integer default 50,
    wealth_score integer default 50,
    health_score integer default 50,
    
    -- 幸运物
    lucky_color text,
    lucky_number integer,
    lucky_direction text,
    
    -- 今日运势内容
    daily_message text,
    daily_message_cn text,
    
    -- 生肖运势 (JSON)
    zodiac_fortunes jsonb default '{}'::jsonb,
    
    -- 发送状态
    sent_at timestamptz,
    delivery_status text check (delivery_status in ('pending', 'sent', 'failed', 'bounced')) default 'pending',
    
    created_at timestamptz default now()
);

-- RLS
alter table public.daily_fortunes enable row level security;

drop policy if exists "Users can view their own daily fortunes" on public.daily_fortunes;
create policy "Users can view their own daily fortunes"
    on public.daily_fortunes for select
    using (auth.uid() = user_id);

-- 索引
create index if not exists idx_daily_fortunes_user_id on public.daily_fortunes(user_id);
create index if not exists idx_daily_fortunes_date on public.daily_fortunes(fortune_date);
create index if not exists idx_daily_fortunes_subscription on public.daily_fortunes(subscription_id);

-- ============================================================================
-- 6. 二十八星宿表 - 28 Mansions (静态数据)
-- ============================================================================
create table if not exists public.constellation_mansions (
    number integer primary key,
    name text not null,
    name_cn text not null,
    pinyin text,
    
    -- 四象归属
    symbol text check (symbol in ('dragon', 'phoenix', 'tiger', 'tortoise')),
    direction text check (direction in ('east', 'south', 'west', 'north')),
    
    -- 动物象征
    animal text,
    animal_cn text,
    
    -- 五行
    element text,
    
    -- 主星数量
    stars_count integer default 0,
    
    -- 含义
    meaning text,
    meaning_cn text,
    
    -- 吉凶
    nature text check (nature in ('auspicious', 'neutral', 'inauspicious')),
    
    created_at timestamptz default now()
);

-- 公开可读
alter table public.constellation_mansions enable row level security;

drop policy if exists "Constellation mansions are publicly viewable" on public.constellation_mansions;
create policy "Constellation mansions are publicly viewable"
    on public.constellation_mansions for select
    using (true);

-- ============================================================================
-- 7. 七政四余表 - Seven Governors & Four Remainders (静态数据)
-- ============================================================================
create table if not exists public.seven_governors (
    id text primary key,  -- sun, moon, mercury, venus, mars, jupiter, saturn
    name text not null,
    name_cn text not null,
    
    -- 行星
    planet text,
    
    -- 五行
    element text,
    
    -- 性质
    nature text,
    nature_cn text,
    
    -- 主掌
    governs text,
    governs_cn text,
    
    description text,
    description_cn text,
    
    created_at timestamptz default now()
);

-- 公开可读
alter table public.seven_governors enable row level security;

drop policy if exists "Seven governors are publicly viewable" on public.seven_governors;
create policy "Seven governors are publicly viewable"
    on public.seven_governors for select
    using (true);

-- 四余
create table if not exists public.four_remainders (
    id text primary key,  -- luohou, jidu, ziqi, yuebo
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

alter table public.four_remainders enable row level security;

drop policy if exists "Four remainders are publicly viewable" on public.four_remainders;
create policy "Four remainders are publicly viewable"
    on public.four_remainders for select
    using (true);

-- ============================================================================
-- 插入初始数据: 二十八星宿
-- ============================================================================
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

-- ============================================================================
-- 插入初始数据: 七政四余
-- ============================================================================
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

insert into public.four_remainders (id, name, name_cn, nature, nature_cn, meaning, meaning_cn, description, description_cn)
values
    ('luohou', 'Rahu', '罗睺', 'Turbulent', '动荡', 'Eclipse and obstruction', '蚀星与阻滞', 'Rahu (North Node) represents karmic patterns, sudden changes, and obstacles.', '罗睺（北交点）主业力模式、突变与阻滞。'),
    ('jidu', 'Ketu', '计都', 'Mysterious', '玄秘', 'Spirit and spirituality', '灵性与超自然', 'Ketu (South Node) represents spirituality, the unseen, and past life patterns.', '计都（南交点）主灵性、幽冥与前世模式。'),
    ('ziqi', 'Purple Qi', '紫气', 'Auspicious', '祥瑞', 'Noble qi and blessings', '贵气与福泽', 'Purple Qi represents hidden virtues, blessings, and unexpected good fortune.', '紫气主隐德、福报与意外之喜。'),
    ('yuebo', 'Yue Bo', '月孛', 'Eccentric', '怪异', 'Unconventional energy', '奇异能量', 'Yue Bo represents eccentric energy, rebellion, and unconventional paths.', '月孛主奇异能量、叛逆与非传统路径。')
on conflict (id) do nothing;

-- ============================================================================
-- Phase 4 完成
-- ============================================================================
