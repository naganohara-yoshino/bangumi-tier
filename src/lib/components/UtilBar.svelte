<script lang="ts">
  import GitHubButton from "$lib/components/GitHubButton.svelte";
  import LanguageSwitch from "$lib/components/control/LanguageSwitch.svelte";
  import ThemeToggle from "$lib/components/control/ThemeToggle.svelte";
  import SidebarToggle from "$lib/components/control/SidebarToggle.svelte";

  let { onToggleSidebar, isSidebarOpen } = $props();
</script>

<!-- 
  UtilBar
  - justify-end: Pushes buttons to the right.
-->
<div class="flex w-full items-center justify-end gap-3">
  <GitHubButton />
  <LanguageSwitch />
  <ThemeToggle />

  <!-- Separator Line (Optional, adds to the brutalist look) -->
  <div class="h-6 w-0.5 bg-border mx-1"></div>

  <SidebarToggle onclick={onToggleSidebar} isOpen={isSidebarOpen} />
</div>
