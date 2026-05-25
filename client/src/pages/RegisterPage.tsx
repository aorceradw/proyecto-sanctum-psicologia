import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import sanctumLogo from '../assets/sanctum-logo.svg';

export function RegisterPage() {
  const { registerPatient, registerProfessional } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole =
    searchParams.get('rol') === 'psicologo' ? 'professional' : 'patient';

  const [role, setRole] = useState<'patient' | 'professional'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [psychologistCode, setPsychologistCode] = useState(
    searchParams.get('codigo')?.toUpperCase() || '',
  );
  const [psychologistName, setPsychologistName] = useState<string | null>(null);
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverOk, setServerOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => setServerOk(r.ok))
      .catch(() => setServerOk(false));
  }, []);

  useEffect(() => {
    if (psychologistCode.length >= 4) checkCode(psychologistCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkCode = async (code: string) => {
    if (code.length < 4) {
      setPsychologistName(null);
      setCodeInvalid(false);
      return;
    }
    try {
      const res = await fetch(`/api/auth/validate-invite/${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        setPsychologistName(data.psychologistName);
        setCodeInvalid(false);
      } else {
        setPsychologistName(null);
        setCodeInvalid(true);
      }
    } catch {
      setPsychologistName(null);
      setCodeInvalid(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'patient' && !psychologistCode.trim()) {
      setError('Necesitas el código que te dio tu psicólogo/a');
      return;
    }

    if (role === 'patient' && codeInvalid) {
      setError('El código no es válido. Pídelo de nuevo a tu psicólogo/a');
      return;
    }

    setLoading(true);
    try {
      const user =
        role === 'patient'
          ? await registerPatient({
            name,
            email,
            password,
            psychologistCode: psychologistCode.toUpperCase(),
          })
          : await registerProfessional({ name, email, password });
      toast(
        role === 'professional'
          ? '¡Listo! En el siguiente paso copia tu código para pacientes'
          : '¡Cuenta creada! Bienvenida a Sanctum',
      );
      navigate(user.role === 'professional' ? '/psicologo/cuenta' : '/cliente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient-soft flex flex-col lg:flex-row">
      <div className="lg:w-1/2 hero-gradient text-on-primary p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-20 pointer-events-none" />
        <img src={sanctumLogo} alt="Sanctum" className="w-20 h-20 mb-4 relative" />
        <h2 className="font-display text-2xl mb-8 relative text-on-primary-container">
          {role === 'professional' ? 'Abre tu consulta digital' : 'Únete a tu terapeuta'}
        </h2>
        <ol className="space-y-4 text-on-primary-container text-sm relative max-w-md">
          {role === 'professional' ? (
            <>
              <li className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <span>Crea tu cuenta de psicólogo/a</span>
              </li>
              <li className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <span>Recibe un código único de invitación</span>
              </li>
              <li className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <span>Compártelo con tus pacientes para que se registren</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <span>Tu psicólogo/a te envía un código (WhatsApp, email…)</span>
              </li>
              <li className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <span>Te registras aquí con ese código</span>
              </li>
              <li className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <span>Accedes a diario, tareas y herramientas de calma</span>
              </li>
            </>
          )}
        </ol>
        {role === 'patient' && (
          <p className="mt-8 text-sm text-on-primary-container relative">
            ¿Eres psicólogo/a?{' '}
            <button
              type="button"
              onClick={() => setRole('professional')}
              className="text-secondary-container font-bold underline"
            >
              Regístrate aquí primero
            </button>
          </p>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <motion.div
          className="w-full max-w-[440px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {serverOk === false && (
            <div className="mb-4 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex gap-2">
              <Icon name="error" />
              <span>
                El servidor no responde. En la carpeta <strong>sanctum-app</strong> ejecuta:{' '}
                <code className="text-xs bg-black/10 px-1 rounded">npm run dev</code>
              </span>
            </div>
          )}

          <div className="card-clinical p-6 md:p-8">
            <h2 className="font-display text-xl text-primary text-center mb-6">Crear cuenta</h2>

            <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-surface-container rounded-xl">
              {(['patient', 'professional'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setError('');
                  }}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${role === r ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                    }`}
                >
                  {r === 'patient' ? 'Paciente' : 'Psicólogo/a'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-on-error-container bg-error-container px-3 py-2 rounded-lg flex gap-2">
                  <Icon name="error" className="shrink-0" />
                  {error}
                </p>
              )}

              <div>
                <label className="text-sm font-semibold text-on-surface block mb-1">Tu nombre</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-clinical"
                  placeholder="María García"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-on-surface block mb-1">Correo</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-clinical"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-on-surface block mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-clinical"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              {role === 'patient' && (
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-1">
                    Código de invitación
                  </label>
                  <input
                    required
                    value={psychologistCode}
                    onChange={(e) => {
                      const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      setPsychologistCode(v);
                      checkCode(v);
                    }}
                    className="input-clinical uppercase tracking-[0.2em] text-center text-lg font-bold"
                    placeholder="XXXXXXXX"
                    maxLength={12}
                  />
                  {psychologistName && (
                    <p className="text-xs text-success mt-2 flex items-center gap-1 font-medium">
                      <Icon name="check_circle" filled />
                      Vinculado a {psychologistName}
                    </p>
                  )}
                  {codeInvalid && psychologistCode.length >= 4 && (
                    <p className="text-xs text-error mt-2">Código no encontrado</p>
                  )}
                  <p className="text-xs text-on-surface-variant mt-2">
                    Demo: regístrate primero como psicólogo, copia el código en Mi cuenta, y úsalo
                    aquí.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || serverOk === false}
                className="btn-primary w-full py-3.5"
              >
                {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
              </button>
            </form>

            <p className="text-sm text-center text-on-surface-variant mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-secondary font-semibold hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
