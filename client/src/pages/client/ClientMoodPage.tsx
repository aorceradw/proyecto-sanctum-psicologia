import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/PageHeader';
import { AnimatedPage } from '../../components/motion';
import { Icon } from '../../components/Icon';

const moodLabels = [
  'Mínimo',
  'Muy bajo',
  'Bajo',
  'Algo bajo',
  'Neutral-',
  'Neutral',
  'Neutral+',
  'Algo alto',
  'Alto',
  'Muy alto',
  'Máximo',
];

export function ClientMoodPage() {
  const { toast } = useToast();
  const [anxiety, setAnxiety] = useState(5);
  const [depression, setDepression] = useState(4);
  const [energy, setEnergy] = useState(6);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<{ history: Array<{ anxiety: number }> }>('/api/patient/mood/history')
      .then((d) => setHistory(d.history.map((h) => h.anxiety)))
      .catch(() => setHistory([]));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiFetch('/api/patient/mood', {
        method: 'POST',
        body: JSON.stringify({ anxiety, depression, energy, note }),
      });
      toast('Check-in guardado');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      const d = await apiFetch<{ history: Array<{ anxiety: number }> }>('/api/patient/mood/history');
      setHistory(d.history.map((h) => h.anxiety));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const Scale = ({
    label,
    value,
    onChange,
    color,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    color: string;
  }) => (
    <div className="card-clinical p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-primary">{label}</span>
        <span className={`text-2xl font-bold tabular-nums ${color}`}>{value}/10</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-surface-variant accent-secondary cursor-pointer"
      />
      <div className="flex justify-between mt-2 text-xs text-on-surface-variant">
        <span>0</span>
        <span className="font-medium">{moodLabels[value]}</span>
        <span>10</span>
      </div>
    </div>
  );

  const weekData = history.length >= 7 ? history : [...history, ...Array(7 - history.length).fill(5)];

  return (
    <AnimatedPage>
      <PageHeader
        title="¿Cómo te sientes?"
        subtitle="Desliza cada barra. Puedes hacerlo una vez al día."
      />

      {saved && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-success-container text-on-success-container flex items-center gap-2"
        >
          <Icon name="check_circle" filled />
          Guardado correctamente.
        </motion.p>
      )}

      <div className="space-y-5 mb-8">
        <Scale label="Ansiedad" value={anxiety} onChange={setAnxiety} color="text-secondary" />
        <Scale label="Estado de ánimo bajo" value={depression} onChange={setDepression} color="text-primary" />
        <Scale label="Energía" value={energy} onChange={setEnergy} color="text-success" />
      </div>

      <div className="card-clinical p-6 mb-6">
        <label className="text-sm font-semibold text-on-surface block mb-2">Nota breve (opcional)</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="¿Qué ocurrió hoy que influyó en estas puntuaciones?"
          className="input-clinical resize-none"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="btn-primary w-full sm:w-auto"
      >
        <Icon name="save" />
        {loading ? 'Guardando...' : 'Guardar check-in'}
      </button>

      {weekData.length > 0 && (
        <div className="mt-10 card-clinical p-6">
          <h3 className="font-semibold text-primary mb-4">Tu semana (ansiedad)</h3>
          <div className="h-32 flex items-end justify-between gap-2">
            {weekData.slice(-7).map((v, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-secondary/80 rounded-t-md origin-bottom"
                initial={{ height: 0 }}
                animate={{ height: `${v * 10}%` }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-on-surface-variant">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
