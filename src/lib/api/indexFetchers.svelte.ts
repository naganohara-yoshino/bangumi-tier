import { indClient } from "./clients.svelte";
import type { ItemIdentity } from "$lib/schemas/item";

export async function fetchIndexById(
  index_id: number,
): Promise<ItemIdentity[] | undefined> {
  const { data } = await indClient.GET("/api/index/{index_id}", {
    params: { path: { index_id } },
  });

  if (!data) return undefined;

  const subject_ids = data.index.subject_ids;
  const person_ids = data.index.person_ids;
  const character_ids = data.index.character_ids;

  return [
    ...mapIds(subject_ids, "subject"),
    ...mapIds(person_ids, "person"),
    ...mapIds(character_ids, "character"),
  ];
}

function mapIds(
  ids: number[],
  category: ItemIdentity["category"],
): ItemIdentity[] {
  return ids.map((bgm_id) => ({ bgm_id, category }));
}
