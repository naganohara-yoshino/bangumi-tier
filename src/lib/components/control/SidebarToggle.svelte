<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";

  let { onclick, isOpen = true } = $props();
</script>

<Button {onclick} variant="ghost" size="icon" class="neo-btn-icon-ghost">
  <!-- Mobile Icon: Bottom Drawer -->
  <!-- Rotates 180deg when closed to point "Up" (Open me) -->
  <span
    class="icon-[material-symbols--bottom-drawer-sharp] h-[1.4rem] w-[1.4rem] transition-transform duration-300 lg:hidden"
    class:rotate-180={!isOpen}
  ></span>

  <!-- Desktop Icon: Sidebar Unfold -->
  <!-- Rotates 180deg when open to look like "Fold" (Close me) -->
  <!-- Or keep standard: Usually 'unfold' icon points right. If open, we might want it pointing left. -->
  <!-- Let's just flip it based on state for visual feedback -->
  <span
    class="icon-[ri--sidebar-unfold-line] hidden h-[1.2rem] w-[1.2rem] transition-transform duration-300 lg:block"
    class:scale-x-[-1]={!isOpen}
  ></span>

  <span class="sr-only">Toggle Sidebar</span>
</Button>
