/**
 * Utilidades DOM seguras.
 * Regla del proyecto: NUNCA usar innerHTML/outerHTML/insertAdjacentHTML con datos.
 * Todo el contenido dinámico se crea con createElement + textContent, lo que
 * neutraliza la inyección de HTML/JS (XSS) por construcción.
 */

export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/** Atributos que jamás se aceptan desde código dinámico (manejadores inline, etc.). */
const FORBIDDEN_ATTR = /^on|^style$|^srcdoc$/i;

/**
 * Fábrica de elementos (patrón Factory).
 * @param {string} tag
 * @param {{ className?: string, text?: string, attrs?: Record<string,string|number|boolean> }} [options]
 * @param {Array<Node|string|null|undefined|false>} [children]
 * @returns {HTMLElement}
 */
export function h(tag, options = {}, children = []) {
  const el = document.createElement(tag);
  const { className, text, attrs } = options;

  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = String(text);

  if (attrs) {
    Object.entries(attrs).forEach(([name, value]) => {
      if (FORBIDDEN_ATTR.test(name)) {
        throw new Error(`Atributo no permitido: ${name}`);
      }
      if (value === false || value === null || value === undefined) return;
      el.setAttribute(name, value === true ? '' : String(value));
    });
  }

  children.forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });

  return el;
}

/** Ícono decorativo de Material Symbols (oculto para lectores de pantalla). */
export const icon = (name, extraClass = '') =>
  h('span', { className: `icon ${extraClass}`.trim(), text: name, attrs: { 'aria-hidden': 'true' } });

/** Reemplaza todo el contenido de un nodo de forma segura. */
export const replaceChildren = (parent, ...nodes) => parent.replaceChildren(...nodes);
