import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/api';
import { Icon } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { PageLoader } from '../../components/LoadingSkeleton';
import { AnimatedPage, AnimatedProgress, MotionCard, StaggerItem, StaggerList } from '../../components/motion';
import Chatbot from '../../components/Chatbot';

interface Dashboard {
  greeting: string;
  nextSession?: string;
  therapist?: string;
  progress: Array<{ id: string; label: string; percent: number }>;
  tasksDue: number;
  recentTasks: Array<{ id: string; title: string; type: string; done: boolean }>;
}

export function ClientHomePage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    apiFetch<Dashboard>('/api/patient/dashboard')
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return <PageLoader />;

  const quickActions = [
    { to: '/cliente/registro', icon: 'edit_note', title: 'Diario', desc: 'Escribe con calma', grad: 'from-primary-fixed/50 to-primary-fixed/10' },
    { to: '/cliente/estado', icon: 'monitoring', title: 'Ánimo', desc: 'Check-in de hoy', grad: 'from-secondary-fixed/60 to-secondary-container/20' },
    { to: '/cliente/tareas', icon: 'checklist', title: 'Tareas', desc: `${data.tasksDue} pendientes`, grad: 'from-secondary-container/50 to-surface-container' },
    { to: '/cliente/respiracion', icon: 'air', title: 'Calma', desc: 'Respiración guiada', grad: 'from-primary-container/20 to-primary-fixed/10' },
  ];

  return (
    <AnimatedPage>
      <motion.div
        className="hero-gradient rounded-3xl p-6 md:p-8 mb-8 text-on-primary relative overflow-hidden shadow-xl shadow-primary/20"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary-container/20 rounded-full blur-2xl" />
        <p className="text-on-primary-container text-sm font-medium mb-1">Acceso a tu cuenta</p>
        <h1 className="font-display text-3xl md:text-4xl mb-2">Hola, {data.greeting}</h1>
        <p className="text-on-primary-container/90 text-sm max-w-md">
          Tu espacio entre sesiones con <strong className="text-secondary-container">{data.therapist}</strong>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/cliente/tareas"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-semibold backdrop-blur-sm transition-colors"
          >
            <Icon name="checklist" />
            Ver tareas
          </Link>
          <Link
            to="/cliente/respiracion"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-container text-on-secondary-container text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Icon name="air" />
            Respirar
          </Link>
        </div>
      </motion.div>

      <StaggerList className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <StaggerItem className="lg:col-span-2">
          <MotionCard className="card-clinical p-6 border-l-4 border-l-secondary">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
                  Próxima sesión
                </p>
                <p className="text-xl font-bold text-primary">{data.nextSession}</p>
              </div>
              <Link to="/cliente/registro" className="btn-primary shrink-0">
                <Icon name="edit_note" />
                Preparar sesión
              </Link>
            </div>
          </MotionCard>
        </StaggerItem>

        <StaggerItem>
          {data.recentTasks.length > 0 ? (
            <div className="card-clinical p-5 h-full">
              <p className="text-xs font-bold text-on-surface-variant uppercase mb-3">Tareas recientes</p>
              <ul className="space-y-2">
                {data.recentTasks.slice(0, 3).map((t) => (
                  <li key={t.id} className="flex items-start gap-2 text-sm">
                    <Icon
                      name={t.done ? 'check_circle' : 'radio_button_unchecked'}
                      className={`shrink-0 mt-0.5 ${t.done ? 'text-success' : 'text-secondary'}`}
                    />
                    <span className={t.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}>
                      {t.title}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/cliente/tareas" className="text-xs text-secondary font-semibold mt-3 inline-block hover:underline">
                Ver todas →
              </Link>
            </div>
          ) : (
            <div className="card-clinical p-5 h-full flex flex-col justify-center text-center">
              <Icon name="checklist" className="text-3xl text-on-surface-variant/40 mx-auto mb-2" />
              <p className="text-sm text-on-surface-variant">Sin tareas aún</p>
            </div>
          )}
        </StaggerItem>
      </StaggerList>

      <PageHeader title="Accesos rápidos" subtitle="Un toque para lo que necesitas hoy" />

      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {quickActions.map((a) => (
          <StaggerItem key={a.to}>
            <Link to={a.to}>
              <MotionCard className={`card-clinical-hover p-5 h-full bg-gradient-to-br ${a.grad}`}>
                <Icon name={a.icon} className="text-3xl text-primary mb-3" />
                <h3 className="font-semibold text-primary">{a.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1">{a.desc}</p>
              </MotionCard>
            </Link>
          </StaggerItem>
        ))}
      </StaggerList>

      <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wide mb-4">Tu progreso esta semana</h2>
      <div className="card-glass p-6 space-y-5">
        {data.progress.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{p.label}</span>
              <span className="text-secondary font-bold tabular-nums">{p.percent}%</span>
            </div>
            <AnimatedProgress percent={p.percent} />
          </motion.div>
        ))}
      </div>

      {/* Chat FAB Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="chat-fab"
          aria-label="Open AI assistant"
        >
          <Icon name="sparkles" />
        </button>
      )}

      {/* Chatbot Component */}
      <Chatbot
        userRole="patient"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </AnimatedPage>
  );
}
