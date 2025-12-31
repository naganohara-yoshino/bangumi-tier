import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { fetchIndexById } from "./api/indexFetchers.svelte";
import { itemsUnrankedStore } from "./state/items.svelte";

export async function addIndexAndGoto(index_id: number) {
  const itemIds = await fetchIndexById(index_id);
  if (itemIds !== undefined) {
    itemsUnrankedStore.loadItems(itemIds);
  }
  goto(resolve("/tier"));
}
