import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export function LivePanchangamBanner() {
  return (
    <Link 
      href="/panchangam"
      className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] group"
      style={{
        background: 'linear-gradient(90deg, rgba(46,125,107,0.2) 0%, rgba(46,125,107,0.05) 100%)',
        border: '1px solid rgba(46,125,107,0.4)'
      }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cat-panchangam/20 text-cat-panchangam shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Calendar size={24} />
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg md:text-xl text-text-primary leading-tight">
              தின பஞ்சாங்கம்
            </h3>
            <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded-pill border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-dot shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <span className="text-[10px] font-bold text-red-500 tracking-wider">LIVE</span>
            </div>
          </div>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            இந்தியாவிற்கு மட்டும் துல்லியமானது
          </p>
        </div>
      </div>

      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-cat-panchangam/10 text-cat-panchangam shrink-0 group-hover:bg-cat-panchangam group-hover:text-white transition-colors duration-300">
        <ArrowRight size={18} />
      </div>
    </Link>
  );
}
