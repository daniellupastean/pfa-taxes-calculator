import React, { useState } from 'react';

interface TooltipProps {
  text?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="inline-flex items-center gap-1.5">
      {children}
      <div className="relative inline-block">
        <svg
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          className="w-4 h-4 opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer"
          style={{ color: 'var(--color-accent-primary)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        {isVisible && (
          <div
            className="tooltip-content absolute z-50 px-4 py-3 text-sm leading-relaxed rounded-lg shadow-xl min-w-[280px] max-w-sm -top-2 left-full ml-3 whitespace-normal"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-accent-primary)',
              color: 'var(--color-text-secondary)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 191, 36, 0.2)',
            }}
          >
            {content || text}
            {/* Arrow */}
            <div
              className="absolute w-3 h-3 -left-1.5 top-4 transform rotate-45"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderLeft: '1px solid var(--color-accent-primary)',
                borderBottom: '1px solid var(--color-accent-primary)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
