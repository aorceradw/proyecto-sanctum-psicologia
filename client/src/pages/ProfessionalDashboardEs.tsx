import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { ASSETS } from '../theme/assets';

interface DashboardApi {
  cohortMetrics: Array<{ name: string; value: number; trend: number }>;
  appointments: Array<{
    time: string;
    period: string;
    patient: string;
    type: string;
    active: boolean;
  }>;
  alerts: Array<{
    patient: string;
    level: string;
    text: string;
    action: string;
    severity: string;
  }>;
}

export function ProfessionalDashboardEs() {
  const [data, setData] = useState<DashboardApi | null>(null);

  useEffect(() => {
    fetch('/api/professional/dashboard')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return <p className="text-on-surface-variant">Cargando panel clínico...</p>;
  }

  return (
    <>
      <header className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-h1 text-h1-mobile md:text-h1 text-primary mb-2">Panel Clínico</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Resumen general y prioridades del día.
          </p>
        </div>
        <p className="font-label-md text-label-md text-secondary">Martes, 24 de Octubre</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <section className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-h3 text-h3 text-primary">Analíticas de Cohorte</h3>
            <button type="button" className="text-secondary hover:text-primary text-sm font-label-md flex items-center gap-1">
              Ver Detalles <Icon name="arrow_forward" className="text-[16px]" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
            {data.cohortMetrics.map((m) => (
              <div key={m.name} className="p-4 rounded-lg bg-surface-container border border-outline-variant/10">
                <p className="font-caption text-caption text-on-surface-variant mb-1 uppercase tracking-wider">
                  {m.name}
                </p>
                <div className="flex items-end gap-2">
                  <span className="font-h2 text-h2 text-primary">{m.value}%</span>
                  <span
                    className={`font-caption text-caption flex items-center ${
                      m.trend >= 0 ? 'text-secondary' : 'text-error'
                    }`}
                  >
                    <Icon name={m.trend >= 0 ? 'trending_up' : 'trending_down'} className="text-[14px]" />
                    {m.trend > 0 ? '+' : ''}
                    {m.trend}%
                  </span>
                </div>
                <ProgressBar percent={m.value} variant={m.trend < 0 ? 'primary' : 'secondary'} />
              </div>
            ))}
          </div>
        </section>

        <section className="md:col-span-4 md:row-span-2 bg-error-container/30 rounded-xl p-6 border border-error/10 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="notification_important" className="text-error" />
            <h3 className="font-h3 text-h3 text-on-error-container">Prioridad Clínica</h3>
          </div>
          <div className="flex flex-col gap-4 flex-grow">
            {data.alerts.map((alert) => (
              <div
                key={alert.patient}
                className={`bg-surface-container-lowest p-4 rounded-lg border-l-4 shadow-sm ${
                  alert.severity === 'error' ? 'border-error' : 'border-secondary'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-md text-label-md text-on-background">{alert.patient}</span>
                  <span
                    className={`font-caption text-caption px-2 py-0.5 rounded text-[10px] uppercase ${
                      alert.severity === 'error'
                        ? 'bg-error/10 text-error'
                        : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    {alert.level}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">{alert.text}</p>
                <Link
                  to="/profesional/paciente/elena-m"
                  className={`mt-3 font-label-md text-sm hover:underline inline-block ${
                    alert.severity === 'error' ? 'text-error' : 'text-secondary'
                  }`}
                >
                  {alert.action}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-h3 text-h3 text-primary">Citas de Hoy</h3>
            <span className="bg-surface-container py-1 px-3 rounded-full font-label-md text-label-md text-on-surface-variant text-xs">
              {data.appointments.length} Sesiones
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {data.appointments.map((apt) => (
              <div
                key={apt.patient + apt.time}
                className={`flex items-center p-4 rounded-lg transition-colors border group ${
                  apt.active
                    ? 'bg-primary-fixed/10 border-primary-fixed/30'
                    : 'hover:bg-surface-container-low border-transparent hover:border-outline-variant/20 opacity-90'
                }`}
              >
                <div
                  className={`flex flex-col items-center justify-center w-16 border-r pr-4 mr-4 relative ${
                    apt.active ? 'border-primary/20' : 'border-outline-variant/20'
                  }`}
                >
                  {apt.active && (
                    <div className="absolute -left-2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                  <span className={`font-label-md text-label-md ${apt.active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                    {apt.time}
                  </span>
                  <span className="font-caption text-caption text-[10px]">{apt.period}</span>
                </div>
                <div className="flex-grow">
                  <h4 className={`font-label-md text-label-md text-on-background text-base ${apt.active ? 'font-bold' : ''}`}>
                    {apt.patient}
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{apt.type}</p>
                </div>
                <div className={apt.active ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'}>
                  {apt.active ? (
                    <button type="button" className="bg-primary text-on-primary rounded-lg px-4 py-2 font-label-md text-sm hover:bg-primary-container">
                      Unirse
                    </button>
                  ) : (
                    <Link
                      to="/profesional/paciente/elena-m"
                      className="text-secondary border border-secondary/30 rounded-lg px-4 py-2 font-label-md hover:bg-secondary/5 text-sm inline-block"
                    >
                      Ver Perfil
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="hidden md:block mt-8">
        <img alt="Sanctum" src={ASSETS.wordmark} className="h-6 opacity-60" />
      </div>
    </>
  );
}
