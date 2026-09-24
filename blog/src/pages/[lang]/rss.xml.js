import rss from '@astrojs/rss';
import { languages, t } from '../../i18n';
import { getPosts, postUrl } from '../../posts';

export function getStaticPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

export async function GET(context) {
  const lang = context.params.lang;
  const posts = await getPosts(lang);
  return rss({
    title: t(lang, 'siteTitle'),
    description: t(lang, 'siteDescription'),
    site: context.site,
    customData: `<language>${t(lang, 'htmlLang')}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: postUrl(post),
    })),
  });
}
