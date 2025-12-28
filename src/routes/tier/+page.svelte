<script lang="ts">
  import ItemList from "$lib/components/ItemList.svelte";
  import TierBar from "$lib/components/TierBar.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let tierItems1 = data.items || [];

  let tierItems2 = [];
</script>

<div
  class="flex flex-col-reverse min-w-screen overflow-clip bg-gray-300 lg:flex-row-reverse lg:min-h-screen lg:h-screen"
>
  <div
    class="flex flex-col p-8 justify-center items-center w-full lg:h-full lg:w-2/5 bg-white"
  >
    <ItemList items={[]} />
  </div>
  <div class="flex flex-1 flex-col justify-center items-center p-8">
    <TierBar items={tierItems1} />
    <TierBar items={tierItems2} />
  </div>
</div>
