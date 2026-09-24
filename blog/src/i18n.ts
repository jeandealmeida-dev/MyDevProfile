export const languages = ['pt', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'pt';

export const ui = {
  pt: {
    htmlLang: 'pt-BR',
    locale: 'pt-BR',
    siteTitle: 'Jean de Almeida — Blog',
    siteDescription: 'Notas sobre Android, mobile, automação e projetos pessoais.',
    'nav.posts': 'Posts',
    'nav.tags': 'Tags',
    'nav.portfolio': 'Portfólio',
    'nav.rss': 'RSS',
    'hero.tag': '// blog',
    'hero.title': 'Notas de um dev mobile',
    'hero.subtitle': 'Android, KMP, automação caseira e o que mais estiver na cabeça.',
    'list.tag': '// posts',
    'list.title': 'Últimos posts',
    'list.empty': 'Nenhum post ainda.',
    'tags.tag': '// tags',
    'tags.title': 'Tags',
    'tag.title': 'Posts com',
    'post.back': 'voltar pros posts',
    'post.readingTime': 'min de leitura',
    'post.updated': 'atualizado em',
    'post.otherLang': 'Read in English',
    'footer.findMe': 'Me encontre em:',
    'footer.developedBy': 'Feito por Jean de Almeida',
    '404.title': 'Página não encontrada',
    '404.back': 'voltar pro início',
  },
  en: {
    htmlLang: 'en-US',
    locale: 'en-US',
    siteTitle: 'Jean de Almeida — Blog',
    siteDescription: 'Notes on Android, mobile, automation and side projects.',
    'nav.posts': 'Posts',
    'nav.tags': 'Tags',
    'nav.portfolio': 'Portfolio',
    'nav.rss': 'RSS',
    'hero.tag': '// blog',
    'hero.title': 'Notes from a mobile dev',
    'hero.subtitle': 'Android, KMP, home automation and whatever else is on my mind.',
    'list.tag': '// posts',
    'list.title': 'Latest posts',
    'list.empty': 'No posts yet.',
    'tags.tag': '// tags',
    'tags.title': 'Tags',
    'tag.title': 'Posts tagged',
    'post.back': 'back to posts',
    'post.readingTime': 'min read',
    'post.updated': 'updated on',
    'post.otherLang': 'Ler em português',
    'footer.findMe': 'Find me on:',
    'footer.developedBy': 'Built by Jean de Almeida',
    '404.title': 'Page not found',
    '404.back': 'back home',
  },
} as const;

export type UiKey = keyof (typeof ui)['pt'];

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key];
}

export function otherLang(lang: Lang): Lang {
  return lang === 'pt' ? 'en' : 'pt';
}

export function formatDate(lang: Lang, date: Date): string {
  return date.toLocaleDateString(ui[lang].locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
