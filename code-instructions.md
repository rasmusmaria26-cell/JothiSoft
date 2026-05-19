# JothiSoft — Code Instructions

> Developer reference for building the JothiSoft platform.  
> Stack: Next.js · TypeScript · Tailwind CSS · Node.js · PostgreSQL · Razorpay

---

## 1. Project Structure

```
jothisoft/
├── apps/
│   ├── web/                        # Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx      # Shell: header + sidebar + bottom nav
│   │   │   │   ├── page.tsx        # Dashboard home
│   │   │   │   ├── horoscope/
│   │   │   │   ├── panchangam/
│   │   │   │   ├── matching/
│   │   │   │   ├── numerology/
│   │   │   │   ├── prasnam/
│   │   │   │   ├── special-days/
│   │   │   │   └── settings/
│   │   │   ├── api/                # Next.js API routes (thin — proxy to backend)
│   │   │   └── layout.tsx          # Root layout (fonts, providers)
│   │   ├── components/
│   │   │   ├── ui/                 # Base design system components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Table.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── BottomNav.tsx
│   │   │   ├── astro/              # Domain-specific components
│   │   │   │   ├── RasiChart.tsx
│   │   │   │   ├── NavamsamChart.tsx
│   │   │   │   ├── DasaTable.tsx
│   │   │   │   ├── PlaceSearch.tsx
│   │   │   │   └── PlanetTable.tsx
│   │   │   └── dashboard/
│   │   │       ├── ModuleCard.tsx
│   │   │       ├── CategorySection.tsx
│   │   │       └── UserInfoCard.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useHoroscope.ts
│   │   │   └── useSubscription.ts
│   │   ├── lib/
│   │   │   ├── api.ts              # Axios instance with interceptors
│   │   │   ├── auth.ts             # Token storage + refresh
│   │   │   └── constants.ts
│   │   ├── stores/
│   │   │   ├── authStore.ts        # Zustand auth state
│   │   │   └── profileStore.ts
│   │   └── types/
│   │       ├── astro.ts
│   │       ├── user.ts
│   │       └── subscription.ts
│   └── api/                        # Node.js Express backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── horoscope.ts
│       │   │   ├── matching.ts
│       │   │   ├── panchangam.ts
│       │   │   ├── numerology.ts
│       │   │   ├── subscription.ts
│       │   │   └── admin.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts         # JWT verification
│       │   │   ├── subscription.ts # Plan gating
│       │   │   ├── rateLimit.ts
│       │   │   └── errorHandler.ts
│       │   ├── services/
│       │   │   ├── astroEngine.ts  # Wrapper for calc engine
│       │   │   ├── razorpay.ts
│       │   │   ├── sms.ts          # OTP via Twilio/MSG91
│       │   │   └── pdf.ts          # Puppeteer PDF gen
│       │   ├── db/
│       │   │   ├── index.ts        # pg pool
│       │   │   ├── migrations/
│       │   │   └── seeds/
│       │   └── utils/
│       │       ├── jwt.ts
│       │       └── validators.ts
│       └── package.json
├── packages/
│   └── shared/                     # Shared TS types
│       └── types/
├── .env.example
└── package.json                    # Turborepo root
```

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14+ |
| Language | TypeScript | 5+ |
| Styling | Tailwind CSS | 3+ |
| State | Zustand | 4+ |
| Data fetching | TanStack Query | 5+ |
| Backend | Node.js + Express | 20 LTS |
| ORM | Drizzle ORM | Latest |
| Database | PostgreSQL | 16 |
| Auth | JWT (access + refresh) | — |
| Payments | Razorpay | Latest |
| PDF | Puppeteer | Latest |
| SMS/OTP | MSG91 | — |
| Hosting | VPS (DigitalOcean/Hostinger) | — |

---

## 3. Environment Variables

```env
# apps/api/.env

# App
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://jothisoft.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jothisoft

# JWT
JWT_SECRET=<32-char random string>
JWT_REFRESH_SECRET=<32-char random string>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=xxxx
RAZORPAY_WEBHOOK_SECRET=xxxx

# SMS (MSG91)
MSG91_AUTH_KEY=xxxx
MSG91_SENDER_ID=JOTHI
MSG91_OTP_TEMPLATE_ID=xxxx

# Astro Engine
ASTRO_ENGINE_URL=http://localhost:5001   # PHP or Python service
ASTRO_ENGINE_SECRET=xxxx

# apps/web/.env.local
NEXT_PUBLIC_API_URL=https://api.jothisoft.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxx
```

---

## 4. Database Schema

```sql
-- Users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         VARCHAR(15) UNIQUE NOT NULL,
  name          VARCHAR(100),
  password_hash TEXT NOT NULL,
  language      VARCHAR(10) DEFAULT 'ta',  -- 'ta' | 'en'
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription Plans
CREATE TABLE plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(50) NOT NULL,       -- 'monthly' | '3months' | 'yearly'
  duration_days INT NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  features      JSONB DEFAULT '[]',         -- feature flags
  is_active     BOOLEAN DEFAULT true
);

-- User Subscriptions
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id         UUID REFERENCES plans(id),
  razorpay_order_id   VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  status          VARCHAR(20) DEFAULT 'pending', -- pending|active|expired|cancelled
  starts_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Birth Profiles
CREATE TABLE birth_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  birth_date  DATE NOT NULL,
  birth_time  TIME NOT NULL,
  birth_place VARCHAR(200) NOT NULL,
  latitude    DECIMAL(9,6) NOT NULL,
  longitude   DECIMAL(9,6) NOT NULL,
  utc_offset  DECIMAL(4,2) NOT NULL,
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- City/Place Database
CREATE TABLE places (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  name_tamil  VARCHAR(200),
  state       VARCHAR(100),
  country     VARCHAR(100) DEFAULT 'India',
  latitude    DECIMAL(9,6) NOT NULL,
  longitude   DECIMAL(9,6) NOT NULL,
  utc_offset  DECIMAL(4,2) NOT NULL
);
CREATE INDEX places_name_idx ON places USING GIN (to_tsvector('simple', name));

-- OTP Store
CREATE TABLE otp_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       VARCHAR(15) NOT NULL,
  otp         VARCHAR(6) NOT NULL,
  purpose     VARCHAR(20),   -- 'login' | 'register' | 'reset'
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  action      VARCHAR(100),
  metadata    JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. API Design

### Base URL
```
https://api.jothisoft.com/v1
```

### Auth Endpoints

```
POST /auth/send-otp          { phone }
POST /auth/verify-otp        { phone, otp }
POST /auth/login             { phone, password }
POST /auth/refresh           { refreshToken }
POST /auth/logout
DELETE /auth/account         (requires password confirmation)
```

### Horoscope Endpoints

```
POST /horoscope/calculate    { name, date, month, year, hour, minute, ampm, place_id }
GET  /horoscope/profiles     (saved birth profiles)
POST /horoscope/profiles     (save new profile)
DELETE /horoscope/profiles/:id
```

### Subscription Endpoints

```
GET  /subscription/plans
POST /subscription/create-order  { plan_id }
POST /subscription/verify        { razorpay_payment_id, razorpay_order_id, razorpay_signature }
GET  /subscription/status
POST /subscription/webhook       (Razorpay webhook — no auth middleware)
```

### Places Endpoint

```
GET  /places/search?q=chennai&limit=10
```

### Response Format

```typescript
// Success
{
  success: true,
  data: { ... },
  meta?: { page, limit, total }
}

// Error
{
  success: false,
  error: {
    code: 'SUBSCRIPTION_EXPIRED',
    message: 'உங்கள் திட்டம் காலாவதியாகிவிட்டது',
    message_en: 'Your plan has expired'
  }
}
```

---

## 6. Authentication Flow

```typescript
// lib/auth.ts

// Access token: 15 min, stored in memory (Zustand)
// Refresh token: 30 days, stored in httpOnly cookie

// On every request — Axios interceptor:
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt silent refresh
      const newToken = await refreshAccessToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      }
      // Refresh failed — redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 7. Subscription Gating Middleware

```typescript
// api/middleware/subscription.ts

export const requireSubscription = async (req, res, next) => {
  const sub = await db.query(
    `SELECT * FROM subscriptions
     WHERE user_id = $1 AND status = 'active' AND expires_at > NOW()
     LIMIT 1`,
    [req.user.id]
  );

  if (sub.rows.length === 0) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'இந்த அம்சத்தை பயன்படுத்த சந்தா தேவை'
      }
    });
  }

  req.subscription = sub.rows[0];
  next();
};

// Usage in routes:
router.post('/horoscope/calculate', authenticate, requireSubscription, calculateHoroscope);
```

---

## 8. Astro Engine Integration

The calculation engine runs as a **separate service** (PHP or Python). The Node.js API calls it internally.

```typescript
// services/astroEngine.ts

const ENGINE_URL = process.env.ASTRO_ENGINE_URL;
const ENGINE_SECRET = process.env.ASTRO_ENGINE_SECRET;

export async function calculateHoroscope(params: HoroscopeInput) {
  const res = await fetch(`${ENGINE_URL}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Engine-Secret': ENGINE_SECRET,
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error('Astro engine calculation failed');
  return res.json();
}
```

---

## 9. PDF Generation

```typescript
// services/pdf.ts — using Puppeteer

export async function generateHoroscopePDF(data: HoroscopeData): Promise<Buffer> {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Load Tamil fonts in the PDF context
  await page.setContent(renderHoroscopeHTML(data), { waitUntil: 'networkidle0' });
  await page.addStyleTag({
    url: 'https://fonts.googleapis.com/css2?family=Anek+Tamil:wght@400;500;600&display=swap'
  });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
  });

  await browser.close();
  return pdf;
}
```

---

## 10. Tailwind Configuration

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          page:     '#1a1209',
          card:     '#241a0f',
          elevated: '#2e2115',
          active:   '#3d2d1c',
          border:   '#4a3828',
        },
        gold: {
          deep:   '#c9922a',
          mid:    '#e0a83a',
          bright: '#f2c96a',
          tint:   '#fff3cc',
        },
        text: {
          primary:   '#f5e6c8',
          secondary: '#d4b896',
          muted:     '#8a7060',
          disabled:  '#5a4838',
          inverse:   '#1a1209',
        },
        cat: {
          horoscope:  '#7b5ea7',
          panchangam: '#2e7d6b',
          marriage:   '#b0415e',
          numerology: '#1e6fa8',
          prasnam:    '#a05c1a',
          special:    '#4a7c59',
        },
      },
      fontFamily: {
        tamil:   ['Anek Tamil', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        sans:    ['Anek Tamil', 'sans-serif'],
      },
      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        xl:   '20px',
        pill: '999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 11. Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ModuleCard.tsx` |
| Hooks | camelCase + use prefix | `useHoroscope.ts` |
| API routes | kebab-case | `/horoscope/calculate` |
| DB tables | snake_case | `birth_profiles` |
| Env vars | SCREAMING_SNAKE | `RAZORPAY_KEY_ID` |
| CSS classes | Tailwind utility | `bg-bg-card text-text-primary` |
| Types/interfaces | PascalCase | `HoroscopeInput` |

---

## 12. Code Quality

```json
// .eslintrc
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "prefer-const": "error"
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 13. Git Workflow

```
main          → production (protected, no direct push)
staging       → staging server
dev           → active development

Branch naming:
  feature/horoscope-form
  fix/subscription-webhook
  chore/update-dependencies

Commit format (Conventional Commits):
  feat: add horoscope PDF download
  fix: correct dasa calculation for Saturn
  chore: update Razorpay SDK
  docs: update API reference
```

---

## 14. Deployment

```yaml
# docker-compose.yml (simplified)

services:
  web:
    build: ./apps/web
    environment:
      - NEXT_PUBLIC_API_URL=${API_URL}
    ports: ["3000:3000"]

  api:
    build: ./apps/api
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    ports: ["4000:4000"]
    depends_on: [db]

  astro-engine:
    build: ./engine         # PHP or Python service
    ports: ["5001:5001"]

  db:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]
    environment:
      - POSTGRES_DB=jothisoft
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASS}

volumes:
  pgdata:
```

---

## 15. Development Setup

```bash
# 1. Clone and install
git clone https://github.com/yourorg/jothisoft.git
cd jothisoft
npm install  # Turborepo installs all workspaces

# 2. Set up environment
cp .env.example apps/api/.env
cp .env.local.example apps/web/.env.local
# Fill in all values

# 3. Database setup
cd apps/api
npm run db:migrate
npm run db:seed

# 4. Start dev servers
npm run dev  # Starts web (:3000) and api (:4000) concurrently
```
