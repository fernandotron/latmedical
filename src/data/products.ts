export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: 'Vlift Pro' | 'Seffiline';
  category: 'Hilos PDO' | 'Medicina Regenerativa';
  shortDesc: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  image: string;
  price: number;
}

export const products: Product[] = [
  // VLIFT PRO HILOS PDO
  {
    id: 'vlift-mono',
    name: 'V Lift Pro Mono (Hilos Lisos)',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos PDO monofilamento lisos diseñados para bioestimulación y redensificación de la piel de forma natural y progresiva.',
    description: 'Los Hilos Mono V LIFT PRO son hilos de polidioxanona (PDO) monofilamento, también conocidos como hilos biológicos. Su diseño está especialmente orientado a estimular de forma intensa la producción natural de colágeno autólogo y elastina, mejorando la calidad, densidad y firmeza de la piel de forma progresiva. Su estructura lisa y disposición en forma de malla imita la arquitectura del colágeno natural, lo que resulta en un rejuvenecimiento cutáneo eficaz y duradero. Se aplican de manera óptima para tratamientos localizados en rostro, cuello, escote y diferentes zonas corporales. Vienen montados sobre agujas guía de diseño "painless" ultra-afiladas con baño de silicona para garantizar una inserción precisa con la mínima incomodidad para el paciente.',
    features: [
      'Estimulación biológica activa de colágeno tipo I y III',
      'Efecto de redensificación progresiva de la matriz dérmica',
      'Agujas con tecnología "Painless" y baño de silicona médica',
      'Material 100% biocompatible y reabsorbible entre 6 y 8 meses'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO)' },
      { label: 'Tipo de Aguja', value: 'Aguja Guía Ultra-Fina' },
      { label: 'Calibres Comunes', value: '25G, 27G, 29G, 30G' },
      { label: 'Longitudes Hilo', value: '25mm, 38mm, 50mm, 60mm, 90mm' },
      { label: 'Zonas Indicadas', value: 'Rostro, Cuello, Escote, Brazos, Abdomen' }
    ],
    image: '/2020/2020/12/Hilo-Mono.png',
    price: 30.00
  },
  {
    id: 'vlift-biocanula',
    name: 'V Lift Pro Biocánula 14 Mono',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Sistema multi-hilo con 14 hilos Mono de PDO precargados en una única cánula para bioestimulación y efecto refill.',
    description: 'La Biocánula V LIFT PRO representa un concepto avanzado en revitalización cutánea denominado "efecto refill". Permite una revitalización profunda y un relleno autólogo del área tratada sin aportar volumen artificial ni utilizar sustancias de relleno exógenas convencionales. El sistema está compuesto por una cánula tipo L de inserción atraumática (calibres 23G) que contiene en su interior 14 hilos PDO monofilamento lisos. Promueve una intensa neocolagénesis y regeneración progresiva con resultados sumamente naturales, minimizando el trauma tisular y favoreciendo una rápida recuperación del paciente. El efecto tensor y regenerador del tratamiento se prolonga entre 6 y 12 meses.',
    features: [
      '14 hilos Mono colocados simultáneamente con un único punto de entrada',
      'Distribución homogénea en abanico para redensificación masiva',
      'Menor tiempo de procedimiento y mínimo discomfort post-trabamiento',
      'Ideal para flacidez corporal y rejuvenecimiento completo de mejillas y cuello'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO) Premium' },
      { label: 'Sistema', value: '1 Cánula con 14 Hilos Monofilamento' },
      { label: 'Calibre Cánula', value: '23G' },
      { label: 'Longitudes Cánula', value: '38mm, 60mm' },
      { label: 'Hilo Interior', value: 'USP 5.0 (50mm a 90mm)' },
      { label: 'Zonas', value: 'Mejillas, Cuello, Brazos, Muslos y Abdomen' }
    ],
    image: '/2020/2020/12/biocanula-producto.png',
    price: 70.00
  },
  {
    id: 'vlift-single-screw',
    name: 'V Lift Pro Single Screw (Tornillo Simple)',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos espiralados de PDO arrollados en la aguja para estimulación localizada y efecto muelle.',
    description: 'Los hilos V Lift Pro Single Screw consisten en un filamento de PDO enrollado en espiral alrededor de la aguja guía. Esta configuración le otorga memoria elástica ("efecto resorte"). Al ser implantado, el hilo se expande ligeramente en el tejido, creando una inducción volumétrica que ayuda a atenuar surcos finos, al tiempo que duplica la superficie de bioestimulación de colágeno alrededor de la aguja.',
    features: [
      'Efecto muelle que proporciona volumen y soporte estructural',
      'Mayor superficie de contacto con el tejido, maximizando el colágeno',
      'Excelente para tratar arrugas dinámicas y surcos localizados',
      'Introducción rápida y segura con agujas tratadas con silicona'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO)' },
      { label: 'Estructura', value: 'Espiralado simple alrededor de aguja' },
      { label: 'Calibres Comunes', value: '26G, 27G, 29G' },
      { label: 'Longitud Hilo', value: '50mm a 90mm' },
      { label: 'Indicaciones', value: 'Surcos nasogenianos, líneas de marioneta, arrugas periorbitales' }
    ],
    image: '/2020/2020/11/Caja-Hilos-Single-Screw-Producto.png',
    price: 35.00
  },
  {
    id: 'vlift-double-screw',
    name: 'V Lift Pro Double Screw (Tornillo Doble)',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos en espiral doble de PDO entrelazados para mayor efecto de estimulación y relleno.',
    description: 'Los hilos Double Screw incorporan dos filamentos independientes de PDO enrollados en espiral sobre la aguja de soporte. Esta doble hélice provee una densidad estructural significativamente mayor, ideal para pacientes que requieren una bioestimulación intensiva y una corrección volumétrica en depresiones faciales marcadas o arrugas profundas, logrando un efecto de relleno natural sin sustancias exógenas.',
    features: [
      'Doble espiral entrelazada para un efecto de "refill" biológico superior',
      'Fuerte estímulo cicatrizal endógeno que redensifica la dermis profunda',
      'Ideal para el tratamiento de pliegues profundos en pieles maduras',
      'Asociado a agujas siliconadas painless para inserción de alta precisión'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO)' },
      { label: 'Estructura', value: 'Espiral doble (Double Screw) helicoidal' },
      { label: 'Calibres Comunes', value: '25G, 26G, 27G' },
      { label: 'Longitud Hilo', value: '60mm a 90mm' },
      { label: 'Indicaciones', value: 'Surcos nasogenianos profundos, pliegues del mentón y escote' }
    ],
    image: '/2020/2020/11/Caja-Hilos-Single-Screw-Producto.png',
    price: 44.00
  },
  {
    id: 'vlift-genesis',
    name: 'V Lift Pro Genesis (Espiculados con Cánula)',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos espiculados 360° montados sobre cánula roma tipo L para un lifting facial tridimensional seguro y atraumático.',
    description: 'Los Hilos Genesis V LIFT PRO son hilos tensores de polidioxanona (PDO) que incorporan espículas moldeadas distribuidas en 360° para lograr una fijación tridimensional completa de las estructuras tisulares caídas. Este diseño permite un reposicionamiento volumétrico inmediato con un efecto lifting altamente natural y duradero. Están indicados especialmente para el tratamiento de pieles con flacidez moderada en vectores cortos del rostro y cuello (ideal para fototipos III y IV de Fitzpatrick). Se introducen a través de cánulas tipo L de inserción atraumática que separan las fibras tisulares en lugar de cortarlas, minimizando drásticamente la inflamación y el riesgo de hematomas.',
    features: [
      'Inserción mediante cánula roma que minimiza el trauma y riesgo de hematomas',
      'Hilo de alta resistencia (calibre USP 1-0 / USP 0) con espículas moldeadas',
      'Reposicionamiento volumétrico tridimensional con anclaje firme subcutáneo',
      'Efecto lifting de alta potencia en mejillas, óvalo facial y papada'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO) moldeada' },
      { label: 'Tipo Cánula', value: 'Cánula Roma tipo L (Atraumática)' },
      { label: 'Calibres Cánula', value: '19G, 21G, 23G' },
      { label: 'Longitudes Cánula', value: '70mm, 90mm' },
      { label: 'Estructura', value: 'Espículas moldeadas en 360°' }
    ],
    image: '/2020/2025/05/sobre-genesis-producto.png',
    price: 150.00
  },
  {
    id: 'vlift-nose',
    name: 'V Lift Pro Nose (Rinomodelación)',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos PDO espiculados rígidos diseñados para rinomodelación no quirúrgica y elevación de la punta nasal.',
    description: 'Los Hilos Nose V LIFT PRO están diseñados de forma exclusiva para procedimientos de rinomodelación no quirúrgica y de mínima invasión. Permiten definir la punta nasal, alinear el dorso o corregir alas anchas de manera inmediata con resultados naturales y sin tiempos de inactividad. Cuentan con espículas rígidas diseñadas para proveer un anclaje y tracción superior sobre las estructuras cartilaginosas nasales. El formato de sobre contiene 4 hilos de PDO estériles con guía de alta resistencia, disponibles en las medidas optimizadas para el dorso (21G x 60 mm), septum (19G x 38 mm) y glabela/alas nasales (19G x 50 mm).',
    features: [
      'Diseño exclusivo de tracción superior adaptado a cartílagos nasales',
      'Excelente alternativa biológica a la rinoplastia quirúrgica',
      'Reposicionamiento y fijación inmediata con mínima inflamación',
      'Completamente reabsorbible y biocompatible'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO) Moldeada' },
      { label: 'Estructura', value: 'Espiculado Rígido Unidireccional' },
      { label: 'Calibres Comunes', value: '19G, 21G' },
      { label: 'Longitudes Hilo', value: '38mm, 50mm, 60mm' },
      { label: 'Zonas', value: 'Dorso nasal, columela, septum y punta nasal' }
    ],
    image: '/2020/2025/05/Sobre-Hilos-Nose-producto.png',
    price: 80.00
  },
  {
    id: 'vlift-eye',
    name: 'V Lift Pro Eye (Periocular)',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos delgados de PDO optimizados para la delicada zona de ojeras, párpados y contorno periocular.',
    description: 'Los hilos V Lift Pro Eye están fabricados con polidioxanona de calibre ultrafino y montados sobre agujas cortas de calibre pequeño (como 30G x 25mm), diseñados específicamente para la delgada y sensible piel de la región periocular. Actúan densificando la piel del párpado inferior y la zona de ojeras, mejorando la microcirculación local, atenuando arrugas finas ("patas de gallo") y reduciendo el aspecto oscuro o hundido de las ojeras mediante neocolagénesis.',
    features: [
      'Calibre ultra-fino adaptado a la piel más delgada del rostro',
      'Estimulación de neocolagénesis que aumenta el espesor dérmico periocular',
      'Disminución del aspecto de ojeras hundidas y arrugas finas',
      'Colocación precisa y segura con mínimo disconfort'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO) extra fina' },
      { label: 'Calibres Comunes', value: '30G' },
      { label: 'Longitudes Hilo', value: '25mm a 38mm' },
      { label: 'Zonas Recomendadas', value: 'Párpado inferior, cejas y patas de gallo' }
    ],
    image: '/2020/2020/12/Hilo-Mono.png',
    price: 50.00
  },
  {
    id: 'vlift-premium',
    name: 'V Lift Pro Premium (Espiculados 3D/4D)',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos espiculados bidireccionales con aguja guía Painless para redefinir contornos y lifting de tensión facial.',
    description: 'Los Hilos Premium V LIFT PRO están diseñados para el lifting y rejuvenecimiento facial. Su estructura con espículas bidireccionales helicoidales ofrece un anclaje mecánico sumamente firme en el plano subdérmico/subcutáneo. Permiten técnica cerrada (un punto de entrada) o técnica abierta para tejidos pesados, indicados especialmente para definir el óvalo facial y tratar mejillas, mandíbula o cuello con la aguja Painless siliconada.',
    features: [
      'Efecto lifting mecánico inmediato y reposicionamiento de tejidos',
      'Espículas distribuidas en 360º para un anclaje multidireccional superior',
      'Ideal para definir la línea de la mandíbula y elevar pómulos o cejas',
      'Doble acción: tracción física inmediata y bioestimulación a largo plazo'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO)' },
      { label: 'Estructura', value: 'Espiculado Helicoidal (Cog 3D/4D)' },
      { label: 'Calibres Comunes', value: '19G, 21G, 23G' },
      { label: 'Longitudes Hilo', value: '70mm, 90mm' },
      { label: 'Indicación', value: 'Lifting de Pómulos, Mandíbula y Cuello' }
    ],
    image: '/2020/2025/08/Sobre-Hilos-premium-producto.png',
    price: 120.00
  },
  {
    id: 'vlift-cones',
    name: 'V Lift Pro Cones (Conos Moldeados)',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos PDO de tracción avanzada con espículas moldeadas en forma de conos (molding) para tejidos de gran flacidez.',
    description: 'Los Hilos Cones V LIFT PRO representan la máxima capacidad de tracción biológica. Sus espículas moldeadas a presión directa (tecnología molding) mantienen el núcleo del hilo intacto duplicando la resistencia mecánica. Conos 3D de gran superficie que se anclan firmemente en plano subcutáneo profundo de rostros pesados o flacidez severa. Se introducen mediante cánula de gran calibre (18G), garantizando los mejores resultados y máxima seguridad clínica.',
    features: [
      'Conos moldeados en 3D que multiplican la capacidad de anclaje',
      'Núcleo del hilo intacto de alta resistencia mecánica a la rotura',
      'Ideal para elevaciones faciales exigentes y lifting de pómulos pesados',
      'Reabsorción lenta y segura con bioestimulación de colágeno circundante'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO) de moldeado directo' },
      { label: 'Estructura', value: 'Conos tridimensionales moldeados (Molding Cog)' },
      { label: 'Calibres Comunes', value: '18G' },
      { label: 'Longitudes Hilo', value: '100mm' },
      { label: 'Indicaciones', value: 'Lifting facial en tejidos gruesos, reposicionamiento malar' }
    ],
    image: '/2020/2025/05/Sobre-Cones-Producto.png',
    price: 150.00
  },
  {
    id: 'vlift-tensio',
    name: 'V Lift Pro Tensio',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos espiculados de tracción reforzada de alta resistencia para anclaje facial e infraestructuras faciales.',
    description: 'Los hilos Tensio de V Lift Pro incorporan un patrón espiculado reforzado diseñado para soportar altos vectores de tensión física. Es un dispositivo indicado para cirujanos y especialistas que buscan realizar suspensiones estructurales en pacientes con descolgamientos evidentes, permitiendo anclajes profundos en la fascia o en estructuras faciales de retención para un efecto tensor de larga duración.',
    features: [
      'Vectores de tracción reforzados para soportar cargas pesadas de tejido',
      'Ideal para elevación del tercio inferior y redefinición del contorno cervical',
      'Estímulo de colágeno de alta densidad que forma cordones fibrosos de sostén',
      'Cánulas tratadas para un desplazamiento limpio e indoloro'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO)' },
      { label: 'Estructura', value: 'Espiculado Reforzado de Alta Tracción' },
      { label: 'Calibre Cánula', value: '19G' },
      { label: 'Longitud Hilo', value: '100mm' },
      { label: 'Zonas', value: 'Tercio medio, mandíbula, papada y cuello' }
    ],
    image: '/2020/2025/05/Caja-Tensio-Productos.png',
    price: 150.00
  },
  {
    id: 'vlift-dual-cog',
    name: 'V Lift Pro Doble Aguja Dual Cog',
    brand: 'Vlift Pro',
    category: 'Hilos PDO',
    shortDesc: 'Hilos PDO de doble aguja con espículas bidireccionales diseñados para suspensión y tracción de tejidos severos.',
    description: 'Los Hilos Doble Aguja Dual Cog de V LIFT PRO representan una solución de tracción avanzada y mínimamente invasiva diseñada para la elevación de tejidos faciales y corporales de gran flacidez. Equipados con dos agujas conectadas a un hilo de polidioxanona con espículas moldeadas bidireccionales de alta tracción, este dispositivo permite realizar técnicas de suspensión en bucle o vectores cerrados con un único punto de entrada, garantizando un soporte de tensión extremadamente firme y duradero.',
    features: [
      'Doble aguja integrada para anclajes en bucle y vectores complejos',
      'Espículas bidireccionales moldeadas para máxima tracción subcutánea',
      'Ideal para cejas, tercio medio facial, pómulos y flacidez cervical',
      'Material 100% reabsorbible y biocompatible con inducción colágena'
    ],
    specs: [
      { label: 'Material', value: 'Polidioxanona (PDO)' },
      { label: 'Estructura', value: 'Doble aguja con espículas bidireccionales (Dual Cog)' },
      { label: 'Longitudes Hilo', value: '110mm, 150mm' },
      { label: 'Zonas Recomendadas', value: 'Cejas, mejillas, óvalo facial, cuello' }
    ],
    image: '/2020/2020/12/biocanula-producto.png',
    price: 100.00
  },

  // Seffiline Products
  {
    id: 'seffi-filler',
    name: 'SEFFILLER®',
    brand: 'Seffiline',
    category: 'Medicina Regenerativa',
    shortDesc: 'Dispositivo médico patentado para el microinjerto autólogo de tejido adiposo y células madre (ADSCs).',
    description: 'El Kit Seffiller V LIFT PRO es un sistema desechable "todo en uno" diseñado para profesionales médicos y dermatólogos. Este dispositivo permite la recolección guiada, preparación e injerto de tejido adiposo subcutáneo y su fracción estromal (SVF), rica en células madre derivadas de adipocitos (ADSCs), en un flujo de trabajo estéril y cerrado que no requiere equipos externos, garantizando máxima precisión clínica y seguridad.',
    features: [
      'Sistema cerrado y estéril todo en uno: recolección, filtrado y preparación sin manipulación externa',
      'Cánula con guía patentada para una recolección segura en el plano superficial exacto',
      'Microfragmentación controlada del tejido adiposo que conserva la viabilidad celular',
      'Procedimiento ambulatorio rápido en consultorio bajo anestesia local'
    ],
    specs: [
      { label: 'Tecnología', value: 'SEFFI (Superficial Enhanced Fluid Fat Injection)' },
      { label: 'Componentes', value: 'Cánula guiada patentada, jeringas de recolección y conectores estériles' },
      { label: 'Indicación Principal', value: 'Rejuvenecimiento facial, restauración de volumen, mejora de textura' },
      { label: 'Certificaciones', value: 'Marcado CE Clase IIa, Aprobación ANMAT' },
      { label: 'Tipo de Injerto', value: 'Tejido adiposo microfragmentado autólogo + SVF' }
    ],
    image: '/2020/2026/01/Seffiller-producto.png',
    price: 350.00
  },
  {
    id: 'seffi-hair',
    name: 'SEFFIHAIR®',
    brand: 'Seffiline',
    category: 'Medicina Regenerativa',
    shortDesc: 'Kit de terapia regenerativa capilar mediante microinjerto de tejido adiposo para alopecias.',
    description: 'El Kit Seffihair V LIFT PRO es un sistema desechable "todo en uno" diseñado para profesionales médicos, tricólogos y dermatólogos. Permite la recolección guiada, preparación e injerto de tejido adiposo subcutáneo y su fracción estromal (SVF), rica en células madre derivadas de adipocitos (ADSCs), para estimular el folículo piloso en un flujo de trabajo estéril y seguro.',
    features: [
      'Estimulación directa de folículos pilosos en fase de miniaturización',
      'Alta concentración de factores de crecimiento autólogos y exosomas naturales',
      'Alternativa biológica no quirúrgica de alta eficacia para la alopecia androgenética',
      'Kit desechable que garantiza la máxima bioseguridad del procedimiento'
    ],
    specs: [
      { label: 'Aplicación', value: 'Tricología Médica / Regeneración Capilar' },
      { label: 'Kit Incluye', value: 'Cánula SEFFI Hair, guías de profundidad capilar, jeringas de filtrado' },
      { label: 'Pacientes Aptos', value: 'Alopecia androgenética masculina y femenina, efluvio telógeno' },
      { label: 'Origen Celular', value: 'Fracción Vascular Estromal Autóloga' }
    ],
    image: '/2020/2026/07/Seffihair-producto.png',
    price: 390.00
  },
  {
    id: 'seffi-care',
    name: 'SEFFICARE®',
    brand: 'Seffiline',
    category: 'Medicina Regenerativa',
    shortDesc: 'Dispositivo médico para aplicaciones regenerativas en ortopedia, cicatrización y dolor crónico.',
    description: 'El Kit Sefficare V LIFT PRO es un sistema diseñado para la terapia regenerativa autóloga enfocado en medicina reparadora, traumatología y regeneración tisular compleja. Permite procesar de forma estéril y en circuito cerrado el tejido adiposo autólogo rico en fracción vascular estromal (SVF) y células madre mesenquimales para curación de úlceras, heridas complejas o dolor articular crónico.',
    features: [
      'Tratamiento biológico para patologías articulares degenerativas y tendinopatías',
      'Estimulación de la angiogénesis y regeneración tisular en heridas complejas',
      'Dispositivo cerrado desechable que reduce a cero el riesgo de contaminación cruzada',
      'Procedimiento rápido (menos de 45 minutos) con alta tasa de éxito clínico'
    ],
    specs: [
      { label: 'Especialidades', value: 'Ortopedia, Traumatología, Vulnología, Dermatología' },
      { label: 'Objetivo Terapéutico', value: 'Disminución de inflamación, regeneración de cartílago/tejido y alivio de dolor' },
      { label: 'Método', value: 'Infiltración intraarticular o perilesional' },
      { label: 'Seguridad', value: 'Material 100% autólogo (sin rechazos)' }
    ],
    image: '/2020/2026/07/Sefficare-producto.png',
    price: 480.00
  },
  {
    id: 'seffi-gyn',
    name: 'SEFFIGYN®',
    brand: 'Seffiline',
    category: 'Medicina Regenerativa',
    shortDesc: 'Kit de ginecología regenerativa para la restauración funcional y estética de la zona íntima femenina.',
    description: 'SEFFIGYN® es un tratamiento innovador "todo en uno", seguro y simplificado para la regeneración íntima femenina que utiliza el tejido adiposo para restaurar la elasticidad, el tono y la hidratación de los tejidos vaginales y vulvares. Gracias a su sistema de guía y cánula patentados, permite recolectar tejido adiposo superficial (rico en células madre mesenquimales) y reinyectarlo sin manipulación externa en un flujo de trabajo estéril y cerrado.',
    features: [
      'Tratamiento no hormonal de alta eficacia para la atrofia vulvovaginal',
      'Bioestimulación profunda que recupera el grosor, elasticidad e hidratación de la mucosa',
      'Excelente perfil de seguridad, procedimiento ambulatorio bajo anestesia local',
      'Resultados duraderos basados en la regeneración celular propia'
    ],
    specs: [
      { label: 'Especialidad', value: 'Ginecología Regenerativa / Estética Íntima' },
      { label: 'Indicaciones', value: 'Atrofia vaginal, dispareunia, sequedad vulvar, liquen escleroso' },
      { label: 'Componentes del Kit', value: 'Cánula ginecológica SEFFI, guías anatómicas específicas' },
      { label: 'Anestesia', value: 'Local tumescente' }
    ],
    image: '/2020/2026/07/Seffigyn-producto.png',
    price: 650.00
  }
];

// Dynamically bind product.price getter/setter to localStorage override values
products.forEach(product => {
  const defaultPrice = product.price;
  Object.defineProperty(product, 'price', {
    get() {
      const saved = localStorage.getItem(`latmedical_price_${product.id}`);
      return saved ? parseFloat(saved) : defaultPrice;
    },
    set(newVal: number) {
      localStorage.setItem(`latmedical_price_${product.id}`, newVal.toString());
    },
    configurable: true,
    enumerable: true
  });
});

