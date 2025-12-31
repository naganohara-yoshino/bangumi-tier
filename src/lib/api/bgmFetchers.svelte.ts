import { pubClient } from "$lib/api/clients.svelte";
import type { ItemData, ItemIdentity } from "$lib/schemas/item";

export async function fetchSubject(
  subject_id: number,
): Promise<ItemData | undefined> {
  const { data } = await pubClient.GET("/v0/subjects/{subject_id}", {
    params: { path: { subject_id } },
  });

  if (!data) return undefined;

  return {
    bgm_id: subject_id,
    id: `subject:${subject_id}`,
    category: "subject",
    name: data.name_cn || data.name || "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchCharacter(
  character_id: number,
): Promise<ItemData | undefined> {
  const { data } = await pubClient.GET("/v0/characters/{character_id}", {
    params: { path: { character_id } },
  });

  if (!data) return undefined;

  return {
    bgm_id: character_id,
    id: `character:${character_id}`,
    category: "character",
    name: data.name || "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchPerson(
  person_id: number,
): Promise<ItemData | undefined> {
  const { data } = await pubClient.GET("/v0/persons/{person_id}", {
    params: { path: { person_id } },
  });

  if (!data) return undefined;

  return {
    bgm_id: person_id,
    id: `person:${person_id}`,
    category: "person",
    name: data.name || "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchItemByIdentity(
  itemIdentity: ItemIdentity,
): Promise<ItemData | undefined> {
  const cat = itemIdentity.category;
  const id = itemIdentity.bgm_id;
  if (cat === "subject") {
    return fetchSubject(id);
  } else if (cat === "character") {
    return fetchCharacter(id);
  } else if (cat === "person") {
    return fetchPerson(id);
  }
  return undefined;
}
