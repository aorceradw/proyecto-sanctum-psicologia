import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from './Icon';

type Phase = 'inhale' | 'hold' | 'exhale';
type Mode = '478' | 'grounding';

const PHASE_478: { phase: Phase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4, label: 'Inhala' },
  { phase: 'hold', duration: 7, label: 'Mantén' },
  { phase: 'exhale', duration: 8, label: 'Exhala' },
];

interface PanicBreathingModalProps {
  open: boolean;
  onClose: () => void;
}

export function PanicBreathingModal({ open, onClose }: PanicBreathingModalProps) {
  const [mode, setMode] = useState<Mode>('478');
  const [stepIndex, setStepIndex] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [running, setRunning] = useState(true);

  const current = PHASE_478[stepIndex];

  const advance = useCallback(() => {
    setStepIndex((i) => (i + 1) % PHASE_478.length);
    setCountdown(PHASE_478[(stepIndex + 1) % PHASE_478.length].duration);
  }, [stepIndex]);

  useEffect(() => {
    if (!open || !running || mode !== '478') return;
    setCountdown(current.duration);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          advance();
          return PHASE_478[(stepIndex + 1) % PHASE_478.length].duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [open, running, mode, stepIndex, current.duration, advance]);

  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setCountdown(4);
      setRunning(true);
      setMode('478');
    }
  }, [open]);

  const groundingSteps = [
    { n: 5, sense: 'cosas que puedes VER', icon: 'visibility' },
    { n: 4, sense: 'cosas que puedes TOCAR', icon: 'back_hand' },
    { n: 3, sense: 'cosas que puedes OÍR', icon: 'hearing' },
    { n: 2, sense: 'cosas que puedes OLER', icon: 'air' },
    { n: 1, sense: 'cosa que puedes SABOREAR', icon: 'restaurant' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-clinical-950/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-labelledby="panic-title"
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="bg-panic px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse-ring">
                  <Icon name="emergency" className="text-2xl" />
                </div>
                <div>
                  <h2 id="panic-title" className="font-bold text-lg">
                    Respira con calma
                  </h2>
                  <p className="text-sm text-white/85">Sigue el ritmo o prueba el ejercicio 5-4-3-2-1</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10"
                aria-label="Cerrar"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="flex border-b border-clinical-200">
              {(['478', 'grounding'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    mode === m
                      ? 'text-accent border-b-2 border-accent bg-accent-light/30'
                      : 'text-clinical-500 hover:bg-clinical-50'
                  }`}
                >
                  {m === '478' ? 'Respiración 4-7-8' : 'Anclaje 5-4-3-2-1'}
                </button>
              ))}
            </div>

            <div className="p-8">
              {mode === '478' ? (
                <div className="flex flex-col items-center">
                  <p className="text-sm text-clinical-600 text-center mb-6">
                    Esta técnica activa el sistema parasimpático. Sigue el ritmo en pantalla.
                  </p>
                  <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-panic-light border-2 border-panic/20"
                      animate={{
                        scale: current.phase === 'inhale' ? 1.15 : current.phase === 'exhale' ? 0.92 : 1.05,
                      }}
                      transition={{ duration: current.duration, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="absolute inset-4 rounded-full bg-accent/10 border border-accent/30"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative z-10 text-center">
                      <p className="text-sm font-semibold text-clinical-500 uppercase tracking-wider">
                        {current.label}
                      </p>
                      <p className="text-5xl font-bold text-clinical-900 tabular-nums">{countdown}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRunning(!running)}
                      className="btn-secondary"
                    >
                      <Icon name={running ? 'pause' : 'play_arrow'} />
                      {running ? 'Pausar' : 'Continuar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStepIndex(0);
                        setCountdown(4);
                      }}
                      className="btn-secondary"
                    >
                      <Icon name="replay" />
                      Reiniciar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-clinical-600 mb-4">
                    Nombra en voz alta cada elemento. Esto interrumpe la espiral de ansiedad.
                  </p>
                  {groundingSteps.map((g, i) => (
                    <motion.div
                      key={g.n}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-clinical-50 border border-clinical-200"
                    >
                      <span className="w-10 h-10 rounded-lg bg-accent text-white font-bold flex items-center justify-center shrink-0">
                        {g.n}
                      </span>
                      <div className="flex items-center gap-2">
                        <Icon name={g.icon} className="text-accent" />
                        <span className="text-sm font-medium text-clinical-800">{g.sense}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-clinical-50 border-t border-clinical-200 flex justify-between items-center">
              <p className="text-xs text-clinical-500">
                Si el malestar persiste, contacta a tu terapeuta o servicios de emergencia.
              </p>
              <button type="button" onClick={onClose} className="btn-primary text-sm py-2">
                Me siento mejor
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
