import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';

export type Post = CollectionEntry<'blog'>;

// Entry ids look like "pt/ola-mundo".
export function postLang(post: Post): Lang {
  return post.id.split('/')[0] as Lang;
}

export function postSlug(post: Post): string {
  return post.id.split('/').slice(1).join('/');
}

export function postUrl(post: Post): string {
  return `/${postLang(post)}/posts/${postSlug(post)}/`;
}

export function readingTime(post: Post): number {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getPosts(lang?: Lang): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => !(import.meta.env.PROD && p.data.draft));
  return posts
    .filter((p) => !lang || postLang(p) === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTranslation(post: Post): Promise<Post | undefined> {
  if (!post.data.translationKey) return undefined;
  const all = await getPosts();
  return all.find(
    (p) => p.data.translationKey === post.data.translationKey && postLang(p) !== postLang(post),
  );
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
