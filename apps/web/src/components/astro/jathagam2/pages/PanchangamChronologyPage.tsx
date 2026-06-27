import React from 'react'
import type { JathagamProfile } from '@/types/jathagam'
import type { HoroscopeResponse } from '@/types/astro'

interface PanchangamChronologyPageProps {
  horoscope: HoroscopeResponse
  profile: JathagamProfile
  language: 'ta' | 'en'
}

const TAMIL_YEARS = [
  'பிரபவ', 'விபவ', 'சுக்ல', 'பிரமோதூத', 'பிரசோத்பத்தி', 'ஆங்கீரச', 'ஸ்ரீமுக', 'பவ', 'யுவ', 'தாது',
  'ஈஸ்வர', 'வெகுதானிய', 'பிரமாதி', 'விக்கிரம', 'விஷு', 'சித்திரபானு', 'சுபானு', 'தாரண', 'பார்த்திப', 'வியய',
  'சர்வசித்து', 'சர்வதாரி', 'விரோதி', 'விக்ருதி', 'கர', 'நந்தன', 'விஜய', 'ஜய', 'மன்மத', 'துன்முகi',
  'ஹேவிளம்பி', 'விளம்பி', 'விகாரி', 'சார்வரி', 'பிலவ', 'சுபகிருது', 'சோபகிருது', 'குரோதி', 'விசுவாசு', 'பராபவ',
  'பிலவங்க', 'கீலக', 'சௌமிய', 'சாதாரண', 'விரோதிகிருது', 'பரிதாபி', 'பிரமாதீச', 'ஆனந்த', 'ராட்சஸ', 'நள',
  'பிங்கள', 'காளயுக்தி', 'சித்தார்த்தி', 'ரௌத்திரி', 'துன்மதி', 'துந்துபி', 'ருத்ரோத்காரி', 'ரக்தாட்சி', 'குரோதன', 'அட்சய'
]

const TAMIL_YEARS_EN = [
  'Prabhava', 'Vibhava', 'Sukla', 'Pramodhootha', 'Prachopathi', 'Aangirasa', 'Srimukha', 'Bhava', 'Yuva', 'Dhadhu',
  'Eeswara', 'Vehudhanya', 'Pramadhi', 'Vikrama', 'Vishu', 'Chithrabhanu', 'Subhanu', 'Tharana', 'Parthiba', 'Viyaya',
  'Sarvajithu', 'Sarvadhari', 'Virodhi', 'Vikruthi', 'Kara', 'Nandhana', 'Vijaya', 'Jaya', 'Manmadha', 'Dhunmukhi',
  'Hevilambi', 'Vilambi', 'Vikari', 'Sarvari', 'Plava', 'Subhakridhu', 'Sobhakridhu', 'Krodhi', 'Visvavasu', 'Parabhava',
  'Plavanga', 'Keelaka', 'Saumya', 'Sadharana', 'Virodhikridhu', 'Paridhabi', 'Pramadheesa', 'Anandha', 'Rakshasa', 'Nala',
  'Pingala', 'Kalayukthi', 'Siddharthi', 'Raudhri', 'Dhunmathi', 'Dhundhubhi', 'Rudharodhgari', 'Raktakshi', 'Krodhana', 'Akshaya'
]

export function PanchangamChronologyPage({ horoscope, profile, language }: PanchangamChronologyPageProps) {
  const isTa = language === 'ta'

  // Parse Year
  const birthDate = new Date(profile.dob)
  const englishYear = birthDate.getFullYear()

  // Calculate Tamil Year
  const tamilYearIndex = (englishYear - 1987 + 60) % 60
  const tamilYear = isTa ? TAMIL_YEARS[tamilYearIndex] : TAMIL_YEARS_EN[tamilYearIndex]

  // Calculate Ayanam (Based on Sun's absolute longitude)
  const sunPlanet = horoscope.planets.find(p => p.planet === 'Sun')
  const signDegrees: Record<string, number> = {
    'Mesha': 0, 'Vrishabha': 30, 'Rishabha': 30, 'Mithuna': 60, 'Kataka': 90,
    'Simha': 120, 'Kanya': 150, 'Thula': 180, 'Vrischika': 210,
    'Dhanus': 240, 'Makara': 270, 'Kumbha': 300, 'Meena': 330
  }
  const sunLongitude = sunPlanet ? (signDegrees[sunPlanet.sign] + sunPlanet.sign_degree) : 0
  const isUttarayana = sunLongitude >= 270 || sunLongitude < 90
  const ayanam = isTa 
    ? (isUttarayana ? 'உத்தராயணம்' : 'தக்ஷிணாயணம்') 
    : (isUttarayana ? 'Uttarayana' : 'Dakshinayana')

  // Calculate Ritu (Vedic Season)
  const month = birthDate.getMonth() // 0-indexed
  let ritu = isTa ? 'வசந்த ரிது' : 'Vasanta Ritu'
  if (month === 4 || month === 5) ritu = isTa ? 'கிரீஷ்ம ரிது' : 'Grishma Ritu'
  else if (month === 6 || month === 7) ritu = isTa ? 'வர்ஷ ரிது' : 'Varsha Ritu'
  else if (month === 8 || month === 9) ritu = isTa ? 'சரத் ரிது' : 'Sharad Ritu'
  else if (month === 10 || month === 11) ritu = isTa ? 'ஹேமந்த ரிது' : 'Hemanta Ritu'
  else if (month === 0 || month === 1) ritu = isTa ? 'சிசிர ரிது' : 'Shishira Ritu'

  // Panchangam Details
  const formatEndingNazhigai = (name: string | undefined, naz: number | undefined, vin: number | undefined) => {
    if (!name) return '—'
    if (naz === undefined || vin === undefined) return name
    return isTa 
      ? `${name} (நாழிகை ${naz}.${vin} வரை)` 
      : `${name} (ends ${naz}.${vin} Naz)`
  }

  const tithiVal = isTa ? horoscope.panchangam?.tithi?.name_ta : horoscope.panchangam?.tithi?.name
  const tithiDisplay = formatEndingNazhigai(
    tithiVal,
    horoscope.panchangam?.tithi?.ending_nazhigai,
    horoscope.panchangam?.tithi?.ending_vinadi
  )

  const nakVal = isTa ? horoscope.panchangam?.nakshatra?.name_ta : horoscope.panchangam?.nakshatra?.name
  const nakDisplay = formatEndingNazhigai(
    nakVal,
    horoscope.panchangam?.nakshatra?.ending_nazhigai,
    horoscope.panchangam?.nakshatra?.ending_vinadi
  )

  const yogaVal = isTa ? horoscope.panchangam?.yoga?.name_ta : horoscope.panchangam?.yoga?.name
  const karanaVal = isTa ? horoscope.panchangam?.karana?.name_ta : horoscope.panchangam?.karana?.name

  const calEras = horoscope.calendar_eras || {
    kaliyuga: englishYear + 3101,
    salivahana: englishYear - 78,
    kollam: englishYear - 825,
    hijri: Math.round((englishYear - 622) * (365.25 / 354.36))
  }

  return (
    <>
      {/* PAGE 8: Traditional Calendar Eras */}
      <div className="page-print-container jathagam-2-wrapper flex-1 flex flex-col justify-between">
        <div className="inner-border flex flex-col justify-between py-8 px-6">
          
          <div className="text-center text-[var(--sripathi-static-framework)] font-bold text-sm mb-4">
            ஒம் ஸ்ரீ நவக்கிரஹ சகாயம்
          </div>

          <div className="text-center text-[var(--sripathi-static-framework)] font-extrabold text-lg tracking-wider mb-4">
            {isTa ? 'தினசுத்திப் படலம் (பாரம்பரிய கால கணிதம்)' : 'Panchangam Chronology (Calendar Eras)'}
          </div>

          <div className="flex-1 flex flex-col justify-center my-auto gap-6">
            <h4 className="text-[var(--sripathi-static-framework)] font-extrabold text-center text-sm tracking-widest border-b border-[var(--sripathi-dynamic-data)]/25 pb-2">
              {isTa ? 'ஹிந்து கால கணக்கீடு' : 'Hindu Time Calculations'}
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border border-[var(--sripathi-dynamic-data)]/20 p-3 rounded-lg bg-[#fffdf9] flex flex-col gap-1.5">
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'சாலிவாகன சகாப்தம்' : 'Salivahana Era'}</span>
                <span className="text-[var(--sripathi-dynamic-data)] font-bold text-base">{calEras.salivahana}</span>
              </div>
              <div className="border border-[var(--sripathi-dynamic-data)]/20 p-3 rounded-lg bg-[#fffdf9] flex flex-col gap-1.5">
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'கலியுகாதி வருடம்' : 'Kaliyuga Era'}</span>
                <span className="text-[var(--sripathi-dynamic-data)] font-bold text-base">{calEras.kaliyuga}</span>
              </div>
              <div className="border border-[var(--sripathi-dynamic-data)]/20 p-3 rounded-lg bg-[#fffdf9] flex flex-col gap-1.5">
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'ஹிஜிரி வருடம்' : 'Hijri Era'}</span>
                <span className="text-[var(--sripathi-dynamic-data)] font-bold text-base">{calEras.hijri}</span>
              </div>
              <div className="border border-[var(--sripathi-dynamic-data)]/20 p-3 rounded-lg bg-[#fffdf9] flex flex-col gap-1.5">
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'கொல்லம் வருடம்' : 'Kollam Era'}</span>
                <span className="text-[var(--sripathi-dynamic-data)] font-bold text-base">{calEras.kollam}</span>
              </div>
            </div>

            <div className="border border-[var(--sripathi-dynamic-data)]/20 p-4 rounded-lg bg-[#fffdf6] space-y-3 text-xs text-[var(--sripathi-narrative-text)]">
              <div>
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'ஆங்கில வருடம்' : 'English Year'}: </span>
                <span className="text-[var(--sripathi-dynamic-data)] font-bold">{englishYear}</span>
              </div>
              <div>
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'தமிழ் வருடம்' : 'Tamil Year'}: </span>
                <span className="text-[var(--sripathi-dynamic-data)] font-bold">{tamilYear}</span>
              </div>
              <div>
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'அயனங்கள்' : 'Ayanam'}: </span>
                <span className="text-[var(--sripathi-dynamic-data)] font-bold">{ayanam}</span>
              </div>
              <div>
                <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'ரிதுக்கள் (பருவங்கள்)' : 'Ritu (Season)'}: </span>
                <span className="text-[var(--sripathi-dynamic-data)] font-bold">{ritu}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-[var(--sripathi-static-framework)] font-bold tracking-wider opacity-60">
            பக்கம் 8
          </div>
        </div>
      </div>

      {/* slide */}

      {/* PAGE 9: Panchangam Components */}
      <div className="page-print-container jathagam-2-wrapper flex-1 flex flex-col justify-between">
        <div className="inner-border flex flex-col justify-between py-8 px-6">
          
          <div className="text-center text-[var(--sripathi-static-framework)] font-bold text-sm mb-4">
            ஒம் ஸ்ரீ நவக்கிரஹ சகாயம்
          </div>

          <div className="text-center text-[var(--sripathi-static-framework)] font-extrabold text-lg tracking-wider mb-4">
            {isTa ? 'தினசுத்திப் படலம் (பஞ்சாங்கம்)' : 'Panchangam Chronology (Panchangam Details)'}
          </div>

          <div className="flex-1 flex flex-col justify-center my-auto gap-4 text-xs text-[var(--sripathi-narrative-text)]">
            <div className="flex justify-between border-b border-dotted border-gray-400 pb-2">
              <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'திதி' : 'Tithi'} :</span>
              <span className="text-[var(--sripathi-dynamic-data)] font-bold text-right">{tithiDisplay}</span>
            </div>

            <div className="flex justify-between border-b border-dotted border-gray-400 pb-2">
              <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'நட்சத்திரம்' : 'Star'} :</span>
              <span className="text-[var(--sripathi-dynamic-data)] font-bold text-right">{nakDisplay}</span>
            </div>

            <div className="flex justify-between border-b border-dotted border-gray-400 pb-2">
              <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'யோகம்' : 'Yoga'} :</span>
              <span className="text-[var(--sripathi-dynamic-data)] font-bold text-right">{yogaVal || '—'}</span>
            </div>

            <div className="flex justify-between border-b border-dotted border-gray-400 pb-2">
              <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'கரணம்' : 'Karana'} :</span>
              <span className="text-[var(--sripathi-dynamic-data)] font-bold text-right">{karanaVal || '—'}</span>
            </div>

            <div className="flex justify-between border-b border-dotted border-gray-400 pb-2">
              <span className="text-[var(--sripathi-static-framework)] font-bold">{isTa ? 'தியாஜ்யம் (வர்ஜியம்)' : 'Thyajyam (Varjyam)'} :</span>
              <span className="text-[var(--sripathi-dynamic-data)] font-bold text-right">
                {isTa ? 'சுப நேரம் / வர்ஜியமில்லை' : 'Auspicious time / No Varjyam'}
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-[var(--sripathi-static-framework)] font-bold tracking-wider opacity-60">
            பக்கம் 9
          </div>
        </div>
      </div>
    </>
  )
}
