import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { ASSETS } from '../theme/assets';

const techniques = [
  {
    name: 'Respiración de Caja',
    pattern: '4-4-4-4',
    desc: 'Equilibra el sistema nervioso y mejora la concentración.',
    active: true,
  },
  {
    name: '4-7-8 para el Sueño',
    pattern: '4-7-8',
    desc: 'Calma el sistema nervioso simpático, ideal para dormir.',
    active: false,
  },
  {
    name: 'Respiración Abdominal',
    pattern: 'Libre',
    desc: 'Reduce la ansiedad estimulando el nervio vago.',
    active: false,
  },
];

export function RitualsPage() {
  const [phase, setPhase] = useState<'Inhala' | 'Mantén' | 'Exhala'>('Inhala');
  const [count, setCount] = useState(4);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState({ streak: 3, totalMinutes: 45, dailyGoalPercent: 60 });

  useEffect(() => {
    fetch('/api/rituals/progress')
      .then((r) => r.json())
      .then(setProgress)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhase((p) => (p === 'Inhala' ? 'Mantén' : p === 'Mantén' ? 'Exhala' : 'Inhala'));
          return 4;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div className="space-y-stack-lg">
      <section className="text-center md:text-left">
        <img alt="Sanctum" src={ASSETS.wordmark} className="h-10 w-auto mb-6 object-contain hidden md:block" />
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-4">
          Rituales de Respiración
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Encuentra tu centro. Prácticas diseñadas para regular tu sistema nervioso y cultivar presencia.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden shadow-sm">
          <div className="absolute top-6 left-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-low text-primary font-label-md text-label-md border border-outline-variant/20">
              Activo: Respiración de Caja
            </span>
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center my-12">
            <div className="absolute inset-0 rounded-full bg-primary-fixed-dim/20 pulse-circle" />
            <div
              className="absolute inset-4 rounded-full bg-primary-fixed-dim/40 pulse-circle"
              style={{ animationDelay: '0.5s' }}
            />
            <div className="absolute inset-8 rounded-full bg-primary-container z-10 flex flex-col items-center justify-center text-on-primary shadow-lg">
              <span className="font-h3 text-h3 mb-1">{phase}</span>
              <span className="font-h2 text-h2 font-light">{count}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 mt-8">
            <button
              type="button"
              onClick={() => {
                setCount(4);
                setPhase('Inhala');
              }}
              className="w-12 h-12 rounded-full border border-secondary text-primary flex items-center justify-center hover:bg-secondary-container/10"
            >
              <Icon name="replay" />
            </button>
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              className="px-8 py-3 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container shadow-sm"
            >
              {paused ? 'Reanudar' : 'Pausar'}
            </button>
            <button
              type="button"
              className="w-12 h-12 rounded-full border border-outline-variant text-on-surface-variant flex items-center justify-center hover:bg-surface-container-low"
            >
              <Icon name="settings" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-sm">
            <h3 className="font-h3 text-h3 text-primary mb-6 flex items-center">
              <Icon name="monitoring" className="mr-2" /> Progreso
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-container p-4 rounded-lg">
                <span className="block font-caption text-caption text-on-surface-variant mb-1">Racha Actual</span>
                <span className="font-h2 text-h2 text-primary">
                  {progress.streak} <span className="font-body-md text-body-md ml-1">días</span>
                </span>
              </div>
              <div className="bg-surface-container p-4 rounded-lg">
                <span className="block font-caption text-caption text-on-surface-variant mb-1">Minutos Totales</span>
                <span className="font-h2 text-h2 text-primary">
                  {progress.totalMinutes} <span className="font-body-md text-body-md ml-1">min</span>
                </span>
              </div>
            </div>
            <ProgressBar percent={progress.dailyGoalPercent} />
            <p className="font-caption text-caption text-on-surface-variant text-right mt-2">Meta diaria: 10 min</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-sm flex-1">
            <h3 className="font-h3 text-h3 text-primary mb-6">Técnicas</h3>
            <div className="flex flex-col space-y-4">
              {techniques.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  className={`text-left group p-4 rounded-lg border transition-all ${
                    t.active
                      ? 'border-secondary bg-surface-container-low'
                      : 'border-transparent hover:border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4
                      className={`font-label-md text-label-md ${
                        t.active ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      {t.name}
                    </h4>
                    <span className={`font-caption text-caption ${t.active ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {t.pattern}
                    </span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
