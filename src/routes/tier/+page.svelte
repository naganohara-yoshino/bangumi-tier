<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import TierBar from "$lib/components/TierBar.svelte";
  import UtilBar from "$lib/components/UtilBar.svelte"; // Renamed import
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let tierLevel1 = $state([]);
  let tierLevel2 = $state([]);
  let tierLevel3 = $state([]);
  let tierLevel4 = $state([]);
  let tierLevel5 = $state([]);

  // svelte-ignore state_referenced_locally
  let tierItems = $state(data.items);

  // Sidebar State
  let isSidebarOpen = $state(true);
  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>

<div
  class="relative flex h-screen w-full flex-col overflow-hidden bg-background font-mono text-foreground lg:flex-row"
>
  <!-- Background Grid -->
  <div
    class="pointer-events-none absolute inset-0 z-0 opacity-10"
    style="background-image: linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px); background-size: 40px 40px;"
  ></div>

  <!-- Left Panel (Tiers) -->
  <!-- 
    Logic: When sidebar is closed (!isSidebarOpen), this panel should grow to take full space.
    The 'flex-1' class already handles this automatically as long as the other panel disappears.
  -->
  <main
    class="scrollbar-brutal relative z-10 flex flex-1 flex-col overflow-y-auto p-4 lg:p-10"
  >
    <header
      class="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
    >
      <!-- Title -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center">
          <span
            class="flex h-16 items-center border-4 border-border bg-primary px-4 text-5xl font-black tracking-tighter text-primary-foreground shadow-[6px_6px_0px_0px_var(--color-accent)] lg:h-20 lg:text-7xl"
          >
            FF
          </span>
          <span
            class="ml-2 text-5xl font-black uppercase tracking-tighter text-transparent lg:text-7xl"
            style="-webkit-text-stroke: 3px var(--color-foreground); text-shadow: 6px 6px 0px var(--color-accent);"
          >
            Bangumi Tier
          </span>
        </div>
        <span
          class="hidden md:block mt-2 rotate-2 border-2 border-border bg-accent px-2 py-1 text-xs font-bold text-accent-foreground shadow-[2px_2px_0px_0px_var(--color-border)] lg:mt-0"
        >
          VER 0.1.0
        </span>
      </div>

      <!-- UtilBar -->
      <div class="shrink-0">
        <!-- Pass the toggle handler and state -->
        <UtilBar onToggleSidebar={toggleSidebar} {isSidebarOpen} />
      </div>
    </header>

    <div class="flex flex-col gap-4 pb-10">
      <TierBar title="S" color="var(--chart-1)" bind:items={tierLevel1} />
      <TierBar title="A" color="var(--chart-2)" bind:items={tierLevel2} />
      <TierBar title="B" color="var(--chart-3)" bind:items={tierLevel3} />
      <TierBar title="C" color="var(--chart-4)" bind:items={tierLevel4} />
      <TierBar title="D" color="var(--chart-5)" bind:items={tierLevel5} />
    </div>
  </main>

  <!-- 
    Right Panel (ItemList) 
    Transition Logic:
    1. We keep the DOM element but collapse width/height to 0.
    2. overflow-hidden is crucial to hide content during collapse.
    3. transition-all duration-300 makes the snap smooth.
  -->
  <aside
    class="relative z-20 flex flex-col border-border bg-background transition-all duration-300 ease-in-out overflow-hidden
    {isSidebarOpen
      ? 'border-t-4 p-4 lg:border-l-4 lg:border-t-0 lg:p-6'
      : 'border-0 p-0'}
    {isSidebarOpen ? 'h-[45%] lg:h-full lg:w-[420px]' : 'h-0 lg:h-full lg:w-0'}"
  >
    <!-- 
      We wrap the content in a fixed width div (on desktop) so the content 
      doesn't squish while the panel width shrinks. 
    -->
    <div class="h-full w-full min-w-[300px]">
      <ItemList bind:items={tierItems} title="Collection" />
    </div>
  </aside>
</div>
