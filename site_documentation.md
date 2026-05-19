# Aandal Astro — Full Site Documentation
**URL:** https://softwares.aandalastro.com/  
**Login:** Username: `9345851195` | Password: `230819`  
**Platform:** Mobile-first Tamil Astrology Software Web App  
**Theme:** Dark (`#0d1117` background palette)

---

## 🗺️ Complete Sitemap

### Authentication
| Route | Description |
|-------|-------------|
| `/Mobile/login.php` | Login page |
| `/Mobile/index.php` | Dashboard (post-login) |

### Horoscope & Predictions (ஜாதகம் & பலன்கள்)
| Route | Description |
|-------|-------------|
| `/Mobile/rasi_index.php` | Full interactive horoscope generator |
| `/Mobile/rasi_navamsam.php` | Horoscope results (Rasi, Navamsam, Dasa, Ashtakavarga, Gocharam) |
| `/Mobile/antharam/rasi_index.php` | Sub-sub periods (Antharam & Sookshma) calculations |
| `/Mobile/sanjeevionline_new/index.php` | One-page printable PDF horoscope |
| `/Mobile/simple_palan/palan_index.php` | Brief prediction summaries |
| `/Mobile/book/palan_index.php` | Book-format PDF horoscope |
| `/Mobile/starpalan.php` | Star-based transit predictions |
| `/Mobile/andal_panchangam/rasipalan_latest.php` | Transit predictions |
| `/Mobile/baby_names.php` | Premium baby names selector |

### Marriage Matching (திருமண பொருத்தம்)
| Route | Description |
|-------|-------------|
| `/Mobile/ds_index.php` | Detailed horoscope-to-horoscope matching |
| `/Mobile/starporutham.php` | Quick star-to-star matching |
| `/Mobile/porutham_premium/ds_index.php` | Premium match analysis |
| `/Mobile/andal_panchangam/nakshatra_porutham.php` | Star eligibility matrix |

### Panchangam & Muhurtham (பஞ்சாங்கம் & முகூர்த்தம்)
| Route | Description |
|-------|-------------|
| `/Mobile/advance_panchangam/month.php` | Monthly Panchangam calendar PRO |
| `/Mobile/advance_panchangam/day.php` | Daily hourly Lagnam & Hora Panchangam PRO |
| `/Mobile/andal_panchangam/mogoorthamfinol_new_version.php` | Event-specific auspicious time search engine |

### Numerology & Vastu (எண்கணிதம் & வாஸ்து)
| Route | Description |
|-------|-------------|
| `/Mobile/num.html` | Name-based numerology (compound numbers) |
| `/Mobile/name_date.php` | Date & Name-based numerology (life-path numbers) |
| `/Mobile/age.php` | Exact age calculator |
| `/Mobile/vasthudate.php` | Annual Vastu day schedule (longitude-corrected) |
| `/Mobile/house.php` | Vastu dimensions — Manaiyadi Shastram |

### Account
| Route | Description |
|-------|-------------|
| `/Mobile/settings.php` | Account settings, sign out, delete account |

### Non-existent Pages (404)
- `/Mobile/profile.php` — redirects to settings.php
- `/Mobile/subscription.php` — does not exist
- `/Mobile/plan.php` — does not exist

---

## 🏠 Global Layout & Design System

### Overall Design
- **Theme:** Dark mode exclusively
- **Background:** `#0d1117` (near-black, GitHub-dark style)
- **Card Background:** Slightly lighter dark cards
- **Primary Accent:** Colorful card icons (orange, pink, blue, purple, green)
- **Text:** White / light grey
- **Mobile-first:** Optimized for mobile viewports; all pages max ~375-430px wide
- **Font:** Tamil + English mixed (system fonts / web-safe)

### Header (Global)
- Left: Hamburger/sidebar trigger icon
- Center: **"Aandal Astro"** title
- Right: Profile details / icon
- Height: ~50–60px, fixed at top
- Background: Same dark theme, no border

### Bottom Navigation Bar
- Fixed at bottom of screen
- Contains quick-access icons for core modules
- Items include: Home, Horoscope, Panchangam, Matching, Numerology

### Sidebar Menu (Drawer)
- Opens on hamburger tap
- Contains full site navigation tree
- All 32 module links accessible here

### Card Grid (Homepage)
- Grid of colorful rounded cards
- Each card has an icon + Tamil label
- Cards are categorized into sections

---

## 📄 PAGE-BY-PAGE DOCUMENTATION

---

### PAGE: Login
**URL:** `https://softwares.aandalastro.com/Mobile/login.php`

**LAYOUT:**
- Centered login form on dark background
- Logo/brand at top
- Single-column card form

**COMPONENTS:**
- Text input: Username (phone number)
- Password input: Password
- Submit button: "Login" / "உள்நுழை"

**CONTENT:**
- Brand: "Aandal Astro"
- Form title: Login / Sign In

**COLORS:**
- Background: `#0d1117` (dark)
- Button: Accent color (orange/amber)
- Input fields: Dark with light border

**FUNCTIONALITY:**
- Submits credentials via POST
- On success → redirects to `/Mobile/index.php`
- Sessions maintained via PHP session cookies

---

### PAGE: Dashboard / Homepage
**URL:** `https://softwares.aandalastro.com/Mobile/index.php`

**LAYOUT:**
- Fixed header bar
- Scrollable card grid in main content
- Fixed bottom navigation bar
- No sidebar by default (opens via hamburger)

**COMPONENTS:**
- Header: Logo, title, profile icon
- Feature cards (grid): 32 cards organized in categories
- Bottom nav: 5 icons

**CONTENT — Card Categories & Labels:**

**Category 1: ஜாதகம் (Horoscope)**
- ஜாதகம் (Full Horoscope) → `rasi_index.php`
- அந்தரம் & சூட்சுமம் → `antharam/rasi_index.php`
- PDF ஜாதகம் (Sanjeevi) → `sanjeevionline_new/index.php`
- சுருக்க பலன் → `simple_palan/palan_index.php`
- புத்தக ஜாதகம் → `book/palan_index.php`
- நட்சத்திர பலன் → `starpalan.php`
- கோச்சார பலன் → `andal_panchangam/rasipalan_latest.php`
- குழந்தை பெயர்கள் → `baby_names.php`

**Category 2: திருமண பொருத்தம் (Marriage Matching)**
- ஜாதக பொருத்தம் → `ds_index.php`
- நட்சத்திர பொருத்தம் → `starporutham.php`
- பிரீமியம் பொருத்தம் → `porutham_premium/ds_index.php`
- நட்சத்திர தகவல் → `andal_panchangam/nakshatra_porutham.php`

**Category 3: பஞ்சாங்கம் & முகூர்த்தம் (Panchangam & Muhurtham)**
- மாத பஞ்சாங்கம் → `advance_panchangam/month.php`
- நாள் பஞ்சாங்கம் → `advance_panchangam/day.php`
- முகூர்த்தம் → `andal_panchangam/mogoorthamfinol_new_version.php`

**Category 4: எண்கணிதம் & வாஸ்து (Numerology & Vastu)**
- பெயர் எண்கணிதம் → `num.html`
- தேதி & பெயர் → `name_date.php`
- வயது கணக்கிடு → `age.php`
- வாஸ்து நாட்கள் → `vasthudate.php`
- மனையடி சாஸ்திரம் → `house.php`

**COLORS:**
- Background: `#0d1117`
- Cards: Each category uses a different gradient (orange, pink, blue, purple, green)
- Text: White

---

### PAGE: Horoscope Form
**URL:** `https://softwares.aandalastro.com/Mobile/rasi_index.php`

**LAYOUT:**
- Single card form, centered
- Dark background

**COMPONENTS & FORM FIELDS:**
| Field ID | Label | Type | Description |
|----------|-------|------|-------------|
| `u_name` | பெயர் (Name) | Text input | Person's name |
| `date` | தேதி (Date) | Number input | Birth day (1-31) |
| `month` | மாதம் (Month) | Number input | Birth month (1-12) |
| `year` | வருடம் (Year) | Number input | Birth year (e.g., 1990) |
| `display_hour` | மணி (Hour) | Number input | Birth hour |
| `minutes` | நிமிடம் (Minute) | Number input | Birth minute |
| AM/PM | — | Toggle buttons | AM or PM selection |
| `search_place` | பிறந்த ஊர் (Birthplace) | Autocomplete text | Place search with lat/lng auto-fetch |
| `saveProfile` | — | Checkbox | Save profile locally |
| `saveLocally` | — | Checkbox | Save place locally |

**BUTTONS:**
- "கணக்கிடு" (Calculate) — submits form → `/Mobile/rasi_navamsam.php`

**COLORS:**
- Form card: Dark background
- Input borders: Light grey / subtle
- Submit button: Orange/amber accent

**FUNCTIONALITY:**
- Place search autocomplete fetches lat/lng from internal DB
- Form submits via POST to results page

---

### PAGE: Horoscope Results
**URL:** `https://softwares.aandalastro.com/Mobile/rasi_navamsam.php`

**LAYOUT:**
- Fixed tab bar at top (5 tabs)
- Full-width content area per tab

**TABS:**
1. **ராசி (D1)** — Core horoscope data + charts
2. **கிரகம்** — Planet positions table + Dosha analysis
3. **தசா** — Dasa/Bhukti timeline list
4. **சர்வ அஷ்டவர்க்கம்** — Ashtakavarga grid per house
5. **கோச்சாரம்** — Real-time planet transit chart

**TAB 1 CONTENT (ராசி):**
- Lagnam (Ascendant)
- Star (Nakshatra)
- Current Dasa / Bhukti
- Mudaku Rasi
- Indu Lagnam
- Badhaka Rasi
- **Charts:** Rasi (D1), Navamsam (D9), Sripati Bhava — rendered as South Indian style square charts

**TAB 2 CONTENT (கிரகம்):**
- Table: Planet | Coordinates | Star | Positional Strength
- Planets listed: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu, Lagna
- Dosha analysis: Mars Dosha, Rahu-Ketu Dosha, Papa Samya score

**TAB 3 CONTENT (தசா):**
- Full Dasa sequence table
- Columns: Dasa Lord | Start Date | End Date
- Sub-periods (Bhukti) listed under each main Dasa

**TAB 4 CONTENT (சர்வ அஷ்டவர்க்கம்):**
- Grid showing Ashtakavarga points per house (1-12)
- Sodhya Pindam calculation
- Lucky directions indicators

**TAB 5 CONTENT (கோச்சாரம்):**
- Current transits of all planets mapped over birth chart houses
- Live/real-time position display

---

### PAGE: Star-to-Star Marriage Matching
**URL:** `https://softwares.aandalastro.com/Mobile/starporutham.php`

**LAYOUT:**
- Two-panel card (Female left/top, Male right/bottom)
- Gradient colors: Female = pink/rose, Male = blue

**FORM FIELDS:**
| Field | Label | Type | Options |
|-------|-------|------|---------|
| `g_star` | பெண் நட்சத்திரம் (Girl's Star) | Dropdown | 27 stars |
| `g_pada` | பாதம் (Pada) | Dropdown | 1ம் பாதம், 2ம் பாதம், 3ம் பாதம், 4ம் பாதம் |
| `b_star` | ஆண் நட்சத்திரம் (Boy's Star) | Dropdown | 27 stars |
| `b_pada` | பாதம் (Pada) | Dropdown | 1ம் பாதம், 2ம் பாதம், 3ம் பாதம், 4ம் பாதம் |

**27 Stars (Nakshatras):**
அஸ்வினி, பரணி, கார்த்திகை, ரோகிணி, மிருகசீரிஷம், திருவாதிரை, புனர்பூசம், பூசம், ஆயில்யம், மகம், பூரம், உத்திரம், ஹஸ்தம், சித்திரை, சுவாதி, விசாகம், அனுஷம், கேட்டை, மூலம், பூராடம், உத்திராடம், திருவோணம், அவிட்டம், சதயம், பூரட்டாதி, உத்திரட்டாதி, ரேவதி

**BUTTONS:**
- "பொருத்தம் பார்" (Check Matching) — submits to results

**OUTPUT:**
- Compatibility score (10 points system)
- Individual point breakdown for each of the 10 porutham categories

---

### PAGE: Horoscope-to-Horoscope Matching
**URL:** `https://softwares.aandalastro.com/Mobile/ds_index.php`

**LAYOUT:**
- Two cards: Female (pink/rose gradient) and Male (blue gradient)
- Same form structure for both, stacked vertically

**FORM FIELDS (per person):**
- Name, Date, Month, Year
- Hour, Minute, AM/PM
- Place of birth (autocomplete)
- Saved profile dropdown (if previously saved)

**BUTTONS:**
- "பொருத்தம் கணக்கிடு" (Calculate Matching)

**OUTPUT:**
- Full 10-porutham analysis
- Additional: Bhakoot, Nadi, Rajju, Vedha analysis
- Dosha information for both

---

### PAGE: Name Numerology
**URL:** `https://softwares.aandalastro.com/Mobile/num.html`

**LAYOUT:**
- Single card, clean minimal
- Dark background

**FORM FIELDS:**
| Field | Label | Type |
|-------|-------|------|
| `EntryName` | பெயர் (Name) | Text input |

**BUTTONS:**
- "கணக்கிடு" (Calculate)

**OUTPUT:**
- Compound number
- Single digit (root number)
- Number characteristics/meaning

---

### PAGE: Date & Name Numerology
**URL:** `https://softwares.aandalastro.com/Mobile/name_date.php`

**FORM FIELDS:**
| Field | Label | Type |
|-------|-------|------|
| `dob` | பிறந்த தேதி (Date of Birth) | Date inputs |
| `name` | பெயர் (Name) | Text input |

**OUTPUT:**
- Life path number
- Name number
- Combined analysis
- Compatibility of numbers

---

### PAGE: Age Calculator
**URL:** `https://softwares.aandalastro.com/Mobile/age.php`

**LAYOUT:**
- Single date-entry card

**FORM FIELDS:**
- Birth date, month, year inputs
- Optional: Current date (auto-filled)

**BUTTONS:**
- "கணக்கிடு" (Calculate)

**OUTPUT:**
- Exact age in Years, Months, Days
- Days lived total
- Next birthday countdown

---

### PAGE: Vastu Days
**URL:** `https://softwares.aandalastro.com/Mobile/vasthudate.php`

**LAYOUT:**
- Form at top, results list below

**FORM FIELDS:**
| Field | Label | Type |
|-------|-------|------|
| City / Location | ஊர் | Autocomplete text |
| Year | வருடம் | Number/Dropdown |

**BUTTONS:**
- "கணக்கிடு" (Calculate)

**OUTPUT:**
- Year-long schedule of Vastu-favourable days
- Each row: Date | Time window | Longitude correction note
- Example: "Chennai — +9 minutes correction → 10:50 AM – 11:26 AM"
- Color coded: Green = favourable, Red = avoid

---

### PAGE: Manaiyadi Shastram (Vastu Dimensions)
**URL:** `https://softwares.aandalastro.com/Mobile/house.php`

**LAYOUT:**
- Input card at top
- Results below
- Modal for precalculated table

**FORM FIELDS:**
| Field | Label | Type |
|-------|-------|------|
| `length` | நீளம் (Length) | Number (feet) |
| `width` | அகலம் (Width) | Number (feet) |

**BUTTONS:**
- "கணக்கிடு" (Calculate) — checks if dimensions are auspicious
- "100 அடி பட்டியல்" (100 Feet List) — opens modal with precalculated table

**MODAL — 100 Feet List:**
- Table: Feet (1–100) | Auspicious status
- Green indicator = beneficial
- Orange/Red = cautionary/avoid

---

### PAGE: Monthly Panchangam (PRO)
**URL:** `https://softwares.aandalastro.com/Mobile/advance_panchangam/month.php`

**LAYOUT:**
- Calendar grid view (month)
- Each day is a card

**CONTENT PER DAY:**
- Star (Nakshatra)
- Yogam
- Thithi (Lunar day)
- Karanams
- Life value / Eye value (numerological)
- Planet transit notes

**NAVIGATION:**
- Month/Year selector at top (prev/next arrows)

---

### PAGE: Daily Panchangam (PRO)
**URL:** `https://softwares.aandalastro.com/Mobile/advance_panchangam/day.php`

**LAYOUT:**
- Tabs at top of page

**TABS:**
1. **பொது (General)** — Basic daily Panchangam info
2. **லக்னம் (Lagnam)** — Hourly Lagnam timeline
3. **ஹோரை (Hora)** — Hourly Hora schedule
4. **கௌரி பஞ்சாங்கம்** — Gowri Panchangam grid
5. **நிகழ்வு / திருவிழா** — Events and festival list

**TAB 2 — Lagnam Details:**
- Timeline: Each hour shows which Lagnam is active
- Tyajyam (inauspicious time) marked in RED
- Moon transit information

**TAB 3 — Hora:**
- Each hour: Planetary ruler of that hora
- Color coded by planet

---

### PAGE: Muhurtham Finder
**URL:** `https://softwares.aandalastro.com/Mobile/andal_panchangam/mogoorthamfinol_new_version.php`

**LAYOUT:**
- Search filter form at top
- Results list below (dates)

**FORM FIELDS:**
| Field | Label | Type |
|-------|-------|------|
| `city_search` | ஊர் (City) | Autocomplete text |
| Subha Karyam | சுபகாரியம் | Dropdown (18 event types) |
| Filter | வடிகட்டி | Dropdown (quality levels) |

**Subha Karyam Options (18 types):**
- திருமணம் (Marriage)
- வியாபார ஆரம்பம் (Business Start)
- வாஸ்து (Vastu)
- கிரஹப்பிரவேசம் (Grihapravesam / House Warming)
- நாமகரணம் (Naming Ceremony)
- வாகன பூஜை (Vehicle Puja)
- காது குத்தல் (Ear Piercing)
- சடங்கு (Ceremony)
- மற்றும் 10 more categories…

**Filter Options:**
- 100% தோஷமற்றவை (Completely auspicious)
- சுமார் (Average/moderate)

**BUTTONS:**
- "தேடு" (Search) — fetches results

**OUTPUT:**
- List of dates with:
  - Date
  - Tarabalam star compatibility
  - Morning Lagnam slot
  - Evening Lagnam slot
  - Remedies (if any)

---

### PAGE: Settings / Account
**URL:** `https://softwares.aandalastro.com/Mobile/settings.php`

**LAYOUT:**
- Simple profile card at top
- Action buttons below

**CONTENT:**
- Current username displayed (e.g., "Maya")
- Account type/plan info

**BUTTONS:**
- "வெளியேறு" (Sign Out) — logs out, redirects to login
- "கணக்கை நீக்கு" (Delete Account) — danger zone, deletes account permanently

---

## 🔁 Recurring UI Patterns

### 1. Autocomplete Place Search
- Used in: Horoscope form, Marriage matching, Muhurtham finder, Vastu days
- Behavior: User types city name → dropdown shows matching cities → selection auto-fills lat/lng hidden fields

### 2. South Indian Horoscope Chart
- Square grid with 12 house divisions
- Used for: Rasi, Navamsam, Sripati Bhava, Gocharam

### 3. Dark Card Layout
- Every module = a dark card with subtle elevation
- Rounded corners (`border-radius: ~12px`)
- Padding: `16-24px`

### 4. Tab Navigation (in Results Pages)
- Fixed horizontal tab bar at page top
- Scrollable if tabs overflow
- Active tab: brighter/underlined

### 5. Dual-Panel Forms
- Marriage matching uses Female (pink) + Male (blue) color-coded panels

### 6. Calculate Button
- Tamil: "கணக்கிடு"
- Accent color (orange/amber gradient)
- Full-width, rounded

---

## 🔐 Authentication Flow

1. User navigates to root URL → redirected to `/Mobile/login.php`
2. Login page shows: Phone number + password form
3. On submit → POST request to server
4. Server validates credentials via PHP session
5. On success → `$_SESSION` set → redirect to `/Mobile/index.php`
6. All subsequent pages check session → if not authenticated → redirect to login
7. Logout at `settings.php` → destroys session → redirect to login

---

## 📊 Data & API Patterns

### Place/Location Database
- Internal city DB (Tamil Nadu cities + major Indian cities)
- Autocomplete returns: City name, State, Country, Latitude, Longitude, UTC offset
- Used for precise astronomical calculations

### Astrological Calculations
- Server-side PHP calculations
- Inputs: Birth date/time + lat/lng → computes: Rasi, Nakshatra, Dasa, Planets, etc.
- All calculations done on server; results returned as HTML

### Session Storage
- PHP `$_SESSION` for auth
- LocalStorage (browser) for saved birth profiles (optional, user-controlled)

---

## 🎨 Design Tokens Summary

| Token | Value |
|-------|-------|
| Background | `#0d1117` (near black) |
| Card BG | `#161b22` (dark grey) |
| Primary Accent | Orange/Amber gradient |
| Female Accent | Pink/Rose gradient |
| Male Accent | Blue gradient |
| Text Primary | `#ffffff` |
| Text Secondary | `#8b949e` (muted grey) |
| Border | `#30363d` (subtle) |
| Success/Green | `#3fb950` |
| Danger/Red | `#f85149` |
| Font Stack | System fonts + Tamil web fonts |
| Border Radius | `12px` (cards), `8px` (inputs), `24px` (buttons) |

---

## 🔢 Module Count Summary

| Category | Modules |
|----------|---------|
| Horoscope & Predictions | 8 |
| Marriage Matching | 4 |
| Panchangam & Muhurtham | 3 |
| Numerology & Vastu | 5 |
| Account/Settings | 1 |
| **Total** | **21 functional modules** |

---

*Documentation generated: 2026-05-17 | Source: Live site analysis via automated browser exploration*
