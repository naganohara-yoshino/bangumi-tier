<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import TierBar from "$lib/components/TierBar.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // Tier State
  let tierLevel1 = $state([]); // S
  let tierLevel2 = $state([]); // A
  let tierLevel3 = $state([]); // B
  let tierLevel4 = $state([]); // C
  let tierLevel5 = $state([]); // D

  // Inventory State
  // svelte-ignore state_referenced_locally
  let tierItems = $state(data.items);
</script>

<!-- 
  Main Page Wrapper
  - h-screen: Locks the page to the viewport height (prevent body scroll).
  - overflow-hidden: We handle scrolling inside the panels.
  - bg-[#f2f2f2]: Light grey concrete base.
-->
<div
  class="relative flex h-screen w-full flex-col overflow-hidden bg-[#f2f2f2] font-mono text-black lg:flex-row"
>
  <!-- 
     Background Grid Pattern 
     - Creates a 40px x 40px blueprint grid.
     - pointer-events-none: Ensures it doesn't block dragging.
  -->
  <div
    class="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
    style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 40px 40px;"
  ></div>

  <!-- 
    LEFT PANEL: Tiers 
    - flex-1: Takes up all available space.
    - overflow-y-auto: Scrolled independently.
    - z-10: Sits above background.
  -->
  <main
    class="custom-scrollbar relative z-10 flex flex-1 flex-col overflow-y-auto p-4 lg:p-8"
  >
    <!-- Page Title -->
    <header class="mb-8 flex items-baseline gap-4">
      <h1
        class="text-5xl font-black uppercase tracking-tighter drop-shadow-[4px_4px_0_#fff] lg:text-7xl"
      >
        Rank<span class="text-rose-500">.</span>It
      </h1>
      <span
        class="hidden rounded-full border-2 border-black bg-black px-3 py-1 text-xs font-bold text-white lg:inline-block"
      >
        V 1.0
      </span>
    </header>

    <!-- Tier Bars Stack -->
    <div class="flex flex-col gap-1 pb-10">
      <TierBar title="S" color="#fb7185" bind:items={tierLevel1} />
      <!-- Rose -->
      <TierBar title="A" color="#fbbf24" bind:items={tierLevel2} />
      <!-- Amber -->
      <TierBar title="B" color="#a3e635" bind:items={tierLevel3} />
      <!-- Lime -->
      <TierBar title="C" color="#22d3ee" bind:items={tierLevel4} />
      <!-- Cyan -->
      <TierBar title="D" color="#a78bfa" bind:items={tierLevel5} />
      <!-- Violet -->
    </div>
  </main>

  <!-- 
    RIGHT PANEL: Item List 
    - Desktop: w-[400px] fixed width, full height.
    - Mobile: h-[40%] fixed height, full width.
    - border-t-4 / border-l-4: Hard divider line between panels.
  -->
  <aside
    class="relative z-20 flex h-[40%] w-full flex-col border-t-4 border-black bg-white p-4 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] lg:h-full lg:w-[400px] lg:border-l-4 lg:border-t-0 lg:p-6"
  >
    <!-- 
       Pass the list component.
       It will fill the height of this <aside> due to h-full in ItemList.svelte 
    -->
    <ItemList bind:items={tierItems} title="Collection" />
  </aside>
</div>

<!-- Reusing the scrollbar style for the main page tier scrolling -->
<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 14px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent; /* Transparent on the main page to see grid */
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #000000;
    border: 3px solid #f2f2f2; /* Matches page bg color */
    border-radius: 9999px; /* Pill shape for main scrollbar looks slightly better, or remove for blocky */
    background-clip: content-box;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #333;
  }
</style>
