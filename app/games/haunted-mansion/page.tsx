'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface GameResult {
  score: number
  kills: number
  level: number
  reason: 'win' | 'dead'
}

interface LeaderboardEntry {
  id: number
  player_name: string
  score: number
  kills: number
  level: number
  created_at: string
}

export default function HauntedMansionPage() {
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loadingLB, setLoadingLB] = useState(false)
  const [submitName, setSubmitName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const fetchLeaderboard = useCallback(async () => {
    setLoadingLB(true)
    try {
      const res = await fetch('/api/leaderboard?game=haunted-mansion&limit=15')
      const data = await res.json()
      setLeaderboard(data.entries ?? [])
    } catch {
      setLeaderboard([])
    } finally {
      setLoadingLB(false)
    }
  }, [])

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'haunted-game-over') {
        const { score, kills, level, reason } = e.data as GameResult & { type: string }
        setGameResult({ score, kills, level, reason })
        setSubmitted(false)
        setSubmitName('')
        setSubmitError('')
        setShowScoreModal(true)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gameResult || !submitName.trim()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: 'haunted-mansion',
          playerName: submitName.trim(),
          score: gameResult.score,
          kills: gameResult.kills,
          level: gameResult.level,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to submit')
      }
      setSubmitted(true)
      await fetchLeaderboard()
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Could not save score')
    } finally {
      setSubmitting(false)
    }
  }

  function openLeaderboard() {
    setShowLeaderboard(true)
    fetchLeaderboard()
  }

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#080e14' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ background: 'rgba(8,14,20,0.95)', borderBottom: '1px solid rgba(255,209,102,0.25)' }}
      >
        <Link
          href="/"
          className="font-pixel flex items-center gap-2 no-underline"
          style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '1px' }}
        >
          ◄ ARCADE
        </Link>

        <div className="font-pixel text-center" style={{ fontSize: 'clamp(8px,1.5vw,11px)', color: 'var(--gold)', letterSpacing: '2px' }}>
          HAUNTED MANSION
        </div>

        <div className="flex gap-3">
          <button
            onClick={openLeaderboard}
            className="font-pixel rounded px-3 py-1 cursor-pointer"
            style={{
              fontSize: '8px',
              color: 'var(--gold)',
              background: 'rgba(255,209,102,0.1)',
              border: '1px solid rgba(255,209,102,0.4)',
              letterSpacing: '1px',
            }}
          >
            🏆 SCORES
          </button>
          {gameResult && !showScoreModal && (
            <button
              onClick={() => setShowScoreModal(true)}
              className="font-pixel rounded px-3 py-1 cursor-pointer"
              style={{
                fontSize: '8px',
                color: '#080e14',
                background: 'var(--gold)',
                border: '1px solid #ffe099',
                letterSpacing: '1px',
              }}
            >
              SUBMIT SCORE
            </button>
          )}
        </div>
      </div>

      {/* Game iframe */}
      <div className="flex-1 relative">
        <iframe
          src="/games/haunted-mansion.html"
          title="Haunted Mansion"
          className="absolute inset-0 w-full h-full border-0"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      {/* Score submission modal */}
      {showScoreModal && gameResult && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ background: 'rgba(4,10,18,0.88)', backdropFilter: 'blur(4px)', zIndex: 100 }}
          onClick={e => { if (e.target === e.currentTarget) setShowScoreModal(false) }}
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm"
            style={{ background: '#0d1b2a', border: '2px solid rgba(255,209,102,0.5)', boxShadow: '0 0 40px rgba(255,209,102,0.2)' }}
          >
            {!submitted ? (
              <>
                <div className="font-pixel text-center mb-1" style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px' }}>
                  {gameResult.reason === 'win' ? 'YOU ESCAPED' : 'YOU DIED'}
                </div>
                <div className="font-vt text-center mb-4" style={{ fontSize: '20px', color: 'var(--foam)', opacity: 0.7 }}>
                  Submit your run to the leaderboard
                </div>

                {/* Stats */}
                <div
                  className="rounded-lg p-4 mb-5 grid grid-cols-3 gap-3 text-center"
                  style={{ background: 'rgba(8,14,20,0.8)', border: '1px solid rgba(255,209,102,0.2)' }}
                >
                  <StatCell label="SCORE" value={String(gameResult.score)} />
                  <StatCell label="SPIDERS" value={String(gameResult.kills)} />
                  <StatCell label="ROOM" value={String(gameResult.level)} />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="ENTER YOUR NAME"
                    value={submitName}
                    onChange={e => setSubmitName(e.target.value)}
                    maxLength={20}
                    autoFocus
                    className="w-full rounded px-4 py-3 font-pixel outline-none"
                    style={{
                      fontSize: '10px',
                      background: '#080e14',
                      border: '2px solid rgba(255,209,102,0.4)',
                      color: 'var(--gold)',
                      letterSpacing: '2px',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,209,102,0.4)' }}
                  />
                  {submitError && (
                    <div className="font-vt text-center" style={{ color: 'var(--coral)', fontSize: '16px' }}>
                      {submitError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting || !submitName.trim()}
                    className="font-pixel rounded py-3 cursor-pointer disabled:opacity-40"
                    style={{
                      fontSize: '10px',
                      color: '#080e14',
                      background: 'linear-gradient(180deg, #ffe099, var(--gold))',
                      border: '2px solid var(--foam)',
                      letterSpacing: '2px',
                    }}
                  >
                    {submitting ? 'SAVING...' : 'SUBMIT →'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowScoreModal(false)}
                    className="font-pixel text-center cursor-pointer"
                    style={{ fontSize: '8px', color: 'var(--muted)', background: 'none', border: 'none', letterSpacing: '1px' }}
                  >
                    SKIP
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
                <div className="font-pixel mb-2" style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px' }}>
                  SCORE SAVED!
                </div>
                <div className="font-vt mb-4" style={{ fontSize: '20px', color: 'var(--foam)', opacity: 0.8 }}>
                  {submitName.toUpperCase()} — {gameResult.score}
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setShowScoreModal(false); setShowLeaderboard(true) }}
                    className="font-pixel rounded px-4 py-2 cursor-pointer"
                    style={{ fontSize: '8px', color: 'var(--gold)', background: 'rgba(255,209,102,0.15)', border: '1px solid rgba(255,209,102,0.5)' }}
                  >
                    VIEW SCORES
                  </button>
                  <button
                    onClick={() => setShowScoreModal(false)}
                    className="font-pixel rounded px-4 py-2 cursor-pointer"
                    style={{ fontSize: '8px', color: 'var(--gold)', background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.4)' }}
                  >
                    KEEP PLAYING
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard modal */}
      {showLeaderboard && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ background: 'rgba(4,10,18,0.9)', backdropFilter: 'blur(4px)', zIndex: 100 }}
          onClick={e => { if (e.target === e.currentTarget) setShowLeaderboard(false) }}
        >
          <div
            className="rounded-xl w-full max-w-lg overflow-hidden"
            style={{ background: '#0d1b2a', border: '2px solid rgba(255,209,102,0.5)', boxShadow: '0 0 40px rgba(255,209,102,0.15)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ background: 'rgba(8,14,20,0.8)', borderBottom: '1px solid rgba(255,209,102,0.2)' }}
            >
              <div className="font-pixel" style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px' }}>
                🏆 TOP SCORES
              </div>
              <div className="font-vt" style={{ fontSize: '16px', color: 'var(--muted)' }}>
                HAUNTED MANSION
              </div>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="font-pixel cursor-pointer"
                style={{ fontSize: '10px', color: 'var(--muted)', background: 'none', border: 'none' }}
              >
                ✕
              </button>
            </div>

            {/* Table */}
            <div className="overflow-y-auto" style={{ maxHeight: '420px' }}>
              {loadingLB ? (
                <div className="font-pixel text-center py-12" style={{ fontSize: '9px', color: 'var(--muted)' }}>
                  LOADING...
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <div className="font-pixel mb-2" style={{ fontSize: '9px', color: 'var(--muted)' }}>NO SCORES YET</div>
                  <div className="font-vt" style={{ fontSize: '18px', color: 'var(--gold)', opacity: 0.7 }}>Be the first to submit!</div>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,209,102,0.2)' }}>
                      {['#', 'PLAYER', 'SCORE', 'SPIDERS', 'ROOM'].map(h => (
                        <th key={h} className="font-pixel px-4 py-2 text-left"
                          style={{ fontSize: '7px', color: 'rgba(255,209,102,0.6)', letterSpacing: '1px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, i) => (
                      <tr
                        key={entry.id}
                        style={{
                          borderBottom: '1px solid rgba(255,209,102,0.08)',
                          background: i === 0 ? 'rgba(255,209,102,0.06)' : 'transparent',
                        }}
                      >
                        <td className="font-pixel px-4 py-3"
                          style={{ fontSize: '9px', color: i === 0 ? 'var(--gold)' : i === 1 ? '#aaa' : i === 2 ? '#cd7f32' : 'var(--muted)' }}>
                          {i === 0 ? '👑' : `${i + 1}`}
                        </td>
                        <td className="font-pixel px-4 py-3"
                          style={{ fontSize: '9px', color: 'var(--foam)', opacity: i === 0 ? 1 : 0.8 }}>
                          {entry.player_name.toUpperCase()}
                        </td>
                        <td className="font-pixel px-4 py-3"
                          style={{ fontSize: '9px', color: 'var(--gold)' }}>
                          {entry.score}
                        </td>
                        <td className="font-pixel px-4 py-3"
                          style={{ fontSize: '9px', color: 'var(--foam)', opacity: 0.7 }}>
                          {entry.kills}
                        </td>
                        <td className="font-pixel px-4 py-3"
                          style={{ fontSize: '9px', color: 'var(--foam)', opacity: 0.7 }}>
                          {entry.level}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(255,209,102,0.15)' }}
            >
              <div className="font-vt" style={{ fontSize: '14px', color: 'var(--muted)' }}>
                Sorted by score
              </div>
              <button
                onClick={fetchLeaderboard}
                className="font-pixel cursor-pointer"
                style={{ fontSize: '7px', color: 'var(--gold)', background: 'none', border: 'none' }}
              >
                ↻ REFRESH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-pixel" style={{ fontSize: '14px', color: 'var(--gold)' }}>{value}</div>
      <div className="font-pixel mt-1" style={{ fontSize: '7px', color: 'var(--muted)', letterSpacing: '1px' }}>{label}</div>
    </div>
  )
}
