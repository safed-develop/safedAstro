import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortPostsByDate, filterDrafts, getSlug } from '../utils/blog';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('blog');
  const posts = sortPostsByDate(filterDrafts(allPosts));

  return rss({
    title: 'SafeD 블로그',
    description: '현장 안전관리 인사이트와 산업안전 트렌드를 공유합니다.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${getSlug(post)}/`,
      categories: post.data.tags,
    })),
    customData: '<language>ko</language>',
  });
}
