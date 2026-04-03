import type { CollectionEntry } from 'astro:content';

/** Get URL-safe slug from collection entry id (strips .mdx/.md extension) */
export function getSlug(post: CollectionEntry<'blog'>): string {
  return post.id.replace(/\.(mdx?|md)$/, '');
}

/** Format date to Korean style: 2025년 1월 15일 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Format date to short: 2025.01.15 */
export function formatDateShort(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** Estimate reading time in minutes */
export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const koreanChars = (content.match(/[\u3131-\uD79D]/g) || []).length;
  // Korean reads ~500 chars/min, English ~200 words/min
  const minutes = Math.ceil((words + koreanChars) / 350);
  return Math.max(1, minutes);
}

/** Sort posts by date descending */
export function sortPostsByDate(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Filter out drafts in production */
export function filterDrafts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  if (import.meta.env.PROD) {
    return posts.filter((p) => !p.data.draft);
  }
  return posts;
}

/** Get all unique tags with counts */
export function getTagCounts(posts: CollectionEntry<'blog'>[]): Map<string, number> {
  const tags = new Map<string, number>();
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    });
  });
  return new Map([...tags.entries()].sort((a, b) => b[1] - a[1]));
}

/** Get related posts by matching tags */
export function getRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit = 3,
): CollectionEntry<'blog'>[] {
  const currentTags = new Set(currentPost.data.tags);
  return allPosts
    .filter((p) => p.id !== currentPost.id)
    .map((p) => ({
      post: p,
      score: p.data.tags.filter((t) => currentTags.has(t)).length,
    }))
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf())
    .slice(0, limit)
    .map((p) => p.post);
}
