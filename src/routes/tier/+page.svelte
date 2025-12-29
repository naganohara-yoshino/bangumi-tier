<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import TierBar from "$lib/components/TierBar.svelte";
  import ItemCard from "$lib/components/ItemCard.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let tierLevel1 = $state([]);
  let tierLevel2 = $state([]);
  let tierLevel3 = $state([]);
  let tierLevel4 = $state([]);
  let tierLevel5 = $state([]);

  // svelte-ignore state_referenced_locally
  let tierItems3 = $state(data.items);
</script>

<div
  class="flex flex-col-reverse min-w-screen overflow-clip bg-gray-300 lg:flex-row-reverse lg:min-h-screen lg:h-screen"
>
  <div
    class="flex flex-col p-8 justify-center items-center w-full lg:h-full lg:w-2/5 bg-white"
  >
    <ItemList bind:items={tierItems3} />
  </div>
  <div class="flex flex-1 flex-col justify-center items-center p-8">
    <TierBar title="S" bind:items={tierLevel1} />
    <TierBar title="A" bind:items={tierLevel2} />
    <TierBar title="B" bind:items={tierLevel3} />
    <TierBar title="C" bind:items={tierLevel4} />
    <TierBar title="D" bind:items={tierLevel5} />
  </div>
</div>
