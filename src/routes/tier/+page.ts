import { error } from "@sveltejs/kit";
import { fetchIndexItems } from "$lib/fetchItems";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const items = await fetchIndexItems(86776);
  return { items };
};
