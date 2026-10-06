import React, { useState } from 'react';
import {
  FullAssessmentRecord,
  UserProfile,
  ChasideAreaCode
} from '../types/psychometrics';
import { DOMAIN_THEMES, CHASIDE_DESCRIPTIONS } from '../data/psychometricTests';
import {
  TrendingUp,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileText
} from 'lucide-react';

interface LongitudinalProgressViewProps {
  user: UserProfile;
  assessments: FullAssessmentRecord[];
  onUpdateIntervalMonths: (months: 3 | 6 | 12) => void;
  onStartNewRetakeEvaluation: () => void;
  onSelectAssessmentForReport: (assessmentId: string) => void;
}

export const LongitudinalProgressView: React.FC<LongitudinalProgressViewProps> = ({
  user,
  assessments,
  onUpdateIntervalMonths,
  onStartNewRetakeEvaluation,
  onSelectAssessmentForReport
}) => {
  // Ordenar evaluaciones cronológicamente (de más antigua a más reciente)
  const sorted = [...assessments].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  const [baseIdx, setBaseIdx] = useState<number>(0);
  const [targetIdx, setTargetIdx] = useState<number>(Math.max(0, sorted.length - 1));

  const safeBaseIdx = Math.min(baseIdx, Math.max(0, sorted.length - 1));
  const safeTargetIdx = Math.min(targetIdx, Math.max(0, sorted.length - 1));

  const baseRecord = sorted[safeBaseIdx];
  const targetRecord = sorted[safeTargetIdx];
  const latestRecord = sorted[sorted.length - 1];

  // Cálculo de la próxima fecha sugerida según el período configurado (ej. 6 meses)
  const lastEvalDate = latestRecord ? new Date(latestRecord.completedAt) : new Date();
  const nextEligibleDate = new Date(lastEvalDate);
  nextEligibleDate.setMonth(nextEligibleDate.getMonth() + user.reEvaluationIntervalMonths);

  const formatDelta = (current: number, previous: number, unit = '') => {
    const diff = current - previous;
    if (diff > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-emerald-700 font-mono tabular-nums font-semibold">
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />+{diff}
          {unit}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-amber-700 font-mono tabular-nums font-semibold">
          <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
          {diff}
          {unit}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-slate-500 font-mono tabular-nums">
        <Minus className="w-3.5 h-3.5" aria-hidden="true" />0{unit}
      </span>
    );
  };

  if (sorted.length === 0) {
    return (
      <section className="bg-white border border-slate-200 rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900">
          Sin Evaluaciones Registradas en el Historial Longitudinal
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Completa tu primera batería de 5 pruebas psicométricas para inaugurar tu línea base de seguimiento evolutivo.
        </p>
        <button
          type="button"
          onClick={onStartNewRetakeEvaluation}
          className="mt-5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
        >
          Iniciar Primera Evaluación
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="longitudinal-heading" className="space-y-8">
      {/* Cabecera y Configuración del Período de Re-evaluación (3, 6 o 12 meses) */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Seguimiento Longitudinal Psicométrico</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{sorted.length} períodos registrados</span>
              <span aria-hidden="true">·</span>
              <span>Intervalo activo: cada {user.reEvaluationIntervalMonths} meses</span>
            </div>
            <h2 id="longitudinal-heading" className="text-2xl font-semibold text-slate-900 mt-1">
              Evolución Temporal y Comparador de Resultados ({user.firstName} {user.lastName})
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Analiza cómo han evolucionado tu Cociente Intelectual (Wechsler), Personalidad (Big Five), Estilo de Aprendizaje (Kolb/VARK), Vocación (CHASIDE) y Percepción (PES) a través de cada ciclo semestral.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2">
              <label htmlFor="interval-select" className="block text-xs text-slate-500">
                Período configurable de re-evaluación
              </label>
              <select
                id="interval-select"
                value={user.reEvaluationIntervalMonths}
                onChange={(e) => onUpdateIntervalMonths(Number(e.target.value) as 3 | 6 | 12)}
                className="mt-0.5 text-xs font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value={3}>Cada 3 meses (Seguimiento Trimestral)</option>
                <option value={6}>Cada 6 meses (Estándar Clínico Semestral)</option>
                <option value={12}>Cada 12 meses (Control Anual)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={onStartNewRetakeEvaluation}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Realizar Nueva Toma de Pruebas Ahora</span>
            </button>
          </div>
        </div>

        {/* Estado del ciclo de re-evaluación y línea de tiempo de tomas realizadas */}
        <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Cronograma de Re-Evaluación Periódica ({user.reEvaluationIntervalMonths} meses)
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Última toma registrada:{' '}
                <strong className="font-mono tabular-nums text-slate-900">
                  {latestRecord.completedAt.slice(0, 10)}
                </strong>{' '}
                ({latestRecord.periodLabel}) · Próximo control programado sugerido:{' '}
                <strong className="font-mono tabular-nums text-blue-800">
                  {nextEligibleDate.toISOString().slice(0, 10)}
                </strong>
                . Puedes iniciar una nueva evaluación en cualquier momento para comparar tu progreso.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-emerald-800 font-medium">
              ● Modo comparativo longitudinal habilitado
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico SVG de Evolución Longitudinal Multidimensional a través del Tiempo */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Curvas de Tendencia Longitudinal en los 5 Aspectos Evaluados
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Representación normalizada (escala 0–100% y CIT Wechsler) a través de las {sorted.length} evaluaciones históricas del adolescente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-blue-800 font-medium">
              <span className="w-3 h-1 bg-blue-700 inline-block" /> CI Wechsler (Percentil)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <span className="w-3 h-1 bg-emerald-700 inline-block" /> Responsabilidad (Big Five)
            </span>
            <span className="flex items-center gap-1.5 text-amber-800 font-medium">
              <span className="w-3 h-1 bg-amber-700 inline-block" /> Conceptualización (Kolb)
            </span>
            <span className="flex items-center gap-1.5 text-orange-800 font-medium">
              <span className="w-3 h-1 bg-orange-700 inline-block" /> Vocación Primaria (CHASIDE)
            </span>
            <span className="flex items-center gap-1.5 text-violet-800 font-medium">
              <span className="w-3 h-1 bg-violet-700 inline-block" /> Índice Intuitivo (PES)
            </span>
          </div>
        </div>

        {/* Lienzo SVG accesible con las curvas longitudinales */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox="0 0 820 260"
            role="img"
            aria-label="Gráfico de evolución temporal en las 5 pruebas psicométricas"
            className="w-full min-w-[640px] h-64 bg-slate-50/60 border border-slate-200 rounded-lg"
          >
            <title>Evolución Longitudinal de Puntajes Psicométricos</title>
            <desc>
              Muestra el crecimiento progresivo en CI Wechsler, Personalidad Big Five, Aprendizaje Kolb, Vocación CHASIDE y Percepción PES a través de los períodos evaluados.
            </desc>

            {/* Líneas guía horizontales (40%, 60%, 80%, 100%) */}
            {[40, 60, 80, 100].map((val) => {
              const y = 215 - ((val - 40) / 60) * 175;
              return (
                <g key={val}>
                  <line
                    x1={70}
                    y1={y}
                    x2={760}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                  <text
                    x={58}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[11px] fill-slate-500 font-mono"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Polilíneas para cada uno de los 5 dominios */}
            {(() => {
              const getX = (idx: number) =>
                sorted.length === 1
                  ? 415
                  : 120 + (idx / (sorted.length - 1)) * 590;
              const getY = (val: number) => {
                const clamped = Math.max(40, Math.min(100, val));
                return 215 - ((clamped - 40) / 60) * 175;
              };

              const series = [
                {
                  id: 'ci',
                  color: '#1D4ED8',
                  values: sorted.map((r) => r.ci.percentile)
                },
                {
                  id: 'personality',
                  color: '#047857',
                  values: sorted.map((r) => r.personality.conscientiousness)
                },
                {
                  id: 'learning',
                  color: '#B45309',
                  values: sorted.map((r) => r.learning.kolb.abstractConceptualization)
                },
                {
                  id: 'vocation',
                  color: '#C2410C',
                  values: sorted.map((r) => r.vocation.areas[r.vocation.primaryCode])
                },
                {
                  id: 'esp',
                  color: '#6D28D9',
                  values: sorted.map((r) => r.esp.intuitiveIndex)
                }
              ];

              return (
                <>
                  {series.map((s) => {
                    const points = s.values
                      .map((v, i) => `${getX(i)},${getY(v)}`)
                      .join(' ');
                    return (
                      <g key={s.id}>
                        <polyline
                          fill="none"
                          stroke={s.color}
                          strokeWidth={2.5}
                          points={points}
                        />
                        {s.values.map((v, i) => (
                          <g key={`${s.id}-${i}`}>
                            <circle
                              cx={getX(i)}
                              cy={getY(v)}
                              r={4.5}
                              fill="#FFFFFF"
                              stroke={s.color}
                              strokeWidth={2.5}
                            />
                          </g>
                        ))}
                      </g>
                    );
                  })}

                  {/* Etiquetas del eje X (períodos) */}
                  {sorted.map((rec, i) => (
                    <g key={rec.id}>
                      <text
                        x={getX(i)}
                        y={242}
                        textAnchor="middle"
                        className="text-[11px] fill-slate-700 font-semibold"
                      >
                        {rec.periodLabel.split('·')[0].trim()} ({rec.ageAtEvaluation}a)
                      </text>
                      <text
                        x={getX(i)}
                        y={22}
                        textAnchor="middle"
                        className="text-[11px] fill-blue-800 font-mono font-bold"
                      >
                        CIT {rec.ci.totalIQ}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Comparador Interactivo entre Dos Evaluaciones (Evaluación A vs Evaluación B) */}
      {baseRecord && targetRecord && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-700" aria-hidden="true" />
                <span>Comparador Detallado entre Períodos de Evaluación</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Selecciona cualquier par de evaluaciones del historial para analizar cuantitativamente los cambios y tendencias.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="select-base-eval" className="block text-xs font-medium text-slate-600 mb-1">
                  Evaluación de Referencia (Anterior / A):
                </label>
                <select
                  id="select-base-eval"
                  value={safeBaseIdx}
                  onChange={(e) => setBaseIdx(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {sorted.map((rec, idx) => (
                    <option key={rec.id} value={idx}>
                      {idx + 1}. {rec.periodLabel} (CIT {rec.ci.totalIQ})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-target-eval" className="block text-xs font-medium text-slate-600 mb-1">
                  Evaluación Comparada (Reciente / B):
                </label>
                <select
                  id="select-target-eval"
                  value={safeTargetIdx}
                  onChange={(e) => setTargetIdx(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {sorted.map((rec, idx) => (
                    <option key={rec.id} value={idx}>
                      {idx + 1}. {rec.periodLabel} (CIT {rec.ci.totalIQ})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabla comparativa de alta densidad con numerales tabulares */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-3 pr-4 font-semibold">Aspecto Psicométrico / Indicador</th>
                  <th className="py-3 px-4 font-semibold text-right">
                    Período A ({baseRecord.periodLabel.split('·')[0].trim()})
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">
                    Período B ({targetRecord.periodLabel.split('·')[0].trim()})
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">Variación (Delta B - A)</th>
                  <th className="py-3 pl-4 font-semibold">Interpretación de Tendencia Evolutiva</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {/* 1. CI Wechsler */}
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 pr-4">
                    <span className="font-semibold text-blue-800 block">
                      1. Cociente Intelectual Total (Wechsler CIT)
                    </span>
                    <span className="text-xs text-slate-500">
                      ICV · IVE · IRF · IMT · IVP
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                    {baseRecord.ci.totalIQ} pts (P{baseRecord.ci.percentile})
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {targetRecord.ci.totalIQ} pts (P{targetRecord.ci.percentile})
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {formatDelta(targetRecord.ci.totalIQ, baseRecord.ci.totalIQ, ' pts')}
                  </td>
                  <td className="py-3.5 pl-4 text-xs text-slate-600">
                     Evolución de rango <em>{baseRecord.ci.classification}</em> a <strong>{targetRecord.ci.classification}</strong>. Razonamiento Fluido en {targetRecord.ci.subscales.fluidReasoning}%.
                  </td>
                </tr>

                {/* 2. Personalidad Big Five */}
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 pr-4">
                    <span className="font-semibold text-emerald-800 block">
                      2. Personalidad (Big Five · Apertura / Responsabilidad)
                    </span>
                    <span className="text-xs text-slate-500">
                      Rasgo dominante: {targetRecord.personality.dominantTrait}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                    O:{baseRecord.personality.openness}% · C:{baseRecord.personality.conscientiousness}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    O:{targetRecord.personality.openness}% · C:{targetRecord.personality.conscientiousness}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {formatDelta(
                      targetRecord.personality.conscientiousness,
                      baseRecord.personality.conscientiousness,
                      '% (C)'
                    )}
                  </td>
                  <td className="py-3.5 pl-4 text-xs text-slate-600">
                    Estabilidad Emocional pasó de {baseRecord.personality.emotionalStability}% a{' '}
                    <strong>{targetRecord.personality.emotionalStability}%</strong>, fortaleciendo el autocontrol.
                  </td>
                </tr>

                {/* 3. Estilo de Aprendizaje Kolb y VARK */}
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 pr-4">
                    <span className="font-semibold text-amber-800 block">
                      3. Estilo de Aprendizaje (Ciclo de Kolb &amp; VARK)
                    </span>
                    <span className="text-xs text-slate-500">
                      Canal VARK dominante: {targetRecord.learning.vark.dominantModality}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                    {baseRecord.learning.kolb.style} (CA:{baseRecord.learning.kolb.abstractConceptualization}%)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {targetRecord.learning.kolb.style} (CA:{targetRecord.learning.kolb.abstractConceptualization}%)
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {formatDelta(
                      targetRecord.learning.kolb.activeExperimentation,
                      baseRecord.learning.kolb.activeExperimentation,
                      '% (EA)'
                    )}
                  </td>
                  <td className="py-3.5 pl-4 text-xs text-slate-600">
                    {baseRecord.learning.kolb.style === targetRecord.learning.kolb.style
                      ? `Consolidación del cuadrante ${targetRecord.learning.kolb.style} con canal ${targetRecord.learning.vark.dominantModality}.`
                      : `Evolución de cuadrante ${baseRecord.learning.kolb.style} hacia ${targetRecord.learning.kolb.style}, mayor capacidad práctica.`}
                  </td>
                </tr>

                {/* 4. Vocación CHASIDE */}
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 pr-4">
                    <span className="font-semibold text-orange-800 block">
                      4. Orientación Vocacional (Test CHASIDE)
                    </span>
                    <span className="text-xs text-slate-500">
                      Eje primario: Área {targetRecord.vocation.primaryCode} ({targetRecord.vocation.primaryName})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                    Área {baseRecord.vocation.primaryCode}: {baseRecord.vocation.areas[baseRecord.vocation.primaryCode]}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    Área {targetRecord.vocation.primaryCode}: {targetRecord.vocation.areas[targetRecord.vocation.primaryCode]}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {formatDelta(
                      targetRecord.vocation.areas[targetRecord.vocation.primaryCode],
                      baseRecord.vocation.areas[targetRecord.vocation.primaryCode],
                      '%'
                    )}
                  </td>
                  <td className="py-3.5 pl-4 text-xs text-slate-600">
                    Definición vocacional sostenida en <strong>{targetRecord.vocation.primaryCode}-{targetRecord.vocation.secondaryCode}</strong> con alta congruencia interés-aptitud.
                  </td>
                </tr>

                {/* 5. Nivel Extrasensorial PES */}
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 pr-4">
                    <span className="font-semibold text-violet-800 block">
                      5. Nivel Extrasensorial e Intuición (Estudios PES)
                    </span>
                    <span className="text-xs text-slate-500">
                      Protocolo Zener (azar = 2.0/10) + Subescalas Intuitivas
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                    {baseRecord.esp.intuitiveIndex}/100 ({baseRecord.esp.zenerHits}/10 Zener)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {targetRecord.esp.intuitiveIndex}/100 ({targetRecord.esp.zenerHits}/10 Zener)
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {formatDelta(targetRecord.esp.intuitiveIndex, baseRecord.esp.intuitiveIndex, ' pts')}
                  </td>
                  <td className="py-3.5 pl-4 text-xs text-slate-600">
                    Incremento en Sensibilidad Sinestésica ({targetRecord.esp.subscales.synestheticSensitivity}%) y Clarividencia de Patrón ({targetRecord.esp.subscales.clairvoyancePattern}%).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Listado Cronológico de Evaluaciones Realizadas con acceso directo a su Informe Ejecutivo */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Registro Histórico de Evaluaciones del Adolescente
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Haz clic en cualquier evaluación para abrir su Informe Ejecutivo completo y recomendaciones personalizadas.
        </p>

        <div className="divide-y divide-slate-200 mt-4">
          {[...sorted].reverse().map((rec, idx) => (
            <div
              key={rec.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono tabular-nums font-semibold text-slate-800">
                    Fecha: {rec.completedAt.slice(0, 10)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Edad al evaluar: {rec.ageAtEvaluation} años</span>
                  <span aria-hidden="true">·</span>
                  <span>Estrato {rec.stratumAtEvaluation}</span>
                  {idx === 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-semibold">Evaluación más reciente</span>
                    </>
                  )}
                </div>

                <h4 className="text-base font-semibold text-slate-900 mt-1">{rec.periodLabel}</h4>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5 font-mono tabular-nums">
                  <span className="text-blue-800 font-medium">
                    CI Wechsler: {rec.ci.totalIQ} (P{rec.ci.percentile})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-800 font-medium">
                    Big Five: O:{rec.personality.openness}% C:{rec.personality.conscientiousness}%
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-800 font-medium">
                    Aprendizaje: {rec.learning.kolb.style} ({rec.learning.vark.dominantModality})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-orange-800 font-medium">
                    CHASIDE: Área {rec.vocation.primaryCode} ({rec.vocation.areas[rec.vocation.primaryCode]}%)
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-violet-800 font-medium">
                    PES: {rec.esp.intuitiveIndex}/100
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectAssessmentForReport(rec.id)}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ver Informe y Recomendaciones</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
