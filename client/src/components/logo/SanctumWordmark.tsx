import type { MarkSize } from './SanctumMark';

const titleSize: Record<MarkSize, string> = {
  sm: 'text-[1.35rem] leading-none',
  md: 'text-[1.65rem] leading-none',
  lg: 'text-[2.1rem] leading-none',
  hero: 'text-[2.75rem] md:text-[3.25rem] leading-none',
};

const tagSize: Record<MarkSize, string> = {
  sm: 'text-[0.6rem]',
  md: 'text-[0.65rem]',
  lg: 'text-xs',
  hero: 'text-xs md:text-sm',
};

export function SanctumWordmark({
  size = 'md',
  variant = 'light',
  showTagline = false,
  align = 'center',
}: {
  size?: MarkSize;
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  align?: 'center' | 'start';
}) {
  const dark = variant === 'dark';
  const items = align === 'start' ? 'items-start' : 'items-center';
  const text = align === 'start' ? 'text-left' : 'text-center';

  return (
    <div className={`flex flex-col gap-1 ${items} ${text}`}>
      <span
        className={`font-serif font-bold tracking-[-0.03em] ${titleSize[size]} ${
          dark ? 'text-white' : 'text-primary'
        }`}
      >
        Sanctum
      </span>
      <span
        className={`font-sans font-semibold uppercase tracking-[0.28em] ${tagSize[size]} ${
          dark ? 'text-primary-fixed/75' : 'text-secondary'
        }`}
        aria-hidden
      >
        bienestar
      </span>
      {showTagline && (
        <p
          className={`mt-1 max-w-[14rem] font-sans text-sm font-normal leading-snug ${
            dark ? 'text-white/70' : 'text-on-surface-variant'
          }`}
        >
          Tu santuario digital
        </p>
      )}
    </div>
  );
}
