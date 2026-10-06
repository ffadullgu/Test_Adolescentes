import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types/psychometrics';
import { ShieldCheck, UserCheck, Lock, FileCheck2, Settings, EyeOff } from 'lucide-react';

interface AuthAndConsentViewProps {
  currentUser: UserProfile;
  onLoginDemoUser: () => void;
  onRegisterNewUser: (profileData: {
    firstName: string;
    lastName: string;
    birthDate: string;
    sex: UserProfile['sex'];
    socioeconomicStratum: 1 | 2 | 3 | 4 | 5 | 6;
    email: string;
    password: string;
    colombianConsentAccepted: boolean;
    reEvaluationIntervalMonths: 3 | 6 | 12;
  }) => Promise<void>;
  isSubmitting: boolean;
  focusRegisterTrigger?: number;
  showConfigs?: boolean;
  onToggleConfigs?: () => void;
}

export const AuthAndConsentView: React.FC<AuthAndConsentViewProps> = ({
  currentUser,
  onLoginDemoUser,
  onRegisterNewUser,
  isSubmitting,
  focusRegisterTrigger = 0,
  showConfigs = false,
  onToggleConfigs
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('2010-08-15');
  const [sex, setSex] = useState<UserProfile['sex']>('Femenino');
  const [stratum, setStratum] = useState<1 | 2 | 3 | 4 | 5 | 6>(3);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [intervalMonths, setIntervalMonths] = useState<3 | 6 | 12>(6);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const registerFormRef = useRef<HTMLFormElement | null>(null);
  const firstNameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focusRegisterTrigger > 0) {
      registerFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        firstNameInputRef.current?.focus();
      }, 150);
    }
  }, [focusRegisterTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!firstName.trim() || !lastName.trim() || !birthDate || !email.trim()) {
      setFormError('Por favor complete todos los campos obligatorios del adolescente.');
      return;
    }

    if (!consentAccepted) {
      setFormError(
        'Es obligatorio autorizar el tratamiento de datos personales conforme a la Ley Estatutaria 1581 de 2012 de Colombia.'
      );
      return;
    }

    await onRegisterNewUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate,
      sex,
      socioeconomicStratum: stratum,
      email: email.trim(),
      password: password || 'Colombia2026!',
      colombianConsentAccepted: consentAccepted,
      reEvaluationIntervalMonths: intervalMonths
    });
  };

  return (
    <section aria-labelledby="auth-consent-heading" className="space-y-6">
      {/* Barra superior con acceso directo al Formulario y botón para Ocultar/Mostrar Configuraciones */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">
            Registro de Participantes · Ley Estatutaria 1581 de 2012 (Habeas Data Colombia)
          </p>
          <h2 id="auth-consent-heading" className="text-xl font-semibold text-slate-900 mt-0.5">
            Registrar o Cambiar Adolescente Evaluado
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onToggleConfigs && (
            <button
              type="button"
              onClick={onToggleConfigs}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              {showConfigs ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
                  <span>Ocultar Configuraciones</span>
                </>
              ) : (
                <>
                  <Settings className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                  <span>Mostrar Configuraciones (SMTP y W3C)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal (Primero en orden visual): Formulario de Registro de Nuevo Adolescente */}
        <div className="lg:col-span-7 order-1">
          <form
            id="register-adolescent-form"
            ref={registerFormRef}
            onSubmit={handleSubmit}
            aria-labelledby="register-form-title"
            className="bg-white border-2 border-blue-600/20 rounded-lg p-6 md:p-8 space-y-6 shadow-sm"
          >
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs font-semibold text-blue-800">
                Formulario Estandarizado W3C WCAG 2.1 · Recolección Sociodemográfica
              </p>
              <h3 id="register-form-title" className="text-xl font-semibold text-slate-900 mt-1">
                Registrar Nuevo Adolescente y Firmar Consentimiento Informado
              </h3>
            </div>

            {formError && (
              <div
                role="alert"
                className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 font-medium"
              >
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Nombres del Adolescente *
                </label>
                <input
                  id="firstName"
                  ref={firstNameInputRef}
                  type="text"
                  required
                  placeholder="Ej. Santiago Andrés"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
                />
              </div>

            <div>
              <label htmlFor="lastName" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Apellidos del Adolescente *
              </label>
              <input
                id="lastName"
                type="text"
                required
                placeholder="Ej. Martínez Rojas"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Fecha de Nacimiento *
              </label>
              <input
                id="birthDate"
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
              />
            </div>

            <div>
              <label htmlFor="sex" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Sexo *
              </label>
              <select
                id="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value as UserProfile['sex'])}
                className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
              >
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="No binario / Intersexual">No binario / Intersexual</option>
                <option value="Prefiero no responder">Prefiero no responder</option>
              </select>
            </div>

            <div>
              <label htmlFor="stratum" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Estrato Socioeconómico (Clasificación DANE Colombia) *
              </label>
              <select
                id="stratum"
                value={stratum}
                onChange={(e) => setStratum(Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6)}
                className="w-full px-3.5 py-2 text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
              >
                <option value={1}>Estrato 1 (Bajo - Bajo)</option>
                <option value={2}>Estrato 2 (Bajo)</option>
                <option value={3}>Estrato 3 (Medio - Bajo)</option>
                <option value={4}>Estrato 4 (Medio)</option>
                <option value={5}>Estrato 5 (Medio - Alto)</option>
                <option value={6}>Estrato 6 (Alto)</option>
              </select>
            </div>

            <div>
              <label htmlFor="intervalMonths" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Período de Seguimiento Longitudinal *
              </label>
              <select
                id="intervalMonths"
                value={intervalMonths}
                onChange={(e) => setIntervalMonths(Number(e.target.value) as 3 | 6 | 12)}
                className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
              >
                <option value={6}>Cada 6 meses (Recomendado Clínicamente)</option>
                <option value={3}>Cada 3 meses (Seguimiento Intensivo)</option>
                <option value={12}>Cada 12 meses (Seguimiento Anual)</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Correo Electrónico del Adolescente o Acudiente *
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="adolescente@colegio.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Contraseña de Acceso Seguro *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-2 focus:outline-blue-700"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Cláusula de Consentimiento Informado y Habeas Data (Colombia) */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <FileCheck2 className="w-4 h-4 text-blue-700" aria-hidden="true" />
              <span>
                Acuerdo de Confidencialidad y Autorización de Tratamiento de Datos Personales (Colombia)
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> (Régimen General de Protección de Datos Personales en Colombia), el <strong>Decreto Reglamentario 1377 de 2013</strong>, el artículo 33 de la <strong>Ley 1098 de 2006</strong> (Código de la Infancia y la Adolescencia) y la <strong>Ley 1090 de 2006</strong> (Secreto Profesional en Psicología), autorizo de manera libre, previa, expresa e informada el tratamiento de mis datos sociodemográficos y respuestas psicométricas con la finalidad exclusiva de realizar la valoración de CI (Wechsler), Personalidad (Big Five), Estilo de Aprendizaje (Kolb/VARK), Orientación Vocacional (CHASIDE) y Percepción (PES), así como la remisión confidencial del Informe Ejecutivo al correo profesional <strong>ffadullgu@yahoo.com</strong>.
            </p>

            <label
              htmlFor="colombianConsent"
              className="flex items-start gap-3 pt-2 cursor-pointer"
            >
              <input
                id="colombianConsent"
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
              />
              <span className="text-xs font-semibold text-slate-900">
                Acepto expresamente la Política de Tratamiento de Datos Personales y el Acuerdo de Confidencialidad conforme a la legislación colombiana vigente. *
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? 'Registrando Perfil...'
                : 'Registrar Participante e Iniciar Batería Psicométrica'}
            </button>
          </div>
        </form>
      </div>

      {/* Columna Secundaria: Perfil Activo / Marco Normativo Colombiano */}
      <div className="lg:col-span-5 order-2 space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <UserCheck className="w-4 h-4" aria-hidden="true" />
            <span>Sesión Activa Verificada</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mt-1">
            Expediente Activo del Adolescente
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Actualmente estás visualizando el expediente de demostración con seguimiento longitudinal de 12 meses (3 evaluaciones semestrales), o puedes registrar un nuevo participante en el formulario principal.
          </p>

          <dl className="mt-5 divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-500">Nombre y Apellido:</dt>
              <dd className="font-semibold text-slate-900">
                {currentUser.firstName} {currentUser.lastName}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-500">Fecha de Nacimiento:</dt>
              <dd className="font-mono tabular-nums text-slate-900">{currentUser.birthDate}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-500">Sexo:</dt>
              <dd className="text-slate-900">{currentUser.sex}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-500">Estrato Socioeconómico (DANE):</dt>
              <dd className="font-mono tabular-nums font-semibold text-slate-900">
                Estrato {currentUser.socioeconomicStratum}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-500">Correo Electrónico:</dt>
              <dd className="font-mono text-slate-900">{currentUser.email}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-500">Consentimiento Ley 1581/2012:</dt>
              <dd className="text-emerald-700 font-semibold">Firmado y vigente</dd>
            </div>
          </dl>

          <div className="mt-5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onLoginDemoUser}
              className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Continuar con el Expediente Longitudinal de Valentina Gómez
            </button>
          </div>
        </div>

        {/* Marco Normativo Colombiano de Protección de Datos */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Cumplimiento Normativo en la República de Colombia</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Protección de Datos y Secreto Profesional Psicológico
          </h3>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
            <li>
              <strong>Ley Estatutaria 1581 de 2012 y Decreto 1377 de 2013 (Habeas Data):</strong> Garantiza el derecho constitucional que tienen todas las personas a conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bases de datos.
            </li>
            <li>
              <strong>Ley 1098 de 2006 (Código de la Infancia y la Adolescencia · Art. 33):</strong> Protección especial de datos sensibles de niños, niñas y adolescentes, asegurando que el tratamiento responda al interés superior del adolescente y fines estrictamente educativos y de orientación vocacional.
            </li>
            <li>
              <strong>Ley 1090 de 2006 (Código Deontológico y Bioético del Psicólogo):</strong> Reserva absoluta de los resultados psicométricos, remitidos únicamente al adolescente/acudiente y al profesional supervisor (<code className="font-mono">ffadullgu@yahoo.com</code>).
            </li>
          </ul>
        </div>
      </div>
      </div>
    </section>
  );
};
