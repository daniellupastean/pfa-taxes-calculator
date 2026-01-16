import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  title?: string;
  size?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, title, size = 20 }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg transition-all hover:scale-110"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-accent-primary)',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      title={title}
    >
      {React.isValidElement(icon) ? React.cloneElement(icon, { size } as { size: number }) : icon}
    </button>
  );
};
