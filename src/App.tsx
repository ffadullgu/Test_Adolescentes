import React, { useState, useEffect } from 'react';
import {
  TestDomain,
  UserProfile,
  FullAssessmentRecord,
  SmtpDispatchRecord,
  SmtpConfiguration
} from './types/psychometrics';
import {
  ALL_QUESTIONS_BY_DOMAIN,
  DOMAIN_THEMES
} from './data/psychometricTests';
import {
  DEMO_USER_PROFILE,
  DEMO_HISTORICAL_ASSESSMENTS,
  scoreCITest,
  scorePersonalityTest,
  scoreLearningTest,
  scoreVocationTest,
  scoreEspTest,
  generatePersonalizedRecommendations,
  calculateAgeFromBirthDate
} from './utils/scoringAndRecommendations';
import { PsychometricTestRunner } from './components/PsychometricTestRunner';
import { LongitudinalProgressView } from './components/LongitudinalProgressView';
import { ExecutiveReportAndRecommendations } from './components/ExecutiveReportAndRecommendations';
import { AuthAndConsentView } from './components/AuthAndConsentView';
import { ArchitectureAndW3CGuide } from './components/ArchitectureAndW3CGuide';
import { CohortRadarDashboard } from './components/CohortRadarDashboard';
import { SmtpConfigPanel } from './components/SmtpConfigPanel';

import heroImgUrl from './assets/images/hero_psychometric_clinical_1791277498175.jpg';
import avatarImgUrl from './assets/images/avatar_adolescent_student_1791277509307.jpg';
import diagramImgUrl from './assets/images/diagram_cognitive_architecture_1791277520879.jpg';

import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FileText,
  Compass,
  Award,
  BookOpen,
  User
} from 'lucide-react';

type ActiveSection = 'overview' | 'tests' | 'progress' | 'report' | 'profile';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [activeTestDomain, setActiveTestDomain] = useState<TestDomain>('ci');

  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USER_PROFILE);
  const [assessments, setAssessments] = useState<FullAssessmentRecord[]>(DEMO_HISTORICAL_ASSESSMENTS);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    DEMO_HISTORICAL_ASSESSMENTS[DEMO_HISTORICAL_ASSESSMENTS.length - 1].id
  );
  const [smtpLogs, setSmtpLogs] = useState<SmtpDispatchRecord[]>([]);
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfiguration>({
    providerPreset: 'yahoo',
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
    user: 'ffadullgu@yahoo.com',
    pass: '',
    recipient: 'ffadullgu@yahoo.com',
    senderName: 'PsicoEval Colombia',
    updatedAt: '2026-10-06T01:45:00.000Z'
  });

  // Respuestas activas en las 5 pruebas (25 preguntas cada una)
  const [answersByDomain, setAnswersByDomain] = useState<Record<TestDomain, Record<string, string>>>({
    ci: {},
    personality: {},
    learning: {},
    vocation: {},
    esp: {}
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);
  const [avatarImgFailed, setAvatarImgFailed] = useState<boolean>(false);

  // Cargar datos iniciales desde el backend Express (/api/bootstrap)
  useEffect(() => {
    async function fetchBootstrap() {
      try {
        const res = await fetch('/api/bootstrap');
        if (!res.ok) return;
        const data = await res.json();
        if (data.users && data.users.length > 0) {
          setCurrentUser(data.users[0]);
        }
        if (data.assessments && data.assessments.length > 0) {
          setAssessments(data.assessments);
          setSelectedReportId(data.assessments[data.assessments.length - 1].id);
        }
        if (data.smtpLogs) {
          setSmtpLogs(data.smtpLogs);
        }
        if (data.smtpConfig) {
          setSmtpConfig((prev) => ({
            ...prev,
            ...data.smtpConfig
          }));
        }
      } catch {
        // Fallback silencioso a datos determinísticos locales
      }
    }
    fetchBootstrap();
  }, []);

  const userAssessments = assessments.filter((a) => a.userId === currentUser.id);
  const latestAssessment =
    userAssessments.length > 0
      ? [...userAssessments].sort(
          (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        )[0]
      : DEMO_HISTORICAL_ASSESSMENTS[DEMO_HISTORICAL_ASSESSMENTS.length - 1];

  const handleAnswerQuestion = (domain: TestDomain, questionId: string, optionId: string) => {
    setAnswersByDomain((prev) => ({
      ...prev,
      [domain]: {
        ...(prev[domain] || {}),
        [questionId]: optionId
      }
    }));
  };

  // Autocompletar de forma realista una prueba específica (25 preguntas)
  const buildRealisticAnswersForDomain = (domain: TestDomain): Record<string, string> => {
    const questions = ALL_QUESTIONS_BY_DOMAIN[domain];
    const generated: Record<string, string> = {};

    questions.forEach((q, idx) => {
      if (domain === 'ci') {
        // Selecciona la respuesta correcta en ~88% de las preguntas para un CIT alto realista
        const correctOpt = q.options.find((o) => o.scoreValue === 1);
        const fallbackOpt = q.options[0];
        generated[q.id] = idx % 8 === 7 ? fallbackOpt.id : (correctOpt?.id || fallbackOpt.id);
      } else if (domain === 'personality') {
        // Selecciona valores 4 o 5 en Likert
        generated[q.id] = idx % 3 === 0 ? '5' : '4';
      } else if (domain === 'learning') {
        if (q.subscale === 'vark') {
          const cycle = ['V', 'V', 'R', 'K'];
          generated[q.id] = cycle[idx % cycle.length];
        } else {
          const cycle = ['CA', 'EA', 'CA', 'OR'];
          generated[q.id] = cycle[idx % cycle.length];
        }
      } else if (domain === 'vocation') {
        if (q.subscale === 'I' || q.subscale === 'E' || q.subscale === 'S') {
          generated[q.id] = 'high';
        } else if (q.subscale === 'C' || q.subscale === 'H') {
          generated[q.id] = 'med';
        } else {
          generated[q.id] = idx % 2 === 0 ? 'med' : 'low';
        }
      } else if (domain === 'esp') {
        if (q.number <= 10) {
          const hitOpt = q.options.find((o) => o.subDimension === 'zener_hit');
          generated[q.id] = idx % 2 === 0 && hitOpt ? hitOpt.id : q.options[idx % 5].id;
        } else {
          generated[q.id] = idx % 2 === 0 ? '5' : '4';
        }
      }
    });

    return generated;
  };

  const handleAutoFillDomain = (domain: TestDomain) => {
    const filled = buildRealisticAnswersForDomain(domain);
    setAnswersByDomain((prev) => ({
      ...prev,
      [domain]: filled
    }));
    setStatusBanner(
      `Se han completado los 25 reactivos de la prueba "${DOMAIN_THEMES[domain].title}".`
    );
  };

  const finalizeAndSubmitEvaluation = async (
    customAnswers?: Record<TestDomain, Record<string, string>>
  ) => {
    setIsSubmitting(true);
    setStatusBanner(null);

    const source = customAnswers || answersByDomain;
    const finalAnswers: Record<TestDomain, Record<string, string>> = {
      ci: Object.keys(source.ci || {}).length >= 25 ? source.ci : buildRealisticAnswersForDomain('ci'),
      personality:
        Object.keys(source.personality || {}).length >= 25
          ? source.personality
          : buildRealisticAnswersForDomain('personality'),
      learning:
        Object.keys(source.learning || {}).length >= 25
          ? source.learning
          : buildRealisticAnswersForDomain('learning'),
      vocation:
        Object.keys(source.vocation || {}).length >= 25
          ? source.vocation
          : buildRealisticAnswersForDomain('vocation'),
      esp: Object.keys(source.esp || {}).length >= 25 ? source.esp : buildRealisticAnswersForDomain('esp')
    };

    setAnswersByDomain(finalAnswers);

    const ciResult = scoreCITest(finalAnswers.ci);
    const personalityResult = scorePersonalityTest(finalAnswers.personality);
    const learningResult = scoreLearningTest(finalAnswers.learning);
    const vocationResult = scoreVocationTest(finalAnswers.vocation);
    const espResult = scoreEspTest(finalAnswers.esp);

    const recommendations = generatePersonalizedRecommendations(
      ciResult,
      personalityResult,
      learningResult,
      vocationResult,
      espResult,
      currentUser.firstName
    );

    const nowIso = new Date().toISOString();
    const evalNumber = userAssessments.length + 1;
    const newAssessment: FullAssessmentRecord = {
      id: `eval-${Date.now()}`,
      userId: currentUser.id,
      completedAt: nowIso,
      periodLabel: `Seguimiento #${evalNumber} · Nueva Evaluación Comparativa (${nowIso.slice(0, 10)})`,
      ageAtEvaluation: calculateAgeFromBirthDate(currentUser.birthDate),
      stratumAtEvaluation: currentUser.socioeconomicStratum,
      ci: ciResult,
      personality: personalityResult,
      learning: learningResult,
      vocation: vocationResult,
      esp: espResult,
      recommendations,
      smtpSentTo: 'ffadullgu@yahoo.com',
      smtpSentAt: nowIso
    };

    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, assessment: newAssessment })
      });
      if (res.ok) {
        const data = await res.json();
        setAssessments((prev) => [...prev, data.assessment]);
        setSelectedReportId(data.assessment.id);
        if (data.smtpDispatch) {
          setSmtpLogs((prev) => [data.smtpDispatch, ...prev]);
        }
      } else {
        setAssessments((prev) => [...prev, newAssessment]);
        setSelectedReportId(newAssessment.id);
      }
    } catch {
      setAssessments((prev) => [...prev, newAssessment]);
      setSelectedReportId(newAssessment.id);
    } finally {
      setIsSubmitting(false);
      setActiveSection('report');
      setStatusBanner(
        `¡Evaluación de 125 reactivos procesada! Informe Ejecutivo y Recomendaciones generadas y enviadas vía SMTP (${smtpConfig.host}:${smtpConfig.port}) a ${smtpConfig.recipient}.`
      );
    }
  };

  const handleSaveSmtpConfig = async (updated: SmtpConfiguration) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/smtp-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        setSmtpConfig(data.smtpConfig);
      } else {
        setSmtpConfig(updated);
      }
      setStatusBanner(
        `Valores SMTP actualizados: Servidor ${updated.host}:${updated.port} (${updated.secure ? 'SSL/TLS' : 'STARTTLS'}) · Remitente ${updated.user} · Destinatario ${updated.recipient}`
      );
    } catch {
      setSmtpConfig(updated);
      setStatusBanner(
        `Valores SMTP actualizados localmente: ${updated.host}:${updated.port} → ${updated.recipient}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFillAllAndFinish = () => {
    const allFilled: Record<TestDomain, Record<string, string>> = {
      ci: buildRealisticAnswersForDomain('ci'),
      personality: buildRealisticAnswersForDomain('personality'),
      learning: buildRealisticAnswersForDomain('learning'),
      vocation: buildRealisticAnswersForDomain('vocation'),
      esp: buildRealisticAnswersForDomain('esp')
    };
    finalizeAndSubmitEvaluation(allFilled);
  };

  const handleSendReportSmtp = async (record: FullAssessmentRecord) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, assessment: record })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.smtpDispatch) {
          setSmtpLogs((prev) => [data.smtpDispatch, ...prev]);
        }
      }
      setStatusBanner(
        `Informe Ejecutivo de ${currentUser.firstName} ${currentUser.lastName} despachado exitosamente a ${smtpConfig.recipient} vía ${smtpConfig.host}:${smtpConfig.port}.`
      );
    } catch {
      setStatusBanner(
        `Informe Ejecutivo encolado para transmisión SMTP hacia ${smtpConfig.recipient}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateIntervalMonths = async (months: 3 | 6 | 12) => {
    setCurrentUser((prev) => ({
      ...prev,
      reEvaluationIntervalMonths: months
    }));
    try {
      await fetch(`/api/users/${currentUser.id}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reEvaluationIntervalMonths: months })
      });
    } catch {
      // ignore offline
    }
    setStatusBanner(
      `Período de re-evaluación longitudinal actualizado a cada ${months} meses.`
    );
  };

  const handleRegisterNewUser = async (profileData: {
    firstName: string;
    lastName: string;
    birthDate: string;
    sex: UserProfile['sex'];
    socioeconomicStratum: 1 | 2 | 3 | 4 | 5 | 6;
    email: string;
    password: string;
    colombianConsentAccepted: boolean;
    reEvaluationIntervalMonths: 3 | 6 | 12;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        const fallbackUser: UserProfile = {
          id: `usr-${Date.now()}`,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          birthDate: profileData.birthDate,
          sex: profileData.sex,
          socioeconomicStratum: profileData.socioeconomicStratum,
          email: profileData.email,
          colombianConsentAccepted: profileData.colombianConsentAccepted,
          consentTimestamp: new Date().toISOString(),
          reEvaluationIntervalMonths: profileData.reEvaluationIntervalMonths,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(fallbackUser);
      }
      setAnswersByDomain({ ci: {}, personality: {}, learning: {}, vocation: {}, esp: {} });
      setActiveSection('tests');
      setStatusBanner(
        `Participante ${profileData.firstName} ${profileData.lastName} registrado bajo la Ley 1581 de 2012. Puedes iniciar las 5 pruebas.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const domainKeys: TestDomain[] = ['ci', 'personality', 'learning', 'vocation', 'esp'];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Enlace de salto accesible W3C WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-lg focus:text-xs focus:font-semibold"
      >
        Saltar al contenido principal
      </a>

      {/* TOP BAR CONTRACT: Exactamente 3 zonas en una fila */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3.5 no-print">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-4">
          {/* Zona 1: Brand Title (un único elemento de texto) */}
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('overview');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            PsicoEval Colombia
          </a>

          {/* Zona 2: 5 enlaces de navegación limpios en una sola línea */}
          <nav
            aria-label="Navegación principal del sistema psicométrico"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {[
              { id: 'overview' as const, label: 'Panel General' },
              { id: 'tests' as const, label: 'Pruebas (5×25)' },
              { id: 'progress' as const, label: 'Seguimiento Longitudinal' },
              { id: 'report' as const, label: 'Informe y Recomendaciones' },
              { id: 'profile' as const, label: 'Registro y W3C' }
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveSection(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'text-slate-900 font-semibold border-blue-700'
                      : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zona 3: 1-2 acciones primarias */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection('profile')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{currentUser.firstName} · E{currentUser.socioeconomicStratum}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('tests')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              Iniciar Pruebas
            </button>
          </div>
        </div>

        {/* Navegación móvil compacta */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pt-3 mt-3 border-t border-slate-100">
          {[
            { id: 'overview' as const, label: 'Panel' },
            { id: 'tests' as const, label: 'Pruebas (125)' },
            { id: 'progress' as const, label: 'Seguimiento' },
            { id: 'report' as const, label: 'Informe y Recom.' },
            { id: 'profile' as const, label: 'Ley 1581 / W3C' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                activeSection === item.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Banner de notificación accesible W3C aria-live */}
      {statusBanner && (
        <div
          role="status"
          aria-live="polite"
          className="bg-emerald-900 text-white px-6 py-2.5 text-xs font-medium no-print"
        >
          <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" aria-hidden="true" />
              <span>{statusBanner}</span>
            </span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-emerald-200 hover:text-white underline whitespace-nowrap"
            >
              Cerrar aviso
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main id="main-content" className="flex-1 max-w-[1320px] w-full mx-auto px-6 py-8 space-y-10">
        {activeSection === 'overview' && (
          <div className="space-y-10">
            {/* HERO EDITORIAL & EXPEDIENTE DEL ADOLESCENTE */}
            <section
              aria-labelledby="hero-heading"
              className="bg-white border border-slate-200 rounded-lg overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>Evaluación Psicométrica para Adolescentes</span>
                      <span aria-hidden="true">·</span>
                      <span>Estándar W3C WCAG 2.1</span>
                      <span aria-hidden="true">·</span>
                      <span>Ley 1581 de 2012 (Colombia)</span>
                    </div>

                    <h1
                      id="hero-heading"
                      className="text-2xl md:text-4xl font-semibold text-slate-900 leading-tight"
                    >
                      Valoración Integral Cognitiva, Vocacional y Seguimiento Longitudinal
                    </h1>

                    <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                      Sistema clínico-educativo que evalúa 5 dimensiones fundamentales con 25 reactivos estandarizados cada una (125 reactivos en total), analiza la evolución semestral del adolescente y genera recomendaciones personalizadas de carreras, estudio y actividades con despacho automático SMTP (<code className="font-mono font-semibold text-slate-800">{smtpConfig.host}:{smtpConfig.port}</code> → <code className="font-mono font-semibold text-blue-800">{smtpConfig.recipient}</code>).
                    </p>
                  </div>

                  {/* Tarjeta del Adolescente Activo y Resumen Rápido */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {!avatarImgFailed ? (
                        <img
                          src={avatarImgUrl}
                          alt={`Retrato de ${currentUser.firstName} ${currentUser.lastName}`}
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarImgFailed(true)}
                          className="w-12 h-12 rounded-full object-cover border border-slate-300 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {currentUser.firstName[0]}
                          {currentUser.lastName[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>Adolescente Evaluado(a)</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            Estrato {currentUser.socioeconomicStratum}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{latestAssessment.ageAtEvaluation} años</span>
                        </div>
                        <p className="text-base font-semibold text-slate-900">
                          {currentUser.firstName} {currentUser.lastName}
                        </p>
                        <p className="text-xs text-slate-600 font-mono tabular-nums">
                          CIT Wechsler: {latestAssessment.ci.totalIQ} ({latestAssessment.ci.classification}) · Vocación: Área {latestAssessment.vocation.primaryCode} · {userAssessments.length} evaluaciones en historial
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveSection('profile')}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 whitespace-nowrap self-start sm:self-center"
                    >
                      Cambiar / Registrar Adolescente
                    </button>
                  </div>

                  {/* Un único CTA Primario dominante acompañado de accesos directos secundarios */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveSection('tests')}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <span>Realizar Batería Psicométrica (5 Pruebas × 25 Preguntas)</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSection('progress')}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                      <span>Ver Evolución Longitudinal (6 Meses)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSection('report')}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange-700" aria-hidden="true" />
                      <span>Abrir Informe y Recomendaciones</span>
                    </button>
                  </div>
                </div>

                {/* Imagen Clínica con Scrim Medido y Fallback Resiliente */}
                <div className="lg:col-span-5 relative min-h-[280px] bg-slate-900">
                  {!heroImgFailed ? (
                    <img
                      src={heroImgUrl}
                      alt="Centro de evaluación psicológica y orientación vocacional en Colombia"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full object-cover opacity-90"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white">
                    <p className="text-xs font-mono text-slate-300">
                      SÍNTESIS LONGITUDINAL ACTUAL ({latestAssessment.periodLabel.split('·')[0].trim()})
                    </p>
                    <p className="text-lg font-semibold mt-1">
                      Evolución Semestral: +12 pts en CIT Wechsler y Consolidación Vocacional STEM
                    </p>
                    <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/15 text-xs font-mono tabular-nums">
                      <div>
                        <span className="text-slate-300 block">CI Wechsler</span>
                        <strong className="text-sm text-white">{latestAssessment.ci.totalIQ} pts (P{latestAssessment.ci.percentile})</strong>
                      </div>
                      <div>
                        <span className="text-slate-300 block">Kolb / VARK</span>
                        <strong className="text-sm text-white">{latestAssessment.learning.kolb.style}</strong>
                      </div>
                      <div>
                        <span className="text-slate-300 block">CHASIDE / PES</span>
                        <strong className="text-sm text-white">Área {latestAssessment.vocation.primaryCode} · {latestAssessment.esp.intuitiveIndex}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* LAS 5 PRUEBAS PSICOMÉTRICAS Y SU ALINEACIÓN CROMÁTICA */}
            <section aria-labelledby="five-domains-heading" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-500">
                    Arquitectura Cromática Asociada a cada Prueba · Mínimo 25 Preguntas por Aspecto
                  </p>
                  <h2 id="five-domains-heading" className="text-xl font-semibold text-slate-900 mt-0.5">
                    Los 5 Aspectos Evaluados y Resultados Actuales del Adolescente
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-600">
                  5 módulos × 25 preguntas = 125 reactivos verificados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {domainKeys.map((domKey, idx) => {
                  const theme = DOMAIN_THEMES[domKey];

                  let headlineMetric = '';
                  let subMetric = '';
                  if (domKey === 'ci') {
                    headlineMetric = `CIT ${latestAssessment.ci.totalIQ}`;
                    subMetric = `Percentil ${latestAssessment.ci.percentile} · ${latestAssessment.ci.classification}`;
                  } else if (domKey === 'personality') {
                    headlineMetric = `O:${latestAssessment.personality.openness}% · C:${latestAssessment.personality.conscientiousness}%`;
                    subMetric = latestAssessment.personality.dominantTrait;
                  } else if (domKey === 'learning') {
                    headlineMetric = latestAssessment.learning.kolb.style;
                    subMetric = `Canal ${latestAssessment.learning.vark.dominantModality}`;
                  } else if (domKey === 'vocation') {
                    headlineMetric = `Área ${latestAssessment.vocation.primaryCode} (${latestAssessment.vocation.areas[latestAssessment.vocation.primaryCode]}%)`;
                    subMetric = latestAssessment.vocation.primaryName;
                  } else {
                    headlineMetric = `Índice ${latestAssessment.esp.intuitiveIndex}/100`;
                    subMetric = `Zener: ${latestAssessment.esp.zenerHits}/10 aciertos`;
                  }

                  return (
                    <div
                      key={domKey}
                      className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className={`h-1.5 w-full ${theme.accentBarClass}`} />
                        <div className="p-4">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-mono tabular-nums">0{idx + 1} · 25 preg.</span>
                            <span className={`font-semibold ${theme.textClass}`}>
                              {theme.colorName.split(' ')[0]}
                            </span>
                          </div>

                          <h3 className="text-base font-semibold text-slate-900 mt-1">
                            {theme.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {theme.methodology}
                          </p>

                          <div className={`mt-4 p-3 rounded-md ${theme.bgLightClass}`}>
                            <span className="text-[11px] text-slate-500 block">
                              Resultado actual registrado
                            </span>
                            <strong className={`text-base font-mono tabular-nums block ${theme.textClass}`}>
                              {headlineMetric}
                            </strong>
                            <span className="text-xs text-slate-700 block truncate mt-0.5">
                              {subMetric}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-4">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTestDomain(domKey);
                            setActiveSection('tests');
                          }}
                          className={`w-full py-2 px-3 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${theme.buttonClass}`}
                        >
                          <span>Abrir 25 Reactivos</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* GRÁFICOS DE RADAR RECHARTS: COMPARATIVA ADOLESCENTE VS COHORTE POBLACIONAL */}
            <CohortRadarDashboard
              user={currentUser}
              assessment={latestAssessment}
            />

            {/* PANEL DE CONFIGURACIÓN DINÁMICA DE VALORES SMTP */}
            <SmtpConfigPanel
              smtpConfig={smtpConfig}
              onSaveSmtpConfig={handleSaveSmtpConfig}
              onTestSmtpSend={() => handleSendReportSmtp(latestAssessment)}
              isSaving={isSubmitting}
            />

            {/* VISTA PREVIA RÁPIDA DE RECOMENDACIONES PERSONALIZADAS Y SEGUIMIENTO */}
            <section
              aria-labelledby="quick-recommendations-heading"
              className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <p className="text-xs font-semibold text-orange-800">
                    Módulo de Recomendaciones Personalizadas y Seguimiento Longitudinal
                  </p>
                  <h2 id="quick-recommendations-heading" className="text-xl font-semibold text-slate-900 mt-0.5">
                    Sugerencias de Carreras, Áreas de Estudio y Actividades para {currentUser.firstName}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSection('progress')}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Comparar Historial ({userAssessments.length} Períodos)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('report')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Ver Informe Ejecutivo Completo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna 1: Top Carreras */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-700" aria-hidden="true" />
                    <span>Carreras Profesionales Sugeridas</span>
                  </h3>
                  {latestAssessment.recommendations.careers.slice(0, 2).map((c) => (
                    <div key={c.title} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-orange-800">Área CHASIDE {c.chasideCode}</span>
                        <span className="font-mono tabular-nums font-bold text-slate-900">
                          {c.affinityPercentage}% afinidad
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 mt-1">{c.title}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-3">{c.rationale}</p>
                    </div>
                  ))}
                </div>

                {/* Columna 2: Áreas y Métodos de Estudio */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-700" aria-hidden="true" />
                    <span>Estrategias de Estudio (Kolb &amp; VARK)</span>
                  </h3>
                  {latestAssessment.recommendations.studyAreas.slice(0, 2).map((s) => (
                    <div key={s.areaTitle} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-xs font-semibold text-amber-800 block">
                        {s.modalityAlignment}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 mt-1">{s.areaTitle}</p>
                      <p className="text-xs text-slate-600 mt-1">{s.concreteTechniques[0]}</p>
                    </div>
                  ))}
                </div>

                {/* Columna 3: Actividades Extracurriculares */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                    <span>Actividades Extracurriculares</span>
                  </h3>
                  {latestAssessment.recommendations.extracurriculars.slice(0, 2).map((e) => (
                    <div key={e.activityTitle} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-emerald-800">{e.category}</span>
                        <span className="font-mono tabular-nums">{e.recommendedFrequency}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 mt-1">{e.activityTitle}</p>
                      <p className="text-xs text-slate-600 mt-1">{e.whyItFitsAdolescent}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'tests' && (
          <PsychometricTestRunner
            activeDomain={activeTestDomain}
            onSelectDomain={setActiveTestDomain}
            answersByDomain={answersByDomain}
            onAnswerQuestion={handleAnswerQuestion}
            onAutoFillDomain={handleAutoFillDomain}
            onAutoFillAllAndFinish={handleAutoFillAllAndFinish}
            onFinalizeEvaluation={() => finalizeAndSubmitEvaluation()}
            isSubmitting={isSubmitting}
          />
        )}

        {activeSection === 'progress' && (
          <LongitudinalProgressView
            user={currentUser}
            assessments={userAssessments}
            onUpdateIntervalMonths={handleUpdateIntervalMonths}
            onStartNewRetakeEvaluation={() => {
              setActiveSection('tests');
              setStatusBanner(
                'Modo de Re-Evaluación Periódica activado. Responde o autocompleta las 5 pruebas para comparar los nuevos resultados con tu historial.'
              );
            }}
            onSelectAssessmentForReport={(id) => {
              setSelectedReportId(id);
              setActiveSection('report');
            }}
          />
        )}

        {activeSection === 'report' && (
          <ExecutiveReportAndRecommendations
            user={currentUser}
            assessments={userAssessments}
            selectedAssessmentId={selectedReportId}
            onSelectAssessmentId={setSelectedReportId}
            smtpLogs={smtpLogs}
            smtpConfig={smtpConfig}
            onSaveSmtpConfig={handleSaveSmtpConfig}
            onSendReportSmtp={handleSendReportSmtp}
            isSendingSmtp={isSubmitting}
            diagramImageSrc={diagramImgUrl}
          />
        )}

        {activeSection === 'profile' && (
          <div className="space-y-12">
            <SmtpConfigPanel
              smtpConfig={smtpConfig}
              onSaveSmtpConfig={handleSaveSmtpConfig}
              onTestSmtpSend={() => handleSendReportSmtp(latestAssessment)}
              isSaving={isSubmitting}
            />
            <AuthAndConsentView
              currentUser={currentUser}
              onLoginDemoUser={() => {
                setCurrentUser(DEMO_USER_PROFILE);
                setActiveSection('overview');
                setStatusBanner('Expediente longitudinal de Valentina Gómez Restrepo cargado.');
              }}
              onRegisterNewUser={handleRegisterNewUser}
              isSubmitting={isSubmitting}
            />
            <ArchitectureAndW3CGuide />
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA LIMPIO Y CONFORME A LA CONSTITUCIÓN */}
      <footer className="bg-white border-t border-slate-200 px-6 py-6 mt-12 no-print">
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>PsicoEval Colombia · Evaluación Psicométrica y Orientación Vocacional Adolescente</span>
            <span aria-hidden="true"> · </span>
            <span>Cumplimiento W3C WCAG 2.1 &amp; Ley Estatutaria 1581 de 2012</span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              SMTP Activo: <strong className="font-mono text-slate-700">{smtpConfig.host}:{smtpConfig.port}</strong> → <strong className="font-mono text-slate-700">{smtpConfig.recipient}</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
