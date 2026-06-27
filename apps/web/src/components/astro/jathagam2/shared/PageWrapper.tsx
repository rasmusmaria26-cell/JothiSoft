import React from 'react'
import { PDF_GREEN, PDF_RED, PDF_BLACK } from './jathagam2.constants'

interface PageWrapperProps {
  children: React.ReactNode
  showU?: boolean   // default true — show "உ" at top
}

export function PageWrapper({ children, showU = true }: PageWrapperProps) {
  const pageWrapperStyle = {
    width: '210mm',
    height: '297mm', // Strict full A4 height footprint
    padding: '15mm',  // Outer safety breathing room
    backgroundColor: '#ffffff',
    boxSizing: 'border-box' as const,
    position: 'relative' as const,
    pageBreakAfter: 'always' as const,
    breakAfter: 'page' as const,
    margin: '0 auto',
  }

  const outerGoldFrameStyle = {
    border: `4px double ${PDF_GREEN}`,
    height: '100%',
    width: '100%',
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
    overflow: 'hidden' as const,
  }

  const innerGoldFrameStyle = {
    border: `1.5px solid ${PDF_RED}`,
    position: 'absolute' as const,
    top: '6px',
    bottom: '6px',
    left: '6px',
    right: '6px',
    padding: '28px 32px',
    boxSizing: 'border-box' as const,
    color: PDF_BLACK,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden' as const,
  }

  return (
    <div className="jathagam-page relative" style={pageWrapperStyle}>
      <div style={outerGoldFrameStyle}>
        <div style={innerGoldFrameStyle}>
          {showU && (
            <div style={{ textAlign: 'center', fontSize: '15px', color: PDF_GREEN, marginBottom: '8px', fontWeight: 'bold' }}>
              உ
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

