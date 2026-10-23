import { h } from './dom.js';

/**
 * Texto enriquecido mínimo y seguro para los JSON de contenido.
 * Un valor puede ser un string o un arreglo de segmentos:
 *   ["Texto normal ", { "strong": "negrita" }, { "em": "cursiva" }, { "accent": "resaltado" }]
 * Solo se admiten estas marcas; cualquier otra cosa se ignora (no hay HTML libre).
 */
const MARKS = Object.freeze({
  strong: (text) => h('strong', { text }),
  em: (text) => h('em', { text }),
  accent: (text) => h('em', { className: 'accent', text }),
});

/** @returns {Node[]} */
export function richText(value) {
  const parts = Array.isArray(value) ? value : [value];
  return parts.flatMap((part) => {
    if (typeof part === 'string' || typeof part === 'number') return [document.createTextNode(String(part))];
    if (part && typeof part === 'object') {
      const mark = Object.keys(MARKS).find((key) => typeof part[key] === 'string');
      if (mark) return [MARKS[mark](part[mark])];
    }
    return [];
  });
}
