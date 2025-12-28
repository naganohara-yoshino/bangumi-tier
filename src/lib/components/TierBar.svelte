<script>
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
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
  class="min-w-10 h-16 flex bg-gray-200 rounded-lg p-2"
  use:dndzone={{ items, flipDurationMs }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each items as item (item.id)}
    <div
      class="flex min-w-10 h-10 p-3 border-2 border-blue-500 m-1 text-center items-center justify-center bg-white rounded shadow cursor-move select-none"
      animate:flip={{ duration: flipDurationMs }}
    >
      {item.name}
    </div>
  {/each}
</div>
