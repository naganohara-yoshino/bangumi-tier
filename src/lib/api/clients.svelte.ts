import createClient from "openapi-fetch";
import type { paths as public_paths } from "$lib/schemas/bgm-public-api";
import type { paths as index_paths } from "$lib/schemas/bgm-index-api";

export const pubClient = createClient<public_paths>({
  baseUrl: "https://api.bgm.tv/",
});

export const indClient = createClient<index_paths>({
  baseUrl: "https://bgmapi.sakuga.org/",
});
