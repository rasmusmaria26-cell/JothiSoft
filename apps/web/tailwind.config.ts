import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        bg: {
          page: "var(--bg-page)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)",
          active: "var(--bg-active)",
          border: "var(--bg-border)",
        },
        gold: {
          deep: "var(--gold-deep)",
          mid: "var(--gold-mid)",
          bright: "var(--gold-bright)",
          tint: "var(--gold-tint)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
          inverse: "var(--text-inverse)",
        },
        cat: {
          horoscope: "var(--cat-horoscope)",
          panchangam: "var(--cat-panchangam)",
          marriage: "var(--cat-marriage)",
          numerology: "var(--cat-numerology)",
          prasnam: "var(--cat-prasnam)",
          special: "var(--cat-special)",
        },
        success: "var(--success)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        info: "var(--info)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        pill: "999px",
      },
      fontFamily: {
        sans: ['"Outfit"', "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
        kavivanar: ['"Kavivanar"', "cursive"],
        mukta: ['"Mukta Malar"', "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(1.2)' },
        },
        shimmerSweep: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 400ms ease-out forwards',
        'pulse-dot': 'pulseDot 1.5s infinite',
        'shimmer-sweep': 'shimmerSweep 3s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;

// Trigger rebuild
