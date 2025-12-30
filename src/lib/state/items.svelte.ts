import pLimit from "p-limit";
import { fetchItemById } from "$lib/api/fetchers.svelte";
import type { Item } from "$lib/schemas/item";

export type ItemStatus =
  | { status: "pending" }
  | { status: "loading" }
  | { status: "loaded"; item: Item }
  | { status: "error" };

class ItemStore {
  // --- STATE ---
  itemStates = $state(new Map<string, ItemStatus>());
  loadingQueue = $state(new Set<string>());
  loadedOrder = $state<string[]>([]);

  #limit;

  constructor(concurrency = 50) {
    this.#limit = pLimit(concurrency);
  }

  // --- DERIVED PROPERTIES

  isLoading = $derived(this.loadingQueue.size > 0);

  stats = $derived.by(() => {
    let loaded = 0;
    let errors = 0;
    let pending = 0;

    for (const status of this.itemStates.values()) {
      if (status.status === "loaded") {
        loaded++;
      } else if (status.status === "error") {
        errors++;
      } else {
        pending++;
      }
    }

    return { loaded, errors, pending, total: this.itemStates.size };
  });

  allLoadedItems = $derived.by(() => {
    return this.loadedOrder.flatMap((id) => {
      const state = this.itemStates.get(id);
      if (state?.status === "loaded") {
        return [state.item];
      }
      return [];
    });
  });

  // --- METHODS (Must stay functions because they take arguments) ---

  // You cannot make this a $derived property because it needs 'id'
  getItemState(id: string): ItemStatus {
    return this.itemStates.get(id) ?? { status: "pending" };
  }

  /**
   * Returns the Item objects for the provided list of IDs,
   * maintaining the order of the input IDs.
   * Only includes items that are fully loaded.
   */
  getItemsLoadedInList(ids: string[]): Item[] {
    return ids.flatMap((id) => {
      const state = this.itemStates.get(id);

      if (state?.status === "loaded") {
        return [state.item];
      }
      return [];
    });
  }

  // --- ACTIONS ---

  /**
   * Ensures all provided IDs are loaded.
   * Concurrency is handled automatically by the internal p-limit queue.
   */
  makeItemsToload(targetIds: string[]) {
    const toLoad = targetIds.filter((id) => {
      const state = this.itemStates.get(id);

      return !state || state.status === "pending";
    });

    for (const id of toLoad) {
      this.#queueFetch(id);
    }
  }

  #queueFetch(id: string) {
    if (
      this.loadingQueue.has(id) ||
      this.itemStates.get(id)?.status === "loaded"
    ) {
      return;
    }

    this.loadingQueue.add(id);
    this.itemStates.set(id, { status: "loading" });

    this.#limit(() => fetchItemById(id))
      .then((item) => {
        if (item) {
          this.itemStates.set(id, { status: "loaded", item });
          if (!this.loadedOrder.includes(id)) {
            this.loadedOrder.push(id);
          }
        } else {
          this.itemStates.set(id, { status: "error" });
        }
      })
      .finally(() => {
        this.loadingQueue.delete(id);
      });
  }
}

export const itemStore = new ItemStore();
