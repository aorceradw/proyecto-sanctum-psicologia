import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function InvitePanel({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}/crear-cuenta?rol=paciente&codigo=${inviteCode}`;
  const message = `Hola, regístrate en Sanctum (app de seguimiento terapéutico) con este código: ${inviteCode}\n\nEnlace directo: ${inviteLink}`;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="card-clinical p-6 border-l-4 border-l-secondary">
      <h2 className="font-bold text-primary flex items-center gap-2 mb-1">
        <Icon name="person_add" className="text-secondary" />
        Invitar pacientes
      </h2>
      <p className="text-sm text-on-surface-variant mb-4">
        Comparte el código o el enlace. Solo quien se registre con él aparecerá en tu lista.
      </p>

      <div className="bg-surface-container rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
          Código
        </p>
        <p className="text-2xl font-bold tracking-widest text-secondary tabular-nums">{inviteCode}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => copy(message)} className="btn-primary text-sm">
          <Icon name={copied ? 'check' : 'content_copy'} />
          {copied ? 'Copiado' : 'Copiar invitación'}
        </button>
        <button type="button" onClick={() => copy(inviteLink)} className="btn-secondary text-sm">
          <Icon name="link" />
          Solo enlace
        </button>
      </div>

      <p className="text-xs text-on-surface-variant mt-4">
        El paciente elige <strong>Soy paciente</strong> en{' '}
        <Link to="/crear-cuenta?rol=paciente" className="text-secondary font-semibold hover:underline">
          crear cuenta
        </Link>{' '}
        e introduce el código.
      </p>
    </div>
  );
}
