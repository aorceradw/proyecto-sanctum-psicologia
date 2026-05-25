import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { Icon } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { AnimatedPage } from '../../components/motion';

const steps = [
  { key: '1', title: 'Lo que pasó', field: 'situation', placeholder: '¿Qué ocurrió? ¿Dónde estabas?' },
  { key: '2', title: 'Lo que pensé', field: 'thought', placeholder: '¿Qué se te pasó por la cabeza en ese momento?' },
  { key: '3', title: 'Cómo me sentí', field: 'emotion', placeholder: '¿Cómo te sentiste? ¿Qué hiciste después?' },
];

export function ClientThoughtRecordPage() {
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    situation: '',
    thought: '',
    emotion: '',
    reframe: '',
    intensityBefore: 8,
    intensityAfter: 4,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/patient/journal', {
        method: 'POST',
        body: JSON.stringify({
          situation: form.situation,
          thought: form.thought,
          emotion: form.emotion,
          reframe: form.reframe,
          intensityBefore: form.intensityBefore,
          intensityAfter: form.intensityAfter,
        }),
      });
      toast('Entrada guardada en tu diario');
      setSaved(true);
      setForm({
        situation: '',
        thought: '',
        emotion: '',
        reframe: '',
        intensityBefore: 8,
        intensityAfter: 4,
      });
      setActiveStep(0);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <PageHeader
        title="Mi diario"
        subtitle="Tómate un momento para escribir lo que piensas y sientes."
        action={
          <Link to="/cliente/historial" className="btn-secondary text-sm">
            <Icon name="history" />
            Historial
          </Link>
        }
      />

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveStep(i)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeStep === i ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant'
            }`}
          >
            {s.key}. {s.title}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeStep === 3 ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant'
          }`}
        >
          Otra mirada
        </button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-success-container text-on-success-container flex items-center gap-2"
        >
          <Icon name="check_circle" filled />
          Guardado. Lo revisarán contigo en tu próxima cita.
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="card-clinical p-6 lg:p-8 space-y-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.key}
            initial={false}
            animate={{ opacity: activeStep === i ? 1 : 0.4, height: activeStep === i ? 'auto' : 0 }}
            className={activeStep !== i ? 'hidden' : 'space-y-2'}
          >
            <label className="flex items-center gap-2 text-sm font-bold text-on-surface">
              <span className="w-7 h-7 rounded bg-primary text-on-primary flex items-center justify-center text-xs">
                {s.key}
              </span>
              {s.title}
            </label>
            <textarea
              rows={4}
              placeholder={s.placeholder}
              className="input-clinical resize-none"
              required={i < 3}
              value={form[s.field as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [s.field]: e.target.value })}
            />
          </motion.div>
        ))}

        {activeStep === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-on-surface">
              <Icon name="lightbulb" className="text-secondary" />
              Otra forma de verlo
            </label>
            <p className="text-sm text-on-surface-variant">
              ¿Qué le dirías a un amigo en esta situación? ¿Hay otra explicación más amable?
            </p>
            <textarea
              rows={5}
              placeholder="Escribe con calma, sin juzgarte..."
              className="input-clinical resize-none"
              required
              value={form.reframe}
              onChange={(e) => setForm({ ...form, reframe: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant">Antes (0-10)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={form.intensityBefore}
                  onChange={(e) => setForm({ ...form, intensityBefore: Number(e.target.value) })}
                  className="input-clinical mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant">Después (0-10)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={form.intensityAfter}
                  onChange={(e) => setForm({ ...form, intensityAfter: Number(e.target.value) })}
                  className="input-clinical mt-1"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-outline-variant/30">
          {activeStep > 0 && (
            <button type="button" onClick={() => setActiveStep((s) => s - 1)} className="btn-secondary">
              <Icon name="arrow_back" />
              Anterior
            </button>
          )}
          {activeStep < 3 ? (
            <button type="button" onClick={() => setActiveStep((s) => s + 1)} className="btn-primary ml-auto">
              Siguiente
              <Icon name="arrow_forward" />
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary ml-auto">
              <Icon name="save" />
              {loading ? 'Guardando...' : 'Enviar registro'}
            </button>
          )}
        </div>
      </form>
    </AnimatedPage>
  );
}
