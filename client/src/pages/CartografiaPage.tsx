import { useState, type FormEvent } from 'react';
import { Icon } from '../components/Icon';
import { ASSETS } from '../theme/assets';

const emotions = [
  { value: 'calm', icon: 'self_improvement', label: 'Calma Serena' },
  { value: 'anxious', icon: 'waves', label: 'Marea Alta' },
  { value: 'low', icon: 'cloud', label: 'Bruma Densa' },
  { value: 'focused', icon: 'flare', label: 'Foco Claro' },
];

const weekBars = [
  { day: 'L', h: 'h-12' },
  { day: 'M', h: 'h-24' },
  { day: 'M', h: 'h-32', optimal: true },
  { day: 'J', h: 'h-16' },
  { day: 'V', h: 'h-20' },
  { day: 'S', h: 'h-40', optimal: true },
  { day: 'D', h: 'h-28' },
];

export function CartografiaPage() {
  const [emotion, setEmotion] = useState('');
  const [saved, setSaved] = useState(false);

  const handleJournal = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-stack-lg pb-8">
      <div className="hidden md:flex justify-between items-center mb-4">
        <h2 className="text-h2 font-h2 text-primary">Cartografía del Alma</h2>
        <img alt="Perfil" src={ASSETS.profileElena} className="w-10 h-10 rounded-full border border-outline-variant/30" />
      </div>

      <section className="text-center py-stack-md px-4">
        <blockquote className="text-h2 md:text-h1 font-h2 md:font-h1 text-secondary opacity-90 max-w-3xl mx-auto leading-relaxed">
          &ldquo;La mente es su propio lugar, y en sí misma puede hacer un cielo del infierno, o un infierno del cielo.&rdquo;
        </blockquote>
        <p className="mt-4 text-body-md font-body-md text-on-surface-variant tracking-widest uppercase">John Milton</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <section className="md:col-span-7 glass-card rounded-xl p-8 flex flex-col gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Icon name="water_drop" className="text-[120px]" />
          </div>
          <div className="relative z-10">
            <h3 className="text-h3 font-h3 text-primary mb-2 flex items-center gap-2">
              <Icon name="tune" className="text-secondary" />
              Resonancia Emocional
            </h3>
            <p className="text-body-md font-body-md text-on-surface-variant mb-6">
              Sintoniza con tu estado interior en este momento. Selecciona la frecuencia que mejor te describe.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {emotions.map((e) => (
                <label key={e.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="emotion"
                    value={e.value}
                    className="peer sr-only"
                    checked={emotion === e.value}
                    onChange={() => setEmotion(e.value)}
                  />
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/50 bg-surface/50 hover:bg-surface peer-checked:border-secondary peer-checked:bg-secondary-container/20 peer-checked:shadow-sm text-center gap-2 h-full">
                    <Icon name={e.icon} className="text-on-surface-variant peer-checked:text-secondary text-3xl" />
                    <span className="font-label-md text-label-md text-on-surface">{e.label}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                disabled={!emotion}
                className="px-6 py-3 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                Registrar Estado
              </button>
            </div>
          </div>
        </section>

        <section className="md:col-span-5 glass-card rounded-xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-h3 font-h3 text-primary mb-2 flex items-center gap-2">
              <Icon name="show_chart" className="text-secondary" />
              Ritmo Semanal
            </h3>
            <p className="text-caption font-caption text-on-surface-variant mb-6">Tu flujo de energía y estabilidad.</p>
            <div className="relative h-48 w-full flex items-end justify-between gap-2 px-2 pb-4 border-b border-outline-variant/30">
              {weekBars.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t-sm ${bar.h} ${
                      bar.optimal ? 'bg-primary-fixed' : 'bg-secondary-container/50 hover:bg-secondary/70'
                    } transition-colors cursor-pointer`}
                  />
                  <span className="text-caption font-caption text-on-surface-variant mt-2">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <span className="text-caption font-caption text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-fixed inline-block" /> Días Óptimos
            </span>
            <span className="text-caption font-caption text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary-container/50 inline-block" /> Observación
            </span>
          </div>
        </section>

        <section className="md:col-span-12 glass-card rounded-xl p-8 lg:p-12 mt-4">
          <div className="mb-8 border-b border-outline-variant/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-h2 font-h2 text-primary mb-2 flex items-center gap-3">
                <Icon name="psychology" className="text-3xl text-secondary" />
                Registro de Pensamientos
              </h3>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
                Un espacio estructurado para desenredar narrativas automáticas y cultivar perspectivas alternativas más equilibradas.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-caption font-caption bg-surface-container-high px-3 py-1 rounded-full text-on-surface-variant">
              <Icon name="lock" className="text-[16px]" /> Privado y Seguro
            </span>
          </div>

          {saved && (
            <p className="mb-4 text-primary bg-primary-fixed/30 px-4 py-2 rounded-lg font-label-md">
              Entrada guardada en tu diario privado.
            </p>
          )}

          <form onSubmit={handleJournal} className="space-y-stack-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <div className="space-y-2">
                <label htmlFor="situation" className="block font-label-md text-label-md text-on-surface">
                  1. La Situación
                </label>
                <p className="text-caption font-caption text-on-surface-variant mb-2">
                  ¿Qué sucedió? ¿Dónde estabas? ¿Con quién?
                </p>
                <textarea
                  id="situation"
                  rows={3}
                  placeholder="Describe los hechos objetivamente..."
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="thought" className="block font-label-md text-label-md text-on-surface">
                  2. Pensamiento Automático
                </label>
                <p className="text-caption font-caption text-on-surface-variant mb-2">
                  ¿Qué pasó por tu mente en ese instante?
                </p>
                <textarea
                  id="thought"
                  rows={3}
                  placeholder="La voz crítica interna decía..."
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <label htmlFor="response" className="block font-label-md text-label-md text-on-surface flex items-center gap-2">
                3. Respuesta Alternativa
                <Icon name="wb_incandescent" className="text-secondary text-[18px]" />
              </label>
              <textarea
                id="response"
                rows={4}
                placeholder="Redacta una perspectiva más compasiva y realista..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-4 text-body-md focus:ring-1 focus:ring-secondary focus:border-secondary resize-none"
              />
            </div>
            <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4 border-t border-outline-variant/30">
              <button
                type="button"
                className="px-6 py-3 border border-secondary text-primary rounded-lg font-label-md text-label-md hover:bg-secondary/10"
              >
                Guardar Borrador
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container shadow-sm"
              >
                Sellar en el Diario
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
