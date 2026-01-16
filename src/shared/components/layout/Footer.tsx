import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer
      className="py-4 mt-16 border-t"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {t('footer.createdBy')}
          </p>
          <div className="flex gap-2">
            <a
              href="https://github.com/daniellupastean"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-background)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/daniellupastean/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-background)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};
