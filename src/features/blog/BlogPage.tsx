import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, Clock, Tag } from 'lucide-react';
import { TopNavigation, Footer } from '../../shared/components/layout';
import { IconButton } from '../../shared/components/ui';
import { blogPosts } from '../../data/blog-posts';

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen grid-overlay flex flex-col"
      style={{ backgroundColor: 'var(--color-void)' }}
    >
      <TopNavigation
        title={t('blog.title')}
        subtitle={t('blog.subtitle')}
        leftAction={
          <IconButton
            icon={<ArrowLeft />}
            onClick={() => navigate('/')}
            title={t('navigation.backToHome')}
          />
        }
      />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Blog Posts Grid */}
          <div className="grid gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl p-6 border-glow card-hover cursor-pointer transition-all"
                style={{
                  backgroundColor: 'var(--color-panel)',
                  border: '1px solid var(--color-border)',
                }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      color: 'var(--color-accent-primary)',
                    }}
                  >
                    {post.category}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3 gradient-text" style={{ cursor: 'pointer' }}>
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-base mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div
                  className="flex items-center gap-4 text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag size={16} />
                    <span>{post.tags.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {blogPosts.length === 0 && (
            <div
              className="rounded-xl p-12 text-center"
              style={{
                backgroundColor: 'var(--color-panel)',
                border: '1px solid var(--color-border)',
              }}
            >
              <BookOpen
                size={48}
                style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('blog.emptyState.title')}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {t('blog.emptyState.description')}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
