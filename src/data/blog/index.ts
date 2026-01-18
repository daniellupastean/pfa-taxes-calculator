import { parseFrontmatter, getString, getStringArray, getOptionalString } from '@lib/markdown/frontmatter';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
}

const rawPosts = Object.values(
  import.meta.glob<string>('./*.md', { eager: true, as: 'raw' })
);

const parseMarkdownPost = (raw: string): BlogPost => {
  const { metadata, content } = parseFrontmatter(raw);

  return {
    id: getString(metadata, 'id'),
    slug: getString(metadata, 'slug'),
    title: getString(metadata, 'title'),
    excerpt: getString(metadata, 'excerpt'),
    author: getString(metadata, 'author'),
    publishedAt: getString(metadata, 'publishedAt'),
    readTime: getString(metadata, 'readTime'),
    category: getString(metadata, 'category'),
    tags: getStringArray(metadata, 'tags'),
    image: getOptionalString(metadata, 'image'),
    content,
  };
};

export const blogPosts: BlogPost[] = rawPosts
  .map(parseMarkdownPost)
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
