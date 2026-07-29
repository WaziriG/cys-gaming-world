# Luffy's Survival Quest — Arcade Integration Guide

**Date:** July 11, 2026
**Site:** https://cys-gaming-world.vercel.app
**Game URL:** https://cys-gaming-world.vercel.app/games/luffys-quest

---

## What This Is

Luffy's Survival Quest is now the fifth game in Cys Gaming World. It is a One Piece–themed
top-down survival game: fight through 4 islands (The Town, Sky Island, Volcano Island,
Monkey Island), master 6 powers (Lightning, Heal, Teleport, Block, Conqueror's Haki,
Gear 5 Nika Mode), and defeat every boss. Touch-friendly with a virtual joystick, so it
plays on phones and tablets as well as desktop.

## What Was Added

| File | Purpose |
|------|---------|
| `public/games/luffys-quest.html` | The complete self-contained game (copied from `*new*/luffys-quest/index.html`) |
| `app/games/luffys-quest/page.tsx` | Wrapper page that frames the game with the "◄ ARCADE" top bar |
| `app/page.tsx` | New game card in the lobby grid + stats bar updated to 5 games / 8 worlds |

## How the Arcade Pattern Works

Every game in Cys Gaming World follows the same three-part pattern:

1. **The game itself** is one standalone HTML file in `public/games/<slug>.html`.
   It needs no build step — Next.js serves it as a static asset.
2. **A wrapper page** at `app/games/<slug>/page.tsx` puts the game in a full-screen
   iframe with a top bar linking back to the arcade lobby.
3. **A card entry** in the `GAMES` array at the top of `app/page.tsx` makes it appear
   in the lobby grid (title, tagline, description, emoji icon, accent color).

## How to Update the Game

1. Edit or replace `public/games/luffys-quest.html` (the master copy also lives at
   `*new*/luffys-quest/index.html` — keep them in sync or treat `public/` as canonical).
2. Commit and push to `main` — Vercel auto-deploys production in about 20 seconds.

```bash
cd ~/Documents/GitHub/cys-gaming-world
git add public/games/luffys-quest.html
git commit -m "Update Luffy's Quest"
git push origin main
```

## Verification Performed

- `next build` passed with `/games/luffys-quest` in the route list
- Local production server: lobby card, wrapper page, and game HTML all returned 200
- Live site checked after deploy: card renders and game loads at the production URL
