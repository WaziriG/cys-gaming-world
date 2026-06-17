import { NextRequest, NextResponse } from 'next/server'
import { getTopScores, insertScore } from '@/lib/db'

const VALID_GAMES = new Set(['aqua-survivor'])
const MAX_SCORE_SECONDS = 7200 // 2 hours — generous cap

export async function GET(req: NextRequest) {
  const game = req.nextUrl.searchParams.get('game') ?? ''
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '15', 10), 50)

  if (!VALID_GAMES.has(game)) {
    return NextResponse.json({ error: 'Unknown game' }, { status: 400 })
  }

  try {
    const entries = await getTopScores(game, limit)
    return NextResponse.json({ entries })
  } catch {
    return NextResponse.json({ entries: [], error: 'Database unavailable' }, { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { game, playerName, score, kills, level } = body as Record<string, unknown>

  if (typeof game !== 'string' || !VALID_GAMES.has(game)) {
    return NextResponse.json({ error: 'Invalid game' }, { status: 400 })
  }
  if (typeof playerName !== 'string' || playerName.trim().length < 1 || playerName.trim().length > 20) {
    return NextResponse.json({ error: 'Name must be 1–20 characters' }, { status: 400 })
  }
  if (typeof score !== 'number' || score < 0 || score > MAX_SCORE_SECONDS || !Number.isInteger(score)) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
  }
  if (typeof kills !== 'number' || kills < 0 || kills > 9999 || !Number.isInteger(kills)) {
    return NextResponse.json({ error: 'Invalid kills' }, { status: 400 })
  }
  if (typeof level !== 'number' || level < 1 || level > 200 || !Number.isInteger(level)) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  }

  const cleanName = playerName.trim().replace(/[^\w\s\-\.]/g, '').slice(0, 20) || 'ANON'

  try {
    const entry = await insertScore({
      gameSlug: game,
      playerName: cleanName,
      score,
      kills,
      level,
    })
    return NextResponse.json({ entry }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  }
}
