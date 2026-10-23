/**
 * Interpolación de etiquetas: "Hay {enrolled} cupos" + { enrolled: 92 } → "Hay 92 cupos".
 * El resultado es texto plano (se muestra con textContent); las claves desconocidas se dejan intactas.
 */
export function format(template, values = {}) {
  return String(template ?? '').replace(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  );
}
