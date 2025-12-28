import createClient from "openapi-fetch";
import type { paths as public_paths } from "$lib/schemas/bgm-public-api";
import type { paths as index_pathes } from "$lib/schemas/bgm-index-api";
import type { Item } from "$lib/schemas/item";

const pubClient = createClient<public_paths>({
  baseUrl: "https://api.bgm.tv/",
});

const indClient = createClient<index_pathes>({
  baseUrl: "https://bgmapi.sakuga.org/",
});

export async function fetchIndexItems(index_id: number): Promise<Item[]> {
  const { data } = await indClient.GET("/api/index/{index_id}", {
    params: {
      path: {
        index_id,
      },
    },
  });

  if (!data) {
    return [];
  }

  const index = data.index;

  const promises = [];
  for (const subject_id of index.subject_ids) {
    promises.push(fetchSubject(subject_id));
  }
  for (const character_id of index.character_ids) {
    promises.push(fetchCharacter(character_id));
  }
  for (const person_id of index.person_ids) {
    promises.push(fetchPerson(person_id));
  }
  return (await Promise.all(promises)).filter(
    (item): item is Item => item !== undefined,
  );
}

export async function fetchSubject(
  subject_id: number,
): Promise<Item | undefined> {
  const { data } = await pubClient.GET("/v0/subjects/{subject_id}", {
    params: {
      path: { subject_id },
    },
  });

  if (!data) {
    return undefined;
  }

  return {
    id: `subject_${subject_id}`,
    category: "subject",
    name: data.name ?? data.name_cn ?? "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchCharacter(
  character_id: number,
): Promise<Item | undefined> {
  const { data } = await pubClient.GET("/v0/characters/{character_id}", {
    params: {
      path: { character_id },
    },
  });

  if (!data) {
    return undefined;
  }

  return {
    id: `character_${character_id}`,
    category: "character",
    name: data.name ?? "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchPerson(
  person_id: number,
): Promise<Item | undefined> {
  const { data } = await pubClient.GET("/v0/persons/{person_id}", {
    params: {
      path: { person_id },
    },
  });

  if (!data) {
    return undefined;
  }

  return {
    id: `person_${person_id}`,
    category: "person",
    name: data.name ?? "Unknown",
    image: data.images?.medium,
  };
}
