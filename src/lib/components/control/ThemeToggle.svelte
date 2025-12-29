<script lang="ts">
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";

  // Consistent Brutalist Button Style
  const btnClass =
    "relative h-10 w-10 rounded-none border-2 border-border bg-card text-foreground transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-accent)] active:translate-y-0 active:shadow-none";
</script>

<Button onclick={toggleMode} variant="ghost" size="icon" class={btnClass}>
  <span
    class="icon-[lucide--sun] h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
  ></span>
  <span
    class="icon-[lucide--moon-star] absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
  ></span>
  <span class="sr-only">Toggle theme</span>
</Button>
