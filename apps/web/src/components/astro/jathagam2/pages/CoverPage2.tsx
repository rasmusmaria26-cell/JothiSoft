import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED } from '../shared/jathagam2.constants'

export function CoverPage2() {
  return (
    <PageWrapper>
      <div className="flex-1 flex flex-col justify-center items-center text-center py-12">
        <div style={{ color: PDF_GREEN, fontSize: '22px', fontWeight: 'bold', marginBottom: '32px' }}>
          சீர்காழி மால் மருகா
        </div>
        <div style={{ color: PDF_GREEN, fontSize: '22px', fontWeight: 'bold', marginBottom: '40px' }}>
          கல்விக்கு விநாயகரே காப்பு
        </div>
        <div style={{ color: PDF_RED, fontSize: '18px', fontWeight: 'bold' }}>
          - சுபம் -
        </div>
      </div>
    </PageWrapper>
  )
}
