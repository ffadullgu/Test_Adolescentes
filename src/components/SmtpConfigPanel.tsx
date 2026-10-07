import React, { useState, useEffect } from 'react';
import { SmtpConfiguration } from '../types/psychometrics';
import { Mail, Save, Server, Lock, CheckCircle2, RefreshCw, EyeOff, Settings } from 'lucide-react';

interface SmtpConfigPanelProps {
  smtpConfig: SmtpConfiguration;
  onSaveSmtpConfig: (updated: SmtpConfiguration) => Promise<void>;
  onTestSmtpSend?: () => Promise<void>;
  isSaving: boolean;
  defaultOpen?: boolean;
  onHide?: () => void;
}

export const SMTP_PRESETS: Record<
  SmtpConfiguration['providerPreset'],
  { label: string; host: string; port: number; secure: boolean; defaultUser: string; note: string }
> = {
  yahoo: {
    label: 'Yahoo Mail (smtp.mail.yahoo.com)',
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
    defaultUser: 'ffadullgu@yahoo.com',
    note: 'Configuración oficial Yahoo Mail SMTPS (SSL/TLS en puerto 465 o STARTTLS en puerto 587).'
  },
  gmail: {
    label: 'Google Gmail (smtp.gmail.com)',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    defaultUser: 'adsoprocnca@gmail.com',
    note: 'Configuración oficial Google Workspace / Gmail SMTP (Puerto 587 STARTTLS o 465 SSL/TLS con Contraseña de Aplicación).'
  },
  outlook: {
    label: 'Outlook / Office 365 (smtp.office365.com)',
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    defaultUser: 'orientacion@institucion.edu.co',
    note: 'Configuración Microsoft 365 / Outlook SMTP con cifrado STARTTLS en el puerto 587.'
  },
  custom: {
    label: 'Servidor SMTP Institucional / Personalizado',
    host: 'smtp.servidor-institucional.co',
    port: 587,
    secure: false,
    defaultUser: 'psicologia@colegio.edu.co',
    note: 'Permite especificar manualmente cualquier host, puerto (25, 465, 587, 2525) y credenciales SMTP.'
  }
};

export const SmtpConfigPanel: React.FC<SmtpConfigPanelProps> = ({
  smtpConfig,
  onSaveSmtpConfig,
  onTestSmtpSend,
  isSaving,
  defaultOpen = false,
  onHide
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultOpen);
  const [preset, setPreset] = useState<SmtpConfiguration['providerPreset']>(smtpConfig.providerPreset || 'yahoo');
  const [host, setHost] = useState<string>(smtpConfig.host);
  const [port, setPort] = useState<number>(smtpConfig.port);
  const [secure, setSecure] = useState<boolean>(smtpConfig.secure);
  const [user, setUser] = useState<string>(smtpConfig.user);
  const [pass, setPass] = useState<string>(smtpConfig.pass || '');
  const [recipient, setRecipient] = useState<string>(smtpConfig.recipient);
  const [senderName, setSenderName] = useState<string>(smtpConfig.senderName || 'PsicoEval Colombia');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  useEffect(() => {
    setPreset(smtpConfig.providerPreset || 'yahoo');
    setHost(smtpConfig.host);
    setPort(smtpConfig.port);
    setSecure(smtpConfig.secure);
    setUser(smtpConfig.user);
    setPass(smtpConfig.pass || '');
    setRecipient(smtpConfig.recipient);
    setSenderName(smtpConfig.senderName || 'PsicoEval Colombia');
  }, [smtpConfig]);

  const handleApplyPreset = (selectedPreset: SmtpConfiguration['providerPreset']) => {
    const p = SMTP_PRESETS[selectedPreset];
    setPreset(selectedPreset);
    setHost(p.host);
    setPort(p.port);
    setSecure(p.secure);
    setUser(p.defaultUser);
    if (selectedPreset === 'gmail') {
      setRecipient('adsoprocnca@gmail.com');
    } else if (selectedPreset === 'yahoo') {
      setRecipient('ffadullgu@yahoo.com');
    }
    setSavedFeedback(null);
  };

  const handlePortChange = (newPort: number) => {
    setPort(newPort);
    if (newPort === 465) {
      setSecure(true);
    } else if (newPort === 587 || newPort === 2525 || newPort === 25) {
      setSecure(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(null);
    await onSaveSmtpConfig({
      providerPreset: preset,
      host: host.trim(),
      port: Number(port),
      secure,
      user: user.trim(),
      pass,
      recipient: recipient.trim(),
      senderName: senderName.trim() || 'PsicoEval Colombia',
      updatedAt: new Date().toISOString()
    });
    setSavedFeedback(
      `Valores SMTP actualizados correctamente: ${host.trim()}:${port} (${secure ? 'SSL/TLS' : 'STARTTLS'}) → Destinatario: ${recipient.trim()}`
    );
  };

  if (!isExpanded && !onHide) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <Server className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-slate-900">Configuraciones SMTP:</span>
          <span className="font-mono text-slate-800">
            {smtpConfig.host}:{smtpConfig.port} ({smtpConfig.secure ? 'SSL/TLS' : 'STARTTLS'})
          </span>
          <span aria-hidden="true">→</span>
          <strong className="font-mono text-blue-800">{smtpConfig.recipient}</strong>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-center cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
          <span>Mostrar Configuraciones SMTP</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 no-print">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
            <Server className="w-4 h-4" aria-hidden="true" />
            <span>Configuración Dinámica del Protocolo SMTP (RFC 5321 / SMTPS / STARTTLS)</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mt-1">
            Cambiar Valores del Servidor SMTP y Correo Destinatario
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Selecciona una plantilla preconfigurada (Yahoo, Gmail, Outlook) o personaliza manualmente el servidor Host, Puerto, Seguridad TLS/SSL, cuenta remitente y correo destinatario del Informe Ejecutivo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-mono">
            <span className="text-slate-500 block">Servidor Activo:</span>
            <strong className="text-slate-900">
              {smtpConfig.host}:{smtpConfig.port} ({smtpConfig.secure ? 'SSL/TLS' : 'STARTTLS'})
            </strong>
            <span className="text-blue-800 block truncate">→ {smtpConfig.recipient}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onHide) {
                onHide();
              } else {
                setIsExpanded(false);
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
            <span>Ocultar Configuraciones</span>
          </button>
        </div>
      </div>

      {/* Selector rápido de plantillas SMTP */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-700 block">
          1. Plantillas rápidas de proveedor SMTP:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {(['yahoo', 'gmail', 'outlook', 'custom'] as const).map((key) => {
            const p = SMTP_PRESETS[key];
            const isActive = preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleApplyPreset(key)}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-700 border-2 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-semibold block truncate">{p.label}</span>
                <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                  {p.host}:{p.port} ({p.secure ? 'SSL' : 'STARTTLS'})
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 italic">{SMTP_PRESETS[preset].note}</p>
      </div>

      {/* Formulario de edición de parámetros SMTP */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="smtp-host" className="block text-xs font-semibold text-slate-800 mb-1">
              Servidor Host SMTP *
            </label>
            <input
              id="smtp-host"
              type="text"
              required
              value={host}
              onChange={(e) => {
                setHost(e.target.value);
                setPreset('custom');
              }}
              placeholder="Ej. smtp.gmail.com o smtp.mail.yahoo.com"
              className="w-full px-3 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
            />
          </div>

          <div>
            <label htmlFor="smtp-port" className="block text-xs font-semibold text-slate-800 mb-1">
              Puerto SMTP *
            </label>
            <select
              id="smtp-port"
              value={port}
              onChange={(e) => handlePortChange(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
            >
              <option value={465}>465 (SMTPS · SSL/TLS Implícito)</option>
              <option value={587}>587 (SMTP · STARTTLS Explícito)</option>
              <option value={2525}>2525 (SMTP Alternativo Cloud)</option>
              <option value={25}>25 (SMTP Estándar Retransmisión)</option>
            </select>
          </div>

          <div>
            <label htmlFor="smtp-secure" className="block text-xs font-semibold text-slate-800 mb-1">
              Cifrado de Transporte
            </label>
            <select
              id="smtp-secure"
              value={secure ? 'true' : 'false'}
              onChange={(e) => setSecure(e.target.value === 'true')}
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
            >
              <option value="true">SSL / TLS Directo (secure: true · Pto 465)</option>
              <option value="false">STARTTLS (secure: false · Pto 587)</option>
            </select>
          </div>

          <div>
            <label htmlFor="smtp-sender-name" className="block text-xs font-semibold text-slate-800 mb-1">
              Nombre Visible del Remitente
            </label>
            <input
              id="smtp-sender-name"
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="PsicoEval Colombia"
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="smtp-user" className="block text-xs font-semibold text-slate-800 mb-1">
              Usuario / Correo Autenticación SMTP (SMTP_USER) *
            </label>
            <input
              id="smtp-user"
              type="email"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="ffadullgu@yahoo.com o adsoprocnca@gmail.com"
              className="w-full px-3 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
            />
          </div>

          <div>
            <label htmlFor="smtp-pass" className="block text-xs font-semibold text-slate-800 mb-1">
              Contraseña de Aplicación SMTP (SMTP_PASS)
            </label>
            <div className="relative">
              <input
                id="smtp-pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="App Password de 16 caracteres"
                className="w-full px-3 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="smtp-recipient" className="block text-xs font-semibold text-slate-800 mb-1">
              Correo Destinatario del Informe Ejecutivo *
            </label>
            <div className="relative">
              <input
                id="smtp-recipient"
                type="email"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="ffadullgu@yahoo.com"
                className="w-full px-3 py-2 text-xs font-mono font-semibold text-blue-900 bg-blue-50/50 border border-blue-300 rounded-lg focus:outline-2 focus:outline-blue-700"
              />
              <Mail className="w-3.5 h-3.5 text-blue-700 absolute right-3 top-2.5" aria-hidden="true" />
            </div>
          </div>
        </div>

        {savedFeedback && (
          <div
            role="status"
            className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>{savedFeedback}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Accesos rápidos destinatario:</span>
            <button
              type="button"
              onClick={() => setRecipient('ffadullgu@yahoo.com')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-[11px] cursor-pointer"
            >
              ffadullgu@yahoo.com
            </button>
            <button
              type="button"
              onClick={() => setRecipient('adsoprocnca@gmail.com')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-[11px] cursor-pointer"
            >
              adsoprocnca@gmail.com
            </button>
          </div>

          <div className="flex items-center gap-3">
            {onTestSmtpSend && (
              <button
                type="button"
                disabled={isSaving}
                onClick={onTestSmtpSend}
                className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Probar Envío con estos Valores</span>
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Valores SMTP'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
