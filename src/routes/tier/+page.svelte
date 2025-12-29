<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import TierBar from "$lib/components/TierBar.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let tierLevel1 = $state([]);
  let tierLevel2 = $state([]);
  let tierLevel3 = $state([]);
  let tierLevel4 = $state([]);
  let tierLevel5 = $state([]);

  // svelte-ignore state_referenced_locally
  let tierItems = $state(data.items);
</script>

<div
  class="relative flex h-screen w-full flex-col overflow-hidden bg-background font-mono text-foreground lg:flex-row"
>
  <!-- Dot Grid Texture -->
  <div
    class="pointer-events-none absolute inset-0 z-0 opacity-15"
    style="background-image: radial-gradient(currentColor 2px, transparent 2px); background-size: 24px 24px;"
  ></div>

  <!-- Left Panel: Tiers -->
  <main
    class="scrollbar-brutal relative z-10 flex flex-1 flex-col overflow-y-auto p-4 lg:p-10"
  >
    <header class="mb-10 flex flex-wrap items-center gap-4">
      <div class="flex items-center">
        <!-- 
          FF- Block 
          - bg-primary (Black)
          - text-primary-foreground (White)
          - shadow now uses var(--color-accent) (Lime/Magenta) for high contrast
        -->
        <span
          class="flex h-16 items-center border-4 border-border bg-primary px-4 text-5xl font-black tracking-tighter text-primary-foreground shadow-[6px_6px_0px_0px_var(--color-accent)] lg:h-20 lg:text-7xl"
        >
          FF
        </span>

        <!-- Bangumi Text -->
        <span
          class="ml-2 text-5xl font-black uppercase tracking-tighter text-transparent lg:text-7xl"
          style="-webkit-text-stroke: 3px var(--color-foreground); text-shadow: 6px 6px 0px var(--color-accent);"
        >
          Bangumi Tier
        </span>
      </div>

      <span
        class="mt-2 rotate-2 border-2 border-border bg-accent px-2 py-1 text-xs font-bold text-accent-foreground shadow-[2px_2px_0px_0px_var(--color-border)] lg:mt-0"
      >
        VER 2.0
      </span>
    </header>

    <div class="flex flex-col gap-4 pb-10">
      <TierBar title="S" color="var(--chart-1)" bind:items={tierLevel1} />
      <TierBar title="A" color="var(--chart-2)" bind:items={tierLevel2} />
      <TierBar title="B" color="var(--chart-3)" bind:items={tierLevel3} />
      <TierBar title="C" color="var(--chart-4)" bind:items={tierLevel4} />
      <TierBar title="D" color="var(--chart-5)" bind:items={tierLevel5} />
    </div>
  </main>

  <!-- Right Panel -->
  <aside
    class="relative z-20 flex h-[45%] w-full flex-col border-t-4 border-border bg-background p-4 lg:h-full lg:w-[420px] lg:border-l-4 lg:border-t-0 lg:p-6"
  >
    <ItemList bind:items={tierItems} title="Collection" />
  </aside>
</div>
