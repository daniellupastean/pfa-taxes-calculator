import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ro' ? 'en' : 'ro';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
      style={{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-secondary)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--color-accent-primary)';
        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
        e.currentTarget.style.boxShadow = '0 0 10px rgba(251, 191, 36, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--color-text-secondary)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      title={i18n.language === 'ro' ? 'Switch to English' : 'Switch to Romanian'}
    >
      <Globe size={16} />
      <span className="font-semibold uppercase">{i18n.language}</span>
    </button>
  );
};
