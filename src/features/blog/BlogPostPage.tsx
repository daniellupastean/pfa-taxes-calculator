import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, BookOpen, Tag, Calendar, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TopNavigation, Footer } from '@/shared/components/layout';
import { IconButton } from '@/shared/components/ui';
import { blogPosts } from '@/data/blog-posts';
import '@/styles/markdown.css';

export const BlogPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  const post = blogPosts.find((p) => p.slug === slug);

  const relatedPosts = post
    ? blogPosts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3)
    : [];

  if (!post) {
    return (
      <div
        className="min-h-screen grid-overlay flex flex-col"
        style={{ backgroundColor: 'var(--color-void)' }}
      >
        <TopNavigation
          title={t('blog.title')}
          leftAction={
            <IconButton
              icon={<ArrowLeft />}
              onClick={() => navigate('/blog')}
              title={t('blog.backToBlog')}
            />
          }
        />
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {t('blog.notFound.title')}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>{t('blog.notFound.description')}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen grid-overlay flex flex-col"
      style={{ backgroundColor: 'var(--color-void)' }}
    >
      <TopNavigation
        title={t('blog.title')}
        leftAction={
          <IconButton
            icon={<ArrowLeft />}
            onClick={() => navigate('/blog')}
            title={t('blog.backToBlog')}
          />
        }
      />

      <main className="container mx-auto px-4 py-8 flex-1">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <nav
            className="mb-6 flex items-center gap-2 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <button
              onClick={() => navigate('/')}
              className="hover:underline transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('nav.home')}
            </button>
            <ChevronRight size={16} />
            <button
              onClick={() => navigate('/blog')}
              className="hover:underline transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('blog.title')}
            </button>
            <ChevronRight size={16} />
            <span style={{ color: 'var(--color-text-secondary)' }}>{post.title}</span>
          </nav>

          {/* Article Card */}
          <div
            className="rounded-xl p-6 md:p-8 border-glow"
            style={{
              backgroundColor: 'var(--color-panel)',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Header */}
            <div className="mb-8">
              {/* Category Badge */}
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
                style={{
                  backgroundColor: 'rgba(251, 191, 36, 0.1)',
                  color: 'var(--color-accent-primary)',
                }}
              >
                {post.category}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold mb-4 gradient-text">{post.title}</h1>

              {/* Meta Info */}
              <div
                className="flex flex-wrap items-center gap-4 text-sm pb-6 border-b"
                style={{
                  color: 'var(--color-text-muted)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(post.publishedAt).toLocaleDateString('ro-RO')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="markdown-content">
              <ReactMarkdown>{post.content.replace(/^\s*#\s+.+?\n+/, '')}</ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={16} style={{ color: 'var(--color-text-muted)' }} />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t('blog.readNext')}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <div
                    key={relatedPost.slug}
                    onClick={() => {
                      navigate(`/blog/${relatedPost.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="rounded-xl p-6 border-glow cursor-pointer transition-all hover:scale-105"
                    style={{
                      backgroundColor: 'var(--color-panel)',
                      border: '1px solid var(--color-border)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-3"
                      style={{
                        backgroundColor: 'rgba(251, 191, 36, 0.1)',
                        color: 'var(--color-accent-primary)',
                      }}
                    >
                      {relatedPost.category}
                    </div>
                    <h3
                      className="text-lg font-semibold mb-2 line-clamp-2"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {relatedPost.title}
                    </h3>
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {relatedPost.excerpt}
                    </p>
                    <div
                      className="flex items-center gap-2 text-xs"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <Clock size={14} />
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--color-panel)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ArrowLeft size={20} />
              {t('blog.backToBlog')}
            </button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};
