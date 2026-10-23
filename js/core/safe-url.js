/**
 * Validación de URLs que llegan desde los JSON de contenido.
 * Solo se aceptan formas conocidas; todo lo demás (javascript:, data:, http:, dominios
 * no autorizados, rutas con "..") se rechaza y el enlace no se genera.
 */

const ANCHOR = /^#[A-Za-z][\w-]*$/;
const MAILTO = /^mailto:[^\s@?#&]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;
const TEL = /^tel:\+?[0-9]{6,15}$/;
const LOCAL_IMAGE = /^assets\/img\/[\w.-]+\.(svg|png|webp|jpg|jpeg)$/i;

/**
 * @param {string|null} url
 * @param {readonly string[]} allowedHosts
 */
export function isAllowedExternalUrl(url, allowedHosts) {
  if (typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && allowedHosts.includes(parsed.hostname) && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

/** Ruta relativa del mismo sitio dentro de un prefijo permitido (p. ej. "assets/docs/"). */
export function isAllowedLocalPath(path, allowedPrefix) {
  if (typeof path !== 'string' || !path.startsWith(allowedPrefix)) return false;
  if (path.includes('..') || path.includes('\\') || path.includes('//')) return false;
  try {
    return new URL(path, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

export const isAllowedImagePath = (path) => typeof path === 'string' && LOCAL_IMAGE.test(path) && !path.includes('..');

/**
 * Clasifica un href del contenido.
 * @param {unknown} href
 * @param {{ allowedHosts: readonly string[], downloadPrefix: string }} policy
 * @returns {{ kind: 'anchor'|'mailto'|'tel'|'download'|'external', href: string } | null}
 */
export function resolveHref(href, { allowedHosts, downloadPrefix }) {
  if (typeof href !== 'string' || href.length > 2048) return null;
  if (ANCHOR.test(href)) return { kind: 'anchor', href };
  if (MAILTO.test(href)) return { kind: 'mailto', href };
  if (TEL.test(href)) return { kind: 'tel', href };
  if (isAllowedLocalPath(href, downloadPrefix)) return { kind: 'download', href };
  if (isAllowedExternalUrl(href, allowedHosts)) return { kind: 'external', href };
  return null;
}
