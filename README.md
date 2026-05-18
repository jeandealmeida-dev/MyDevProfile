# Jean de Almeida — Developer Portfolio

Personal portfolio website for **Jean Paulo de Almeida Silva**, Senior Android Developer with 13+ years of experience. Built as a single-page React application with a terminal/developer aesthetic, bilingual support (EN/PT-BR), and a fully responsive design.

---

## Live Sections

| Section | Description |
|---|---|
| **Hero** | Animated typewriter cycling through job titles, polaroid-style profile photo |
| **About** | Bio, soft skills, company logo marquee with scroll-to-experience interaction |
| **Career History** | Horizontal pipeline with draggable cards, year badges, job detail modals, parallel contractor lane |
| **Projects** | Android phone simulator showing Play Store-style app listings with GitHub links |
| **Testimonials** | Two-row infinite marquee of colleague recommendations with keyword highlights and modal expansion |
| **Let's Talk?** | Email link and CV download dropdown (EN/PT-BR PDFs) |

---

## Tech Stack

**Framework & Routing**
- React 18 + React Router v6
- Create React App (react-scripts 5)

**Internationalization**
- i18next + react-i18next + i18next-browser-languagedetector
- English (en-US) and Portuguese (pt-BR) — auto-detected from browser, togglable at runtime

**Styling**
- Plain CSS with custom properties (design tokens)
- CSS Grid + Flexbox layouts
- CSS animations (`@keyframes`, `backdrop-filter`, `background-gradient`)
- Centralized section heading styles (`SectionHeading.css`)

**Icons**
- react-icons (Feather + Bootstrap icon sets)

**Runtime**
- Node 20.x

---

## Notable Implementation Details

- **Custom `useTypewriter` hook** — smooth typing/deleting animation without external libraries, no flicker
- **IntersectionObserver** — navbar highlights the active section during scroll
- **Infinite marquee** — 4-copy technique (`translateX(-25%)`) for gap-free seamless looping
- **Testimonial highlights** — regex-based keyword bolding with per-language highlight arrays
- **Phone simulator** — full Android mockup (status bar, punch hole, nav buttons) with glassmorphism device wrapper
- **Scroll offset correction** — programmatic `scrollTo` subtracts fixed header height (92px) for accurate anchor navigation
- **Samsung Browser dark mode fix** — `color-scheme: light` in both HTML meta and CSS

---

## Project Structure

```
src/
├── components/         # UI sections (Hero, About, Experience, Projects, Testimonials, Contact…)
├── pages/              # LandingPage (single route)
├── styles/             # One CSS file per component + SectionHeading.css (shared)
├── data/               # experiences.js · projects.js · recommendation.js · contacts.js
├── i18n/
│   └── locales/        # en-US.json · pt-BR.json
├── context/            # Global state (sidebar/menu)
└── index.css           # CSS variables (design tokens), global reset
```

---

## Getting Started

**Install dependencies**
```bash
npm install
```

**Run development server**
```bash
npm start
```

**Production build**
```bash
npm run build
```

**Run tests**
```bash
npm test
```

---

## Deployment

Deployed on **Vercel**. The `engines` field in `package.json` pins Node 20.x — make sure the Vercel project settings match.

---

## About Jean

Senior Android Developer based in Joinville, SC, Brazil. 13+ years building for Android across fintech, e-commerce, health, and retail. Currently at **Thoughtworks**. Fluent in Portuguese, Spanish, and English.

[linkedin.com/in/jeanalmeida](https://www.linkedin.com/in/jeanalmeida)
