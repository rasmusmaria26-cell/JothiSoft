import React from 'react'
import { PDF_RED } from './jathagam2.constants'

interface BlankProps {
  value: string | number
  width?: string
  color?: string
  fontSize?: string
  textAlign?: 'left' | 'center' | 'right'
}

export function Blank({ value, width = '80px', color = PDF_RED, fontSize = '15px', textAlign = 'center' }: BlankProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: width,
        borderBottom: '1.5px dotted #666',
        margin: '0 4px',
        height: '24px',
        verticalAlign: 'bottom',
        position: 'relative',
      }}
    >
      <span
        style={{
          color: color,
          fontWeight: 'bold',
          fontSize: fontSize,
          lineHeight: '1',
          marginBottom: '2px',
          whiteSpace: 'nowrap',
          position: 'absolute',
          bottom: '2px',
          left: textAlign === 'left' ? '8px' : 0,
          right: textAlign === 'right' ? '8px' : 0,
          textAlign: textAlign,
        }}
      >
        {value}
      </span>
    </span>
  )
}
