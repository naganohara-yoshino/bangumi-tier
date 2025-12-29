<script lang="ts">
  import type { Item } from "$lib/schemas/item";

  let { item }: { item: Item } = $props();
</script>

<!-- 
  Neo-Brutalist Item Card
  CHANGE 1: changed 'group' to 'group/card' 
  This isolates the hover logic to just this specific card.
-->
<div
  class="group/card relative flex h-28 w-20 flex-col select-none border-2 border-black bg-white"
>
  <!-- 
      Image Area 
    -->
  <div
    class="relative w-full flex-grow overflow-hidden border-b-2 border-black bg-neutral-200"
  >
    <img
      src={item.image}
      alt={item.name}
      draggable="false"
      class="absolute inset-0 h-full w-full object-cover object-top"
    />
  </div>

  <!-- 
      Title Area 
      CHANGE 2: changed 'group-hover' to 'group-hover/card'
      Now it only turns yellow when 'group/card' (this specific div) is hovered.
    -->
  <div
    class="flex h-5 w-full items-center justify-center overflow-hidden bg-white transition-colors duration-150 group-hover/card:bg-yellow-300"
  >
    <span
      class="truncate px-1 font-mono text-[9px] font-bold uppercase leading-none tracking-tight text-black"
      title={item.name}
    >
      {item.name}
    </span>
  </div>
</div>
