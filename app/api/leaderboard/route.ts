import { NextRequest, NextResponse } from 'next/server'
import { getTopScores, insertScore } from '@/lib/db'

const GAME_LIMITS: Record<string, { maxScore: number; maxKills: number; maxLevel: number }> = {
  'aqua-survivor': { maxScore: 7200, maxKills: 9999, maxLevel: 200 }, // score = survival seconds, 2hr cap
  'elemental-trials': { maxScore: 500000, maxKills: 999, maxLevel: 200 }, // score = points, endless-loop runs
  'haunted-mansion': { maxScore: 20000, maxKills: 200, maxLevel: 4 }, // score = roomsCleared*1000 + kills*25 + secondsSurvived
}
const VALID_GAMES = new Set(Object.keys(GAME_LIMITS))

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
  const limits = GAME_LIMITS[game]
  if (typeof playerName !== 'string' || playerName.trim().length < 1 || playerName.trim().length > 20) {
    return NextResponse.json({ error: 'Name must be 1–20 characters' }, { status: 400 })
  }
  if (typeof score !== 'number' || score < 0 || score > limits.maxScore || !Number.isInteger(score)) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
  }
  if (typeof kills !== 'number' || kills < 0 || kills > limits.maxKills || !Number.isInteger(kills)) {
    return NextResponse.json({ error: 'Invalid kills' }, { status: 400 })
  }
  if (typeof level !== 'number' || level < 1 || level > limits.maxLevel || !Number.isInteger(level)) {
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
