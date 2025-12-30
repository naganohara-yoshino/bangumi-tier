export interface Item {
  id: string; // e.g., "subject_123", "character_456"
  category: "subject" | "character" | "person";
  name: string;
  image?: string;
}
