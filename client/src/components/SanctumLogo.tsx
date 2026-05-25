import { SanctumMark, type MarkSize } from './logo/SanctumMark';
import { SanctumWordmark } from './logo/SanctumWordmark';

type Size = MarkSize;

const gap: Record<Size, string> = {
  sm: 'gap-2',
  md: 'gap-2.5',
  lg: 'gap-3',
  hero: 'gap-4',
};

export function SanctumLogo({
  size = 'md',
  variant = 'light',
  showWordmark = true,
  centered = true,
  showTagline = false,
}: {
  size?: Size;
  /** light = fondo claro; dark = sobre verde oscuro */
  variant?: 'light' | 'dark';
  showWordmark?: boolean;
  centered?: boolean;
  /** Solo en hero / landing */
  showTagline?: boolean;
}) {
  const layout = centered
    ? `flex flex-col items-center ${gap[size]}`
    : `flex items-center ${gap[size]}`;

  return (
    <div className={layout} role="img" aria-label="Sanctum">
      <SanctumMark size={size} variant={variant} />
      {showWordmark && (
        <SanctumWordmark
          size={size}
          variant={variant}
          align={centered ? 'center' : 'start'}
          showTagline={showTagline && size === 'hero'}
        />
      )}
    </div>
  );
}
