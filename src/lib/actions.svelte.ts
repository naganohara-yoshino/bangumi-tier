import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { fetchIndexById } from "$lib/api/indexFetchers.svelte";
import { itemLoader } from "$lib/itemBatchLoader.svelte";
import type { components } from "$lib/schemas/bgm-public-api";
import { DateTime } from "luxon";
import type { ItemData } from "$lib/schemas/item";
import { fetchUserCollection } from "./api/bgmFetchers.svelte";

type SubjectCollected = components["schemas"]["UserSubjectCollection"];

export async function addIndexAndGoto(index_id: number) {
  const itemIdentities = await fetchIndexById(index_id);
  if (itemIdentities !== undefined) {
    itemLoader.addItems(itemIdentities);
    // await itemLoader.loadBatch();
  }
  goto(resolve("/tier"));
}
const YEAR = 2025;

const ANIME_STUDIOS = 86940;

const ANIME_DIRECTORS = 42599;

const SEASONAL_ANIME = 83397; // 2025 10

export async function gotoStudio() {
  await addIndexAndGoto(ANIME_STUDIOS);
}

export async function gotoDerector() {
  await addIndexAndGoto(ANIME_DIRECTORS);
}

export async function gotoSeasonal() {
  await addIndexAndGoto(SEASONAL_ANIME);
}

/**
 * 判断条目是否在指定年份完成
 */
export function isDoneInYear(
  collectedSubject: SubjectCollected,
  year: number,
): boolean {
  const updatedIsoStr = collectedSubject.updated_at;
  if (!updatedIsoStr) return false;

  const updatedAt = DateTime.fromISO(updatedIsoStr);
  return updatedAt.isValid && updatedAt.year === year;
}

export function subjectToItem(collectedSubject: SubjectCollected): ItemData {
  const subject_id = collectedSubject.subject_id;
  return {
    bgm_id: subject_id,
    category: "subject",
    name: collectedSubject.subject?.name ?? "Unknown",
    image: collectedSubject.subject?.images.small,
    id: `subject:${subject_id}`,
  };
}

export async function gotoUserCollection(username: string) {
  const collectionYear = (await fetchUserCollection(username)).filter((subj) =>
    isDoneInYear(subj, YEAR),
  );
  const items = collectionYear.map(subjectToItem);
  itemLoader.loadedItems.push(...items);
  goto(resolve("/tier"));
}
