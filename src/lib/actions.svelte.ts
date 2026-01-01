import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { fetchIndexById } from "./api/indexFetchers.svelte";
import { itemLoader } from "./batchLoader.svelte";

export async function addIndexAndGoto(index_id: number) {
  const itemIdentities = await fetchIndexById(index_id);
  if (itemIdentities !== undefined) {
    itemLoader.addItems(itemIdentities);
    itemLoader.loadBatch();
  }
  goto(resolve("/tier"));
}
