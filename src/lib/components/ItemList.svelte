<script>
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import ItemCard from "./ItemCard.svelte";

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
  use:dndzone={{ items, flipDurationMs }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each items as item (item.id)}
    <div animate:flip={{ duration: flipDurationMs }}>
      <ItemCard {item} />
    </div>
  {/each}
</div>
