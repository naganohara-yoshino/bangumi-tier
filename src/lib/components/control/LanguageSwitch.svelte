<script lang="ts">
  import { setLocale } from "$lib/paraglide/runtime"; // Replace with your actual i18n import
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" class="neo-btn-icon-ghost">
        <span class="icon-[meteor-icons--language] h-5 w-5"></span>
        <span class="sr-only">Switch Language</span>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>

  <!-- 
      Dropdown Content Styling:
      - neo-dropdown-content: Replaces manual styling
    -->
  <DropdownMenu.Content class="neo-dropdown-content w-32">
    <DropdownMenu.Group class="p-1">
      <DropdownMenu.Item
        onclick={() => setLocale("en")}
        class="neo-dropdown-item"
      >
        English
      </DropdownMenu.Item>
      <DropdownMenu.Item
        onclick={() => setLocale("zh")}
        class="neo-dropdown-item"
      >
        中文
      </DropdownMenu.Item>
      <DropdownMenu.Item
        onclick={() => setLocale("ja")}
        class="neo-dropdown-item"
      >
        日本語
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
