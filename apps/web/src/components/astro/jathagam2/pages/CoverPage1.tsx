import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED } from '../shared/jathagam2.constants'

export function CoverPage1() {
  return (
    <PageWrapper showU={false}>
      <div className="flex-1 flex flex-col justify-center items-center text-center py-12">
        <div style={{ border: `3px solid ${PDF_RED}`, backgroundColor: PDF_RED, color: 'white', padding: '12px 36px', display: 'inline-block', fontWeight: 'bold', fontSize: '24px', marginBottom: '40px', borderRadius: '4px' }}>
          ஓம்ஸ்ரீவிநாயகர் காப்பு
        </div>
        <div style={{ color: PDF_GREEN, fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '32px' }}>
          ஹரி ஓம் நன்றாக குரு வாழ்க
        </div>
        <div style={{ color: PDF_GREEN, fontSize: '20px', fontWeight: 'bold', marginBottom: '32px' }}>
          குருவே துணை
        </div>
        <div style={{ color: PDF_GREEN, fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>
          பாருலகில் மாந்தர் பரவு
        </div>
        <div style={{ color: PDF_GREEN, fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>
          ஜெனன பலனை
        </div>
        <div style={{ color: PDF_GREEN, fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>
          கூர்மையுடன்
        </div>
        <div style={{ color: PDF_GREEN, fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '24px' }}>
          நான் அறிந்து கூறுவேன்
        </div>
        <div style={{ color: PDF_GREEN, fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>
          சீர்மேவும் செல்வக் கணபதியே
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '16px', color: PDF_GREEN, fontWeight: 'bold', marginTop: 'auto' }}>
        உ
      </div>
    </PageWrapper>
  )
}
