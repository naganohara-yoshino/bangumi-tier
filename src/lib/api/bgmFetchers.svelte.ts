import { pubClient } from "$lib/api/clients.svelte";
import type { components } from "$lib/schemas/bgm-public-api";
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
    name: data.name || "Unknown",
    name_cn: data.name_cn,
    image: data.images?.small,
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
    image: data.images?.small,
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
    image: data.images?.small,
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

//
//
//

type SubjectCollected = components["schemas"]["UserSubjectCollection"];
// type Subject = components["schemas"]["Subject"];

export async function fetchUserCollection(
  username: string,
): Promise<SubjectCollected[]> {
  const limit = 50;

  // Fetch first page to get total
  const { data: firstPage } = await pubClient.GET(
    "/v0/users/{username}/collections",
    {
      params: {
        path: { username },
        query: {
          // subject_type: 2,
          type: 2,
          limit,
          offset: 0,
        },
      },
    },
  );

  const total = firstPage?.total ?? 0;
  const all: SubjectCollected[] = [...(firstPage?.data ?? [])];

  if (total <= limit) {
    return all;
  }

  const promises = [];
  for (let offset = limit; offset < total; offset += limit) {
    promises.push(
      pubClient
        .GET("/v0/users/{username}/collections", {
          params: {
            path: { username },
            query: {
              // subject_type: 2,
              type: 2,
              limit,
              offset,
            },
          },
        })
        .then((res) => res.data?.data ?? []),
    );
  }

  const rest = await Promise.all(promises);
  for (const page of rest) {
    all.push(...page);
  }

  return all;
}
