/**
 * Configuración central de la aplicación.
 * Todo valor "mágico" vive aquí para que los módulos no lo dupliquen.
 * Object.freeze evita que otros módulos alteren la configuración en tiempo de ejecución.
 */
const deepFreeze = (obj) => {
  Object.values(obj).forEach((value) => {
    if (value && typeof value === 'object') deepFreeze(value);
  });
  return Object.freeze(obj);
};

export const APP_CONFIG = deepFreeze({
  documents: {
    /** Solo se permiten descargas desde esta carpeta del propio sitio. */
    allowedPathPrefix: 'assets/docs/',
  },

  contact: {
    email: 'investigacion@iebarrioolayaherrera.edu.co',
  },

  /** Lista blanca de dominios externos a los que el sitio puede enlazar. */
  externalLinks: {
    allowedHosts: [
      'iebarrioolayaherrera.edu.co',
      'www.medellin.gov.co',
      'minciencias.gov.co',
    ],
    items: [
      { label: 'Página Oficial IE Barrio Olaya Herrera', url: 'https://iebarrioolayaherrera.edu.co' },
      { label: 'Master2000 • Plataforma Académica', url: null },
      { label: 'Secretaría de Educación de Medellín', url: 'https://www.medellin.gov.co/es/secretaria-de-educacion/' },
      { label: 'MinCiencias Programa Ondas', url: 'https://minciencias.gov.co/' },
      { label: 'Manual de Convivencia Institucional', url: null },
    ],
  },

  scrollSpy: {
    rootMargin: '-45% 0px -50% 0px',
  },

  toast: {
    durationMs: 6000,
  },
});
