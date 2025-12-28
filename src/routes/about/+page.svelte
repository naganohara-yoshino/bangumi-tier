<script lang="ts">
  import EntryForm from "$lib/components/EntryForm.svelte";
  import ModToggle from "$lib/components/ModToggle.svelte";
  import coverImage from "$lib/assets/cover.jpg";
  import coverImageNight from "$lib/assets/cover-night.jpg";
</script>

<!-- Main Container -->
<div class="relative min-h-svh w-full overflow-hidden">
  <!-- 1. Global Background (Full Page, Behind Content) -->
  <div class="fixed inset-0 -z-10 h-full w-full bg-zinc-900">
    <!-- Day Image -->
    <enhanced:img
      src={coverImage}
      alt="Kawaguchiko Day"
      class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out dark:opacity-0"
    />

    <!-- Night Image -->
    <enhanced:img
      src={coverImageNight}
      alt="Kawaguchiko Night"
      class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000 ease-in-out dark:opacity-100"
    />

    <!-- Optional: Subtle overlay to ensure text contrast on the right side if needed later -->
    <div
      class="absolute inset-0 bg-black/10 dark:bg-black/30 pointer-events-none"
    ></div>
  </div>

  <!-- 2. Content Grid -->
  <div class="grid min-h-svh lg:grid-cols-2">
    <!-- Left Panel: Glass Effect, Rectangular, Full Height -->
    <div
      class="glass flex flex-col gap-4 p-6 md:p-10 backdrop-blur-md border-r"
    >
      <!-- Header -->
      <div class="flex items-center gap-3">
        <ModToggle />

        <span class="text-border h-6 w-px bg-current opacity-20"></span>

        <a
          href="https://github.com/your-username/repo"
          target="_blank"
          class="hover:text-foreground text-muted-foreground flex items-center gap-2 font-medium transition-colors"
        >
          <span class="icon-[logos--github-icon] size-5"></span>
          <span>Open Source Repo</span>
        </a>
      </div>

      <!-- Form Container (Centered vertically in the left panel) -->
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <EntryForm />
        </div>
      </div>
    </div>

    <!-- Right Panel: Empty & Transparent (shows the background image) -->
    <div class="hidden lg:block"></div>
  </div>
</div>
