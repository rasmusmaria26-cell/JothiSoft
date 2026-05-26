'use client';
import { useTheme } from '@/lib/useTheme';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            '6px',
        background:     'var(--bg-elevated)',
        border:         '0.5px solid var(--bg-border)',
        borderRadius:   '999px',
        padding:        '6px 14px',
        cursor:         'pointer',
        fontFamily:     "'Anek Tamil', sans-serif",
        fontSize:       '13px',
        fontWeight:     500,
        color:          'var(--text-secondary)',
        transition:     'all 200ms ease',
      }}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={15} color="var(--gold-bright)" />
          <span style={{ color: 'var(--gold-bright)' }}>வெளிச்சம்</span>
        </>
      ) : (
        <>
          <Moon size={15} color="var(--text-secondary)" />
          <span>இருள்</span>
        </>
      )}
    </button>
  );
}
