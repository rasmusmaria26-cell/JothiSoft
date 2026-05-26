'use client';
import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label={language === 'ta' ? 'Switch to English' : 'Switch to Tamil'}
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
      <Languages size={15} color="var(--gold-bright)" />
      <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
    </button>
  );
}
