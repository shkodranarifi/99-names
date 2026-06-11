# 99 Names — Asma-ul-Husna

A friendly, Duolingo-style web app for learning the 99 Names of Allah in a
**20-day challenge**: 5 names a day (4 on the last day).

Built with **React + Vite**.

## Features

- 🗓 **20-day path** — one lesson unlocks per calendar day; finish a day to unlock the next
- 🃏 **Flashcards** — Arabic script, transliteration, English **and** Albanian meaning, with audio pronunciation (text-to-speech)
- 📝 **Quiz after every lesson** — multiple choice + a match-the-pairs round, with sounds, haptics, and instant green/red feedback
- 🧠 **Smart review** — per-name strength tracking; your weakest older names are mixed into every daily quiz, plus a Practice mode any time
- 🎓 **Final exam & certificate** — after day 20, a 20-question exam over all 99 names; pass it to earn a shareable certificate with your name
- 🎖 **Badges** — milestones at days 5/10/15/20, 7-day streak, exam passed
- 🔥 **Streaks, XP and perfect bonuses** to keep you motivated
- 🇬🇧/🇦🇱 **Full bilingual UI** — switch between English and Shqip any time
- 📖 **Names tab** — browse everything you've unlocked so far
- 📲 **Installable PWA** — add it to your phone's home screen; works fully offline (self-hosted fonts, service worker)
- 💾 Progress is saved in your browser (localStorage) — no account, no server

## Develop

```sh
npm install
npm run dev      # dev server with hot reload
```

## Build & deploy

```sh
npm run build    # outputs static files to dist/
npm run preview  # serve the production build locally
```

Upload the contents of `dist/` to any static host: GitHub Pages, Netlify,
Vercel, Cloudflare Pages… (`base: "./"` is set, so it works from any subpath.)

## Project structure

| Path | Purpose |
|---|---|
| `src/data.js` | The 99 names: Arabic, transliteration, English, Albanian |
| `src/i18n.js` | All UI strings in English and Albanian |
| `src/App.jsx` | Progress state, day-unlock rules, routing |
| `src/components/` | Welcome, path, flashcards, quiz, names list, header, tab bar |
| `src/lib/` | Quiz generation, dates, confetti, speech |
| `src/styles.css` | Design system (Nunito UI font, Amiri Arabic font) |
