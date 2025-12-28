<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import TierBar from "$lib/components/TierBar.svelte";
  import ItemCard from "$lib/components/ItemCard.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let tierItems1 = $state([]);

  let tierItems2 = $state([]);

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
    <p>{tierItems3.length} {tierItems1.length} {tierItems2.length}</p>
    <TierBar bind:items={tierItems1} />
    <TierBar bind:items={tierItems2} />
  </div>
</div>
