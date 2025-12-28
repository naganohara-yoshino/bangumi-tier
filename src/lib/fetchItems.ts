import createClient from "openapi-fetch";
import type { paths as public_paths } from "$lib/schemas/bgm-public-api";
import type { paths as index_pathes } from "$lib/schemas/bgm-index-api";

export interface Item {
  category: string;
  name: string;
  image: string | undefined;
}

const pubClient = createClient<public_paths>({
  baseUrl: "https://api.bgm.tv/",
});

const indClient = createClient<index_pathes>({
  baseUrl: "https://bgmapi.sakuga.org/",
});

export async function fetchIndex(index_id: number): Promise<Item[]> {
  const { data } = await indClient.GET("/api/index/{index_id}", {
    params: {
      path: {
        index_id,
      },
    },
  });

  if (!data) {
    throw new Error("Index not found");
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
  return Promise.all(promises);
}

export async function fetchSubject(subject_id: number): Promise<Item> {
  const { data } = await pubClient.GET("/v0/subjects/{subject_id}", {
    params: {
      path: { subject_id },
    },
  });

  if (!data) {
    throw new Error("Subject not found");
  }

  return {
    category: "subject",
    name: data.name ?? data.name_cn ?? "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchCharacter(character_id: number): Promise<Item> {
  const { data } = await pubClient.GET("/v0/characters/{character_id}", {
    params: {
      path: { character_id },
    },
  });

  if (!data) {
    throw new Error("Character not found");
  }

  return {
    category: "character",
    name: data.name ?? "Unknown",
    image: data.images?.medium,
  };
}

export async function fetchPerson(person_id: number): Promise<Item> {
  const { data } = await pubClient.GET("/v0/persons/{person_id}", {
    params: {
      path: { person_id },
    },
  });

  if (!data) {
    throw new Error("Person not found");
  }

  return {
    category: "person",
    name: data.name ?? "Unknown",
    image: data.images?.medium,
  };
}
