---
title: Hello, world
description: First post — why a blog, and how it runs on a server at home.
date: 2026-09-23
tags: [meta, astro, umbrel]
translationKey: hello-world
---

After years with only a [portfolio](https://jeandealmeida.dev), I wanted a place to write about what I'm building: Android, KMP, home automation and side projects.

## How it works

The blog is a static site built with [Astro](https://astro.build). Each post is a Markdown file in git:

```bash
src/content/blog/
├── pt/ola-mundo.md
└── en/hello-world.md
```

The build outputs plain HTML, served from an [Umbrel](https://umbrel.com) box at home and exposed through a Cloudflare Tunnel.

```kotlin
fun main() {
    println("Hello, world!")
}
```

> Posts can have Portuguese and English versions — the **EN/PT** button at the top switches between them.
