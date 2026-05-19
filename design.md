# JothiSoft — Design System

> Professional Tamil Astrology SaaS Platform  
> Theme: Warm dark · Cultural · Premium

---

## 1. Typography

### Font Stack

```css
/* Google Fonts import */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anek+Tamil:wght@100..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
```

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display / Logo | Playfair Display | 700 | Brand name, hero headings |
| Tamil content | Anek Tamil | 400, 500, 600 | All Tamil text throughout |
| UI / English | Anek Tamil | 400, 500 | English UI labels, body |
| Monospace | system-ui mono | 400 | Codes, tokens, data values |

### Font Size Scale

```css
--font-xs:   11px;   /* badges, captions */
--font-sm:   13px;   /* secondary labels, muted text */
--font-base: 15px;   /* body text, card labels */
--font-md:   17px;   /* section headings */
--font-lg:   20px;   /* page headings */
--font-xl:   26px;   /* hero / display */
--font-2xl:  34px;   /* logo / brand */
```

### Line Height

```css
--leading-tight:  1.3;   /* headings */
--leading-normal: 1.6;   /* body */
--leading-loose:  1.9;   /* Tamil paragraph text */
```

### Font Usage Rules

- All Tamil text: `font-family: 'Anek Tamil', sans-serif`
- All English display: `font-family: 'Playfair Display', serif`
- All English UI/body: `font-family: 'Anek Tamil', sans-serif`
- Never use system fonts for Tamil — Anek Tamil covers both scripts
- Tamil body text always uses `--leading-loose` for readability
- Playfair Display italic for decorative subheadings only

---

## 2. Colour Palette

### Background Scale

```css
--bg-page:      #1a1209;   /* page background — deep warm dark */
--bg-card:      #241a0f;   /* card background */
--bg-elevated:  #2e2115;   /* elevated / hover card */
--bg-active:    #3d2d1c;   /* active / selected state */
--bg-border:    #4a3828;   /* border colour */
--bg-overlay:   rgba(26, 18, 9, 0.85); /* modal overlay */
```

### Primary Accent — Temple Gold

```css
--gold-deep:    #c9922a;   /* primary CTA, active states */
--gold-mid:     #e0a83a;   /* button hover */
--gold-bright:  #f2c96a;   /* highlight, icon accent */
--gold-tint:    #fff3cc;   /* light tint background */
--gold-subtle:  rgba(201, 146, 42, 0.15); /* badge backgrounds */
```

### Text Scale

```css
--text-primary:    #f5e6c8;   /* primary — parchment white */
--text-secondary:  #d4b896;   /* secondary — aged ivory */
--text-muted:      #8a7060;   /* muted / hints */
--text-disabled:   #5a4838;   /* disabled state */
--text-inverse:    #1a1209;   /* text on gold buttons */
```

### Category Accents (6 Module Sections)

```css
--cat-horoscope:   #7b5ea7;   /* Aazhimalar — purple */
--cat-panchangam:  #2e7d6b;   /* Thulasi — teal */
--cat-marriage:    #b0415e;   /* Pavazham — rose */
--cat-numerology:  #1e6fa8;   /* Nilam — blue */
--cat-prasnam:     #a05c1a;   /* Sembaruthi — amber brown */
--cat-special:     #4a7c59;   /* Arugampul — forest green */
```

### Status Colours

```css
--success:  #2d7a4f;
--danger:   #c0392b;
--warning:  #c9922a;   /* reuses gold */
--info:     #1e6fa8;   /* reuses nilam blue */

/* Tint variants for backgrounds */
--success-tint:  rgba(45, 122, 79, 0.15);
--danger-tint:   rgba(192, 57, 43, 0.15);
--warning-tint:  rgba(201, 146, 42, 0.15);
--info-tint:     rgba(30, 111, 168, 0.15);
```

### Badge / Tag Colours

```css
/* NEW */
--badge-new-bg:    rgba(45, 122, 79, 0.18);
--badge-new-text:  #6ee7a0;
--badge-new-border:#2d7a4f;

/* PRO */
--badge-pro-bg:    rgba(30, 111, 168, 0.18);
--badge-pro-text:  #80c8ff;
--badge-pro-border:#1e6fa8;

/* PREMIUM */
--badge-premium-bg:    rgba(123, 94, 167, 0.18);
--badge-premium-text:  #c0a0ff;
--badge-premium-border:#7b5ea7;

/* LIVE */
--badge-live-bg:    rgba(192, 57, 43, 0.22);
--badge-live-text:  #ff9090;
--badge-live-border:#c0392b;
```

---

## 3. Spacing System

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Usage Guidelines

- Card internal padding: `--space-4` to `--space-6`
- Section gaps: `--space-8` to `--space-10`
- Icon-to-label gap: `--space-2`
- Form field gap: `--space-3`
- Bottom nav height: 64px
- Header height: 60px

---

## 4. Border Radius

```css
--radius-sm:   6px;    /* inputs, small elements */
--radius-md:   10px;   /* buttons, chips */
--radius-lg:   14px;   /* cards */
--radius-xl:   20px;   /* modal, large panels */
--radius-pill: 999px;  /* badges, tags, toggle */
```

---

## 5. Borders

```css
--border-default:   0.5px solid #4a3828;
--border-subtle:    0.5px solid rgba(74, 56, 40, 0.5);
--border-strong:    1px solid #4a3828;
--border-gold:      1px solid #c9922a;
--border-focus:     2px solid #e0a83a;   /* focus ring on inputs */
```

---

## 6. Component Library

### 6.1 Header

```
Height: 60px
Background: #241a0f
Border-bottom: 0.5px solid #4a3828
Layout: [Logo + Brand Name] ··· [Language Toggle] [Power Icon]

Brand: "JothiSoft" — Playfair Display 700, 22px, #f2c96a
Tagline (optional): Anek Tamil 400, 12px, #8a7060
```

### 6.2 Bottom Navigation (Mobile)

```
Height: 64px
Background: #241a0f
Border-top: 0.5px solid #4a3828
Items: 5 icons — Home | Horoscope | Panchangam | Matching | More
Active: icon + label in #f2c96a
Inactive: icon + label in #8a7060
```

### 6.3 Cards

**Module Card (Dashboard)**
```
Background: #241a0f
Border: 0.5px solid #4a3828
Border-radius: 14px
Padding: 16px
Icon circle: 44px diameter, category accent colour at 20% opacity
Icon: 22px, category accent colour
Label: Anek Tamil 500, 13px, #d4b896
Badge: top-right, pill shape
```

**Info Card (User profile strip)**
```
Background: #2e2115
Border: 0.5px solid #4a3828
Border-radius: 14px
Padding: 16px 20px
Layout: [Greeting + Name] ··· [Plan badge + Expiry]
```

**Section Card (Category wrapper)**
```
Background: #241a0f
Border: 0.5px solid #4a3828
Border-radius: 14px
Padding: 20px
Section heading: Playfair Display 600 italic, 16px, #f2c96a
Icon: category accent emoji or SVG, 18px
```

### 6.4 Buttons

**Primary (Gold)**
```css
background: #c9922a;
color: #1a1209;
font-family: 'Anek Tamil', sans-serif;
font-weight: 600;
font-size: 15px;
padding: 12px 28px;
border-radius: 999px;
border: none;

hover: background: #e0a83a;
active: background: #b07820, scale(0.97);
disabled: background: #4a3828, color: #5a4838;
```

**Secondary (Outlined)**
```css
background: transparent;
color: #f2c96a;
border: 1px solid #c9922a;
font-family: 'Anek Tamil', sans-serif;
font-weight: 500;
font-size: 15px;
padding: 11px 28px;
border-radius: 999px;

hover: background: rgba(201,146,42,0.1);
```

**Ghost / Text**
```css
background: transparent;
color: #d4b896;
border: none;
font-size: 14px;
padding: 8px 16px;

hover: color: #f2c96a;
```

### 6.5 Form Inputs

```css
/* Text input */
background: #1a1209;
border: 0.5px solid #4a3828;
border-radius: 8px;
color: #f5e6c8;
font-family: 'Anek Tamil', sans-serif;
font-size: 15px;
padding: 12px 16px;
height: 44px;

focus: border: 2px solid #e0a83a, outline: none;
placeholder: color: #5a4838;

/* Label */
font-size: 13px;
color: #d4b896;
margin-bottom: 6px;
```

### 6.6 Badges / Tags

```
Font: Anek Tamil 500
Size: 11px
Padding: 3px 10px
Border-radius: 999px
Border: 0.5px solid (category border)

Variants: NEW | PRO | PREMIUM | LIVE | 4.0 (version)
```

### 6.7 Tabs (Results Pages)

```
Height: 44px
Background: #1a1209
Border-bottom: 0.5px solid #4a3828
Tab text: Anek Tamil 500, 13px

Active tab: color #f2c96a, border-bottom 2px solid #c9922a
Inactive tab: color #8a7060
Overflow: horizontal scroll, no scrollbar visible
```

### 6.8 South Indian Horoscope Chart

```
Outer grid: 4×4 square, total ~280px × 280px
Background: #1a1209
Grid lines: 1px solid #4a3828
House numbers: Anek Tamil 400, 11px, #8a7060, top-left corner of cell
Planet names: Anek Tamil 500, 12px, #f2c96a, centered in cell
Active Lagna cell: background #3d2d1c, border 1.5px solid #c9922a
Chart label: Playfair Display 600, 13px, #d4b896, below chart
```

### 6.9 Data Tables

```
Header row: background #2e2115, Anek Tamil 600, 12px, #8a7060, uppercase
Data rows: alternating #241a0f / #1a1209
Row border: 0.5px solid #4a3828
Cell padding: 10px 14px
Cell font: Anek Tamil 400, 14px, #f5e6c8
Highlight row: background #3d2d1c
```

### 6.10 Language Toggle

```
Pill toggle: 2 states — தமிழ் | English
Background: #1a1209
Border: 0.5px solid #4a3828
Border-radius: 999px
Active state: background #c9922a, text #1a1209
Inactive state: text #8a7060
Font: Anek Tamil 500, 13px
```

---

## 7. Layout System

### Grid

```css
/* Dashboard card grid */
display: grid;
grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
gap: 12px;

/* Desktop (≥ 1024px) */
grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
gap: 16px;
```

### Breakpoints

```css
--mobile:  375px;    /* default — mobile first */
--tablet:  768px;    /* tablet adjustments */
--desktop: 1024px;   /* sidebar + wider grid */
--wide:    1280px;   /* max content width */
```

### Max Content Width

```css
max-width: 1200px;
margin: 0 auto;
padding: 0 20px;  /* mobile */
padding: 0 40px;  /* desktop */
```

---

## 8. Iconography

- Use **Lucide React** icons for all UI icons
- Size: 20px default, 24px for nav icons, 16px for inline
- Colour: inherits from parent or explicit category accent
- Tamil-specific symbols (OM, star, etc.): SVG custom, 24px

---

## 9. Motion & Animation

```css
--transition-fast:   150ms ease;
--transition-base:   250ms ease;
--transition-slow:   400ms ease-in-out;

/* Card hover */
transform: translateY(-2px);
transition: var(--transition-base);

/* Tab underline */
transition: border-color var(--transition-fast);

/* Modal open */
animation: fadeSlideUp 250ms ease;
```

No decorative animations — only functional transitions.

---

## 10. Dark Mode Only

JothiSoft is a **single-theme product** — warm dark only. No light mode toggle. Rationale: astrology apps are frequently used at night, and the warm dark palette reduces eye strain while maintaining cultural warmth.

---

## 11. Accessibility

- Minimum contrast ratio: **4.5:1** for body text
- Focus rings: `2px solid #e0a83a` on all interactive elements
- Tamil text minimum size: **14px** (smaller Tamil glyphs are hard to read)
- Touch targets: minimum **44×44px**
- All icons must have `aria-label` or adjacent visible label
