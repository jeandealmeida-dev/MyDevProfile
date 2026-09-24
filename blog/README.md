# blog

Blog pessoal em **blog.jeandealmeida.dev** — Astro estático, mesmo visual do portfólio
(raiz deste repo): title bar macOS, navbar escura, hero "shelf" escuro sobre canvas creme
pontilhado, cards brancos, Roboto + Fira Code. Cores vêm de `../src/tokens.css`,
compartilhado com o portfólio.

## Estrutura

```
src/
├── content/blog/<pt|en>/<slug>.md   # posts
├── content.config.ts                # schema do frontmatter
├── i18n.ts                          # strings da UI (pt/en)
├── posts.ts                         # helpers (url, reading time, tradução, tags)
├── layouts/Base.astro               # title bar + navbar + footer
├── components/                      # Hero, PostCard
├── pages/[lang]/                    # home, posts/[slug], tags, rss.xml
└── styles/global.css                # design tokens + estilos
vercel.json                          # config do projeto Vercel do blog
```

## Rotas

- `/` → redireciona pra `/pt/` ou `/en/` (última escolha, senão idioma do browser)
- `/<lang>/` lista de posts · `/<lang>/posts/<slug>/` post · `/<lang>/tags/` · `/<lang>/tags/<tag>/`
- `/<lang>/rss.xml` · `/sitemap-index.xml`

## Novo post

Criar `src/content/blog/pt/<slug>.md` (e opcionalmente `en/<slug>.md`):

```md
---
title: Título
description: Uma linha de resumo.
date: 2026-09-23
tags: [android, kmp]
translationKey: meu-post   # mesmo valor nas duas línguas liga PT <-> EN
draft: false               # true = não publica no build
---
```

Depois é só `git push` — a Vercel builda e publica.

## Dev

```bash
cd blog
npm install
npm run dev          # http://localhost:4321 com hot reload
npm run build        # gera dist/
```

## Deploy (Vercel)

Projeto Vercel separado do portfólio, mesmo repo:

- Root Directory: `blog` (com "Include files outside the root directory" ligado — o CSS importa `../src/tokens.css`)
- Framework: Astro · Node 20.x
- Domínio: `blog.jeandealmeida.dev`
- `vercel.json` só builda quando muda algo em `blog/` ou `src/tokens.css`;
  o `vercel.json` da raiz faz o portfólio ignorar commits que só mexem em `blog/`.
