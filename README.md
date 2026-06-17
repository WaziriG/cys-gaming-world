# Aquatic Survival

A single-file, top-down survival arena game built with vanilla JavaScript and HTML5 canvas. No build step, no dependencies — the entire game lives in one `.html` file.

Play as **Aqua**, a tuxedo water turtle, surviving waves of enemies and battling a long gauntlet of animal bosses across two worlds.

## Play it

Just open `aqua-survivor.html` in any modern browser — desktop or mobile. That's it.

To host it for free, drop the file into any static host (GitHub Pages, Vercel, Netlify, etc.).

### GitHub Pages (quickest free hosting)
1. Push this repo to GitHub.
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Pick your branch (e.g. `main`) and the `/root` folder, then **Save**.
4. After a minute your game is live at `https://<your-username>.github.io/<repo-name>/aqua-survivor.html`
   (rename the file to `index.html` if you want it at the root URL).

## Controls

- **Move:** WASD / arrow keys (or on-screen joystick on touch devices)
- **Aim & shoot:** mouse / tap
- **Shield:** hold Shift / right-click / shield button
- Plus a **Sandbox** mode (button on the start screen) to summon any boss, trigger weather, and grant abilities for testing.

## Features

- **Two worlds:** an underwater gauntlet ending in the **Leviathan**, then a surface **land world** unlocked by beating it.
- **Dozens of bosses**, each with unique mechanics (charges, shockwaves, grabs, summons, enrage, dive-bombs, venom, and more).
- **A three-at-once boss fight** (the Pride: leopard, tiger, lion).
- **Special weather:** lightning storms (catch fire) and droughts (water-breathers suffocate).
- **Upgrades, hats, and unlockable playable skins** for every boss.
- **Persistent progress** via the browser's localStorage (per device).

## Tech

- Vanilla JS + HTML5 `<canvas>`, pixel-art sprites generated in code.
- Self-contained: one file, no frameworks, no build tooling.

## License

Add your license of choice (e.g. MIT) here.
