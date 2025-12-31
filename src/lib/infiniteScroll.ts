interface AggressiveScrollOptions {
  root: HTMLElement;
  hasMore: boolean;
  rootMargin?: string;
  retryDelay?: number;
  loadTimeout?: number;
}

export default function createAggressiveScroll(
  loadMoreFn: () => Promise<void> | void,
  options: AggressiveScrollOptions,
): (element: HTMLElement) => (() => void) | undefined {
  const {
    root,
    hasMore,
    rootMargin = "0px 0px 200px 0px",
    retryDelay = 1000,
    loadTimeout = 30000,
  } = options;

  return (element: HTMLElement) => {
    if (!root || !hasMore) return;

    let isIntersecting = false;
    let isActive = false; // lock
    let timer: ReturnType<typeof setTimeout> | undefined;
    let isDestroyed = false;

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    };

    const aggressiveLoop = async () => {
      if (isDestroyed || !isIntersecting || !hasMore) {
        isActive = false;
        return;
      }

      isActive = true;

      try {
        // Add timeout to loadMoreFn
        const timeoutPromise = new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error("Load timeout")), loadTimeout);
        });

        await Promise.race([Promise.resolve(loadMoreFn()), timeoutPromise]);
      } catch (e) {
        console.error("Aggressive scroll error:", e);
      }

      if (!isDestroyed && isIntersecting && hasMore) {
        timer = setTimeout(aggressiveLoop, retryDelay);
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
            clearTimer();
            aggressiveLoop();
          }
        } else {
          clearTimer();
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
      clearTimer();
    };
  };
}
