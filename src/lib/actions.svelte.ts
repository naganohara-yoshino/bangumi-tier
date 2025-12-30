import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { fetchIndexById } from "./api/indexFetchers.svelte";
import { itemStore } from "./state/items.svelte";

export async function addIndexAndGoto(index_id: number) {
  const itemIds = await fetchIndexById(index_id);
  if (itemIds !== undefined) {
    itemStore.loadItems(itemIds);
  }
  goto(resolve("/tier"));
}
