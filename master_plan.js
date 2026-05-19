const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, PageBreak, Header, Footer, TabStopType,
  TabStopPosition, PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo,
  PositionalTabLeader
} = require('docx');
const fs = require('fs');

const COLORS = {
  navy:       '0F1B2D',
  gold:       'C9922A',
  goldLight:  'FFF3DC',
  purple:     '7B5EA7',
  purpleLight:'F0EBFA',
  teal:       '2E7D6B',
  tealLight:  'E6F5F1',
  amber:      'A05C1A',
  amberLight: 'FDF0E2',
  blue:       '1E6FA8',
  blueLight:  'E6F2FA',
  pink:       'B0415E',
  pinkLight:  'FAE9EE',
  green:      '3B6D11',
  greenLight: 'EAF3DE',
  red:        'A32D2D',
  redLight:   'FCEBEB',
  gray:       '5F5E5A',
  grayLight:  'F5F5F3',
  white:      'FFFFFF',
  black:      '1A1A1A',
  border:     'DDDDDD',
};

const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorders = {
  top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

function sp(n) { return new Paragraph({ children: [], spacing: { before: n, after: 0 } }); }

function heading1(text, color = COLORS.navy) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, color, bold: true, size: 36, font: 'Arial' })],
    spacing: { before: 400, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.gold, space: 4 } },
  });
}

function heading2(text, color = COLORS.navy) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, color, bold: true, size: 28, font: 'Arial' })],
    spacing: { before: 280, after: 100 },
  });
}

function heading3(text, color = COLORS.gray) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, color, bold: true, size: 22, font: 'Arial' })],
    spacing: { before: 200, after: 80 },
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Arial', color: COLORS.black, ...opts })],
    spacing: { before: 60, after: 60 },
  });
}

function tagBadge(label, bgColor, textColor) {
  const colors = {
    FE:   { bg: COLORS.purpleLight, text: COLORS.purple },
    BE:   { bg: COLORS.tealLight,   text: COLORS.teal   },
    BOTH: { bg: COLORS.amberLight,  text: COLORS.amber  },
    INFRA:{ bg: COLORS.redLight,    text: COLORS.red    },
  };
  const c = colors[label] || { bg: COLORS.grayLight, text: COLORS.gray };
  return new TableCell({
    borders: noBorders,
    width: { size: 1100, type: WidthType.DXA },
    shading: { fill: c.bg, type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    verticalAlign: 'center',
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: label, bold: true, size: 16, font: 'Arial', color: c.text })],
    })],
  });
}

function taskRow(title, desc, tag) {
  return new TableRow({
    children: [
      new TableCell({
        borders: { top: border, bottom: border, left: border, right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' } },
        width: { size: 7260, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 80 },
        children: [
          new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 21, font: 'Arial', color: COLORS.black })] }),
          new Paragraph({ children: [new TextRun({ text: desc,  size: 19, font: 'Arial', color: COLORS.gray  })], spacing: { before: 30 } }),
        ],
      }),
      tagBadge(tag),
    ],
  });
}

function taskTable(rows) {
  const header = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        borders: { top: border, bottom: border, left: border, right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' } },
        width: { size: 7260, type: WidthType.DXA },
        shading: { fill: COLORS.navy, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: 'Task', bold: true, size: 20, font: 'Arial', color: COLORS.white })] })],
      }),
      new TableCell({
        borders: noBorders,
        width: { size: 1100, type: WidthType.DXA },
        shading: { fill: COLORS.navy, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Layer', bold: true, size: 20, font: 'Arial', color: COLORS.white })] })],
      }),
    ],
  });
  return new Table({
    width: { size: 8360, type: WidthType.DXA },
    columnWidths: [7260, 1100],
    rows: [header, ...rows],
  });
}

function phaseHeader(num, title, weeks, color) {
  return new Table({
    width: { size: 8360, type: WidthType.DXA },
    columnWidths: [1000, 5760, 1600],
    rows: [new TableRow({
      children: [
        new TableCell({
          borders: noBorders,
          width: { size: 1000, type: WidthType.DXA },
          shading: { fill: color, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 140, right: 80 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `Phase ${num}`, bold: true, size: 24, font: 'Arial', color: COLORS.white })],
          })],
        }),
        new TableCell({
          borders: noBorders,
          width: { size: 5760, type: WidthType.DXA },
          shading: { fill: COLORS.navy, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 140, right: 80 },
          children: [new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 26, font: 'Arial', color: COLORS.white })],
          })],
        }),
        new TableCell({
          borders: noBorders,
          width: { size: 1600, type: WidthType.DXA },
          shading: { fill: COLORS.navy, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 80, right: 140 },
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: weeks, size: 22, font: 'Arial', color: COLORS.gold })],
          })],
        }),
      ],
    })],
  });
}

function summaryTable() {
  const cols = [
    { label: 'Phases',   value: '5',   bg: COLORS.purpleLight, text: COLORS.purple },
    { label: 'APIs',     value: '23',  bg: COLORS.tealLight,   text: COLORS.teal   },
    { label: 'Pages',    value: '32',  bg: COLORS.amberLight,  text: COLORS.amber  },
    { label: 'Timeline', value: '16w', bg: COLORS.blueLight,   text: COLORS.blue   },
  ];
  return new Table({
    width: { size: 8360, type: WidthType.DXA },
    columnWidths: [2090, 2090, 2090, 2090],
    rows: [new TableRow({
      children: cols.map(c => new TableCell({
        borders: noBorders,
        width: { size: 2090, type: WidthType.DXA },
        shading: { fill: c.bg, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 120, right: 120 },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: c.value, bold: true, size: 48, font: 'Arial', color: c.text })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: c.label, size: 18, font: 'Arial', color: COLORS.gray })], spacing: { before: 40 } }),
        ],
      })),
    })],
  });
}

function legendTable() {
  const items = [
    { tag: 'FE',    label: 'Frontend (Next.js)',        bg: COLORS.purpleLight, text: COLORS.purple },
    { tag: 'BE',    label: 'Backend (FastAPI)',          bg: COLORS.tealLight,   text: COLORS.teal   },
    { tag: 'BOTH',  label: 'Full-stack task',            bg: COLORS.amberLight,  text: COLORS.amber  },
    { tag: 'INFRA', label: 'Infrastructure / DevOps',   bg: COLORS.redLight,    text: COLORS.red    },
  ];
  return new Table({
    width: { size: 8360, type: WidthType.DXA },
    columnWidths: [2090, 2090, 2090, 2090],
    rows: [new TableRow({
      children: items.map(i => new TableCell({
        borders,
        width: { size: 2090, type: WidthType.DXA },
        shading: { fill: i.bg, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: i.tag + '  ', bold: true, size: 20, font: 'Arial', color: i.text }),
            new TextRun({ text: i.label, size: 18, font: 'Arial', color: COLORS.gray }),
          ],
        })],
      })),
    })],
  });
}

function stackTable() {
  const cols = [
    {
      head: 'Frontend',
      color: COLORS.purple,
      bg: COLORS.purpleLight,
      items: ['Next.js 14 (App Router)', 'Tailwind CSS + custom vars', 'Framer Motion v12', 'Zustand (session state)', 'SWR (data fetching)', 'shadcn/ui + custom components'],
    },
    {
      head: 'Backend',
      color: COLORS.teal,
      bg: COLORS.tealLight,
      items: ['FastAPI (Python 3.11)', 'pyswisseph (planet calcs)', 'Supabase (DB + Auth + Storage)', 'Redis (panchangam cache)', 'WeasyPrint (PDF generation)', 'Razorpay (payments)'],
    },
    {
      head: 'Deployment',
      color: COLORS.blue,
      bg: COLORS.blueLight,
      items: ['Vercel (Next.js)', 'Railway (FastAPI + Redis)', 'Supabase Cloud (DB)', 'GitHub Actions (CI/CD)', 'Turborepo (monorepo)', 'Docker Compose (local dev)'],
    },
    {
      head: 'Already Built',
      color: COLORS.green,
      bg: COLORS.greenLight,
      items: ['Dashboard UI shell', 'Module card system', 'Magnetic dock sidebar', 'Astro background canvas', 'Design system (CSS vars)', 'Framer Motion wired up'],
    },
  ];

  const headerRow = new TableRow({
    tableHeader: true,
    children: cols.map(c => new TableCell({
      borders,
      width: { size: 2090, type: WidthType.DXA },
      shading: { fill: c.color, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: c.head, bold: true, size: 22, font: 'Arial', color: COLORS.white })] })],
    })),
  });

  const maxRows = Math.max(...cols.map(c => c.items.length));
  const dataRows = Array.from({ length: maxRows }, (_, i) =>
    new TableRow({
      children: cols.map(c => new TableCell({
        borders,
        width: { size: 2090, type: WidthType.DXA },
        shading: { fill: c.bg, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: c.items[i] || '', size: 19, font: 'Arial', color: COLORS.black })] })],
      })),
    })
  );

  return new Table({
    width: { size: 8360, type: WidthType.DXA },
    columnWidths: [2090, 2090, 2090, 2090],
    rows: [headerRow, ...dataRows],
  });
}

function decisionTable() {
  const rows = [
    ['Monorepo',          'Turborepo',        'Simpler for Next.js + FastAPI. nx is overkill for 2 apps. 20 min setup.'],
    ['Location search',   'Internal cities DB','Reference site uses it. Avoids Google Places API cost per keystroke. Seed from GeoNames CSV + pg_trgm fuzzy search.'],
    ['PDF generation',    'WeasyPrint',        'HTML→PDF with Tamil Unicode support. ReportLab requires manual x/y positioning — weeks of extra work for Tamil text.'],
    ['i18n',              'next-intl',         'Extract all Tamil strings from mock data first, then wire next-intl. Tamil/English toggle, preference stored in user profile.'],
    ['Chart rendering',   'SVG React component','Render Rasi/Navamsam as React SVG. Works in browser (interactive) and PDF (renderToStaticMarkup). One codebase, two outputs.'],
    ['Payments',          'Razorpay',          'Indian payment gateway. Supports UPI, cards, netbanking. Webhook-based subscription activation.'],
  ];

  const header = new TableRow({
    tableHeader: true,
    children: ['Decision', 'Choice', 'Rationale'].map((h, i) => new TableCell({
      borders,
      width: { size: [1600, 1800, 4960][i], type: WidthType.DXA },
      shading: { fill: COLORS.navy, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 80 },
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, font: 'Arial', color: COLORS.white })] })],
    })),
  });

  const dataRows = rows.map(([decision, choice, rationale]) => new TableRow({
    children: [
      new TableCell({ borders, width: { size: 1600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: decision, bold: true, size: 20, font: 'Arial', color: COLORS.navy })] })] }),
      new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 80 },
        shading: { fill: COLORS.goldLight, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: choice, bold: true, size: 20, font: 'Arial', color: COLORS.amber })] })] }),
      new TableCell({ borders, width: { size: 4960, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: rationale, size: 19, font: 'Arial', color: COLORS.gray })] })] }),
    ],
  }));

  return new Table({
    width: { size: 8360, type: WidthType.DXA },
    columnWidths: [1600, 1800, 4960],
    rows: [header, ...dataRows],
  });
}

function timelineTable() {
  const phases = [
    { num: '1', title: 'Foundation',         weeks: 'Wk 1–2',   color: COLORS.purple, tasks: 6 },
    { num: '2', title: 'Calc Engine',         weeks: 'Wk 3–5',   color: COLORS.teal,   tasks: 10 },
    { num: '3', title: 'Core Pages',          weeks: 'Wk 6–9',   color: COLORS.amber,  tasks: 9 },
    { num: '4', title: 'Features',            weeks: 'Wk 10–13', color: COLORS.pink,   tasks: 7 },
    { num: '5', title: 'Polish & Deploy',     weeks: 'Wk 14–16', color: COLORS.blue,   tasks: 7 },
  ];

  const weekCols = Array.from({ length: 16 }, (_, i) => i + 1);
  const phaseWeekRanges = [[1,2],[3,5],[6,9],[10,13],[14,16]];
  const colW = 420;
  const labelW = 1400;
  const totalW = labelW + colW * 16;

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: labelW, type: WidthType.DXA },
        shading: { fill: COLORS.navy, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: 'Phase', bold: true, size: 18, font: 'Arial', color: COLORS.white })] })],
      }),
      ...weekCols.map(w => new TableCell({
        borders: noBorders,
        width: { size: colW, type: WidthType.DXA },
        shading: { fill: COLORS.navy, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 20, right: 20 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `W${w}`, bold: true, size: 14, font: 'Arial', color: COLORS.gold })] })],
      })),
    ],
  });

  const phaseRows = phases.map((p, pi) => {
    const [wStart, wEnd] = phaseWeekRanges[pi];
    return new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: labelW, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 80 },
          children: [
            new Paragraph({ children: [new TextRun({ text: `Phase ${p.num}: ${p.title}`, bold: true, size: 19, font: 'Arial', color: COLORS.navy })] }),
            new Paragraph({ children: [new TextRun({ text: `${p.tasks} tasks`, size: 16, font: 'Arial', color: COLORS.gray })], spacing: { before: 20 } }),
          ],
        }),
        ...weekCols.map(w => new TableCell({
          borders,
          width: { size: colW, type: WidthType.DXA },
          shading: { fill: (w >= wStart && w <= wEnd) ? p.color : COLORS.grayLight, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 20, right: 20 },
          children: [new Paragraph({ children: [new TextRun({ text: '' })] })],
        })),
      ],
    });
  });

  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: [labelW, ...weekCols.map(() => colW)],
    rows: [headerRow, ...phaseRows],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial', color: COLORS.navy },
        paragraph: { spacing: { before: 400, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: COLORS.navy },
        paragraph: { spacing: { before: 280, after: 100 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, font: 'Arial', color: COLORS.gray },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            new TextRun({ text: 'JothiSoft — Master Build Plan', bold: true, size: 18, font: 'Arial', color: COLORS.navy }),
            new TextRun({ text: '  |  Confidential', size: 18, font: 'Arial', color: COLORS.gray }),
          ],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.gold, space: 4 } },
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          children: [new TextRun({ children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size: 16, font: 'Arial', color: COLORS.gray })],
          alignment: AlignmentType.RIGHT,
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.border, space: 4 } },
        })],
      }),
    },
    children: [

      // ── COVER ─────────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'JothiSoft', bold: true, size: 72, font: 'Arial', color: COLORS.navy })],
        spacing: { before: 600, after: 80 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Master Build Plan', size: 40, font: 'Arial', color: COLORS.gold })],
        spacing: { before: 0, after: 80 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Tamil Astrology SaaS — Full-Stack Architecture & Delivery Roadmap', size: 22, font: 'Arial', color: COLORS.gray })],
        spacing: { before: 0, after: 480 },
      }),
      summaryTable(),
      sp(200),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Next.js 14  ·  FastAPI  ·  Supabase  ·  Swiss Ephemeris  ·  Razorpay', size: 19, font: 'Arial', color: COLORS.gray })],
        spacing: { before: 120, after: 0 },
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── LAYER LEGEND ──────────────────────────────────────────────────────
      heading1('Layer Legend'),
      para('Each task is tagged with the layer it belongs to:'),
      sp(80),
      legendTable(),
      sp(80),

      // ── KEY DECISIONS ─────────────────────────────────────────────────────
      heading1('Key Architecture Decisions'),
      para('These decisions are finalized. Do not revisit them during the build.'),
      sp(80),
      decisionTable(),
      sp(80),

      // ── TIMELINE ──────────────────────────────────────────────────────────
      heading1('16-Week Delivery Timeline'),
      sp(80),
      timelineTable(),
      new Paragraph({ children: [new PageBreak()] }),

      // ── PHASE 1 ───────────────────────────────────────────────────────────
      phaseHeader('1', 'Foundation — Infra, Auth, DB Schema', 'Weeks 1–2', COLORS.purple),
      sp(100),
      para('Everything else depends on this phase being solid. Do not start Phase 2 until auth and DB schema are reviewed and signed off.'),
      sp(80),

      heading3('Infrastructure'),
      taskTable([
        taskRow('Monorepo setup with Turborepo',
          'Create /apps/web (Next.js 14), /apps/api (FastAPI Python), /packages/shared (TypeScript types, shared utils). Turborepo pipelines for build, dev, lint.',
          'INFRA'),
        taskRow('Docker Compose dev environment',
          'One docker-compose.yml spins up: Next.js (3000), FastAPI (8000), Supabase local (54321), Redis (6379). Single command: docker compose up.',
          'INFRA'),
        taskRow('Supabase schema design',
          'Tables: users, subscriptions, birth_profiles, horoscope_cache, baby_names (5000+ rows), nakshatra_porutham_matrix, panchangam_cache, content (prediction texts). RLS policies per user row.',
          'BE'),
        taskRow('Indian cities database seed',
          'Load GeoNames cities-of-india dataset into Supabase cities table (name, lat, lng, state). Enable pg_trgm extension for fuzzy search. No Google Places API needed.',
          'BE'),
      ]),

      sp(80),
      heading3('Auth System'),
      taskTable([
        taskRow('Phone OTP auth (Supabase + Twilio)',
          'POST /api/auth/send-otp (phone) → Twilio OTP SMS. POST /api/auth/verify-otp (phone, code) → JWT. No passwords. Matches original PHP app behaviour.',
          'BE'),
        taskRow('Subscription gating middleware',
          'FastAPI dependency check_plan(required: Plan) that reads user plan from JWT claims. Returns HTTP 403 + {upgrade_url} if plan insufficient. Applied to all calc endpoints.',
          'BE'),
        taskRow('Auth flow in Next.js',
          'Login page → phone input → OTP screen → dashboard redirect. Zustand authStore: { user, token, plan }. Protected route HOC redirects unauthenticated users. Already have Zustand installed.',
          'FE'),
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      // ── PHASE 2 ───────────────────────────────────────────────────────────
      phaseHeader('2', 'Calculation Engine — FastAPI + Swiss Ephemeris', 'Weeks 3–5', COLORS.teal),
      sp(100),
      para('This is the highest-risk phase. Validate every calculation against published Tamil almanacs (Pambu Panchangam) before wiring to the frontend. Wrong calculations = angry users.'),
      sp(80),

      heading3('Core Astronomy Engine'),
      taskTable([
        taskRow('Swiss Ephemeris base wrapper',
          'pip install pyswisseph. Module ephem_core.py: get_planet_positions(jd, lat, lng) → dict of 9 grahas in decimal degrees (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu). Julian day conversion utils.',
          'BE'),
        taskRow('Panchangam engine',
          'tithi = (moon_long - sun_long) / 12. nakshatra = moon_long / 13.333. yogam = (sun_long + moon_long) / 13.333. karanam = half-tithi index. Rahu kalam by weekday lookup table. Sunrise/sunset via ephem lib. Endpoint: GET /calc/panchangam?date&lat&lng',
          'BE'),
        taskRow('Horoscope chart engine (Rasi + Navamsam)',
          'Lagna from birth time + location. All 9 planets placed in 12 houses (Equal house system). Navamsam (D9): each sign divided into 9 parts. Returns house-wise planet placement for chart rendering. POST /calc/horoscope',
          'BE'),
        taskRow('Vimshottari dasha engine',
          'Birth nakshatra → dasha lord → remaining balance at birth. Full timeline: mahadasha (9 lords x years) → antardasha (sub-periods) → pratyantara. Fixed table: Su=6, Mo=10, Ma=7, Ra=18, Ju=16, Sa=19, Me=17, Ke=7, Ve=20. POST /calc/dasha',
          'BE'),
        taskRow('KP system — Antharam (Jathagam 4.0)',
          '249 KP sub-divisions: each zodiac degree maps to nakshatra lord → sub-lord → sub-sub-lord. Used for event timing precision. Required for the Jathagam 4.0 premium feature. POST /calc/kp',
          'BE'),
        taskRow('Transit (Gochara) engine',
          'Current date planet positions vs natal chart positions. Returns transit house for each planet relative to natal lagna and natal moon. Used for Gocharapalan page. GET /calc/transit?birth_date&birth_lat&birth_lng',
          'BE'),
      ]),

      sp(80),
      heading3('Matching & Numerology Engines'),
      taskTable([
        taskRow('Nakshatra porutham — 27x27 matrix',
          '10 porutham categories: Dinam, Ganam, Mahendram, Stree Dirgham, Yoni, Rasi, Rajju, Vedha, Vasya, Varna. Hardcoded JSON for all 729 nakshatra pairs. Pure lookup — no astronomy. Total score + verdict logic. POST /calc/matching/star',
          'BE'),
        taskRow('Full horoscope matching engine',
          'Derives from horoscope engine. Papasamyam (equal affliction check), dasa sandhi (dasha overlap), mangal dosha detection. Returns per-check results + aggregate compatibility score. POST /calc/matching/horoscope',
          'BE'),
        taskRow('Numerology engine',
          'Chaldean table for Tamil Unicode characters. Name number, life path (DOB digit sum), destiny number, soul urge (vowels only). ~120 lines of pure arithmetic. POST /calc/numerology/name and POST /calc/numerology/date',
          'BE'),
        taskRow('Panchapakshi (bird oracle) engine',
          'Bird lord by birth nakshatra + day of week + time of day → one of 5 activities (ruling/eating/walking/dying/sleeping). Used for Prasnam Panchapakshi page. POST /calc/prasnam/panchapakshi',
          'BE'),
      ]),

      sp(80),
      heading3('Caching Layer'),
      taskTable([
        taskRow('Redis panchangam cache',
          'Key: panchangam:{date}:{lat:.2f}:{lng:.2f}. TTL: 86400s (24h). Panchangam for a date+location never changes — eliminates repeated Swiss Ephemeris calls. Saves ~200ms per dashboard load.',
          'INFRA'),
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      // ── PHASE 3 ───────────────────────────────────────────────────────────
      phaseHeader('3', 'Core Pages — Dashboard, Horoscope, Panchangam', 'Weeks 6–9', COLORS.amber),
      sp(100),
      para('The dashboard shell is already built. This phase wires it to live data and builds the two most-used feature sections.'),
      sp(80),

      heading3('Dashboard (already scaffolded — wire to live data)'),
      taskTable([
        taskRow('Wire TodayHero to live panchangam API',
          'Replace MOCK_PANCHANGAM with SWR fetch: GET /calc/panchangam?date=today&lat&lng. Use stored user location (from birth_profiles) or browser geolocation fallback. Show Skeleton component while loading.',
          'BOTH'),
        taskRow('Wire user profile to Supabase',
          'Replace MOCK_USER with GET /api/user/profile from Supabase session. Plan badge, expiry date, phone number are all live. Handle expired plan state with renewal CTA.',
          'BOTH'),
        taskRow('Location selection + storage',
          'First-login prompt to set default city. Fuzzy search against internal cities table. Store in birth_profiles.default_location. Used for all panchangam calls.',
          'BOTH'),
      ]),

      sp(80),
      heading3('Horoscope Section — 8 pages'),
      taskTable([
        taskRow('Birth details form',
          'Fields: name, DOB (date picker), TOB (time picker), place (cities autocomplete → lat/lng). Validation. Submit → POST /calc/horoscope. Save result to birth_profiles table. Support multiple profiles per user.',
          'BOTH'),
        taskRow('Rasi + Navamsam SVG chart renderer',
          'React SVG component: 4x3 grid of 12 houses. Planet labels in Tamil (சூ, ச, கு, செ, சு, வி, ச, ர, கே, ல). Active house highlighted. Reusable for both Rasi and Navamsam. renderToStaticMarkup for PDF use.',
          'FE'),
        taskRow('PDF horoscope generation (Sanjeevi + Book formats)',
          'FastAPI POST /calc/horoscope/pdf: render chart SVG + prediction text into WeasyPrint HTML template. Tamil font embedded (Anek Tamil). Return signed Supabase Storage URL (valid 1hr). Frontend downloads via anchor link.',
          'BE'),
        taskRow('Dasha period timeline page',
          'Horizontal timeline showing current mahadasha highlighted. Accordion to expand antardasha sub-periods. Current sub-period marked with pulsing indicator. Data from POST /calc/dasha.',
          'FE'),
        taskRow('Star prediction page (Nakshatra palan)',
          '27-row content table in Supabase. Fetch prediction by birth nakshatra. Rich Tamil sections: general, career, family, health, lucky details. Nakshatra visual header.',
          'BOTH'),
        taskRow('Transit predictions page (Gochara palan)',
          'Current transits over natal chart. Table of 9 planets with current house, effect summary from content DB. Refresh button for live data. GET /calc/transit.',
          'BOTH'),
        taskRow('KP Jathagam 4.0 page (Antharam)',
          'KP chart display with sub-lord table. Sub-sub-lord (pratyantara) accordion. Premium-gated behind PREMIUM plan badge. POST /calc/kp.',
          'BOTH'),
      ]),

      sp(80),
      heading3('Panchangam Section — 4 pages'),
      taskTable([
        taskRow('Daily panchangam page',
          'Full day view: tithi, nakshatra, yogam, karanam with Tamil names. Rahu kalam, Yamagandam, Gulika kalam time bands. Sunrise/sunset. Special day badge (Amavasai, Sashti etc.). Date navigator arrows.',
          'BOTH'),
        taskRow('Monthly panchangam calendar',
          '6-row month grid. Each cell: date + tithi name + nakshatra initial. Special days highlighted with category colours. Month/year navigator. Batch API: 30 panchangam calls in one request.',
          'BOTH'),
        taskRow('Muhurtham (auspicious time) finder',
          'Form: purpose dropdown (wedding/housewarming/vehicle/travel/business) + date range + location. POST /calc/muhurtham/search → sorted list of auspicious windows with quality score and brief reason.',
          'BOTH'),
        taskRow('Panchangam info / education page',
          'Static + dynamic content explaining tithi/nakshatra/yogam/karanam system in Tamil. Linked from daily panchangam page for new users.',
          'FE'),
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      // ── PHASE 4 ───────────────────────────────────────────────────────────
      phaseHeader('4', 'Remaining Features — Matching, Numerology, Special Days', 'Weeks 10–13', COLORS.pink),
      sp(100),
      para('15 pages covering marriage matching, numerology, vastu, special viratham days, and the Prasnam section.'),
      sp(80),

      heading3('Marriage Matching — 4 pages'),
      taskTable([
        taskRow('Star matching (Nakshatra porutham) UI',
          'Two nakshatra dropdowns (27 options each). POST /calc/matching/star → 10-row porutham result table: name, score, max, verdict. Row colors: green (pass) / amber (partial) / red (fail). Total score + final verdict banner.',
          'FE'),
        taskRow('Full horoscope matching UI',
          'Two side-by-side birth detail forms (reuse from horoscope section). POST /calc/matching/horoscope → compatibility report: Papasamyam score, dasa sandhi warning, mangal dosha indicator, overall percentage.',
          'BOTH'),
        taskRow('Detailed matching (Virivana porutham)',
          'Extended version of star matching with additional Nakshatra eligibility checks. PRO-gated. Tabbed layout: overview / detail / report.',
          'BOTH'),
        taskRow('Premium matching (Porutham unmai)',
          'Most detailed compatibility check. Includes all above + Katara/Vedha dosha. PREMIUM-gated. Generates downloadable PDF report.',
          'BOTH'),
      ]),

      sp(80),
      heading3('Numerology & Vastu — 5 pages'),
      taskTable([
        taskRow('Name numerology page',
          'Tamil Unicode keyboard helper for name input (27 consonant groups). POST /calc/numerology/name → Chaldean number, ruling planet, prediction paragraph. Character-by-character value breakdown table.',
          'BOTH'),
        taskRow('Date numerology page',
          'DOB + name inputs. POST /calc/numerology/date → life path, destiny, soul urge numbers. Compatibility between name number and life path. Lucky dates this month.',
          'BOTH'),
        taskRow('Age calculator',
          'DOB input → exact age (years, months, days, hours). Next birthday countdown. Pure date math, no API call.',
          'FE'),
        taskRow('Vastu days page',
          'Purpose selector (construction/purchase/entry/renovation) + month → list of auspicious dates. Derived from panchangam engine tithi/nakshatra filters.',
          'BOTH'),
        taskRow('Manaiyadi Shastram (house dimensions)',
          'Width/length input in feet → vastu compatibility score. Direction compass showing auspicious/inauspicious zones. Rule-based, no external API.',
          'BOTH'),
      ]),

      sp(80),
      heading3('Special Days & Prasnam — 15 pages'),
      taskTable([
        taskRow('Special viratham day pages (10 pages)',
          'One page each: Amavasai, Tharpanam, Pournami, Sashti, Kantha Viratham, Krithigai, Uthiram, Tamil New Year, Tamil Panchangam, Jwalini. Each shows: next occurrence date (from panchangam engine), significance text (Supabase content), related viratham instructions.',
          'BOTH'),
        taskRow('Prasnam Jathagam page',
          'Prashna chart: cast horoscope for the current moment of the question. Same chart renderer as horoscope but using current time + querent location. Interpretation from content DB.',
          'BOTH'),
        taskRow('Katara Prasnam page',
          'Simplified prashna: querent picks a number 1–12 → prediction from mapped content. Lookup-based, no calculation.',
          'FE'),
        taskRow('Panchapakshi pages (Pakshi 1 + Pakshi 2)',
          'Two views of Panchapakshi system. Pakshi 1: current bird activity by time of day. Pakshi 2: compatibility between two persons\' bird lords. POST /calc/prasnam/panchapakshi.',
          'BOTH'),
        taskRow('Baby names database + search',
          'Seed Supabase baby_names: 5000+ Tamil names with nakshatra starting syllable, gender, meaning, rasi. Search UI: nakshatra filter + gender toggle + first-letter filter + keyword search. Paginated results. GET /api/baby-names.',
          'BOTH'),
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      // ── PHASE 5 ───────────────────────────────────────────────────────────
      phaseHeader('5', 'Polish, Payments & Deployment', 'Weeks 14–16', COLORS.blue),
      sp(100),
      para('The product is functionally complete after Phase 4. Phase 5 is about making it production-ready, monetisable, and shippable.'),
      sp(80),

      heading3('Payments & Subscription'),
      taskTable([
        taskRow('Razorpay integration',
          'POST /api/payment/create-order → Razorpay order ID. Client completes payment. Webhook POST /api/payment/webhook → verify signature → update subscriptions table. Plans: FREE (default) / PRO ₹299/mo / PREMIUM ₹499/mo.',
          'BE'),
        taskRow('Feature gating UI',
          'PRO/PREMIUM-locked ModuleCards show upgrade modal on click (blur overlay + plan requirement badge). Blur is purely visual — route is still server-protected. Upgrade modal shows plan comparison + Razorpay checkout button.',
          'FE'),
        taskRow('Subscription management page',
          'Current plan display, renewal date, upgrade/downgrade options. Cancel subscription flow with confirmation. Invoice download (PDF from Razorpay webhook data).',
          'BOTH'),
      ]),

      sp(80),
      heading3('Frontend Polish'),
      taskTable([
        taskRow('Framer Motion animations',
          'Staggered page entrance (page.tsx variants), spring hover on ModuleCards, whileInView section reveals for CategorySections, Header slide-down on mount, BottomNav spring tap. All in framer-motion v12 already installed.',
          'FE'),
        taskRow('Full mobile responsive pass',
          'Test every page at 375px (iPhone SE), 430px (iPhone Pro Max), 768px (tablet). Fix: BottomNav safe-area-inset-bottom, 44px min touch targets, Tamil text no-wrap issues, panchangam grid 2-col on mobile, canvas resize.',
          'FE'),
        taskRow('Tamil + English i18n',
          'Extract all Tamil strings from mock data into messages/ta.json. Create messages/en.json. Wire next-intl. Language toggle in Header. Persist preference to user profile. URL locale prefix optional.',
          'FE'),
        taskRow('Loading states + error boundaries',
          'Skeleton components for all data-fetching pages. Global error boundary with Tamil error message. Toast notifications for form submissions. Network offline indicator.',
          'FE'),
      ]),

      sp(80),
      heading3('Deployment'),
      taskTable([
        taskRow('Next.js → Vercel',
          'Connect GitHub repo. Set env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, FASTAPI_URL, NEXT_PUBLIC_RAZORPAY_KEY_ID. Preview deployments per PR. Production on main branch.',
          'INFRA'),
        taskRow('FastAPI → Railway',
          'Dockerfile: Python 3.11-slim + pyswisseph + Swiss Ephemeris data files (ephe/ directory included). Deploy to Railway (~$5/mo). Redis as Railway addon. CORS restricted to Vercel domain.',
          'INFRA'),
        taskRow('GitHub Actions CI/CD',
          'On PR: run TypeScript check, ESLint, pytest for calc engine. On merge to main: auto-deploy to Vercel + Railway. Fail the deploy if any calc unit test fails.',
          'INFRA'),
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      // ── TECH STACK ────────────────────────────────────────────────────────
      heading1('Full Tech Stack'),
      sp(80),
      stackTable(),
      sp(200),

      // ── CRITICAL PATH ─────────────────────────────────────────────────────
      heading1('Critical Path'),
      para('These 5 things must work before anything else matters:'),
      sp(80),
      ...[
        ['1', 'Supabase schema + RLS', 'All data depends on this being right. Fix schema mistakes early — not after 30 pages of queries are written.'],
        ['2', 'Phone OTP auth flow', 'Every feature is behind auth. No auth = nothing works.'],
        ['3', 'Panchangam engine validated', 'Test tithi/nakshatra output against Pambu Panchangam for 30 dates. If this is wrong, the hero card is wrong every single day.'],
        ['4', 'TodayHero wired to live API', 'First proof the stack works end-to-end. Dashboard loads → calls FastAPI → returns panchangam → renders. If this works, everything else is repetition.'],
        ['5', 'Horoscope chart SVG renderer', 'Reused across 8+ pages and in PDF generation. Build it right once.'],
      ].map(([num, title, desc]) => new Table({
        width: { size: 8360, type: WidthType.DXA },
        columnWidths: [600, 7760],
        rows: [new TableRow({
          children: [
            new TableCell({
              borders: noBorders,
              width: { size: 600, type: WidthType.DXA },
              shading: { fill: COLORS.gold, type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 140, right: 80 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: num, bold: true, size: 32, font: 'Arial', color: COLORS.white })] })],
            }),
            new TableCell({
              borders: { top: border, bottom: border, left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, right: border },
              width: { size: 7760, type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 140, right: 120 },
              children: [
                new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 22, font: 'Arial', color: COLORS.navy })] }),
                new Paragraph({ children: [new TextRun({ text: desc, size: 19, font: 'Arial', color: COLORS.gray })], spacing: { before: 40 } }),
              ],
            }),
          ],
        })],
      })).flatMap((t, i) => [t, sp(60)]),

    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/mnt/user-data/outputs/JothiSoft_Master_Plan.docx', buf);
  console.log('Done');
});
