<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button
  variant="ghost"
  size="icon"
  class="relative h-10 w-10 rounded-none border-2 border-border bg-card text-foreground transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-accent)] active:translate-y-0 active:shadow-none"
  href="https://github.com"
  target="_blank"
>
  <span class="icon-[logos--github-icon] size-5 dark:invert"></span>
  <span class="sr-only">GitHub</span>
</Button>
