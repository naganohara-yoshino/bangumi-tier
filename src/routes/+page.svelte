<script lang="ts">
    import Entry from "$lib/components/Entry.svelte";
    import coverImage from "$lib/assets/cover.jpg";
    import coverImageNight from "$lib/assets/cover-night.jpg";

    // Import independent control buttons
    import GitHubButton from "$lib/components/GitHubButton.svelte";
    import LanguageSwitch from "$lib/components/control/LanguageSwitch.svelte";
    import ThemeToggle from "$lib/components/control/ThemeToggle.svelte";
</script>

<div
    class="relative grid min-h-svh bg-background font-mono text-foreground lg:grid-cols-2"
>
    <!-- Background Texture (Dot Grid) -->
    <div
        class="pointer-events-none absolute inset-0 z-0 opacity-15"
        style="background-image: radial-gradient(currentColor 2px, transparent 2px); background-size: 24px 24px;"
    ></div>

    <!-- Left Panel: Content -->
    <div class="relative z-10 flex flex-col gap-4 p-6 md:p-10">
        <!-- Header Row: Home UtilBar -->
        <div class="flex items-center justify-between md:justify-start">
            <!-- Branding / Logo (Optional small version) -->
            <div class="flex items-center gap-2 md:hidden">
                <span class="bg-primary px-2 font-black text-primary-foreground"
                    >FF-</span
                >
            </div>

            <!-- The requested UtilBar (No Sidebar Toggle) -->
            <div class="ml-auto flex items-center gap-3">
                <GitHubButton />
                <LanguageSwitch />
                <ThemeToggle />
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex flex-1 items-center justify-center">
            <div class="w-full max-w-sm">
                <Entry />
            </div>
        </div>
    </div>

    <!-- Right Panel: Image -->
    <!-- Added border-l-4 border-border to separate from content -->
    <div
        class="bg-muted relative hidden border-l-4 border-border overflow-hidden lg:block"
    >
        <!-- 
            Overlay Pattern for Image 
            (Optional: Adds a "Scanner" line effect over the anime image) 
        -->
        <div
            class="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
            style="background-size: 100% 2px, 3px 100%;"
        ></div>

        <!-- Day Image -->
        <enhanced:img
            src={coverImage}
            alt="Kawaguchiko Day"
            class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out dark:opacity-0"
        />

        <!-- Night Image -->
        <enhanced:img
            src={coverImageNight}
            alt="Kawaguchiko Night"
            class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-in-out dark:opacity-100"
        />
    </div>
</div>
