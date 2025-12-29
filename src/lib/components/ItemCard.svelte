<script lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from "$lib/components/ui/card/index.js";
  import type { Item } from "$lib/schemas/item";
  let { item }: { item: Item } = $props();
</script>

<Card class="m-px h-24 w-18 rounded-lg shadow-lg overflow-hidden relative">
  <CardContent>
    <img
      src={item.image}
      alt={item.name}
      class="absolute inset-0 w-full h-full object-cover object-top"
    />
  </CardContent>

  <CardFooter class="absolute bottom-0  w-full p-1">
    <CardTitle
      class="w-full text-center text-[10px] text-pretty antialiased drop-shadow-md"
      >{item.name}</CardTitle
    >
  </CardFooter>
</Card>
