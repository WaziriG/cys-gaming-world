import { GameCard, type Game } from '@/components/GameCard'

const GAMES: Game[] = [
  {
    slug: 'aqua-survivor',
    title: 'AQUATIC SURVIVAL',
    tagline: 'Survive the deep. Battle the bosses.',
    description:
      'Top-down arena survival. Play as Aqua the tuxedo turtle across two worlds — underwater gauntlet and the surface land. Dozens of bosses. How long can you last?',
    icon: '🐢',
    iconBg: '🌊',
    accentColor: '#3fd2e6',
    glowColor: 'rgba(63, 210, 230, 0.35)',
    borderColor: 'rgba(63, 210, 230, 0.5)',
    hoverBorder: 'rgba(125, 249, 255, 0.9)',
    href: '/games/aqua-survivor',
    live: true,
    genre: 'SURVIVAL',
    players: '1P',
  },
  {
    slug: 'elemental-trials',
    title: 'ELEMENTAL TRIALS',
    tagline: 'Seven guardians. One gauntlet.',
    description:
      'Battle 7 elemental guardians (and a hidden Void Universe of 5 more) across themed arenas. Collect and merge weapons, exploit boss weaknesses, and loop endlessly as bosses grow stronger.',
    icon: '⚔️',
    iconBg: '🔥',
    accentColor: '#ff6b6b',
    glowColor: 'rgba(255, 107, 107, 0.35)',
    borderColor: 'rgba(255, 107, 107, 0.5)',
    hoverBorder: 'rgba(255, 157, 157, 0.9)',
    href: '/games/elemental-trials',
    live: true,
    genre: 'BOSS RUSH',
    players: '1P',
  },
  {
    slug: 'coming-soon-3',
    title: '???',
    tagline: 'Loading level 3...',
    description: 'Third game in the Cys Gaming World universe. Coming soon.',
    icon: '🎮',
    iconBg: '🌌',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.2)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    hoverBorder: 'rgba(251, 146, 60, 0.6)',
    href: '#',
    live: false,
    genre: '???',
    players: '?P',
  },
]

export default function ArcadeLobby() {
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d2040 0%, #080e14 60%)' }}
    >
      {/* Header */}
      <header className="w-full flex flex-col items-center pt-12 pb-6 px-4">
        <div
          className="font-pixel flicker neon-aqua text-center leading-tight"
          style={{ fontSize: 'clamp(20px, 5vw, 42px)', letterSpacing: '3px' }}
        >
          CYS GAMING WORLD
        </div>
        <div
          className="font-vt neon-gold mt-2 tracking-widest"
          style={{ fontSize: 'clamp(16px, 3vw, 24px)' }}
        >
          CYRUS&apos;S ARCADE
          <span className="blink ml-1">█</span>
        </div>

        {/* Decorative divider */}
        <div className="mt-6 flex items-center gap-3 w-full max-w-2xl">
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(63,210,230,0.5))' }}
          />
          <span className="font-pixel text-xs" style={{ color: 'var(--aqua)', fontSize: '9px' }}>
            SELECT YOUR GAME
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to left, transparent, rgba(63,210,230,0.5))' }}
          />
        </div>
      </header>

      {/* Game Grid */}
      <main className="flex-1 w-full max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {GAMES.map(game => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>

        {/* Stats bar */}
        <div
          className="mt-12 border rounded-lg px-6 py-4 flex flex-wrap gap-6 justify-center"
          style={{ borderColor: 'rgba(63,210,230,0.2)', background: 'rgba(13,27,42,0.8)' }}
        >
          <Stat label="GAMES" value="2" />
          <Stat label="TOTAL BOSSES" value="40+" />
          <Stat label="WORLDS" value="4" />
          <Stat label="PLAYERS" value="1" />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center pb-8 px-4">
        <div
          className="font-pixel"
          style={{ fontSize: '8px', color: 'var(--muted)', letterSpacing: '2px' }}
        >
          DESIGNED &amp; BUILT BY CYRUS &nbsp;·&nbsp; CYS GAMING WORLD © 2025
        </div>
        <div className="font-vt mt-2" style={{ fontSize: '16px', color: 'rgba(63,210,230,0.3)' }}>
          INSERT COIN TO CONTINUE
        </div>
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-pixel neon-aqua" style={{ fontSize: '16px' }}>
        {value}
      </div>
      <div className="font-pixel mt-1" style={{ fontSize: '7px', color: 'var(--muted)', letterSpacing: '1px' }}>
        {label}
      </div>
    </div>
  )
}
