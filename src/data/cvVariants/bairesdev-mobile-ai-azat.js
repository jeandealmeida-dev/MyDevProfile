// BairesDev, Mobile AI Engineer (remote). English posting.
// Focus: Kotlin and Compose, AI-assisted development, working with little hand-holding, full-stack range.
// Not covered by the CV (do not claim): multi-agent orchestration frameworks (LangGraph, CrewAI).

const variant = {
  slug: 'bairesdev-mobile-ai-azat',
  lang: 'en',
  target: {
    company: 'BairesDev',
    role: 'Mobile AI Engineer',
    url: 'https://www.linkedin.com/jobs/view/4487942768/',
  },

  headline: {
    en: 'Senior Android Engineer · Kotlin, Jetpack Compose and AI-assisted development',
    pt: 'Engenheiro Android Sênior · Kotlin, Jetpack Compose e desenvolvimento assistido por IA',
  },

  summary: {
    en: [
      'Android engineer with almost 10 years in mobile, working in Kotlin and Jetpack Compose.',
      'At Thoughtworks I led the Android rebuild of Peloton’s Breathwrk app in Compose, directing AI coding agents through the rewrite and reviewing what they produced, in English with a distributed team.',
      'I like owning a product end to end. At OmniChat I was the only Android developer and defined the architecture from scratch.',
    ],
    pt: [
      'Engenheiro Android com quase 10 anos em mobile, trabalhando em Kotlin e Jetpack Compose.',
      'Na Thoughtworks, liderei a reconstrução Android do app Breathwrk, da Peloton, em Compose, dirigindo agentes de IA de código na reescrita e revisando o que eles produziram, em inglês e com um time distribuído.',
      'Gosto de cuidar de um produto de ponta a ponta. Na OmniChat fui o único dev Android e defini a arquitetura do zero.',
    ],
  },

  experience: {
    thoughtworks: { bullets: ['tw-ai', 'tw-rewrite', 'tw-release', 'tw-metrics'] },
    luizalabs: { bullets: ['lz-lead', 'lz-queue', 'lz-warroom'] },
    xp: { bullets: ['xp-sse', 'xp-tests', 'xp-release'] },
  },

  skills: [
    { id: 'android', items: ['Kotlin', 'Jetpack Compose', 'Coroutines and Flow', 'Room', 'Hilt', 'Dagger', 'Retrofit', 'Java'] },
    { id: 'tools', items: ['AI-assisted development (Claude Code, Cursor)', 'Firebase', 'Feature flags (Remote Config)', 'CI/CD (Azure DevOps, GitHub Actions)', 'Datadog', 'Git', 'Gradle (Kotlin DSL)'] },
    { id: 'arch', items: ['Clean Architecture', 'MVVM', 'TDD', 'Unit testing', 'Code review'] },
    { id: 'cross', items: ['Flutter', 'Dart'] },
  ],
};

export default variant;
