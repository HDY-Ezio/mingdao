# 明道 MINGDAO — Light Your Path

> Ancient Eastern wisdom for modern self-discovery.

An elegant web application bringing 3,000 years of Chinese metaphysics to Western seekers — Bazi, Purple Star Astrology, and I Ching divination, all in one place.

## ✨ Features

### MVP Phase 1 (Current)
- **Complete Design System** — Eastern ink-wash aesthetic with warm gold and cinnabar accents
- **Diagonal Dual Background** — 古籍书封风格斜对角双背景 (28 Mansions top-left + Four Symbols bottom-right)
- **Seasonal Themes** — Auto-switching based on current season (青龙/朱雀/白虎/玄武)
- **Responsive Landing Page** — Hero, services, why us, testimonials, FAQ
- **Additional Pages** — Services, About, Blog, Login, Register
- **Email Templates** — React Email style with VML Outlook compatibility, seasonal themes
- **Shadcn-style UI Components** — Button, Card, Input

### Coming Soon
- Supabase authentication & database
- Interactive Bazi calculator
- Purple Star chart generator
- I Ching divination interface
- User dashboard
- Daily horoscope email

## 🛠 Tech Stack

- **Framework**: Next.js 16+ (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **UI**: Custom shadcn-style components
- **Backend**: Supabase (auth + database)
- **Email**: React Email + Resend
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Resend credentials

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `RESEND_API_KEY` | Resend API key for emails |
| `NEXT_PUBLIC_APP_URL` | Full app URL for links |

## 🎨 Design System

### Color Palette
- **Ink (墨色)**: Primary dark colors — `ink-50` to `ink-950`
- **Gold (金色)**: Accent warm gold — `gold-50` to `gold-900`
- **Cinnabar (朱砂)**: Red accent — `cinnabar-50` to `cinnabar-900`
- **Jade (玉石)**: Green accent — `jade-50` to `jade-900`
- **Paper (宣纸)**: Background warm off-white

### Four Symbols (四象)
- 🐉 **Azure Dragon (青龙)** — Spring / East / Jade green
- 🐦 **Vermilion Bird (朱雀)** — Summer / South / Cinnabar red
- 🐅 **White Tiger (白虎)** — Autumn / West / Warm white
- 🐢 **Black Tortoise (玄武)** — Winter / North / Deep ink

### Typography
- **Headings**: Cormorant Garamond (serif, elegant)
- **Body**: Inter (sans-serif, clean)

### Key Design Features
- **Diagonal dual background** — 古籍书封斜对角布局
- **Ink-wash texture** — Subtle paper grain
- **Generous whitespace** — Zen-like minimalism
- **Seal-style logo** — 印章效果
- **Star constellation pattern** — 二十八星宿点阵

## 📁 Project Structure

```
mingdao/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Design system CSS
│   │   ├── page.tsx            # Home page
│   │   ├── about/page.tsx      # About page
│   │   ├── services/page.tsx   # Services overview
│   │   ├── blog/page.tsx       # Wisdom Journal
│   │   ├── login/page.tsx      # Sign in
│   │   └── register/page.tsx   # Sign up
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Layout components (nav, footer, bg)
│   │   └── home/               # Home page sections
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   ├── star-calendar.ts    # 二十八宿 + 四象 calculator
│   │   └── supabase/           # Supabase clients
│   └── types/                  # TypeScript type definitions
├── emails/                     # React Email templates
│   ├── layout.tsx              # Email base layout
│   ├── theme.ts                # Email design system
│   ├── welcome-email.tsx       # Welcome email
│   └── components/             # Email header & footer
├── public/                     # Static assets
├── .env.example                # Environment variables template
└── package.json
```

## 🌌 Star Calendar System

The app features a traditional Chinese star calendar system:

### 28 Mansions (二十八宿)
Daily rotating constellation system. The "mansion of the day" is calculated based on the date and used for background theming and content personalization.

### Four Symbols (四象)
Seasonal guardian spirits that govern the four directions and seasons. The theme automatically switches based on the current season (aligned with solar terms).

## 📝 Notes

- All copy is in English, targeting Western audiences
- Terms used: "destiny reading," "ancient wisdom," "personal guidance" (not "fortune-telling")
- Brand positioning: self-discovery tool, not a superstition product
- Mobile-first responsive design
- Static pages first — interactivity added in future phases

## 📜 License

Private / Proprietary
