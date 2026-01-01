<script lang="ts">
    import Entry from "$lib/components/Entry.svelte";
    import coverImage from "$lib/assets/cover.jpg";
    import coverImageNight from "$lib/assets/cover-night.jpg";

    import GitHubButton from "$lib/components/GitHubButton.svelte";
    import LanguageSwitch from "$lib/components/control/LanguageSwitch.svelte";
    import ThemeToggle from "$lib/components/control/ThemeToggle.svelte";
</script>

<div
    class="relative grid min-h-svh bg-background font-mono text-foreground lg:grid-cols-2"
>
    <!-- Background Texture -->
    <div
        class="pointer-events-none absolute inset-0 z-0 opacity-10"
        style="background-image: linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px); background-size: 40px 40px;"
    ></div>

    <!-- Left Panel: Content -->
    <div class="relative z-10 flex flex-col gap-8 p-6 md:p-10">
        <!-- 
           Header Row 
           - Mobile: flex-col, gap-4, items-start (Title top-left, Buttons below-left)
           - Desktop (lg): flex-row, justify-between (Title Left, Buttons Right)
        -->
        <header
            class="flex w-full flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
            <!-- Title Section -->
            <div
                class="flex items-center scale-75 origin-top-left lg:scale-100"
            >
                <!-- Box Logo -->
                <span
                    class="flex h-12 items-center border-4 border-border bg-primary px-3 text-3xl font-black tracking-tighter text-primary-foreground shadow-[4px_4px_0px_0px_var(--color-accent)]"
                >
                    FF
                </span>
                <!-- Text Logo -->
                <span
                    class="ml-2 text-3xl font-black uppercase tracking-tighter text-transparent"
                    style="-webkit-text-stroke: 2px var(--color-foreground); text-shadow: 4px 4px 0px var(--color-accent);"
                >
                    Bangumi Tier
                </span>
            </div>

            <!-- Button Group -->
            <div class="flex items-center gap-3">
                <GitHubButton />
                <LanguageSwitch />
                <ThemeToggle />
            </div>
        </header>

        <!-- Main Content Area -->
        <div class="flex flex-1 items-center justify-center">
            <div class="w-full max-w-sm">
                <Entry />
            </div>
        </div>
    </div>

    <!-- 
       Right Panel: Image 
       - Removed overlay filters.
       - Clean image presentation.
    -->
    <div
        class="bg-muted relative hidden border-l-4 border-border overflow-hidden lg:block"
    >
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
