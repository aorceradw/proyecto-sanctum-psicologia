import { useId } from 'react';

type MarkVariant = 'light' | 'dark';

const markSizes = {
  sm: 'h-11 w-11',
  md: 'h-14 w-14',
  lg: 'h-[4.5rem] w-[4.5rem]',
  hero: 'h-20 w-20 md:h-24 md:w-24',
} as const;

export type MarkSize = keyof typeof markSizes;

export function SanctumMark({
  size = 'md',
  variant = 'light',
  className = '',
}: {
  size?: MarkSize;
  variant?: MarkVariant;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const dark = variant === 'dark';

  const body = dark ? '#f8fffb' : '#002819';
  const wingLight = dark ? '#d4f5e4' : '#b8efd0';
  const wingDark = dark ? '#5a9a75' : '#06402b';
  const accent = dark ? '#ffdea5' : '#a67c00';
  const aura = dark ? 'rgba(184,239,208,0.35)' : 'rgba(156,210,181,0.45)';

  return (
    <div
      className={`relative shrink-0 ${markSizes[size]} ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-[8%] rounded-full blur-lg"
        style={{ background: aura }}
      />
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative h-full w-full drop-shadow-md"
      >
        <defs>
          <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="80" y2="80">
            <stop stopColor={dark ? '#77ac90' : '#9cd2b5'} />
            <stop offset="1" stopColor={dark ? '#06402b' : '#06402b'} />
          </linearGradient>
          <linearGradient id={`${uid}-wing`} x1="16" y1="12" x2="64" y2="44">
            <stop stopColor={wingLight} />
            <stop offset="1" stopColor={wingDark} />
          </linearGradient>
        </defs>

        <circle cx="40" cy="40" r="36" fill={dark ? '#033d28' : '#f0faf4'} />
        <circle cx="40" cy="40" r="36" stroke={`url(#${uid}-ring)`} strokeWidth="2" fill="none" />

        <path
          d="M14 36c-8-10-4-24 10-26 5 6 8 14 6 22-5 2-11 3-16 4zM66 36c8-10 4-24-10-26-5 6-8 14-6 22 5 2 11 3 16 4z"
          fill={`url(#${uid}-wing)`}
        />

        <path
          d="M48 62c10-3 16-12 16-23 0-8-5-14-12-16 3-8 1-16-6-20-6-4-14-2-18 4-3 5-2 11 2 16-9 4-14 13-14 23 0 9 6 16 14 18 3 1 7 1 10-1 4-2 6-6 10-1z"
          fill={body}
        />

        <path
          d="M28 30c-3-6 1-13 9-14 5-1 10 3 11 8"
          stroke={accent}
          strokeWidth="1.75"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="35" cy="33" r="2" fill={accent} />

        <path
          d="M24 34c-5 3-7 10-5 16M26 28c-6 1-11 7-11 14"
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.75"
        />

        <path
          d="M33 56v7M41 54v9M49 56v6"
          stroke={body}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path d="M54 16l4 4-4 4-4-4 4-4z" fill={accent} />
      </svg>
    </div>
  );
}
