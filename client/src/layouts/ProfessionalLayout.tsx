import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ASSETS } from '../theme/assets';
import { useAuth } from '../context/AuthContext';

const navEs = [
  { to: '/profesional', icon: 'dashboard', label: 'Panel Principal' },
  { to: '/profesional/paciente/elena-m', icon: 'group', label: 'Directorio Pacientes' },
  { to: '/profesional/en', icon: 'dashboard', label: 'Dashboard (EN)' },
];

const navEn = [
  { to: '/profesional/en', icon: 'dashboard', label: 'Dashboard' },
  { to: '/profesional/paciente/elena-m', icon: 'groups', label: 'Patients' },
];

export function ProfessionalLayout({ locale = 'es' }: { locale?: 'es' | 'en' }) {
  const items = locale === 'es' ? navEs : navEn;
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-surface">
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant/20 p-stack-md z-40">
        <div className="flex flex-col items-center mb-stack-lg px-2">
          <img alt="Sanctum" src={ASSETS.pegasus} className="h-16 w-16 object-contain mb-4" />
          <img alt="Sanctum" src={ASSETS.logoFull} className="h-6 object-contain mb-2" />
          <p className="text-caption font-caption text-on-surface-variant">
            {locale === 'es' ? 'Portal Profesional' : 'Professional Suite'}
          </p>
        </div>
        <div className="flex flex-col gap-unit flex-grow px-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/profesional' || item.to === '/profesional/en'}
              className={({ isActive }) =>
                `flex items-center gap-stack-sm rounded-xl p-3 transition-all ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container opacity-80'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} filled={isActive} />
                  <span className="text-label-md font-label-md">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="mt-auto w-full bg-primary text-on-primary py-3 rounded-lg text-label-md font-label-md hover:opacity-90"
        >
          {locale === 'es' ? 'Cerrar sesión' : 'Logout'}
        </button>
      </nav>

      <header className="md:hidden flex justify-between items-center w-full px-margin-mobile h-20 bg-surface fixed top-0 border-b border-outline-variant/30 z-50">
        <div className="flex items-center gap-2">
          <img alt="Sanctum" src={ASSETS.pegasus} className="h-8 w-8" />
          <span className="text-h3 font-h3 tracking-widest text-secondary">SANCTUM</span>
        </div>
        <button type="button" className="text-on-surface-variant p-2">
          <Icon name="menu" />
        </button>
      </header>

      <main className="flex-1 md:ml-64 pt-20 md:pt-0 p-margin-mobile md:p-margin-desktop overflow-y-auto w-full max-w-container-max mx-auto pb-24">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low border-t border-outline-variant/20 z-50">
        <ul className="flex justify-around items-center h-16">
          {items.slice(0, 3).map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} filled={isActive} />
                    <span className="font-caption text-[10px]">{item.label.split(' ')[0]}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
