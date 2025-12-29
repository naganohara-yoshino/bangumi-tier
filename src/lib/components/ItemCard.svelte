<script lang="ts">
  import type { Item } from "$lib/schemas/item";

  let { item }: { item: Item } = $props();
</script>

<!-- 
  Neo-Brutalist Item Card
  - h-28 w-20: Fixed size.
  - border-2 border-black: Hard outline.
  - group: Allows the child elements to react when the parent is hovered.
-->
<div
  class="group relative flex h-28 w-20 flex-col select-none border-2 border-black bg-white"
>
  <!-- 
      Image Area (Maximizes space)
      - flex-grow: Pushes the text area down.
      - border-b-2: Hard separator line.
      - No hover effects here (static).
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
      Title Area (Reactive)
      - h-5: Very small, just enough for the text.
      - group-hover:bg-yellow-300: The background snaps to yellow when the card is hovered.
    -->
  <div
    class="flex h-5 w-full items-center justify-center overflow-hidden bg-white transition-colors duration-150 group-hover:bg-yellow-300"
  >
    <span
      class="truncate px-1 font-mono text-[9px] font-bold uppercase leading-none tracking-tight text-black"
      title={item.name}
    >
      {item.name}
    </span>
  </div>
</div>
