<script>
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import ItemCard from "$lib/components/ItemCard.svelte";

  let { items = $bindable() } = $props();
  const flipDurationMs = 300;
  function handleDndConsider(e) {
    items = e.detail.items;
  }
  function handleDndFinalize(e) {
    items = e.detail.items;
  }
</script>

<div
  class="flex h-70 bg-white w-full rounded-lg p-2 overflow-x-auto"
  use:dndzone={{ items, flipDurationMs }}
  onconsider={handleDndConsider}
  onfinalize={handleDndFinalize}
>
  {#each items as item (item.id)}
    <div animate:flip={{ duration: flipDurationMs }}>
      <ItemCard {item} />
    </div>
  {/each}
</div>
