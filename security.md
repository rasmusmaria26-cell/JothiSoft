# JothiSoft — Security Guidelines

> Security reference for the JothiSoft platform.  
> All developers must read this before writing any auth, payment, or data-handling code.

---

## 1. Authentication Security

### Password Hashing

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hash on registration
export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);

// Verify on login
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);
```

**Rules:**
- Never store plain-text passwords — ever
- Never log passwords, tokens, or OTPs
- Minimum password length: 8 characters
- Enforce at least one number in password

### JWT Strategy

```typescript
// Access token — short-lived, in memory only
const ACCESS_TOKEN_OPTIONS = {
  expiresIn: '15m',
  algorithm: 'HS256' as const,
};

// Refresh token — long-lived, httpOnly cookie only
const REFRESH_TOKEN_OPTIONS = {
  expiresIn: '30d',
  algorithm: 'HS256' as const,
};

// Cookie settings for refresh token
res.cookie('refreshToken', token, {
  httpOnly: true,       // NOT accessible via JS
  secure: true,         // HTTPS only
  sameSite: 'strict',   // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days in ms
});
```

**Rules:**
- Access tokens: memory only (Zustand store) — never localStorage, never sessionStorage
- Refresh tokens: httpOnly cookie only — never in JS-accessible storage
- Use separate secrets for access and refresh tokens
- Rotate refresh tokens on each use (refresh token rotation)
- Invalidate all tokens on logout

### OTP Security

```typescript
// OTP generation
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// OTP is valid for 5 minutes only
const OTP_EXPIRY_MINUTES = 5;

// Max OTP attempts per phone per hour
const MAX_OTP_ATTEMPTS = 3;
```

**Rules:**
- OTP expires in 5 minutes — hard limit in DB
- Max 3 OTP requests per phone per hour (rate limit)
- OTP is one-time — mark `used = true` immediately after verification
- Never return OTP in API response (send via SMS only)

---

## 2. Input Validation & Sanitisation

### All inputs must be validated on the backend — never trust the frontend.

```typescript
// Using Zod for schema validation
import { z } from 'zod';

export const horoscopeSchema = z.object({
  name:       z.string().min(1).max(100).trim(),
  date:       z.number().int().min(1).max(31),
  month:      z.number().int().min(1).max(12),
  year:       z.number().int().min(1900).max(2100),
  hour:       z.number().int().min(1).max(12),
  minute:     z.number().int().min(0).max(59),
  ampm:       z.enum(['AM', 'PM']),
  place_id:   z.number().int().positive(),
});

export const loginSchema = z.object({
  phone:    z.string().regex(/^[6-9]\d{9}$/),  // Indian mobile numbers
  password: z.string().min(8).max(128),
});

// Middleware to apply schema
export const validate = (schema: z.ZodSchema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', details: result.error.flatten() }
    });
  }
  req.body = result.data;  // Use sanitised data
  next();
};
```

### SQL Injection Prevention

```typescript
// ALWAYS use parameterised queries — never string concatenation
// CORRECT
const user = await db.query(
  'SELECT * FROM users WHERE phone = $1',
  [phone]
);

// WRONG — never do this
const user = await db.query(
  `SELECT * FROM users WHERE phone = '${phone}'`
);
```

### XSS Prevention

```typescript
// Sanitise any user content rendered as HTML
import DOMPurify from 'isomorphic-dompurify';

const safeHTML = DOMPurify.sanitize(userInput, { ALLOWED_TAGS: [] });

// In Next.js — prefer dangerouslySetInnerHTML only for known-safe content
// For Tamil text from DB — always render as text nodes, not HTML
```

---

## 3. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMIT_EXCEEDED' } },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints — stricter
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 10,
  keyGenerator: (req) => req.body.phone || req.ip,
  message: { success: false, error: { code: 'TOO_MANY_AUTH_ATTEMPTS' } },
});

// OTP sending — very strict
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 3,
  keyGenerator: (req) => req.body.phone,
});

// Apply in app.ts
app.use('/api', generalLimiter);
app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/auth', authLimiter);
```

---

## 4. CORS Configuration

```typescript
// api/src/app.ts

import cors from 'cors';

const allowedOrigins = [
  'https://jothisoft.com',
  'https://www.jothisoft.com',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,       // Required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 5. HTTP Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", 'https://checkout.razorpay.com'],
      styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:      ["'self'", 'data:', 'https:'],
      connectSrc:  ["'self'", 'https://api.jothisoft.com'],
      frameSrc:    ['https://api.razorpay.com'],
    },
  },
  hsts: {
    maxAge: 31536000,       // 1 year
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

---

## 6. Razorpay Payment Security

```typescript
// services/razorpay.ts

import crypto from 'crypto';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Verify payment signature BEFORE activating subscription
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
};

// Verify webhook signature
export const verifyWebhookSignature = (
  rawBody: Buffer,
  signature: string
): boolean => {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
};
```

**Rules:**
- Never activate a subscription before verifying the Razorpay signature
- Use `crypto.timingSafeEqual` — never string equality for signatures
- Store raw webhook body as Buffer before JSON parsing (needed for signature)
- Webhook endpoint must NOT have auth middleware (uses its own signature check)
- Never expose `RAZORPAY_KEY_SECRET` to the frontend
- Log all payment events to `audit_log` table

---

## 7. Astro Engine Communication

```typescript
// The astro engine is an internal service — not exposed to the internet

// Protect with a shared secret header
const ENGINE_SECRET = process.env.ASTRO_ENGINE_SECRET;

// Node.js → Engine request
headers: { 'X-Engine-Secret': ENGINE_SECRET }

// Engine validates on every request
if (req.headers['x-engine-secret'] !== ENGINE_SECRET) {
  return res.status(403).json({ error: 'Forbidden' });
}
```

**Rules:**
- Astro engine must not be publicly accessible — bind to `127.0.0.1` or internal network only
- Rotate the engine secret quarterly
- Engine should only accept requests from the API server's IP

---

## 8. Sensitive Data Handling

### What to NEVER log

```typescript
// Bad — never log these
console.log('Login:', phone, password);
console.log('OTP sent:', otp);
console.log('Token:', accessToken);
console.log('Payment:', razorpayKeySecret);

// Safe to log (with care)
console.log('Login attempt for phone ending in:', phone.slice(-4));
console.log('OTP sent to:', `****${phone.slice(-4)}`);
console.log('Subscription activated for user:', userId);
```

### Personal Data (DPDP Act Compliance — India)

Per India's **Digital Personal Data Protection Act 2023**:

- Collect only what is necessary (birth date, name, phone — no PAN/Aadhaar)
- Users must be able to delete their account and all associated data
- Data deletion must cascade: users → subscriptions → birth_profiles → audit_log
- Add a privacy policy page in Tamil + English before launch
- Store data on servers in India (preferred — choose IN region on cloud provider)

```typescript
// Account deletion — hard delete, not soft delete for personal data
router.delete('/auth/account', authenticate, async (req, res) => {
  // Cascade deletes via FK constraints
  await db.query('DELETE FROM users WHERE id = $1', [req.user.id]);
  // Clear auth cookie
  res.clearCookie('refreshToken');
  res.json({ success: true });
});
```

---

## 9. Subscription Bypass Prevention

```typescript
// NEVER trust subscription status from the frontend
// ALWAYS check in the database on every protected request

// Correct — server-side check
export const requireSubscription = async (req, res, next) => {
  const { rows } = await db.query(
    `SELECT id FROM subscriptions
     WHERE user_id = $1
       AND status = 'active'
       AND expires_at > NOW()
     LIMIT 1`,
    [req.user.id]
  );

  if (rows.length === 0) {
    return res.status(403).json({ success: false, error: { code: 'SUBSCRIPTION_REQUIRED' } });
  }
  next();
};
```

---

## 10. Environment & Secrets Management

**Rules:**
- Never commit `.env` files to git — use `.env.example` with placeholder values
- Add `.env*` to `.gitignore` immediately on project creation
- Use a secrets manager in production (e.g. DigitalOcean App Platform env vars, or Vault)
- Rotate all secrets if any are accidentally exposed
- Use different credentials for dev/staging/production
- Minimum secret length: 32 random characters (`openssl rand -hex 32`)

```bash
# Generate secure secrets
openssl rand -hex 32   # JWT_SECRET
openssl rand -hex 32   # JWT_REFRESH_SECRET
openssl rand -hex 32   # ASTRO_ENGINE_SECRET
```

---

## 11. Infrastructure Security

### Server Hardening (VPS)

```bash
# 1. Disable root SSH login
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no    # Use SSH keys only

# 2. Firewall — allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP (redirect to HTTPS)
ufw allow 443   # HTTPS
ufw deny 5432   # Block direct DB access from internet
ufw deny 4000   # Block direct API access (use Nginx reverse proxy)
ufw deny 5001   # Block astro engine from internet
ufw enable

# 3. Automatic security updates
apt install unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/jothisoft

server {
    listen 443 ssl http2;
    server_name api.jothisoft.com;

    ssl_certificate     /etc/letsencrypt/live/api.jothisoft.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.jothisoft.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;

    # Rate limit at Nginx level too
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
    limit_req zone=api burst=10 nodelay;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.jothisoft.com jothisoft.com www.jothisoft.com;
    return 301 https://$host$request_uri;
}
```

---

## 12. Security Checklist (Pre-Launch)

### Authentication
- [x] Passwords hashed with bcrypt (Supabase Auth built-in encryption)
- [x] JWT stored correctly (handled securely by Supabase Browser Session Manager)
- [x] OTP expires in 5 minutes and is one-time use (SMS system deleted, direct email/pass active)
- [x] Refresh token rotation implemented
- [x] All auth endpoints rate-limited

### Data
- [x] All DB queries use parameterised statements
- [x] All user inputs validated with Zod on backend
- [x] No sensitive data in logs
- [ ] Account deletion deletes all user data
- [ ] Privacy policy published (Tamil + English)

### Payments
- [x] Razorpay signature verified before subscription activation
- [x] Webhook signature verified independently
- [x] No payment credentials in frontend code
- [ ] All payment events logged to audit_log

### Infrastructure
- [x] HTTPS enforced everywhere (Let's Encrypt / Render SSL)
- [x] All security headers set via HTTP Response Headers
- [ ] Firewall configured — DB and engine not exposed
- [ ] Root SSH login disabled, key-only auth
- [x] Environment variables not in git
- [x] Separate credentials for dev/prod

### API
- [x] CORS restricted to production domain only
- [x] Rate limiting on all endpoints
- [ ] Subscription checked server-side on every protected route
- [ ] Astro engine only accessible from API server

---

## 13. Incident Response

If a security issue is discovered:

1. **Immediately** rotate all exposed credentials
2. Force-logout all users (invalidate all refresh tokens) — add a `token_version` field to users table and increment it
3. Audit the `audit_log` table for suspicious activity
4. Notify affected users if personal data was accessed
5. Fix the vulnerability before re-deploying
6. Document the incident and preventive measures taken
