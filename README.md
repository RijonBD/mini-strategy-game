<div align="center">

# 🪖 OUTPOST ZERO

### HOLD THE LINE. SURVIVE THE WAVES.

**A fast, mobile-friendly 2D survival shooter.**  
Enemies close in from every direction. Keep moving, line up your shots, and survive as long as you can.

[![PLAY NOW](https://img.shields.io/badge/▶_PLAY_NOW-OUTPOST_ZERO-2ea44f?style=for-the-badge)](https://rijonbd.github.io/mini-strategy-game/)
[![Join Discord](https://img.shields.io/badge/💬_JOIN_THE_COMMUNITY-Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/k9Ey2zg47T)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Phaser](https://img.shields.io/badge/Powered_by-Phaser_3-8b5cf6?style=flat-square)](https://phaser.io/)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222222?style=flat-square&logo=github)](https://pages.github.com/)

</div>

---

## 🎮 The mission

You are the last defender of **Outpost Zero**. Hostile units enter the battlefield from the edges of the map and try to take you down.

Your objective is simple: **stay alive, shoot back, and clear every wave.** Each new wave brings more enemies. Your health and ammunition are limited, so movement and timing matter.

## ⚔️ Gameplay at a glance

| HUD | What it means |
|---|---|
| ❤️ **Health** | Your remaining health. Enemy hits reduce it. |
| 🔫 **Ammo** | Rounds left in your magazine. A magazine holds 30 rounds. |
| 🌊 **Wave** | The current enemy wave. The next wave starts when the current one is cleared. |
| ☠️ **Kills** | Enemies you have eliminated. |

### How combat works

- **Move constantly:** enemies chase you when they are far away.
- **Auto-aim:** your character aims at the nearest active enemy.
- **Shoot:** your bullets travel toward that target and damage it on impact.
- **Enemy fire:** enemies stop to fire when you are within their firing range.
- **Reload:** when your magazine is empty, reloading starts automatically. On desktop, you can also press **R**.
- **Survive:** each enemy hit removes health. When health reaches zero, the outpost is lost.

## 📱 Controls

<div align="center">

| Mobile / Touch | Desktop |
|:---:|:---:|
| 🕹️ **Left joystick** — move | **W A S D** or **Arrow keys** — move |
| 🔴 **Hold FIRE** — shoot | **Hold SPACE** — shoot |
| Automatic reload at 0 ammo | **R** — reload |

</div>

**Mobile tip:** keep one thumb on the joystick and use the other to hold FIRE. The game is designed to fit a phone screen in portrait mode.

## 🗺️ Battlefield

```text
       HOSTILES APPROACH FROM ALL SIDES
   ┌─────────────────────────────────────┐
   │   ●                         ●       │
   │                                     │
   │              YOU                    │
   │              ◉  ───────►  ●         │
   │                                     │
   │   ●                         ●       │
   └─────────────────────────────────────┘
          MOVE  •  AIM  •  SURVIVE
```

## 🧩 Built with

- **TypeScript** — game logic and systems
- **Phaser 3** — 2D rendering, arcade physics, collisions and camera
- **Vite** — development server and production build
- **GitHub Pages** — serves the static game directly from this repository

No separate game server or paid hosting is needed. The browser runs the game; GitHub Pages serves its files.

## ▶️ Play

<div align="center">

### [🚀 LAUNCH OUTPOST ZERO](https://rijonbd.github.io/mini-strategy-game/)

*Free to play in your browser — desktop and mobile.*

</div>

## 💬 Join the community

<div align="center">

### Have feedback, ideas, or just want to talk games?

Join the Discord community to share your experience, report issues, suggest improvements, and follow project discussions.

[![Join the OUTPOST ZERO Discord](https://img.shields.io/badge/ JOIN_OUR_DISCORD-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/k9Ey2zg47T)

**[discord.gg/k9Ey2zg47T](https://discord.gg/k9Ey2zg47T)**

</div>

## 🛠️ Run locally

You need Node.js installed.

```bash
git clone https://github.com/RijonBD/mini-strategy-game.git
cd mini-strategy-game
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

The deployable static site is generated in `dist/`.

---

<div align="center">

**OUTPOST ZERO** · A small browser game built for quick survival sessions.

[Play the game](https://rijonbd.github.io/mini-strategy-game/) · [Join Discord](https://discord.gg/k9Ey2zg47T) · [View source code](https://github.com/RijonBD/mini-strategy-game)

</div>
