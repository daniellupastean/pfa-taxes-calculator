interface ToggleOption<T> {
  value: T;
  label: string;
}

interface ToggleInlineProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];
}

export function ToggleInline<T extends string | number | boolean>({
  value,
  onChange,
  options,
}: ToggleInlineProps<T>) {
  return (
    <div
      className="flex items-center gap-1 p-1 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-border)',
      }}
    >
      {options.map((option) => (
        <button
          key={String(option.value)}
          onClick={() => onChange(option.value)}
          className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
          style={{
            backgroundColor: value === option.value ? 'var(--color-accent-primary)' : 'transparent',
            color: value === option.value ? 'var(--color-surface)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            if (value !== option.value) {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (value !== option.value) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
