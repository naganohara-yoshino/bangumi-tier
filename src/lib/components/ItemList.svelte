<script>
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import ItemCard from "$lib/components/ItemCard.svelte";

  let { items = $bindable(), title = "Inventory" } = $props();

  const flipDurationMs = 300;
  function handleDndConsider(e) {
    items = e.detail.items;
  }
  function handleDndFinalize(e) {
    items = e.detail.items;
  }

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
        {items.length} UNIT
      </span>
    </div>
  </div>

  <!-- 
    Scrollable Area
    - Removed 'scrollbar-brutal-bordered'
    - Uses 'scrollbar-brutal' for consistent floating thumb style
  -->
  <div
    class="scrollbar-brutal relative flex-1 min-h-0 w-full overflow-y-auto bg-background text-foreground/10"
    style={hazardPattern}
  >
    {#if items.length === 0}
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
    {/if}

    <section
      class="relative z-10 grid min-h-full w-full grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] place-items-center content-start gap-x-2 gap-y-4 p-4"
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
  </div>
</div>
