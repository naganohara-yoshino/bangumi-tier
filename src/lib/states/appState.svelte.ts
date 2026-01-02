export type AppState = {
  total: number | undefined;
};

export const appState = $state<AppState>({
  total: undefined,
});
