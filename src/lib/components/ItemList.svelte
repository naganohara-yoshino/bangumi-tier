<script lang="ts">
  import createAggressiveScroll from "$lib/infiniteScroll";
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import ItemCard from "$lib/components/ItemCard.svelte";
  import type { Item } from "$lib/schemas/item";

  let {
    items = $bindable(),
    title = "Collection",
    isGoingToLoad = false,
    loadMore = async () => {},
    total,
  }: {
    items: Item[];
    title?: string;
    isGoingToLoad: boolean;
    loadMore: () => void | Promise<void>;
    total?: number;
  } = $props();

  const flipDurationMs = 300;

  // DND Handlers
  function handleDndConsider(e) {
    items = e.detail.items;
  }
  function handleDndFinalize(e) {
    items = e.detail.items;
  }

  let scrollContainer: HTMLElement | undefined = $state();

  const hazardPattern = `background-image: repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 10px); background-size: 16px 16px;`;
</script>

<div
  class="flex h-full w-full flex-col border-4 border-border bg-card shadow-[8px_8px_0px_0px_var(--color-border)]"
>
  <!-- Header -->
  <div
    class="flex shrink-0 items-center justify-between border-b-4 border-border bg-primary px-4 py-3 text-primary-foreground"
  >
    <h3 class="font-mono text-2xl font-black uppercase tracking-tighter">
      {title}
    </h3>
    <div class="flex items-center gap-2">
      <div class="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
      <span class="font-mono text-xs font-bold opacity-80">
        {#if total !== undefined}{total}{:else}{items.length}{/if}
        INSIDE
      </span>
    </div>
  </div>

  <!-- 
    Scrollable Area
    - bound to scrollContainer for IntersectionObserver
  -->
  <div
    bind:this={scrollContainer}
    class="scrollbar-brutal relative flex-1 min-h-0 w-full overflow-y-auto bg-background text-foreground/10"
    style={hazardPattern}
  >
    {#if items.length === 0}
      {#if !isGoingToLoad}
        <div
          class="absolute inset-0 z-0 flex flex-col items-center justify-center opacity-60"
        >
          <span class="font-mono text-4xl font-black uppercase text-foreground"
            >EMPTY</span
          >
          <span
            class="mt-2 bg-foreground px-2 text-xs font-bold uppercase text-background"
          >
            System Standby
          </span>
        </div>
      {:else}
        <div
          class="absolute inset-0 z-0 flex flex-col items-center justify-center opacity-60"
        >
          <div class="flex items-center justify-center gap-3">
            <span
              class="font-mono text-4xl font-black uppercase text-foreground"
            >
              LOADING
            </span>

            <span
              class="icon-[line-md--loading-twotone-loop] text-4xl text-foreground"
            ></span>
          </div>

          <span
            class="mt-2 bg-foreground px-2 text-xs font-bold uppercase text-background"
          >
            Please Wait
          </span>
        </div>
      {/if}
    {/if}

    <section
      class="relative z-10 grid min-h-[100px] w-full grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] place-items-center content-start gap-x-2 gap-y-4 p-4"
      use:dndzone={{ items, flipDurationMs }}
      onconsider={handleDndConsider}
      onfinalize={handleDndFinalize}
    >
      {#each items as item (item.id)}
        <div animate:flip={{ duration: flipDurationMs }}>
          <ItemCard {item} />
        </div>
      {/each}
    </section>

    <!-- 
      Neo-Brutalist Sentinel (The Inconspicuous Loader)
      - Appears at the bottom of the scroll list
      - Style: Terminal/System log style, low opacity
    -->

    <div
      {@attach createAggressiveScroll(loadMore, {
        root: scrollContainer,
        isGoingToLoad,
      })}
      class="relative z-10 flex w-full flex-col items-center justify-center py-6 gap-1 opacity-50 select-none"
    >
      {#if items.length > 0}
        {#if !isGoingToLoad}
          <!-- End of List: Static System Message -->
          <div
            class="flex items-center gap-2 text-foreground/40 font-mono text-[10px] font-bold tracking-widest uppercase"
          >
            <span>//</span>
            <span>END_OF_STREAM</span>
            <span>//</span>
          </div>
        {:else}
          <!-- Loading State: Blinking Underscore Cursor -->
          <div
            class="flex items-center gap-2 text-foreground font-mono text-[10px] font-bold tracking-widest uppercase"
          >
            <span>[</span>
            <span>FETCHING_DATA</span>
            <span class="icon-[line-md--loading-twotone-loop]"></span>
            <span>]</span>
          </div>{/if}
      {/if}
    </div>
  </div>
</div>
