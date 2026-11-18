import { expect, test } from "vitest";
import { Cache } from "./pokecache.js";

test("constructor starts the reap loop and removes entries older than the interval", async () => {
  const cache = new Cache(50);

  try {
    cache.add("key", "value");
    expect(cache.get("key")).toBe("value");

    await expect
      .poll(() => cache.get("key"), { timeout: 1000, interval: 20 })
      .toBeUndefined();
  } finally {
    cache.stopReapLoop();
  }
});

test("entries newer than the interval are kept", async () => {
  const cache = new Cache(10_000);

  try {
    cache.add("key", 42);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(cache.get("key")).toBe(42);
  } finally {
    cache.stopReapLoop();
  }
});
