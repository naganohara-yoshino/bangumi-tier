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
// 2. 自定义错误类
// ==========================================
class ItemNotFoundError extends Error {
  constructor(message: string = "Not Found") {
    super(message);
    this.name = "ItemNotFoundError";
  }
}

// ==========================================
// 3. 辅助函数
// ==========================================
function generateKey(identity: ItemIdentity): string {
  // 对应 API 中的 `subject:123` 格式
  return `${identity.category}:${identity.bgm_id}`;
}

// ==========================================
// 4. 核心类 BatchLoader
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

  // 5. 加载锁 (防止并发调用 kickOff)
  #isKicking = false;

  #queryClient: QueryClient;
  #limit: ReturnType<typeof pLimit>;

  constructor(queryClient: QueryClient, concurrency: number = 10) {
    this.#queryClient = queryClient;
    this.#limit = pLimit(concurrency);
  }

  // API 1: 添加
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

  // API 2: 触发加载 (修复: 使用 Promise.all + 加载锁)
  async kickOff(batchSize: number = 20) {
    // 防止并发调用
    if (this.#isKicking) return;
    if (this.#waitingQueue.length === 0) return;

    this.#isKicking = true;

    try {
      // 从队列头部取出
      const keysToLoad = this.#waitingQueue.splice(0, batchSize);
      this.#pendingCount += keysToLoad.length;

      // 修复: 使用 Promise.all 替代 forEach
      await Promise.all(
        keysToLoad.map(async (key) => {
          const entry = this.#itemMap.get(key);

          // 防御性检查
          if (!entry) {
            this.#pendingCount--;
            return;
          }

          const { identity } = entry;

          // 标记 Loading
          this.#itemMap.set(key, { ...entry, status: "loading" });

          try {
            const result = await this.#limit(() =>
              this.#queryClient.fetchQuery({
                // QueryKey 保持原子性，方便其他地方复用
                queryKey: ["item", identity.category, identity.bgm_id],
                queryFn: async () => {
                  const data = await fetchItemByIdentity(identity);
                  if (!data) throw new ItemNotFoundError();
                  return data;
                },
                staleTime: 1000 * 60 * 10, // 10分钟缓存
                retry: (failCount, err) => {
                  // 404 不重试 (使用自定义错误类判断)
                  if (err instanceof ItemNotFoundError) return false;
                  return failCount < 3;
                },
              }),
            );

            // 成功
            this.#itemMap.set(key, {
              ...entry,
              status: "success",
              data: result,
            });
          } catch (err) {
            // 失败 (使用自定义错误类判断)
            const isNotFound = err instanceof ItemNotFoundError;
            this.#itemMap.set(key, {
              ...entry,
              status: isNotFound ? "not-found" : "error",
              error: err,
            });
          } finally {
            this.#pendingCount--;
          }
        }),
      );
    } finally {
      this.#isKicking = false;
    }
  }

  // API 3: 获取混合列表 (用于 UI 渲染)
  items = $derived(
    this.#orderedKeys.map((key) => {
      const item = this.#itemMap.get(key)!;
      return {
        // 关键点：即使 data 为空，id 必须存在，否则 DnD 库会报错
        // 这里的 key (e.g. "subject:123") 和 API 返回的 item.data.id 是一致的
        id: key,

        ...item.identity, // 提供 bgm_id, category
        ...item.data, // 提供 name, image (成功时覆盖上面的 id，值一样)

        status: item.status,
        error: item.error,
      };
    }),
  );

  // 辅助: 仅获取成功的数据
  loadedItems = $derived(
    this.#orderedKeys
      .map((key) => this.#itemMap.get(key)!)
      .filter((i) => i.status === "success")
      .map((i) => i.data!),
  );

  // API 4: 完成状态
  isDone = $derived(
    this.#waitingQueue.length === 0 && this.#pendingCount === 0,
  );

  hasMore = $derived(this.#waitingQueue.length > 0);

  // 新增: 清理方法 (用于重置或内存管理)
  clear() {
    this.#orderedKeys = [];
    this.#itemMap.clear();
    this.#waitingQueue = [];
    this.#pendingCount = 0;
    this.#isKicking = false;
  }

  // 新增: 移除指定项 (用于动态管理列表)
  removeItem(identity: ItemIdentity) {
    const key = generateKey(identity);

    // 从有序列表中移除
    const index = this.#orderedKeys.indexOf(key);
    if (index > -1) {
      this.#orderedKeys.splice(index, 1);
    }

    // 从状态池中移除
    this.#itemMap.delete(key);

    // 从等待队列中移除
    const queueIndex = this.#waitingQueue.indexOf(key);
    if (queueIndex > -1) {
      this.#waitingQueue.splice(queueIndex, 1);
    }
  }

  // 新增: 获取统计信息 (用于调试和监控)
  getStats() {
    const stats = {
      total: this.#orderedKeys.length,
      idle: 0,
      loading: 0,
      success: 0,
      error: 0,
      notFound: 0,
      pending: this.#pendingCount,
      waiting: this.#waitingQueue.length,
    };

    for (const key of this.#orderedKeys) {
      const item = this.#itemMap.get(key);
      if (item) {
        switch (item.status) {
          case "idle":
            stats.idle++;
            break;
          case "loading":
            stats.loading++;
            break;
          case "success":
            stats.success++;
            break;
          case "error":
            stats.error++;
            break;
          case "not-found":
            stats.notFound++;
            break;
        }
      }
    }

    return stats;
  }
}

// ==========================================
// 5. 实例化并导出 (单例模式)
// ==========================================

// 创建专用的 QueryClient
// defaultOptions.queries.enabled: false 非常重要
// 这确保了 TanStack 不会在我们创建 fetchQuery 时自动尝试去挂载或立即执行（虽然 fetchQuery 本身是命令式的）
const client = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: false,
      gcTime: 1000 * 60 * 60, // 1小时不用的缓存才回收
    },
  },
});

/**
 * 导出单例
 * 使用 `const` 确保 itemLoader 的引用不会被修改
 * 我们只需要修改它内部的 state
 */
export const itemLoader = new BatchLoader(client, 10);
