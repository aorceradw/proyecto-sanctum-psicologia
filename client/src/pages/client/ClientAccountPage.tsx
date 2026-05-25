import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/api';
import { PageHeader } from '../../components/PageHeader';
import { AnimatedPage } from '../../components/motion';
import { Icon } from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';

interface Profile {
  name: string;
  email: string;
  psychologist: { name: string; email: string } | null;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  period: string;
  title: string;
  active: boolean;
}

interface DashboardData {
  appointments: Appointment[];
}

export function ClientAccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    apiFetch<Profile>('/api/patient/profile').then(setProfile).catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    apiFetch<DashboardData>('/api/patient/dashboard')
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch(() => setAppointments([]));
  }, []);

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
      <PageHeader title="Mi cuenta" subtitle="Tu perfil y datos de contacto" />

      <div className="space-y-4 max-w-lg">
        <div className="card-clinical p-6">
          <h2 className="font-semibold text-primary mb-4">Tus datos</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-on-surface-variant">Nombre</dt>
              <dd className="font-semibold">{profile?.name || user?.name}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Email</dt>
              <dd className="font-semibold">{profile?.email || user?.email}</dd>
            </div>
          </dl>
        </div>

        {profile?.psychologist && (
          <div className="card-clinical p-6 border-l-4 border-l-secondary">
            <h2 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Icon name="medical_services" className="text-secondary" />
              Tu psicólogo/a
            </h2>
            <p className="font-semibold text-on-surface">{profile.psychologist.name}</p>
            <p className="text-sm text-on-surface-variant">{profile.psychologist.email}</p>
          </div>
        )}

        <div className="card-clinical p-6 animate-fade-in">
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
              <p className="text-sm font-bold text-on-surface mb-4 text-justify">Próximas citas con tu psicólogo/a:</p>
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 rounded-lg border border-outline-variant bg-surface-container">
                    <p className="font-bold text-on-surface mb-2">{apt.title}</p>
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

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="btn-secondary w-full"
        >
          <Icon name="logout" />
          Cerrar sesión
        </button>
      </div>
    </AnimatedPage>
  );
}
