/**
 * Datos de los semilleros científicos activos.
 * Para agregar o actualizar un semillero basta con editar este arreglo:
 * la vista y el resumen de cupos se recalculan solos.
 */
export const SEMILLEROS = Object.freeze([
  {
    id: 'steam',
    code: 'STEAM-BOH',
    icon: 'smart_toy',
    name: 'Semillero STEAM',
    description:
      'Robótica educativa, programación en microcontroladores, domótica de bajo costo y física recreativa aplicada a soluciones del aula.',
    levels: '7° a 11°',
    schedule: 'Miércoles 2:00 pm',
    enrolled: 24,
    capacity: 30,
  },
  {
    id: 'cea',
    code: 'CEA-BOH',
    icon: 'psychology',
    name: 'Semillero CEA',
    description:
      'Centro de Experimentación y Aprendizaje: estudios astronómicos básicos, experimentos de química verde y debates de filosofía de la ciencia.',
    levels: '6° a 9°',
    schedule: 'Jueves 1:30 pm',
    enrolled: 22,
    capacity: 30,
  },
  {
    id: 'dagantes',
    code: 'DAGANTES',
    icon: 'menu_book',
    name: 'Dagantes BOH',
    description:
      'Indagación literaria, periodismo escolar digital, oratoria y crónicas de memoria histórica comunitaria del barrio Olaya Herrera.',
    levels: '5° a 11°',
    schedule: 'Viernes 2:30 pm',
    enrolled: 18,
    capacity: 25,
  },
  {
    id: 'verdes',
    code: 'VERDES',
    icon: 'forest',
    name: 'Colegios Verdes',
    description:
      'Liderazgo en gestión ambiental comunitaria, jardines para polinizadores, compostaje institucional y mitigación del cambio climático.',
    levels: 'Primaria y Bachillerato',
    schedule: 'Martes 1:30 pm',
    enrolled: 28,
    capacity: 30,
  },
].map(Object.freeze));
