import React from 'react'

interface InvocationPageProps {
  pageNumber: number
}

export function InvocationPage({ pageNumber }: InvocationPageProps) {
  if (pageNumber === 1) {
    return (
      <div className="page-print-container jathagam-2-wrapper flex-1 flex flex-col justify-between">
        <div className="inner-border flex flex-col justify-between py-12 px-8">
          
          {/* Header ornament */}
          <div className="text-center text-[var(--sripathi-static-framework)] font-bold text-sm tracking-[0.2em] uppercase opacity-85">
            ✦ மங்களாரம்பம் ✦
          </div>

          {/* Center Verse */}
          <div className="flex-1 flex flex-col justify-center items-center gap-8 my-auto">
            <h1 className="text-[var(--sripathi-static-framework)] text-3xl font-extrabold tracking-wide text-center leading-relaxed">
              ஓம் ஸ்ரீ விநாயகர் காப்பு
            </h1>
            
            <div className="w-16 h-[2px] bg-[var(--sripathi-dynamic-data)]" />

            <div className="flex flex-col gap-4 text-center">
              <p className="text-[var(--sripathi-static-framework)] text-xl font-bold leading-loose italic">
                ஹரி ஓம் நன்றாக குரு வாழ்க
              </p>
              <p className="text-[var(--sripathi-static-framework)] text-xl font-bold leading-loose italic">
                குருவே துணை
              </p>
            </div>
          </div>

          {/* Footer ornament */}
          <div className="text-center text-xs text-[var(--sripathi-static-framework)] font-bold tracking-wider opacity-60">
            பக்கம் 1
          </div>

        </div>
      </div>
    )
  }

  // Page 2: Invocation verse
  return (
    <div className="page-print-container jathagam-2-wrapper flex-1 flex flex-col justify-between">
      <div className="inner-border flex flex-col justify-between py-12 px-8">
        
        {/* Header ornament */}
        <div className="text-center text-[var(--sripathi-static-framework)] font-bold text-sm tracking-[0.2em] uppercase opacity-85">
          ✦ விநாயகர் காப்புச் செய்யுள் ✦
        </div>

        {/* Verse text */}
        <div className="flex-1 flex flex-col justify-center items-center my-auto">
          <div className="max-w-md p-8 rounded-2xl border-2 border-dotted border-[var(--sripathi-dynamic-data)] bg-[#fffdf9] text-center shadow-sm">
            <p className="text-[var(--sripathi-static-framework)] text-lg font-bold leading-[2.2] text-center whitespace-pre-line tracking-wide">
              {`பாருலகில் மாந்தர் பரவு ஜெனன பலனை\nகூர்மையுடன் நான் அறிந்து கூறுவேன்\nசீர்மேவும் செல்வக் கணபதியே\nசீர்காழி மால் மருகா கல்விக்கு விநாயகரே காப்பு`}
            </p>
          </div>

          <div className="mt-12 text-center text-[var(--sripathi-static-framework)] font-extrabold text-lg tracking-[0.15em]">
            - சுபம் -
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[var(--sripathi-static-framework)] font-bold tracking-wider opacity-60">
          பக்கம் 2
        </div>

      </div>
    </div>
  )
}
