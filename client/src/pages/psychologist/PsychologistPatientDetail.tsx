import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { Icon } from '../../components/Icon';
import { AnimatedProgress, AnimatedPage } from '../../components/motion';

interface Task {
  id: string;
  title: string;
  type: string;
  due: string;
  protocol: string;
  done: boolean;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  diagnosis: string;
  risk: string;
  lastContact: string;
  metrics: { taskAdherence: number; journalCount7d: number; moodCount7d: number };
  tasks: Task[];
  journal: Array<{ date: string; mood: string; text: string }>;
  moodHistory?: Array<{ anxiety: number; depression: number; energy: number; created_at: string }>;
  clinicalNote?: string;
}

const taskTypes = ['General', 'Diario', 'Calma', 'Actividad', 'Ejercicio'];

export function PsychologistPatientDetail() {
  const { toast } = useToast();
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [tab, setTab] = useState<'resumen' | 'tareas' | 'diario'>('resumen');
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'General',
    dueLabel: 'Esta semana',
    protocol: '',
  });
  const [editForm, setEditForm] = useState({
    diagnosis: '',
    riskLevel: 'low' as 'low' | 'medium' | 'high',
  });

  const load = () => {
    if (!id) return;
    apiFetch<Patient>(`/api/professional/patients/${id}`)
      .then((p) => {
        setPatient(p);
        setNote(p.clinicalNote || '');
        setEditForm({
          diagnosis: p.diagnosis || '',
          riskLevel: (p.risk as 'low' | 'medium' | 'high') || 'low',
        });
      })
      .catch(() => setPatient(null));
  };

  useEffect(load, [id]);

  const handleNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await apiFetch(`/api/professional/patients/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ content: note }),
    });
    toast('Nota clínica guardada');
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const assignTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await apiFetch(`/api/professional/patients/${id}/tasks`, {
      method: 'POST',
      body: JSON.stringify(newTask),
    });
    toast('Tarea asignada al paciente');
    setTaskModal(false);
    setNewTask({ title: '', type: 'General', dueLabel: 'Esta semana', protocol: '' });
    load();
  };

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await apiFetch(`/api/professional/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        riskLevel: editForm.riskLevel,
        diagnosis: editForm.diagnosis,
      }),
    });
    toast('Ficha actualizada');
    setEditModal(false);
    load();
  };

  if (!patient) {
    return <p className="text-on-surface-variant p-8">Cargando expediente...</p>;
  }

  const riskBadge =
    patient.risk === 'high' ? (
      <span className="badge-risk">Riesgo elevado</span>
    ) : patient.risk === 'medium' ? (
      <span className="badge-warn">Seguimiento</span>
    ) : (
      <span className="badge-ok">Estable</span>
    );

  const tabs = [
    { id: 'resumen' as const, label: 'Resumen' },
    { id: 'tareas' as const, label: `Tareas (${patient.tasks.length})` },
    { id: 'diario' as const, label: `Diario (${patient.journal.length})` },
  ];

  return (
    <AnimatedPage>
      <Link
        to="/psicologo/pacientes"
        className="text-sm text-secondary font-semibold flex items-center gap-1 mb-6 hover:underline"
      >
        <Icon name="arrow_back" />
        Pacientes
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-display font-display text-primary">{patient.name}</h1>
            {riskBadge}
          </div>
          <p className="text-sm text-on-surface-variant">{patient.email}</p>
          <p className="text-sm text-on-surface-variant mt-1">
            {patient.diagnosis || 'Sin diagnóstico'} · Última actividad:{' '}
            {patient.lastContact}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setEditModal(true)} className="btn-secondary text-sm">
            <Icon name="edit" />
            Editar ficha
          </button>
          <button type="button" onClick={() => setTaskModal(true)} className="btn-primary text-sm">
            <Icon name="add_task" />
            Asignar tarea
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto border-b border-outline-variant/30 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg whitespace-nowrap ${
              tab === t.id
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'resumen' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-clinical p-6 space-y-4">
            <h2 className="font-bold text-primary">Indicadores (7 días)</h2>
            {[
              { label: 'Adherencia tareas', v: patient.metrics.taskAdherence },
              { label: 'Entradas diario', v: Math.min(100, patient.metrics.journalCount7d * 25) },
              { label: 'Check-ins ánimo', v: Math.min(100, patient.metrics.moodCount7d * 25) },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{m.label}</span>
                  <span className="font-semibold">{m.v}%</span>
                </div>
                <AnimatedProgress percent={m.v} />
              </div>
            ))}
          </div>

          <div className="card-clinical p-6">
            <h2 className="font-bold text-primary mb-4">Evolución del estado de ánimo</h2>
            {(!patient.moodHistory || patient.moodHistory.length === 0) ? (
              <p className="text-sm text-on-surface-variant">No hay registros de estado de ánimo.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4 text-xs font-semibold mb-2">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-error rounded-full"></div> Ansiedad</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-secondary rounded-full"></div> Depresión</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-success rounded-full"></div> Energía</div>
                </div>
                <div className="flex items-end gap-2 h-32 mt-4 w-full overflow-x-auto">
                  {patient.moodHistory.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center min-w-[30px] group relative">
                      <div className="w-full flex justify-center gap-[2px] h-full items-end">
                        <div className="w-1/3 bg-error rounded-t-sm" style={{ height: `${m.anxiety * 10}%` }}></div>
                        <div className="w-1/3 bg-secondary rounded-t-sm" style={{ height: `${m.depression * 10}%` }}></div>
                        <div className="w-1/3 bg-success rounded-t-sm" style={{ height: `${m.energy * 10}%` }}></div>
                      </div>
                      <span className="text-[10px] mt-2 text-on-surface-variant">
                        {new Date(m.created_at).getDate()}/{new Date(m.created_at).getMonth() + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleNote} className="card-clinical p-6 flex flex-col">
            <div className="flex justify-between mb-3">
              <h2 className="font-bold text-primary">Nota clínica privada</h2>
              <span className="text-xs text-on-surface-variant">{noteSaved ? 'Guardada' : ''}</span>
            </div>
            <textarea
              className="input-clinical flex-1 min-h-[200px] resize-none text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Observaciones de sesión, plan, hipótesis..."
            />
            <button type="submit" className="btn-primary mt-4 self-end text-sm">
              Guardar nota
            </button>
          </form>
        </div>
      )}

      {tab === 'tareas' && (
        <div className="space-y-3">
          {patient.tasks.length === 0 ? (
            <p className="text-on-surface-variant card-clinical p-8 text-center">
              Sin tareas. Asigna la primera con el botón superior.
            </p>
          ) : (
            patient.tasks.map((t) => (
              <div
                key={t.id}
                className={`card-clinical p-4 flex gap-3 ${t.done ? 'opacity-60' : ''}`}
              >
                <Icon
                  name={t.done ? 'check_circle' : 'radio_button_unchecked'}
                  className={t.done ? 'text-success' : 'text-on-surface-variant'}
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-primary ${t.done ? 'line-through' : ''}`}>
                    {t.title}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {t.type} · {t.due}
                    {t.protocol ? ` · ${t.protocol}` : ''}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'diario' && (
        <div className="space-y-3">
          {patient.journal.length === 0 ? (
            <p className="text-on-surface-variant card-clinical p-8 text-center">
              El paciente aún no ha escrito en el diario.
            </p>
          ) : (
            patient.journal.map((e) => (
              <div key={e.date + e.text} className="card-clinical p-4">
                <div className="flex justify-between text-xs text-on-surface-variant mb-2">
                  <span>{e.date}</span>
                  <Icon
                    name={e.mood === 'positive' ? 'sentiment_satisfied' : 'sentiment_dissatisfied'}
                    className={e.mood === 'positive' ? 'text-success' : 'text-error'}
                  />
                </div>
                <p className="text-sm text-on-surface">{e.text}</p>
              </div>
            ))
          )}
        </div>
      )}

      <Modal open={taskModal} onClose={() => setTaskModal(false)} title="Asignar tarea" wide>
        <form onSubmit={assignTask} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Título</label>
            <input
              required
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="input-clinical w-full"
              placeholder="Ej: Escribir en el diario tras una situación difícil"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold block mb-1">Tipo</label>
              <select
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                className="input-clinical w-full"
              >
                {taskTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Plazo</label>
              <input
                value={newTask.dueLabel}
                onChange={(e) => setNewTask({ ...newTask, dueLabel: e.target.value })}
                className="input-clinical w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Indicaciones (opcional)</label>
            <textarea
              rows={2}
              value={newTask.protocol}
              onChange={(e) => setNewTask({ ...newTask, protocol: e.target.value })}
              className="input-clinical w-full resize-none"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Asignar al paciente
          </button>
        </form>
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Editar ficha clínica">
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Diagnóstico / motivo</label>
            <input
              value={editForm.diagnosis}
              onChange={(e) => setEditForm({ ...editForm, diagnosis: e.target.value })}
              className="input-clinical w-full"
            />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Nivel de seguimiento</label>
            <select
              value={editForm.riskLevel}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  riskLevel: e.target.value as 'low' | 'medium' | 'high',
                })
              }
              className="input-clinical w-full"
            >
              <option value="low">Estable</option>
              <option value="medium">Seguimiento</option>
              <option value="high">Riesgo elevado</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">
            Guardar cambios
          </button>
        </form>
      </Modal>
    </AnimatedPage>
  );
}
