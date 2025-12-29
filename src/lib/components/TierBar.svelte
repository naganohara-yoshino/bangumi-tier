<script>
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import ItemCard from "$lib/components/ItemCard.svelte";

  let {
    items = $bindable(),
    title = "A",
    color = "#4287f5", // Default blue
  } = $props();

  const flipDurationMs = 300;

  function handleDndConsider(e) {
    items = e.detail.items;
  }

  function handleDndFinalize(e) {
    items = e.detail.items;
  }

  // Blueprint Dot Pattern
  const blueprintPattern = `background-image: radial-gradient(#000 1px, transparent 1px); background-size: 16px 16px;`;
</script>

<!-- 
  Neo-Brutalist Container 
-->
<div
  class="group mb-2.5 flex w-full border-4 border-black bg-white shadow-[5px_5px_0px_0px_#000] transition-shadow duration-200 hover:shadow-[5px_5px_0px_0px_var(--tier-color)]"
  style="--tier-color: {color}"
>
  <!-- 
    Left: Title Area 
  -->
  <div
    class="flex w-24 shrink-0 flex-col items-center justify-center border-r-4 border-black px-4 py-2 sm:w-32"
    style="background-color: {color};"
  >
    <h2
      class="wrap-break-word text-center font-mono text-4xl font-black uppercase leading-tight tracking-tighter text-black sm:text-5xl"
    >
      {title}
    </h2>
  </div>

  <!-- 
    Right: Visual Wrapper 
    - This holds the background and empty state.
    - It is NOT the dndzone itself.
    - flex-1: Takes up remaining width.
    - min-h-32: Ensures there is always height even if empty.
  -->
  <div class="relative min-h-32 flex-1 bg-neutral-100">
    <!-- 1. Background Pattern (Visual Layer) -->
    <div
      class="pointer-events-none absolute inset-0 opacity-10"
      style={blueprintPattern}
    ></div>

    <!-- 2. Empty State Placeholder (Visual Layer) -->
    {#if items.length === 0}
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20"
      >
        <span class="font-mono text-xl font-bold uppercase text-black">
          Drop Here
        </span>
      </div>
    {/if}

    <!-- 
        3. Drop Zone (Logic Layer)
        - relative z-10: Sits ON TOP of the pattern/text.
        - min-h-full: Stretches to cover the wrapper.
        - bg-transparent: Lets the wrapper's background show through.
      -->
    <section
      class="relative z-10 flex min-h-full w-full flex-wrap content-start items-start gap-2 p-2 bg-transparent"
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
