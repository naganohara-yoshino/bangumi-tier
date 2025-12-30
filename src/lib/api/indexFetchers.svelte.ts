import { indClient } from "./clients.svelte";

export async function fetchIndexById(
  index_id: number,
): Promise<string[] | undefined> {
  const { data } = await indClient.GET("/api/index/{index_id}", {
    params: { path: { index_id } },
  });

  if (!data) return undefined;

  const subject_ids = data.index.subject_ids;
  const person_ids = data.index.person_ids;
  const character_ids = data.index.character_ids;

  return [
    ...subject_ids.map((id) => `subject_${id}`),
    ...person_ids.map((id) => `person_${id}`),
    ...character_ids.map((id) => `character_${id}`),
  ];
}
