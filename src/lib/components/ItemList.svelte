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

  // Hazard stripe pattern
  const hazardPattern = `background-image: repeating-linear-gradient(45deg, #e5e5e5 0, #e5e5e5 1px, transparent 0, transparent 10px); background-size: 16px 16px;`;
</script>

<!-- 
  Neo-Brutalist List Container
  - h-full: Fills the parent container (Ensure parent has a fixed height!)
  - flex flex-col: Allows header to stay fixed while body grows/shrinks.
-->
<div
  class="flex h-full w-full flex-col border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000]"
>
  <!-- 
    Header 
    - shrink-0: Prevents header from collapsing when list gets huge.
  -->
  <div
    class="flex shrink-0 items-center justify-between border-b-4 border-black bg-black px-4 py-3"
  >
    <h3
      class="font-mono text-2xl font-black uppercase tracking-tighter text-white"
    >
      {title}
    </h3>
    <span class="font-mono text-xs font-bold text-white/70">
      {items.length} ITEMS
    </span>
  </div>

  <!-- 
    The "Stage" Area (Scrollable Wrapper)
    - flex-1: Takes up all remaining vertical space.
    - overflow-y-auto: Enables scrolling when items overflow.
    - min-h-0: Crucial CSS hack for nested flex scrolling.
    - custom-scrollbar: See style block below.
  -->
  <div
    class="custom-scrollbar relative flex-1 min-h-0 w-full overflow-y-auto bg-neutral-100"
    style={hazardPattern}
  >
    <!-- 
       Empty State Text (Visual)
       - Centered absolutely. 
       - Since it's only visible when items.length === 0, scrolling isn't an issue here.
    -->
    {#if items.length === 0}
      <div
        class="absolute inset-0 z-0 flex flex-col items-center justify-center opacity-40"
      >
        <span class="font-mono text-3xl font-black uppercase text-black"
          >EMPTY</span
        >
        <span class="font-mono text-xs font-bold uppercase text-black"
          >Drag items here</span
        >
      </div>
    {/if}

    <!-- 
      Drag and Drop Zone (Logic)
      - min-h-full: Ensures the zone covers the scroll area even if few items exist.
    -->
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

<!-- Inside ItemList.svelte -->

<div
  class="custom-scrollbar relative flex-1 min-h-0 w-full overflow-y-auto bg-neutral-100"
  style={hazardPattern}
>
  <!-- Content... -->
</div>

<style>
  /* 
    Neo-Brutalist "Floating Brick" Scrollbar 
    Context: Main Page (Gray Background)
  */
  .custom-scrollbar::-webkit-scrollbar {
    width: 20px; /* Wide and chunky */
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent; /* Lets the grid pattern show through */
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #000000;

    /* This creates the transparent gap around the thumb */
    border: 5px solid transparent;
    background-clip: content-box;

    /* Brutalist: Sharp corners */
    border-radius: 0px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #333333;
  }
</style>
