import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import sanctumLogo from '../assets/sanctum-logo.svg';

interface PublicInfo {
  name: string;
  tagline: string;
  description: string;
  stats: { professionals: number; patients: number; sessionsToday: number };
}

const steps = [
  { n: '1', title: 'Regístrate', desc: 'Psicólogo/a o paciente con código de invitación' },
  { n: '2', title: 'Conecta', desc: 'Paciente y terapeuta quedan vinculados al instante' },
  { n: '3', title: 'Acompaña', desc: 'Tareas, diario, ánimo y citas entre sesiones' },
];

export function PublicLandingPage() {
  const [info, setInfo] = useState<PublicInfo | null>(null);

  useEffect(() => {
    fetch('/api/public/info')
      .then((r) => r.json())
      .then(setInfo)
      .catch(() =>
        setInfo({
          name: 'Sanctum',
          tagline: 'Tu espacio seguro entre sesiones',
          description:
            'La plataforma que une a personas en terapia con su psicólogo/a: diario, tareas, calma y seguimiento clínico.',
          stats: { professionals: 1, patients: 3, sessionsToday: 2 },
        }),
      );
  }, []);

  const features = [
    { icon: 'edit_note', title: 'Diario', desc: 'Reflexiona con calma, paso a paso.' },
    { icon: 'checklist', title: 'Tareas', desc: 'Lo que acuerdas en consulta, en tu móvil.' },
    { icon: 'monitoring', title: 'Ánimo', desc: 'Check-ins sencillos y gráficos claros.' },
    { icon: 'air', title: 'Calma', desc: 'Respiración guiada cuando lo necesites.' },
    { icon: 'groups', title: 'Panel clínico', desc: 'Tu consulta, pacientes y citas en un sitio.' },
    { icon: 'lock', title: 'Privacidad', desc: 'Acceso por roles y datos protegidos.' },
  ];

  return (
    <div className="min-h-screen hero-gradient-soft overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] bg-primary-fixed/30 -top-40 -left-40" />
      <div className="glow-orb w-[400px] h-[400px] bg-secondary-container/40 top-1/3 -right-32 animation-delay-2000" />

      <header className="relative z-20 border-b border-outline-variant/10 bg-background/70 backdrop-blur-lg sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src={sanctumLogo} alt="Sanctum" className="w-10 h-10" />
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-primary hover:text-secondary hidden sm:block">
              Entrar
            </Link>
            <Link to="/crear-cuenta?rol=psicologo" className="btn-primary text-sm py-2">
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-6"
            >
              <img src={sanctumLogo} alt="Sanctum" className="w-32 h-32" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary leading-[1.1] mb-5 mt-2">
              {info?.tagline || 'Tu espacio seguro entre sesiones'}
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg mb-8 leading-relaxed">
              {info?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/crear-cuenta?rol=psicologo"
                className="btn-primary justify-center py-3.5 text-base shadow-lg shadow-primary/20"
              >
                <Icon name="medical_services" />
                Soy psicólogo/a
              </Link>
              <Link to="/crear-cuenta?rol=paciente" className="btn-secondary justify-center py-3.5 text-base">
                <Icon name="person" />
                Soy paciente
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-gradient rounded-3xl p-8 md:p-10 text-on-primary shadow-2xl shadow-primary/30 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="absolute inset-0 shimmer opacity-30 pointer-events-none" />
            <div className="grid grid-cols-3 gap-4 relative">
              {[
                { v: info?.stats.patients, l: 'Pacientes' },
                { v: info?.stats.professionals, l: 'Profesionales' },
                { v: info?.stats.sessionsToday, l: 'Citas hoy' },
              ].map((s) => (
                <motion.div
                  key={s.l}
                  className="text-center bg-white/10 rounded-2xl py-4 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-3xl font-bold tabular-nums">{s.v ?? '—'}</p>
                  <p className="text-xs text-on-primary-container mt-1">{s.l}</p>
                </motion.div>
              ))}
            </div>
            <ul className="mt-8 space-y-3 text-sm text-on-primary-container relative">
              {['Invitación por código', 'Panel clínico completo', 'Cuidando tu bienestar'].map((t) => (
                <motion.li
                  key={t}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Icon name="check_circle" className="text-secondary-container" />
                  {t}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-16 bg-primary/5">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-2xl md:text-3xl text-primary text-center mb-12">
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                  {s.n}
                </div>
                <h3 className="font-semibold text-primary text-lg">{s.title}</h3>
                <p className="text-sm text-on-surface-variant mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-2xl md:text-3xl text-primary text-center mb-4">
            Todo lo que necesitas
          </h2>
          <p className="text-center text-on-surface-variant mb-12 max-w-xl mx-auto">
            Herramientas pensadas para el vínculo terapéutico, no para sustituir la consulta.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="card-clinical-hover p-6 group"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-fixed/50 to-secondary-fixed/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon name={f.icon} className="text-2xl text-primary" />
                </div>
                <h3 className="font-semibold text-primary text-lg">{f.title}</h3>
                <p className="text-sm text-on-surface-variant mt-1">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 hero-gradient text-on-primary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl mb-4">¿Lista para empezar?</h2>
          <p className="text-on-primary-container mb-8">
            Crea tu consulta en minutos e invita a tu primer paciente hoy.
          </p>
          <Link
            to="/crear-cuenta?rol=psicologo"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-secondary-container text-on-secondary-container font-bold hover:scale-[1.02] transition-transform shadow-lg"
          >
            Crear cuenta profesional
            <Icon name="arrow_forward" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-outline-variant/20 py-8 text-center text-sm text-on-surface-variant bg-background">
        <div className="flex justify-center mb-3 opacity-70">
          <img src={sanctumLogo} alt="Sanctum" className="w-8 h-8" />
        </div>
        <p>© {new Date().getFullYear()} Sanctum · Portal de bienestar terapéutico</p>
      </footer>
    </div>
  );
}
