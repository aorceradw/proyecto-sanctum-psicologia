import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { ASSETS } from '../theme/assets';

export function SanctuaryPremiumPage() {
  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0 bg-watermark z-0" />

      <header className="mb-stack-lg flex justify-between items-end relative z-10">
        <div>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary">
            Good morning, Elena.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-unit">
            Welcome to your sanctuary.
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <button type="button" className="p-2 rounded-full border border-outline-variant text-primary hover:bg-surface-variant">
            <Icon name="notifications" />
          </button>
          <img alt="Profile" src={ASSETS.profileElena} className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter relative z-10">
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
            <img alt="Pegasus" src={ASSETS.pegasusWatermark} className="w-64 h-64 object-contain" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-stack-sm">
                <Icon name="spa" filled className="text-secondary" />
                <h2 className="font-h3 text-h3 text-primary">Morning Ritual</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Begin your day with intention. A guided 10-minute session to center your thoughts and set a positive tone.
              </p>
            </div>
            <div className="mt-stack-lg flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-12 h-1 bg-secondary rounded-full" />
                <div className="w-12 h-1 bg-surface-variant rounded-full" />
                <div className="w-12 h-1 bg-surface-variant rounded-full" />
              </div>
              <Link
                to="/rituales"
                className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary-container transition-colors"
              >
                Begin Session
                <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
        </section>

        <div className="lg:col-span-4 flex flex-col gap-gutter">
          {[
            { icon: 'edit_note', title: 'Register Thoughts', desc: 'Capture your current state of mind.' },
            { icon: 'architecture', title: 'Map Emotion', desc: 'Check-in with your emotional landscape.' },
          ].map((action) => (
            <Link
              key={action.title}
              to="/cartografia"
              className="flex-1 bg-surface-container-low rounded-xl p-stack-md border border-outline-variant hover:border-secondary hover:bg-surface-container transition-all text-left flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between w-full">
                <Icon name={action.icon} className="text-3xl text-secondary group-hover:scale-110 transition-transform" />
                <Icon name="north_east" className="text-on-surface-variant opacity-50 group-hover:opacity-100" />
              </div>
              <div className="mt-stack-sm">
                <h3 className="font-label-md text-label-md text-primary">{action.title}</h3>
                <p className="font-caption text-caption text-on-surface-variant mt-1">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <section className="lg:col-span-12 mt-stack-md">
          <h2 className="font-h3 text-h3 text-primary mb-stack-md">Weekly Harmony</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { icon: 'bedtime', label: 'Sleep', stat: '7h avg', pct: 85 },
              { icon: 'directions_run', label: 'Movement', stat: '3/5 days', pct: 60 },
              { icon: 'self_improvement', label: 'Mindfulness', stat: '4 sessions', pct: 75 },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md text-primary flex items-center gap-2">
                    <Icon name={m.icon} className="text-on-surface-variant" />
                    {m.label}
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">{m.stat}</span>
                </div>
                <ProgressBar percent={m.pct} />
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-12 mt-stack-md">
          <div className="flex justify-between items-end mb-stack-md">
            <h2 className="font-h3 text-h3 text-primary">Curated for You</h2>
            <span className="font-label-md text-label-md text-secondary flex items-center">
              View Library <Icon name="chevron_right" className="text-sm ml-1" />
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden group cursor-pointer hover:shadow-md transition-all">
              <div className="h-32 bg-surface-variant overflow-hidden">
                <img
                  alt="Meditation"
                  src={ASSETS.meditation}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-stack-sm flex flex-col gap-2">
                <span className="font-caption text-caption text-secondary tracking-widest uppercase">Article</span>
                <h3 className="font-label-md text-label-md text-primary">The Art of Stillness</h3>
                <p className="font-caption text-caption text-on-surface-variant line-clamp-2">
                  Exploring techniques to find quiet moments in a busy day.
                </p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden group cursor-pointer hover:shadow-md transition-all">
              <div className="h-32 bg-surface-variant flex items-center justify-center">
                <Icon name="headphones" className="text-4xl text-on-surface-variant" />
              </div>
              <div className="p-stack-sm flex flex-col gap-2">
                <span className="font-caption text-caption text-secondary tracking-widest uppercase">Audio</span>
                <h3 className="font-label-md text-label-md text-primary">Guided Body Scan</h3>
                <p className="font-caption text-caption text-on-surface-variant line-clamp-2">
                  A 15-minute audio session designed to release physical tension before sleep.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
