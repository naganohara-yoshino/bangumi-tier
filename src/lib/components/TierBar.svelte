<script>
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import ItemCard from "$lib/components/ItemCard.svelte";
  import { m } from "$lib/paraglide/messages";

  let { items = $bindable(), title = "A", color = "var(--chart-2)" } = $props();

  const flipDurationMs = 300;
  function handleDndConsider(e) {
    items = e.detail.items;
  }
  function handleDndFinalize(e) {
    items = e.detail.items;
  }

  // Pattern uses currentColor to auto-adapt
  const blueprintPattern = `background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 16px 16px;`;
</script>

<!-- 
  Tier Bar
  - border-border: Black (Day) / White (Night)
  - shadow uses var(--color-border) for visibility in dark mode
-->
<div
  class="neo-panel group mb-2 flex w-full transition-shadow duration-200 hover:shadow-[8px_8px_0px_0px_var(--tier-color)]"
  style="--tier-color: {color}"
>
  <!-- Title -->
  <div
    class="flex w-24 shrink-0 flex-col items-center justify-center border-r-4 border-border px-4 py-2 sm:w-32"
    style="background-color: {color};"
  >
    <h2
      class="break-words text-center font-mono text-4xl font-black uppercase leading-tight tracking-tighter text-black sm:text-5xl"
    >
      {title}
    </h2>
  </div>

  <!-- Drop Zone Wrapper -->
  <div class="relative min-h-32 flex-1 bg-background/50">
    <div
      class="pointer-events-none absolute inset-0 opacity-20"
      style={blueprintPattern}
    ></div>

    {#if items.length === 0}
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
      >
        <span class="font-mono text-xl font-bold uppercase text-foreground"
          >{m.drop_here()}</span
        >
      </div>
    {/if}

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
