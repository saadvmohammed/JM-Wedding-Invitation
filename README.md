# Noor-E-Chashme & Mohammed Jasim — Nikah & Valima Wedding Invitation

An interactive, animated single-page wedding invitation website created for the Nikah & Valima of **Noor-E-Chashme** and **Mohammed Jasim**.

## 🌟 Key Features

- **Dual Swappable Themes:**
  - **Theme A — "Midnight Gold" (Default):** Deep charcoal backdrop (`#0d0d0f`–`#1a1a1d`) with gold foil accents (`#c9a24b` → `#e8c874`), Art Deco geometric borders, and drifting gold particles.
  - **Theme B — "Ivory Marble Gold":** Cream/ivory marble background with gold crackle veining, brown-gold (`#8a6d3b`) text, and double-line gold borders.
  - **Theme Switcher:** Fixed top-right circular toggle button with smooth 400ms crossfade and `localStorage` persistence.
- **Personalized Guest Links (`?to=`):** Adding `?to=Fahad` to the URL displays a *"Dear Fahad"* gold badge in the Hero section.
- **3D Envelope Intro Screen:** Unfolds with a gold wax-seal trigger ("JM" monogram) and subtle chime.
- **Add to Calendar (.ics):** Client-side `.ics` generator downloads the Nikah event directly to the guest's phone/calendar.
- **Web Share API:** "Share Invitation" button for native mobile share sheets & copy-link fallback.
- **Interactive Monogram Easter Egg:** Tapping the "JM" monogram triggers a wax seal animation.
- **Exact Card Content & Lineage:** Full text, Bismillah calligraphy, groom & bride details, Hijri & Gregorian dates.
- **Live Countdown Timer:** Counts down in real-time to Thursday, October 15, 2026, 12:30 PM IST.
- **Schedule of Events & Venue Maps:** Vertical timeline and embedded Google Maps for *Masjid-e-Madinal Uloom* and *NKZ Convention Hall*.
- **Zero Backend / Zero Config:** Deploys instantly to Vercel free tier.

---

## 📁 File Structure

```
JM-Wedding-Invite/
├── index.html         # Main HTML layout & meta tags
├── style.css          # Dual theme system (CSS variables), animations & responsive design
├── script.js          # Theme toggle, URL parameter parser, .ics export, Web Share API
├── assets/
│   ├── bismillah.svg  # Gold Bismillah Calligraphy vector
│   ├── jm-seal.svg    # Gold wax-seal "JM" crest SVG
│   ├── mosque-art.svg # Line-art mosque illustration SVG
│   ├── sun.svg        # Sun icon SVG
│   ├── moon.svg       # Moon icon SVG
│   └── favicon.svg    # Gold monogram favicon
└── README.md          # Setup & Deployment guide
```

---

## 🚀 How to Run Locally

1. Open `index.html` directly in any web browser, or use a local HTTP server:
   ```bash
   npx serve .
   # or
   python -m http.server 3000
   ```
2. Visit `http://localhost:3000` in your browser.
3. Test guest personalization by opening: `http://localhost:3000?to=Fahad`

---

## 🌐 Deploy to Vercel (Zero Config)

1. Push this repository to GitHub or GitLab.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the `JM-Wedding-Invite` repository.
4. Set **Framework Preset** to **"Other"**.
5. Click **Deploy**. Vercel will host it instantly on Vercel's free tier!
