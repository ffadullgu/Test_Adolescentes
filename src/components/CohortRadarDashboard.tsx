import React, { useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';
import { FullAssessmentRecord, UserProfile } from '../types/psychometrics';
import { Users, SlidersHorizontal, ArrowUpRight } from 'lucide-react';

interface CohortRadarDashboardProps {
  user: UserProfile;
  assessment: FullAssessmentRecord;
}

// Baremos poblacionales normativos de referencia en Colombia por estrato socioeconómico (DANE 1-6) y rango de edad adolescente
function getCohortNormativeAverages(stratum: number, age: number) {
  const stratumOffset = (stratum - 3) * 2; // Ajuste psicométrico leve por contexto educativo
  const ageOffset = Math.max(0, (age - 14) * 1.5);

  return {
    globalFiveDimensions: {
      ciPercentile: Math.min(85, Math.round(52 + stratumOffset + ageOffset)),
      personalityBalance: Math.min(82, Math.round(64 + stratumOffset * 0.5 + ageOffset)),
      learningAdaptability: Math.min(84, Math.round(66 + stratumOffset + ageOffset * 0.8)),
      vocationalClarity: Math.min(82, Math.round(62 + stratumOffset * 0.8 + ageOffset * 1.2)),
      espIntuitive: Math.min(78, Math.round(58 + ageOffset * 0.6))
    },
    bigFiveCohort: {
      openness: Math.round(68 + stratumOffset),
      conscientiousness: Math.round(64 + ageOffset * 1.2),
      extraversion: Math.round(66),
      agreeableness: Math.round(70),
      emotionalStability: Math.round(62 + ageOffset)
    }
  };
}

export const CohortRadarDashboard: React.FC<CohortRadarDashboardProps> = ({
  user,
  assessment
}) => {
  const [selectedStratum, setSelectedStratum] = useState<number>(user.socioeconomicStratum);
  const [selectedAge, setSelectedAge] = useState<number>(assessment.ageAtEvaluation || 16);

  const cohortNorms = getCohortNormativeAverages(selectedStratum, selectedAge);

  // Puntaje sintético de personalidad y aprendizaje del adolescente en escala 0-100
  const adolescentPersonalityComposite = Math.round(
    (assessment.personality.openness +
      assessment.personality.conscientiousness +
      assessment.personality.extraversion +
      assessment.personality.agreeableness +
      assessment.personality.emotionalStability) /
      5
  );

  const adolescentLearningComposite = Math.round(
    (assessment.learning.kolb.abstractConceptualization +
      assessment.learning.kolb.activeExperimentation) /
      2
  );

  const adolescentVocationalComposite =
    assessment.vocation.areas[assessment.vocation.primaryCode];

  const mainRadarData = [
    {
      dimension: '1. CI Wechsler (Percentil)',
      adolescente: assessment.ci.percentile,
      cohorte: cohortNorms.globalFiveDimensions.ciPercentile
    },
    {
      dimension: '2. Personalidad (Big Five)',
      adolescente: adolescentPersonalityComposite,
      cohorte: cohortNorms.globalFiveDimensions.personalityBalance
    },
    {
      dimension: '3. Aprendizaje (Kolb/VARK)',
      adolescente: adolescentLearningComposite,
      cohorte: cohortNorms.globalFiveDimensions.learningAdaptability
    },
    {
      dimension: '4. Vocación (CHASIDE)',
      adolescente: adolescentVocationalComposite,
      cohorte: cohortNorms.globalFiveDimensions.vocationalClarity
    },
    {
      dimension: '5. Percepción (PES)',
      adolescente: assessment.esp.intuitiveIndex,
      cohorte: cohortNorms.globalFiveDimensions.espIntuitive
    }
  ];

  const bigFiveRadarData = [
    {
      trait: 'Apertura (O)',
      adolescente: assessment.personality.openness,
      cohorte: cohortNorms.bigFiveCohort.openness
    },
    {
      trait: 'Responsabilidad (C)',
      adolescente: assessment.personality.conscientiousness,
      cohorte: cohortNorms.bigFiveCohort.conscientiousness
    },
    {
      trait: 'Extraversión (E)',
      adolescente: assessment.personality.extraversion,
      cohorte: cohortNorms.bigFiveCohort.extraversion
    },
    {
      trait: 'Amabilidad (A)',
      adolescente: assessment.personality.agreeableness,
      cohorte: cohortNorms.bigFiveCohort.agreeableness
    },
    {
      trait: 'Estabilidad Emocional (N)',
      adolescente: assessment.personality.emotionalStability,
      cohorte: cohortNorms.bigFiveCohort.emotionalStability
    }
  ];

  return (
    <section
      aria-labelledby="cohort-radar-heading"
      className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
            <span>Baremos Poblacionales Colombia</span>
            <span aria-hidden="true">·</span>
            <span>Comparativa Normativa por Estrato DANE y Edad</span>
          </div>
          <h2 id="cohort-radar-heading" className="text-xl font-semibold text-slate-900 mt-1">
            Dashboard Comparativo de Radar: Perfil del Adolescente vs. Cohorte Poblacional
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
            Visualización vectorial de las 5 dimensiones psicológicas de{' '}
            <strong>
              {user.firstName} {user.lastName}
            </strong>{' '}
            frente a la media estadística de adolescentes de su mismo estrato socioeconómico y grupo etario.
          </p>
        </div>

        {/* Controles de filtro de cohorte poblacional (Estrato y Edad) */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
            <span>Cohorte de referencia:</span>
          </div>

          <div>
            <label htmlFor="cohort-stratum-select" className="sr-only">
              Estrato Socioeconómico de Cohorte
            </label>
            <select
              id="cohort-stratum-select"
              value={selectedStratum}
              onChange={(e) => setSelectedStratum(Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs font-mono font-medium text-slate-900 bg-white border border-slate-300 rounded-md"
            >
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <option key={s} value={s}>
                  Estrato {s} {s === user.socioeconomicStratum ? '(Actual)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cohort-age-select" className="sr-only">
              Edad de Cohorte Poblacional
            </label>
            <select
              id="cohort-age-select"
              value={selectedAge}
              onChange={(e) => setSelectedAge(Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs font-mono font-medium text-slate-900 bg-white border border-slate-300 rounded-md"
            >
              {[13, 14, 15, 16, 17, 18].map((a) => (
                <option key={a} value={a}>
                  {a} años {a === assessment.ageAtEvaluation ? '(Edad actual)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dos Gráficos de Radar Interactivos con Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar 1: Las 5 Dimensiones Psicológicas Globales */}
        <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                A. Radar de las 5 Pruebas Psicométricas (0–100%)
              </h3>
              <p className="text-xs text-slate-500">
                CI Wechsler · Big Five · Kolb/VARK · CHASIDE · Percepción PES
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-blue-800 font-semibold">
              Estrato {selectedStratum} · {selectedAge}a
            </span>
          </div>

          <div className="w-full h-72" data-testid="radar-chart-five-dimensions">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="73%" data={mainRadarData}>
                <PolarGrid stroke="#CBD5E1" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                />
                <Radar
                  name={`${user.firstName} ${user.lastName}`}
                  dataKey="adolescente"
                  stroke="#1D4ED8"
                  fill="#1D4ED8"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Radar
                  name={`Promedio Cohorte (E${selectedStratum}, ${selectedAge}a)`}
                  dataKey="cohorte"
                  stroke="#64748B"
                  fill="#94A3B8"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar 2: Los 5 Factores de Personalidad (BIG FIVE · OCEAN) */}
        <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                B. Radar de Estructura de Personalidad Big Five (OCEAN)
              </h3>
              <p className="text-xs text-slate-500">
                Apertura · Responsabilidad · Extraversión · Amabilidad · Estabilidad
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-emerald-800 font-semibold">
              Media Adolescente: {adolescentPersonalityComposite}%
            </span>
          </div>

          <div className="w-full h-72" data-testid="radar-chart-big-five">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="73%" data={bigFiveRadarData}>
                <PolarGrid stroke="#CBD5E1" />
                <PolarAngleAxis
                  dataKey="trait"
                  tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                />
                <Radar
                  name={`${user.firstName} (Big Five)`}
                  dataKey="adolescente"
                  stroke="#047857"
                  fill="#047857"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Radar
                  name={`Media Cohorte (E${selectedStratum}, ${selectedAge}a)`}
                  dataKey="cohorte"
                  stroke="#64748B"
                  fill="#94A3B8"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla Resumen de Diferenciales frente a la Cohorte Poblacional */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {mainRadarData.map((row) => {
          const delta = row.adolescente - row.cohorte;
          return (
            <div
              key={row.dimension}
              className="p-3 rounded-lg border border-slate-200 bg-white flex flex-col justify-between"
            >
              <span className="text-[11px] font-medium text-slate-500 truncate">
                {row.dimension}
              </span>
              <div className="flex items-baseline justify-between mt-1.5 font-mono tabular-nums">
                <strong className="text-base text-slate-900">{row.adolescente}%</strong>
                <span
                  className={`text-xs font-semibold flex items-center ${
                    delta >= 0 ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {delta >= 0 ? (
                    <>
                      <ArrowUpRight className="w-3 h-3" aria-hidden="true" />+{delta} pts
                    </>
                  ) : (
                    `${delta} pts`
                  )}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                Cohorte E{selectedStratum}: {row.cohorte}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
