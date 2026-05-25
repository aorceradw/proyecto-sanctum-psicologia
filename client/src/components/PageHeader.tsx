import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  badge?: string;
}

export function PageHeader({ title, subtitle, action, badge }: PageHeaderProps) {
  return (
    <motion.header
      className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div>
        {badge && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-fixed/50 text-secondary mb-3">
            {badge}
          </span>
        )}
        <h1 className="text-display font-display text-primary">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-on-surface-variant text-base max-w-xl leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.header>
  );
}
