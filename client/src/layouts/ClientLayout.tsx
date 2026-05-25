import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { PanicBreathingModal } from '../components/PanicBreathingModal';
import { useAuth } from '../context/AuthContext';
import sanctumLogo from '../assets/sanctum-logo.svg';

const nav = [
  { to: '/cliente', icon: 'home', label: 'Inicio', end: true },
  { to: '/cliente/registro', icon: 'edit_note', label: 'Diario' },
  { to: '/cliente/historial', icon: 'history', label: 'Historial' },
  { to: '/cliente/estado', icon: 'monitoring', label: 'Ánimo' },
  { to: '/cliente/tareas', icon: 'checklist', label: 'Tareas' },
  { to: '/cliente/respiracion', icon: 'air', label: 'Calma' },
  { to: '/cliente/cuenta', icon: 'person', label: 'Cuenta' },
];

export function ClientLayout() {
  const [panicOpen, setPanicOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="hidden lg:block fixed inset-0 bg-watermark-subtle pointer-events-none z-0" />

      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 bg-surface-container-low border-r border-outline-variant/10 p-6 gap-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <img src={sanctumLogo} alt="Sanctum" className="w-12 h-12" />
          <p className="text-xs text-on-surface-variant text-center mt-1">Tu espacio personal</p>
        </motion.div>

        <nav className="flex-1 flex flex-col gap-1">
          {nav.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                    ? 'nav-active-client shadow-sm translate-x-1'
                    : 'text-on-surface-variant hover:bg-secondary-container/20 hover:translate-x-1'
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

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-xl text-sm"
          >
            <Icon name="logout" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative z-10">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-outline-variant/30 px-4 lg:px-8 h-14 flex items-center justify-between">
          <span className="font-bold text-primary text-lg">Sanctum</span>
          <button type="button" onClick={() => setPanicOpen(true)} className="btn-panic px-4 py-2 rounded-lg text-sm">
            <Icon name="emergency" />
            Crisis
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-container-max mx-auto w-full pb-28 lg:pb-8">
          <Outlet />
        </main>

        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-background border-t border-outline-variant/30 z-30">
          <div className="flex justify-around items-center h-16">
            {nav.filter((n) => n.to !== '/cliente/cuenta').slice(0, 5).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-semibold transition-colors ${isActive ? 'text-secondary' : 'text-on-surface-variant'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} filled={isActive} />
                    <span>{item.label.split(' ')[0]}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      <PanicBreathingModal open={panicOpen} onClose={() => setPanicOpen(false)} />
    </div>
  );
}
