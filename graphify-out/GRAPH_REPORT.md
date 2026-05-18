# Graph Report - .  (2026-05-11)

## Corpus Check
- Large corpus: 66 files · ~1,350,030 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 126 nodes · 167 edges · 16 communities (11 shown, 5 thin omitted)
- Extraction: 71% EXTRACTED · 28% INFERRED · 1% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.8)
- Token cost: 1,200 input · 950 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Components & Sections|UI Components & Sections]]
- [[_COMMUNITY_Work History & Identity|Work History & Identity]]
- [[_COMMUNITY_Project Docs & Metadata|Project Docs & Metadata]]
- [[_COMMUNITY_Tech Skills & Profile Assets|Tech Skills & Profile Assets]]
- [[_COMMUNITY_App Entry & Context|App Entry & Context]]
- [[_COMMUNITY_Visual Assets & Backgrounds|Visual Assets & Backgrounds]]
- [[_COMMUNITY_Projects Data|Projects Data]]
- [[_COMMUNITY_Contacts Data|Contacts Data]]
- [[_COMMUNITY_Recommendations Data|Recommendations Data]]
- [[_COMMUNITY_Sidebar & App Context|Sidebar & App Context]]
- [[_COMMUNITY_Robots & SEO|Robots & SEO]]

## God Nodes (most connected - your core abstractions)
1. `Jean Paulo - Software Developer` - 16 edges
2. `Developer Portfolio Website` - 11 edges
3. `My Portfolio (Personal Portfolio Website)` - 9 edges
4. `Developer Profile Person` - 7 edges
5. `Portfolio README` - 6 edges
6. `JavaScript` - 5 edges
7. `HTML` - 4 edges
8. `Backend/Cloud Database Illustration` - 4 edges
9. `MIT License` - 3 edges
10. `How to Run Portfolio Website` - 3 edges

## Surprising Connections (you probably didn't know these)
- `My Portfolio (Personal Portfolio Website)` --references--> `CV Jean de Almeida (PDF)`  [INFERRED]
  README.md → public/cv_jeandealmeida.pdf
- `My Portfolio (Personal Portfolio Website)` --references--> `Thiago Nóbrega`  [AMBIGUOUS]
  README.md → LICENSE.md
- `XP Inc. Company Logo` --references--> `Developer Portfolio Website`  [INFERRED]
  public/xpinc_logo.jpeg → project-preview.png
- `TOTVS Company Logo` --references--> `Developer Portfolio Website`  [INFERRED]
  public/totvs_logo.jpeg → project-preview.png
- `AB InBev Company Logo` --references--> `Developer Portfolio Website`  [INFERRED]
  public/ab_inbev_logo.jpeg → project-preview.png

## Hyperedges (group relationships)
- **Portfolio Technology Stack** — project_portfolio, tech_react, tech_context_api, tech_react_router, tech_proptypes, tech_react_testing_library, tech_create_react_app [EXTRACTED 1.00]
- **Portfolio Runtime Dependencies** — project_portfolio, tech_nodejs, tech_npm [EXTRACTED 1.00]

## Communities (16 total, 5 thin omitted)

### Community 0 - "UI Components & Sections"
Cohesion: 0.11
Nodes (5): companies, softSkills, TAG_TYPE, navItems, experiences

### Community 1 - "Work History & Identity"
Cohesion: 0.18
Nodes (18): AB InBev Company Logo, Afya Medicina Company Logo, Breathwrk Company Logo, Hub XP Company Logo, Jean Paulo - Software Developer, LuizaLabs (Magalu) Company Logo, NTT DATA Company Logo, Developer Portfolio Website (+10 more)

### Community 2 - "Project Docs & Metadata"
Cohesion: 0.18
Nodes (17): How to Run Portfolio Website, MIT License, manifest.json (Web App Manifest), Jean Paulo de Almeida Silva, Thiago Nóbrega, My Portfolio (Personal Portfolio Website), CV Jean de Almeida (PDF), public/index.html (+9 more)

### Community 3 - "Tech Skills & Profile Assets"
Cohesion: 0.19
Nodes (14): CSS Icon (SVG), CSS, Developer Profile Person, HTML Icon (SVG), HTML, Profile Photo (PNG), JavaScript, JavaScript Icon (SVG) (+6 more)

### Community 4 - "App Entry & Context"
Cohesion: 0.18
Nodes (3): isLocalhost, register(), registerValidSW()

### Community 5 - "Visual Assets & Backgrounds"
Cohesion: 0.22
Nodes (5): Backend/Cloud Database Illustration, Dark Grid Texture Background, Polaroid Frame UI Component, Tech Data Stream Background, trybeStore E-Commerce App Screenshot

## Ambiguous Edges - Review These
- `Thiago Nóbrega` → `My Portfolio (Personal Portfolio Website)`  [AMBIGUOUS]
  LICENSE.md · relation: references

## Knowledge Gaps
- **23 isolated node(s):** `isLocalhost`, `myContext`, `TAG_TYPE`, `companies`, `softSkills` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Thiago Nóbrega` and `My Portfolio (Personal Portfolio Website)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Are the 16 inferred relationships involving `Jean Paulo - Software Developer` (e.g. with `Profile Photo - Jean Paulo (outdoor/event context)` and `Profile Photo - Developer working on MacBook (dark office setting)`) actually correct?**
  _`Jean Paulo - Software Developer` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `Developer Portfolio Website` (e.g. with `XP Inc. Company Logo` and `TOTVS Company Logo`) actually correct?**
  _`Developer Portfolio Website` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `Developer Profile Person` (e.g. with `Profile Photo (PNG)` and `JavaScript`) actually correct?**
  _`Developer Profile Person` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `isLocalhost`, `myContext`, `TAG_TYPE` to the rest of the system?**
  _23 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._