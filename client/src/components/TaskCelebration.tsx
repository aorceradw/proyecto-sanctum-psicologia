import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { Icon } from './Icon';

interface TaskCelebrationProps {
  open: boolean;
  mode: 'single' | 'all';
  onClose: () => void;
}

const CONFETTI_COLORS = ['#fed488', '#9cd2b5', '#775a19', '#b8efd0', '#ffdea5', '#06402b'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.8 + Math.random() * 1.2,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            rotate: p.rotate,
          }}
          initial={{ y: -40, opacity: 1, scale: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            opacity: [1, 1, 0],
            rotate: p.rotate + 720,
            scale: [0, 1, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
}

export function TaskCelebration({ open, mode, onClose }: TaskCelebrationProps) {
  const isAll = mode === 'all';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/70 backdrop-blur-md"
            onClick={onClose}
          />

          {isAll && <Confetti />}

          <motion.div
            role="dialog"
            aria-labelledby="celebration-title"
            className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden ring-1 ring-outline-variant/20"
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 18, stiffness: 280 }}
          >
            <motion.div
              className="h-2 bg-gradient-to-r from-secondary via-secondary-container to-primary-fixed"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ transformOrigin: 'left' }}
            />

            <motion.div
              className="p-8 text-center"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            >
              <motion.div
                variants={{
                  hidden: { scale: 0, rotate: -180 },
                  visible: { scale: 1, rotate: 0 },
                }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary-fixed/50 flex items-center justify-center"
              >
                <motion.div
                  animate={isAll ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : { scale: [1, 1.08, 1] }}
                  transition={{ duration: 0.6, repeat: isAll ? 2 : 1 }}
                >
                  <Icon name={isAll ? 'emoji_events' : 'check_circle'} filled className="text-5xl text-secondary" />
                </motion.div>
              </motion.div>

              <motion.h2
                id="celebration-title"
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="font-display text-display text-primary mb-2"
              >
                {isAll ? '¡Felicidades!' : '¡Tarea completada!'}
              </motion.h2>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                className="text-on-surface-variant text-base mb-6"
              >
                {isAll
                  ? 'Has completado todas las tareas de esta semana. ¡Qué bien lo estás haciendo!'
                  : 'Muy bien. Sigue así, paso a paso.'}
              </motion.p>

              {isAll && (
                <motion.div
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                  className="flex justify-center gap-2 mb-6"
                >
                  {['star', 'favorite', 'verified'].map((icon, i) => (
                    <motion.span
                      key={icon}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.5, repeat: 2 }}
                    >
                      <Icon name={icon} filled className="text-2xl text-secondary" />
                    </motion.span>
                  ))}
                </motion.div>
              )}

              <motion.button
                type="button"
                onClick={onClose}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="btn-primary w-full py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isAll ? 'Continuar' : 'Genial'}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TaskCompleteToast({ show, message }: { show: boolean; message: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-20 lg:top-6 left-1/2 -translate-x-1/2 z-[150] px-5 py-3 rounded-xl bg-primary text-on-primary shadow-lg flex items-center gap-2"
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 350 }}
        >
          <Icon name="check_circle" filled />
          <span className="text-sm font-semibold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
