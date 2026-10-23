/**
 * Validación de URLs antes de usarlas en href (previene javascript:, data:, open redirects).
 */

/**
 * @param {string|null} url
 * @param {readonly string[]} allowedHosts
 * @returns {boolean}
 */
export function isAllowedExternalUrl(url, allowedHosts) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && allowedHosts.includes(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Acepta solo rutas relativas del mismo sitio dentro de un prefijo permitido.
 * @param {string|null} path
 * @param {string} allowedPrefix p. ej. "assets/docs/"
 */
export function isAllowedLocalPath(path, allowedPrefix) {
  if (!path || typeof path !== 'string') return false;
  if (!path.startsWith(allowedPrefix) || path.includes('..') || path.includes('\\')) return false;
  try {
    const resolved = new URL(path, window.location.href);
    return resolved.origin === window.location.origin;
  } catch {
    return false;
  }
}
