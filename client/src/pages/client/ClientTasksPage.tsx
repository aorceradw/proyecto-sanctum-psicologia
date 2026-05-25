import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { Icon } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { TaskCelebration, TaskCompleteToast } from '../../components/TaskCelebration';
import { AnimatedPage, StaggerItem, StaggerList } from '../../components/motion';

interface Task {
  id: string;
  title: string;
  type: string;
  due: string;
  done: boolean;
  protocol: string;
}

export function ClientTasksPage() {
  const { toast: notify } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [celebration, setCelebration] = useState<{ open: boolean; mode: 'single' | 'all' }>({
    open: false,
    mode: 'single',
  });
  const [toast, setToast] = useState(false);
  const prevAllDone = useRef(false);

  useEffect(() => {
    apiFetch<{ tasks: Task[] }>('/api/patient/tasks')
      .then((d) => {
        setTasks(d.tasks);
        prevAllDone.current = d.tasks.length > 0 && d.tasks.every((t) => t.done);
      })
      .catch(() => setTasks([]));
  }, []);

  const toggle = async (id: string) => {
    const task = tasks.find((x) => x.id === id);
    if (!task) return;

    const markingDone = !task.done;
    const next = tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x));
    setTasks(next);

    try {
      const result = await apiFetch<{ allDone: boolean }>(`/api/patient/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ done: markingDone }),
      });

      if (markingDone) {
        if (result.allDone && !prevAllDone.current) {
          setTimeout(() => setCelebration({ open: true, mode: 'all' }), 300);
          prevAllDone.current = true;
          notify('¡Completaste todas las tareas!');
        } else if (!result.allDone) {
          setToast(true);
          notify('¡Bien hecho!');
          setTimeout(() => setToast(false), 2800);
        }
      } else {
        prevAllDone.current = next.every((t) => t.done);
      }
    } catch {
      setTasks(tasks);
    }
  };

  const pending = tasks.filter((t) => !t.done).length;
  const completed = tasks.filter((t) => t.done).length;
  const progressPct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <AnimatedPage>
      <TaskCompleteToast show={toast} message="¡Bien hecho!" />
      <TaskCelebration
        open={celebration.open}
        mode={celebration.mode}
        onClose={() => setCelebration({ ...celebration, open: false })}
      />

      <PageHeader
        title="Mis tareas"
        subtitle={`${pending} pendiente${pending !== 1 ? 's' : ''} esta semana`}
      />

      <motion.div
        className="card-clinical p-5 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="flex justify-between text-sm mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="font-semibold text-primary">Progreso semanal</span>
          <span className="text-on-surface-variant tabular-nums">
            {completed}/{tasks.length} · {progressPct}%
          </span>
        </motion.div>
        <motion.div
          className="h-3 bg-surface-variant rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </motion.div>

      <StaggerList className="space-y-4">
        {tasks.map((task) => (
          <StaggerItem key={task.id}>
            <motion.div
              layout
              initial={false}
              animate={{
                opacity: task.done ? 0.65 : 1,
                scale: task.done ? 0.98 : 1,
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="card-clinical p-5 flex gap-4"
            >
              <motion.button
                type="button"
                onClick={() => toggle(task.id)}
                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  task.done
                    ? 'bg-primary border-primary text-on-primary'
                    : 'border-outline-variant hover:border-secondary bg-surface'
                }`}
                whileTap={{ scale: 0.85 }}
                animate={task.done ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.35 }}
              >
                <AnimatePresence mode="wait">
                  {task.done && (
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                    >
                      <Icon name="check" className="text-sm" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.div
                className="flex-1 min-w-0"
                layout
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="badge-info">{task.type}</span>
                  <span className="text-xs text-on-surface-variant">· {task.due}</span>
                </div>
                <h3
                  className={`font-semibold text-primary ${task.done ? 'line-through decoration-secondary/60' : ''}`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">{task.protocol}</p>
              </motion.div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>
    </AnimatedPage>
  );
}
