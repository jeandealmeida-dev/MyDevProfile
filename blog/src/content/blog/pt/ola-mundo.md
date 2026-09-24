---
title: Olá, mundo
description: Primeiro post — por que um blog e como ele roda num servidor em casa.
date: 2026-09-23
tags: [meta, astro, umbrel]
translationKey: hello-world
---

Depois de anos só com o [portfólio](https://jeandealmeida.dev), resolvi ter um lugar pra escrever sobre o que ando construindo: Android, KMP, automações caseiras e projetos paralelos.

## Como funciona

O blog é um site estático feito com [Astro](https://astro.build). Cada post é um arquivo Markdown no git:

```bash
src/content/blog/
├── pt/ola-mundo.md
└── en/hello-world.md
```

O build gera HTML puro, servido de um servidor [Umbrel](https://umbrel.com) aqui de casa e exposto via Cloudflare Tunnel.

```kotlin
fun main() {
    println("Olá, mundo!")
}
```

> Posts podem ter versão em português e inglês — o botão **EN/PT** no topo troca entre elas.
