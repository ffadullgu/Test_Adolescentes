import React, { useState, useRef } from 'react';
import {
  FullAssessmentRecord,
  UserProfile,
  SmtpDispatchRecord,
  SmtpConfiguration,
  ChasideAreaCode
} from '../types/psychometrics';
import { CHASIDE_DESCRIPTIONS } from '../data/psychometricTests';
import { SmtpConfigPanel } from './SmtpConfigPanel';
import { generateExecutiveReportPdf } from '../utils/pdfGenerator';
import {
  Mail,
  FileDown,
  Loader2,
  CheckCircle2,
  Compass,
  BookOpen,
  Award,
  Target,
  Send,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';

interface ExecutiveReportProps {
  user: UserProfile;
  assessments: FullAssessmentRecord[];
  selectedAssessmentId: string | null;
  onSelectAssessmentId: (id: string) => void;
  smtpLogs: SmtpDispatchRecord[];
  smtpConfig: SmtpConfiguration;
  onSaveSmtpConfig: (updated: SmtpConfiguration) => Promise<void>;
  onSendReportSmtp: (assessment: FullAssessmentRecord) => Promise<void>;
  isSendingSmtp: boolean;
  diagramImageSrc: string;
}

export const ExecutiveReportAndRecommendations: React.FC<ExecutiveReportProps> = ({
  user,
  assessments,
  selectedAssessmentId,
  onSelectAssessmentId,
  smtpLogs,
  smtpConfig,
  onSaveSmtpConfig,
  onSendReportSmtp,
  isSendingSmtp,
  diagramImageSrc
}) => {
  const [showEmailPreview, setShowEmailPreview] = useState<boolean>(false);
  const [showSmtpEditor, setShowSmtpEditor] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfStatusMessage, setPdfStatusMessage] = useState<string | null>(null);

  const reportContainerRef = useRef<HTMLElement | null>(null);

  const sorted = [...assessments].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const activeRecord =
    sorted.find((r) => r.id === selectedAssessmentId) || sorted[0];

  if (!activeRecord) {
    return null;
  }

  const latestSmtpForThisRecord =
    smtpLogs.find((l) => l.assessmentId === activeRecord.id) || smtpLogs[0];

  const handleGeneratePdf = async () => {
    if (!reportContainerRef.current) return;
    try {
      setIsGeneratingPdf(true);
      setPdfStatusMessage('Iniciando PDF...');
      const cleanDate = activeRecord.completedAt.slice(0, 10);
      const cleanName = `${user.firstName}_${user.lastName}`.replace(/\s+/g, '_');
      const fileName = `Informe_Psicometrico_${cleanName}_${cleanDate}.pdf`;

      await generateExecutiveReportPdf(reportContainerRef.current, {
        fileName,
        user,
        assessment: activeRecord,
        smtpConfig,
        onProgress: (stage) => setPdfStatusMessage(stage)
      });
      setPdfStatusMessage('¡PDF generado con éxito!');
      setTimeout(() => setPdfStatusMessage(null), 4000);
    } catch (error) {
      console.error('Error generando PDF:', error);
      setPdfStatusMessage('Error al generar PDF');
      setTimeout(() => setPdfStatusMessage(null), 4000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <section aria-labelledby="executive-report-heading" className="space-y-8">
      {/* Barra superior de selección de informe, descarga PDF y envío SMTP a ffadullgu@yahoo.com */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Informe Ejecutivo Clínico y Orientación Vocacional</span>
              <span aria-hidden="true">·</span>
              <span>
                SMTP Activo: <strong className="font-mono text-slate-800">{smtpConfig.host}:{smtpConfig.port}</strong> → <strong className="font-mono text-blue-800">{smtpConfig.recipient}</strong>
              </span>
            </div>
            <h2 id="executive-report-heading" className="text-2xl font-semibold text-slate-900 mt-1">
              Informe Ejecutivo y Módulo de Recomendaciones Personalizadas
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label htmlFor="report-period-select" className="sr-only">
                Seleccionar período del informe
              </label>
              <select
                id="report-period-select"
                value={activeRecord.id}
                onChange={(e) => onSelectAssessmentId(e.target.value)}
                className="px-3.5 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
              >
                {sorted.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.periodLabel} (CIT {r.ci.totalIQ})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowSmtpEditor((prev) => !prev)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{showSmtpEditor ? 'Ocultar Valores SMTP' : 'Cambiar Valores SMTP'}</span>
            </button>

            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleGeneratePdf}
              aria-label="Generar y descargar informe ejecutivo en PDF"
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" aria-hidden="true" />
                  <span>{pdfStatusMessage || 'Generando PDF...'}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                  <span>Generar Reporte en PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isSendingSmtp}
              onClick={() => onSendReportSmtp(activeRecord)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {isSendingSmtp
                  ? 'Enviando por SMTP...'
                  : `Enviar Informe a ${smtpConfig.recipient}`}
              </span>
            </button>
          </div>
        </div>

        {pdfStatusMessage && (
          <div className="mt-3 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{pdfStatusMessage}</span>
          </div>
        )}
      </div>

      {/* Panel Desplegable para Cambiar Valores de SMTP */}
      {showSmtpEditor && (
        <SmtpConfigPanel
          smtpConfig={smtpConfig}
          onSaveSmtpConfig={onSaveSmtpConfig}
          onTestSmtpSend={() => onSendReportSmtp(activeRecord)}
          isSaving={isSendingSmtp}
          defaultOpen={true}
          onHide={() => setShowSmtpEditor(false)}
        />
      )}

      {/* Documento Formal del Informe Ejecutivo */}
      <article
        ref={reportContainerRef}
        className="bg-white border border-slate-200 rounded-lg overflow-hidden print-report-container shadow-sm"
      >
        {/* Encabezado Institucional y Ficha Sociodemográfica Colombia */}
        <div className="bg-slate-900 text-white p-6 md:p-8 print-avoid-break">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="text-xs font-mono text-slate-400">
                PSICOEVAL COLOMBIA · PROTOCOLO WECHSLER · BIG FIVE · KOLB/VARK · CHASIDE · PES
              </p>
              <h3 className="text-2xl md:text-3xl font-semibold mt-1 text-white">
                Informe Ejecutivo de Evaluación Psicométrica Integral
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Período evaluado: {activeRecord.periodLabel} · Fecha de emisión:{' '}
                <span className="font-mono tabular-nums">
                  {activeRecord.completedAt.slice(0, 10)}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={handleGeneratePdf}
                className="no-print no-pdf px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" aria-hidden="true" />
                ) : (
                  <FileDown className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                )}
                <span>{isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}</span>
              </button>

              <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-right">
                <span className="text-xs text-slate-400 block">CIT Escala Wechsler</span>
                <span className="text-2xl font-mono tabular-nums font-bold text-white">
                  {activeRecord.ci.totalIQ} pts
                </span>
                <span className="text-xs text-blue-300 block">
                  Percentil {activeRecord.ci.percentile} · {activeRecord.ci.classification}
                </span>
              </div>
            </div>
          </div>

          {/* Ficha Sociodemográfica y Habeas Data Ley 1581 de 2012 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Nombre y Apellido del Evaluado</span>
              <strong className="text-white text-sm mt-0.5 block">
                {user.firstName} {user.lastName}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Fecha de Nacimiento · Edad · Sexo</span>
              <strong className="text-white text-sm font-mono tabular-nums mt-0.5 block">
                {user.birthDate} ({activeRecord.ageAtEvaluation} años) · {user.sex}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Estrato Socioeconómico · Correo</span>
              <strong className="text-white text-sm mt-0.5 block truncate">
                Estrato {user.socioeconomicStratum} (DANE) · {user.email}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Protección de Datos (Colombia)</span>
              <strong className="text-emerald-300 text-xs mt-0.5 block">
                ✓ Autorizado Ley 1581/2012 y Dec. 1377/2013
              </strong>
            </div>
          </div>
        </div>

        {/* Sección 1: Síntesis Motivadora para el Adolescente */}
        <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
                <span>Síntesis Ejecutiva y Mensaje para el Adolescente</span>
                <span aria-hidden="true">·</span>
                <span>Orientación Psicopedagógica</span>
              </div>
              <p className="text-base text-slate-900 font-medium leading-relaxed">
                {activeRecord.recommendations.executiveMotivation}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeRecord.recommendations.integratedProfileSynthesis}
              </p>
            </div>

            <div className="lg:col-span-4">
              {!imgError ? (
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <img
                    src={diagramImageSrc}
                    alt="Diagrama de arquitectura cognitiva y rutas de aprendizaje"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-44 object-cover"
                  />
                  <div className="px-3 py-2 text-xs text-slate-500 border-t border-slate-100">
                    Integración neurocognitiva: Wechsler + Big Five + Kolb/VARK + CHASIDE + PES
                  </div>
                </div>
              ) : (
                <div className="h-44 rounded-lg border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
                  <Compass className="w-8 h-8 text-blue-700 mb-2" aria-hidden="true" />
                  <span className="text-xs font-semibold text-slate-700">
                    Matriz Psicométrica Multidimensional
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección 2: Resultados Detallados por Cada Aspecto (5 Pruebas con sus Colores Asociados) */}
        <div className="p-6 md:p-8 space-y-8 border-b border-slate-200">
          <h4 className="text-xl font-semibold text-slate-900">
            Análisis Clínico y Psicométrico de los 5 Aspectos Evaluados
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. CI WECHSLER (Azul Cobalto) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden print-avoid-break">
              <div className="h-1.5 bg-blue-700" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-blue-800">
                    01 · COCIENTE INTELECTUAL (ESCALA WECHSLER)
                  </span>
                  <span className="text-sm font-mono tabular-nums font-bold text-blue-800">
                    CIT {activeRecord.ci.totalIQ} · Percentil {activeRecord.ci.percentile}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeRecord.ci.clinicalInterpretation}
                </p>

                <div className="space-y-2.5 mt-4">
                  {[
                    { label: 'Comprensión Verbal (ICV)', val: activeRecord.ci.subscales.verbalComprehension },
                    { label: 'Razonamiento Fluido (IRF)', val: activeRecord.ci.subscales.fluidReasoning },
                    { label: 'Razonamiento Visoespacial (IVE)', val: activeRecord.ci.subscales.visuospatial },
                    { label: 'Memoria de Trabajo (IMT)', val: activeRecord.ci.subscales.workingMemory },
                    { label: 'Velocidad de Procesamiento (IVP)', val: activeRecord.ci.subscales.processingSpeed }
                  ].map((sub) => (
                    <div key={sub.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-700 font-medium">{sub.label}</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {sub.val}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-700"
                          style={{ width: `${sub.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. PERSONALIDAD BIG FIVE (Verde Esmeralda) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden print-avoid-break">
              <div className="h-1.5 bg-emerald-700" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-emerald-800">
                    02 · PERSONALIDAD (MODELO BIG FIVE · OCEAN)
                  </span>
                  <span className="text-xs font-mono tabular-nums font-bold text-emerald-800">
                    Dominante: {activeRecord.personality.dominantTrait.split('(')[0].trim()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeRecord.personality.clinicalInterpretation}
                </p>

                <div className="space-y-2.5 mt-4">
                  {[
                    { label: 'Apertura a la Experiencia (O)', val: activeRecord.personality.openness },
                    { label: 'Responsabilidad y Conciencia (C)', val: activeRecord.personality.conscientiousness },
                    { label: 'Extraversión y Liderazgo (E)', val: activeRecord.personality.extraversion },
                    { label: 'Amabilidad y Empatía (A)', val: activeRecord.personality.agreeableness },
                    { label: 'Estabilidad Emocional (N)', val: activeRecord.personality.emotionalStability }
                  ].map((dim) => (
                    <div key={dim.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-700 font-medium">{dim.label}</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {dim.val}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-700"
                          style={{ width: `${dim.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. ESTILO DE APRENDIZAJE KOLB Y VARK (Ámbar Académico) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden print-avoid-break">
              <div className="h-1.5 bg-amber-700" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-amber-800">
                    03 · ESTILO DE APRENDIZAJE (KOLB &amp; VARK)
                  </span>
                  <span className="text-xs font-mono tabular-nums font-bold text-amber-800">
                    Kolb: {activeRecord.learning.kolb.style} · {activeRecord.learning.vark.dominantModality}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeRecord.learning.clinicalInterpretation}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block mb-2">
                      Canales Sensoriales VARK
                    </span>
                    {[
                      { k: 'Visual (V)', v: activeRecord.learning.vark.visual },
                      { k: 'Auditivo (A)', v: activeRecord.learning.vark.auditory },
                      { k: 'Lectoescritor (R)', v: activeRecord.learning.vark.readWrite },
                      { k: 'Kinestésico (K)', v: activeRecord.learning.vark.kinesthetic }
                    ].map((item) => (
                      <div key={item.k} className="flex justify-between text-xs py-1 border-b border-slate-100">
                        <span className="text-slate-600">{item.k}</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {item.v}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-800 block mb-2">
                      Fases Experienciales de Kolb
                    </span>
                    {[
                      { k: 'Conceptualización (CA)', v: activeRecord.learning.kolb.abstractConceptualization },
                      { k: 'Experimentación (EA)', v: activeRecord.learning.kolb.activeExperimentation },
                      { k: 'Observación (OR)', v: activeRecord.learning.kolb.reflectiveObservation },
                      { k: 'Experiencia (EC)', v: activeRecord.learning.kolb.concreteExperience }
                    ].map((item) => (
                      <div key={item.k} className="flex justify-between text-xs py-1 border-b border-slate-100">
                        <span className="text-slate-600">{item.k}</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {item.v}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. VOCACIÓN CHASIDE (Terracota Vocacional) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden print-avoid-break">
              <div className="h-1.5 bg-orange-700" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-orange-800">
                    04 · ORIENTACIÓN VOCACIONAL (TEST CHASIDE)
                  </span>
                  <span className="text-xs font-mono tabular-nums font-bold text-orange-800">
                    Primaria: Área {activeRecord.vocation.primaryCode} ({activeRecord.vocation.areas[activeRecord.vocation.primaryCode]}%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeRecord.vocation.clinicalInterpretation}
                </p>

                <div className="space-y-2 mt-4">
                  {(['C', 'H', 'A', 'S', 'I', 'D', 'E'] as ChasideAreaCode[]).map((code) => {
                    const val = activeRecord.vocation.areas[code];
                    return (
                      <div key={code}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-slate-700 font-medium truncate pr-2">
                            <strong>Área {code}:</strong> {CHASIDE_DESCRIPTIONS[code].name}
                          </span>
                          <span className="font-mono tabular-nums font-semibold text-slate-900 shrink-0">
                            {val}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-700"
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 5. NIVEL EXTRASENSORIAL PES (Violeta Amatista - Ancho completo) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden print-avoid-break">
            <div className="h-1.5 bg-violet-700" />
            <div className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-violet-800">
                  05 · NIVEL EXTRASENSORIAL E INTUICIÓN PERCEPTIVA (ESTUDIOS PES · PROTOCOLO RHINE)
                </span>
                <span className="text-sm font-mono tabular-nums font-bold text-violet-800">
                  Índice Intuitivo: {activeRecord.esp.intuitiveIndex}/100 · Aciertos Zener: {activeRecord.esp.zenerHits}/10 (Azar = 2.0/10)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {activeRecord.esp.clinicalInterpretation}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-3 border-t border-slate-100">
                {[
                  { label: 'Telepatía Simbólica y Resonancia', val: activeRecord.esp.subscales.telepathySymbolic },
                  { label: 'Clarividencia de Patrones', val: activeRecord.esp.subscales.clairvoyancePattern },
                  { label: 'Anticipación Prospectiva', val: activeRecord.esp.subscales.precognitionIntuitive },
                  { label: 'Sensibilidad Sinestésica', val: activeRecord.esp.subscales.synestheticSensitivity }
                ].map((s) => (
                  <div key={s.label} className="bg-violet-50/50 border border-violet-200 rounded-lg p-3">
                    <span className="text-xs text-slate-700 block">{s.label}</span>
                    <span className="text-lg font-mono tabular-nums font-bold text-violet-900 mt-1 block">
                      {s.val}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sección 3: MÓDULO DE RECOMENDACIONES PERSONALIZADAS (Carreras, Áreas de Estudio y Actividades Extracurriculares) */}
        <div className="p-6 md:p-8 space-y-8 border-b border-slate-200 bg-slate-50/40">
          <div className="print-avoid-break">
            <p className="text-xs font-semibold text-orange-800">
              MOTOR DE RECOMENDACIONES MULTIDIMENSIONALES (CRUCE CI + BIG FIVE + KOLB/VARK + CHASIDE)
            </p>
            <h4 className="text-xl font-semibold text-slate-900 mt-1">
              Recomendaciones Personalizadas para el Desarrollo Académico y Vocacional de {user.firstName}
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Sugerencias concretas y motivadoras generadas a partir de tus fortalezas cognitivas, rasgos de personalidad, estilo de aprendizaje y perfil vocacional.
            </p>
          </div>

          {/* 3.1 Carreras Profesionales y Universitarias Sugeridas */}
          <div className="space-y-4">
            <h5 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-700" aria-hidden="true" />
              <span>A. Carreras Profesionales y Programas Universitarios de Mayor Afinidad</span>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRecord.recommendations.careers.map((career, idx) => (
                <div
                  key={career.title}
                  className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between print-avoid-break"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span>
                        Opción Recomendada #{idx + 1} · Área CHASIDE {career.chasideCode} ({career.areaLabel})
                      </span>
                      <span className="font-mono tabular-nums font-bold text-orange-800">
                        {career.affinityPercentage}% compatibilidad
                      </span>
                    </div>

                    <h6 className="text-base font-semibold text-slate-900 mt-1.5">
                      {career.title}
                    </h6>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {career.rationale}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <p className="text-slate-700">
                      <strong>Programas universitarios afines:</strong>{' '}
                      {career.suggestedAcademicPrograms.join(' · ')}
                    </p>
                    <p className="text-slate-500 font-mono">
                      Fortalezas vinculadas: {career.keyStrengthsMatched.join(' / ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3.2 Áreas de Estudio y Estrategias de Aprendizaje (Kolb + VARK) */}
          <div className="space-y-4">
            <h5 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" aria-hidden="true" />
              <span>B. Áreas de Estudio y Métodos de Aprendizaje Personalizados (Kolb &amp; VARK)</span>
            </h5>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {activeRecord.recommendations.studyAreas.map((study) => (
                <div
                  key={study.areaTitle}
                  className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between print-avoid-break"
                >
                  <div>
                    <p className="text-xs text-amber-800 font-medium">
                      {study.modalityAlignment} · {study.kolbAlignment}
                    </p>
                    <h6 className="text-sm font-semibold text-slate-900 mt-1">
                      {study.areaTitle}
                    </h6>
                    <ul className="mt-3 space-y-2 text-xs text-slate-600 list-disc pl-4">
                      {study.concreteTechniques.map((tech, i) => (
                        <li key={i} className="leading-relaxed">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 italic">
                    “{study.motivationalMessage}”
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3.3 Actividades Extracurriculares, Clubes y Proyectos Prácticos */}
          <div className="space-y-4">
            <h5 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>C. Actividades Extracurriculares y Experiencias Prácticas Sugeridas</span>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRecord.recommendations.extracurriculars.map((extra) => (
                <div
                  key={extra.activityTitle}
                  className="bg-white border border-slate-200 rounded-lg p-5 print-avoid-break"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-emerald-800">{extra.category}</span>
                    <span className="font-mono tabular-nums">{extra.recommendedFrequency}</span>
                  </div>
                  <h6 className="text-sm font-semibold text-slate-900 mt-1">
                    {extra.activityTitle}
                  </h6>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <strong>Impacto en tu desarrollo:</strong> {extra.developmentalImpact}
                  </p>
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                    <strong>Por qué se ajusta a ti:</strong> {extra.whyItFitsAdolescent}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3.4 Plan de Metas a 6 Meses */}
          <div className="space-y-4 print-avoid-break">
            <h5 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-700" aria-hidden="true" />
              <span>D. Hoja de Ruta y Metas para tu Próximo Seguimiento Semestral (6 Meses)</span>
            </h5>

            <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500 bg-slate-50">
                    <th className="py-3 px-4 font-semibold">Dimensión</th>
                    <th className="py-3 px-4 font-semibold">Objetivo de Desarrollo</th>
                    <th className="py-3 px-4 font-semibold">Acción Concreta Sugerida</th>
                    <th className="py-3 px-4 font-semibold">Indicador de Logro (6 Meses)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {activeRecord.recommendations.sixMonthMilestones.map((m) => (
                    <tr key={m.domain}>
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {m.domainLabel}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{m.goalTitle}</td>
                      <td className="py-3 px-4 text-slate-600">{m.actionStep}</td>
                      <td className="py-3 px-4 font-mono tabular-nums text-blue-800 font-medium">
                        {m.measurableIndicator}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Certificación Legal y Bloque de Firmas Institucionales (Visible en PDF y UI) */}
        <div className="p-6 md:p-8 bg-slate-50/80 border-t border-slate-200 print-avoid-break">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 text-xs text-slate-800">
            <div className="border-t border-slate-300 pt-3">
              <p className="font-semibold text-slate-900">
                Dirección de Psicometría y Orientación Vocacional · PsicoEval Colombia
              </p>
              <p className="text-slate-600 mt-0.5">
                Registro de Remisión Oficial: <strong className="font-mono">{smtpConfig.recipient}</strong> · Ley 1090 de 2006 (Código Deontológico de Psicología)
              </p>
            </div>
            <div className="border-t border-slate-300 pt-3">
              <p className="font-semibold text-slate-900">
                {user.firstName} {user.lastName} / Acudiente Autorizado
              </p>
              <p className="text-slate-600 mt-0.5">
                Consentimiento Informado Ley Estatutaria 1581 de 2012 y Decreto 1377 de 2013
              </p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-5 font-mono">
            Documento emitido bajo estándares de accesibilidad W3C WCAG 2.1 · ID Evaluación: {activeRecord.id} · Fecha de emisión: {activeRecord.completedAt.slice(0, 10)}
          </p>
        </div>

        {/* Sección 4: Auditoría y Configuración del Protocolo SMTP */}
        <div className="p-6 md:p-8 bg-slate-50 no-print">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-700 shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  Despacho Automático SMTP hacia {smtpConfig.recipient}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Servidor configurado: <code className="font-mono font-semibold">{smtpConfig.host}</code> · Puerto{' '}
                  <code className="font-mono font-semibold">
                    {smtpConfig.port} ({smtpConfig.secure ? 'SMTPS / SSL-TLS' : 'SMTP / STARTTLS'})
                  </code>{' '}
                  · Remitente: <code className="font-mono">{smtpConfig.user}</code> · Destino:{' '}
                  <strong className="font-mono text-slate-900">{smtpConfig.recipient}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEmailPreview((prev) => !prev)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 whitespace-nowrap"
              >
                {showEmailPreview ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Ocultar Carga MIME/HTML</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Inspeccionar Correo Enviado</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {latestSmtpForThisRecord && (
            <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  Informe Ejecutivo procesado y despachado hacia {latestSmtpForThisRecord.recipient}
                </span>
                <span className="font-mono tabular-nums text-slate-500">
                  Message-ID: {latestSmtpForThisRecord.messageId} · {latestSmtpForThisRecord.timestamp.slice(0, 19).replace('T', ' ')} UTC
                </span>
              </div>
              <p className="text-slate-700 font-mono">
                <strong>Asunto:</strong> {latestSmtpForThisRecord.subject}
              </p>
              <p className="text-slate-600">
                <strong>Resumen transmitido:</strong> {latestSmtpForThisRecord.summaryText}
              </p>

              {showEmailPreview && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Vista previa del cuerpo HTML enviado a ffadullgu@yahoo.com:
                  </p>
                  <div
                    className="border border-slate-200 rounded-lg p-4 bg-slate-50 max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: latestSmtpForThisRecord.htmlBody }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </section>
  );
};
