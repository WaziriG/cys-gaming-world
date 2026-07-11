'use client'

import Link from 'next/link'

export default function LuffysQuestPage() {
  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#080e14' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ background: 'rgba(8,14,20,0.95)', borderBottom: '1px solid rgba(255,159,67,0.25)' }}
      >
        <Link
          href="/"
          className="font-pixel flex items-center gap-2 no-underline"
          style={{ fontSize: '9px', color: 'var(--aqua)', letterSpacing: '1px' }}
        >
          ◄ ARCADE
        </Link>

        <div className="font-pixel text-center" style={{ fontSize: 'clamp(8px,1.5vw,11px)', color: '#ff9f43', letterSpacing: '2px' }}>
          LUFFY&apos;S SURVIVAL QUEST
        </div>

        <div style={{ width: '70px' }} />
      </div>

      {/* Game iframe */}
      <div className="flex-1 relative">
        <iframe
          src="/games/luffys-quest.html"
          title="Luffy's Survival Quest"
          className="absolute inset-0 w-full h-full border-0"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
        />
      </div>
    </div>
  )
}
