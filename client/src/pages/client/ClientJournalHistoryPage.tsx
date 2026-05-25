import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/api';
import { EmptyState } from '../../components/EmptyState';
import { PageHeader } from '../../components/PageHeader';
import { PageLoader } from '../../components/LoadingSkeleton';
import { AnimatedPage } from '../../components/motion';
import { Icon } from '../../components/Icon';

interface Entry {
  id: string;
  date: string;
  situation?: string;
  thought?: string;
  emotion?: string;
  reframe?: string;
}

export function ClientJournalHistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ entries: Entry[] }>('/api/patient/journal')
      .then((d) => setEntries(d.entries))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <AnimatedPage>
      <PageHeader
        title="Historial del diario"
        subtitle="Todas tus entradas guardadas"
        action={
          <Link to="/cliente/registro" className="btn-primary text-sm">
            <Icon name="add" />
            Nueva entrada
          </Link>
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          icon="edit_note"
          title="Aún no has escrito"
          description="Tu primera entrada te ayudará a preparar la próxima sesión."
          action={
            <Link to="/cliente/registro" className="btn-primary">
              Escribir ahora
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {entries.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-clinical overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-surface-container/50 transition-colors"
              >
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">{e.date}</p>
                  <p className="font-semibold text-primary mt-1 line-clamp-1">
                    {e.thought || e.situation || e.emotion || 'Entrada sin título'}
                  </p>
                </div>
                <Icon name={expanded === e.id ? 'expand_less' : 'expand_more'} />
              </button>
              {expanded === e.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-5 pt-0 space-y-3 border-t border-outline-variant/20"
                >
                  {e.situation && (
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase mb-1">Lo que pasó</p>
                      <p className="text-sm text-on-surface">{e.situation}</p>
                    </div>
                  )}
                  {e.thought && (
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase mb-1">Lo que pensé</p>
                      <p className="text-sm text-on-surface italic">{e.thought}</p>
                    </div>
                  )}
                  {e.emotion && (
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase mb-1">Cómo me sentí</p>
                      <p className="text-sm text-on-surface">{e.emotion}</p>
                    </div>
                  )}
                  {e.reframe && (
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase mb-1">Otra mirada</p>
                      <p className="text-sm text-on-surface">{e.reframe}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}
