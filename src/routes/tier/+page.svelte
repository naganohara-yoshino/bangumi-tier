<script>
  import ItemList from "$lib/components/ItemList.svelte";
  import TierBar from "$lib/components/TierBar.svelte";

  let tierItems1 = [
    { id: 1, name: "Tier 1" },
    { id: 2, name: "Tier 2" },
    { id: 3, name: "Tier 3" },
  ];
  let tierItems2 = [
    { id: 11, name: "Tier 11" },
    { id: 22, name: "Tier 22" },
    { id: 33, name: "Tier 33" },
  ];
</script>

<div
  class="flex flex-col-reverse min-w-screen overflow-clip bg-gray-300 lg:flex-row-reverse lg:min-h-screen lg:h-screen"
>
  <div
    class="flex flex-col p-8 justify-center items-center w-full lg:h-full lg:w-2/5 bg-white"
  >
    <ItemList
      items={[
        { id: "a", name: "Item A" },
        { id: "b", name: "Item B" },
        { id: "c", name: "Item C" },
        { id: "d", name: "Item D" },
        { id: "e", name: "Item E" },
      ]}
    />
  </div>
  <div class="flex flex-1 flex-col justify-center items-center p-8">
    <TierBar items={tierItems1} />
    <TierBar items={tierItems2} />
  </div>
</div>
