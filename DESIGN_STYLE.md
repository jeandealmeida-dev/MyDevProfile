# Design Style Guide — Jean de Almeida Portfolio

> Reference document for maintaining visual consistency across all sections.
> Base: Hero + About sections (most complete). All new sections should align to this system.

---

## 1. Color System

### CSS Variables (`src/index.css`)

| Token | Hex | Role |
|-------|-----|------|
| `--white-100` | `#FFFFFF` | Headings, names, high-emphasis text |
| `--gray-500` | `#1F2428` | Darkest surface (original experience bg) |
| `--gray-400` | `#24292E` | Main app background, dark cards |
| `--gray-300` | `#2D333B` | Card borders, chip backgrounds, dividers |
| `--gray-200` | `#3F4244` | Subtle borders, hover surfaces |
| `--gray-100` | `#A8B2BC` | Muted / secondary text |
| `--gold` | `#F0A500` | Current/active accent, underlines, CTAs |
| `--blue-400` | `#1565C0` | About section accent (light bg context) |
| `--blue-300` | `#2196F3` | CTA buttons (Material Blue) |
| `--blue-200` | `#90CAF9` | Roles, links, tags, timeline spine, section tags |
| `--blue-100` | `rgba(144,202,249,0.12)` | Subtle blue tint fills |
| `--green-100` | `#3DDC84` | Android brand accent, domain tags |

### Section Backgrounds

| Section | Background | Notes |
|---------|-----------|-------|
| Hero | `#24292E` + `background.jpg` texture | Dark overlay `rgba(36,41,46,0.82)` on top |
| About | `#f0ebe0` (warm cream) | Dot-grid: `rgba(0,0,0,0.12)` at 24px |
| Experience | `#0F1823` (deep navy) | Dot-grid: `rgba(255,255,255,0.04)` at 28px |
| Contact | inherits dark base (`--gray-400`) | |

### Gold vs Blue — When to Use Which

- **Gold** `--gold` → current job, active state, CTA underlines, "now" markers
- **Blue-200** `--blue-200` → roles, links, past items, spine/timeline, section tags
- **Green** `--green-100` → Android identity, domain category tags only

---

## 2. Typography

### Font Stack

```css
/* Display — headings, names, bold UI */
font-family: 'Roboto', sans-serif;

/* Code — section labels, roles, technical labels, years */
font-family: 'Fira Code', monospace;

/* Body — paragraphs, descriptions, UI copy */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Scale

| Role | Size | Weight | Font | Color |
|------|------|--------|------|-------|
| Hero name | `4rem` | 900 | Roboto | `--white-100` |
| Section heading (dark bg) | `2.5rem` | 700 | Roboto | `--white-100` |
| Section heading (light bg) | `3rem` | 700 | Roboto | `#1F2428` |
| Section tag | `0.85rem` | 400 | Fira Code | `--blue-200` |
| Role / typewriter | `1.25rem` | 400 italic | Fira Code | `--blue-200` |
| Body paragraph | `1rem` | 400 | System UI | `#4a5568` (light) / `--gray-100` (dark) |
| Card company name | `1.05rem` | 700 | Roboto | `--white-100` |
| Card role | `0.9rem` | 400 | System UI | `--blue-200` |
| Muted label | `0.72rem` | 400 | System UI | `--gray-100` |
| Uppercase label | `0.65–0.72rem` | 600 | System UI | `--gray-100`, uppercase, `letter-spacing: 1px` |
| Tag/badge | `0.7rem` | 600 | System UI | varies, uppercase, `letter-spacing: 0.5px` |

### Section Header Pattern

Every section opens with this two-line header — always:

```jsx
<span className="section-tag">{'// section-name'}</span>
<h2 className="section-heading">Section Title</h2>
```

```css
.section-tag {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: var(--blue-200);   /* or --blue-400 on light bg */
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 0.5rem;
}

.section-heading {
  font-family: 'Roboto', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--white-100);
  line-height: 1.1;
}
```

---

## 3. Spacing

### Section Layout

```css
.landing-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
}
```

### Content Max-Widths

| Area | Max-Width |
|------|-----------|
| Hero, About inner | `1100px` |
| Experience inner | `1000px` |
| Contact inner | `860px` |

All centered: `margin: 0 auto`.

### Internal Rhythm

| Gap | Usage |
|-----|-------|
| `0.2–0.4rem` | Tight label spacing |
| `0.5rem` | Between inline badges/chips |
| `1rem` | Between card elements |
| `1.25–1.75rem` | Card padding |
| `2.5rem` | Between major content blocks |
| `3.5rem` | Between timeline items, section header bottom margin |
| `5rem` | Between hero columns |

---

## 4. Card Patterns

### Dark Card (Experience, modals)

```css
background-color: var(--gray-400);   /* #24292E */
border: 1px solid var(--gray-300);
border-radius: 10–16px;
padding: 1.5rem 1.75rem;
```

Accent variant — left or right 3px border:
```css
border-left: 3px solid var(--blue-200);   /* past item */
border-left: 3px solid var(--gold);        /* current item */
```

### Light Card (About section — Material elevation)

```css
background: #ffffff;
border: none;
border-radius: 16px;
box-shadow:
  0 2px 4px rgba(0, 0, 0, 0.08),
  0 8px 20px rgba(0, 0, 0, 0.07);
```

### Company Logo Badge

```css
/* Circular (timeline nodes, modal headers) */
width: 52–64px; height: 52–64px;
border-radius: 50%;
background: #fff;
border: 2–3px solid var(--blue-200);   /* gold for current */
box-shadow: 0 0 0 5–6px rgba(144,202,249,0.1), 0 4px 16px rgba(0,0,0,0.4);

/* Rounded square (About carousel, sm-cards) */
border-radius: 4–10px;
width: 40–52px; height: 40–52px;
```

---

## 5. Tag / Badge System

Three semantic categories with consistent visual treatment:

```css
/* Tech */
.exp-tag--tech {
  background: rgba(83, 155, 245, 0.12);
  color: var(--blue-200);
  border: 1px solid rgba(83, 155, 245, 0.25);
}

/* Context (consultancy, leadership, international) */
.exp-tag--context {
  background: rgba(240, 165, 0, 0.1);
  color: var(--gold);
  border: 1px solid rgba(240, 165, 0, 0.25);
}

/* Domain (fintech, healthcare, e-commerce…) */
.exp-tag--domain {
  background: rgba(61, 220, 132, 0.08);
  color: var(--green-100);
  border: 1px solid rgba(61, 220, 132, 0.2);
}

/* Shared */
font-size: 0.7rem;
font-weight: 600;
padding: 0.2rem 0.6rem;
border-radius: 20px;
text-transform: uppercase;
letter-spacing: 0.5px;
```

Current/active badge (gold pill):
```css
.current-badge {
  background: rgba(240, 165, 0, 0.15);
  color: var(--gold);
  border: 1px solid rgba(240, 165, 0, 0.3);
}
```

---

## 6. Interactive Patterns

### Hover Lift

```css
/* Standard card/chip hover */
transition: transform 0.2s ease, box-shadow 0.2s ease;
transform: translateY(-2px);   /* chip */
transform: translateY(-4–6px); /* card */
```

### Transition Duration

All micro-interactions use `0.2s ease` as the default. Modal animations use `0.22–0.25s ease`.

### Current / Active State

When an item is "current" or "active", swap `--blue-200` → `--gold` on:
- Border color
- Glow ring color
- Text color (company name)
- Spine/connector segment

### Glow Rings

```css
/* Blue (past/neutral) */
box-shadow: 0 0 0 6px rgba(144, 202, 249, 0.1), 0 4px 16px rgba(0,0,0,0.4);

/* Gold (current/active) */
box-shadow: 0 0 0 6px rgba(240, 165, 0, 0.12), 0 4px 16px rgba(0,0,0,0.4);
```

---

## 7. Animation Catalog

| Name | Usage | Timing |
|------|-------|--------|
| `blink` | Cursor after typewriter text | `1s step-start infinite` |
| `marquee` | Company logo carousel | `22s linear infinite` |
| `highlight-pulse` | Card flash on scroll-to | `0.7s ease-out once` |
| `sm-enter` | Section card entrance (fade + slide) | `0.55s ease both`, staggered by index |
| `sm-pulse` | Active state pulsing dot | `2s ease-in-out infinite` |
| `sm-fade` / `sm-rise` | Modal overlay + card | `0.18–0.22s ease` |

Entrance stagger formula: `animation-delay: calc(var(--idx) * 0.12s)`

---

## 8. Decorative Elements

### Hero — Polaroid Frame

Photo displayed in a tilted polaroid (`rotate(-1.5deg)`) with:
- Cream background `#f0ebe0`
- Tape strip pseudo-element (`rgba(180,158,112,0.55)`)
- Double box-shadow for depth

### Hero — Android Green Glow

```css
background: radial-gradient(
  ellipse at center,
  rgba(61, 220, 132, 0.22) 0%,
  rgba(61, 220, 132, 0.08) 45%,
  transparent 70%
);
```
Placed behind the profile photo. Android identity signal.

### About — Figma Selection Frame

Dashed border + corner handles + SVG mouse cursor, grouped in `.selection-frame-group` (absolute, `pointer-events: none`). Three CSS corner handles (`fc-tl`, `fc-tr`, `fc-bl`) + cursor at bottom-right. Signals design-aware, detail-oriented personality.

### Dot-Grid Texture

Used on About (dark dots on cream) and Experience (white dots on navy):
```css
background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
background-size: 28px 28px;
```

### Gradient Spines / Dividers

Spines fade from gold → blue → transparent/bg-color:
```css
background: linear-gradient(to bottom/right, var(--gold) 0%, var(--blue-200) 40%, transparent 100%);
```

---

## 9. Section Backgrounds Pattern

| Section | Bg Color | Texture | Shape |
|---------|----------|---------|-------|
| Hero | `#24292E` + texture img | dark overlay | `border-radius: 0 0 52px 52px` + shadow |
| About | `#f0ebe0` | dark dot-grid | flat, `z-index: 1` |
| Experience | `#0F1823` | white dot-grid | flat |
| Contact | `--gray-400` | — | flat |

The Hero card (dark, rounded bottom) sits above About (cream). This layering pattern — elevated dark card on lighter surface — can be reused for future sections.

---

## 10. Code / Developer Identity Signals

These patterns communicate "developer" without saying it:

| Signal | Where |
|--------|-------|
| `// section-name` comments as section labels | All sections |
| Fira Code monospace for roles and labels | Hero, timeline years |
| UML state machine notation (●, ◎, →) | Experience timeline |
| Typewriter animation for job title | Hero |
| Android green (`#3DDC84`) in glow | Hero photo bg |
| `▸` bullet points in highlights | Experience modal |
| Technical year labels in monospace (`2021 → 2024`) | Experience timeline |

---

## 11. Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| `≤ 480px` | Small phones — reduce hero font size |
| `≤ 600px` | Mobile cards — flatten experience wave, full-width buttons |
| `≤ 700px` | Timeline collapse |
| `≤ 860px` | About photo stacks vertically |
| `≤ 1000px` | Hero stacks vertically |
| `≤ 1150px` | Sidebar collapses, hamburger appears |

---

## 12. Next Sections — Recommendations

### Projects
- Dark bg (`--gray-400` or `#0F1823`)
- Cards with `border-left: 3px solid var(--blue-200)` accent
- Tech tag pills same system as Experience
- Screenshot/preview image in card header
- GitHub + live link CTA buttons (use `--blue-300` for primary, ghost for secondary)

### Testimonials / Recommendations
- Light bg (cream `#f0ebe0`) — creates light/dark rhythm
- Quote marks in `--gold` (large, decorative)
- Avatar + name + role using same company-logo-badge pattern
- Card elevation matching About's Material white cards

### Skills / Stack
- Dark bg
- Group by category using the same tag color system (tech/context/domain)
- Logo badges in grid, consistent with Experience node style
- Progress or proficiency expressed through glow intensity, not bars
