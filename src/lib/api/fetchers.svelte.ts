// api/fetchers.svelte.ts
import { pubClient } from "./clients.svelte.ts";
import type { Item } from "$lib/schemas/item";

export async function fetchSubject(
  subject_id: number,
): Promise<Item | undefined> {
  const { data } = await pubClient.GET("/v0/subjects/{subject_id}", {
    params: { path: { subject_id } },
  });

  if (!data) return undefined;

  return {
    id: `subject_${subject_id}`,
    category: "subject",
    name: data.name_cn || data.name || "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchCharacter(
  character_id: number,
): Promise<Item | undefined> {
  const { data } = await pubClient.GET("/v0/characters/{character_id}", {
    params: { path: { character_id } },
  });

  if (!data) return undefined;

  return {
    id: `character_${character_id}`,
    category: "character",
    name: data.name || "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchPerson(
  person_id: number,
): Promise<Item | undefined> {
  const { data } = await pubClient.GET("/v0/persons/{person_id}", {
    params: { path: { person_id } },
  });

  if (!data) return undefined;

  return {
    id: `person_${person_id}`,
    category: "person",
    name: data.name || "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchItemById(
  prefixedId: string,
): Promise<Item | undefined> {
  const [type, idStr] = prefixedId.split("_");
  const id = Number(idStr);

  if (type === "subject") return fetchSubject(id);
  if (type === "character") return fetchCharacter(id);
  if (type === "person") return fetchPerson(id);

  return undefined;
}
