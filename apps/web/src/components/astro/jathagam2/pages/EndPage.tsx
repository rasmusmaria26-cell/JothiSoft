import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN } from '../shared/jathagam2.constants'

export function EndPage() {
  return (
    <PageWrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          height: '100%',
          minHeight: '230mm',
        }}
      >
        <div
          style={{
            border: `3px double ${PDF_GREEN}`,
            borderRadius: '8px',
            padding: '40px 60px',
            textAlign: 'center',
            background: '#fffcf5',
            boxShadow: '0 4px 12px rgba(26, 92, 42, 0.05)',
          }}
        >
          <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '24px', letterSpacing: '0.2em', marginBottom: '16px' }}>
            முற்றும்
          </div>
          <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.1em' }}>
            - சுபம் -
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
