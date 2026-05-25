import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { ASSETS } from '../theme/assets';

export function ProfessionalDashboardEn() {
  const [metrics, setMetrics] = useState([
    { label: 'Cognitive Restructuring', value: 68, trend: 4 },
    { label: 'Behavioral Activation', value: 82, trend: 12 },
    { label: 'Task Adherence', value: 45, trend: -2 },
  ]);

  useEffect(() => {
    fetch('/api/professional/dashboard')
      .then((r) => r.json())
      .then((d) => {
        if (d.cohortMetrics) {
          setMetrics(
            d.cohortMetrics.map((m: { label?: string; name: string; value: number; trend: number }) => ({
              label: m.label || m.name,
              value: m.value,
              trend: m.trend,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="mb-stack-lg hidden md:flex justify-between items-end">
        <div>
          <h1 className="text-h1 font-h1 text-primary mb-2">Dashboard</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Clinical overview and daily priorities.
          </p>
        </div>
        <div className="flex gap-4">
          <button type="button" className="p-2 rounded-full border border-outline-variant text-on-surface hover:bg-surface-variant">
            <Icon name="notifications" />
          </button>
          <img alt="Profile" src={ASSETS.profileDoctor} className="h-10 w-10 rounded-full object-cover border border-outline-variant" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <section className="lg:col-span-8 flex flex-col gap-gutter">
          <h2 className="text-h3 font-h3 text-primary mb-2">Cohort Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/50 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                  <Icon name="psychology" className="text-6xl text-primary" />
                </div>
                <h3 className="text-label-md font-label-md text-on-surface-variant mb-4 uppercase tracking-wider">
                  {m.label}
                </h3>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-h1 font-h1 text-primary">{m.value}%</span>
                  <span className={`text-caption font-caption flex items-center mb-2 ${m.trend >= 0 ? 'text-secondary' : 'text-error'}`}>
                    <Icon name={m.trend >= 0 ? 'trending_up' : 'trending_down'} className="text-sm" />
                    {m.trend > 0 ? '+' : ''}
                    {m.trend}%
                  </span>
                </div>
                <ProgressBar percent={m.value} variant={m.trend < 0 ? 'primary' : 'secondary'} />
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-4 bg-surface-container-low rounded-xl p-stack-md border border-outline-variant">
          <h2 className="text-h3 font-h3 text-primary mb-stack-md">Today&apos;s Schedule</h2>
          <div className="flex flex-col gap-4">
            {[
              { time: '09:00 AM', name: 'Ana S.', note: 'CBT Session 4' },
              { time: '11:30 AM', name: 'Luis F.', note: 'GAD Follow-up', active: true },
            ].map((apt) => (
              <div
                key={apt.name}
                className={`p-4 rounded-lg border ${apt.active ? 'bg-primary-fixed/10 border-primary-fixed/30' : 'border-outline-variant/30'}`}
              >
                <span className="text-caption font-caption text-secondary">{apt.time}</span>
                <h4 className="text-label-md font-label-md text-primary">{apt.name}</h4>
                <p className="text-caption font-caption text-on-surface-variant">{apt.note}</p>
              </div>
            ))}
          </div>
          <Link
            to="/profesional/paciente/elena-m"
            className="mt-6 w-full block text-center py-3 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container"
          >
            View Patient Elena M.
          </Link>
        </section>
      </div>
    </>
  );
}
