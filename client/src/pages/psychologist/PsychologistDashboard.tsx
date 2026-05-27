import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/api';
import { InvitePanel } from '../../components/InvitePanel';
import { StatCard } from '../../components/StatCard';
import { Icon } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { AnimatedPage, AnimatedProgress, MotionCard, StaggerItem, StaggerList } from '../../components/motion';
import therapyImage from '../../assets/therapy-session.jpg';
import psychologistImage from '../../assets/psychologist.jpg';

interface DashboardData {
  inviteCode?: string | null;
  stats: { patientCount: number; pendingTasksTotal: number };
  cohortMetrics: Array<{ name: string; value: number; trend: number }>;
  appointments: Array<{
    id: string;
    patientId: string | null;
    date: string;
    time: string;
    period: string;
    patient: string;
    type: string;
    active: boolean;
  }>;
  alerts: Array<{
    patient: string;
    patientId?: string;
    level: string;
    text: string;
    action: string;
    severity: string;
  }>;
}

export function PsychologistDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);


  useEffect(() => {
    apiFetch<DashboardData>('/api/professional/dashboard')
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <p className="text-on-surface-variant p-8">Cargando panel...</p>;
  }

  return (
    <AnimatedPage>
      <PageHeader
        title="Panel"
        subtitle={`${data.stats.patientCount} pacientes · ${data.stats.pendingTasksTotal} tareas pendientes`}
        action={
          <Link to="/psicologo/pacientes" className="btn-primary text-sm">
            <Icon name="groups" />
            Ver pacientes
          </Link>
        }
      />

      {data.stats.patientCount === 0 && data.inviteCode && (
        <div className="mb-6">
          <InvitePanel inviteCode={data.inviteCode} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="groups" label="Pacientes" value={data.stats.patientCount} accent="primary" />
        <StatCard icon="checklist" label="Tareas pendientes" value={data.stats.pendingTasksTotal} accent="secondary" />
        <StatCard icon="event" label="Citas hoy" value={data.appointments.length} accent="success" />
        <StatCard icon="warning" label="Alertas" value={data.alerts.length} accent="secondary" />
      </div>

      <StaggerList className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <StaggerItem className="xl:col-span-8">
          <div className="card-clinical p-6">
            <h2 className="font-bold text-primary mb-6 flex items-center gap-2">
              <Icon name="analytics" className="text-secondary" />
              Actividad de la consulta
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.cohortMetrics.map((m) => (
                <MotionCard key={m.name} className="p-4 rounded-xl bg-surface-container">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase mb-2 truncate">
                    {m.name}
                  </p>
                  <p className="text-3xl font-bold text-primary mb-3">{m.value}%</p>
                  <AnimatedProgress percent={m.value} />
                </MotionCard>
              ))}
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="xl:col-span-4">
          <div className="card-clinical p-6 h-full">
            <h2 className="font-bold text-primary mb-4 flex items-center gap-2">
              <Icon name="warning" className="text-error" />
              Requieren atención
            </h2>
            {data.alerts.length === 0 ? (
              <p className="text-sm text-on-surface-variant">Todo al día por ahora.</p>
            ) : (
              <div className="space-y-3">
                {data.alerts.map((a) => (
                  <div
                    key={a.patientId || a.patient}
                    className={`p-3 rounded-lg border text-sm ${
                      a.severity === 'error'
                        ? 'bg-error-container/30 border-error/20'
                        : 'bg-warning-container/30 border-outline-variant/30'
                    }`}
                  >
                    <p className="font-semibold">{a.patient}</p>
                    <p className="text-on-surface-variant mt-1">{a.text}</p>
                    {a.patientId && (
                      <Link
                        to={`/psicologo/paciente/${a.patientId}`}
                        className="text-secondary font-semibold text-xs mt-2 inline-block hover:underline"
                      >
                        Ver expediente →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </StaggerItem>

        <StaggerItem className="xl:col-span-12">
          <div className="card-clinical p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-primary flex items-center gap-2">
                <Icon name="calendar_month" className="text-secondary" />
                Calendario de Citas Programadas
              </h2>
              <Link to="/psicologo/citas" className="text-sm text-secondary font-semibold hover:underline">
                Gestionar citas
              </Link>
            </div>
            {data.appointments.length === 0 ? (
              <p className="text-sm text-on-surface-variant">
                No hay citas próximas.{' '}
                <Link to="/psicologo/citas" className="text-secondary font-semibold hover:underline">
                  Programar una
                </Link>
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.appointments.map((apt) => {
                  const [y, m, d] = apt.date.split('-');
                  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
                  const isToday = apt.date === new Date().toISOString().split('T')[0];
                  return (
                    <div
                      key={apt.id}
                      className={`flex items-center gap-4 p-3 rounded-xl ${isToday ? 'bg-primary-container border border-primary/20' : 'bg-surface-container'}`}
                    >
                      <div className="text-center w-16 shrink-0 bg-surface rounded-lg p-2 shadow-sm">
                        <p className="text-xs font-bold text-secondary uppercase">{dateObj.toLocaleString('es-ES', { month: 'short' })}</p>
                        <p className="text-xl font-bold text-primary">{d}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-on-surface">{apt.patient}</p>
                          <p className="font-bold text-primary text-sm whitespace-nowrap">{apt.time}</p>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate mt-0.5">{apt.type}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </StaggerItem>

        <StaggerItem className="xl:col-span-12">
          <h2 className="font-bold text-primary mb-4 flex items-center gap-2">
            <Icon name="psychology" className="text-secondary" />
            Recursos para tu práctica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="overflow-hidden rounded-2xl border border-outline-variant/30 shadow-lg shadow-primary/10"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="h-56 overflow-hidden relative group">
                <img
                  src={therapyImage}
                  alt="Sesión de terapia"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
              </div>
              <div className="bg-surface-container p-5">
                <h3 className="font-semibold text-primary mb-2">Entorno clínico seguro</h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  Espacios virtuales diseñados con estándares de privacidad y confidencialidad clínica.
                </p>
                <Link to="/psicologo/pacientes" className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1">
                  Gestionar pacientes <Icon name="arrow_forward" className="text-xs" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="overflow-hidden rounded-2xl border border-outline-variant/30 shadow-lg shadow-secondary/10"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="h-56 overflow-hidden relative group">
                <img
                  src={psychologistImage}
                  alt="Atención profesional"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
              </div>
              <div className="bg-surface-container p-5">
                <h3 className="font-semibold text-primary mb-2">Seguimiento continuo</h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  Panel completo para monitoreo del progreso y bienestar de tus pacientes.
                </p>
                <Link to="/psicologo" className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1">
                  Ver panel <Icon name="arrow_forward" className="text-xs" />
                </Link>
              </div>
            </motion.div>
          </div>
        </StaggerItem>
      </StaggerList>
    </AnimatedPage>
  );
}
