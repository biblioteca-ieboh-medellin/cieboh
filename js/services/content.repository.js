/**
 * Repositorio de contenido (patrón Repository).
 * Lee los JSON de /content y los entrega validados e inmutables.
 * Los renderizadores no saben de dónde viene el contenido: mañana podría venir de
 * un CMS o una API cambiando solo esta clase (Inversión de Dependencias).
 */

const SECTION_NAME = /^[a-z0-9-]+$/;

const deepFreeze = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

export class ContentRepository {
  /**
   * @param {string} baseUrl carpeta relativa, p. ej. "content/"
   * @param {{ maxBytes: number }} options
   * @param {typeof fetch} [fetchImpl]
   */
  constructor(baseUrl, { maxBytes }, fetchImpl = window.fetch.bind(window)) {
    this.baseUrl = baseUrl;
    this.maxBytes = maxBytes;
    this.fetch = fetchImpl;
  }

  /** @returns {Promise<Readonly<Record<string, unknown>>>} */
  async load(name) {
    if (!SECTION_NAME.test(name)) throw new Error(`Nombre de contenido inválido: ${name}`);

    const response = await this.fetch(`${this.baseUrl}${name}.json`, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`No se pudo cargar ${name}.json (HTTP ${response.status})`);

    const type = response.headers.get('content-type') ?? '';
    if (!type.includes('json')) throw new Error(`${name}.json no se sirvió como JSON`);

    const raw = await response.text();
    if (raw.length > this.maxBytes) throw new Error(`${name}.json supera el tamaño permitido`);

    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error(`${name}.json debe contener un objeto`);
    }
    return deepFreeze(data);
  }

  /**
   * Carga varios archivos en paralelo; un archivo dañado no impide mostrar los demás.
   * @returns {Promise<Map<string, { ok: true, data: object } | { ok: false, error: Error }>>}
   */
  async loadAll(names) {
    const results = await Promise.allSettled(names.map((name) => this.load(name)));
    return new Map(
      names.map((name, i) => [
        name,
        results[i].status === 'fulfilled' ? { ok: true, data: results[i].value } : { ok: false, error: results[i].reason },
      ]),
    );
  }
}
