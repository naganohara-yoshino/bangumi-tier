<script lang="ts">
  import ItemCard from "$lib/components/ItemCard.svelte";
  import type { Item } from "$lib/schemas/item";

  const item: Item = {
    id: "a",
    name: "Sample Item",
    image: "https://lain.bgm.tv/pic/crt/l/05/38/56776_crt_o44o6.jpg",
  } as Item;
</script>

<div class="grid min-h-svh place-items-center">
  <ItemCard {item} />
</div>
