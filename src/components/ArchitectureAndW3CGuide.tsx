import React from 'react';
import { Server, Shield, Mail, CheckCircle2, Terminal, Database, EyeOff } from 'lucide-react';
import { DOMAIN_THEMES } from '../data/psychometricTests';
import { TestDomain } from '../types/psychometrics';

interface ArchitectureAndW3CGuideProps {
  onHide?: () => void;
}

export const ArchitectureAndW3CGuide: React.FC<ArchitectureAndW3CGuideProps> = ({ onHide }) => {
  const domains: TestDomain[] = ['ci', 'personality', 'learning', 'vocation', 'esp'];

  return (
    <section aria-labelledby="arch-w3c-heading" className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">
            Especificación Técnica W3C · Protocolo SMTP Yahoo · Base de Datos &amp; Despliegue
          </p>
          <h2 id="arch-w3c-heading" className="text-2xl font-semibold text-slate-900 mt-1">
            Arquitectura del Sistema, Normas W3C e Instrucciones de Despliegue
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Documentación integral del diseño frontend y backend, configuración del protocolo SMTP para <code className="font-mono font-semibold text-slate-900">ffadullgu@yahoo.com</code>, alineación cromática psicológica y cumplimiento de estándares W3C WCAG 2.1.
          </p>
        </div>

        {onHide && (
          <button
            type="button"
            onClick={onHide}
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
            <span>Ocultar Configuraciones</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Configuración Protocolo SMTP (ffadullgu@yahoo.com) */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>Protocolo de Correo saliente (RFC 5321 / SMTPS)</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Configuración SMTP para ffadullgu@yahoo.com
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            El servidor Express (<code className="font-mono">server.ts</code>) utiliza <code className="font-mono">nodemailer</code> configurado con los parámetros oficiales de Yahoo Mail para despachar automáticamente el Informe Ejecutivo tras finalizar las pruebas:
          </p>

          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto space-y-1">
            <p className="text-slate-400"># Variables de entorno (.env) para Yahoo Mail SMTP</p>
            <p>SMTP_HOST="smtp.mail.yahoo.com"</p>
            <p>SMTP_PORT="465"            # 465 (SSL/TLS implícito) o 587 (STARTTLS)</p>
            <p>SMTP_SECURE="true"         # true para puerto 465</p>
            <p>SMTP_USER="ffadullgu@yahoo.com"</p>
            <p>SMTP_PASS="CONTRASEÑA_DE_APLICACION_YAHOO_16_DIGITOS"</p>
            <p>SMTP_RECIPIENT="ffadullgu@yahoo.com"</p>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Nota técnica de seguridad Yahoo: Para cuentas <code className="font-mono">@yahoo.com</code> con verificación en dos pasos, Yahoo requiere generar una <em>Contraseña de Aplicación (App Password)</em> en <em>Seguridad de la cuenta &gt; Generar contraseña de aplicación</em> e ingresarla en <code className="font-mono">SMTP_PASS</code>.
          </p>
        </div>

        {/* 2. Cumplimiento de Accesibilidad y Buenas Prácticas W3C */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Shield className="w-4 h-4" aria-hidden="true" />
            <span>Estándares W3C · WCAG 2.1 Nivel AA / AAA &amp; WAI-ARIA 1.2</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Auditoría de Accesibilidad y Semántica W3C
          </h3>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Landmarks Semánticos HTML5:</strong> Uso estricto de <code className="font-mono">&lt;header&gt;</code>, <code className="font-mono">&lt;nav&gt;</code>, <code className="font-mono">&lt;main id="main-content"&gt;</code>, <code className="font-mono">&lt;section&gt;</code>, <code className="font-mono">&lt;article&gt;</code>, <code className="font-mono">&lt;fieldset&gt;</code> y <code className="font-mono">&lt;legend&gt;</code> en cada uno de los 125 reactivos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Contraste Cromático Verificado (WCAG 1.4.3):</strong> Relación de contraste superior a 7:1 en textos principales (<code className="font-mono">#0F172A</code> sobre <code className="font-mono">#FFFFFF</code>) y ≥ 4.5:1 en todos los acentos de pruebas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>No Señalización Solo por Color (WCAG 1.4.1):</strong> Cada estado psicométrico combina color, etiqueta textual explícita, código alfanumérico y numeral tabular (<code className="font-mono">tabular-nums</code>).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Respeto a <code className="font-mono">prefers-reduced-motion</code>:</strong> Desactivación automática de transiciones para usuarios con sensibilidad vestibular o motora.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Matriz de Alineación Cromática Psicológica */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Sistema Cromático Alineado con cada Prueba Psicológica
        </h3>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 pr-4 font-semibold">Aspecto Evaluado (25 Reactivos c/u)</th>
                <th className="py-2.5 px-4 font-semibold">Base Científica</th>
                <th className="py-2.5 px-4 font-semibold">Color Asociado &amp; Hex</th>
                <th className="py-2.5 pl-4 font-semibold">Justificación en Psicología del Color</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {domains.map((d) => {
                const t = DOMAIN_THEMES[d];
                return (
                  <tr key={d}>
                    <td className={`py-3 pr-4 font-semibold ${t.textClass}`}>{t.title}</td>
                    <td className="py-3 px-4 text-slate-700">{t.methodology}</td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className="inline-block w-3 h-3 rounded-sm mr-2 align-middle"
                        style={{ backgroundColor: t.primaryHex }}
                      />
                      {t.colorName} ({t.primaryHex})
                    </td>
                    <td className="py-3 pl-4 text-slate-600">{t.psychRationale}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Instrucciones de Despliegue y Base de Datos */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Terminal className="w-4 h-4" aria-hidden="true" />
          <span>Guía Paso a Paso de Despliegue Full-Stack (Frontend React 19 + Backend Express/Node.js)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
              1. Instalación y Variables de Entorno
            </p>
            <pre className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-[11px] overflow-x-auto">
{`npm install
cp .env.example .env
# Configurar SMTP_PASS de
# ffadullgu@yahoo.com`}
            </pre>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
              2. Compilación y Verificación TypeScript
            </p>
            <pre className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-[11px] overflow-x-auto">
{`npm run lint
npm run build
# Genera bundle optimizado
# en directorio /dist`}
            </pre>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-orange-700" aria-hidden="true" />
              3. Ejecución en Producción (Puerto 3000)
            </p>
            <pre className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-[11px] overflow-x-auto">
{`NODE_ENV=production npm start
# Servidor activo en:
# http://0.0.0.0:3000`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
