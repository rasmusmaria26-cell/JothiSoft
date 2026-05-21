import React from 'react';
import { Badge, Card } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/i18n/translations';
import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function UserInfoCard() {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const { user, isLoading, clearAuth } = useAuthStore();

  const displayName = user?.name || (language === 'ta' ? 'அன்பரே' : 'User');
  const displayPhone = user?.phone || '';
  const displayPlan = user?.plan || 'FREE';
  
  const displayExpiry = user?.planExpiry 
    ? new Date(user.planExpiry).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: '2-digit'
      })
    : (language === 'ta' ? 'காலாவதியாகாது' : 'Never Expires');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearAuth();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <Card className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse" style={{ background: 'var(--bg-card)' }}>
        <div className="flex flex-col gap-2">
          <div className="h-6 w-32 bg-white/10 rounded" />
          <div className="h-4 w-24 bg-white/10 rounded" />
        </div>
        <div className="h-8 w-24 bg-white/10 rounded" />
      </Card>
    );
  }

  return (
    <Card 
      className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group"
      style={{
        background: 'linear-gradient(90deg, var(--bg-elevated) 0%, var(--bg-card) 100%)',
      }}
    >
      <div className="flex flex-col z-10">
        <div className="flex items-center gap-4">
          <h2 className={`text-xl md:text-2xl font-bold text-gold-bright flex items-baseline gap-2 ${language === 'ta' ? 'font-kavivanar' : 'font-serif'}`}>
            <span>{t.greeting},</span>
            <span className="text-text-primary font-sans">{displayName}</span>
          </h2>
        </div>
        <p className="text-sm text-text-muted mt-1 font-sans tracking-wide">
          {displayPhone}
        </p>
      </div>
      
      <div className="flex flex-col items-start md:items-end z-10 gap-2">
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 bg-bg-page border border-bg-border rounded-full p-1 cursor-pointer transition-colors hover:border-gold-deep/50"
            aria-label="Toggle Language"
          >
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${language === 'en' ? 'bg-gold-deep/20 text-gold-bright' : 'text-text-muted'}`}>
              EN
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${language === 'ta' ? 'bg-gold-deep/20 text-gold-bright' : 'text-text-muted'}`}>
              TA
            </span>
          </button>

          <Badge 
            className="bg-gold-deep/20 text-gold-bright border border-gold-deep/30 px-3 py-1 text-xs relative overflow-hidden"
          >
            <div 
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gold-bright/30 to-transparent -translate-x-full animate-[shimmerSweep_2s_infinite]" 
            />
            <span className="relative z-10 font-bold tracking-wide">{displayPlan}</span>
          </Badge>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-full px-3 py-1 text-[11px] font-bold cursor-pointer transition-colors"
          >
            <LogOut size={11} />
            <span>{t.logout}</span>
          </button>
        </div>
        <span className="text-[10px] text-text-muted">{t.exp}: {displayExpiry}</span>
      </div>
    </Card>
  );
}
