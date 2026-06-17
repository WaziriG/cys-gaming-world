import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set. Run: DATABASE_URL=<your_url> node scripts/migrate.mjs')
  process.exit(1)
}

const sql = neon(url)

await sql`
  CREATE TABLE IF NOT EXISTS leaderboard (
    id         SERIAL PRIMARY KEY,
    game_slug  VARCHAR(50)  NOT NULL,
    player_name VARCHAR(30) NOT NULL,
    score      INTEGER      NOT NULL,
    kills      INTEGER      NOT NULL DEFAULT 0,
    level      INTEGER      NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  )
`

await sql`
  CREATE INDEX IF NOT EXISTS leaderboard_game_score_idx
  ON leaderboard (game_slug, score DESC)
`

console.log('✓ Migration complete — leaderboard table ready.')
