import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { ASSETS } from '../theme/assets';

interface Patient {
  id: string;
  name: string;
  risk: string;
  lastContact: string;
  metrics: { mindfulness: number; sleep: number; exposure: number };
  journal: Array<{ date: string; mood: string; text: string }>;
}

export function PatientDetailPage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    fetch('/api/professional/patients/elena-m')
      .then((r) => r.json())
      .then(setPatient)
      .catch(() => {});
  }, []);

  const handleSaveNote = (e: FormEvent) => {
    e.preventDefault();
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  if (!patient) {
    return <p className="text-on-surface-variant">Cargando perfil del paciente...</p>;
  }

  return (
    <div className="max-w-container-max mx-auto">
      <header className="hidden md:flex justify-between items-center w-full h-20 border-b border-outline-variant mb-stack-lg -mt-4">
        <span className="text-h2 font-h2 tracking-widest text-secondary uppercase">SANCTUM</span>
        <nav className="flex gap-gutter">
          <Link to="/profesional/paciente/elena-m" className="text-primary border-b-2 border-primary pb-1 text-label-md font-label-md">
            Patients
          </Link>
          <span className="text-on-surface-variant text-label-md font-label-md">Analytics</span>
          <span className="text-on-surface-variant text-label-md font-label-md">Logs</span>
        </nav>
        <img alt="Practitioner" src={ASSETS.profileDoctor} className="w-10 h-10 rounded-full border border-outline-variant" />
      </header>

      <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-h1-mobile md:text-h1 font-h1-mobile md:font-h1 text-primary">{patient.name}</h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-error-container text-on-error-container text-caption font-caption font-semibold">
              <Icon name="warning" filled className="text-[16px]" />
              High Risk
            </span>
          </div>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Last contact: {patient.lastContact}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="h-12 px-6 rounded-lg border border-secondary text-primary hover:bg-secondary-container text-label-md font-label-md flex items-center gap-2"
          >
            <Icon name="history" />
            Session History
          </button>
          <button
            type="button"
            className="h-12 px-6 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-label-md font-label-md flex items-center gap-2"
          >
            <Icon name="add" filled />
            New Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <section className="md:col-span-8 bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/50 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h3 font-h3 text-primary">Emotional Evolution</h2>
            <select className="bg-transparent border-none text-on-surface-variant text-label-md font-label-md focus:ring-0 cursor-pointer">
              <option>Past 7 Days</option>
              <option>Past 30 Days</option>
            </select>
          </div>
          <div className="h-64 w-full bg-surface-container-low rounded-lg relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full px-4 pb-8 pt-10" preserveAspectRatio="none" viewBox="0 0 100 100">
              <line x1="0" y1="25" x2="100" y2="25" stroke="#e9e1dc" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#e9e1dc" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="#e9e1dc" strokeWidth="0.5" strokeDasharray="2 2" />
              <polyline
                fill="none"
                stroke="#002819"
                strokeWidth="2"
                strokeLinecap="round"
                points="0,60 15,45 30,70 45,30 60,80 75,40 90,65 100,50"
              />
              <polyline
                fill="none"
                stroke="#775a19"
                strokeWidth="1.5"
                opacity="0.6"
                strokeLinecap="round"
                points="0,80 15,75 30,85 45,60 60,90 75,55 90,75 100,70"
              />
            </svg>
            <div className="absolute bottom-1 left-4 right-4 flex justify-between text-caption font-caption text-on-surface-variant/70">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-caption font-caption">
            <div className="flex items-center gap-1 text-primary">
              <div className="w-2 h-2 rounded-full bg-primary" /> Anxiety Level
            </div>
            <div className="flex items-center gap-1 text-secondary">
              <div className="w-2 h-2 rounded-full bg-secondary" /> Depressive Symptoms
            </div>
          </div>
        </section>

        <section className="md:col-span-4 bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/50 shadow-sm flex flex-col">
          <h2 className="text-h3 font-h3 text-primary mb-6">Task Adherence</h2>
          <div className="flex-grow flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-label-md font-label-md text-on-surface">
                <span>Mindfulness Sessions</span>
                <span>4/7</span>
              </div>
              <ProgressBar percent={patient.metrics.mindfulness} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-label-md font-label-md text-on-surface">
                <span>Sleep Hygiene Logs</span>
                <span>6/7</span>
              </div>
              <ProgressBar percent={patient.metrics.sleep} variant="primary" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-label-md font-label-md text-on-surface">
                <span>Exposure Exercises</span>
                <span className="text-error">1/3</span>
              </div>
              <ProgressBar percent={patient.metrics.exposure} variant="error" />
            </div>
          </div>
          <button
            type="button"
            className="mt-6 w-full h-12 rounded-lg border border-outline-variant text-primary hover:bg-surface-variant text-label-md font-label-md"
          >
            Adjust Protocol
          </button>
        </section>

        <section className="md:col-span-6 bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/50 shadow-sm">
          <h2 className="text-h3 font-h3 text-primary mb-6 flex items-center gap-2">
            <Icon name="book" className="text-secondary" />
            Journal Extracts
          </h2>
          <div className="space-y-4">
            {patient.journal.map((entry) => (
              <div
                key={entry.date}
                className="p-4 rounded-lg bg-surface border border-outline-variant/30 hover:border-secondary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-caption font-caption text-on-surface-variant">{entry.date}</span>
                  <Icon
                    name={entry.mood === 'positive' ? 'sentiment_satisfied' : 'sentiment_very_dissatisfied'}
                    className={entry.mood === 'positive' ? 'text-primary/80' : 'text-error/80'}
                  />
                </div>
                <p className="text-body-md font-body-md text-on-surface italic line-clamp-3">{entry.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="md:col-span-6 bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/50 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h3 font-h3 text-primary flex items-center gap-2">
              <Icon name="edit_document" className="text-secondary" />
              Clinical Notes
            </h2>
            <span className="text-caption font-caption text-on-surface-variant">
              {noteSaved ? 'Saved' : 'Auto-saving...'}
            </span>
          </div>
          <form onSubmit={handleSaveNote} className="flex flex-col flex-grow">
            <textarea
              placeholder="Enter session notes, observations, or risk assessments here..."
              className="flex-grow w-full bg-surface resize-none border border-outline-variant rounded-lg p-4 text-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary min-h-[200px]"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="h-10 px-4 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant text-label-md font-label-md"
              >
                Clear
              </button>
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-label-md font-label-md"
              >
                Save Note
              </button>
            </div>
          </form>
        </section>
      </div>

      <div className="mt-6">
        <Link to="/profesional" className="text-secondary font-label-md hover:underline flex items-center gap-1">
          <Icon name="arrow_back" className="text-sm" /> Volver al panel
        </Link>
      </div>
    </div>
  );
}
