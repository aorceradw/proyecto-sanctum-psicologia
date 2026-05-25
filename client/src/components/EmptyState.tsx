import type { ReactNode } from 'react';
import { Icon } from './Icon';

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card-clinical p-10 text-center">
      <Icon name={icon} className="text-5xl text-on-surface-variant/50 mx-auto mb-4" />
      <h3 className="font-semibold text-primary text-lg">{title}</h3>
      {description && <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
