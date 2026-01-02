import type { ItemData } from "$lib/schemas/item";
import { persisted } from "svelte-persisted-store";

type TierData = {
  tierLevel1: ItemData[];
  tierLevel2: ItemData[];
  tierLevel3: ItemData[];
  tierLevel4: ItemData[];
  tierLevel5: ItemData[];
  collectionTierItems: ItemData[];
};
export const persistedTierData = persisted<TierData>("tierData", {
  tierLevel1: [],
  tierLevel2: [],
  tierLevel3: [],
  tierLevel4: [],
  tierLevel5: [],
  collectionTierItems: [],
});
