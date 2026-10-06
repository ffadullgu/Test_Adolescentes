import { DomainThemeConfig, PsychometricQuestion, TestDomain, ChasideAreaCode } from '../types/psychometrics';

export const DOMAIN_THEMES: Record<TestDomain, DomainThemeConfig> = {
  ci: {
    id: 'ci',
    title: 'Cociente Intelectual (CI)',
    shortTitle: 'CI · Wechsler',
    methodology: 'Escala Wechsler de Inteligencia para Adolescentes (WISC-V / WAIS-IV)',
    scientificBasis: 'Evalúa Comprensión Verbal (ICV), Visoespacial (IVE), Razonamiento Fluido (IRF), Memoria de Trabajo (IMT) y Velocidad de Procesamiento (IVP).',
    colorName: 'Azul Cobalto Cognitivo',
    primaryHex: '#1D4ED8',
    bgLightClass: 'bg-blue-50/70',
    borderClass: 'border-blue-700',
    textClass: 'text-blue-800',
    buttonClass: 'bg-blue-700 hover:bg-blue-800 text-white focus-visible:outline-blue-700',
    accentBarClass: 'bg-blue-700',
    psychRationale: 'El azul cobalto favorece la concentración sostenida, disminuye la fatiga visual y estimula la precisión analítica durante tareas de memoria operativa y lógica formal.'
  },
  personality: {
    id: 'personality',
    title: 'Personalidad (Cinco Grandes)',
    shortTitle: 'Personalidad · Big Five',
    methodology: 'Inventario de Personalidad NEO-FFI / Modelo OCEAN (Costa & McCrae)',
    scientificBasis: 'Mide cinco dimensiones estructurales: Apertura a la Experiencia, Responsabilidad (Conciencia), Extraversión, Amabilidad y Estabilidad Emocional.',
    colorName: 'Esmeralda Clínico',
    primaryHex: '#047857',
    bgLightClass: 'bg-emerald-50/70',
    borderClass: 'border-emerald-700',
    textClass: 'text-emerald-800',
    buttonClass: 'bg-emerald-700 hover:bg-emerald-800 text-white focus-visible:outline-emerald-700',
    accentBarClass: 'bg-emerald-700',
    psychRationale: 'El tono verde esmeralda induce equilibrio autonómico, apertura introspectiva y honestidad emocional, reduciendo el sesgo de deseabilidad social al responder.'
  },
  learning: {
    id: 'learning',
    title: 'Estilo de Aprendizaje',
    shortTitle: 'Aprendizaje · Kolb & VARK',
    methodology: 'Inventario de Ciclo Experiencial de David Kolb + Modalidades Sensoriales VARK (Neil Fleming)',
    scientificBasis: 'Identifica la preferencia neurosensorial (Visual, Auditivo, Lectoescritor, Kinestésico) y el cuadrante de procesamiento (Divergente, Asimilador, Convergente, Acomodador).',
    colorName: 'Ámbar Académico',
    primaryHex: '#B45309',
    bgLightClass: 'bg-amber-50/70',
    borderClass: 'border-amber-700',
    textClass: 'text-amber-800',
    buttonClass: 'bg-amber-700 hover:bg-amber-800 text-white focus-visible:outline-amber-700',
    accentBarClass: 'bg-amber-700',
    psychRationale: 'El espectro ámbar cálido activa la curiosidad epistémica, la asociación creativa y la evocación de experiencias de estudio en el aula y en proyectos prácticos.'
  },
  vocation: {
    id: 'vocation',
    title: 'Orientación Vocacional',
    shortTitle: 'Vocación · CHASIDE',
    methodology: 'Prueba Integral de Orientación Vocacional y Profesional CHASIDE (25 Reactivos Multidimensionales)',
    scientificBasis: 'Cruza Intereses e Inclinaciones con Aptitudes en 7 macro-áreas: C (Administrativa), H (Humanidades), A (Artística), S (Salud), I (Ingenierías), D (Defensa/Liderazgo) y E (Ciencias Exactas/Ambientales).',
    colorName: 'Terracota Vocacional',
    primaryHex: '#C2410C',
    bgLightClass: 'bg-orange-50/70',
    borderClass: 'border-orange-700',
    textClass: 'text-orange-800',
    buttonClass: 'bg-orange-700 hover:bg-orange-800 text-white focus-visible:outline-orange-700',
    accentBarClass: 'bg-orange-700',
    psychRationale: 'El color terracota-coral estimula la proyección vital hacia el futuro, la motivación de logro y la toma de decisiones orientada a metas reales.'
  },
  esp: {
    id: 'esp',
    title: 'Nivel Extrasensorial e Intuición',
    shortTitle: 'Percepción · PES',
    methodology: 'Protocolo de Percepción Extrasensorial e Intuición Perceptiva (Estudios de J.B. Rhine & Cartas Zener)',
    scientificBasis: 'Evalúa agudeza intuitiva, reconocimiento de patrones subliminales, sincronización simbólica (protocolo Zener), empatía resonante y sensibilidad sinestésica.',
    colorName: 'Violeta Amatista',
    primaryHex: '#6D28D9',
    bgLightClass: 'bg-violet-50/70',
    borderClass: 'border-violet-700',
    textClass: 'text-violet-800',
    buttonClass: 'bg-violet-700 hover:bg-violet-800 text-white focus-visible:outline-violet-700',
    accentBarClass: 'bg-violet-700',
    psychRationale: 'El violeta profundo se asocia en psicofísica con la atención periférica, la imaginación simbólica, la introspección profunda y la intuición no lineal.'
  }
};

export const CHASIDE_DESCRIPTIONS: Record<ChasideAreaCode, { name: string; summary: string; sampleCareers: string[] }> = {
  C: {
    name: 'Ciencias Administrativas, Económicas y Contables',
    summary: 'Organización estratégica, liderazgo financiero, gestión de recursos, emprendimiento y análisis económico.',
    sampleCareers: ['Administración de Empresas', 'Economía y Finanzas Internacionales', 'Ingeniería Industrial', 'Contaduría Pública y Auditoría']
  },
  H: {
    name: 'Humanidades, Ciencias Sociales, Jurídicas y Comunicación',
    summary: 'Comprensión sociocultural, argumentación crítica, justicia, psicología, docencia y comunicación estratégica.',
    sampleCareers: ['Psicología', 'Derecho y Ciencias Políticas', 'Comunicación Social y Periodismo', 'Relaciones Internacionales', 'Filosofía y Letras']
  },
  A: {
    name: 'Artes, Diseño, Arquitectura y Expresión Estética',
    summary: 'Sensibilidad espacial y visual, creatividad aplicada, innovación formal, producción audiovisual y música.',
    sampleCareers: ['Arquitectura y Urbanismo', 'Diseño Industrial e Interactivo', 'Diseño Gráfico y Multimedia', 'Artes Visuales y Escénicas', 'Cine y Televisión']
  },
  S: {
    name: 'Ciencias de la Salud, Biomédicas y Bienestar Humano',
    summary: 'Vocación de servicio clínico, investigación biomédica, promoción de la salud física y rehabilitación integral.',
    sampleCareers: ['Medicina', 'Ingeniería Biomédica', 'Enfermería Superior', 'Fisioterapia y Rehabilitación', 'Nutrición y Dietética', 'Odontología']
  },
  I: {
    name: 'Ingenierías, Computación, Robótica y Desarrollo Tecnológico',
    summary: 'Diseño de sistemas complejos, pensamiento algorítmico, inteligencia artificial, infraestructura y mecatrónica.',
    sampleCareers: ['Ingeniería de Sistemas y Computación', 'Ingeniería Mecatrónica y Robótica', 'Ciencia de Datos e IA', 'Ingeniería Civil', 'Ingeniería Electrónica']
  },
  D: {
    name: 'Defensa, Seguridad, Logística Operativa y Gestión del Riesgo',
    summary: 'Toma de decisiones bajo presión, coordinación táctica, protección civil, ciberseguridad y liderazgo de campo.',
    sampleCareers: ['Ingeniería en Ciberseguridad', 'Administración Logística y Aeronáutica', 'Ciencias Militares / Navales', 'Criminalística y Ciencias Forenses']
  },
  E: {
    name: 'Ciencias Exactas, Naturales, Ecológicas y Biotecnología',
    summary: 'Investigación científica rigurosa, conservación ambiental, física, química, matemáticas puras y genómica.',
    sampleCareers: ['Biología y Biotecnología', 'Ingeniería Ambiental y Sostenibilidad', 'Física / Astrofísica', 'Química Farmacéutica', 'Matemáticas Aplicadas']
  }
};

// ============================================================================
// 1. PRUEBA DE CI (COCIENTE INTELECTUAL - ESCALA WECHSLER) — 25 PREGUNTAS
// ============================================================================
export const CI_QUESTIONS: PsychometricQuestion[] = [
  // Subescala 1: Comprensión Verbal (ICV) - Preguntas 1 a 5
  {
    id: 'ci-1',
    domain: 'ci',
    number: 1,
    subscale: 'verbalComprehension',
    subscaleLabel: 'Comprensión Verbal (ICV · Semejanzas)',
    prompt: '¿En qué se parecen fundamentalmente una "Brújula" y un "Faro"?',
    options: [
      { id: 'a', text: 'Ambos son instrumentos que funcionan exclusivamente con electricidad.', scoreValue: 0 },
      { id: 'b', text: 'Ambos son sistemas de referencia que orientan y guían la navegación hacia un rumbo seguro.', scoreValue: 1 },
      { id: 'c', text: 'Ambos se encuentran únicamente dentro de las embarcaciones marítimas.', scoreValue: 0 },
      { id: 'd', text: 'Ambos miden la velocidad del viento en alta mar.', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-2',
    domain: 'ci',
    number: 2,
    subscale: 'verbalComprehension',
    subscaleLabel: 'Comprensión Verbal (ICV · Analogías)',
    prompt: 'Complete la analogía conceptual: "Hipótesis" es a "Teoría Científica" como "Boceto" es a:',
    options: [
      { id: 'a', text: 'Pincel', scoreValue: 0 },
      { id: 'b', text: 'Obra Arquitectónica o Artística Consolidada', scoreValue: 1 },
      { id: 'c', text: 'Galería de exposición', scoreValue: 0 },
      { id: 'd', text: 'Borrador descartado', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-3',
    domain: 'ci',
    number: 3,
    subscale: 'verbalComprehension',
    subscaleLabel: 'Comprensión Verbal (ICV · Vocabulario Clínico)',
    prompt: '¿Cuál de las siguientes definiciones describe con mayor precisión el concepto de "Resiliencia"?',
    options: [
      { id: 'a', text: 'La capacidad de evitar cualquier conflicto o situación difícil en la vida.', scoreValue: 0 },
      { id: 'b', text: 'La resistencia física para correr largas distancias sin descanso.', scoreValue: 0 },
      { id: 'c', text: 'La capacidad de un sistema o persona para adaptarse, recuperarse y fortalecerse tras la adversidad.', scoreValue: 1 },
      { id: 'd', text: 'La tendencia a mantener siempre la misma opinión sin importar la evidencia.', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-4',
    domain: 'ci',
    number: 4,
    subscale: 'verbalComprehension',
    subscaleLabel: 'Comprensión Verbal (ICV · Comprensión Social)',
    prompt: '¿Por qué en una sociedad democrática existen leyes de protección de datos personales para los ciudadanos?',
    options: [
      { id: 'a', text: 'Para impedir que las personas utilicen internet o redes sociales.', scoreValue: 0 },
      { id: 'b', text: 'Para salvaguardar la intimidad, autonomía y dignidad de las personas frente al uso indebido de su información.', scoreValue: 1 },
      { id: 'c', text: 'Únicamente para cobrar impuestos a las empresas de tecnología.', scoreValue: 0 },
      { id: 'd', text: 'Para que ninguna institución educativa pueda registrar calificaciones.', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-5',
    domain: 'ci',
    number: 5,
    subscale: 'verbalComprehension',
    subscaleLabel: 'Comprensión Verbal (ICV · Abstracción)',
    prompt: 'Si todas las premisas siguientes son verdaderas: "Todo metal conduce electricidad" y "El cobre es un metal", ¿qué conclusión es lógicamente necesaria?',
    options: [
      { id: 'a', text: 'Todo material que conduce electricidad es cobre.', scoreValue: 0 },
      { id: 'b', text: 'El cobre conduce electricidad.', scoreValue: 1 },
      { id: 'c', text: 'Ningún no-metal puede conducir electricidad.', scoreValue: 0 },
      { id: 'd', text: 'El cobre es el único metal conductor.', scoreValue: 0 }
    ]
  },

  // Subescala 2: Razonamiento Fluido (IRF) - Preguntas 6 a 10
  {
    id: 'ci-6',
    domain: 'ci',
    number: 6,
    subscale: 'fluidReasoning',
    subscaleLabel: 'Razonamiento Fluido (IRF · Series Numéricas)',
    prompt: 'Observe la siguiente progresión lógica: 3, 7, 15, 31, 63, ... ¿Cuál es el número que continúa la serie?',
    options: [
      { id: 'a', text: '95', scoreValue: 0 },
      { id: 'b', text: '126', scoreValue: 0 },
      { id: 'c', text: '127', scoreValue: 1 },
      { id: 'd', text: '129', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-7',
    domain: 'ci',
    number: 7,
    subscale: 'fluidReasoning',
    subscaleLabel: 'Razonamiento Fluido (IRF · Balanzas Cuantitativas)',
    prompt: 'En un sistema en equilibrio: 2 Esferas pesan lo mismo que 6 Cubos, y 3 Cubos pesan lo mismo que 9 Pirámides. ¿Cuántas Pirámides se necesitan para equilibrar exactamente 1 Esfera?',
    options: [
      { id: 'a', text: '6 Pirámides', scoreValue: 0 },
      { id: 'b', text: '9 Pirámides', scoreValue: 1 },
      { id: 'c', text: '12 Pirámides', scoreValue: 0 },
      { id: 'd', text: '3 Pirámides', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-8',
    domain: 'ci',
    number: 8,
    subscale: 'fluidReasoning',
    subscaleLabel: 'Razonamiento Fluido (IRF · Matrices Lógicas)',
    prompt: 'En una matriz de 3×3: Fila 1 tiene (Triángulo de 3 lados, Cuadrado de 4 lados, Pentágono de 5 lados). Fila 2 tiene (Cuadrado de 4 lados, Pentágono de 5 lados, Hexágono de 6 lados). Fila 3 tiene (Pentágono de 5 lados, Hexágono de 6 lados, ¿?). ¿Qué figura completa la matriz?',
    options: [
      { id: 'a', text: 'Octágono regular de 8 lados', scoreValue: 0 },
      { id: 'b', text: 'Heptágono regular de 7 lados', scoreValue: 1 },
      { id: 'c', text: 'Hexágono regular de 6 lados', scoreValue: 0 },
      { id: 'd', text: 'Triángulo equilátero de 3 lados', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-9',
    domain: 'ci',
    number: 9,
    subscale: 'fluidReasoning',
    subscaleLabel: 'Razonamiento Fluido (IRF · Deducción Relacional)',
    prompt: 'En un torneo escolar de ajedrez: Camila obtuvo más puntos que Mateo. Santiago obtuvo menos puntos que Mateo, pero más que Valentina. ¿Quién ocupó el segundo lugar en puntaje?',
    options: [
      { id: 'a', text: 'Camila', scoreValue: 0 },
      { id: 'b', text: 'Mateo', scoreValue: 1 },
      { id: 'c', text: 'Santiago', scoreValue: 0 },
      { id: 'd', text: 'Valentina', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-10',
    domain: 'ci',
    number: 10,
    subscale: 'fluidReasoning',
    subscaleLabel: 'Razonamiento Fluido (IRF · Proporciones)',
    prompt: 'Una impresora 3D de laboratorio produce 12 piezas idénticas en 18 minutos. Manteniendo la misma velocidad constante, ¿cuántas piezas producirá en 45 minutos?',
    options: [
      { id: 'a', text: '24 piezas', scoreValue: 0 },
      { id: 'b', text: '30 piezas', scoreValue: 1 },
      { id: 'c', text: '36 piezas', scoreValue: 0 },
      { id: 'd', text: '28 piezas', scoreValue: 0 }
    ]
  },

  // Subescala 3: Visoespacial (IVE) - Preguntas 11 a 15
  {
    id: 'ci-11',
    domain: 'ci',
    number: 11,
    subscale: 'visuospatial',
    subscaleLabel: 'Visoespacial (IVE · Cubos de Kohs)',
    prompt: 'Imagine un cubo sólido de madera de 3×3×3 cm pintado completamente de azul por fuera. Si se corta en 27 cubitos pequeños de 1×1×1 cm, ¿cuántos cubitos tendrán EXACTAMENTE 2 caras pintadas de azul?',
    options: [
      { id: 'a', text: '8 cubitos (los de las esquinas)', scoreValue: 0 },
      { id: 'b', text: '12 cubitos (los centrales de cada arista)', scoreValue: 1 },
      { id: 'c', text: '6 cubitos (los centrales de cada cara)', scoreValue: 0 },
      { id: 'd', text: '1 cubito (el del núcleo interior)', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-12',
    domain: 'ci',
    number: 12,
    subscale: 'visuospatial',
    subscaleLabel: 'Visoespacial (IVE · Rotación Mental)',
    prompt: 'Una flecha apunta inicialmente hacia el NORTE. Si gira 90° en sentido horario, luego 180° en sentido antihorario, y finalmente 45° en sentido horario, ¿hacia qué dirección apunta?',
    options: [
      { id: 'a', text: 'Noroeste (NO)', scoreValue: 1 },
      { id: 'b', text: 'Noreste (NE)', scoreValue: 0 },
      { id: 'c', text: 'Suroeste (SO)', scoreValue: 0 },
      { id: 'd', text: 'Este (E)', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-13',
    domain: 'ci',
    number: 13,
    subscale: 'visuospatial',
    subscaleLabel: 'Visoespacial (IVE · Plegado Espacial)',
    prompt: 'Si doblamos una hoja cuadrada de papel por la mitad dos veces (primero verticalmente y luego horizontalmente) y hacemos 1 perforación circular en el centro del cuadrado doblado, ¿cuántos agujeros veremos al desplegar completamente la hoja?',
    options: [
      { id: 'a', text: '2 agujeros', scoreValue: 0 },
      { id: 'b', text: '4 agujeros simétricos', scoreValue: 1 },
      { id: 'c', text: '1 solo agujero en el centro', scoreValue: 0 },
      { id: 'd', text: '8 agujeros', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-14',
    domain: 'ci',
    number: 14,
    subscale: 'visuospatial',
    subscaleLabel: 'Visoespacial (IVE · Puzzles Visuales)',
    prompt: '¿Qué par de figuras geométricas planas permite construir exactamente un hexágono regular al unirse por su base mayor?',
    options: [
      { id: 'a', text: 'Dos trapecios isósceles idénticos', scoreValue: 1 },
      { id: 'b', text: 'Dos cuadrados iguales', scoreValue: 0 },
      { id: 'c', text: 'Dos triángulos rectángulos', scoreValue: 0 },
      { id: 'd', text: 'Dos pentágonos regulares', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-15',
    domain: 'ci',
    number: 15,
    subscale: 'visuospatial',
    subscaleLabel: 'Visoespacial (IVE · Simetría Axial)',
    prompt: 'Si la palabra "RECONOCER" escrita en mayúsculas se refleja en un espejo situado a su derecha (reflexión horizontal), ¿cuál es la quinta letra leyendo de izquierda a derecha en la imagen reflejada?',
    options: [
      { id: 'a', text: 'La letra O', scoreValue: 0 },
      { id: 'b', text: 'La letra N', scoreValue: 1 },
      { id: 'c', text: 'La letra C', scoreValue: 0 },
      { id: 'd', text: 'La letra E', scoreValue: 0 }
    ]
  },

  // Subescala 4: Memoria de Trabajo (IMT) - Preguntas 16 a 20
  {
    id: 'ci-16',
    domain: 'ci',
    number: 16,
    subscale: 'workingMemory',
    subscaleLabel: 'Memoria de Trabajo (IMT · Dígitos en Orden Inverso)',
    prompt: 'Retenga mentalmente la siguiente secuencia numérica: [ 4 - 9 - 2 - 7 - 5 - 8 ]. ¿Cuál es la secuencia exacta escrita en ORDEN INVERSO?',
    options: [
      { id: 'a', text: '8 - 5 - 7 - 2 - 9 - 4', scoreValue: 1 },
      { id: 'b', text: '8 - 7 - 5 - 2 - 9 - 4', scoreValue: 0 },
      { id: 'c', text: '4 - 9 - 2 - 7 - 5 - 8', scoreValue: 0 },
      { id: 'd', text: '8 - 5 - 2 - 7 - 9 - 4', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-17',
    domain: 'ci',
    number: 17,
    subscale: 'workingMemory',
    subscaleLabel: 'Memoria de Trabajo (IMT · Letras y Números)',
    prompt: 'Ordene mentalmente el siguiente conjunto mixto [ K - 7 - B - 2 - M - 4 ] colocando primero los números de menor a mayor y luego las letras en orden alfabético:',
    options: [
      { id: 'a', text: '2 - 4 - 7 - B - K - M', scoreValue: 1 },
      { id: 'b', text: 'B - K - M - 2 - 4 - 7', scoreValue: 0 },
      { id: 'c', text: '2 - 4 - 7 - K - B - M', scoreValue: 0 },
      { id: 'd', text: '7 - 4 - 2 - M - K - B', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-18',
    domain: 'ci',
    number: 18,
    subscale: 'workingMemory',
    subscaleLabel: 'Memoria de Trabajo (IMT · Aritmética Operativa)',
    prompt: 'Un estudiante tiene $45.000 COP. Compra tres cuadernos de $8.500 COP cada uno y luego recibe un reembolso de $5.500 COP. ¿Cuánto dinero tiene al final sin usar calculadora?',
    options: [
      { id: 'a', text: '$25.000 COP', scoreValue: 1 },
      { id: 'b', text: '$19.500 COP', scoreValue: 0 },
      { id: 'c', text: '$24.000 COP', scoreValue: 0 },
      { id: 'd', text: '$26.500 COP', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-19',
    domain: 'ci',
    number: 19,
    subscale: 'workingMemory',
    subscaleLabel: 'Memoria de Trabajo (IMT · Secuencia Alfanumérica)',
    prompt: 'Aplique la regla mental: "A cada número súmele 2 y a cada letra aváncela 1 posición en el alfabeto" para la clave [ 3 - C - 6 - F ]. ¿Cuál es el resultado?',
    options: [
      { id: 'a', text: '5 - D - 8 - G', scoreValue: 1 },
      { id: 'b', text: '5 - B - 8 - E', scoreValue: 0 },
      { id: 'c', text: '6 - D - 9 - G', scoreValue: 0 },
      { id: 'd', text: '5 - D - 7 - G', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-20',
    domain: 'ci',
    number: 20,
    subscale: 'workingMemory',
    subscaleLabel: 'Memoria de Trabajo (IMT · Retención Secuencial)',
    prompt: 'En la lista de palabras: [ Río, Montaña, Bosque, Nube, Volcán, Océano ], si ordenamos las palabras alfabéticamente en la mente, ¿cuál queda en el TERCER lugar?',
    options: [
      { id: 'a', text: 'Montaña', scoreValue: 0 },
      { id: 'b', text: 'Nube', scoreValue: 1 },
      { id: 'c', text: 'Océano', scoreValue: 0 },
      { id: 'd', text: 'Bosque', scoreValue: 0 }
    ]
  },

  // Subescala 5: Velocidad de Procesamiento (IVP) - Preguntas 21 a 25
  {
    id: 'ci-21',
    domain: 'ci',
    number: 21,
    subscale: 'processingSpeed',
    subscaleLabel: 'Velocidad de Procesamiento (IVP · Claves de Símbolos)',
    prompt: 'Si el código es: [ Δ = 2 ], [ Ω = 5 ], [ Ψ = 9 ], [ Φ = 4 ], ¿cuál es la suma rápida de la secuencia [ Ψ + Δ + Ω - Φ ]?',
    options: [
      { id: 'a', text: '12', scoreValue: 1 },
      { id: 'b', text: '14', scoreValue: 0 },
      { id: 'c', text: '11', scoreValue: 0 },
      { id: 'd', text: '16', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-22',
    domain: 'ci',
    number: 22,
    subscale: 'processingSpeed',
    subscaleLabel: 'Velocidad de Procesamiento (IVP · Búsqueda de Símbolos)',
    prompt: 'Identifique con rapidez cuántas veces aparece el par exacto "7B" en la siguiente cadena: [ 7A - 7B - B7 - 7B - 78 - 7B - 7D - 7B ]:',
    options: [
      { id: 'a', text: '3 veces', scoreValue: 0 },
      { id: 'b', text: '4 veces', scoreValue: 1 },
      { id: 'c', text: '5 veces', scoreValue: 0 },
      { id: 'd', text: '2 veces', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-23',
    domain: 'ci',
    number: 23,
    subscale: 'processingSpeed',
    subscaleLabel: 'Velocidad de Procesamiento (IVP · Cancelación Perceptiva)',
    prompt: '¿Cuál de las siguientes cuatro cadenas alfanuméricas es IDÉNTICA al modelo de referencia [ MX-904-Q7Z ]?',
    options: [
      { id: 'a', text: 'MX-940-Q7Z', scoreValue: 0 },
      { id: 'b', text: 'MX-904-O7Z', scoreValue: 0 },
      { id: 'c', text: 'MX-904-Q7Z', scoreValue: 1 },
      { id: 'd', text: 'XN-904-Q7Z', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-24',
    domain: 'ci',
    number: 24,
    subscale: 'processingSpeed',
    subscaleLabel: 'Velocidad de Procesamiento (IVP · Codificación Rápida)',
    prompt: 'Dado el diccionario numérico: A=1, E=2, I=3, O=4, U=5, ¿qué secuencia representa las vocales de la palabra "MURCIÉLAGO" en orden de aparición?',
    options: [
      { id: 'a', text: '5 - 3 - 2 - 1 - 4', scoreValue: 1 },
      { id: 'b', text: '5 - 2 - 3 - 1 - 4', scoreValue: 0 },
      { id: 'c', text: '1 - 2 - 3 - 4 - 5', scoreValue: 0 },
      { id: 'd', text: '5 - 3 - 2 - 4 - 1', scoreValue: 0 }
    ]
  },
  {
    id: 'ci-25',
    domain: 'ci',
    number: 25,
    subscale: 'processingSpeed',
    subscaleLabel: 'Velocidad de Procesamiento (IVP · Discriminación Visual)',
    prompt: 'En el conjunto [ 14, 28, 42, 54, 70, 84 ], todos los números son múltiplos de 14 EXCEPTO uno. ¿Cuál es el intruso?',
    options: [
      { id: 'a', text: '42', scoreValue: 0 },
      { id: 'b', text: '54', scoreValue: 1 },
      { id: 'c', text: '70', scoreValue: 0 },
      { id: 'd', text: '84', scoreValue: 0 }
    ]
  }
];

// Helper options for Big Five Likert Scale (1 to 5)
const LIKERT_OPTIONS = [
  { id: '1', text: '1 · Totalmente en desacuerdo', scoreValue: 1 },
  { id: '2', text: '2 · En desacuerdo', scoreValue: 2 },
  { id: '3', text: '3 · Neutral / A veces', scoreValue: 3 },
  { id: '4', text: '4 · De acuerdo', scoreValue: 4 },
  { id: '5', text: '5 · Totalmente de acuerdo', scoreValue: 5 }
];

// ============================================================================
// 2. PRUEBA DE PERSONALIDAD (BIG FIVE / OCEAN) — 25 PREGUNTAS
// ============================================================================
export const PERSONALITY_QUESTIONS: PsychometricQuestion[] = [
  // Dimensión 1: Apertura a la Experiencia (Openness) - Preguntas 1 a 5
  {
    id: 'bf-1',
    domain: 'personality',
    number: 1,
    subscale: 'openness',
    subscaleLabel: 'Apertura a la Experiencia (O · Curiosidad Intelectual)',
    prompt: 'Disfruto explorando ideas científicas, filosóficas o artísticas nuevas, incluso cuando parecen abstractas o poco convencionales.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-2',
    domain: 'personality',
    number: 2,
    subscale: 'openness',
    subscaleLabel: 'Apertura a la Experiencia (O · Imaginación Creativa)',
    prompt: 'Con frecuencia propongo soluciones originales o diferentes cuando mi grupo de estudio se enfrenta a un problema difícil.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-3',
    domain: 'personality',
    number: 3,
    subscale: 'openness',
    subscaleLabel: 'Apertura a la Experiencia (O · Sensibilidad Estética)',
    prompt: 'La música, el diseño, la literatura o las expresiones culturales despiertan en mí una profunda fascinación y reflexión.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-4',
    domain: 'personality',
    number: 4,
    subscale: 'openness',
    subscaleLabel: 'Apertura a la Experiencia (O · Flexibilidad Cognitiva)',
    prompt: 'Me entusiasma aprender sobre culturas distintas, nuevos lenguajes de programación o disciplinas que aún no domino.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-5',
    domain: 'personality',
    number: 5,
    subscale: 'openness',
    subscaleLabel: 'Apertura a la Experiencia (O · Pensamiento Divergente)',
    prompt: 'Prefiero los proyectos donde puedo diseñar mi propio enfoque antes que limitarme a repetir una receta paso a paso.',
    options: LIKERT_OPTIONS
  },

  // Dimensión 2: Responsabilidad / Conciencia (Conscientiousness) - Preguntas 6 a 10
  {
    id: 'bf-6',
    domain: 'personality',
    number: 6,
    subscale: 'conscientiousness',
    subscaleLabel: 'Responsabilidad y Conciencia (C · Organización)',
    prompt: 'Planifico mis horarios de estudio y entregas académicas con anticipación para evitar dejar todo para el último momento.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-7',
    domain: 'personality',
    number: 7,
    subscale: 'conscientiousness',
    subscaleLabel: 'Responsabilidad y Conciencia (C · Perseverancia)',
    prompt: 'Cuando me propongo una meta personal o académica exigente, mantengo la disciplina hasta terminarla por completo.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-8',
    domain: 'personality',
    number: 8,
    subscale: 'conscientiousness',
    subscaleLabel: 'Responsabilidad y Conciencia (C · Rigor y Detalle)',
    prompt: 'Reviso cuidadosamente mis trabajos, cálculos o ensayos antes de entregarlos para asegurarme de que tengan alta calidad.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-9',
    domain: 'personality',
    number: 9,
    subscale: 'conscientiousness',
    subscaleLabel: 'Responsabilidad y Conciencia (C · Autodisciplina)',
    prompt: 'Mantengo mis materiales, apuntes digitales y espacio de estudio ordenados y estructurados.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-10',
    domain: 'personality',
    number: 10,
    subscale: 'conscientiousness',
    subscaleLabel: 'Responsabilidad y Conciencia (C · Sentido del Deber)',
    prompt: 'Mis compañeros y profesores saben que pueden confiar plenamente en que cumpliré con mi parte de cualquier compromiso.',
    options: LIKERT_OPTIONS
  },

  // Dimensión 3: Extraversión (Extraversion) - Preguntas 11 a 15
  {
    id: 'bf-11',
    domain: 'personality',
    number: 11,
    subscale: 'extraversion',
    subscaleLabel: 'Extraversión (E · Sociabilidad)',
    prompt: 'Me siento con mucha energía cuando participo en debates grupales, actividades colectivas o trabajo en equipo.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-12',
    domain: 'personality',
    number: 12,
    subscale: 'extraversion',
    subscaleLabel: 'Extraversión (E · Asertividad y Liderazgo)',
    prompt: 'Me resulta natural tomar la iniciativa para coordinar a mis compañeros o exponer una idea frente a toda la clase.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-13',
    domain: 'personality',
    number: 13,
    subscale: 'extraversion',
    subscaleLabel: 'Extraversión (E · Entusiasmo Interpersonal)',
    prompt: 'Inicio conversaciones con facilidad cuando llego a un nuevo club, curso o entorno desconocido.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-14',
    domain: 'personality',
    number: 14,
    subscale: 'extraversion',
    subscaleLabel: 'Extraversión (E · Dinamismo)',
    prompt: 'Disfruto los entornos dinámicos y activos donde suceden varias actividades e intercambios sociales al mismo tiempo.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-15',
    domain: 'personality',
    number: 15,
    subscale: 'extraversion',
    subscaleLabel: 'Extraversión (E · Expresividad)',
    prompt: 'Comunico mis ideas, proyectos y entusiasmo de manera abierta y expresiva ante los demás.',
    options: LIKERT_OPTIONS
  },

  // Dimensión 4: Amabilidad / Cordialidad (Agreeableness) - Preguntas 16 a 20
  {
    id: 'bf-16',
    domain: 'personality',
    number: 16,
    subscale: 'agreeableness',
    subscaleLabel: 'Amabilidad y Empatía (A · Empatía Cognitiva)',
    prompt: 'Me esforço sinceramente por comprender el punto de vista y los sentimientos de mis compañeros cuando tienen un problema.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-17',
    domain: 'personality',
    number: 17,
    subscale: 'agreeableness',
    subscaleLabel: 'Amabilidad y Empatía (A · Cooperación)',
    prompt: 'Prefiero construir acuerdos colaborativos y mediar en los desacuerdos antes que imponer mi opinión por la fuerza.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-18',
    domain: 'personality',
    number: 18,
    subscale: 'agreeableness',
    subscaleLabel: 'Amabilidad y Empatía (A · Altruismo)',
    prompt: 'Siento satisfacción genuina cuando explico un tema difícil a un compañero que necesita ayuda académica o personal.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-19',
    domain: 'personality',
    number: 19,
    subscale: 'agreeableness',
    subscaleLabel: 'Amabilidad y Empatía (A · Confianza y Respeto)',
    prompt: 'Trato a todas las personas con respeto y consideración, valorando la diversidad de orígenes y opiniones.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-20',
    domain: 'personality',
    number: 20,
    subscale: 'agreeableness',
    subscaleLabel: 'Amabilidad y Empatía (A · Sensibilidad Social)',
    prompt: 'Me importan las causas comunitarias, el bienestar colectivo y el impacto ético de mis decisiones sobre los demás.',
    options: LIKERT_OPTIONS
  },

  // Dimensión 5: Estabilidad Emocional (Emotional Stability / Inverso de Neuroticismo) - Preguntas 21 a 25
  {
    id: 'bf-21',
    domain: 'personality',
    number: 21,
    subscale: 'emotionalStability',
    subscaleLabel: 'Estabilidad Emocional (N · Regulación bajo Presión)',
    prompt: 'Durante exámenes importantes o situaciones de alta exigencia, logro conservar la calma y pensar con claridad.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-22',
    domain: 'personality',
    number: 22,
    subscale: 'emotionalStability',
    subscaleLabel: 'Estabilidad Emocional (N · Tolerancia a la Frustración)',
    prompt: 'Cuando cometo un error o recibo una crítica constructiva, lo asumo como una oportunidad de aprendizaje sin desmoronarme.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-23',
    domain: 'personality',
    number: 23,
    subscale: 'emotionalStability',
    subscaleLabel: 'Estabilidad Emocional (N · Equilibrio Afectivo)',
    prompt: 'Recupero mi tranquilidad emocional con rapidez después de un día estresante o un cambio inesperado de planes.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-24',
    domain: 'personality',
    number: 24,
    subscale: 'emotionalStability',
    subscaleLabel: 'Estabilidad Emocional (N · Autoconfianza)',
    prompt: 'Confío en mis capacidades para afrontar los retos académicos y personales del futuro sin sentir ansiedad paralizante.',
    options: LIKERT_OPTIONS
  },
  {
    id: 'bf-25',
    domain: 'personality',
    number: 25,
    subscale: 'emotionalStability',
    subscaleLabel: 'Estabilidad Emocional (N · Serenidad Reflexiva)',
    prompt: 'Antes de reaccionar impulsivamente ante una situación tensa, respiro y analizo las consecuencias con serenidad.',
    options: LIKERT_OPTIONS
  }
];

// ============================================================================
// 3. PRUEBA DE ESTILO DE APRENDIZAJE (MODELOS KOLB Y VARK) — 25 PREGUNTAS
// ============================================================================
export const LEARNING_QUESTIONS: PsychometricQuestion[] = [
  // Bloque VARK (Preguntas 1 a 16: cada opción corresponde a V, A, R o K)
  {
    id: 'lrn-1',
    domain: 'learning',
    number: 1,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Comprensión de Nuevos Conceptos',
    prompt: 'Cuando un profesor explica un tema científico complejo por primera vez, lo comprendo mucho mejor si:',
    options: [
      { id: 'V', text: 'Muestra diagramas de flujo, mapas conceptuales, infografías y esquemas con colores.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Lo explica verbalmente con ejemplos narrados y abre un espacio de diálogo y preguntas.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Entrega una guía escrita bien estructurada, definiciones precisas y artículos para leer.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Realizamos un experimento de laboratorio, una simulación práctica o un prototipo físico.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-2',
    domain: 'learning',
    number: 2,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Preparación de Exámenes',
    prompt: 'Al prepararme para una evaluación importante en el colegio, mi estrategia más efectiva consiste en:',
    options: [
      { id: 'V', text: 'Dibujar mapas mentales, subrayar con código de colores y visualizar esquemas espaciales.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Explicarle el tema en voz alta a otra persona o escuchar grabaciones y podcasts educativos.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Redactar resúmenes detallados, listas numeradas y fichas bibliográficas de síntesis.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Resolver casos reales, practicar con ejercicios aplicados y asociar conceptos con movimientos.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-3',
    domain: 'learning',
    number: 3,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Orientación Espacial',
    prompt: 'Si necesito llegar a un lugar nuevo dentro de una ciudad o campus universitario desconocido, prefiero:',
    options: [
      { id: 'V', text: 'Mirar el mapa gráfico completo con puntos de referencia visuales.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Pedir que alguien me dé las indicaciones habladas o escuchar el asistente de voz.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Leer una lista escrita paso a paso con nombres de calles, números y coordenadas.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Empezar a caminar guiándome por el recorrido físico y la experiencia directa del entorno.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-4',
    domain: 'learning',
    number: 4,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Aprendizaje Tecnológico',
    prompt: 'Cuando quiero aprender a utilizar un nuevo programa de computador o dispositivo electrónico:',
    options: [
      { id: 'V', text: 'Observo capturas de pantalla, diagramas de la interfaz y videos demostrativos.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Converso con un amigo experto para que me cuente cómo funciona.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Leo el manual de documentación técnica o las instrucciones en texto.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Empiezo a probar directamente los botones y funciones mediante ensayo y error.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-5',
    domain: 'learning',
    number: 5,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Presentaciones Académicas',
    prompt: 'Cuando debo presentar un proyecto ante mi curso, me siento más cómodo diseñando:',
    options: [
      { id: 'V', text: 'Una presentación visualmente impactante con gráficos estadísticos, fotografías y diagramas.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Una exposición oral elocuente tipo charla TED o panel de debate en vivo.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Un informe ejecutivo impreso o ensayo estructurado con citas y datos rigurosos.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Una maqueta funcional, demostración en vivo o dinámica donde el público participe.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-6',
    domain: 'learning',
    number: 6,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Evocación de Memoria',
    prompt: 'Después de asistir a una conferencia o clase magistral, lo que recuerdo con mayor nitidez días después es:',
    options: [
      { id: 'V', text: 'Las imágenes proyectadas, la disposición del salón y los gráficos de la pizarra.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'El tono de voz del conferencista, las frases clave y las preguntas del público.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Los apuntes textuales que tomé en mi cuaderno y las palabras exactas de las diapositivas.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Las actividades prácticas que hicimos y lo que sentí al participar en la sesión.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-7',
    domain: 'learning',
    number: 7,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Resolución de Problemas Matemáticos',
    prompt: 'Frente a un reto de geometría o física aplicada, mi primer impulso para resolverlo es:',
    options: [
      { id: 'V', text: 'Trazar un dibujo a escala o representar los vectores gráficamente.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Razonar el problema en voz alta o discutir la lógica con un compañero.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Escribir las fórmulas, despejar las ecuaciones paso a paso y anotar cada variable.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Usar objetos físicos de mi escritorio para simular el movimiento o las proporciones.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-8',
    domain: 'learning',
    number: 8,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Selección de Recursos Web',
    prompt: 'Cuando investigo un tema por mi cuenta en internet, prefiero las páginas web que contienen:',
    options: [
      { id: 'V', text: 'Infografías interactivas, líneas de tiempo visuales y diseño limpio.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Entrevistas en audio, canales de debate y explicaciones habladas.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Artículos enciclopédicos bien redactados, ensayos y documentos descargables.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Simuladores interactivos donde puedo mover controles y ver qué sucede en tiempo real.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-9',
    domain: 'learning',
    number: 9,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Expresión Artística y Cultural',
    prompt: 'Si visito un museo de ciencia e historia, la sección que más capta mi atención es:',
    options: [
      { id: 'V', text: 'Las galerías fotográficas, proyecciones inmersivas y murales cronológicos.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'El recorrido con audioguía comentada o la charla del curador del museo.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Las placas explicativas detalladas, documentos históricos y catálogos escritos.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Los módulos interactivos donde se permite tocar piezas, accionar palancas y experimentar.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-10',
    domain: 'learning',
    number: 10,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Retroalimentación Académica',
    prompt: 'Cuando un docente evalúa mi trabajo, valoro mucho más la retroalimentación cuando:',
    options: [
      { id: 'V', text: 'Utiliza rúbricas visuales, gráficos de radar o marcas visuales claras sobre mi entrega.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Conversa conmigo directamente para comentarme mis fortalezas y aspectos a mejorar.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Me entrega comentarios escritos detallados y recomendaciones redactadas punto por punto.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Me muestra en la práctica con un ejemplo concreto cómo optimizar mi proyecto.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-11',
    domain: 'learning',
    number: 11,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Concentración en el Estudio',
    prompt: 'Durante una sesión intensa de estudio en casa, lo que más me ayuda a mantener el enfoque es:',
    options: [
      { id: 'V', text: 'Tener un escritorio despejado con un tablero visible de objetivos y esquemas.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Estudiar con música instrumental suave o recitando los conceptos clave.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Contar con silencio absoluto y mis libros de texto o apuntes organizados.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Hacer pausas activas, caminar mientras pienso o manipular objetos antiestrés.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-12',
    domain: 'learning',
    number: 12,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Aprendizaje de Idiomas',
    prompt: 'Al aprender un segundo idioma (como inglés o francés), progreso con mayor rapidez mediante:',
    options: [
      { id: 'V', text: 'Tarjetas visuales (flashcards con imágenes), películas subtituladas y esquemas gramaticales.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Conversación directa, escucha de canciones y repetición fonética de diálogos.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Lectura de libros, redacción de ensayos y estudio de reglas gramaticales escritas.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Juegos de rol situacionales, teatro en el idioma o inmersión práctica cotidiana.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-13',
    domain: 'learning',
    number: 13,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Toma de Decisiones',
    prompt: 'Cuando debo elegir entre varias opciones para un proyecto escolar, tomo la decisión:',
    options: [
      { id: 'V', text: 'Imaginando visualmente cómo lucirá el resultado final de cada alternativa.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Escuchando las opiniones de mis compañeros y debatiendo los pros y contras.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Haciendo un cuadro comparativo escrito con criterios y argumentos objetivos.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Construyendo una prueba rápida de cada opción para sentir cuál funciona mejor.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-14',
    domain: 'learning',
    number: 14,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Creatividad y Síntesis',
    prompt: 'Para explicar una historia o proceso histórico complejo, prefiero:',
    options: [
      { id: 'V', text: 'Crear una historieta gráfica, línea de tiempo ilustrada o mapa geopolítico.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Relatar la historia como un narrador o grabar un episodio de podcast.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Escribir una crónica periodística o ensayo analítico profundo.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Representar los hechos mediante una dramatización o reconstrucción a escala.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-15',
    domain: 'learning',
    number: 15,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK ·Ensamblaje y Construcción',
    prompt: 'Si debo armar un kit de robótica o un mueble modular en casa:',
    options: [
      { id: 'V', text: 'Me guío exclusivamente por los diagramas explosivos e ilustraciones del plano.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Pido que alguien me vaya leyendo o comentando los pasos mientras conversamos.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Leo cuidadosamente el instructivo numerado de principio a fin antes de tocar las piezas.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Tomo las piezas con las manos y voy encajando los componentes de forma intuitiva.', scoreValue: 1, subDimension: 'K' }
    ]
  },
  {
    id: 'lrn-16',
    domain: 'learning',
    number: 16,
    subscale: 'vark',
    subscaleLabel: 'Modalidad Sensorial VARK · Preferencia de Evaluación',
    prompt: 'Si pudiera elegir el formato de evaluación final de mi materia favorita, escogería:',
    options: [
      { id: 'V', text: 'Análisis de diagramas, diseño de un póster científico o portafolio visual.', scoreValue: 1, subDimension: 'V' },
      { id: 'A', text: 'Sustentación oral frente a jurado o coloquio argumentativo.', scoreValue: 1, subDimension: 'A' },
      { id: 'R', text: 'Examen de desarrollo escrito, ensayo crítico o monografía investigativa.', scoreValue: 1, subDimension: 'R' },
      { id: 'K', text: 'Proyecto de laboratorio aplicado, trabajo de campo o prototipo funcional.', scoreValue: 1, subDimension: 'K' }
    ]
  },

  // Bloque Ciclo Experiencial de Kolb (Preguntas 17 a 25: EC, OR, CA, EA)
  {
    id: 'lrn-17',
    domain: 'learning',
    number: 17,
    subscale: 'kolb',
    subscaleLabel: 'Ciclo de Kolb · Fase de Captación de la Experiencia',
    prompt: 'Cuando me enfrento a un desafío totalmente nuevo en mi formación, mi punto de partida natural es:',
    options: [
      { id: 'EC', text: 'Involucrarme personalmente en la experiencia concreta y conectar con las personas implicadas (EC).', scoreValue: 1, subDimension: 'EC' },
      { id: 'OR', text: 'Observar detenidamente desde múltiples perspectivas antes de emitir un juicio (OR).', scoreValue: 1, subDimension: 'OR' },
      { id: 'CA', text: 'Analizar lógicamente la situación para construir una teoría o modelo conceptual (CA).', scoreValue: 1, subDimension: 'CA' },
      { id: 'EA', text: 'Poner manos a la obra de inmediato para comprobar qué funciona en la práctica (EA).', scoreValue: 1, subDimension: 'EA' }
    ]
  },
  {
    id: 'lrn-18',
    domain: 'learning',
    number: 18,
    subscale: 'kolb',
    subscaleLabel: 'Ciclo de Kolb · Procesamiento Cognitivo',
    prompt: 'En un trabajo en equipo del colegio, el rol donde aporto mayor valor suele ser:',
    options: [
      { id: 'EC', text: 'Aportar sensibilidad humana, empatía e ideas conectadas con la vida real (EC).', scoreValue: 1, subDimension: 'EC' },
      { id: 'OR', text: 'Escuchar todas las posturas, reflexionar con cautela y detectar detalles que otros pasan por alto (OR).', scoreValue: 1, subDimension: 'OR' },
      { id: 'CA', text: 'Estructurar el marco teórico, sintetizar la lógica y garantizar la precisión conceptual (CA).', scoreValue: 1, subDimension: 'CA' },
      { id: 'EA', text: 'Ejecutar el plan de acción, resolver imprevistos técnicos y asegurar resultados tangibles (EA).', scoreValue: 1, subDimension: 'EA' }
    ]
  },
  {
    id: 'lrn-19',
    domain: 'learning',
    number: 19,
    subscale: 'kolb',
    subscaleLabel: 'Ciclo de Kolb · Resolución de Dilemas',
    prompt: 'Para que un aprendizaje tenga verdadero sentido para mí, necesito principalmente:',
    options: [
      { id: 'EC', text: 'Sentir cómo se relaciona el tema con mi experiencia vivencial y mis valores (EC).', scoreValue: 1, subDimension: 'EC' },
      { id: 'OR', text: 'Comprender el "porqué" profundo mediante la observación y el análisis pausado (OR).', scoreValue: 1, subDimension: 'OR' },
      { id: 'CA', text: 'Entender la estructura sistemática, las leyes universales y la coherencia racional (CA).', scoreValue: 1, subDimension: 'CA' },
      { id: 'EA', text: 'Aplicar el conocimiento para transformar algo real o resolver un problema concreto (EA).', scoreValue: 1, subDimension: 'EA' }
    ]
  },
  {
    id: 'lrn-20',
    domain: 'learning',
    number: 20,
    subscale: 'kolb',
    subscaleLabel: 'Ciclo de Kolb · Entorno de Aula Ideal',
    prompt: 'Disfruto más las clases donde el docente promueve:',
    options: [
      { id: 'EC', text: 'Lluvias de ideas abiertas, estudios de caso reales y conexión emocional con el tema (EC).', scoreValue: 1, subDimension: 'EC' },
      { id: 'OR', text: 'Espacios de reflexión crítica, lectura analítica y observación guiada (OR).', scoreValue: 1, subDimension: 'OR' },
      { id: 'CA', text: 'Demostraciones formales, modelos matemáticos/científicos y rigor intelectual (CA).', scoreValue: 1, subDimension: 'CA' },
      { id: 'EA', text: 'Retos tipo hackathon, laboratorios aplicados y proyectos con impacto directo (EA).', scoreValue: 1, subDimension: 'EA' }
    ]
  },
  {
    id: 'lrn-21',
    domain: 'learning',
    number: 21,
    subscale: 'kolb',
    subscaleLabel: 'Ciclo de Kolb · Adaptación al Cambio',
    prompt: 'Cuando un experimento o proyecto no sale como se esperaba en el primer intento:',
    options: [
      { id: 'EC', text: 'Confío en mi intuición y busco nuevas vivencias o perspectivas con mis compañeros (EC).', scoreValue: 1, subDimension: 'EC' },
      { id: 'OR', text: 'Reviso pacientemente qué ocurrió en cada etapa antes de volver a intentarlo (OR).', scoreValue: 1, subDimension: 'OR' },
      { id: 'CA', text: 'Reviso la hipótesis teórica y recalculo las variables del modelo lógico (CA).', scoreValue: 1, subDimension: 'CA' },
      { id: 'EA', text: 'Modifico inmediatamente el prototipo y pruebo una solución alternativa en el acto (EA).', scoreValue: 1, subDimension: 'EA' }
    ]
  },
  {
    id: 'lrn-22',
    domain: 'learning',
    number: 22,
    subscale: 'kolb',
    subscaleLabel: 'Ciclo de Kolb · Estilo de Pensamiento',
    prompt: 'Me identifico más como un estudiante que destaca por ser:',
    options: [
      { id: 'EC', text: 'Empático, receptivo, imaginativo y conectado con la realidad humana (EC).', scoreValue: 1, subDimension: 'EC' },
      { id: 'OR', text: 'Observador, analítico, prudente y profundo en sus reflexiones (OR).', scoreValue: 1, subDimension: 'OR' },
      { id: 'CA', text: 'Lógico, sistemático, estructurado y orientado a la precisión teórica (CA).', scoreValue: 1, subDimension: 'CA' },
      { id: 'EA', text: 'Práctico, decidido, emprendedor y orientado a la acción directa (EA).', scoreValue: 1, subDimension: 'EA' }
    ]
  },
  {
    id: 'lrn-23',
    domain: 'learning',
    number: 23,
    subscale: 'kolb',
    subscaleLabel: 'Ciclo de Kolb · Investigación Escolar',
    prompt: 'Al iniciar una investigación escolar de seis meses, dedico mis mayores esfuerzos a:',
    options: [
      { id: 'EC', text: 'Entrevistar personas, conocer testimonios reales y explorar el contexto social (EC).', scoreValue: 1, subDimension: 'EC' },
      { id: 'OR', text: 'Recopilar múltiples fuentes y comparar puntos de vista con detenimiento (OR).', scoreValue: 1, subDimension: 'OR' },
      { id: 'CA', text: 'Formular un modelo explicativo coherente y respaldado por datos abstractos (CA).', scoreValue: 1, subDimension: 'CA' },
      { id: 'EA', text: 'Construir una herramienta funcional o intervención que solucione el problema (EA).', scoreValue: 1, subDimension: 'EA' }
    ]
  },
  {
    id: 'lrn-24',
    domain: 'learning',
    number: 24,
    subscale: 'kolb',
    subscaleLabel: 'Ciclo de Kolb · Toma de Apuntes y Síntesis',
    prompt: 'Al sintetizar lo aprendido al final de un trimestre académico, prefiero:',
    options: [
      { id: 'EC', text: 'Relacionar cada aprendizaje con anécdotas, casos vivos y ejemplos cotidianos (EC).', scoreValue: 1, subDimension: 'EC' },
      { id: 'OR', text: 'Redactar una bitácora reflexiva analizando cómo evolucionó mi comprensión (OR).', scoreValue: 1, subDimension: 'OR' },
      { id: 'CA', text: 'Elaborar un cuadro sinóptico jerárquico de principios, teoremas y conceptos (CA).', scoreValue: 1, subDimension: 'CA' },
      { id: 'EA', text: 'Desarrollar una aplicación práctica o taller demostrativo de lo aprendido (EA).', scoreValue: 1, subDimension: 'EA' }
    ]
  },
  {
    id: 'lrn-25',
    domain: 'learning',
    number: 25,
    subscale: 'kolb',
    subscaleLabel: 'Ciclo de Kolb · Integración de Saberes',
    prompt: 'Cuando trabajo en un laboratorio interdisciplinario, mi mayor satisfacción proviene de:',
    options: [
      { id: 'EC', text: 'Descubrir nuevas posibilidades creativas compartiendo con mi equipo (EC).', scoreValue: 1, subDimension: 'EC' },
      { id: 'OR', text: 'Comprender a fondo por qué ocurre un fenómeno antes de intervenir (OR).', scoreValue: 1, subDimension: 'OR' },
      { id: 'CA', text: 'Dominar la teoría científica que explica con exactitud el fenómeno (CA).', scoreValue: 1, subDimension: 'CA' },
      { id: 'EA', text: 'Ver que nuestro prototipo funciona en el mundo real y genera impacto (EA).', scoreValue: 1, subDimension: 'EA' }
    ]
  }
];

// Options for CHASIDE (Afinidad: Alta = 2, Media = 1, Baja = 0)
const createChasideOptions = (areaCode: ChasideAreaCode, type: 'interest' | 'aptitude') => [
  { id: 'high', text: 'Sí, me identifica totalmente / Alta afinidad', scoreValue: 2, subDimension: `${areaCode}:${type}` },
  { id: 'med', text: 'Parcialmente / Afinidad moderada', scoreValue: 1, subDimension: `${areaCode}:${type}` },
  { id: 'low', text: 'No me identifica / Baja afinidad', scoreValue: 0, subDimension: `${areaCode}:${type}` }
];

// ============================================================================
// 4. PRUEBA DE VOCACIÓN (TEST CHASIDE) — 25 PREGUNTAS
// ============================================================================
export const VOCATION_QUESTIONS: PsychometricQuestion[] = [
  // Área C: Administrativas y Contables (Preguntas 1 a 4)
  {
    id: 'voc-1',
    domain: 'vocation',
    number: 1,
    subscale: 'C',
    subscaleLabel: 'Área C · Ciencias Administrativas y Financieras (Interés)',
    prompt: '¿Te gustaría liderar la planificación financiera, el presupuesto y la estrategia de crecimiento de una empresa o emprendimiento tecnológico?',
    options: createChasideOptions('C', 'interest')
  },
  {
    id: 'voc-2',
    domain: 'vocation',
    number: 2,
    subscale: 'C',
    subscaleLabel: 'Área C · Ciencias Administrativas y Financieras (Aptitud)',
    prompt: '¿Tienes facilidad para organizar recursos, distribuir tareas en un equipo y llevar el control numérico de ingresos y gastos sin errores?',
    options: createChasideOptions('C', 'aptitude')
  },
  {
    id: 'voc-3',
    domain: 'vocation',
    number: 3,
    subscale: 'C',
    subscaleLabel: 'Área C · Comercio Internacional y Gestión (Interés)',
    prompt: '¿Te atrae analizar cómo funcionan los mercados económicos globales, las inversiones bursátiles y el comercio internacional?',
    options: createChasideOptions('C', 'interest')
  },
  {
    id: 'voc-4',
    domain: 'vocation',
    number: 4,
    subscale: 'C',
    subscaleLabel: 'Área C · Liderazgo Organizacional (Aptitud)',
    prompt: 'Cuando tu curso organiza un evento o proyecto, ¿sueles asumir de forma natural la coordinación logística y la optimización del tiempo?',
    options: createChasideOptions('C', 'aptitude')
  },

  // Área H: Humanidades, Ciencias Sociales y Jurídicas (Preguntas 5 a 8)
  {
    id: 'voc-5',
    domain: 'vocation',
    number: 5,
    subscale: 'H',
    subscaleLabel: 'Área H · Humanidades, Psicología y Derecho (Interés)',
    prompt: '¿Te apasiona investigar el comportamiento humano, defender los derechos fundamentales y participar en debates sobre justicia social e historia?',
    options: createChasideOptions('H', 'interest')
  },
  {
    id: 'voc-6',
    domain: 'vocation',
    number: 6,
    subscale: 'H',
    subscaleLabel: 'Área H · Argumentación y Comprensión Lectora (Aptitud)',
    prompt: '¿Cuentas con habilidad para redactar ensayos persuasivos, hablar en público con fluidez y mediar en conflictos interpersonales?',
    options: createChasideOptions('H', 'aptitude')
  },
  {
    id: 'voc-7',
    domain: 'vocation',
    number: 7,
    subscale: 'H',
    subscaleLabel: 'Área H · Psicología y Orientación Humana (Interés)',
    prompt: '¿Te interesaría ejercer una profesión enfocada en la escucha clínica, el acompañamiento psicológico, la pedagogía o el periodismo investigativo?',
    options: createChasideOptions('H', 'interest')
  },
  {
    id: 'voc-8',
    domain: 'vocation',
    number: 8,
    subscale: 'H',
    subscaleLabel: 'Área H · Análisis Sociocultural (Aptitud)',
    prompt: '¿Comprendes con rapidez el contexto histórico, ético y cultural detrás de las noticias y fenómenos sociales contemporáneos?',
    options: createChasideOptions('H', 'aptitude')
  },

  // Área A: Artísticas, Diseño y Arquitectura (Preguntas 9 a 11)
  {
    id: 'voc-9',
    domain: 'vocation',
    number: 9,
    subscale: 'A',
    subscaleLabel: 'Área A · Arquitectura, Diseño y Artes (Interés)',
    prompt: '¿Disfrutas proyectar espacios arquitectónicos, crear piezas de diseño digital/industrial, componer música o producir obras audiovisuales?',
    options: createChasideOptions('A', 'interest')
  },
  {
    id: 'voc-10',
    domain: 'vocation',
    number: 10,
    subscale: 'A',
    subscaleLabel: 'Área A · Sensibilidad Estética y Visoespacial (Aptitud)',
    prompt: '¿Posees sensibilidad para la armonía del color, la proporción espacial, el dibujo técnico/artístico o la expresión creativa original?',
    options: createChasideOptions('A', 'aptitude')
  },
  {
    id: 'voc-11',
    domain: 'vocation',
    number: 11,
    subscale: 'A',
    subscaleLabel: 'Área A · Innovación Formal y Creativa (Interés)',
    prompt: '¿Te gustaría trabajar en estudios creativos donde la imaginación estética y el diseño de experiencias sean el eje diario?',
    options: createChasideOptions('A', 'interest')
  },

  // Área S: Ciencias de la Salud y Biomédicas (Preguntas 12 a 15)
  {
    id: 'voc-12',
    domain: 'vocation',
    number: 12,
    subscale: 'S',
    subscaleLabel: 'Área S · Ciencias de la Salud y Medicina (Interés)',
    prompt: '¿Te motiva comprender la fisiología del cuerpo humano, diagnosticar patologías y trabajar en clínicas, hospitales o centros de investigación biomédica?',
    options: createChasideOptions('S', 'interest')
  },
  {
    id: 'voc-13',
    domain: 'vocation',
    number: 13,
    subscale: 'S',
    subscaleLabel: 'Área S · Vocación de Cuidado y Precisión Clínica (Aptitud)',
    prompt: '¿Mantienes la serenidad y la empatía al asistir a personas enfermas o vulnerables en situaciones de urgencia o rehabilitación?',
    options: createChasideOptions('S', 'aptitude')
  },
  {
    id: 'voc-14',
    domain: 'vocation',
    number: 14,
    subscale: 'S',
    subscaleLabel: 'Área S · Salud Pública y Neurociencias (Interés)',
    prompt: '¿Te atrae investigar nuevos tratamientos médicos, tecnologías de rehabilitación física, nutrición clínica o neuropsicología?',
    options: createChasideOptions('S', 'interest')
  },
  {
    id: 'voc-15',
    domain: 'vocation',
    number: 15,
    subscale: 'S',
    subscaleLabel: 'Área S · Rigor Biológico y Clínico (Aptitud)',
    prompt: '¿Destacas en asignaturas relacionadas con biología humana, anatomía, bioquímica y protocolos de salud?',
    options: createChasideOptions('S', 'aptitude')
  },

  // Área I: Ingenierías, Computación y Tecnología (Preguntas 16 a 19)
  {
    id: 'voc-16',
    domain: 'vocation',
    number: 16,
    subscale: 'I',
    subscaleLabel: 'Área I · Ingenierías, Software y Robótica (Interés)',
    prompt: '¿Te entusiasma programar software, entrenar algoritmos de inteligencia artificial, diseñar robots o proyectar obras de ingeniería civil y electrónica?',
    options: createChasideOptions('I', 'interest')
  },
  {
    id: 'voc-17',
    domain: 'vocation',
    number: 17,
    subscale: 'I',
    subscaleLabel: 'Área I · Pensamiento Algorítmico y Matemático (Aptitud)',
    prompt: '¿Resuelves con agilidad problemas de cálculo, lógica algorítmica, física mecánica y modelado de sistemas complejos?',
    options: createChasideOptions('I', 'aptitude')
  },
  {
    id: 'voc-18',
    domain: 'vocation',
    number: 18,
    subscale: 'I',
    subscaleLabel: 'Área I · Innovación Tecnológica e Industrial (Interés)',
    prompt: '¿Te gustaría liderar el desarrollo de nuevas infraestructuras tecnológicas, energías limpias o sistemas aeroespaciales?',
    options: createChasideOptions('I', 'interest')
  },
  {
    id: 'voc-19',
    domain: 'vocation',
    number: 19,
    subscale: 'I',
    subscaleLabel: 'Área I · Diagnóstico Técnico (Aptitud)',
    prompt: 'Cuando un sistema informático o mecanismo falla, ¿disfrutas desarmando el problema lógicamente hasta encontrar la causa raíz?',
    options: createChasideOptions('I', 'aptitude')
  },

  // Área D: Defensa, Seguridad y Liderazgo Operativo (Preguntas 20 a 22)
  {
    id: 'voc-20',
    domain: 'vocation',
    number: 20,
    subscale: 'D',
    subscaleLabel: 'Área D · Seguridad, Ciberseguridad y Logística (Interés)',
    prompt: '¿Te interesa participar en operaciones de protección civil, ciberseguridad nacional, aeronáutica, criminalística o gestión estratégica de emergencias?',
    options: createChasideOptions('D', 'interest')
  },
  {
    id: 'voc-21',
    domain: 'vocation',
    number: 21,
    subscale: 'D',
    subscaleLabel: 'Área D · Liderazgo Táctico bajo Presión (Aptitud)',
    prompt: '¿Cuentas con autodisciplina, temple ante el riesgo y capacidad para tomar decisiones rápidas y éticas en escenarios de alta presión?',
    options: createChasideOptions('D', 'aptitude')
  },
  {
    id: 'voc-22',
    domain: 'vocation',
    number: 22,
    subscale: 'D',
    subscaleLabel: 'Área D · Investigación Forense y Protección (Interés)',
    prompt: '¿Te atrae la investigación forense, el análisis de inteligencia estratégica o la coordinación de misiones humanitarias de rescate?',
    options: createChasideOptions('D', 'interest')
  },

  // Área E: Ciencias Exactas, Naturales, Ecológicas y Biotecnología (Preguntas 23 a 25)
  {
    id: 'voc-23',
    domain: 'vocation',
    number: 23,
    subscale: 'E',
    subscaleLabel: 'Área E · Ciencias Exactas, Ecología y Biotecnología (Interés)',
    prompt: '¿Te apasiona la investigación científica de laboratorio o de campo en física pura, química, genética, astronomía o conservación de ecosistemas?',
    options: createChasideOptions('E', 'interest')
  },
  {
    id: 'voc-24',
    domain: 'vocation',
    number: 24,
    subscale: 'E',
    subscaleLabel: 'Área E · Método Científico y Observación Rigurosa (Aptitud)',
    prompt: '¿Tienes paciencia y rigor para formular hipótesis científicas, recolectar muestras, analizar datos estadísticos y comprobar leyes naturales?',
    options: createChasideOptions('E', 'aptitude')
  },
  {
    id: 'voc-25',
    domain: 'vocation',
    number: 25,
    subscale: 'E',
    subscaleLabel: 'Área E · Sostenibilidad y Biodiversidad (Interés)',
    prompt: '¿Te gustaría dedicar tu carrera a proteger la biodiversidad de Colombia, investigar el cambio climático o desarrollar biotecnología agrícola?',
    options: createChasideOptions('E', 'interest')
  }
];

// ============================================================================
// 5. NIVEL EXTRASENSORIAL (ESTUDIOS PES - J.B. RHINE / INTUICIÓN) — 25 PREGUNTAS
// ============================================================================
// Preguntas 1 a 10: Ensayos de Percepción Simbólica Cartas Zener (protocolo Duke University / Rhine)
// Preguntas 11 a 25: Reactivos de Intuición Perceptiva, Reconocimiento Subliminal y Empatía Resonante
const ZENER_CARDS = [
  { id: 'circle', text: '◯ · Círculo (Unidad y foco continuo)', scoreValue: 1 },
  { id: 'cross', text: '✚ · Cruz Griega (Intersección de ejes)', scoreValue: 2 },
  { id: 'waves', text: '≋ · Tres Líneas Onduladas (Flujo y resonancia)', scoreValue: 3 },
  { id: 'square', text: '□ · Cuadrado Geométrico (Estructura estable)', scoreValue: 4 },
  { id: 'star', text: '☆ · Estrella de Cinco Puntas (Radiación quintuple)', scoreValue: 5 }
];

// Patrón objetivo Zener determinístico para evaluación reproducible (10 ensayos)
export const ZENER_TARGET_SEQUENCE: string[] = [
  'waves', 'star', 'circle', 'square', 'cross',
  'circle', 'waves', 'star', 'cross', 'square'
];

export const ESP_QUESTIONS: PsychometricQuestion[] = [
  // 10 Ensayos Zener (Preguntas 1 a 10)
  ...ZENER_TARGET_SEQUENCE.map((targetId, idx) => ({
    id: `esp-${idx + 1}`,
    domain: 'esp' as TestDomain,
    number: idx + 1,
    subscale: idx < 5 ? 'telepathySymbolic' : 'clairvoyancePattern',
    subscaleLabel: idx < 5
      ? `Protocolo Zener (Ensayo ${idx + 1}/10 · Sincronización Simbólica)`
      : `Protocolo Zener (Ensayo ${idx + 1}/10 · Clarividencia de Patrón)`,
    prompt: `Ensayo Zener #${idx + 1}: Respire profundamente, despeje el razonamiento verbal e intuya qué símbolo de la baraja Zener de J.B. Rhine se encuentra oculto en el registro #${idx + 1}:`,
    contextNote: 'En los estudios clásicos de la Universidad de Duke, el azar estadístico puro corresponde al 20% (2 aciertos sobre 10). Seleccione su primera impresión intuitiva.',
    options: ZENER_CARDS.map((card) => ({
      id: card.id,
      text: card.text,
      scoreValue: card.id === targetId ? 5 : 2,
      subDimension: card.id === targetId ? 'zener_hit' : 'zener_miss'
    }))
  })),

  // Preguntas 11 a 15: Telepatía Simbólica y Resonancia Interpersonal
  {
    id: 'esp-11',
    domain: 'esp',
    number: 11,
    subscale: 'telepathySymbolic',
    subscaleLabel: 'Estudios PES · Resonancia Interpersonal y Telepatía Afectiva',
    prompt: 'Con qué frecuencia percibe usted que un familiar o amigo cercano está pensando en usted o a punto de escribirle segundos antes de recibir su mensaje o llamada:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-12',
    domain: 'esp',
    number: 12,
    subscale: 'telepathySymbolic',
    subscaleLabel: 'Estudios PES · Captación de Clima Emocional No Verbal',
    prompt: 'Al entrar en un salón de clases en completo silencio, percibo de inmediato el estado emocional colectivo (tensión, entusiasmo o calma) sin que nadie haya pronunciado palabra:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-13',
    domain: 'esp',
    number: 13,
    subscale: 'telepathySymbolic',
    subscaleLabel: 'Estudios PES · Sincronía de Pensamiento',
    prompt: 'Me ocurre con regularidad que pronuncio exactamente la misma palabra o idea no obvia al unísono con otra persona durante una conversación:',
    options: LIKERT_OPTIONS
  },

  // Preguntas 14 a 17: Clarividencia Contextual y Detección de Patrones Subliminales
  {
    id: 'esp-14',
    domain: 'esp',
    number: 14,
    subscale: 'clairvoyancePattern',
    subscaleLabel: 'Estudios PES · Intuición de Patrones Ocultos',
    prompt: 'Cuando busco un objeto extraviado o la respuesta a un acertijo complejo, suelo tener un destello visual repentino sobre su ubicación o solución antes de deducirlo paso a paso:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-15',
    domain: 'esp',
    number: 15,
    subscale: 'clairvoyancePattern',
    subscaleLabel: 'Estudios PES · Lectura Subliminal del Entorno',
    prompt: 'Percibo pequeños cambios sutiles en la iluminación, los sonidos de fondo o los microgestos de las personas que mis compañeros suelen pasar por alto:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-16',
    domain: 'esp',
    number: 16,
    subscale: 'clairvoyancePattern',
    subscaleLabel: 'Estudios PES · Primera Impresión Intuitiva',
    prompt: 'Mis primeras corazonadas sobre la autenticidad o intenciones de una situación desconocida suelen confirmarse con el tiempo con notable exactitud:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-17',
    domain: 'esp',
    number: 17,
    subscale: 'clairvoyancePattern',
    subscaleLabel: 'Estudios PES · Orientación Intuitiva',
    prompt: 'Incluso en lugares donde nunca he estado antes, poseo un sentido interno de orientación que me guía hacia la dirección correcta sin consultar mapas:',
    options: LIKERT_OPTIONS
  },

  // Preguntas 18 a 21: Precognición Prospectiva y Anticipación Intuitiva
  {
    id: 'esp-18',
    domain: 'esp',
    number: 18,
    subscale: 'precognitionIntuitive',
    subscaleLabel: 'Estudios PES · Anticipación Prospectiva (Precognición)',
    prompt: 'He experimentado sueños vívidos o presentimientos claros sobre situaciones cotidianas específicas que días después ocurren de manera muy similar:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-19',
    domain: 'esp',
    number: 19,
    subscale: 'precognitionIntuitive',
    subscaleLabel: 'Estudios PES · Sentido del Tiempo Interno',
    prompt: 'Soy capaz de despertar pocos minutos antes de que suene mi alarma o de estimar la hora exacta del día sin mirar ningún reloj:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-20',
    domain: 'esp',
    number: 20,
    subscale: 'precognitionIntuitive',
    subscaleLabel: 'Estudios PES · Reconocimiento de Sincronicidades (Déjà Vu)',
    prompt: 'Experimento episodios de "déjà vu" o sincronicidades significativas donde reconozco qué sucederá en los siguientes segundos de una escena:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-21',
    domain: 'esp',
    number: 21,
    subscale: 'precognitionIntuitive',
    subscaleLabel: 'Estudios PES · Intuición en Decisiones Rápidas',
    prompt: 'Cuando debo tomar una decisión rápida con información incompleta, siento una señal corporal o certeza interna clara que me indica el camino acertado:',
    options: LIKERT_OPTIONS
  },

  // Preguntas 22 a 25: Sensibilidad Sinestésica y Creatividad Subconsciente
  {
    id: 'esp-22',
    domain: 'esp',
    number: 22,
    subscale: 'synestheticSensitivity',
    subscaleLabel: 'Estudios PES · Asociación Sinestésica',
    prompt: 'De manera espontánea asocio números, días de la semana, notas musicales o conceptos abstractos con colores, texturas o formas espaciales definidas:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-23',
    domain: 'esp',
    number: 23,
    subscale: 'synestheticSensitivity',
    subscaleLabel: 'Estudios PES · Incubación Subconsciente (Insight)',
    prompt: 'Al dejar reposar un problema difícil antes de dormir, suelo despertar con la estructura completa de la solución clara en mi mente:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-24',
    domain: 'esp',
    number: 24,
    subscale: 'synestheticSensitivity',
    subscaleLabel: 'Estudios PES · Sensibilidad a Campos y Ambientes',
    prompt: 'Noto inmediatamente cómo la acústica, la geometría o la atmósfera de un lugar influyen en mi claridad mental y flujo creativo:',
    options: LIKERT_OPTIONS
  },
  {
    id: 'esp-25',
    domain: 'esp',
    number: 25,
    subscale: 'synestheticSensitivity',
    subscaleLabel: 'Estudios PES · Integración Razón-Intuición',
    prompt: 'Considero que mis mejores logros académicos y personales surgen cuando combino el análisis lógico riguroso con mi intuición perceptiva:',
    options: LIKERT_OPTIONS
  }
];

export const ALL_QUESTIONS_BY_DOMAIN: Record<TestDomain, PsychometricQuestion[]> = {
  ci: CI_QUESTIONS,
  personality: PERSONALITY_QUESTIONS,
  learning: LEARNING_QUESTIONS,
  vocation: VOCATION_QUESTIONS,
  esp: ESP_QUESTIONS
};
