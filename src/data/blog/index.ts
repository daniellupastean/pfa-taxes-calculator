import { parseMarkdownPost, type BlogPost } from './parser';

const rawPosts = Object.values(
  import.meta.glob<string>('./*.md', { eager: true, as: 'raw' })
);

export const blogPosts: BlogPost[] = rawPosts
  .map(parseMarkdownPost)
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export type { BlogPost };
