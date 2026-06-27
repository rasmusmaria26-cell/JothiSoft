import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED, PDF_BLACK, SIGN_MAP_TA, normalizeSign } from '../shared/jathagam2.constants'

interface LagnapalanPageProps {
  horoscope: any
  lagnapalanText: string
}

export function LagnapalanPage({ horoscope, lagnapalanText }: LagnapalanPageProps) {
  const lagnaSign = normalizeSign(horoscope.lagna?.sign ?? 'Mesha')

  return (
    <PageWrapper showU={false}>
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', marginBottom: '20px' }}>
        ஓம்ஸ்ரீநவக்கிரஹசகாயம்
      </div>

      <div style={{ border: `1px solid ${PDF_GREEN}`, padding: '6px 20px', margin: '12px auto 24px', width: 'fit-content', textAlign: 'center' }}>
        <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px' }}>லக்கன பலன்</span>
      </div>

      <div style={{ fontSize: '15px', color: PDF_GREEN, marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>ஜாதகர் ஜென்ம லக்கனம்</span>
        <span style={{ color: PDF_RED, fontWeight: 'bold', textDecoration: 'underline' }}>{SIGN_MAP_TA[lagnaSign]}</span>
      </div>

      <div style={{ color: PDF_BLACK, fontSize: '15px', lineHeight: '2.0', textAlign: 'justify', textJustify: 'inter-word', marginBottom: '24px', whiteSpace: 'pre-line' }}>
        {lagnapalanText}
      </div>

      <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '20px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
