<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "$lib/utils.js";
  import { m } from "$lib/paraglide/messages.js";
  import type { HTMLAttributes } from "svelte/elements";
  import {
    addIndexAndGoto,
    gotoDerector,
    gotoStudio,
    gotoSeasonal,
    gotoUserCollection,
  } from "$lib/actions.svelte";

  let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> =
    $props();

  let initialIndexId: number | undefined = $state();
  let isIndexLoading = $state(false);

  let initialUsername: string | undefined = $state();
  let isUsernameLoading = $state(false);

  let isStudioLoading = $state(false);
  let isDirectorLoading = $state(false);
  let isSeasonalLoading = $state(false);

  const id = $props.id();
</script>

<div class={cn("flex flex-col gap-4 neo-panel p-5", className)} {...restProps}>
  <Field.Group>
    <!-- Header Section -->
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="font-mono text-4xl font-black uppercase tracking-tighter">
        {m.welcome()}
      </h1>
      <p class="text-sm font-bold uppercase text-muted-foreground">
        {m.app_description()}
      </p>
    </div>

    <div class="my-3 h-1 w-full border-b-2 border-dashed border-border"></div>

    <!-- Quick Actions -->
    <Field.Field>
      <div class="flex flex-col gap-3">
        <Button
          class="neo-btn-outline"
          type="button"
          onclick={() => {
            isStudioLoading = true;
            gotoStudio();
          }}
        >
          <span class="relative">
            {m.anime_studios()}
            {#if isStudioLoading}
              <span
                class="icon-[line-md--loading-loop] absolute left-full ml-2 h-6 w-6"
              ></span>
            {/if}
          </span>
        </Button>
        <Button
          class="neo-btn-outline"
          type="button"
          onclick={() => {
            isDirectorLoading = true;
            gotoDerector();
          }}
        >
          <span class="relative">
            {m.anime_director()}
            {#if isDirectorLoading}
              <span
                class="icon-[line-md--loading-loop] absolute left-full ml-2 h-6 w-6"
              ></span>
            {/if}
          </span>
        </Button>
        <Button
          class="neo-btn-outline"
          type="button"
          onclick={() => {
            isSeasonalLoading = true;
            gotoSeasonal();
          }}
        >
          <span class="relative">
            {m.seasonal_anime()}
            {#if isSeasonalLoading}
              <span
                class="icon-[line-md--loading-loop] absolute left-full ml-2 h-6 w-6"
              ></span>
            {/if}
          </span>
        </Button>
      </div>
    </Field.Field>

    <!-- Divider with Text -->
    <div class="relative mt-3 mb-1 text-center">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t-2 border-border"></span>
      </div>
      <div class="relative flex justify-center">
        <span
          class="bg-card px-2 font-mono text-xs font-bold uppercase text-muted-foreground"
        >
          {m.or_proceed_with()}
        </span>
      </div>
    </div>

    <!-- BGM Index ID Input -->
    <Field.Field>
      <div class="flex items-center">
        <Field.Label
          for="index-{id}"
          class="font-mono text-sm font-bold uppercase"
        >
          Bgm {m.index()} Id
        </Field.Label>
        <a
          href="https://bgm.tv/index"
          target="_blank"
          class="ms-auto text-xs font-bold underline decoration-2 underline-offset-4 hover:text-accent-foreground hover:bg-accent"
        >
          {m.index_plaza()}
        </a>
      </div>

      <form
        class="flex gap-3"
        onsubmit={(e) => {
          e.preventDefault();
          if (initialIndexId !== undefined) {
            isIndexLoading = true;
            addIndexAndGoto(initialIndexId);
          }
        }}
      >
        <Input
          id="index-{id}"
          type="text"
          class="neo-input"
          placeholder="86319"
          bind:value={initialIndexId}
        />
        <Button size="icon" class="neo-btn-icon-action" type="submit">
          {#if isIndexLoading}
            <span class="icon-[line-md--loading-loop] h-6 w-6"></span>
          {:else}
            <span class="icon-[lucide--arrow-up-right] h-6 w-6"></span>
          {/if}
        </Button>
      </form>
    </Field.Field>

    <div class="mt-3 mb-1 h-1 w-full border-b-2 border-border"></div>

    <!-- User Collection Input -->
    <Field.Field>
      <div class="flex items-center">
        <Field.Label
          for="bgm_username-{id}"
          class="font-mono text-sm font-bold uppercase"
        >
          {m.collection_recap()}
        </Field.Label>
        <Popover.Root>
          <Popover.Trigger
            class="ms-auto text-xs font-bold underline decoration-2 underline-offset-4 hover:text-accent-foreground hover:bg-accent"
          >
            {m.find_your_username()}
          </Popover.Trigger>
          <Popover.Content class="neo-popover-content w-70 p-4">
            <p class="font-mono text-sm font-semibold text-wrap">
              {m.username_instruction()}
            </p>
          </Popover.Content>
        </Popover.Root>
      </div>

      <form
        class="flex gap-3"
        onsubmit={(e) => {
          e.preventDefault();
          if (initialUsername !== undefined) {
            isUsernameLoading = true;
            gotoUserCollection(initialUsername);
          }
        }}
      >
        <Input
          id="bgm_username-{id}"
          type="text"
          class="neo-input"
          placeholder="sai"
          bind:value={initialUsername}
        />
        <Button size="icon" class="neo-btn-icon-action" type="submit">
          {#if isUsernameLoading}
            <span class="icon-[line-md--loading-loop] h-6 w-6"></span>
          {:else}
            <span class="icon-[lucide--arrow-up-right] h-6 w-6"></span>
          {/if}
        </Button>
      </form>
      <Field.Description
        class="mt-2 text-xs font-bold uppercase text-muted-foreground"
      >
        {m.your_bgm_username()}
      </Field.Description>
    </Field.Field>

    <div class="my-3 h-1 w-full border-b-2 border-border"></div>

    <!-- Footer -->
    <Field.Field>
      <Field.Description class="text-center font-mono text-xs font-bold">
        {m.no_account()}
        <a
          href="https://bgm.tv/signup"
          class="bg-foreground text-background px-1 hover:bg-accent hover:text-accent-foreground"
        >
          {m.sign_up()}
        </a>
      </Field.Description>
    </Field.Field>
  </Field.Group>
</div>
