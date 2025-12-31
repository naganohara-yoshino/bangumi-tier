export type ItemCategory = "subject" | "character" | "person";

export type ItemIdentity = {
  id: number;
  category: ItemCategory;
};

export type ItemData = ItemIdentity & {
  key: string; // unique
  name: string;
  image?: string;
};
