import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ASSETS } from '../theme/assets';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/sanctuary', icon: 'home', label: 'Inicio', labelEn: 'Home' },
  { to: '/cartografia', icon: 'edit_note', label: 'Diario', labelEn: 'Journal' },
  { to: '/rituales', icon: 'spa', label: 'Rituales', labelEn: 'Rituals' },
  { to: '/sanctuary/premium', icon: 'auto_stories', label: 'Aprender', labelEn: 'Library' },
];

export function PatientLayout({ variant = 'es' }: { variant?: 'es' | 'en' }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <nav className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/10 p-6 gap-8 z-50">
        <div className="flex flex-col gap-4">
          <img alt="Sanctum" src={ASSETS.pegasus} className="h-12 w-auto object-contain" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-transform duration-300 hover:translate-x-1 ${
                  isActive
                    ? 'text-on-secondary-fixed-variant font-bold bg-secondary-fixed/40'
                    : 'text-on-surface-variant hover:bg-secondary-container/20'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} filled={isActive} />
                  <span className="font-label-md text-label-md">
                    {variant === 'es' ? item.label : item.labelEn}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <button
            type="button"
            className="w-full py-3 px-4 bg-error text-on-error rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Icon name="sos" />
            {variant === 'es' ? 'Botón de Pánico' : 'Panic Button'}
          </button>
          <div className="h-px w-full bg-outline-variant/20 my-2" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-secondary-container/20 rounded-xl"
          >
            <Icon name="logout" />
            <span className="font-label-md text-label-md">
              {variant === 'es' ? 'Salir' : 'Logout'}
            </span>
          </button>
        </div>
      </nav>

      <header className="md:hidden flex justify-between items-center w-full px-margin-mobile h-16 bg-background border-b border-outline-variant/30 sticky top-0 z-50">
        <img alt="Sanctum" src={ASSETS.pegasus} className="h-8 w-auto" />
        <div className="flex items-center gap-4">
          <button type="button" className="text-on-surface-variant hover:text-primary">
            <Icon name="notifications" />
          </button>
        </div>
      </header>

      <main className="flex-1 md:ml-72 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full pb-24 md:pb-12">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 w-full bg-background border-t border-outline-variant/30 flex justify-around items-center h-16 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? 'text-on-secondary-fixed-variant bg-secondary-fixed/40' : 'text-on-surface-variant'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} filled={isActive} className="text-xl" />
                <span className="font-caption text-[10px] mt-1">
                  {variant === 'es' ? item.label : item.labelEn}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
