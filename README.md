# Nano Games

The arcade at **[nanogames.app](https://nanogames.app)** — original games designed and built by Cyrus.

A Next.js 16 lobby that hosts self-contained HTML5 games. Each game is a single `.html` file with no
dependencies and no build step of its own; the Next app wraps it in a full-screen iframe and, for the
games that report scores, feeds a shared global leaderboard.

## The games

| Game | Genre | Leaderboard |
|---|---|---|
| Aquatic Survival | Survival | Yes |
| Elemental Trials | Boss rush | Yes |
| Haunted Mansion | Survival horror | Yes |
| Luffy's Survival Quest | Survival | No |
| Adrian's Quadratic Quest | Math runner | No |
| Sprite Forge | Tool (pixel-art editor) | n/a |

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build` for a production build. The leaderboard routes need `DATABASE_URL` pointing at the
Neon Postgres instance; without it the games still play, only score submission fails.

## How a game is wired

Three pieces per game, all named off the same slug:

1. **`public/games/<slug>.html`** — the game itself. Self-contained: no external scripts, fonts, or
   images. This is the canonical copy.
2. **`app/games/<slug>/page.tsx`** — a thin client wrapper: top bar with a `◄ ARCADE` link back to
   the lobby, plus a sandboxed iframe pointing at the HTML above.
3. **An entry in the `GAMES` array in `app/page.tsx`** — the lobby card (title, tagline, description,
   icon, accent color, genre). Bump the `GAMES` stat in the same file when adding one.

To put a game on the global leaderboard, have it `postMessage` a score to the parent window and read
that message in the wrapper page — `haunted-mansion` is the smallest example of the full pattern.

## Layout

```
app/
  page.tsx              lobby (GAMES array lives here)
  layout.tsx            metadata, CRT overlays
  api/leaderboard/      score submit + read (Neon Postgres)
  games/<slug>/page.tsx  one wrapper per game
components/GameCard.tsx  lobby card
public/games/*.html      the games
docs/                    CEO guidebook + project guides
```

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Neon Postgres · deployed on Vercel.
Retro pixel/CRT aesthetic — scanlines, neon glow, vignette.

## Notes

Formerly **Cys Gaming World**; rebranded to Nano Games when the site moved to nanogames.app.
