export type TestDomain = 'ci' | 'personality' | 'learning' | 'vocation' | 'esp';

export interface DomainThemeConfig {
  id: TestDomain;
  title: string;
  shortTitle: string;
  methodology: string;
  scientificBasis: string;
  colorName: string;
  primaryHex: string;
  bgLightClass: string;
  borderClass: string;
  textClass: string;
  buttonClass: string;
  accentBarClass: string;
  psychRationale: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: 'Femenino' | 'Masculino' | 'No binario / Intersexual' | 'Prefiero no responder';
  socioeconomicStratum: 1 | 2 | 3 | 4 | 5 | 6;
  email: string;
  colombianConsentAccepted: boolean;
  consentTimestamp: string;
  reEvaluationIntervalMonths: 3 | 6 | 12;
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  scoreValue: number;
  subDimension?: string;
}

export interface PsychometricQuestion {
  id: string;
  domain: TestDomain;
  number: number; // 1 to 25
  subscale: string;
  subscaleLabel: string;
  prompt: string;
  contextNote?: string;
  options: QuestionOption[];
}

export interface CIResult {
  totalIQ: number; // Escala Wechsler (70 - 145)
  percentile: number; // 1 - 99
  classification: string; // Ej: "Superior (120-129)", "Promedio Alto (110-119)", etc.
  rawScore: number; // 0 - 25
  subscales: {
    verbalComprehension: number; // ICV (0-100%)
    visuospatial: number; // IVE (0-100%)
    fluidReasoning: number; // IRF (0-100%)
    workingMemory: number; // IMT (0-100%)
    processingSpeed: number; // IVP (0-100%)
  };
  clinicalInterpretation: string;
}

export interface BigFiveResult {
  openness: number; // 0 - 100
  conscientiousness: number; // 0 - 100
  extraversion: number; // 0 - 100
  agreeableness: number; // 0 - 100
  emotionalStability: number; // 0 - 100
  dominantTrait: string;
  secondaryTrait: string;
  clinicalInterpretation: string;
}

export interface LearningStyleResult {
  vark: {
    visual: number; // 0 - 100%
    auditory: number;
    readWrite: number;
    kinesthetic: number;
    dominantModality: 'Visual (V)' | 'Auditivo (A)' | 'Lectura y Escritura (R)' | 'Kinestésico (K)';
    multimodalProfile: string;
  };
  kolb: {
    concreteExperience: number; // EC
    reflectiveObservation: number; // OR
    abstractConceptualization: number; // CA
    activeExperimentation: number; // EA
    style: 'Divergente' | 'Asimilador' | 'Convergente' | 'Acomodador';
    styleDescription: string;
  };
  clinicalInterpretation: string;
}

export type ChasideAreaCode = 'C' | 'H' | 'A' | 'S' | 'I' | 'D' | 'E';

export interface VocationResult {
  areas: Record<ChasideAreaCode, number>; // 0 - 100%
  interestsScore: Record<ChasideAreaCode, number>;
  aptitudesScore: Record<ChasideAreaCode, number>;
  primaryCode: ChasideAreaCode;
  secondaryCode: ChasideAreaCode;
  primaryName: string;
  secondaryName: string;
  clinicalInterpretation: string;
}

export interface EspResult {
  scorePercentage: number; // 0 - 100%
  zenerHits: number; // sobre 10 ensayos Zener
  zenerExpectedChance: number; // 2.0 (20% azar puro)
  intuitiveIndex: number; // 0 - 100
  classification: string;
  subscales: {
    telepathySymbolic: number;
    clairvoyancePattern: number;
    precognitionIntuitive: number;
    synestheticSensitivity: number;
  };
  clinicalInterpretation: string;
}

export interface CareerRecommendation {
  title: string;
  affinityPercentage: number;
  chasideCode: ChasideAreaCode;
  areaLabel: string;
  rationale: string;
  suggestedAcademicPrograms: string[];
  keyStrengthsMatched: string[];
}

export interface StudyAreaRecommendation {
  areaTitle: string;
  modalityAlignment: string;
  kolbAlignment: string;
  concreteTechniques: string[];
  motivationalMessage: string;
}

export interface ExtracurricularRecommendation {
  activityTitle: string;
  category: string;
  recommendedFrequency: string;
  developmentalImpact: string;
  whyItFitsAdolescent: string;
}

export interface SixMonthMilestone {
  domain: TestDomain;
  domainLabel: string;
  goalTitle: string;
  actionStep: string;
  measurableIndicator: string;
}

export interface PersonalizedRecommendations {
  executiveMotivation: string;
  integratedProfileSynthesis: string;
  careers: CareerRecommendation[];
  studyAreas: StudyAreaRecommendation[];
  extracurriculars: ExtracurricularRecommendation[];
  sixMonthMilestones: SixMonthMilestone[];
}

export interface FullAssessmentRecord {
  id: string;
  userId: string;
  completedAt: string; // ISO date
  periodLabel: string; // Ej. "Octubre 2026 · Evaluación Actual"
  ageAtEvaluation: number;
  stratumAtEvaluation: number;
  ci: CIResult;
  personality: BigFiveResult;
  learning: LearningStyleResult;
  vocation: VocationResult;
  esp: EspResult;
  recommendations: PersonalizedRecommendations;
  smtpSentTo?: string;
  smtpSentAt?: string;
}

export interface SmtpConfiguration {
  providerPreset: 'yahoo' | 'gmail' | 'outlook' | 'custom';
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  recipient: string;
  senderName: string;
  updatedAt: string;
}

export interface SmtpDispatchRecord {
  id: string;
  assessmentId: string;
  timestamp: string;
  recipient: string;
  smtpHost: string;
  smtpPort: number;
  protocol: string;
  status: 'sent_smtp' | 'verified_mime_relay';
  subject: string;
  messageId: string;
  adolescentName: string;
  adolescentEmail: string;
  summaryText: string;
  htmlBody: string;
}
