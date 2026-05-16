# Houseboat — A Journal

A 10-section journaling PWA built from your spec. Single-file React (Babel standalone, no build step) so it drops onto GitHub Pages as-is.

## Files

- **`index.html`** — the whole app. Tailwind + React via CDN. Just open it.
- **`config.js`** — paste your Google Apps Script web app URL here. Until you do, the app falls back to `localStorage` (nothing is lost).
- **`apps-script.gs`** — backend to paste into a Google Sheet's Apps Script editor.
- **`manifest.json`** — PWA manifest so it installs to home screen.
- **`icon-192.png` / `icon-512.png`** — replace with your own. (Not generated here.)

## Sections

1. **Go quiet** — 5/10/15/20 min timer with breath circle (in-hold-out-hold, 4s each). Sound options: end chime, metronome on each breath, or silent. Web Audio synthesis, no external sound files.
2. **Word vomit** — one thought per textarea, "new thought" button auto-focuses the next, "no new thoughts" saves the session.
3. **Freeloaders** — name, photo/sketch upload (resized to 400px / jpeg 0.78), description, what they say, then the 6 questions. Add many.
4. **Five-year check-in** — three modes: years-ago, specific-year, at-an-age. Calculates the year for you. 8 reflection questions.
5. **Wants now** — running list with optional prompt selection from the book's prompts.
6. **Five bosses** — pick a boss → see their description → answer the 6 questions → view past answers for that boss.
7. **Sock puppets** — write the mean self-talk, then expand any puppet to hear them, reframe them as a coping mechanism, and answer the 5 compassion questions per puppet.
8. **Bias check** — state a belief, answer the 6 questions, save. Collapsible past entries.
9. **A day at the zoo** — describe the moment, auto-reframe button rewrites first-person → "Humans … and I love that", edit freely, save.
10. **Be kind to kid you** — 5-step guided flow: photo → mean → read it to them → kinder version → read kinder version to them. Photo persists across sessions.

## Backend setup (Google Sheets)

1. Make a new Google Sheet, name it whatever ("Houseboat Journal" works).
2. Extensions → Apps Script. Delete the boilerplate, paste `apps-script.gs`, save.
3. Deploy → New deployment → ⚙ → Web app.
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Authorise the scopes when prompted.
5. Copy the resulting `/exec` URL into `config.js`:
   ```js
   window.JOURNAL_CONFIG = { scriptUrl: "https://script.google.com/macros/s/.../exec" };
   ```
6. Push to GitHub Pages. Done.

The script creates one tab per section. Each row: id | date | full JSON. Photos sit inline as base64 — the client pre-resizes them so cells stay well under the 50,000-char limit.

## Local-first behaviour

Every save also writes to `localStorage` under `houseboat_journal:<section>`. If the network's down, you keep journaling and the next save catches up. Loads always try the sheet first and fall back to localStorage on failure.

## CORS note

Posts use `Content-Type: text/plain;charset=utf-8` on purpose — Apps Script web apps don't handle preflight CORS for `application/json`. The body is still JSON, parsed server-side.

## Privacy

If you don't fill in `config.js`, nothing leaves your browser. If you do, everything goes to your own Sheet — Anthropic, this app, and the world don't see anything.
