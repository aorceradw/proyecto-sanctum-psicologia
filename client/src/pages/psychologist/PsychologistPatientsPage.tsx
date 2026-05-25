import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/api';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { AnimatedPage, StaggerItem, StaggerList } from '../../components/motion';

interface Patient {
  id: string;
  name: string;
  email: string;
  diagnosis: string;
  risk: string;
  adherence: number;
  pendingTasks: number;
  lastActivity: string;
}

export function PsychologistPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    apiFetch<{ patients: Patient[] }>('/api/professional/patients')
      .then((d) => setPatients(d.patients))
      .catch(() => setPatients([]));
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.email.toLowerCase().includes(query.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AnimatedPage>
      <PageHeader
        title="Pacientes"
        subtitle={`${patients.length} en tu consulta`}
        action={
          <Link to="/psicologo/cuenta" className="btn-primary text-sm">
            <Icon name="person_add" />
            Invitar paciente
          </Link>
        }
      />

      {patients.length > 0 && (
        <div className="mb-6">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, email o diagnóstico..."
            className="input-clinical max-w-md"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon="groups"
          title={patients.length === 0 ? 'Aún no tienes pacientes' : 'Sin resultados'}
          description={
            patients.length === 0
              ? 'Invita a tu primer paciente desde Mi cuenta. Comparte el código o el enlace de registro.'
              : 'Prueba con otro término de búsqueda.'
          }
          action={
            patients.length === 0 ? (
              <Link to="/psicologo/cuenta" className="btn-primary">
                Ir a invitaciones
              </Link>
            ) : undefined
          }
        />
      ) : (
        <StaggerList className="space-y-3">
          {filtered.map((p) => (
            <StaggerItem key={p.id}>
              <Link to={`/psicologo/paciente/${p.id}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="card-clinical-hover p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-primary">{p.name}</h3>
                      {p.pendingTasks > 0 && (
                        <span className="badge-warn">{p.pendingTasks} tareas pendientes</span>
                      )}
                      {p.risk === 'high' && <span className="badge-risk">Riesgo elevado</span>}
                    </div>
                    <p className="text-sm text-on-surface-variant mt-0.5">{p.diagnosis}</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Última actividad: {p.lastActivity}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0 text-right">
                    <div>
                      <p className="text-xs text-on-surface-variant">Adherencia</p>
                      <p className="font-bold text-primary">{p.adherence}%</p>
                    </div>
                    <Icon name="chevron_right" className="text-on-surface-variant" />
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </AnimatedPage>
  );
}
