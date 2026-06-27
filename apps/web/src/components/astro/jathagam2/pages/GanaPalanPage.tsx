import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { getGana, NAKSHATRAS_TA_MAP } from '../shared/astroCalculations'
import type { HoroscopeResponse } from '@/types/astro'

interface GanaPalanPageProps {
  horoscope: HoroscopeResponse
}

export function GanaPalanPage({ horoscope }: GanaPalanPageProps) {
  const moonPlanet = horoscope.planets.find((p) => p.planet === 'Moon')
  const moonNakshatra = moonPlanet?.nakshatra ?? 'Ashwini'
  const gana = getGana(moonNakshatra)

  const ganaData = {
    Deva: {
      name: 'தேவ கணம்',
      traits: 'அமைதியான நற்குணங்கள், இரக்க குணம், நேர்மை மற்றும் சகிப்புத்தன்மை.',
      desc: 'தேவ கணத்தில் பிறந்த நீங்கள் சாந்த குணமும், மென்மையான பேச்சும் கொண்டவர்களாக விளங்குவீர்கள். பிறருக்கு உதவும் நல்ல மனமும், ஆன்மீகத்திலும் தர்ம சிந்தனையிலும் ஈடுபாடும் கொண்டிருப்பீர்கள். கோபத்தை அடக்கும் சகிப்புத்தன்மை கொண்டவராகவும், சமூகத்தில் நற்பெயர் பெற்றவராகவும் திகழ்வீர்கள். எந்த ஒரு செயலிலும் நிதானமாகவும் நேர்மையாகவும் செயல்பட விரும்புவீர்கள்.'
    },
    Manusha: {
      name: 'மனித கணம்',
      traits: 'லட்சியம், விடாமுயற்சி, குடும்பப் பற்று மற்றும் நடைமுறை அறிவு.',
      desc: 'மனித கணத்தில் பிறந்த நீங்கள் கடின உழைப்பாளியாகவும், லட்சியம் கொண்டவராகவும் திகழ்வீர்கள். குடும்பத்தின் மீதும் சுற்றத்தார் மீதும் மிகுந்த அன்பும் பொறுப்பும் கொண்டிருப்பீர்கள். சராசரி மனித குணங்களான மகிழ்ச்சி, கவலை, கோபம் மற்றும் ஆசைகள் சம அளவில் உங்களிடம் காணப்படும். சமூகத்தில் உயர்ந்த நிலையை அடைய அயராது பாடுபடுவீர்கள் மற்றும் நடைமுறை வாழ்க்கைக்கு உகந்த அறிவுத்திறன் பெற்றிருப்பீர்கள்.'
    },
    Rakshasa: {
      name: 'இராட்சஸ கணம்',
      traits: 'துணிச்சல், சுதந்திர எண்ணம், தலைமைப் பண்பு மற்றும் உள்ளுணர்வு.',
      desc: 'இராட்சஸ கணத்தில் பிறந்த நீங்கள் அஞ்சாத நெஞ்சமும், மிகுந்த துணிச்சலும் கொண்டவர்களாக இருப்பீர்கள். எதற்கும் அஞ்சாமல் தங்களது கருத்துக்களை வெளிப்படையாகப் பேசுவீர்கள். தலைமைப் பண்பும், வலுவான உள்ளுணர்வும் கொண்டவர்கள். தங்களை எதிர்க்கும் எவரையும் எளிதில் வீழ்த்தும் வல்லமை படைத்தவர். சில சமயங்களில் உணர்ச்சிவசப்படக்கூடியவர்களாகவும், தங்களது சுதந்திரத்தில் எவரும் தலையிடுவதை விரும்பாதவராகவும் இருப்பீர்கள்.'
    }
  }[gana]

  const nakshatraDisplay = NAKSHATRAS_TA_MAP[moonNakshatra] || moonNakshatra

  return (
    <PageWrapper>
      {/* Section Heading */}
      <div style={{ border: `1.5px solid var(--sripathi-static-framework)`, padding: '10px 28px', margin: '24px auto 36px', width: 'fit-content', textAlign: 'center', borderRadius: '4px' }}>
        <span style={{ color: 'var(--sripathi-static-framework)', fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>கணப் பலன்</span>
      </div>

      {/* Birth profile box */}
      <div style={{ border: '1.5px solid var(--sripathi-dynamic-data)', borderRadius: '8px', padding: '20px 24px', backgroundColor: '#fffdf6', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', borderBottom: '1px solid var(--sripathi-dynamic-data)', paddingBottom: '10px', color: 'var(--sripathi-narrative-text)' }}>
          <span style={{ fontWeight: '500' }}>பிறந்த நட்சத்திரம்</span>
          <span style={{ fontWeight: 'bold', color: 'var(--sripathi-static-framework)' }}>{nakshatraDisplay}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', paddingTop: '6px', color: 'var(--sripathi-narrative-text)' }}>
          <span style={{ fontWeight: '500' }}>ஜென்ம கணம்</span>
          <span style={{ fontWeight: 'bold', color: 'var(--sripathi-dynamic-data)' }}>{ganaData.name}</span>
        </div>
      </div>

      {/* Explanation Cards */}
      <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--sripathi-static-framework)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            முக்கிய குணாதிசயங்கள்
          </h4>
          <div style={{ borderLeft: '4px solid var(--sripathi-dynamic-data)', backgroundColor: 'rgba(184, 134, 11, 0.05)', padding: '16px 20px', borderRadius: '0 4px 4px 0', fontSize: '15px', color: 'var(--sripathi-narrative-text)', fontStyle: 'italic', lineHeight: '1.8' }}>
            {ganaData.traits}
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--sripathi-static-framework)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            விரிவான குணாதிசயங்கள்
          </h4>
          <p style={{ fontSize: '16px', lineHeight: '2.2', color: 'var(--sripathi-narrative-text)', textAlign: 'justify', textJustify: 'inter-word', whiteSpace: 'pre-line' }}>
            {ganaData.desc}
          </p>
        </div>
      </div>

      <div style={{ color: 'var(--sripathi-static-framework)', fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '32px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
