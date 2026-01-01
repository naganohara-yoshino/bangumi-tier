import { QueryClient } from "@tanstack/svelte-query";
import pLimit from "p-limit";
import { fetchItemByIdentity } from "$lib/api/bgmFetchers.svelte";
import type { ItemData, ItemIdentity } from "$lib/schemas/item";

// 1. Setup the Client (Singleton)
// We set a long staleTime because metadata rarely changes rapidly.
const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes cache
      gcTime: 1000 * 60 * 60, // Keep unused data in memory for 1 hour
    },
  },
});

export class BatchLoader {
  // 0. The Safety Valve (Max 50 concurrent requests)
  #limit = pLimit(50);

  // 1. The waiting line
  queue = $state<ItemIdentity[]>([]);

  // 2. The finished results
  items = $state<ItemData[]>([]);

  // API 1: Dump items into the waiting line
  addItems(list: ItemIdentity[]) {
    this.queue.push(...list);
  }

  // API 2: Take items, run through limiter + Cache, push to results
  async kickOff(batch = 20) {
    // 1. Grab work instantly
    const targets = this.queue.splice(0, batch);
    if (targets.length === 0) return;

    // 2. Process work (Async with limits + Cache)
    const results = await Promise.all(
      targets.map((item) =>
        this.#limit(async () => {
          // ---  Use TanStack Query ---
          const data = await client.fetchQuery({
            // Unique key for caching: ['item', 'person', 123]
            queryKey: ["item", item.category, item.bgm_id],
            // The actual fetcher
            queryFn: () => fetchItemByIdentity(item),
          });

          return {
            id: `${item.category}:${item.bgm_id}`,
            ...item,
            ...data,
          };
        }),
      ),
    );

    // 3. Output results
    this.items.push(...(results as ItemData[]));
  }

  // API 4: Done when waiting line is empty
  isDone = $derived(this.queue.length === 0);
}

export const itemLoader = new BatchLoader();
