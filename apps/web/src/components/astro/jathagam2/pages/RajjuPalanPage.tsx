import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { getRajju, NAKSHATRAS_TA_MAP } from '../shared/astroCalculations'
import type { HoroscopeResponse } from '@/types/astro'

interface RajjuPalanPageProps {
  horoscope: HoroscopeResponse
}

export function RajjuPalanPage({ horoscope }: RajjuPalanPageProps) {
  const moonPlanet = horoscope.planets.find((p) => p.planet === 'Moon')
  const moonNakshatra = moonPlanet?.nakshatra ?? 'Ashwini'
  const rajju = getRajju(moonNakshatra)

  const rajjuData = {
    Siro: {
      name: 'சிரசு (தலை)',
      meaning: 'தலை மற்றும் அறிவு சார்ந்த பகுதியை குறிக்கும்.',
      desc: 'உங்களது நட்சத்திரம் சிரசு ரஜ்ஜுவைச் சார்ந்தது. இது உடலின் மிக முக்கியமான தலைப் பகுதியைக் குறிக்கும். சிந்தனை, திட்டமிடல், மற்றும் அறிவுத்திறன் ஆகியவற்றில் சிறந்து விளங்குவீர்கள். திருமணப் பொருத்தத்தைப் பொறுத்தவரை, தம்பதியர் இருவருக்கும் சிரசு ரஜ்ஜு ஒன்றாக இருந்தால் தம்பதிகளுள் ஒருவருக்கு ஆயுள் ஆபத்தோ அல்லது கடுமையான கருத்து வேறுபாடோ வரக்கூடும் என்பதால் இது தவிர்க்கப்படுகிறது. இதனை சிரசு தோஷம் என்பர்.'
    },
    Kanta: {
      name: 'கண்டம் (கழுத்து)',
      meaning: 'கழுத்து மற்றும் குரல்வளத்தைக் குறிக்கும்.',
      desc: 'உங்களது நட்சத்திரம் கண்ட ரஜ்ஜுவைச் சார்ந்தது. இது கழுத்து மற்றும் குரல்வளத்தைக் குறிக்கும். பேச்சுத்திறன், கருத்துக்களை வெளிப்படுத்துதல் மற்றும் பிறரைத் தன் பேச்சால் கவரும் குணம் உங்களிடம் இருக்கும். திருமணப் பொருத்தத்தின் போது இருவருக்கும் கண்ட ரஜ்ஜு ஒன்றாக இருந்தால், அது தம்பதிகளுள் ஒருவரின் ஆரோக்கியத்தைப் பாதிக்கலாம் அல்லது பேச்சுக்களால் விரிசல் ஏற்படலாம் என்பதால் கண்ட ரஜ்ஜு ஒன்றாக இருப்பதை தவிர்க்க வேண்டும்.'
    },
    Nabhi: {
      name: 'நாபி (தொப்புள்/வயிறு)',
      meaning: 'தொப்புள், வயிறு மற்றும் வம்ச விருத்தியைக் குறிக்கும்.',
      desc: 'உங்களது நட்சத்திரம் நாபி ரஜ்ஜுவைச் சார்ந்தது. இது வயிறு மற்றும் தொப்புள் பகுதியைக் குறிக்கும். வம்ச விருத்தி, ஆரோக்கியம் மற்றும் ஜீரணச் சக்தியோடு தொடர்புடையது. திருமணப் பொருத்தத்தில் இருவருக்கும் நாபி ரஜ்ஜு ஒன்றாக இருந்தால், அது குழந்தை பாக்கியத்தைப் பாதிக்கலாம் (நாபி தோஷம்) என்பதால் ஜோதிட ரீதியாக ஒரே நாபி ரஜ்ஜு உள்ள ஆணும் பெண்ணும் இணைவதை வழக்கமாகத் தவிர்ப்பர்.'
    },
    Kuru: {
      name: 'தொடை (ஊரு)',
      meaning: 'தொடை மற்றும் பொருளாதார நிலைத்தன்மையைக் குறிக்கும்.',
      desc: 'உங்களது நட்சத்திரம் தொடை (ஊரு) ரஜ்ஜுவைச் சார்ந்தது. இது தொடைப் பகுதியை குறிக்கும். இது ஒருவரின் பயணம், சுறுசுறுப்பு, மற்றும் பொருளாதார நிலைத்தன்மையோடு தொடர்புடையது. திருமணப் பொருத்தத்தில் இருருக்கும் ஒரே தொடை ரஜ்ஜு இருக்கும் பட்சத்தில், அது பொருளாதார நஷ்டத்தை அல்லது சொத்து இழப்பைத் தரக்கூடும் என்பதால் இத்தகைய பொருத்தத்தைத் தவிர்க்க வேண்டும்.'
    },
    Pada: {
      name: 'பாதம்',
      meaning: 'பாதம் மற்றும் பயணங்களை குறிக்கும்.',
      desc: 'உங்களது நட்சத்திரம் பாத ரஜ்ஜுவைச் சார்ந்தது. இது பாதப் பகுதியை குறிக்கும். இது அடித்தளம், கடின உழைப்பு மற்றும் நீண்ட தூரப் பயணங்களோடு தொடர்புடையது. திருமணப் பொருத்தத்தின் போது இருவருக்கும் பாத ரஜ்ஜு ஒன்றாக இருந்தால், அது அடிக்கடி பயணங்களில் தடங்கல் அல்லது வாழ்க்கையின் அடித்தளத்தில் சவால்களைத் தரக்கூடும் என்பதால், 일반적으로 பாத ரஜ்ஜு ஒன்றாக இருப்பதை ஜோதிடர்கள் தவிர்ப்பர்.'
    }
  }[rajju]

  const nakshatraDisplay = NAKSHATRAS_TA_MAP[moonNakshatra] || moonNakshatra
  const rajjuNameTa = rajju === 'Siro' ? 'சிரசு' : rajju === 'Kanta' ? 'கண்ட' : rajju === 'Nabhi' ? 'நாபி' : rajju === 'Kuru' ? 'தொடை' : 'பாத'

  return (
    <PageWrapper>
      {/* Section Heading */}
      <div style={{ border: `1.5px solid var(--sripathi-static-framework)`, padding: '10px 28px', margin: '24px auto 36px', width: 'fit-content', textAlign: 'center', borderRadius: '4px' }}>
        <span style={{ color: 'var(--sripathi-static-framework)', fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>ரஜ்ஜுப் பலன்</span>
      </div>

      {/* Birth profile box */}
      <div style={{ border: '1.5px solid var(--sripathi-dynamic-data)', borderRadius: '8px', padding: '20px 24px', backgroundColor: '#fffdf6', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', borderBottom: '1px solid var(--sripathi-dynamic-data)', paddingBottom: '10px', color: 'var(--sripathi-narrative-text)' }}>
          <span style={{ fontWeight: '500' }}>பிறந்த நட்சத்திரம்</span>
          <span style={{ fontWeight: 'bold', color: 'var(--sripathi-static-framework)' }}>{nakshatraDisplay}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', borderBottom: '1px solid var(--sripathi-dynamic-data)', paddingBottom: '10px', paddingTop: '6px', color: 'var(--sripathi-narrative-text)' }}>
          <span style={{ fontWeight: '500' }}>ஜென்ம ரஜ்ஜு</span>
          <span style={{ fontWeight: 'bold', color: 'var(--sripathi-dynamic-data)' }}>{rajjuNameTa} ரஜ்ஜு</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', paddingTop: '6px', color: 'var(--sripathi-narrative-text)' }}>
          <span style={{ fontWeight: '500' }}>உடல் உறுப்பு</span>
          <span style={{ fontWeight: 'bold', color: 'var(--sripathi-static-framework)' }}>{rajjuData.name}</span>
        </div>
      </div>

      {/* Explanation Cards */}
      <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--sripathi-static-framework)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            அடிப்படைக் குறியீடு
          </h4>
          <div style={{ borderLeft: '4px solid var(--sripathi-dynamic-data)', backgroundColor: 'rgba(184, 134, 11, 0.05)', padding: '16px 20px', borderRadius: '0 4px 4px 0', fontSize: '15px', color: 'var(--sripathi-narrative-text)', fontStyle: 'italic', lineHeight: '1.8' }}>
            {rajjuData.meaning}
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--sripathi-static-framework)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            ரஜ்ஜுவின் ஜோதிட முக்கியத்துவம்
          </h4>
          <p style={{ fontSize: '16px', lineHeight: '2.2', color: 'var(--sripathi-narrative-text)', textAlign: 'justify', textJustify: 'inter-word', whiteSpace: 'pre-line' }}>
            {rajjuData.desc}
          </p>
        </div>
      </div>

      <div style={{ color: 'var(--sripathi-static-framework)', fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '32px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
