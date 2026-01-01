import { QueryClient } from "@tanstack/svelte-query";
import pLimit from "p-limit";
import { fetchItemByIdentity } from "$lib/api/bgmFetchers.svelte";
import type { ItemData, ItemIdentity } from "$lib/schemas/item";

// ==========================================
// Configuration
// ==========================================
const CONCURRENCY_LIMIT = 50;
const BATCH_SIZE_DEFAULT = 30;

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes cache
      gcTime: 1000 * 60 * 60, // 1 hour memory retention
      retry: 1, // Retry failed network requests once
      refetchOnWindowFocus: false,
    },
  },
});

// ==========================================
// BatchLoader Class
// ==========================================

/**
 * Batch loader for BGM items with persistent caching.
 *
 * Usage:
 *   itemLoader.addItems(identities);
 *   await itemLoader.loadBatch(20); // Process 20 items
 *
 * Design notes:
 * - Items persist across navigation (call clear() to reset)
 * - Safe to call loadBatch() concurrently (order not guaranteed)
 * - TanStack Query handles dedup/caching automatically
 */
export class BatchLoader {
  // 1. Concurrency Control
  #limit = pLimit(CONCURRENCY_LIMIT);

  // 2. State: The Waiting Line
  queue = $state<ItemIdentity[]>([]);

  // 3. State: The Results (Strictly typed, valid data only)
  loadedItems = $state<ItemData[]>([]);

  /**
   * API 1: Add items to the queue.
   * Duplicate keys in the queue are handled by TanStack Query deduping,
   * but we trust the queue order for processing.
   */
  addItems(list: ItemIdentity[]) {
    this.queue.push(...list);
  }

  /**
   * API 2: Process a batch from the queue.
   * - Consumes items from the queue immediately (Sync).
   * - Fetches data with concurrency limits and caching (Async).
   * - Filters out failures silently (Robustness).
   * - Updates the results list (Sync).
   */
  async loadBatch(batch = BATCH_SIZE_DEFAULT) {
    // A. Synchronously claim work from the queue
    const targets = this.queue.splice(0, batch);
    if (targets.length === 0) return;

    // B. Process work in parallel (limited by p-limit)
    const results = await Promise.all(
      targets.map((item) =>
        this.#limit(async () => {
          try {
            // TanStack Query handles Cache, Deduping, and Retries here
            const data = await client.fetchQuery({
              queryKey: ["item", item.category, item.bgm_id],
              queryFn: () => fetchItemByIdentity(item),
            });

            // Return clean ItemData
            return {
              id: `${item.category}:${item.bgm_id}`,
              ...item,
              ...data,
            };
          } catch (error) {
            // Gracefully handle failure
            console.warn(`[BatchLoader] Failed: ${item.bgm_id}`, error);
            return undefined;
          }
        }),
      ),
    );

    // C. Filter garbage and update UI state
    const validItems = results.filter((i) => i !== undefined) as ItemData[];
    this.loadedItems.push(...validItems);
  }

  /**
   * API 3: Completion Status
   */
  isDone = $derived(this.queue.length === 0);

  /**
   * Helper: Reset everything (e.g., when navigating away)
   */
  clear() {
    this.queue = [];
    this.loadedItems = [];
    // Note: We deliberately do NOT clear the QueryClient cache,
    // so if the user comes back, it loads instantly.
  }
}

// Export Singleton
export const itemLoader = new BatchLoader();
