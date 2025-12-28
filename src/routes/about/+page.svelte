<script lang="ts">
  import EntryForm from "$lib/components/EntryForm.svelte";
  import ModToggle from "$lib/components/ModToggle.svelte";
  import coverImage from "$lib/assets/cover.jpg";
  import coverImageNight from "$lib/assets/cover-night.jpg";
</script>

<div class="grid min-h-svh lg:grid-cols-2">
  <!-- Left Panel: Content -->
  <div class="flex flex-col gap-4 p-6 md:p-10">
    <!-- Header Row -->
    <!-- 2. ModToggle is arranged to the left of the Repo link -->
    <div class="flex items-center justify-center gap-3 md:justify-start">
      <ModToggle />

      <!-- Vertical divider for a clean look -->
      <div class="h-4 w-px bg-border/40"></div>

      <!-- 1. Open Source Repo + Github Icon -->
      <a
        href="https://github.com/your-username/repo"
        target="_blank"
        class="text-muted-foreground hover:text-foreground flex items-center gap-2 font-medium transition-colors"
      >
        <span class="icon-[logos--github-icon] size-5 dark:invert"></span>
        <span>Github Repo</span>
      </a>
    </div>

    <!-- Main Content Area -->
    <div class="flex flex-1 items-center justify-center">
      <div class="w-full max-w-xs">
        <EntryForm />
      </div>
    </div>
  </div>

  <!-- Right Panel: Image -->
  <!-- 3. Day/Night Image Logic without Filters -->
  <div class="bg-muted relative hidden lg:block overflow-hidden">
    <!-- Day Image: Visible by default, fades out in dark mode -->
    <enhanced:img
      src={coverImage}
      alt="Kawaguchiko Day"
      class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out dark:opacity-0"
    />

    <!-- Night Image: Invisible by default, fades in in dark mode -->
    <enhanced:img
      src={coverImageNight}
      alt="Kawaguchiko Night"
      class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-in-out dark:opacity-100"
    />
  </div>
</div>
