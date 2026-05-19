/**
 * City seed script — imports GeoNames IN.txt into Supabase cities table
 *
 * Usage:
 *   1. Download: https://download.geonames.org/export/dump/IN.zip
 *   2. Extract IN.txt to /scripts/IN.txt
 *   3. Copy .env.example → .env and fill SUPABASE_URL + SUPABASE_SERVICE_KEY
 *   4. npx ts-node --esm scripts/seed-cities.ts
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import readline from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!  // service role key — bypasses RLS
)

const GEONAMES_FILE = path.join(__dirname, 'IN.txt')
const BATCH_SIZE    = 500
const MIN_POPULATION = 5_000  // filter out tiny villages

interface CityRow {
  name:       string
  ascii_name: string
  state:      string | null
  lat:        number
  lng:        number
  utc_offset: number
  population: number
}

async function seed() {
  if (!fs.existsSync(GEONAMES_FILE)) {
    console.error('ERROR: scripts/IN.txt not found.')
    console.error('Download from: https://download.geonames.org/export/dump/IN.zip')
    process.exit(1)
  }

  const rl = readline.createInterface({ input: fs.createReadStream(GEONAMES_FILE) })
  let batch: CityRow[] = []
  let total = 0

  for await (const line of rl) {
    const cols = line.split('\t')
    if (cols.length < 15) continue

    const featureClass = cols[6]   // 'P' = populated place
    const population   = parseInt(cols[14]) || 0

    if (featureClass !== 'P' || population < MIN_POPULATION) continue

    batch.push({
      name:       cols[1],          // primary name (may include Hindi/local script)
      ascii_name: cols[2],          // ASCII-safe English name
      state:      cols[10] || null, // admin1 code
      lat:        parseFloat(cols[4]),
      lng:        parseFloat(cols[5]),
      utc_offset: 5.50,             // all India = IST UTC+5:30
      population,
    })

    if (batch.length >= BATCH_SIZE) {
      const { error } = await supabase.from('cities').upsert(batch, { onConflict: 'id' })
      if (error) console.error('Batch error:', error.message)
      total += batch.length
      console.log(`Inserted ${total} cities...`)
      batch = []
    }
  }

  // Final batch
  if (batch.length > 0) {
    await supabase.from('cities').upsert(batch, { onConflict: 'id' })
    total += batch.length
  }

  console.log(`\n✓ Done. ${total} cities seeded.`)
}

seed().catch(console.error)
