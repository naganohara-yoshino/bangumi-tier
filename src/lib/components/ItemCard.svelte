<script lang="ts">
  import type { Item } from "$lib/schemas/item";
  let { item }: { item: Item } = $props();
</script>

<div class="h-64 w-48 rounded-lg shadow-lg overflow-hidden relative">
  <img
    src={item.image}
    alt={item.name}
    class="absolute inset-0 w-full h-full object-cover"
  />

  <div
    class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4"
  >
    <h2 class="text-lg font-bold relative z-10">{item.name}</h2>
  </div>
</div>
