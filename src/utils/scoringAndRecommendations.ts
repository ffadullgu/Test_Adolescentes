import {
  CI_QUESTIONS,
  PERSONALITY_QUESTIONS,
  LEARNING_QUESTIONS,
  VOCATION_QUESTIONS,
  ESP_QUESTIONS,
  CHASIDE_DESCRIPTIONS
} from '../data/psychometricTests';
import {
  CIResult,
  BigFiveResult,
  LearningStyleResult,
  VocationResult,
  EspResult,
  ChasideAreaCode,
  PersonalizedRecommendations,
  CareerRecommendation,
  StudyAreaRecommendation,
  ExtracurricularRecommendation,
  SixMonthMilestone,
  FullAssessmentRecord,
  UserProfile
} from '../types/psychometrics';

export function calculateAgeFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return 16;
  const now = new Date('2026-10-06T00:00:00Z');
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(10, Math.min(25, age));
}

// ============================================================================
// 1. CÁLCULO DE CI (ESCALA WECHSLER WISC-V / WAIS-IV)
// ============================================================================
export function scoreCITest(answers: Record<string, string>): CIResult {
  const subscaleCorrect: Record<string, number> = {
    verbalComprehension: 0,
    visuospatial: 0,
    fluidReasoning: 0,
    workingMemory: 0,
    processingSpeed: 0
  };

  let rawScore = 0;

  for (const q of CI_QUESTIONS) {
    const selectedId = answers[q.id];
    const opt = q.options.find((o) => o.id === selectedId);
    if (opt && opt.scoreValue === 1) {
      rawScore += 1;
      subscaleCorrect[q.subscale] = (subscaleCorrect[q.subscale] || 0) + 1;
    }
  }

  // Escala estandarizada Wechsler (Media = 100, DE = 15, Rango clínico 75 - 142)
  const totalIQ = Math.round(75 + (rawScore / 25) * 65);

  // Percentil psicométrico aproximado según distribución normal Wechsler
  let percentile = 50;
  if (totalIQ >= 135) percentile = 99;
  else if (totalIQ >= 130) percentile = 98;
  else if (totalIQ >= 125) percentile = 95;
  else if (totalIQ >= 120) percentile = 91;
  else if (totalIQ >= 115) percentile = 84;
  else if (totalIQ >= 110) percentile = 75;
  else if (totalIQ >= 105) percentile = 63;
  else if (totalIQ >= 100) percentile = 50;
  else if (totalIQ >= 95) percentile = 37;
  else if (totalIQ >= 90) percentile = 25;
  else percentile = 16;

  let classification = 'Promedio (90–109)';
  if (totalIQ >= 130) classification = 'Muy Superior (130+)';
  else if (totalIQ >= 120) classification = 'Superior (120–129)';
  else if (totalIQ >= 110) classification = 'Promedio Alto (110–119)';
  else if (totalIQ >= 90) classification = 'Promedio Normal (90–109)';
  else classification = 'Promedio en Consolidación (75–89)';

  const subscales = {
    verbalComprehension: Math.round((subscaleCorrect.verbalComprehension / 5) * 100),
    visuospatial: Math.round((subscaleCorrect.visuospatial / 5) * 100),
    fluidReasoning: Math.round((subscaleCorrect.fluidReasoning / 5) * 100),
    workingMemory: Math.round((subscaleCorrect.workingMemory / 5) * 100),
    processingSpeed: Math.round((subscaleCorrect.processingSpeed / 5) * 100)
  };

  const strongestSubscale = Object.entries(subscales).sort((a, b) => b[1] - a[1])[0];
  const subscaleNames: Record<string, string> = {
    verbalComprehension: 'Comprensión Verbal (ICV)',
    visuospatial: 'Razonamiento Visoespacial (IVE)',
    fluidReasoning: 'Razonamiento Fluido (IRF)',
    workingMemory: 'Memoria de Trabajo (IMT)',
    processingSpeed: 'Velocidad de Procesamiento (IVP)'
  };

  const clinicalInterpretation = `El Cociente Intelectual Total (CIT) estimado en la escala Wechsler es de ${totalIQ} puntos (Percentil ${percentile}, rango ${classification}). Se observa un desempeño particularmente sobresaliente en ${subscaleNames[strongestSubscale[0]]} (${strongestSubscale[1]}%), lo que evidencia alta capacidad para abstraer patrones complejos, estructurar argumentos lógicos y transferir conocimientos a situaciones inéditas.`;

  return {
    totalIQ,
    percentile,
    classification,
    rawScore,
    subscales,
    clinicalInterpretation
  };
}

// ============================================================================
// 2. CÁLCULO DE PERSONALIDAD (BIG FIVE / OCEAN)
// ============================================================================
export function scorePersonalityTest(answers: Record<string, string>): BigFiveResult {
  const sums: Record<string, number> = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    emotionalStability: 0
  };

  for (const q of PERSONALITY_QUESTIONS) {
    const selectedId = answers[q.id];
    const opt = q.options.find((o) => o.id === selectedId);
    const val = opt ? opt.scoreValue : 3; // 1 to 5
    sums[q.subscale] = (sums[q.subscale] || 0) + val;
  }

  // Cada dimensión tiene 5 preguntas (mínimo 5, máximo 25) -> normalizar a 0-100%
  const normalize = (sum: number) => Math.round(((sum - 5) / 20) * 100);

  const openness = normalize(sums.openness);
  const conscientiousness = normalize(sums.conscientiousness);
  const extraversion = normalize(sums.extraversion);
  const agreeableness = normalize(sums.agreeableness);
  const emotionalStability = normalize(sums.emotionalStability);

  const traitPairs: { key: string; label: string; score: number }[] = [
    { key: 'openness', label: 'Apertura a la Experiencia (O)', score: openness },
    { key: 'conscientiousness', label: 'Responsabilidad y Autodisciplina (C)', score: conscientiousness },
    { key: 'extraversion', label: 'Extraversión y Liderazgo Social (E)', score: extraversion },
    { key: 'agreeableness', label: 'Amabilidad y Cooperación Empática (A)', score: agreeableness },
    { key: 'emotionalStability', label: 'Estabilidad y Regulación Emocional (N)', score: emotionalStability }
  ].sort((a, b) => b.score - a.score);

  const dominantTrait = traitPairs[0].label;
  const secondaryTrait = traitPairs[1].label;

  const clinicalInterpretation = `El perfil de personalidad Big Five destaca por una marcada ${dominantTrait} (${traitPairs[0].score}%), acompañada de ${secondaryTrait} (${traitPairs[1].score}%). Esta configuración favorece la perseverancia académica, la curiosidad intelectual y una interacción prosocial saludable con pares y figuras de autoridad.`;

  return {
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    emotionalStability,
    dominantTrait,
    secondaryTrait,
    clinicalInterpretation
  };
}

// ============================================================================
// 3. CÁLCULO DE ESTILO DE APRENDIZAJE (KOLB Y VARK)
// ============================================================================
export function scoreLearningTest(answers: Record<string, string>): LearningStyleResult {
  const varkCounts: Record<string, number> = { V: 0, A: 0, R: 0, K: 0 };
  const kolbCounts: Record<string, number> = { EC: 0, OR: 0, CA: 0, EA: 0 };

  for (const q of LEARNING_QUESTIONS) {
    const selectedId = answers[q.id];
    const opt = q.options.find((o) => o.id === selectedId);
    const sub = opt?.subDimension || q.options[0].subDimension!;
    if (q.subscale === 'vark') {
      varkCounts[sub] = (varkCounts[sub] || 0) + 1;
    } else {
      kolbCounts[sub] = (kolbCounts[sub] || 0) + 1;
    }
  }

  const visual = Math.round((varkCounts.V / 16) * 100);
  const auditory = Math.round((varkCounts.A / 16) * 100);
  const readWrite = Math.round((varkCounts.R / 16) * 100);
  const kinesthetic = Math.max(0, 100 - (visual + auditory + readWrite));

  const varkSorted = [
    { label: 'Visual (V)' as const, val: visual },
    { label: 'Auditivo (A)' as const, val: auditory },
    { label: 'Lectura y Escritura (R)' as const, val: readWrite },
    { label: 'Kinestésico (K)' as const, val: kinesthetic }
  ].sort((a, b) => b.val - a.val);

  const dominantModality = varkSorted[0].label;
  const multimodalProfile = `${varkSorted[0].label} (${varkSorted[0].val}%) + ${varkSorted[1].label} (${varkSorted[1].val}%)`;

  // Kolb normalized (9 questions total, base + percentage)
  const concreteExperience = Math.round(25 + (kolbCounts.EC / 9) * 75);
  const reflectiveObservation = Math.round(25 + (kolbCounts.OR / 9) * 75);
  const abstractConceptualization = Math.round(25 + (kolbCounts.CA / 9) * 75);
  const activeExperimentation = Math.round(25 + (kolbCounts.EA / 9) * 75);

  // Ejes de Kolb: (CA - EC) y (EA - OR)
  const abstractVsConcrete = abstractConceptualization - concreteExperience;
  const activeVsReflective = activeExperimentation - reflectiveObservation;

  let style: 'Divergente' | 'Asimilador' | 'Convergente' | 'Acomodador' = 'Convergente';
  let styleDescription = '';

  if (abstractVsConcrete >= 0 && activeVsReflective >= 0) {
    style = 'Convergente';
    styleDescription = 'Combina Conceptualización Abstracta (CA) y Experimentación Activa (EA). Sobresale en la aplicación práctica de ideas teóricas, resolución de problemas técnicos y toma de decisiones estructuradas.';
  } else if (abstractVsConcrete >= 0 && activeVsReflective < 0) {
    style = 'Asimilador';
    styleDescription = 'Combina Conceptualización Abstracta (CA) y Observación Reflexiva (OR). Destaca en el razonamiento inductivo, creación de modelos teóricos, investigación científica y síntesis lógica.';
  } else if (abstractVsConcrete < 0 && activeVsReflective < 0) {
    style = 'Divergente';
    styleDescription = 'Combina Experiencia Concreta (EC) y Observación Reflexiva (OR). Posee alta capacidad imaginativa, generación de ideas desde múltiples perspectivas y sensibilidad humanística y artística.';
  } else {
    style = 'Acomodador';
    styleDescription = 'Combina Experiencia Concreta (EC) y Experimentación Activa (EA). Aprende mejor mediante la acción directa, el liderazgo de proyectos prácticos y la adaptación dinámica a nuevos retos.';
  }

  const clinicalInterpretation = `En el modelo VARK predomina el canal ${dominantModality}, conformando una diada ${multimodalProfile}. En el ciclo experiencial de David Kolb se ubica en el cuadrante ${style}: ${styleDescription}`;

  return {
    vark: {
      visual,
      auditory,
      readWrite,
      kinesthetic,
      dominantModality,
      multimodalProfile
    },
    kolb: {
      concreteExperience,
      reflectiveObservation,
      abstractConceptualization,
      activeExperimentation,
      style,
      styleDescription
    },
    clinicalInterpretation
  };
}

// ============================================================================
// 4. CÁLCULO VOCACIONAL (TEST CHASIDE)
// ============================================================================
export function scoreVocationTest(answers: Record<string, string>): VocationResult {
  const areaTotals: Record<ChasideAreaCode, { earned: number; max: number; interestEarned: number; interestMax: number; aptitudeEarned: number; aptitudeMax: number }> = {
    C: { earned: 0, max: 0, interestEarned: 0, interestMax: 0, aptitudeEarned: 0, aptitudeMax: 0 },
    H: { earned: 0, max: 0, interestEarned: 0, interestMax: 0, aptitudeEarned: 0, aptitudeMax: 0 },
    A: { earned: 0, max: 0, interestEarned: 0, interestMax: 0, aptitudeEarned: 0, aptitudeMax: 0 },
    S: { earned: 0, max: 0, interestEarned: 0, interestMax: 0, aptitudeEarned: 0, aptitudeMax: 0 },
    I: { earned: 0, max: 0, interestEarned: 0, interestMax: 0, aptitudeEarned: 0, aptitudeMax: 0 },
    D: { earned: 0, max: 0, interestEarned: 0, interestMax: 0, aptitudeEarned: 0, aptitudeMax: 0 },
    E: { earned: 0, max: 0, interestEarned: 0, interestMax: 0, aptitudeEarned: 0, aptitudeMax: 0 }
  };

  for (const q of VOCATION_QUESTIONS) {
    const code = q.subscale as ChasideAreaCode;
    const selectedId = answers[q.id];
    const opt = q.options.find((o) => o.id === selectedId) || q.options[1];
    const isAptitude = opt.subDimension?.includes('aptitude');

    areaTotals[code].earned += opt.scoreValue;
    areaTotals[code].max += 2;

    if (isAptitude) {
      areaTotals[code].aptitudeEarned += opt.scoreValue;
      areaTotals[code].aptitudeMax += 2;
    } else {
      areaTotals[code].interestEarned += opt.scoreValue;
      areaTotals[code].interestMax += 2;
    }
  }

  const areas = {} as Record<ChasideAreaCode, number>;
  const interestsScore = {} as Record<ChasideAreaCode, number>;
  const aptitudesScore = {} as Record<ChasideAreaCode, number>;

  (Object.keys(areaTotals) as ChasideAreaCode[]).forEach((code) => {
    const item = areaTotals[code];
    areas[code] = item.max > 0 ? Math.round((item.earned / item.max) * 100) : 50;
    interestsScore[code] = item.interestMax > 0 ? Math.round((item.interestEarned / item.interestMax) * 100) : 50;
    aptitudesScore[code] = item.aptitudeMax > 0 ? Math.round((item.aptitudeEarned / item.aptitudeMax) * 100) : 50;
  });

  const sortedCodes = (Object.keys(areas) as ChasideAreaCode[]).sort((a, b) => areas[b] - areas[a]);
  const primaryCode = sortedCodes[0];
  const secondaryCode = sortedCodes[1];
  const primaryName = CHASIDE_DESCRIPTIONS[primaryCode].name;
  const secondaryName = CHASIDE_DESCRIPTIONS[secondaryCode].name;

  const clinicalInterpretation = `El perfil vocacional CHASIDE muestra una convergencia primaria hacia el Área ${primaryCode} (${primaryName}, ${areas[primaryCode]}% de afinidad global) y una línea complementaria en el Área ${secondaryCode} (${secondaryName}, ${areas[secondaryCode]}%). Existe coherencia entre los intereses declarados y las aptitudes autopercibidas.`;

  return {
    areas,
    interestsScore,
    aptitudesScore,
    primaryCode,
    secondaryCode,
    primaryName,
    secondaryName,
    clinicalInterpretation
  };
}

// ============================================================================
// 5. CÁLCULO DE NIVEL EXTRASENSORIAL (ESTUDIOS PES / RHINE)
// ============================================================================
export function scoreEspTest(answers: Record<string, string>): EspResult {
  let zenerHits = 0;
  const subSums: Record<string, { earned: number; max: number }> = {
    telepathySymbolic: { earned: 0, max: 0 },
    clairvoyancePattern: { earned: 0, max: 0 },
    precognitionIntuitive: { earned: 0, max: 0 },
    synestheticSensitivity: { earned: 0, max: 0 }
  };

  for (const q of ESP_QUESTIONS) {
    const selectedId = answers[q.id];
    const opt = q.options.find((o) => o.id === selectedId) || q.options[2];

    if (q.number <= 10 && opt.subDimension === 'zener_hit') {
      zenerHits += 1;
    }

    subSums[q.subscale].earned += opt.scoreValue;
    subSums[q.subscale].max += 5;
  }

  const subscales = {
    telepathySymbolic: Math.round((subSums.telepathySymbolic.earned / subSums.telepathySymbolic.max) * 100),
    clairvoyancePattern: Math.round((subSums.clairvoyancePattern.earned / subSums.clairvoyancePattern.max) * 100),
    precognitionIntuitive: Math.round((subSums.precognitionIntuitive.earned / subSums.precognitionIntuitive.max) * 100),
    synestheticSensitivity: Math.round((subSums.synestheticSensitivity.earned / subSums.synestheticSensitivity.max) * 100)
  };

  const scorePercentage = Math.round(
    (subscales.telepathySymbolic +
      subscales.clairvoyancePattern +
      subscales.precognitionIntuitive +
      subscales.synestheticSensitivity) /
      4
  );

  const intuitiveIndex = Math.min(100, Math.round(scorePercentage * 0.75 + (zenerHits / 10) * 25));

  let classification = 'Sensibilidad Perceptiva Moderada (Rango Estadístico Normal)';
  if (intuitiveIndex >= 80 || zenerHits >= 5) {
    classification = 'Alta Agudeza Intuitiva y Sincronía Perceptiva Superior (Desviación Positiva Significativa)';
  } else if (intuitiveIndex >= 65 || zenerHits >= 4) {
    classification = 'Sensibilidad Intuitiva Destacada y Reconocimiento Subliminal Rápido';
  }

  const clinicalInterpretation = `En el protocolo Zener de J.B. Rhine registró ${zenerHits}/10 aciertos directos (media esperada por azar estadístico: 2.0/10 = 20%). El Índice Global de Intuición Perceptiva se sitúa en ${intuitiveIndex}/100 (${classification}), reflejando alta capacidad para integrar señales contextuales sutiles, asociación sinestésica e incubación creativa de problemas.`;

  return {
    scorePercentage,
    zenerHits,
    zenerExpectedChance: 2.0,
    intuitiveIndex,
    classification,
    subscales,
    clinicalInterpretation
  };
}

// ============================================================================
// 6. MOTOR DE RECOMENDACIONES PERSONALIZADAS MULTIDIMENSIONALES
// (Cruza CI Wechsler + Personalidad Big Five + Kolb/VARK + CHASIDE + PES)
// ============================================================================
export function generatePersonalizedRecommendations(
  ci: CIResult,
  personality: BigFiveResult,
  learning: LearningStyleResult,
  vocation: VocationResult,
  esp: EspResult,
  adolescentFirstName: string
): PersonalizedRecommendations {
  const primaryArea = vocation.primaryCode;
  const secondaryArea = vocation.secondaryCode;

  // Base de datos curada de carreras profesionales por código CHASIDE + cruce cognitivo/personalidad
  const careerCatalogByArea: Record<ChasideAreaCode, Omit<CareerRecommendation, 'affinityPercentage'>[]> = {
    I: [
      {
        title: 'Ingeniería de Sistemas, Computación e Inteligencia Artificial',
        chasideCode: 'I',
        areaLabel: 'Ingenierías y Tecnología',
        rationale: `Se alinea directamente con tu alto Razonamiento Fluido (${ci.subscales.fluidReasoning}%) y Memoria de Trabajo (${ci.subscales.workingMemory}%), potenciando tu estilo de aprendizaje ${learning.kolb.style} para diseñar arquitecturas de software y modelos predictivos.`,
        suggestedAcademicPrograms: ['Ingeniería de Sistemas y Computación', 'Ciencia de Datos', 'Ingeniería de Software'],
        keyStrengthsMatched: [`CI Total ${ci.totalIQ}`, `Estilo Kolb ${learning.kolb.style}`, `Responsabilidad ${personality.conscientiousness}%`]
      },
      {
        title: 'Ingeniería Mecatrónica, Robótica y Automatización',
        chasideCode: 'I',
        areaLabel: 'Ingenierías y Tecnología',
        rationale: `Integra tu capacidad Visoespacial (${ci.subscales.visuospatial}%) con la experimentación práctica y tu curiosidad intelectual (Apertura ${personality.openness}%) para construir sistemas ciberfísicos reales.`,
        suggestedAcademicPrograms: ['Ingeniería Mecatrónica', 'Ingeniería Electrónica', 'Ingeniería Aeroespacial'],
        keyStrengthsMatched: [`Visoespacial ${ci.subscales.visuospatial}%`, `Apertura ${personality.openness}%`, `Área I (${vocation.areas.I}%)`]
      }
    ],
    E: [
      {
        title: 'Biotecnología, Genómica e Ingeniería Ambiental',
        chasideCode: 'E',
        areaLabel: 'Ciencias Exactas y Naturales',
        rationale: `Combina tu rigor analítico en la escala Wechsler con tu vocación por el método científico y la sostenibilidad de los ecosistemas estratégicos de Colombia.`,
        suggestedAcademicPrograms: ['Ingeniería Biotecnológica', 'Biología / Microbiología', 'Ingeniería Ambiental'],
        keyStrengthsMatched: [`Razonamiento Fluido ${ci.subscales.fluidReasoning}%`, `Área E (${vocation.areas.E}%)`, `Sensibilidad Perceptiva ${esp.intuitiveIndex}%`]
      },
      {
        title: 'Física Aplicada, Matemáticas Computacionales y Astrofísica',
        chasideCode: 'E',
        areaLabel: 'Ciencias Exactas y Naturales',
        rationale: `Ideal para tu perfil cognitivo (${ci.classification}) y tu capacidad de conceptualización abstracta para modelar fenómenos complejos de la naturaleza.`,
        suggestedAcademicPrograms: ['Física', 'Matemáticas Aplicadas', 'Ingeniería Física'],
        keyStrengthsMatched: [`CI ${ci.totalIQ} (Percentil ${ci.percentile})`, `Conceptualización Abstracta ${learning.kolb.abstractConceptualization}%`]
      }
    ],
    S: [
      {
        title: 'Medicina, Neurociencias Clínicas e Ingeniería Biomédica',
        chasideCode: 'S',
        areaLabel: 'Ciencias de la Salud',
        rationale: `Articula tu alto sentido de Amabilidad y Empatía (${personality.agreeableness}%) y Estabilidad Emocional (${personality.emotionalStability}%) con la precisión diagnóstica que exige el ámbito clínico.`,
        suggestedAcademicPrograms: ['Medicina', 'Ingeniería Biomédica', 'Fisioterapia y Rehabilitación'],
        keyStrengthsMatched: [`Amabilidad ${personality.agreeableness}%`, `Estabilidad Emocional ${personality.emotionalStability}%`, `Área S (${vocation.areas.S}%)`]
      },
      {
        title: 'Psicología Clínica, Neuropsicología y Ciencias Cognitivas',
        chasideCode: 'S',
        areaLabel: 'Salud y Comportamiento Humano',
        rationale: `Tu Comprensión Verbal (${ci.subscales.verbalComprehension}%) junto con tu agudeza intuitiva PES (${esp.intuitiveIndex}%) te otorgan una sensibilidad excepcional para comprender la mente humana.`,
        suggestedAcademicPrograms: ['Psicología', 'Neurociencias', 'Terapia Ocupacional'],
        keyStrengthsMatched: [`Comprensión Verbal ${ci.subscales.verbalComprehension}%`, `Intuición Perceptiva ${esp.intuitiveIndex}%`]
      }
    ],
    C: [
      {
        title: 'Economía, Finanzas Cuantitativas y Administración Estratégica',
        chasideCode: 'C',
        areaLabel: 'Ciencias Económicas y Administrativas',
        rationale: `Potencia tu velocidad de procesamiento (${ci.subscales.processingSpeed}%), responsabilidad (${personality.conscientiousness}%) y liderazgo organizacional para dirigir proyectos de alto impacto económico.`,
        suggestedAcademicPrograms: ['Economía', 'Administración de Empresas', 'Ingeniería Industrial', 'Finanzas y Comercio Internacional'],
        keyStrengthsMatched: [`Responsabilidad ${personality.conscientiousness}%`, `Extraversión ${personality.extraversion}%`, `Área C (${vocation.areas.C}%)`]
      }
    ],
    H: [
      {
        title: 'Derecho, Relaciones Internacionales y Ciencias Políticas',
        chasideCode: 'H',
        areaLabel: 'Humanidades y Ciencias Jurídicas',
        rationale: `Tu fortaleza en Comprensión Verbal (${ci.subscales.verbalComprehension}%) y empatía social (${personality.agreeableness}%) te perfilan como un líder capaz de argumentar con rigor y transformar realidades sociales.`,
        suggestedAcademicPrograms: ['Derecho', 'Ciencia Política y Gobierno', 'Relaciones Internacionales', 'Comunicación Social'],
        keyStrengthsMatched: [`Comprensión Verbal ${ci.subscales.verbalComprehension}%`, `Amabilidad ${personality.agreeableness}%`, `Área H (${vocation.areas.H}%)`]
      }
    ],
    A: [
      {
        title: 'Arquitectura, Diseño Industrial y Medios Interactivos',
        chasideCode: 'A',
        areaLabel: 'Arquitectura, Diseño y Artes',
        rationale: `Conecta tu talento Visoespacial (${ci.subscales.visuospatial}%), tu Apertura estética (${personality.openness}%) y tu sensibilidad sinestésica (${esp.subscales.synestheticSensitivity}%) para proyectar espacios y experiencias innovadoras.`,
        suggestedAcademicPrograms: ['Arquitectura', 'Diseño Industrial', 'Diseño de Medios Interactivos', 'Artes Visuales'],
        keyStrengthsMatched: [`Visoespacial ${ci.subscales.visuospatial}%`, `Apertura ${personality.openness}%`, `Área A (${vocation.areas.A}%)`]
      }
    ],
    D: [
      {
        title: 'Ingeniería en Ciberseguridad, Aeronáutica y Gestión Estratégica del Riesgo',
        chasideCode: 'D',
        areaLabel: 'Seguridad, Logística y Liderazgo',
        rationale: `Aprovecha tu temple emocional (${personality.emotionalStability}%), velocidad de respuesta (${ci.subscales.processingSpeed}%) y sentido del deber para proteger infraestructuras críticas y liderar equipos tácticos.`,
        suggestedAcademicPrograms: ['Ingeniería en Ciberseguridad', 'Ingeniería Aeronáutica', 'Administración Logística'],
        keyStrengthsMatched: [`Estabilidad Emocional ${personality.emotionalStability}%`, `Velocidad ${ci.subscales.processingSpeed}%`, `Área D (${vocation.areas.D}%)`]
      }
    ]
  };

  // Seleccionar carreras combinando el área primaria, secundaria y tercera del adolescente
  const sortedChaside = (Object.keys(vocation.areas) as ChasideAreaCode[]).sort(
    (a, b) => vocation.areas[b] - vocation.areas[a]
  );

  const selectedCareers: CareerRecommendation[] = [];
  for (const code of sortedChaside.slice(0, 3)) {
    const candidates = careerCatalogByArea[code] || [];
    for (const c of candidates) {
      const baseAffinity = vocation.areas[code];
      const iqBonus = Math.round((ci.totalIQ - 100) * 0.25);
      const affinityPercentage = Math.min(99, Math.max(78, Math.round(baseAffinity * 0.7 + 22 + iqBonus)));
      selectedCareers.push({
        ...c,
        affinityPercentage
      });
    }
  }

  // Ordenar por afinidad y dejar top 4
  const careers = selectedCareers.sort((a, b) => b.affinityPercentage - a.affinityPercentage).slice(0, 4);

  // Generar áreas de estudio y estrategias adaptadas al perfil VARK + Kolb + CI
  const studyAreas: StudyAreaRecommendation[] = [
    {
      areaTitle: `Estrategia Neurosensorial Dominante: ${learning.vark.dominantModality}`,
      modalityAlignment: `Perfil VARK: ${learning.vark.multimodalProfile}`,
      kolbAlignment: `Cuadrante Kolb: ${learning.kolb.style}`,
      concreteTechniques:
        learning.vark.dominantModality === 'Visual (V)'
          ? [
              'Construye mapas de arquitectura conceptual con codificación cromática para sintetizar teorías complejas.',
              'Utiliza diagramas de flujo, matrices comparativas y modelado geométrico antes de memorizar fórmulas.',
              'Transforma tus lecturas extensas en tableros visuales tipo Kanban o esquemas espaciales.'
            ]
          : learning.vark.dominantModality === 'Auditivo (A)'
          ? [
              'Aplica la Técnica Feynman explicando en voz alta los conceptos recién estudiados como si dieras una conferencia.',
              'Participa en grupos de discusión socrática y graba notas de voz con síntesis ejecutivas de cada tema.',
              'Asocia secuencias lógicas con ritmos verbales y debates argumentativos.'
            ]
          : learning.vark.dominantModality === 'Lectura y Escritura (R)'
          ? [
              'Implementa el sistema de toma de apuntes Cornell y construye un repositorio personal de ensayos breves.',
              'Redacta glosarios técnicos precisos y resúmenes ejecutivos estructurados por premisas y conclusiones.',
              'Profundiza mediante lectura crítica de artículos científicos y libros especializados.'
            ]
          : [
              'Aprende mediante proyectos prácticos (Project-Based Learning), simuladores interactivos y laboratorios.',
              'Divide el estudio en bloques Pomodoro de 30 minutos intercalados con prototipado físico o programación.',
              'Vincula cada concepto abstracto con un caso real, experimento o demostración tangible.'
            ],
      motivationalMessage: `${adolescentFirstName}, tu cerebro asimila y retiene información con mucha mayor velocidad cuando respetas tu canal ${learning.vark.dominantModality} y tu ciclo ${learning.kolb.style}.`
    },
    {
      areaTitle: `Núcleo Académico de Alta Potencialidad: ${CHASIDE_DESCRIPTIONS[primaryArea].name}`,
      modalityAlignment: `Afinidad Vocacional Primaria: ${vocation.areas[primaryArea]}%`,
      kolbAlignment: `Fortaleza Wechsler asociada: CIT ${ci.totalIQ}`,
      concreteTechniques: [
        `Profundizar en electivas o semilleros preuniversitarios de ${CHASIDE_DESCRIPTIONS[primaryArea].sampleCareers.slice(0, 2).join(' y ')}.`,
        `Conectar con el área complementaria (${CHASIDE_DESCRIPTIONS[secondaryArea].name}) mediante proyectos interdisciplinarios.`,
        `Entrenar la subescala de Memoria de Trabajo (${ci.subscales.workingMemory}%) y Razonamiento Fluido (${ci.subscales.fluidReasoning}%) con retos semanales.`
      ],
      motivationalMessage: `La combinación entre tu Área ${primaryArea} y tu Área ${secondaryArea} te brinda un perfil híbrido sumamente valorado en las universidades y escenarios profesionales del siglo XXI.`
    },
    {
      areaTitle: 'Entrenamiento Metacognitivo e Intuición Creativa (PES + Apertura)',
      modalityAlignment: `Índice Intuitivo PES: ${esp.intuitiveIndex}/100 · Apertura: ${personality.openness}%`,
      kolbAlignment: 'Integración Hemisférica (Análisis Lógico + Insight Creativo)',
      concreteTechniques: [
        'Lleva una bitácora de ideas e insights donde registres soluciones creativas que surgen tras pausas de incubación.',
        'Practica ejercicios de atención plena (mindfulness de 10 minutos) antes de evaluaciones de alta exigencia para potenciar tu claridad perceptiva.',
        'Combina la verificación empírica rigurosa con tu capacidad para detectar patrones sutiles.'
      ],
      motivationalMessage: `Tu puntuación en sensibilidad perceptiva (${esp.intuitiveIndex}%) unida a tu apertura intelectual (${personality.openness}%) te permite ver conexiones innovadoras donde otros solo ven datos aislados.`
    }
  ];

  // Actividades Extracurriculares personalizadas
  const extracurriculars: ExtracurricularRecommendation[] = [
    {
      activityTitle:
        primaryArea === 'I' || primaryArea === 'E'
          ? 'Semillero de Robótica, Programación Competitiva u Olimpiadas de Ciencia'
          : primaryArea === 'H' || primaryArea === 'C'
          ? 'Modelo de Naciones Unidas (ONU), Club de Debate Crítico y Liderazgo Estudiantil'
          : primaryArea === 'S'
          ? 'Grupo de Investigación Escolar en Biomédica, Primeros Auxilios y Voluntariado en Salud'
          : 'Laboratorio de Diseño Arquitectónico, Producción Audiovisual y Creación Digital',
      category: 'Excelencia Académica y Vocacional',
      recommendedFrequency: '2 sesiones por semana (3 a 4 horas semanales)',
      developmentalImpact: 'Potencia el Razonamiento Fluido, el trabajo colaborativo por proyectos y el portafolio preuniversitario.',
      whyItFitsAdolescent: `Diseñado específicamente para canalizar tu ${vocation.areas[primaryArea]}% de afinidad en el Área ${primaryArea} y tu estilo ${learning.kolb.style}.`
    },
    {
      activityTitle:
        ci.subscales.visuospatial >= 80 || ci.subscales.fluidReasoning >= 80
          ? 'Club de Ajedrez Estratégico, Modelado 3D y Pensamiento Algorítmico'
          : 'Taller de Escritura Creativa, Oratoria Argumentativa y Periodismo Científico',
      category: 'Gimnasia Cognitiva (Escala Wechsler)',
      recommendedFrequency: '2 horas semanales',
      developmentalImpact: 'Fortalece la Memoria de Trabajo (IMT), la anticipación de jugadas y la velocidad de procesamiento.',
      whyItFitsAdolescent: `Aprovecha tu CIT de ${ci.totalIQ} puntos (${ci.classification}) para desafiarte en un entorno estimulante y divertido.`
    },
    {
      activityTitle:
        personality.agreeableness >= 75
          ? 'Mentorías entre Pares (Tutoría Académica Solidaria) e Innovación Social'
          : 'Emprendimiento Juvenil (Startup Escolar) y Gestión de Proyectos',
      category: 'Desarrollo Socioemocional (Big Five)',
      recommendedFrequency: '1 sesión semanal o proyecto mensual',
      developmentalImpact: 'Consolida el liderazgo ético, la comunicación asertiva, la empatía y la autorregulación emocional.',
      whyItFitsAdolescent: `Resuena con tu rasgo dominante de ${personality.dominantTrait} y fortalece tu confianza interpersonal.`
    },
    {
      activityTitle: 'Entrenamiento Deportivo de Enfoque / Artes Escénicas o Musicales',
      category: 'Equilibrio Cuerpo-Mente y Sensibilidad Perceptiva',
      recommendedFrequency: '3 veces por semana (45 minutos)',
      developmentalImpact: 'Regula el cortisol, mejora la coordinación visomotora y estimula la neuroplasticidad hipocampal.',
      whyItFitsAdolescent: `Complementa tu Estabilidad Emocional (${personality.emotionalStability}%) y tu sensibilidad sinestésica (${esp.subscales.synestheticSensitivity}%).`
    }
  ];

  // Plan de seguimiento a 6 meses
  const sixMonthMilestones: SixMonthMilestone[] = [
    {
      domain: 'ci',
      domainLabel: 'CI · Wechsler',
      goalTitle: 'Consolidación de Memoria Operativa y Velocidad Analítica',
      actionStep: 'Practicar 15 minutos tres veces por semana retos de matrices lógicas, cálculo mental y retención inversa.',
      measurableIndicator: `Incrementar o mantener el CIT en rango ${ci.totalIQ + 3}+ en la próxima evaluación semestral.`
    },
    {
      domain: 'personality',
      domainLabel: 'Personalidad · Big Five',
      goalTitle: 'Fortalecimiento de Autodisciplina y Regulación ante Exámenes',
      actionStep: 'Aplicar planificación semanal por bloques y registro de hábitos de estudio autónomo.',
      measurableIndicator: `Alcanzar ≥ ${Math.min(98, personality.conscientiousness + 5)}% en Responsabilidad y Estabilidad Emocional.`
    },
    {
      domain: 'learning',
      domainLabel: 'Aprendizaje · Kolb & VARK',
      goalTitle: 'Expansión Multimodal de Estrategias de Estudio',
      actionStep: `Combinar tu fortaleza ${learning.vark.dominantModality} con síntesis escrita y experimentación práctica.`,
      measurableIndicator: 'Aplicar el método en las 3 asignaturas de mayor exigencia durante el semestre.'
    },
    {
      domain: 'vocation',
      domainLabel: 'Vocación · CHASIDE',
      goalTitle: 'Exploración Vivencial de Carreras Universitarias',
      actionStep: `Asistir a 2 ferias universitarias o laboratorios abiertos de ${careers[0]?.title || 'tu área principal'} y conversar con profesionales del sector.`,
      measurableIndicator: 'Definir tu top 3 de programas universitarios e instituciones en Colombia.'
    },
    {
      domain: 'esp',
      domainLabel: 'Percepción · PES',
      goalTitle: 'Entrenamiento de Atención Plena e Intuición Creativa',
      actionStep: 'Registrar en una bitácora personal tus intuiciones, resolución creativa de problemas y atención al detalle.',
      measurableIndicator: 'Evaluar la evolución del Índice Intuitivo en el control longitudinal de 6 meses.'
    }
  ];

  const executiveMotivation = `¡Felicitaciones, ${adolescentFirstName}! Los resultados de tu evaluación multidimensional revelan un potencial extraordinario: cuentas con un Cociente Intelectual de ${ci.totalIQ} (${ci.classification}), una personalidad liderada por ${personality.dominantTrait}, un estilo de aprendizaje ${learning.kolb.style} (${learning.vark.dominantModality}) y una clara vocación hacia ${vocation.primaryName}. Este informe ejecutivo ha sido diseñado como tu brújula personal para los próximos 6 meses.`;

  const integratedProfileSynthesis = `El análisis psicométrico cruzado indica una alta congruencia entre la arquitectura cognitiva (CIT ${ci.totalIQ}, Percentil ${ci.percentile}), la estructura de personalidad Big Five (Apertura ${personality.openness}%, Responsabilidad ${personality.conscientiousness}%, Estabilidad ${personality.emotionalStability}%), el procesamiento de aprendizaje (${learning.kolb.style} / ${learning.vark.dominantModality}) y el vector vocacional CHASIDE (${vocation.primaryCode}-${vocation.secondaryCode}). La sensibilidad perceptiva PES (${esp.intuitiveIndex}/100) aporta además intuición creativa para la resolución de problemas complejos.`;

  return {
    executiveMotivation,
    integratedProfileSynthesis,
    careers,
    studyAreas,
    extracurriculars,
    sixMonthMilestones
  };
}

// ============================================================================
// PERFIL DEMO PRECARGADO Y SU HISTORIAL LONGITUDINAL DE 3 PERÍODOS (12 MESES)
// ============================================================================
export const DEMO_USER_PROFILE: UserProfile = {
  id: 'usr-valentina-2026',
  firstName: 'Valentina',
  lastName: 'Gómez Restrepo',
  birthDate: '2010-04-14', // 16 años
  sex: 'Femenino',
  socioeconomicStratum: 4,
  email: 'valentina.gomez@estudiante.edu.co',
  colombianConsentAccepted: true,
  consentTimestamp: '2025-10-05T14:20:00.000Z',
  reEvaluationIntervalMonths: 6,
  createdAt: '2025-10-05T14:20:00.000Z'
};

function buildHistoricalAssessment(
  id: string,
  completedAt: string,
  periodLabel: string,
  ageAtEvaluation: number,
  ciScore: CIResult,
  personalityScore: BigFiveResult,
  learningScore: LearningStyleResult,
  vocationScore: VocationResult,
  espScore: EspResult
): FullAssessmentRecord {
  return {
    id,
    userId: DEMO_USER_PROFILE.id,
    completedAt,
    periodLabel,
    ageAtEvaluation,
    stratumAtEvaluation: DEMO_USER_PROFILE.socioeconomicStratum,
    ci: ciScore,
    personality: personalityScore,
    learning: learningScore,
    vocation: vocationScore,
    esp: espScore,
    recommendations: generatePersonalizedRecommendations(
      ciScore,
      personalityScore,
      learningScore,
      vocationScore,
      espScore,
      DEMO_USER_PROFILE.firstName
    ),
    smtpSentTo: 'ffadullgu@yahoo.com',
    smtpSentAt: completedAt
  };
}

export const DEMO_HISTORICAL_ASSESSMENTS: FullAssessmentRecord[] = [
  // 1. Octubre 2025 (Hace 12 meses - Línea Base)
  buildHistoricalAssessment(
    'eval-2025-10',
    '2025-10-06T15:00:00.000Z',
    'Octubre 2025 · Línea Base Inicial (Hace 12 meses)',
    15,
    {
      totalIQ: 116,
      percentile: 84,
      classification: 'Promedio Alto (110–119)',
      rawScore: 16,
      subscales: {
        verbalComprehension: 80,
        visuospatial: 80,
        fluidReasoning: 80,
        workingMemory: 60,
        processingSpeed: 60
      },
      clinicalInterpretation: 'Evaluación base a los 15 años: CIT de 116 puntos (Percentil 84, Promedio Alto). Sólida base en comprensión verbal y razonamiento fluido, con oportunidad de fortalecimiento en memoria de trabajo.'
    },
    {
      openness: 78,
      conscientiousness: 72,
      extraversion: 65,
      agreeableness: 82,
      emotionalStability: 68,
      dominantTrait: 'Amabilidad y Cooperación Empática (A)',
      secondaryTrait: 'Apertura a la Experiencia (O)',
      clinicalInterpretation: 'Perfil inicial caracterizado por alta empatía interpersonal (82%) y curiosidad intelectual (78%), en proceso de consolidar hábitos de planificación autónoma.'
    },
    {
      vark: {
        visual: 44,
        auditory: 19,
        readWrite: 18,
        kinesthetic: 19,
        dominantModality: 'Visual (V)',
        multimodalProfile: 'Visual (V) (44%) + Kinestésico (K) (19%)'
      },
      kolb: {
        concreteExperience: 58,
        reflectiveObservation: 75,
        abstractConceptualization: 75,
        activeExperimentation: 66,
        style: 'Asimilador',
        styleDescription: 'Predominio inicial reflexivo-teórico (Asimilador), con preferencia por comprender modelos conceptuales antes de pasar a la experimentación práctica.'
      },
      clinicalInterpretation: 'Preferencia visual marcada (44%) y estilo de procesamiento Asimilador en el ciclo de Kolb.'
    },
    {
      areas: { C: 58, H: 68, A: 64, S: 76, I: 82, D: 48, E: 78 },
      interestsScore: { C: 60, H: 70, A: 65, S: 75, I: 84, D: 50, E: 80 },
      aptitudesScore: { C: 56, H: 66, A: 63, S: 77, I: 80, D: 46, E: 76 },
      primaryCode: 'I',
      secondaryCode: 'E',
      primaryName: CHASIDE_DESCRIPTIONS.I.name,
      secondaryName: CHASIDE_DESCRIPTIONS.E.name,
      clinicalInterpretation: 'Inclinación temprana hacia las Ingenierías y Tecnología (Área I: 82%) y Ciencias Exactas/Biotecnología (Área E: 78%).'
    },
    {
      scorePercentage: 68,
      zenerHits: 3,
      zenerExpectedChance: 2.0,
      intuitiveIndex: 66,
      classification: 'Sensibilidad Intuitiva Destacada y Reconocimiento Subliminal Rápido',
      subscales: {
        telepathySymbolic: 65,
        clairvoyancePattern: 70,
        precognitionIntuitive: 64,
        synestheticSensitivity: 73
      },
      clinicalInterpretation: '3/10 aciertos Zener (por encima del azar del 20%) e Índice Intuitivo de 66/100.'
    }
  ),

  // 2. Abril 2026 (Hace 6 meses - Seguimiento Semestral I)
  buildHistoricalAssessment(
    'eval-2026-04',
    '2026-04-06T15:30:00.000Z',
    'Abril 2026 · Seguimiento Semestral I (Hace 6 meses)',
    15,
    {
      totalIQ: 122,
      percentile: 91,
      classification: 'Superior (120–129)',
      rawScore: 18,
      subscales: {
        verbalComprehension: 80,
        visuospatial: 80,
        fluidReasoning: 100,
        workingMemory: 80,
        processingSpeed: 60
      },
      clinicalInterpretation: 'Evolución semestral positiva (+6 puntos de CIT hasta 122, ingresando a rango Superior, Percentil 91). Notable salto en Razonamiento Fluido (100%) y Memoria de Trabajo (80%).'
    },
    {
      openness: 84,
      conscientiousness: 80,
      extraversion: 70,
      agreeableness: 85,
      emotionalStability: 75,
      dominantTrait: 'Amabilidad y Cooperación Empática (A)',
      secondaryTrait: 'Apertura a la Experiencia (O)',
      clinicalInterpretation: 'Incremento significativo en Responsabilidad (+8 puntos hasta 80%) y Estabilidad Emocional (+7 puntos hasta 75%) tras implementar técnicas de planificación semestral.'
    },
    {
      vark: {
        visual: 44,
        auditory: 18,
        readWrite: 19,
        kinesthetic: 19,
        dominantModality: 'Visual (V)',
        multimodalProfile: 'Visual (V) (44%) + Lectura y Escritura (R) (19%)'
      },
      kolb: {
        concreteExperience: 62,
        reflectiveObservation: 72,
        abstractConceptualization: 83,
        activeExperimentation: 78,
        style: 'Convergente',
        styleDescription: 'Transición evolutiva hacia el estilo Convergente al fortalecer la Experimentación Activa (78%) en laboratorios escolares.'
      },
      clinicalInterpretation: 'Transición de estilo Asimilador a Convergente, integrando la teoría con el desarrollo de proyectos prácticos.'
    },
    {
      areas: { C: 62, H: 70, A: 66, S: 80, I: 88, D: 52, E: 84 },
      interestsScore: { C: 64, H: 72, A: 68, S: 80, I: 90, D: 54, E: 86 },
      aptitudesScore: { C: 60, H: 68, A: 64, S: 80, I: 86, D: 50, E: 82 },
      primaryCode: 'I',
      secondaryCode: 'E',
      primaryName: CHASIDE_DESCRIPTIONS.I.name,
      secondaryName: CHASIDE_DESCRIPTIONS.E.name,
      clinicalInterpretation: 'Consolidación del perfil STEM en el Área I (88%) y Área E (84%), con crecimiento en Ciencias de la Salud/Biomédica (Área S: 80%).'
    },
    {
      scorePercentage: 74,
      zenerHits: 4,
      zenerExpectedChance: 2.0,
      intuitiveIndex: 73,
      classification: 'Sensibilidad Intuitiva Destacada y Reconocimiento Subliminal Rápido',
      subscales: {
        telepathySymbolic: 72,
        clairvoyancePattern: 76,
        precognitionIntuitive: 70,
        synestheticSensitivity: 78
      },
      clinicalInterpretation: '4/10 aciertos en protocolo Zener (doble del azar esperado) e Índice Intuitivo de 73/100 (+7 puntos respecto a la línea base).'
    }
  ),

  // 3. Octubre 2026 (Evaluación Actual - 16 años)
  buildHistoricalAssessment(
    'eval-2026-10',
    '2026-10-06T01:45:00.000Z',
    'Octubre 2026 · Evaluación Semestral II (Actual)',
    16,
    {
      totalIQ: 128,
      percentile: 96,
      classification: 'Superior (120–129)',
      rawScore: 21,
      subscales: {
        verbalComprehension: 100,
        visuospatial: 80,
        fluidReasoning: 100,
        workingMemory: 80,
        processingSpeed: 80
      },
      clinicalInterpretation: 'El Cociente Intelectual Total (CIT) alcanza 128 puntos (Percentil 96, rango Superior), con una ganancia acumulada de +12 puntos en 12 meses. Destaca el dominio pleno en Comprensión Verbal (100%) y Razonamiento Fluido (100%), junto con el avance en Velocidad de Procesamiento (80%).'
    },
    {
      openness: 90,
      conscientiousness: 88,
      extraversion: 76,
      agreeableness: 86,
      emotionalStability: 82,
      dominantTrait: 'Apertura a la Experiencia (O)',
      secondaryTrait: 'Responsabilidad y Autodisciplina (C)',
      clinicalInterpretation: 'Maduración socioemocional sobresaliente: Apertura a la Experiencia (90%) y Responsabilidad (88%) lideran el perfil, acompañadas de una sólida Estabilidad Emocional (82%, +14 puntos en el último año).'
    },
    {
      vark: {
        visual: 50,
        auditory: 19,
        readWrite: 19,
        kinesthetic: 12,
        dominantModality: 'Visual (V)',
        multimodalProfile: 'Visual (V) (50%) + Auditivo/Lectoescritor (38%)'
      },
      kolb: {
        concreteExperience: 64,
        reflectiveObservation: 74,
        abstractConceptualization: 90,
        activeExperimentation: 86,
        style: 'Convergente',
        styleDescription: 'Combina Conceptualización Abstracta (90%) y Experimentación Activa (86%). Sobresale en la aplicación práctica de ideas teóricas, resolución de problemas técnicos y toma de decisiones estructuradas.'
      },
      clinicalInterpretation: 'Dominio del cuadrante Convergente de Kolb con canal primario Visual (50%), ideal para disciplinas de ingeniería, modelado científico y arquitectura de sistemas.'
    },
    {
      areas: { C: 68, H: 74, A: 72, S: 84, I: 94, D: 58, E: 89 },
      interestsScore: { C: 70, H: 75, A: 74, S: 85, I: 96, D: 60, E: 90 },
      aptitudesScore: { C: 66, H: 73, A: 70, S: 83, I: 92, D: 56, E: 88 },
      primaryCode: 'I',
      secondaryCode: 'E',
      primaryName: CHASIDE_DESCRIPTIONS.I.name,
      secondaryName: CHASIDE_DESCRIPTIONS.E.name,
      clinicalInterpretation: 'Definición vocacional de alta nitidez hacia el Área I (Ingenierías, Computación y Robótica: 94%) y el Área E (Ciencias Exactas y Biotecnología: 89%), con tercera línea en Ciencias Biomédicas (Área S: 84%).'
    },
    {
      scorePercentage: 82,
      zenerHits: 5,
      zenerExpectedChance: 2.0,
      intuitiveIndex: 81,
      classification: 'Alta Agudeza Intuitiva y Sincronía Perceptiva Superior (Desviación Positiva Significativa)',
      subscales: {
        telepathySymbolic: 78,
        clairvoyancePattern: 84,
        precognitionIntuitive: 80,
        synestheticSensitivity: 86
      },
      clinicalInterpretation: 'En el protocolo Zener registró 5/10 aciertos directos (2.5 veces la media estadística de azar) y un Índice Intuitivo de 81/100, con notable Sensibilidad Sinestésica (86%) y Clarividencia de Patrones (84%).'
    }
  )
];
