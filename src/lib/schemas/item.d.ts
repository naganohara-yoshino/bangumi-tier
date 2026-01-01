export type ItemCategory = "subject" | "character" | "person";

export type ItemIdentity = {
  bgm_id: number;
  category: ItemCategory;
};

export type ItemData = ItemIdentity & {
  id: string; // unique , for svelte dnd actions
  name: string;
  image?: string;
};
