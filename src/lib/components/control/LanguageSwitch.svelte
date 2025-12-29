<script lang="ts">
  import { setLocale } from "$lib/paraglide/runtime"; // Replace with your actual i18n import
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  const btnClass =
    "relative h-10 w-10 rounded-none border-2 border-border bg-card text-foreground transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-accent)] active:translate-y-0 active:shadow-none";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" class={btnClass}>
        <span class="icon-[meteor-icons--language] h-5 w-5"></span>
        <span class="sr-only">Switch Language</span>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>

  <!-- 
      Dropdown Content Styling:
      - rounded-none: Sharp corners
      - border-2 border-border: Hard outline
      - shadow-hard: Consistent shadow
    -->
  <DropdownMenu.Content
    class="w-32 rounded-none border-2 border-border bg-card p-0 shadow-[4px_4px_0px_0px_var(--color-border)]"
  >
    <DropdownMenu.Group class="p-1">
      <DropdownMenu.Item
        onclick={() => setLocale("en")}
        class="cursor-pointer rounded-none font-mono font-bold uppercase focus:bg-primary focus:text-primary-foreground"
      >
        English
      </DropdownMenu.Item>
      <DropdownMenu.Item
        onclick={() => setLocale("zh")}
        class="cursor-pointer rounded-none font-mono font-bold uppercase focus:bg-primary focus:text-primary-foreground"
      >
        Chinese
      </DropdownMenu.Item>
      <DropdownMenu.Item
        onclick={() => setLocale("ja")}
        class="cursor-pointer rounded-none font-mono font-bold uppercase focus:bg-primary focus:text-primary-foreground"
      >
        Japanese
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
