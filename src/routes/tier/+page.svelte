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

<!-- 
  Main Page
  - bg-background: Uses theme variable (Grey/Charcoal).
  - text-foreground: Theme text color.
-->
<div
  class="relative flex h-screen w-full flex-col overflow-hidden bg-background font-mono text-foreground lg:flex-row"
>
  <!-- Grid Pattern: Using currentcolor to adapt to dark mode automatically -->
  <div
    class="pointer-events-none absolute inset-0 z-0 opacity-10"
    style="background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px); background-size: 40px 40px;"
  ></div>

  <!-- Left Panel: Tiers -->
  <main
    class="scrollbar-brutal relative z-10 flex flex-1 flex-col overflow-y-auto p-4 lg:p-8"
  >
    <header class="mb-8 flex items-baseline gap-4">
      <h1
        class="text-5xl font-black uppercase tracking-tighter drop-shadow-[4px_4px_0_var(--color-border)] lg:text-7xl"
      >
        <span style="color: var(--chart-1);">FF-</span>Bangumi Tier
      </h1>
    </header>

    <div class="flex flex-col gap-3 pb-10">
      <TierBar title="S" color="var(--chart-1)" bind:items={tierLevel1} />
      <TierBar title="A" color="var(--chart-2)" bind:items={tierLevel2} />
      <TierBar title="B" color="var(--chart-3)" bind:items={tierLevel3} />
      <TierBar title="C" color="var(--chart-4)" bind:items={tierLevel4} />
      <TierBar title="D" color="var(--chart-5)" bind:items={tierLevel5} />
    </div>
  </main>

  <!-- Right Panel: Inventory -->
  <aside
    class="relative z-20 flex h-[40%] w-full flex-col border-t-4 border-border bg-card p-4 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] lg:h-full lg:w-[400px] lg:border-l-4 lg:border-t-0 lg:p-6"
  >
    <ItemList bind:items={tierItems} title="Collection" />
  </aside>
</div>
