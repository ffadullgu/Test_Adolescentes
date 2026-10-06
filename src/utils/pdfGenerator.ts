import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FullAssessmentRecord, UserProfile, SmtpConfiguration, ChasideAreaCode } from '../types/psychometrics';
import { CHASIDE_DESCRIPTIONS } from '../data/psychometricTests';

export interface GeneratePdfOptions {
  fileName?: string;
  onProgress?: (stage: string) => void;
  user?: UserProfile;
  assessment?: FullAssessmentRecord;
  smtpConfig?: SmtpConfiguration;
}

/**
 * Genera y descarga un informe ejecutivo profesional en formato PDF
 * capturando el contenedor del reporte con alta resolución gráfica (2x DPI)
 * y paginación matemática estándar A4.
 */
export async function generateExecutiveReportPdf(
  element: HTMLElement,
  options: GeneratePdfOptions = {}
): Promise<void> {
  const {
    fileName = 'Informe_Psicometrico_Ejecutivo.pdf',
    onProgress,
    user,
    assessment,
    smtpConfig
  } = options;

  try {
    if (onProgress) onProgress('Preparando estructura del documento...');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210; // Ancho A4 en mm
    const pdfHeight = 297; // Alto A4 en mm
    const marginMm = 8;
    const contentWidthMm = pdfWidth - marginMm * 2;

    if (onProgress) onProgress('Renderizando gráficos y métricas en alta definición...');

    // Renderizar a canvas con html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // 2x DPI para nitidez cristalina en textos y gráficos
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth || 1200,
      windowHeight: element.scrollHeight,
      ignoreElements: (el) => {
        return (
          el.classList.contains('no-print') ||
          el.classList.contains('no-pdf') ||
          el.getAttribute('data-no-pdf') === 'true'
        );
      }
    });

    if (onProgress) onProgress('Compaginando páginas PDF...');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgWidth = contentWidthMm;
    const imgHeight = (canvas.height * contentWidthMm) / canvas.width;

    let heightLeft = imgHeight;
    let position = marginMm;
    let pageNumber = 1;

    // Primera página
    pdf.addImage(imgData, 'JPEG', marginMm, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= (pdfHeight - marginMm * 2);

    // Páginas subsecuentes
    while (heightLeft > 0) {
      pdf.addPage('a4', 'p');
      pageNumber++;
      position = marginMm - (pageNumber - 1) * (pdfHeight - marginMm * 2);
      pdf.addImage(imgData, 'JPEG', marginMm, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= (pdfHeight - marginMm * 2);
    }

    // Agregar pie de página institucional en cada página
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text(
        `PsicoEval Colombia · Informe Ejecutivo de Evaluación Psicométrica · Ley 1581 de 2012 · Página ${i} de ${totalPages}`,
        pdfWidth / 2,
        pdfHeight - 4,
        { align: 'center' }
      );
    }

    if (onProgress) onProgress('Descargando archivo PDF...');
    pdf.save(fileName);
  } catch (err) {
    console.warn('Fallo renderizado canvas, generando PDF vectorial de respaldo:', err);
    if (user && assessment) {
      generateDirectVectorExecutiveReportPdf(user, assessment, smtpConfig, fileName);
    } else {
      throw err;
    }
  }
}

/**
 * Generador alternativo directo y 100% vectorial con jsPDF
 */
export function generateDirectVectorExecutiveReportPdf(
  user: UserProfile,
  assessment: FullAssessmentRecord,
  smtpConfig?: SmtpConfiguration,
  fileName: string = `Informe_Psicometrico_${user.firstName}_${user.lastName}.pdf`
): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = 16;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(10, 10, 190, 36, 'F');

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('PSICOEVAL COLOMBIA · EVALUACIÓN PSICOMÉTRICA INTEGRAL', 16, 18);

  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Informe Ejecutivo de Evaluación Psicométrica y Vocacional', 16, 26);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Evaluado: ${user.firstName} ${user.lastName} | Edad: ${assessment.ageAtEvaluation} años | Estrato: ${user.socioeconomicStratum} (DANE) | Fecha: ${assessment.completedAt.slice(0, 10)}`,
    16,
    34
  );

  doc.setFontSize(8);
  doc.setTextColor(110, 231, 183); // emerald-300
  doc.text('✓ Autorizado bajo Ley Estatutaria 1581 de 2012 y Dec. 1377 de 2013 (Habeas Data Colombia)', 16, 40);

  y = 52;

  // Resumen Ejecutivo
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(10, y, 190, 28, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.setFont('helvetica', 'bold');
  doc.text('Síntesis Motivadora y Perfil Integral', 14, y + 6);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const motivationLines = doc.splitTextToSize(assessment.recommendations.executiveMotivation, 182);
  doc.text(motivationLines, 14, y + 12);

  y += 34;

  // 1. CI Wechsler
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.rect(10, y, 92, 42, 'FD');
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216); // blue-700
  doc.text(`1. CI Wechsler: ${assessment.ci.totalIQ} pts (Percentil ${assessment.ci.percentile})`, 14, y + 6);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Clasificación: ${assessment.ci.classification}`, 14, y + 11);
  doc.text(`• Comprensión Verbal (ICV): ${assessment.ci.subscales.verbalComprehension}%`, 14, y + 17);
  doc.text(`• Razonamiento Fluido (IRF): ${assessment.ci.subscales.fluidReasoning}%`, 14, y + 22);
  doc.text(`• Visoespacial (IVE): ${assessment.ci.subscales.visuospatial}%`, 14, y + 27);
  doc.text(`• Memoria de Trabajo (IMT): ${assessment.ci.subscales.workingMemory}%`, 14, y + 32);
  doc.text(`• Velocidad Procesamiento (IVP): ${assessment.ci.subscales.processingSpeed}%`, 14, y + 37);

  // 2. Personalidad Big Five
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.rect(108, y, 92, 42, 'FD');
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text(`2. Personalidad Big Five (OCEAN)`, 112, y + 6);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Dominante: ${assessment.personality.dominantTrait.split('(')[0]}`, 112, y + 11);
  doc.text(`• Apertura (O): ${assessment.personality.openness}%`, 112, y + 17);
  doc.text(`• Conciencia / Responsabilidad (C): ${assessment.personality.conscientiousness}%`, 112, y + 22);
  doc.text(`• Extraversión (E): ${assessment.personality.extraversion}%`, 112, y + 27);
  doc.text(`• Amabilidad (A): ${assessment.personality.agreeableness}%`, 112, y + 32);
  doc.text(`• Estabilidad Emocional (N): ${assessment.personality.emotionalStability}%`, 112, y + 37);

  y += 48;

  // 3. Estilo de Aprendizaje
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.rect(10, y, 92, 42, 'FD');
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text(`3. Estilo de Aprendizaje (Kolb/VARK)`, 14, y + 6);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Kolb: ${assessment.learning.kolb.style} | VARK: ${assessment.learning.vark.dominantModality}`, 14, y + 11);
  doc.text(`• VARK: V:${assessment.learning.vark.visual}% | A:${assessment.learning.vark.auditory}% | R:${assessment.learning.vark.readWrite}% | K:${assessment.learning.vark.kinesthetic}%`, 14, y + 18);
  doc.text(`• Kolb CA (Concept.): ${assessment.learning.kolb.abstractConceptualization}% | EA (Exper.): ${assessment.learning.kolb.activeExperimentation}%`, 14, y + 25);
  doc.text(`• Kolb OR (Observ.): ${assessment.learning.kolb.reflectiveObservation}% | EC (Vivenc.): ${assessment.learning.kolb.concreteExperience}%`, 14, y + 32);

  // 4. Vocación CHASIDE
  doc.setFillColor(255, 247, 237);
  doc.setDrawColor(254, 215, 170);
  doc.rect(108, y, 92, 42, 'FD');
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(194, 65, 12); // orange-700
  doc.text(`4. Orientación Vocacional (CHASIDE)`, 112, y + 6);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Área Primaria: ${assessment.vocation.primaryCode} (${CHASIDE_DESCRIPTIONS[assessment.vocation.primaryCode].name})`, 112, y + 11);
  doc.text(`• C: ${assessment.vocation.areas.C}% | H: ${assessment.vocation.areas.H}% | A: ${assessment.vocation.areas.A}%`, 112, y + 18);
  doc.text(`• S: ${assessment.vocation.areas.S}% | I: ${assessment.vocation.areas.I}% | D: ${assessment.vocation.areas.D}% | E: ${assessment.vocation.areas.E}%`, 112, y + 25);
  doc.text(`Afinidad: ${CHASIDE_DESCRIPTIONS[assessment.vocation.primaryCode].summary.slice(0, 52)}...`, 112, y + 32);

  y += 48;

  // 5. Nivel Extrasensorial PES
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(233, 213, 255);
  doc.rect(10, y, 190, 24, 'FD');
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(109, 40, 217); // purple-700
  doc.text(`5. Nivel Extrasensorial (PES · Cartas Zener & Subescalas Intuitivas)`, 14, y + 6);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Aciertos Zener: ${assessment.esp.zenerHits}/10 (${assessment.esp.scorePercentage}%) vs Azar (20%) | Nivel: ${assessment.esp.classification}`,
    14,
    y + 12
  );
  doc.text(
    `Telepatía: ${assessment.esp.subscales.telepathySymbolic}% | Clarividencia: ${assessment.esp.subscales.clairvoyancePattern}% | Precognición: ${assessment.esp.subscales.precognitionIntuitive}% | Sinestesia: ${assessment.esp.subscales.synestheticSensitivity}%`,
    14,
    y + 18
  );

  y += 30;

  // Recomendaciones de Carrera
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Carreras y Áreas Universitarias Recomendadas:', 10, y);
  y += 5;

  assessment.recommendations.careers.slice(0, 3).forEach((c, idx) => {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(`${idx + 1}. ${c.title} (${c.affinityPercentage}% Afinidad)`, 12, y);
    y += 4;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Programas: ${c.suggestedAcademicPrograms.join(', ')} | Fortalezas: ${c.keyStrengthsMatched.join(', ')}`, 14, y);
    y += 4;
    const reason = doc.splitTextToSize(c.rationale, 180);
    doc.text(reason, 14, y);
    y += 8;
  });

  // Footer institucional
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `PsicoEval Colombia · Remisión Oficial: ${smtpConfig?.recipient || 'ffadullgu@yahoo.com'} · Ley 1090 de 2006 · Ley 1581 de 2012`,
    105,
    290,
    { align: 'center' }
  );

  doc.save(fileName);
}
