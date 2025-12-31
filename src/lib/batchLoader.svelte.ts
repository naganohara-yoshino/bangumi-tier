import { QueryClient } from "@tanstack/svelte-query";
import pLimit from "p-limit";
import { fetchItemByIdentity } from "$lib/api/bgmFetchers.svelte";
import type { ItemData, ItemIdentity } from "$lib/schemas/item";

// ==========================================
// 1. 类型定义
// ==========================================
export type ItemState = {
  status: "idle" | "loading" | "success" | "error" | "not-found";
  identity: ItemIdentity;
  data?: ItemData;
  error?: unknown;
};

// ==========================================
// 2. 辅助函数
// ==========================================
function generateKey(identity: ItemIdentity): string {
  return `${identity.category}:${identity.id}`;
}

// ==========================================
// 3. 核心类 BatchLoader
// ==========================================
export class BatchLoader {
  // 1. 有序 Key 清单 (保证 UI 顺序)
  #orderedKeys = $state<string[]>([]);

  // 2. 状态池 (Key -> State)
  #itemMap = $state(new Map<string, ItemState>());

  // 3. 等待队列
  #waitingQueue = $state<string[]>([]);

  // 4. 挂起计数
  #pendingCount = $state(0);

  #queryClient: QueryClient;
  #limit: ReturnType<typeof pLimit>;

  constructor(queryClient: QueryClient, concurrency: number = 10) {
    this.#queryClient = queryClient;
    this.#limit = pLimit(concurrency);
  }

  addItems(identities: ItemIdentity[]) {
    for (const identity of identities) {
      const key = generateKey(identity);
      if (!this.#itemMap.has(key)) {
        this.#itemMap.set(key, {
          status: "idle",
          identity: identity,
        });
        this.#orderedKeys.push(key);
        this.#waitingQueue.push(key);
      }
    }
  }

  async kickOff(batchSize: number = 20) {
    if (this.#waitingQueue.length === 0) return;

    const keysToLoad = this.#waitingQueue.splice(0, batchSize);
    this.#pendingCount += keysToLoad.length;

    keysToLoad.forEach(async (key) => {
      const entry = this.#itemMap.get(key)!;
      const { identity } = entry;

      this.#itemMap.set(key, { ...entry, status: "loading" });

      try {
        const result = await this.#limit(() =>
          this.#queryClient.fetchQuery({
            queryKey: ["item", identity.category, identity.id],
            queryFn: async () => {
              const data = await fetchItemByIdentity(identity);
              if (!data) throw new Error("Not Found");
              return data;
            },
            staleTime: 1000 * 60 * 10,
            retry: (failCount, err) => {
              if (err instanceof Error && err.message === "Not Found")
                return false;
              return failCount < 3;
            },
          }),
        );
        this.#itemMap.set(key, { ...entry, status: "success", data: result });
      } catch (err) {
        const isNotFound = err instanceof Error && err.message === "Not Found";
        this.#itemMap.set(key, {
          ...entry,
          status: isNotFound ? "not-found" : "error",
          error: err,
        });
      } finally {
        this.#pendingCount--;
      }
    });
  }

  items = $derived(
    this.#orderedKeys.map((key) => {
      const item = this.#itemMap.get(key)!;
      return {
        key,
        ...item.identity, // 方便 UI 获取 id/category
        ...item.data, // 方便 UI 获取 name/image
        status: item.status,
        error: item.error,
      };
    }),
  );

  loadedItems = $derived(
    this.#orderedKeys
      .map((key) => this.#itemMap.get(key)!)
      .filter((i) => i.status === "success")
      .map((i) => i.data!),
  );

  isDone = $derived(
    this.#waitingQueue.length === 0 && this.#pendingCount === 0,
  );

  hasMore = $derived(this.#waitingQueue.length > 0);
}

// ==========================================
// 4. 实例化并导出 (单例模式)
// ==========================================

const client = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: false,
    },
  },
});

// 导出单例
export const itemLoader = new BatchLoader(client, 10);
