import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN } from '../shared/jathagam2.constants'

export function NotesPage() {
  const rows = Array.from({ length: 10 })

  return (
    <PageWrapper>
      <div style={{ border: `1px solid ${PDF_GREEN}`, padding: '4px 16px', margin: '8px auto 20px', width: 'fit-content', textAlign: 'center' }}>
        <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '13px' }}>குறிப்புகள்</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', borderLeft: `1px solid ${PDF_GREEN}`, borderRight: `1px solid ${PDF_GREEN}`, borderTop: `1px solid ${PDF_GREEN}` }}>
        {rows.map((_, idx) => (
          <div
            key={idx}
            style={{
              height: '45px',
              borderBottom: `1.5px solid ${PDF_GREEN}`,
              width: '100%',
            }}
          />
        ))}
      </div>

      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '14px', marginTop: '40px' }}>
        முற்றுப் பெற்றது.
      </div>
    </PageWrapper>
  )
}
