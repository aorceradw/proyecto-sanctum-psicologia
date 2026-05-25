import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { AnimatedPage } from '../../components/motion';

const techniques = [
  { id: '478', name: '4 · 7 · 8', pattern: 'Calma rápida', desc: 'Ideal para ansiedad.', inhale: 4, hold: 7, exhale: 8 },
  { id: 'box', name: 'Caja', pattern: '4 · 4 · 4', desc: 'Equilibrio.', inhale: 4, hold: 4, exhale: 4 },
  { id: 'calm', name: 'Suave', pattern: '4 · 2 · 6', desc: 'Relajación profunda.', inhale: 4, hold: 2, exhale: 6 },
];

type Phase = 'inhale' | 'hold' | 'exhale';

export function ClientBreathingPage() {
  const [active, setActive] = useState(techniques[0]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  const getDuration = (p: Phase, t: typeof active) =>
    p === 'inhale' ? t.inhale : p === 'hold' ? t.hold : t.exhale;

  const nextPhase = (p: Phase, t: typeof active): Phase => {
    if (p === 'inhale') return t.hold > 0 ? 'hold' : 'exhale';
    if (p === 'hold') return 'exhale';
    return 'inhale';
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        const t = activeRef.current;
        setPhase((p) => {
          const np = nextPhase(p, t);
          if (p === 'exhale') setCycles((cy) => cy + 1);
          setCount(getDuration(np, t));
          return np;
        });
        return c;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setPhase('inhale');
    setCount(active.inhale);
    setCycles(0);
  };

  const selectTechnique = (t: (typeof techniques)[0]) => {
    setActive(t);
    setRunning(false);
    setPhase('inhale');
    setCount(t.inhale);
    setCycles(0);
  };

  const labels = { inhale: 'Inhala', hold: 'Mantén', exhale: 'Exhala' };
  const scale = phase === 'inhale' ? 1.14 : phase === 'exhale' ? 0.9 : 1.08;

  return (
    <AnimatedPage>
      <PageHeader title="Espacio de calma" subtitle="Sigue el ritmo del círculo con calma." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {techniques.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTechnique(t)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                active.id === t.id
                  ? 'border-secondary bg-secondary-fixed/30 shadow-md'
                  : 'border-outline-variant/40 hover:border-secondary/30'
              }`}
            >
              <p className="font-semibold text-primary">{t.name}</p>
              <p className="text-xs text-secondary">{t.pattern}</p>
              <p className="text-sm text-on-surface-variant mt-1">{t.desc}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 card-glass p-10 flex flex-col items-center">
          <span className="badge-info mb-8">{active.name}</span>
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            <motion.div
              className="absolute inset-6 rounded-full bg-gradient-to-br from-primary-fixed/60 to-secondary-fixed/40"
              animate={{ scale: running ? scale : 1 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
            <div className="relative z-10 text-center">
              <p className="text-sm font-bold text-secondary uppercase tracking-widest">{labels[phase]}</p>
              <p className="text-7xl font-display font-bold text-primary tabular-nums mt-1">{count}</p>
              <p className="text-xs text-on-surface-variant mt-2">{cycles} ciclos</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setRunning(!running)} className="btn-primary px-8">
              <Icon name={running ? 'pause' : 'play_arrow'} />
              {running ? 'Pausar' : 'Comenzar'}
            </button>
            <button type="button" onClick={reset} className="btn-secondary">
              <Icon name="replay" />
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
