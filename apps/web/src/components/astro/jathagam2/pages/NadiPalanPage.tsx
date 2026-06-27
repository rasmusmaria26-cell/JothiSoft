import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { getNadi, NAKSHATRAS_TA_MAP } from '../shared/astroCalculations'
import type { HoroscopeResponse } from '@/types/astro'

interface NadiPalanPageProps {
  horoscope: HoroscopeResponse
}

export function NadiPalanPage({ horoscope }: NadiPalanPageProps) {
  const moonPlanet = horoscope.planets.find((p) => p.planet === 'Moon')
  const moonNakshatra = moonPlanet?.nakshatra ?? 'Ashwini'
  const nadi = getNadi(moonNakshatra)

  const nadiData = {
    Adi: {
      name: 'வாத தோஷம்',
      traits: 'சக்தி வாய்ந்த ஆற்றல், படைப்பாற்றல், நரம்பு மண்டலம் மற்றும் ஜீரண உணர்திறன்.',
      desc: 'ஆதி நாடியில் பிறந்த உங்களுக்கு வாத தோஷத்தின் ஆதிக்கம் அதிகமாக இருக்கும். நீங்கள் இயற்கையிலேயே மிகவும் சுறுசுறுப்பாகவும், கிரியேட்டிவ் சிந்தனைகள் நிறைந்தவராகவும் இருப்பீர்கள். எண்ணங்கள் அதிவேகமாக மாறும் தன்மை உடையது. உடல் நலனைப் பொறுத்தவரை நரம்புகள், எலும்புகள், வாய்வுத் தொல்லை மற்றும் வயிற்று உபாதைகள் தொடர்பான பிரச்சனைகள் வர வாய்ப்புள்ளது. எனவே, எளிதில் ஜீரணமாகும் உணவுகளை உட்கொள்வதும், மனதை அமைதியாக வைக்கும் தியானமும் உங்களுக்கு நல்லது.'
    },
    Madhya: {
      name: 'பித்த தோஷம்',
      traits: 'புத்தி கூர்மை, லட்சியம், உடல் உஷ்ணம் மற்றும் உணர்ச்சி வேகம்.',
      desc: 'மத்திய நாடியில் பிறந்த உங்களுக்கு பித்த தோஷத்தின் ஆதிக்கம் அதிகமாக இருக்கும். நீங்கள் கூர்மையான அறிவும், எதையும் திட்டமிட்டுச் செய்யும் ஆற்றலும் கொண்டவர். தலைமைப் பண்பு மற்றும் கோபம் அல்லது ஆவேசம் எளிதில் வரக்கூடும். உடல் நலனில் உஷ்ண சம்பந்தப்பட்ட நோய்கள், கண் எரிச்சல், நெஞ்செரிச்சல் மற்றும் தோல் நோய்கள் ஏற்படலாம். உடலைக் குளிர்ச்சியாக வைத்துக் கொள்ளும் உணவுப் பழக்கம் மற்றும் இளநீர் பருகுவது நல்லது.'
    },
    Antya: {
      name: 'கப தோஷம்',
      traits: 'அமைதி, சகிப்புத்தன்மை, நிலைத்தன்மை மற்றும் ஜீரண மந்தம்.',
      desc: 'அந்திய நாடியில் பிறந்த உங்களுக்கு கப தோஷத்தின் ஆதிக்கம் அதிகமாக இருக்கும். நீங்கள் பொறுமையானவராகவும், சாந்த குணம் கொண்டவராகவும் இருப்பீர்கள். எதற்கும் பதட்டப்படாமல் நிதானமாக முடிவெடுப்பீர்கள். உடல் நலனைப் பொறுத்தவரை சளி, இருமல், கபம், தொண்டை உபாதைகள் மற்றும் உடல் எடை அதிகரித்தல் போன்ற பிரச்சனைகள் வரலாம். முறையான உடற்பயிற்சி மற்றும் காரமான, சூடான உணவுகளை உட்கொள்வது உங்கள் ஆரோக்கியத்தை மேம்படுத்தும்.'
    }
  }[nadi]

  const nakshatraDisplay = NAKSHATRAS_TA_MAP[moonNakshatra] || moonNakshatra
  const nadiNameTa = nadi === 'Adi' ? 'ஆதி' : nadi === 'Madhya' ? 'மத்திய' : 'அந்திய'

  return (
    <PageWrapper>
      {/* Section Heading */}
      <div style={{ border: `1.5px solid var(--sripathi-static-framework)`, padding: '10px 28px', margin: '24px auto 36px', width: 'fit-content', textAlign: 'center', borderRadius: '4px' }}>
        <span style={{ color: 'var(--sripathi-static-framework)', fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>நாடிப் பலன்</span>
      </div>

      {/* Birth profile box */}
      <div style={{ border: '1.5px solid var(--sripathi-dynamic-data)', borderRadius: '8px', padding: '20px 24px', backgroundColor: '#fffdf6', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', borderBottom: '1px solid var(--sripathi-dynamic-data)', paddingBottom: '10px', color: 'var(--sripathi-narrative-text)' }}>
          <span style={{ fontWeight: '500' }}>பிறந்த நட்சத்திரம்</span>
          <span style={{ fontWeight: 'bold', color: 'var(--sripathi-static-framework)' }}>{nakshatraDisplay}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', borderBottom: '1px solid var(--sripathi-dynamic-data)', paddingBottom: '10px', paddingTop: '6px', color: 'var(--sripathi-narrative-text)' }}>
          <span style={{ fontWeight: '500' }}>ஜென்ம நாடி</span>
          <span style={{ fontWeight: 'bold', color: 'var(--sripathi-dynamic-data)' }}>{nadiNameTa} நாடி</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', paddingTop: '6px', color: 'var(--sripathi-narrative-text)' }}>
          <span style={{ fontWeight: '500' }}>தொடர்புடைய தோஷம்</span>
          <span style={{ fontWeight: 'bold', color: 'var(--sripathi-static-framework)' }}>{nadiData.name}</span>
        </div>
      </div>

      {/* Explanation Cards */}
      <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--sripathi-static-framework)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            முக்கிய குணாதிசயங்கள்
          </h4>
          <div style={{ borderLeft: '4px solid var(--sripathi-dynamic-data)', backgroundColor: 'rgba(184, 134, 11, 0.05)', padding: '16px 20px', borderRadius: '0 4px 4px 0', fontSize: '15px', color: 'var(--sripathi-narrative-text)', fontStyle: 'italic', lineHeight: '1.8' }}>
            {nadiData.traits}
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--sripathi-static-framework)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            ஆரோக்கியம் மற்றும் உணவுப் பரிந்துரை
          </h4>
          <p style={{ fontSize: '16px', lineHeight: '2.2', color: 'var(--sripathi-narrative-text)', textAlign: 'justify', textJustify: 'inter-word', whiteSpace: 'pre-line' }}>
            {nadiData.desc}
          </p>
        </div>
      </div>

      <div style={{ color: 'var(--sripathi-static-framework)', fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '32px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
