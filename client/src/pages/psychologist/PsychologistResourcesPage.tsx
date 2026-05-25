import { Icon } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { AnimatedPage, StaggerItem, StaggerList } from '../../components/motion';

const protocols = [
  { name: 'Registro pensamientos ABC', icon: 'edit_note' },
  { name: 'Jerarquía de exposición', icon: 'stairs' },
  { name: 'Activación conductual', icon: 'directions_run' },
  { name: 'Experimentos conductuales', icon: 'science' },
  { name: 'Prevención de recaída', icon: 'shield' },
];

export function PsychologistResourcesPage() {
  return (
    <AnimatedPage>
      <PageHeader
        title="Protocolos TCC"
        subtitle="Plantillas para asignar a pacientes desde el expediente."
      />
      <StaggerList className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {protocols.map((p) => (
          <StaggerItem key={p.name}>
            <button
              type="button"
              className="card-clinical-hover w-full p-5 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center">
                <Icon name={p.icon} className="text-accent text-2xl" />
              </div>
              <span className="font-semibold text-clinical-900">{p.name}</span>
            </button>
          </StaggerItem>
        ))}
      </StaggerList>
    </AnimatedPage>
  );
}
