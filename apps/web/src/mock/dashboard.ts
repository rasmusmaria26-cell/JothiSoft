// MOCK DATA
import {
  Star, FileText, Eye, BookOpen, Moon, Navigation,
  Baby, Layers, Clock, CalendarDays, Calendar, Info,
  Heart, GitMerge, Search, CheckCircle,
  Hash, Timer, Home, Ruler,
  HelpCircle, Zap, Bird, Feather,
  CircleDot, Flame, Sun, Gift, BookMarked, Sparkles,
} from 'lucide-react'

import { CategorySectionProps } from '../components/dashboard/CategorySection'

export const categoryData: CategorySectionProps[] = [
  {
    titleTa: 'ஜாதகம் & பலன்கள்',
    titleEn: 'Horoscope',
    colorHex: '#7b5ea7',
    modules: [
      { icon: Star,       labelTa: 'ஜாதகம்',         labelEn: 'Horoscope',      sublabelTa: 'Full Horoscope',  sublabelEn: 'Full Horoscope',  href: '/horoscope',           badge: 'TOP' },
      { icon: FileText,   labelTa: 'ஜாதகம் PDF',      labelEn: 'Horoscope PDF',  sublabelTa: 'ஒற்றை பக்கம்',        sublabelEn: 'Single Page',      href: '/horoscope/pdf' },
      { icon: BookMarked, labelTa: 'முழு ஜாதகம் (PDF)', labelEn: 'Full Jathagam (PDF)', sublabelTa: '20-பக்கங்கள்',        sublabelEn: '20 Pages',         href: '/horoscope/jathagam',  badge: 'NEW' },
      { icon: Sparkles,   labelTa: 'முழு ஜாதகம் 2.0',   labelEn: 'Full Jathagam 2.0', sublabelTa: '20-பக்கங்கள்',        sublabelEn: '20 Pages',         href: '/horoscope/jathagam', badge: 'NEW' },
      { icon: Eye,        labelTa: 'ஜாதக பலன்',      labelEn: 'Predictions',    sublabelTa: 'Prediction',      sublabelEn: 'Prediction',      href: '/horoscope/palan' },
      { icon: BookOpen,   labelTa: 'புத்தக ஜாதகம்',  labelEn: 'Book Chart',     sublabelTa: 'Book PDF',        sublabelEn: 'Book PDF',        href: '/horoscope/book' },
      { icon: Moon,       labelTa: 'நட்சத்திர பலன்', labelEn: 'Star Readings',  sublabelTa: 'Star',            sublabelEn: 'Star',            href: '/horoscope/star' },
      { icon: Navigation, labelTa: 'கோச்சார பலன்',   labelEn: 'Transit Palan',  sublabelTa: 'Transit',         sublabelEn: 'Transit',         href: '/horoscope/transit' },
      { icon: Baby,       labelTa: 'குழந்தை பெயர்',  labelEn: 'Baby Names',     sublabelTa: 'Names',           sublabelEn: 'Names',           href: '/baby-names' },
      { icon: Layers,     labelTa: 'ஜாதகம் 4.0',     labelEn: 'Horoscope 4.0',  sublabelTa: 'Antharam',        sublabelEn: 'Antharam',        href: '/horoscope/antharam',  badge: 'NEW' },
    ],
  },
  {
    titleTa: 'பஞ்சாங்கம் & முகூர்த்தம்',
    titleEn: 'Panchangam & Muhurtham',
    colorHex: '#2e7d6b',
    modules: [
      { icon: Clock,       labelTa: 'சுப முகூர்த்தம்',  labelEn: 'Muhurtham',      sublabelTa: 'Auspicious', sublabelEn: 'Auspicious', href: '/panchangam/muhurtham' },
      { icon: CalendarDays,labelTa: 'மாத பஞ்சாங்கம்',   labelEn: 'Monthly Panch',  sublabelTa: 'Monthly',    sublabelEn: 'Monthly',    href: '/panchangam/monthly' },
      { icon: Calendar,    labelTa: 'நாள் பஞ்சாங்கம்',  labelEn: 'Daily Panch',    sublabelTa: 'Daily',      sublabelEn: 'Daily',      href: '/panchangam',     badge: 'NEW' },
      { icon: Info,        labelTa: 'பஞ்சாங்கம் தகவல்', labelEn: 'Panch Info',     sublabelTa: 'Info',       sublabelEn: 'Info',       href: '/panchangam/info',      badge: 'NEW' },
    ],
  },
  {
    titleTa: 'திருமண பொருத்தம்',
    titleEn: 'Marriage Matching',
    colorHex: '#b0415e',
    modules: [
      { icon: Heart,       labelTa: 'நட்சத்திர பொருத்தம்', labelEn: 'Star Matching',  sublabelTa: 'Star Match',   sublabelEn: 'Star Match',   href: '/matching/star' },
      { icon: GitMerge,    labelTa: 'ஜாதக பொருத்தம்',      labelEn: 'Chart Matching', sublabelTa: 'Horoscope',    sublabelEn: 'Horoscope',    href: '/matching' },
      { icon: Search,      labelTa: 'விரிவான பொருத்தம்',   labelEn: 'Deep Match',     sublabelTa: 'Detailed',     sublabelEn: 'Detailed',     href: '/matching/detailed' },
    ],
  },
  {
    titleTa: 'எண்கணிதம் & வாஸ்து',
    titleEn: 'Numerology & Vastu',
    colorHex: '#1e6fa8',
    modules: [
      { icon: Hash,    labelTa: 'பெயர் எண்',     labelEn: 'Name Number',   sublabelTa: 'Name Num.',    sublabelEn: 'Name Num.',    href: '/numerology' },
      { icon: Calendar,labelTa: 'தேதி எண்',       labelEn: 'Date Number',   sublabelTa: 'Date Num.',    sublabelEn: 'Date Num.',    href: '/numerology' },
      { icon: Timer,   labelTa: 'வயது கணக்கிடு',  labelEn: 'Age Calc',      sublabelTa: 'Age Calc.',    sublabelEn: 'Age Calc.',    href: '/numerology',  badge: 'FREE' },
      { icon: Home,    labelTa: 'வாஸ்து நாட்கள்', labelEn: 'Vastu Days',    sublabelTa: 'Vastu Days',   sublabelEn: 'Vastu Days',   href: '/vastu/days' },
      { icon: Ruler,   labelTa: 'மனையடி',         labelEn: 'Dimensions',    sublabelTa: 'Dimensions',   sublabelEn: 'Dimensions',   href: '/vastu/house' },
    ],
  },
  {
    titleTa: 'பிரஸ்னம் & சாஸ்திரம்',
    titleEn: 'Prasnam',
    colorHex: '#a05c1a',
    modules: [
      { icon: HelpCircle, labelTa: 'பிரஸ்னம் ஜாதகம்', labelEn: 'Prasnam Chart',  sublabelTa: 'Chart',       sublabelEn: 'Chart',       href: '/prasnam' },
      { icon: Zap,        labelTa: 'கடிகார பிரஸ்னம்',  labelEn: 'Kadigara Prasnam', sublabelTa: 'Kadigara',    sublabelEn: 'Kadigara',    href: '/prasnam/katara' },
      { icon: Bird,       labelTa: 'பஞ்சபட்சி',        labelEn: 'Pancha Pakshi',  sublabelTa: 'Pancha',      sublabelEn: 'Pancha',      href: '/prasnam/panchapakshi' },
    ],
  },
  {
    titleTa: 'விசேஷ நாட்கள் & விரதங்கள்',
    titleEn: 'Special Days',
    colorHex: '#4a7c59',
    modules: [
      { icon: CircleDot,  labelTa: 'அமாவாசை',           labelEn: 'Amavasai',      sublabelTa: 'Amavasai',    sublabelEn: 'Amavasai',    href: '/special/amavasai' },
      { icon: CircleDot,  labelTa: 'தரவாசை',             labelEn: 'Tharpanam',     sublabelTa: 'Tharpanam',   sublabelEn: 'Tharpanam',   href: '/special/tharpanam' },
      { icon: CircleDot,  labelTa: 'பௌர்ணமி',            labelEn: 'Pournami',      sublabelTa: 'Pournami',    sublabelEn: 'Pournami',    href: '/special/pournami' },
      { icon: Star,       labelTa: 'சஷ்டி',              labelEn: 'Sashti',        sublabelTa: 'Sashti',      sublabelEn: 'Sashti',      href: '/special/sashti' },
      { icon: Flame,      labelTa: 'கந்த விரதம்',        labelEn: 'Kantha Vrat',   sublabelTa: 'Kantha',      sublabelEn: 'Kantha',      href: '/special/kantha' },
      { icon: Star,       labelTa: 'கிருத்திகை',         labelEn: 'Krithigai',     sublabelTa: 'Krithigai',   sublabelEn: 'Krithigai',   href: '/special/krithigai' },
      { icon: Sun,        labelTa: 'உத்திரம்',            labelEn: 'Uthiram',       sublabelTa: 'Uthiram',     sublabelEn: 'Uthiram',     href: '/special/uthiram',   badge: 'NEW' },
      { icon: Gift,       labelTa: 'சித்திரைப்பிறப்பு',  labelEn: 'Tamil NY',      sublabelTa: 'Tamil NY',    sublabelEn: 'Tamil NY',    href: '/special/newyear',   badge: 'NEW' },
      { icon: Flame,      labelTa: 'பிரதோஷம்',           labelEn: 'Pradosham',     sublabelTa: 'Pradosham',   sublabelEn: 'Pradosham',   href: '/special/pradosham' },
      { icon: Flame,      labelTa: 'ஜுவாலினி',           labelEn: 'Jwalini',       sublabelTa: 'Jwalini',     sublabelEn: 'Jwalini',     href: '/special/jwalini' },
    ],
  },
]
