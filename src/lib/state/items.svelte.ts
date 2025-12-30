// items.svelte.ts
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
  states = $state(new Map<string, ItemStatus>());
  loadedItemIds = $state<string[]>([]);

  // Using a Set serves two purposes:
  // 1. O(1) lookups to prevent duplicates when adding.
  // 2. JS Sets maintain insertion order, so it acts as a FIFO queue automatically.
  pendingIds = $state(new Set<string>());

  // --- Private State ---

  // Tracks items currently in flight
  #activeRequests = $state(new Set<string>());

  #maxRetries = 3;

  #retryCounts = new Map<string, number>();

  #limit;

  constructor(concurrency = 50) {
    this.#limit = pLimit(concurrency);
  }

  // --- Derived Properties ---

  isLoading = $derived(this.#activeRequests.size > 0);

  pendingCount = $derived(this.pendingIds.size);

  loadedItems = $derived.by(() => {
    return this.loadedItemIds.flatMap((id) => {
      const s = this.states.get(id);
      return s?.status === "loaded" ? [s.item] : [];
    });
  });

  stats = $derived.by(() => {
    let loaded = 0,
      errors = 0,
      pending = 0;
    for (const s of this.states.values()) {
      if (s.status === "loaded") loaded++;
      if (s.status === "error") errors++;
      if (s.status === "pending") pending++;
    }
    return { loaded, errors, pending, total: this.states.size };
  });

  isCompletelyLoaded = $derived(
    this.states.size > 0 && this.loadedItemIds.length === this.states.size,
  );

  // --- Actions ---

  /**
   * Add IDs to the pending Set.
   * - Automatically handles deduplication (Set property).
   * - Resets error counts if re-adding an item that previously failed.
   */
  addToPending(ids: string[]) {
    for (const id of ids) {
      const s = this.states.get(id);

      // We process if:
      // 1. It's completely new (!s)
      // 2. It was an error (retry strategy)
      // 3. It's already pending (we might just want to ensure it's in the Set, Set.add is safe)
      const isNew = !s;
      const isError = s?.status === "error";
      const isPending = s?.status === "pending";

      if (isNew || isError || isPending) {
        if (isError) {
          this.#retryCounts.delete(id); // Reset retry on manual add
        }

        // Update visual status
        if (!isPending) {
          this.states.set(id, { status: "pending" });
        }

        // Add to Set
        this.pendingIds.add(id);
      }
    }
  }

  /**
   * Process a batch of items from the pending Set.
   * Takes the first N items (FIFO) from the Set and processes them.
   */
  processPending(batchSize = 30) {
    if (this.pendingIds.size === 0) return;

    const batch: string[] = [];

    // Iterate over the Set. Since JS Sets preserve insertion order,
    // this effectively acts like shifting from a Queue.
    for (const id of this.pendingIds) {
      batch.push(id);
      if (batch.length >= batchSize) break;
    }

    // Remove the selected items from the pending set
    for (const id of batch) {
      this.pendingIds.delete(id);
    }

    // Process this batch
    this.loadItems(batch);
  }

  /**
   * Immediate load for specific IDs.
   */
  loadItems(ids: string[]) {
    const targets = ids.filter((id) => {
      const s = this.states.get(id);

      // If active, skip
      if (this.#activeRequests.has(id)) return false;

      // If pending, allow
      if (!s || s.status === "pending") return true;

      // If error, check retries
      if (s.status === "error") {
        const retries = this.#retryCounts.get(id) || 0;
        return retries < this.#maxRetries;
      }

      return false;
    });

    for (const id of targets) {
      // Ensure we remove it from pendingIds if it was triggered directly via loadItems
      // (e.g. if user clicked a specific item that was waiting in the pending queue)
      if (this.pendingIds.has(id)) {
        this.pendingIds.delete(id);
      }
      this.#processFetch(id);
    }
  }

  retry(id: string) {
    this.#retryCounts.set(id, 0);
    this.pendingIds.delete(id); // Ensure not double queued
    this.#processFetch(id);
  }

  reset() {
    this.states.clear();
    this.#activeRequests.clear();
    this.loadedItemIds = [];
    this.pendingIds.clear();
    this.#retryCounts.clear();
    this.#limit.clearQueue();
  }

  // --- Private Implementation ---

  #processFetch(id: string) {
    if (this.#activeRequests.has(id)) return;

    this.#activeRequests.add(id);
    this.states.set(id, { status: "loading" });

    this.#limit(async () => {
      try {
        const data = await fetchItemById(id);

        if (data) {
          this.states.set(id, { status: "loaded", item: data });
          this.#retryCounts.delete(id);
          if (!this.loadedItemIds.includes(id)) {
            this.loadedItemIds.push(id);
          }
        } else {
          this.#handleError(id, "Not found");
        }
      } catch (err) {
        this.#handleError(id, String(err));
      } finally {
        this.#activeRequests.delete(id);
      }
    });
  }

  #handleError(id: string, message: string) {
    const currentCount = this.#retryCounts.get(id) || 0;
    this.#retryCounts.set(id, currentCount + 1);
    this.states.set(id, { status: "error", error: message });
  }
}

export const itemsUnrankedStore = new ItemStore();
