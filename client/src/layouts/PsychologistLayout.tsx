import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import sanctumLogo from '../assets/sanctum-logo.svg';

const nav = [
  { to: '/psicologo', icon: 'dashboard', label: 'Panel', end: true },
  { to: '/psicologo/pacientes', icon: 'groups', label: 'Pacientes' },
  { to: '/psicologo/citas', icon: 'event', label: 'Citas' },
  { to: '/psicologo/cuenta', icon: 'settings', label: 'Mi cuenta' },
];

export function PsychologistLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-surface-container-low border-r border-outline-variant/20 z-40">
        <motion.div
          className="p-6 flex flex-col items-center border-b border-outline-variant/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img src={sanctumLogo} alt="Sanctum" className="w-12 h-12" />
          <p className="text-xs text-on-surface-variant mt-2 text-center">Consulta profesional</p>
        </motion.div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} filled={isActive} />
                    {item.label}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/20">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container">
              {user?.name?.charAt(0) ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container rounded-xl"
          >
            <Icon name="logout" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-outline-variant/30 px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-primary text-lg">Sanctum</span>
          <div className="flex items-center gap-2">
            <NavLink to="/psicologo/cuenta" className="p-2 text-on-surface-variant">
              <Icon name="settings" />
            </NavLink>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-container-max mx-auto w-full pb-24 lg:pb-8">
          <Outlet />
        </main>

        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-surface-container-low border-t border-outline-variant/20 z-30">
          <div className="flex justify-around h-16">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold px-2 ${isActive ? 'text-secondary' : 'text-on-surface-variant'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} filled={isActive} />
                    {item.label.split(' ')[0]}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

    </div>
  );
}
