interface ProgressBarProps {
  percent: number;
  variant?: 'secondary' | 'primary' | 'error';
}

export function ProgressBar({ percent, variant = 'secondary' }: ProgressBarProps) {
  const fill =
    variant === 'error'
      ? 'bg-error'
      : variant === 'primary'
        ? 'bg-primary'
        : 'bg-secondary';

  return (
    <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
      <div className={`${fill} h-2 rounded-full transition-all`} style={{ width: `${percent}%` }} />
    </div>
  );
}
