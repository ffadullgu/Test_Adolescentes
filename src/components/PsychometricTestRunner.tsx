import React, { useState } from 'react';
import {
  ALL_QUESTIONS_BY_DOMAIN,
  DOMAIN_THEMES,
  ZENER_TARGET_SEQUENCE
} from '../data/psychometricTests';
import { TestDomain, PsychometricQuestion } from '../types/psychometrics';
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';

interface PsychometricTestRunnerProps {
  activeDomain: TestDomain;
  onSelectDomain: (domain: TestDomain) => void;
  answersByDomain: Record<TestDomain, Record<string, string>>;
  onAnswerQuestion: (domain: TestDomain, questionId: string, optionId: string) => void;
  onAutoFillDomain: (domain: TestDomain) => void;
  onAutoFillAllAndFinish: () => void;
  onFinalizeEvaluation: () => void;
  isSubmitting: boolean;
}

const DOMAIN_ORDER: TestDomain[] = ['ci', 'personality', 'learning', 'vocation', 'esp'];

export const PsychometricTestRunner: React.FC<PsychometricTestRunnerProps> = ({
  activeDomain,
  onSelectDomain,
  answersByDomain,
  onAnswerQuestion,
  onAutoFillDomain,
  onAutoFillAllAndFinish,
  onFinalizeEvaluation,
  isSubmitting
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0); // 5 páginas de 5 preguntas = 25 preguntas por prueba
  const questions: PsychometricQuestion[] = ALL_QUESTIONS_BY_DOMAIN[activeDomain];
  const theme = DOMAIN_THEMES[activeDomain];
  const domainAnswers = answersByDomain[activeDomain] || {};

  const answeredInCurrentDomain = Object.keys(domainAnswers).length;
  const totalQuestionsInDomain = questions.length; // 25

  const totalAnsweredAllDomains = DOMAIN_ORDER.reduce(
    (acc, dom) => acc + Object.keys(answersByDomain[dom] || {}).length,
    0
  );
  const totalQuestionsAllDomains = DOMAIN_ORDER.reduce(
    (acc, dom) => acc + ALL_QUESTIONS_BY_DOMAIN[dom].length,
    0
  ); // 125

  const pageSize = 5;
  const totalPages = Math.ceil(totalQuestionsInDomain / pageSize);
  const pageQuestions = questions.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleDomainSwitch = (dom: TestDomain) => {
    onSelectDomain(dom);
    setCurrentPage(0);
  };

  const currentDomainIdx = DOMAIN_ORDER.indexOf(activeDomain);
  const nextDomain = currentDomainIdx < DOMAIN_ORDER.length - 1 ? DOMAIN_ORDER[currentDomainIdx + 1] : null;

  return (
    <section aria-labelledby="test-runner-heading" className="space-y-8">
      {/* Cabecera de progreso global y selector de las 5 pruebas con sus colores psicológicos */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Batería Psicométrica Estandarizada · 5 Pruebas × 25 Reactivos = 125 Reactivos Totales
            </p>
            <h2 id="test-runner-heading" className="text-2xl font-semibold text-slate-900 mt-1">
              Sala de Evaluación Multidimensional para Adolescentes
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onAutoFillDomain(activeDomain)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Autocompletar esta prueba (25/25)
            </button>
            <button
              type="button"
              onClick={onAutoFillAllAndFinish}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Completar 125 Reactivos y Generar Informe</span>
            </button>
          </div>
        </div>

        {/* Barra de progreso global accesible W3C */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>Progreso global de la batería psicométrica</span>
            <span className="font-mono tabular-nums font-semibold text-slate-900">
              {totalAnsweredAllDomains} / {totalQuestionsAllDomains} reactivos respondidos ({Math.round((totalAnsweredAllDomains / totalQuestionsAllDomains) * 100)}%)
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Progreso total de las 5 pruebas psicométricas"
            aria-valuenow={totalAnsweredAllDomains}
            aria-valuemin={0}
            aria-valuemax={totalQuestionsAllDomains}
            className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-slate-900 transition-transform duration-200 origin-left"
              style={{
                transform: `scaleX(${Math.max(0.01, totalAnsweredAllDomains / totalQuestionsAllDomains)})`
              }}
            />
          </div>
        </div>

        {/* Pestañas interactivas de las 5 pruebas con codificación cromática */}
        <div
          role="tablist"
          aria-label="Selección de prueba psicométrica"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-6"
        >
          {DOMAIN_ORDER.map((domKey, idx) => {
            const domTheme = DOMAIN_THEMES[domKey];
            const count = Object.keys(answersByDomain[domKey] || {}).length;
            const isComplete = count >= 25;
            const isSelected = activeDomain === domKey;

            return (
              <button
                key={domKey}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`panel-${domKey}`}
                id={`tab-${domKey}`}
                type="button"
                onClick={() => handleDomainSwitch(domKey)}
                className={`text-left p-3.5 rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isSelected
                    ? `${domTheme.bgLightClass} ${domTheme.borderClass} border-2`
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    0{idx + 1} · {domTheme.colorName.split(' ')[0]}
                  </span>
                  <span className="text-xs font-mono tabular-nums font-semibold text-slate-700 flex items-center gap-1">
                    {isComplete && <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />}
                    {count}/25
                  </span>
                </div>
                <p className={`text-sm font-semibold mt-1 truncate ${isSelected ? domTheme.textClass : 'text-slate-900'}`}>
                  {domTheme.shortTitle}
                </p>
                <div className="w-full h-1 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className={`h-full ${domTheme.accentBarClass}`}
                    style={{ width: `${(count / 25) * 100}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel activo de la prueba seleccionada con su identidad cromática */}
      <div
        id={`panel-${activeDomain}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeDomain}`}
        className="bg-white border border-slate-200 rounded-lg overflow-hidden"
      >
        {/* Franja superior cromática alineada con el aspecto psicológico */}
        <div className={`h-2 w-full ${theme.accentBarClass}`} />

        <div className={`p-6 border-b border-slate-200 ${theme.bgLightClass}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className={`font-semibold ${theme.textClass}`}>{theme.methodology}</span>
                <span aria-hidden="true">·</span>
                <span>Paleta asociada: {theme.colorName} ({theme.primaryHex})</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mt-1">{theme.title}</h3>
              <p className="text-sm text-slate-700 mt-1 max-w-3xl">{theme.scientificBasis}</p>
              <p className="text-xs text-slate-600 mt-1.5 italic">
                Justificación cromática W3C: {theme.psychRationale}
              </p>
            </div>

            <div className="shrink-0 bg-white border border-slate-200 rounded-lg px-4 py-3 text-right">
              <span className="text-xs text-slate-500 block">Avance en esta prueba</span>
              <span className={`text-xl font-mono tabular-nums font-bold ${theme.textClass}`}>
                {answeredInCurrentDomain} / {totalQuestionsInDomain}
              </span>
              <span className="text-xs text-slate-500 block">
                Página {currentPage + 1} de {totalPages}
              </span>
            </div>
          </div>

          {/* Navegador de bloques de preguntas (1-5, 6-10, 11-15, 16-20, 21-25) */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-200/80">
            <span className="text-xs font-medium text-slate-600 mr-2">Ir al bloque de reactivos:</span>
            {Array.from({ length: totalPages }).map((_, pIdx) => {
              const startQ = pIdx * pageSize + 1;
              const endQ = Math.min((pIdx + 1) * pageSize, totalQuestionsInDomain);
              const blockQuestions = questions.slice(pIdx * pageSize, (pIdx + 1) * pageSize);
              const blockAnswered = blockQuestions.filter((q) => Boolean(domainAnswers[q.id])).length;
              const isCurrent = currentPage === pIdx;

              return (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setCurrentPage(pIdx)}
                  className={`px-3 py-1.5 text-xs font-mono tabular-nums rounded-md transition-colors whitespace-nowrap ${
                    isCurrent
                      ? `${theme.buttonClass} font-semibold`
                      : blockAnswered === blockQuestions.length
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Preguntas {startQ}–{endQ} ({blockAnswered}/5)
                </button>
              );
            })}
          </div>
        </div>

        {/* Listado de las 5 preguntas de la página actual */}
        <div className="divide-y divide-slate-200">
          {pageQuestions.map((q) => {
            const selectedOptionId = domainAnswers[q.id];
            const isZenerQuestion = q.domain === 'esp' && q.number <= 10;
            const zenerTarget = isZenerQuestion ? ZENER_TARGET_SEQUENCE[q.number - 1] : null;

            return (
              <fieldset key={q.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <legend className="w-full">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                    <span className="font-mono tabular-nums font-semibold text-slate-700">
                      Reactivo #{q.number} de 25 · {q.subscaleLabel}
                    </span>
                    {selectedOptionId ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Respondido
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">Pendiente de respuesta</span>
                    )}
                  </div>
                  <p className="text-base font-medium text-slate-900 leading-relaxed">{q.prompt}</p>
                  {q.contextNote && (
                    <p className="text-xs text-slate-500 mt-1">{q.contextNote}</p>
                  )}
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
                  {q.options.map((opt) => {
                    const isChecked = selectedOptionId === opt.id;
                    return (
                      <label
                        key={opt.id}
                        htmlFor={`${q.id}-${opt.id}`}
                        className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                          isChecked
                            ? `${theme.bgLightClass} ${theme.borderClass} border-2 text-slate-900 font-medium`
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          id={`${q.id}-${opt.id}`}
                          type="radio"
                          name={q.id}
                          value={opt.id}
                          checked={isChecked}
                          onChange={() => onAnswerQuestion(activeDomain, q.id, opt.id)}
                          className="mt-1 h-4 w-4 text-slate-900 focus:ring-slate-900 shrink-0"
                        />
                        <span className="text-sm leading-snug">{opt.text}</span>
                      </label>
                    );
                  })}
                </div>

                {isZenerQuestion && selectedOptionId && (
                  <p className="text-xs text-violet-800 mt-2.5 font-mono">
                    Registro de sincronía Zener #{q.number}: Selección registrada ({selectedOptionId.toUpperCase()}){' '}
                    {selectedOptionId === zenerTarget
                      ? '· ¡Coincidencia directa con el patrón objetivo Rhine!'
                      : '· Ensayo procesado en matriz estocástica.'}
                  </p>
                )}
              </fieldset>
            );
          })}
        </div>

        {/* Pie de navegación entre páginas y pruebas */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1.5 whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Bloque anterior</span>
            </button>

            {currentPage < totalPages - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                className={`px-4 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 whitespace-nowrap ${theme.buttonClass}`}
              >
                <span>Siguiente bloque ({currentPage + 2}/{totalPages})</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : nextDomain ? (
              <button
                type="button"
                onClick={() => handleDomainSwitch(nextDomain)}
                className={`px-4 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 whitespace-nowrap ${theme.buttonClass}`}
              >
                <span>Continuar a {DOMAIN_THEMES[nextDomain].shortTitle}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-mono tabular-nums">
              Total respondido: {totalAnsweredAllDomains}/125
            </span>
            <button
              type="button"
              onClick={onFinalizeEvaluation}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {isSubmitting
                ? 'Procesando y Enviando SMTP...'
                : 'Calcular Resultados y Enviar Informe a ffadullgu@yahoo.com'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
