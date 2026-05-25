import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { ASSETS } from '../theme/assets';

interface DashboardData {
  greeting: string;
  progress: Array<{
    id: string;
    label: string;
    icon: string;
    current: number;
    total: number;
    percent: number;
  }>;
  resources: Array<{
    type: string;
    title: string;
    description: string;
    duration?: string;
  }>;
  appointments?: Array<{
    id: string;
    date: string;
    time: string;
    period: string;
    title: string;
    active: boolean;
  }>;
}

export function SanctuaryHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/patient/dashboard')
      .then((r) => r.json())
      .then(setData)
      .catch(() =>
        setData({
          greeting: 'Elena',
          progress: [
            { id: 'sleep', label: 'Sueño (8h)', icon: 'bedtime', current: 4, total: 7, percent: 57 },
            { id: 'movement', label: 'Movimiento', icon: 'directions_run', current: 2, total: 3, percent: 66 },
            { id: 'mindfulness', label: 'Mindfulness', icon: 'self_improvement', current: 5, total: 7, percent: 71 },
          ],
          resources: [
            {
              type: 'audio',
              title: 'Respiración para la Ansiedad',
              description: 'Una guía suave para volver al momento presente cuando la mente se acelera.',
              duration: '10 min',
            },
            {
              type: 'article',
              title: 'Entendiendo tus Detonantes',
              description: 'Artículo de lectura rápida',
            },
          ],
        }),
      );
  }, []);

  if (!data) {
    return <div className="text-on-surface-variant font-body-md">Cargando tu santuario...</div>;
  }

  return (
    <>
      <section className="mb-stack-lg">
        <h2 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-2">
          Buenos días, {data.greeting}.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
          Tu santuario está listo. Tómate un momento para centrarte antes de comenzar el día.
        </p>
        <div className="bg-surface-container rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-outline-variant/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed/40 flex items-center justify-center overflow-hidden">
              <img alt="Sanctum" src={ASSETS.pegasus} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-h3 text-h3 text-primary">Ritual Matutino</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                5 minutos de atención plena para ti.
              </p>
            </div>
          </div>
          <Link
            to="/rituales"
            className="w-full md:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
          >
            Inicia tu registro
            <Icon name="arrow_forward" />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 flex flex-col gap-stack-md">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/cartografia"
              className="bg-surface-container-highest rounded-2xl p-6 border border-outline-variant/10 hover:bg-surface-variant/50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <Icon name="stylus_note" className="text-primary text-3xl group-hover:scale-110 transition-transform" />
                <Icon name="add" className="text-outline" />
              </div>
              <h3 className="font-h3 text-h3 text-primary mb-1">Registro de Pensamientos</h3>
              <p className="font-caption text-caption text-on-surface-variant">
                Captura y analiza tus ideas en el momento.
              </p>
            </Link>
            <Link
              to="/cartografia"
              className="bg-surface-container-highest rounded-2xl p-6 border border-outline-variant/10 hover:bg-surface-variant/50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <Icon name="mood" className="text-secondary text-3xl group-hover:scale-110 transition-transform" />
                <Icon name="add" className="text-outline" />
              </div>
              <h3 className="font-h3 text-h3 text-primary mb-1">Mapeo Emocional</h3>
              <p className="font-caption text-caption text-on-surface-variant">
                Registra cómo te sientes ahora mismo.
              </p>
            </Link>
          </section>

          <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-primary">Progreso Semanal</h3>
              <button type="button" className="text-secondary font-label-md text-label-md hover:underline">
                Ver detalles
              </button>
            </div>
            <div className="space-y-6">
              {data.progress.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-label-md text-label-md text-on-surface flex items-center gap-2">
                      <Icon name={item.icon} className="text-lg text-primary" />
                      {item.label}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      {item.current}/{item.total} {item.id === 'movement' ? 'sesiones' : 'días'}
                    </span>
                  </div>
                  <ProgressBar percent={item.percent} />
                </div>
              ))}
            </div>
          </section>

          {data.appointments && data.appointments.length > 0 && (
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h3 text-h3 text-primary">Calendario de Citas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <p className="font-bold text-primary text-sm whitespace-nowrap">{apt.time}</p>
                        <p className="font-semibold text-on-surface truncate">{apt.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-1">
          <section className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-primary">Para Ti Hoy</h3>
              <button type="button" className="text-on-surface-variant hover:text-primary">
                <Icon name="more_horiz" />
              </button>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {data.resources.map((res, i) => (
                <div key={res.title}>
                  {i > 0 && <div className="h-px w-full bg-outline-variant/20 my-2" />}
                  {res.type === 'audio' ? (
                    <div className="group cursor-pointer">
                      <div className="h-32 w-full rounded-xl bg-surface-variant mb-3 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="absolute bottom-2 left-2 text-white font-caption text-caption px-2 py-1 bg-black/30 rounded-md backdrop-blur-sm">
                          Audio • {res.duration}
                        </span>
                      </div>
                      <h4 className="font-label-md text-label-md text-primary mb-1 group-hover:text-secondary transition-colors">
                        {res.title}
                      </h4>
                      <p className="font-caption text-caption text-on-surface-variant line-clamp-2">
                        {res.description}
                      </p>
                    </div>
                  ) : (
                    <div className="group cursor-pointer flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
                        <Icon name="menu_book" className="text-secondary text-2xl" />
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md text-primary mb-1 group-hover:text-secondary transition-colors">
                          {res.title}
                        </h4>
                        <p className="font-caption text-caption text-on-surface-variant">{res.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="w-full mt-6 py-2 px-4 border border-secondary text-secondary rounded-xl font-label-md text-label-md hover:bg-secondary/5 transition-colors"
            >
              Explorar Biblioteca
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
