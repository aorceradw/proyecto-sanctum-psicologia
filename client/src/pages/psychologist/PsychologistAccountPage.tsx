import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/api';
import { InvitePanel } from '../../components/InvitePanel';
import { PageHeader } from '../../components/PageHeader';
import { AnimatedPage } from '../../components/motion';
import { Icon } from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';

interface Profile {
  name: string;
  email: string;
  inviteCode: string;
  collegiateNumber?: string;
  patientCount: number;
}

interface Appointment {
  id: string;
  patientId: string | null;
  date: string;
  time: string;
  period: string;
  patient: string;
  type: string;
  active: boolean;
}

interface DashboardData {
  appointments: Appointment[];
}

interface MoodEntry {
  anxiety: number;
  depression: number;
  energy: number;
  date: string;
}

interface MoodProgress {
  patientId: string;
  patientName: string;
  latestMood: MoodEntry | null;
  weekAverage: {
    anxiety: number;
    depression: number;
    energy: number;
  } | null;
}

interface MoodProgressData {
  moodProgress: MoodProgress[];
}

export function PsychologistAccountPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [moodProgress, setMoodProgress] = useState<MoodProgress[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [collegiateNumber, setCollegiateNumber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    apiFetch<Profile>('/api/professional/profile')
      .then((data) => {
        setProfile(data);
        setCollegiateNumber(data.collegiateNumber || '');
      })
      .catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    apiFetch<DashboardData>('/api/professional/dashboard')
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch(() => setAppointments([]));
  }, []);

  useEffect(() => {
    apiFetch<MoodProgressData>('/api/professional/mood-progress')
      .then((data) => {
        setMoodProgress(data.moodProgress || []);
      })
      .catch(() => setMoodProgress([]));
  }, []);

  const saveProfile = async () => {
    try {
      await apiFetch('/api/professional/profile', {
        method: 'PATCH',
        body: JSON.stringify({ collegiateNumber }),
      });
      setProfile((prev) => (prev ? { ...prev, collegiateNumber } : null));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const appointmentsByDate = new Map<string, Appointment[]>();
    appointments.forEach((apt) => {
      const key = apt.date;
      if (!appointmentsByDate.has(key)) {
        appointmentsByDate.set(key, []);
      }
      appointmentsByDate.get(key)!.push(apt);
    });

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        date: dateStr,
        appointments: appointmentsByDate.get(dateStr) || [],
      });
    }
    return days;
  };

  const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const calendarDays = getCalendarDays();

  return (
    <AnimatedPage>
      <PageHeader
        title="Mi cuenta"
        subtitle="Perfil profesional e invitaciones a pacientes"
      />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="card-clinical p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-primary flex items-center gap-2">
              <Icon name="person" />
              Datos profesionales
            </h2>
            <button
              onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
              className="text-sm font-semibold text-secondary hover:underline"
            >
              {isEditing ? 'Guardar' : 'Editar'}
            </button>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-on-surface-variant">Nombre</dt>
              <dd className="font-semibold text-on-surface">{profile?.name || user?.name}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Email</dt>
              <dd className="font-semibold text-on-surface">{profile?.email || user?.email}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant mb-1">Número de Colegiado</dt>
              {isEditing ? (
                <dd>
                  <input
                    type="text"
                    value={collegiateNumber}
                    onChange={(e) => setCollegiateNumber(e.target.value)}
                    className="input-clinical py-1 px-2 w-full max-w-[200px]"
                    placeholder="Ej. M-12345"
                  />
                </dd>
              ) : (
                <dd className="font-semibold text-on-surface">
                  {profile?.collegiateNumber || <span className="text-on-surface-variant italic">No especificado</span>}
                </dd>
              )}
            </div>
            <div>
              <dt className="text-on-surface-variant">Pacientes activos</dt>
              <dd className="font-semibold text-secondary">{profile?.patientCount ?? 0}</dd>
            </div>
          </dl>
        </div>

        <div className="card-clinical p-6">
          <h2 className="font-bold text-primary mb-3 flex items-center gap-2">
            <Icon name="info" />
            Cómo funciona
          </h2>
          <ol className="text-sm text-on-surface-variant space-y-2 list-decimal list-inside">
            <li>Copia la invitación y envíala a tu paciente</li>
            <li>El paciente crea cuenta con tu código</li>
            <li>Aparece en Pacientes: asigna tareas y revisa su diario</li>
            <li>Programa citas en la sección Citas</li>
          </ol>
        </div>
      </div>

      {profile?.inviteCode && <InvitePanel inviteCode={profile.inviteCode} />}

      <div className="card-clinical p-6 mt-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-primary">
            Calendario - {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="p-2 rounded-lg border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-colors"
              title="Mes anterior"
            >
              <Icon name="arrow_back" className="text-on-surface" />
            </button>
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="p-2 rounded-lg border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-colors"
              title="Próximo mes"
            >
              <Icon name="arrow_forward" className="text-on-surface" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-bold text-on-surface-variant py-3 border-b-2 border-outline">
              {day}
            </div>
          ))}

          {calendarDays.map((dayObj, idx) => (
            <div
              key={idx}
              className={`min-h-32 p-2 rounded-lg border-2 text-center transition-all duration-300 hover:shadow-lg ${dayObj === null
                  ? 'bg-surface-variant/30 border-transparent'
                  : dayObj.appointments.length > 0
                    ? 'bg-secondary-container border-secondary'
                    : 'bg-surface-container border-outline-variant'
                }`}
            >
              {dayObj && (
                <>
                  <div className="font-bold text-lg text-on-surface mb-2">{dayObj.day}</div>
                  {dayObj.appointments.length > 0 && (
                    <div className="space-y-1">
                      {dayObj.appointments.slice(0, 2).map((apt, i) => (
                        <div key={i} className="bg-secondary/90 text-on-secondary rounded px-1.5 py-1 text-xs font-semibold">
                          {apt.time}
                        </div>
                      ))}
                      {dayObj.appointments.length > 2 && (
                        <div className="text-on-surface-variant text-xs font-semibold mt-1">
                          +{dayObj.appointments.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {appointments.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-outline-variant animate-fade-in">
            <p className="text-sm font-bold text-on-surface mb-4 text-justify">Próximas citas programadas:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {appointments.slice(0, 6).map((apt) => (
                <div key={apt.id} className="p-4 rounded-lg border border-outline-variant bg-surface-container">
                  <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">{apt.patient}</p>
                  <p className="font-bold text-on-surface mb-2">{apt.type}</p>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <Icon name="schedule" className="text-secondary" />
                    {apt.time} {apt.period}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant mt-1">
                    <Icon name="event" className="text-secondary" />
                    {apt.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-clinical p-6 mt-6">
        <h2 className="font-bold text-primary flex items-center gap-2 mb-4">
          <Icon name="trending_up" className="text-secondary" />
          Progreso de Ánimo - Pacientes
        </h2>
        {moodProgress.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No hay datos de ánimo registrados aún.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left py-2 px-3 font-semibold text-on-surface-variant">Paciente</th>
                  <th className="text-center py-2 px-3 font-semibold text-on-surface-variant">Última Actualización</th>
                  <th className="text-center py-2 px-3 font-semibold text-on-surface-variant">Ansiedad (7d)</th>
                  <th className="text-center py-2 px-3 font-semibold text-on-surface-variant">Depresión (7d)</th>
                  <th className="text-center py-2 px-3 font-semibold text-on-surface-variant">Energía (7d)</th>
                </tr>
              </thead>
              <tbody>
                {moodProgress.map((patient) => (
                  <tr key={patient.patientId} className="border-b border-outline-variant hover:bg-surface-container">
                    <td className="py-3 px-3 font-semibold text-on-surface">{patient.patientName}</td>
                    <td className="py-3 px-3 text-center text-on-surface-variant">
                      {patient.latestMood ? new Date(patient.latestMood.date).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {patient.weekAverage ? (
                        <span className="inline-block px-2 py-1 rounded-full bg-warning-container/30 text-on-surface font-semibold">
                          {patient.weekAverage.anxiety}/10
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {patient.weekAverage ? (
                        <span className="inline-block px-2 py-1 rounded-full bg-error-container/30 text-on-surface font-semibold">
                          {patient.weekAverage.depression}/10
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {patient.weekAverage ? (
                        <span className="inline-block px-2 py-1 rounded-full bg-success-container/30 text-on-surface font-semibold">
                          {patient.weekAverage.energy}/10
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
