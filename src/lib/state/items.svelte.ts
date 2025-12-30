// item-store.svelte.ts
import pLimit from "p-limit";
import { fetchItemById } from "$lib/api/bgmFetchers.svelte";
import type { Item } from "$lib/schemas/item";

export type ItemStatus =
  | { status: "pending" }
  | { status: "loading" }
  | { status: "loaded"; item: Item }
  | { status: "error"; error?: string };

class ItemStore {
  // --- Public State ---
  // Exposed publicly so external components can check specific ID statuses
  states = $state(new Map<string, ItemStatus>());

  // loaded Item Ids
  loadedItemIds = $state<string[]>([]);

  // --- Private State ---
  // Tracks active requests to prevent duplicate fetching
  #queue = $state(new Set<string>());

  // Tracks failure counts for auto-retry logic
  #retryCounts = new Map<string, number>();

  // Concurrency limiter
  #limit;

  // Configuration
  #maxRetries = 3;

  constructor(concurrency = 50) {
    this.#limit = pLimit(concurrency);
  }

  // --- Derived Properties ---

  // Global loading indicator
  isLoading = $derived(this.#queue.size > 0);

  // The main data list.
  // Maps the loadedItemIds to actual items, extra filtering out non-loaded states.
  loadedItems = $derived.by(() => {
    return this.loadedItemIds.flatMap((id) => {
      const s = this.states.get(id);
      return s?.status === "loaded" ? [s.item] : [];
    });
  });

  // Optional stats for debugging / dashboards
  stats = $derived.by(() => {
    let loaded = 0,
      errors = 0;
    for (const s of this.states.values()) {
      if (s.status === "loaded") loaded++;
      if (s.status === "error") errors++;
    }
    return { loaded, errors, total: this.states.size };
  });

  // If has more items to load
  hasMore = $derived(this.loadedItemIds.length < this.states.size);

  // --- Actions ---

  /**
   * Main entry point to load a list of IDs.
   * - Skips items that are already loaded or currently loading.
   * - Retries items in 'error' state ONLY IF they haven't exceeded max retries.
   */
  loadItems(ids: string[]) {
    const targets = ids.filter((id) => {
      const s = this.states.get(id);

      // 1. If never seen (undefined) or pending, load it.
      if (!s || s.status === "pending") return true;

      // 2. If it is an error, check if we can retry.
      if (s.status === "error") {
        const retries = this.#retryCounts.get(id) || 0;
        return retries < this.#maxRetries;
      }

      // 3. If loaded or loading, skip.
      return false;
    });

    for (const id of targets) {
      this.#processFetch(id);
    }
  }

  /**
   * Manually retry a specific item.
   * Resets the retry counter and forces a load.
   * Useful for "Retry" buttons in the UI.
   */
  retry(id: string) {
    this.#retryCounts.set(id, 0); // Reset counter
    this.#processFetch(id);
  }

  /**
   * Reset the entire store.
   */
  reset() {
    this.states.clear();
    this.#queue.clear();
    this.loadedItemIds = [];
    this.#retryCounts.clear();
    this.#limit.clearQueue();
  }

  // --- Private Implementation ---

  #processFetch(id: string) {
    // Defense: prevent duplicate requests in the queue
    if (this.#queue.has(id)) return;

    this.#queue.add(id);
    this.states.set(id, { status: "loading" });

    this.#limit(async () => {
      try {
        const data = await fetchItemById(id);

        if (data) {
          // Success
          this.states.set(id, { status: "loaded", item: data });
          this.#retryCounts.delete(id); // Clear error history on success

          if (!this.loadedItemIds.includes(id)) {
            this.loadedItemIds.push(id);
          }
        } else {
          // Soft failure (e.g. 404, valid response but empty)
          this.#handleError(id, "Not found");
        }
      } catch (err) {
        // Hard failure (network error, etc)
        this.#handleError(id, String(err));
      } finally {
        this.#queue.delete(id);
      }
    });
  }

  #handleError(id: string, message: string) {
    // Increment retry count
    const currentCount = this.#retryCounts.get(id) || 0;
    this.#retryCounts.set(id, currentCount + 1);

    this.states.set(id, { status: "error", error: message });
  }
}

export const itemStore = new ItemStore();
