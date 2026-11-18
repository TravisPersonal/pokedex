export type CacheEntry<T> = {
  createdAT: number,
  val: T,
};

export class Cache {
  #cache = new Map<string, CacheEntry<unknown>>();
  #interval: number;
  #reapIntervalId: NodeJS.Timeout | undefined;

  constructor(interval: number) {
    this.#interval = interval;
    this.#startReapLoop();
  }

  #reap() {
    const cutoff = Date.now() - this.#interval;
    for (const [key, entry] of this.#cache) {
      if (entry.createdAT < cutoff) {
        this.#cache.delete(key);
      }
    }
  }

  #startReapLoop() {
    this.#reapIntervalId = setInterval(() => this.#reap(), this.#interval);
  }

  stopReapLoop() {
    clearInterval(this.#reapIntervalId);
    this.#reapIntervalId = undefined;
  }

  add<T>(key: string, val: T) {
    this.#cache.set(key, { createdAT: Date.now(), val });
  }

  get<T>(key: string): T | undefined {
    const entry = this.#cache.get(key);
    return entry?.val as T | undefined;
  }


}
