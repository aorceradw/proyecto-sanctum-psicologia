import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import sanctumLogo from '../assets/sanctum-logo.svg';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverOk, setServerOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => setServerOk(r.ok))
      .catch(() => setServerOk(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'professional' ? '/psicologo' : '/cliente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex hero-gradient-soft lg:flex-row flex-col">
      <div className="lg:w-1/2 hero-gradient text-on-primary p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden min-h-[280px]">
        <div className="absolute inset-0 shimmer opacity-15 pointer-events-none" />
        <img src={sanctumLogo} alt="Sanctum" className="w-20 h-20 mb-4 relative" />
        <h2 className="font-display text-2xl mb-6 relative text-on-primary-container">Acceso a tu cuenta</h2>
        <p className="text-on-primary-container max-w-md relative">
          Accede a tu diario, tareas y herramientas de calma, o a tu panel clínico si eres profesional.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <motion.div
          className="w-full max-w-[440px] card-clinical p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="lg:hidden mb-6 flex justify-center">
            <img src={sanctumLogo} alt="Sanctum" className="w-12 h-12" />
          </div>

          {serverOk === false && (
            <div className="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-sm flex gap-2">
              <Icon name="error" />
              <span>
                Servidor apagado. En <strong>sanctum-app</strong>: <code>npm run dev</code>
              </span>
            </div>
          )}

          <h2 className="font-display text-xl text-primary text-center mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-on-error-container bg-error-container px-3 py-2 rounded-lg flex gap-2">
                <Icon name="error" />
                {error}
              </p>
            )}

            <div>
              <label htmlFor="email" className="text-sm font-semibold block mb-1">
                Correo
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-clinical"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold block mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-clinical"
              />
            </div>

            <button
              type="submit"
              disabled={loading || serverOk === false}
              className="btn-primary w-full py-3.5"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-sm text-center text-on-surface-variant mt-6 space-y-2">
            <span className="block">
              ¿Primera vez?{' '}
              <Link to="/crear-cuenta" className="text-secondary font-semibold hover:underline">
                Crear cuenta
              </Link>
            </span>
            <Link to="/" className="text-secondary text-xs font-semibold hover:underline block">
              Volver al inicio
            </Link>
          </p>

          <details className="mt-6 text-xs text-on-surface-variant">
            <summary className="cursor-pointer font-semibold text-secondary">Cuentas de prueba</summary>
            <p className="mt-2">
              Paciente: elena@ejemplo.com · Psicólogo: doctor@sanctum.health · Contraseña: sanctum123
            </p>
          </details>
        </motion.div>
      </div>
    </div>
  );
}
