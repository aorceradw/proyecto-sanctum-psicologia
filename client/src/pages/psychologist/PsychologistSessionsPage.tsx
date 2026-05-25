import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { PageHeader } from '../../components/PageHeader';
import { AnimatedPage } from '../../components/motion';
import { Icon } from '../../components/Icon';

interface Appointment {
  id: string;
  date: string;
  time: string;
  period: string;
  title: string;
  patientName: string;
  patientId: string | null;
}

interface PatientOption {
  id: string;
  name: string;
}

export function PsychologistSessionsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    date: new Date().toISOString().slice(0, 10),
    time: '10:00',
    period: 'AM',
    title: 'Sesión de seguimiento',
  });

  const load = () => {
    apiFetch<{ appointments: Appointment[] }>('/api/professional/appointments')
      .then((d) => setAppointments(d.appointments))
      .catch(() => setAppointments([]));
  };

  useEffect(() => {
    load();
    apiFetch<{ patients: PatientOption[] }>('/api/professional/patients')
      .then((d) => setPatients(d.patients.map((p) => ({ id: p.id, name: p.name }))))
      .catch(() => setPatients([]));
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/professional/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patientId: form.patientId || null,
          date: form.date,
          time: form.time,
          period: form.period,
          title: form.title,
        }),
      });
      toast('Cita programada');
      setModalOpen(false);
      load();
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    await apiFetch(`/api/professional/appointments/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <AnimatedPage>
      <PageHeader
        title="Citas"
        subtitle="Programa y revisa las sesiones con tus pacientes"
        action={
          <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
            <Icon name="add" />
            Nueva cita
          </button>
        }
      />

      {appointments.length === 0 ? (
        <EmptyState
          icon="event"
          title="No hay citas programadas"
          description="Crea la primera cita y asígnala a un paciente."
          action={
            <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
              Nueva cita
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <div key={a.id} className="card-clinical p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex gap-4 items-center flex-1 min-w-0">
                <div className="text-center shrink-0 w-20">
                  <p className="text-xs text-on-surface-variant">
                    {new Date(a.date + 'T12:00:00').toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  <p className="font-bold text-primary">{a.time}</p>
                  <p className="text-xs text-on-surface-variant">{a.period}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-primary">{a.title}</p>
                  <p className="text-sm text-on-surface-variant">{a.patientName}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {a.patientId && (
                  <Link to={`/psicologo/paciente/${a.patientId}`} className="btn-secondary text-sm py-2">
                    Expediente
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="p-2 text-on-surface-variant hover:text-error rounded-lg"
                  aria-label="Eliminar"
                >
                  <Icon name="delete" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva cita" wide>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Paciente</label>
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="input-clinical w-full"
            >
              <option value="">Sin asignar</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold block mb-1">Fecha</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-clinical w-full"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Hora</label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="input-clinical w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Título</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-clinical w-full"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Guardando...' : 'Crear cita'}
          </button>
        </form>
      </Modal>
    </AnimatedPage>
  );
}
