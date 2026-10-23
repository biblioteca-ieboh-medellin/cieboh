/**
 * Formatos descargables del repositorio EDS.
 * `href` debe apuntar a un archivo dentro de assets/docs/ (ver APP_CONFIG.documents).
 * Mientras el archivo no exista, deja `href: null` y el portal avisará que está "próximamente".
 */
export const DOCUMENTOS = Object.freeze([
  {
    id: 'guia-preguntas',
    icon: 'description',
    title: 'Guía de Inicio: Planteamiento de Preguntas Problematizadoras',
    format: 'PDF',
    size: '1.4 MB',
    step: 'Paso 1 EDS',
    actionLabel: 'Guía',
    href: null,
  },
  {
    id: 'formato-anteproyecto',
    icon: 'assignment',
    title: 'Formato Oficial: Mi Anteproyecto ("Aprendiendo a narrar")',
    format: 'DOCX',
    size: '820 KB',
    step: 'Paso 2 EDS',
    actionLabel: 'Plantilla',
    href: null,
  },
  {
    id: 'bitacora-maestros',
    icon: 'clinical_notes',
    title: 'Bitácora de Campo y Formato de Sistematización para Maestros',
    format: 'PDF',
    size: '2.1 MB',
    step: 'Paso 4 EDS',
    actionLabel: 'Bitácora',
    href: null,
  },
].map(Object.freeze));
