import { motion } from 'framer-motion';
import { Icon } from './Icon';

export function StatCard({
  icon,
  label,
  value,
  accent = 'primary',
}: {
  icon: string;
  label: string;
  value: string | number;
  accent?: 'primary' | 'secondary' | 'success';
}) {
  const colors = {
    primary: 'from-primary/10 to-primary-fixed/20 border-primary/20 text-primary',
    secondary: 'from-secondary-fixed/40 to-secondary-container/30 border-secondary/30 text-secondary',
    success: 'from-primary-fixed/30 to-success-light/30 border-success/20 text-success',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`card-clinical p-5 bg-gradient-to-br ${colors[accent]} border`}
    >
      <Icon name={icon} className="text-2xl mb-3 opacity-80" />
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-on-surface-variant mt-1 font-medium">{label}</p>
    </motion.div>
  );
}
