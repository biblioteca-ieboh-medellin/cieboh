/**
 * Utilidades DOM seguras.
 * Regla del proyecto: NUNCA usar innerHTML/outerHTML/insertAdjacentHTML.
 * Todo el contenido (incluido el que viene de los JSON) se crea con createElement
 * + textContent, lo que neutraliza la inyección de HTML/JS (XSS) por construcción.
 * Además, la CSP activa Trusted Types, así que el navegador bloquearía cualquier intento.
 */

export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/** Atributos que jamás se aceptan desde código dinámico (manejadores inline, etc.). */
const FORBIDDEN_ATTR = /^on|^style$|^srcdoc$|^xlink:href$/i;

const SVG_NS = 'http://www.w3.org/2000/svg';

function applyAttrs(el, attrs) {
  if (!attrs) return;
  Object.entries(attrs).forEach(([name, value]) => {
    if (FORBIDDEN_ATTR.test(name)) throw new Error(`Atributo no permitido: ${name}`);
    if (value === false || value === null || value === undefined) return;
    el.setAttribute(name, value === true ? '' : String(value));
  });
}

function appendChildren(el, children) {
  children.forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });
}

/**
 * Fábrica de elementos HTML (patrón Factory).
 * @param {string} tag
 * @param {{ className?: string, text?: string|number, attrs?: Record<string, unknown> }} [options]
 * @param {Array<Node|string|number|null|undefined|false>} [children]
 * @returns {HTMLElement}
 */
export function h(tag, options = {}, children = []) {
  const el = document.createElement(tag);
  const { className, text, attrs } = options;
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = String(text);
  applyAttrs(el, attrs);
  appendChildren(el, children);
  return el;
}

/** Fábrica equivalente para elementos SVG. */
export function s(tag, attrs = {}, children = []) {
  const el = document.createElementNS(SVG_NS, tag);
  applyAttrs(el, attrs);
  appendChildren(el, children);
  return el;
}

const ICON_NAME = /^[a-z0-9_]+$/;

/** Ícono decorativo de Material Symbols (oculto para lectores de pantalla). */
export function icon(name, extraClass = '') {
  if (typeof name !== 'string' || !ICON_NAME.test(name)) return null;
  return h('span', { className: `icon ${extraClass}`.trim(), text: name, attrs: { 'aria-hidden': 'true' } });
}
