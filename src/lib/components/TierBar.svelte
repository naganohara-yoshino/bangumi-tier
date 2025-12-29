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
</script>

<!-- 
  Neo-Brutalist Container 
  - border-4 border-black: Thick outlines.
  - shadow-[6px_6px_0px_0px_#000]: Hard black shadow by default.
  - hover:shadow-[...var(--tier-color)]: Switches shadow color on hover.
  - transition-shadow duration-200: Smooths the color swap slightly (remove if you want it instant).
  - style="--tier-color: {color}": Passes the color prop to CSS for the hover state.
-->
<div
  class="group mb-2.5 flex w-full border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_var(--tier-color)] transition-shadow duration-200"
  style="--tier-color: {color}"
>
  <!-- 
    Left: Title Area 
    - Takes the 'color' prop for background.
    - Thick right border acts as a divider.
  -->
  <div
    class="flex w-24 shrink-0 flex-col items-center justify-center border-r-4 border-black py-2 px-4 sm:w-32"
    style="background-color: {color};"
  >
    <h2
      class="wrap-break-word text-center font-mono text-4xl font-black uppercase leading-tight tracking-tighter text-black sm:text-5xl"
    >
      {title}
    </h2>
  </div>

  <!-- 
    Right: Item Area (Drop Zone)
    - Gritty off-white background.
    - Pattern overlay for texture.
  -->
  <section
    class="relative flex min-h-32 flex-1 flex-wrap content-start items-start gap-2 bg-neutral-100 p-2"
    use:dndzone={{ items, flipDurationMs }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
  >
    <!-- Blueprint Dot Pattern -->
    <!-- <div
      class="pointer-events-none absolute inset-0 opacity-10"
      style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 16px 16px;"
    ></div> -->

    {#each items as item (item.id)}
      <div animate:flip={{ duration: flipDurationMs }} class="relative z-10">
        <ItemCard {item} />
      </div>
    {/each}

    <!-- Empty State Placeholder -->
    {#if items.length === 0}
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20"
      >
        <span class="font-mono text-xl font-bold uppercase text-black">
          Drop Here
        </span>
      </div>
    {/if}
  </section>
</div>
