import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  animate = true,
}) => {
  const hoverClass = hover ? 'card-hover' : '';
  const animateClass = animate ? 'animate-fade-up' : '';

  return (
    <div
      className={`rounded-xl p-6 border-glow ${hoverClass} ${animateClass} ${className}`}
      style={{
        backgroundColor: 'var(--color-panel)',
        border: '1px solid var(--color-border)',
      }}
    >
      {children}
    </div>
  );
};
