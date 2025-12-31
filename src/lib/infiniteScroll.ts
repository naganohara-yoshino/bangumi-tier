// createAggressiveScroll.ts
interface AggressiveOptions {
  root: HTMLElement;
  hasMore: boolean;
  rootMargin?: string;
}

export default function createAggressiveScroll(
  loadMoreFn: () => Promise<void> | void,
  options: AggressiveOptions,
) {
  const { root, hasMore, rootMargin = "0px 0px 200px 0px" } = options;

  return (element: HTMLElement) => {
    if (!root || !hasMore) return;

    let isIntersecting = false;
    let isActive = false; // lock
    let timer: ReturnType<typeof setTimeout> | null = null;
    let isDestroyed = false;

    const aggressiveLoop = async () => {
      if (isDestroyed || !isIntersecting || !hasMore) {
        isActive = false;
        return;
      }

      isActive = true;

      try {
        // 尝试加载
        await loadMoreFn();
      } catch (e) {}

      if (!isDestroyed && isIntersecting && hasMore) {
        timer = setTimeout(aggressiveLoop, 1000);
      } else {
        isActive = false;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = entry?.isIntersecting ?? false;

        if (isIntersecting) {
          if (!isActive) {
            if (timer) clearTimeout(timer);
            aggressiveLoop();
          }
        } else {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          isActive = false;
        }
      },
      {
        root,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      isDestroyed = true;
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  };
}
