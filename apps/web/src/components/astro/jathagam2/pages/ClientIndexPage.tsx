import React from 'react'
import type { JathagamProfile, AstrologerDetails } from '@/types/jathagam'

interface ClientIndexPageProps {
  horoscope: JathagamProfile
  astrologer: AstrologerDetails
  language: 'ta' | 'en'
}

export function ClientIndexPage({ horoscope, astrologer, language }: ClientIndexPageProps) {
  const isTa = language === 'ta'
  const profileName = horoscope.name
  const fatherName = horoscope.fatherName || ''
  const motherName = horoscope.motherName || ''
  const hometown = horoscope.hometown || horoscope.place || ''

  return (
    <div className="page-print-container jathagam-2-wrapper flex-1 flex flex-col justify-between">
      <div className="inner-border flex flex-col justify-between py-10 px-8">
        
        {/* Header Invocation */}
        <div className="text-center text-[var(--sripathi-static-framework)] font-bold text-lg mb-8 leading-relaxed">
          ஒம் ஸ்ரீ விநாயகர் சகாயம் <br />
          <span className="text-sm font-semibold opacity-80">ஸ்ரீ தேவ்யை நம</span>
        </div>

        {/* Client Index Form Layout */}
        <div className="flex-1 flex flex-col justify-start gap-8 mt-4">
          <div className="text-center text-[var(--sripathi-static-framework)] font-extrabold text-xl tracking-wider mb-2 border-b-2 border-dotted border-[var(--sripathi-dynamic-data)] pb-2 max-w-xs mx-auto">
            {isTa ? 'ஜாதகர் அறிமுகம்' : 'Client Profile'}
          </div>

          <div className="flex flex-col gap-6 text-base text-[var(--sripathi-narrative-text)]">
            <div className="flex items-end">
              <span className="text-[var(--sripathi-static-framework)] font-extrabold text-base whitespace-nowrap">
                {isTa ? 'பெயர்' : 'Name'} :
              </span>
              <span className="border-b border-dotted border-gray-400 flex-1 ml-3 text-[var(--sripathi-dynamic-data)] font-bold text-lg pl-2 pb-0.5">
                {profileName}
              </span>
            </div>

            <div className="flex items-end">
              <span className="text-[var(--sripathi-static-framework)] font-extrabold text-base whitespace-nowrap">
                {isTa ? 'தகப்பனார் பெயர்' : "Father's Name"} :
              </span>
              <span className="border-b border-dotted border-gray-400 flex-1 ml-3 text-[var(--sripathi-dynamic-data)] font-bold text-lg pl-2 pb-0.5">
                {fatherName}
              </span>
            </div>

            <div className="flex items-end">
              <span className="text-[var(--sripathi-static-framework)] font-extrabold text-base whitespace-nowrap">
                {isTa ? 'தாயார் பெயர்' : "Mother's Name"} :
              </span>
              <span className="border-b border-dotted border-gray-400 flex-1 ml-3 text-[var(--sripathi-dynamic-data)] font-bold text-lg pl-2 pb-0.5">
                {motherName}
              </span>
            </div>

            <div className="flex items-end">
              <span className="text-[var(--sripathi-static-framework)] font-extrabold text-base whitespace-nowrap">
                {isTa ? 'ஊர்' : 'Hometown'} :
              </span>
              <span className="border-b border-dotted border-gray-400 flex-1 ml-3 text-[var(--sripathi-dynamic-data)] font-bold text-lg pl-2 pb-0.5">
                {hometown}
              </span>
            </div>
          </div>

          {/* Software Writer Card */}
          <div className="mt-12 p-5 rounded-xl border border-[var(--sripathi-dynamic-data)]/30 bg-[#fffdf6] flex flex-col gap-3">
            <h4 className="text-[var(--sripathi-static-framework)] font-extrabold text-sm tracking-wide border-b border-[var(--sripathi-dynamic-data)]/20 pb-1.5">
              {isTa ? 'ஜாதகம் எழுதியவர் & மென்பொருள் விபரம்' : 'Horoscope Author & Software Details'} :
            </h4>
            <div className="text-xs space-y-2 text-[var(--sripathi-narrative-text)]">
              <div>
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'எழுதியவர்' : 'Author'}: </span>
                <span className="text-[var(--sripathi-dynamic-data)] font-semibold">{astrologer.name || 'Jothisoft Mobile Apps & Software'}</span>
              </div>
              <div>
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'முகவரி' : 'Address'}: </span>
                <span className="text-[var(--sripathi-dynamic-data)] font-semibold">{astrologer.address || 'Jothisoft Mobile Apps & Software, தமிழ்நாடு, இந்தியா'}</span>
              </div>
              <div>
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'அலைபேசி' : 'Mobile'}: </span>
                <span className="text-[var(--sripathi-dynamic-data)] font-semibold">{astrologer.phone || 'Whatsapp : 9659657770'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[var(--sripathi-static-framework)] font-bold tracking-wider opacity-60">
          பக்கம் 3
        </div>

      </div>
    </div>
  )
}
