import React from 'react'
import type { JathagamProfile, BirthPanchangamData, LuckyDetails, NakshatraMeta, PathaRow } from '@/types/jathagam'
import type { HoroscopeResponse } from '@/types/astro'
import { CoverPage1 } from './pages/CoverPage1'
import { CoverPage2 } from './pages/CoverPage2'
import { PersonalDetailsPage } from './pages/PersonalDetailsPage'
import { RasiChartPage } from './pages/RasiChartPage'
import { AmsamChartPage } from './pages/AmsamChartPage'
import { PathaSaramPage } from './pages/PathaSaramPage'
import { PlanetaryPositionsPage } from './pages/PlanetaryPositionsPage'
import { DinasuthiPage } from './pages/DinasuthiPage'
import { MuhurthamPage } from './pages/MuhurthamPage'
import { LagnapalanPage } from './pages/LagnapalanPage'
import { NakshatrapalanPage } from './pages/NakshatrapalanPage'
import { DashaPeriodsPage } from './pages/DashaPeriodsPage'
import { VastuPage } from './pages/VastuPage'
import { UdumakaPage } from './pages/UdumakaPage'
import { KurippuPage } from './pages/KurippuPage'
import { PadupakshiPage } from './pages/PadupakshiPage'
import { GanaPalanPage } from './pages/GanaPalanPage'
import { NadiPalanPage } from './pages/NadiPalanPage'
import { RajjuPalanPage } from './pages/RajjuPalanPage'
import { EndPage } from './pages/EndPage'
import './jathagam2.css'

interface JathagamReport2Props {
  data: {
    profile: JathagamProfile
    horoscope: HoroscopeResponse
    dailyPanchangam: BirthPanchangamData
    luckyDetails: LuckyDetails
    nakshatraMeta: NakshatraMeta
    astrologer: any
    lagnapalanText: string
    nakshatrapalanText: string
    pathaSaram: PathaRow[]
  }
}

export function JathagamReport2({ data }: JathagamReport2Props) {
  return (
    <>
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          #jathagam-print-root {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .jathagam-page {
            border: 2px solid #1a5c2a !important;
            margin: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
          }
        }
      `}</style>

      <div id="jathagam-print-root" className="jathagam-2-wrapper w-full print:block print:w-full print:p-0 print:m-0 flex flex-col gap-6">
        <CoverPage1 />
        <CoverPage2 />
        <PersonalDetailsPage profile={data.profile} astrologer={data.astrologer} />
        <RasiChartPage profile={data.profile} horoscope={data.horoscope} />
        <AmsamChartPage profile={data.profile} horoscope={data.horoscope} />
        <PathaSaramPage pathaSaram={data.pathaSaram} />
        <PlanetaryPositionsPage horoscope={data.horoscope} />
        <DinasuthiPage profile={data.profile} horoscope={data.horoscope} />
        <MuhurthamPage profile={data.profile} horoscope={data.horoscope} />
        <LagnapalanPage horoscope={data.horoscope} lagnapalanText={data.lagnapalanText} />
        <NakshatrapalanPage horoscope={data.horoscope} nakshatrapalanText={data.nakshatrapalanText} />
        <DashaPeriodsPage horoscope={data.horoscope} />
        <GanaPalanPage horoscope={data.horoscope} />
        <NadiPalanPage horoscope={data.horoscope} />
        <RajjuPalanPage horoscope={data.horoscope} />
        <PadupakshiPage nakshatraMeta={data.nakshatraMeta} horoscope={data.horoscope} />
        <VastuPage profile={data.profile} horoscope={data.horoscope} luckyDetails={data.luckyDetails} />
        <UdumakaPage horoscope={data.horoscope} />
        <KurippuPage nakshatraMeta={data.nakshatraMeta} horoscope={data.horoscope} />
        <EndPage />
      </div>
    </>
  )
}
