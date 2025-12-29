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

  // Hazard stripe pattern defined as a constant to keep HTML clean
  const hazardPattern = `background-image: repeating-linear-gradient(45deg, #e5e5e5 0, #e5e5e5 1px, transparent 0, transparent 10px); background-size: 16px 16px;`;
</script>

<!-- 
  Neo-Brutalist List Container
  - h-fit: Grows with content
-->
<div
  class="flex h-fit w-full flex-col border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000]"
>
  <!-- Header -->
  <div
    class="flex items-center justify-between border-b-4 border-black bg-black px-4 py-3"
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
    The "Stage" Area 
    This is a wrapper div. It handles the BACKGROUND and the EMPTY STATE text.
    It does NOT handle the Drag and Drop logic.
  -->
  <div
    class="relative min-h-[300px] w-full bg-neutral-100"
    style={hazardPattern}
  >
    <!-- 
      Empty State Text (Visual Layer)
      - Positioned absolutely behind the DND zone.
      - Shows only when needed (controlled by #if).
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
      Drag and Drop Zone (Logic Layer)
      - Absolute or Relative on top of the background.
      - z-10: Ensures it sits ABOVE the empty text/background so clicks register.
      - min-h-full: Ensures the drop zone covers the whole visual area.
      - bg-transparent: Lets the parent's hazard pattern show through.
    -->
    <section
      class="relative z-10 grid min-h-[300px] w-full grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] place-items-center content-start gap-x-2 gap-y-4 p-4"
      use:dndzone={{ items, flipDurationMs }}
      onconsider={handleDndConsider}
      onfinalize={handleDndFinalize}
    >
      {#each items as item (item.id)}
        <div animate:flip={{ duration: flipDurationMs }}>
          <!-- Pass the item component. Note: The ItemCard handles its own 'group/card' hover logic -->
          <ItemCard {item} />
        </div>
      {/each}
    </section>
  </div>
</div>
