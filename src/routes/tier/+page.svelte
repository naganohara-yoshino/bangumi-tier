<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import TierBar from "$lib/components/TierBar.svelte";
  import UtilBar from "$lib/components/UtilBar.svelte";
  import { itemLoader } from "$lib/states/itemBatchLoader.svelte";
  import { m } from "$lib/paraglide/messages";
  import type { ItemData } from "$lib/schemas/item";
  import { afterNavigate } from "$app/navigation";
  import { persistedTierData } from "$lib/states/persisted.svelte";

  // --- UI States ---

  // 1. Tier State
  let tierLevel1 = $state<ItemData[]>([]);
  let tierLevel2 = $state<ItemData[]>([]);
  let tierLevel3 = $state<ItemData[]>([]);
  let tierLevel4 = $state<ItemData[]>([]);
  let tierLevel5 = $state<ItemData[]>([]);

  // 2. Collection State
  let collectionTierItems = $state<ItemData[]>([]);

  // 3. State that tracks added items to avoid duplicates
  let addedToUi = $state(new Set<string>());

  // 4. Flags
  // These flags act as one-time gates: turned on after route-based init
  // This lets effects run ongoing without re-triggering init logic
  let shouldSaveToPersistedData = $state(false);
  let shouldSyncToUi = $state(false);

  // --- Logic Functions ---
  function initializeState(fromRouteId: any) {
    const isRoot = fromRouteId === "/";
    const isIndexId = fromRouteId === "/index/[id]";

    const shouldLoadPersistedData = !(isRoot || isIndexId);

    if (shouldLoadPersistedData) {
      loadFromPersistedData();
      addedToUi.clear();
      for (const item of collectionTierItems) {
        addedToUi.add(item.id);
      }

      // We do not need to sync new items immediately if we just loaded old state
      // unless you want mixed behavior.
      shouldSyncToUi = true;
    } else {
      // Fresh start
      tierLevel1 = [];
      tierLevel2 = [];
      tierLevel3 = [];
      tierLevel4 = [];
      tierLevel5 = [];
      collectionTierItems = [];
      addedToUi.clear();
      shouldSyncToUi = true;
    }

    // Allow saving after initialization is done
    shouldSaveToPersistedData = true;
  }

  function saveToPersistedData() {
    $persistedTierData.tierLevel1 = [...tierLevel1];
    $persistedTierData.tierLevel2 = [...tierLevel2];
    $persistedTierData.tierLevel3 = [...tierLevel3];
    $persistedTierData.tierLevel4 = [...tierLevel4];
    $persistedTierData.tierLevel5 = [...tierLevel5];
    $persistedTierData.collectionTierItems = [...collectionTierItems];
  }

  function loadFromPersistedData() {
    tierLevel1 = [...$persistedTierData.tierLevel1];
    tierLevel2 = [...$persistedTierData.tierLevel2];
    tierLevel3 = [...$persistedTierData.tierLevel3];
    tierLevel4 = [...$persistedTierData.tierLevel4];
    tierLevel5 = [...$persistedTierData.tierLevel5];
    collectionTierItems = [...$persistedTierData.collectionTierItems];
  }

  function oneWaySyncFromLoader() {
    const allLoadedItems = itemLoader.loadedItems;
    for (const item of allLoadedItems) {
      if (!addedToUi.has(item.id)) {
        collectionTierItems.push(item);
        addedToUi.add(item.id);
      }
    }
  }

  // --- Wiring up correctly ---
  afterNavigate(({ from }) => {
    initializeState(from?.route.id);
  });

  $effect(() => {
    if (shouldSaveToPersistedData) {
      saveToPersistedData();
    }
  });

  $effect(() => {
    if (shouldSyncToUi) {
      oneWaySyncFromLoader();
    }
  });

  // --- Sidebar ---
  let isSidebarOpen = $state(true);
  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>

<svelte:head>
  <title>Tier Editor | Bangumi Tier</title>
  <meta
    name="description"
    content="Drag and drop to rank your animes and generate your personal tier list."
  />
</svelte:head>

<div
  class="relative flex h-screen w-full flex-col overflow-hidden bg-background font-mono text-foreground lg:flex-row"
>
  <!-- Background Grid -->
  <div
    class="pointer-events-none absolute inset-0 z-0 opacity-10"
    style="background-image: linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px); background-size: 40px 40px;"
  ></div>

  <!-- Left Panel (Tiers) -->
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
          VER 1.0.0
        </span>
      </div>

      <!-- UtilBar -->
      <div class="shrink-0">
        <UtilBar onToggleSidebar={toggleSidebar} {isSidebarOpen} />
      </div>
    </header>

    <div class="flex flex-col gap-1 md:gap-2 pb-10">
      <TierBar
        title={m.level_s()}
        color="var(--chart-1)"
        bind:items={tierLevel1}
      />
      <TierBar
        title={m.level_a()}
        color="var(--chart-2)"
        bind:items={tierLevel2}
      />
      <TierBar
        title={m.level_b()}
        color="var(--chart-3)"
        bind:items={tierLevel3}
      />
      <TierBar
        title={m.level_c()}
        color="var(--chart-4)"
        bind:items={tierLevel4}
      />
      <TierBar
        title={m.level_d()}
        color="var(--chart-5)"
        bind:items={tierLevel5}
      />
    </div>
  </main>

  <!-- Right Panel (ItemList) -->
  <aside
    class="relative z-20 flex flex-col border-border bg-background transition-all duration-300 ease-in-out overflow-hidden
    {isSidebarOpen
      ? 'border-t-4 p-4 lg:border-l-4 lg:border-t-0 lg:p-6'
      : 'border-0 p-0'}
    {isSidebarOpen ? 'h-[45%] lg:h-full lg:w-[420px]' : 'h-0 lg:h-full lg:w-0'}"
  >
    <div class="h-full w-full min-w-[300px]">
      <ItemList
        title={m.cards()}
        bind:items={collectionTierItems}
        isGoingToLoad={!itemLoader.isDone}
        loadMore={() => itemLoader.loadBatch()}
      />
    </div>
  </aside>
</div>
