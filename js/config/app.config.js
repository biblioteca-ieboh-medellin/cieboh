/**
 * Configuración técnica y de seguridad de la aplicación.
 * El CONTENIDO (textos, etiquetas, enlaces) vive en /content/*.json;
 * aquí solo están las reglas que el contenido no puede cambiar (listas blancas, límites).
 */
const deepFreeze = (obj) => {
  Object.values(obj).forEach((value) => {
    if (value && typeof value === 'object') deepFreeze(value);
  });
  return Object.freeze(obj);
};

export const APP_CONFIG = deepFreeze({
  content: {
    baseUrl: 'content/',
    /** Tamaño máximo aceptado por archivo JSON (defensa ante archivos corruptos). */
    maxBytes: 200 * 1024,
  },

  links: {
    /** Dominios externos a los que el contenido puede enlazar (solo https). */
    allowedHosts: ['iebarrioolayaherrera.edu.co', 'www.medellin.gov.co', 'minciencias.gov.co'],
    /** Única carpeta desde la que se permiten descargas. */
    downloadPrefix: 'assets/docs/',
  },

  scrollSpy: {
    rootMargin: '-45% 0px -50% 0px',
  },

  toast: {
    durationMs: 6000,
  },

  /** Media query a partir de la cual el menú deja de ser desplegable. */
  desktopNavQuery: '(min-width: 1280px)',
});
