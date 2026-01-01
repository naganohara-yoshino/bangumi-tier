import pLimit from "p-limit";
import { fetchItemByIdentity } from "$lib/api/bgmFetchers.svelte";
import type { ItemData, ItemIdentity } from "$lib/schemas/item";

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

  // API 2: Take items, run through limiter, push to results
  async kickOff(batch = 20) {
    // 1. Grab work instantly (Synchronous state update)
    const targets = this.queue.splice(0, batch);
    if (targets.length === 0) return;

    // 2. Process work (Async with limits)
    const results = await Promise.all(
      targets.map((item) =>
        // Wrap the fetch logic in the limit function
        this.#limit(async () => ({
          id: `${item.category}:${item.bgm_id}`,
          ...item,
          ...(await fetchItemByIdentity(item)),
        })),
      ),
    );

    // 3. Output results (Synchronous state update)
    this.items.push(...(results as ItemData[]));
  }

  // API 4: Done when waiting line is empty
  isDone = $derived(this.queue.length === 0);
}

export const itemLoader = new BatchLoader();
