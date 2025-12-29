<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { cn } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> =
    $props();

  const id = $props.id();

  // --- Neo-Brutalist Styles ---

  // 1. Input Fields
  // - rounded-none: Sharp edges
  // - border-2: Hard outline
  // - shadow-[...var(--color-border)]: Hard default shadow
  // - focus:shadow-[...var(--color-accent)]: Neon shadow on interaction
  const inputClass =
    "h-12 rounded-none border-2 border-border bg-card font-mono placeholder:text-muted-foreground/50 shadow-[4px_4px_0px_0px_var(--color-border)] transition-all duration-200 focus-visible:ring-0 focus-visible:translate-x-[-2px] focus-visible:translate-y-[-2px] focus-visible:shadow-[6px_6px_0px_0px_var(--color-accent)] hover:shadow-[4px_4px_0px_0px_var(--color-accent)]";

  // 2. Primary Buttons (Action)
  // - Active state: Moves the button DOWN-RIGHT by 4px and removes shadow.
  //   This simulates pressing it flat against the page.
  const btnPrimaryClass =
    "h-12 w-full rounded-none border-2 border-border bg-primary text-xl font-black uppercase text-primary-foreground shadow-[4px_4px_0px_0px_var(--color-border)] transition-all duration-100 hover:bg-primary/90 hover:shadow-[4px_4px_0px_0px_var(--color-accent)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

  // 3. Secondary Buttons (Outline)
  const btnOutlineClass =
    "h-12 w-full rounded-none border-2 border-border bg-card text-lg font-bold uppercase text-foreground shadow-[4px_4px_0px_0px_var(--color-border)] transition-all duration-100 hover:bg-accent hover:text-accent-foreground hover:shadow-[4px_4px_0px_0px_var(--color-accent)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

  // 4. Icon Buttons (Small)
  const btnIconClass =
    "h-12 w-12 rounded-none border-2 border-border bg-accent text-accent-foreground shadow-[4px_4px_0px_0px_var(--color-border)] transition-all hover:bg-accent/80 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";
</script>

<div
  class={cn(
    "flex flex-col gap-6 border-4 border-border bg-card p-6 shadow-[8px_8px_0px_0px_var(--color-border)]",
    className,
  )}
  {...restProps}
>
  <Field.Group>
    <!-- Header Section -->
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="font-mono text-4xl font-black uppercase tracking-tighter">
        Welcome
      </h1>
      <p class="text-sm font-bold uppercase text-muted-foreground">
        Make custom tier of ...
      </p>
    </div>

    <div class="my-4 h-1 w-full border-b-2 border-dashed border-border"></div>

    <!-- Quick Actions -->
    <Field.Field>
      <div class="flex flex-col gap-3">
        <Button class={btnOutlineClass} type="button">Anime Studios</Button>
        <Button class={btnOutlineClass} type="button">Animes</Button>
      </div>
    </Field.Field>

    <!-- Divider with Text -->
    <div class="relative my-4 text-center">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t-2 border-border"></span>
      </div>
      <div class="relative flex justify-center">
        <span
          class="bg-card px-2 font-mono text-xs font-bold uppercase text-muted-foreground"
        >
          Or proceed with
        </span>
      </div>
    </div>

    <!-- BGM Index ID Input -->
    <Field.Field>
      <div class="flex items-center mb-2">
        <Field.Label
          for="index-{id}"
          class="font-mono text-sm font-bold uppercase"
        >
          Bgm Index Id
        </Field.Label>
        <a
          href="##"
          class="ms-auto text-xs font-bold underline decoration-2 underline-offset-4 hover:text-accent-foreground hover:bg-accent"
        >
          What is this?
        </a>
      </div>

      <div class="flex gap-3">
        <Input
          id="index-{id}"
          type="text"
          class={inputClass}
          placeholder="12345..."
        />
        <Button size="icon" class={btnIconClass}>
          <span class="icon-[lucide--arrow-up-right] h-6 w-6"></span>
        </Button>
      </div>
    </Field.Field>

    <div class="my-4 h-1 w-full border-b-2 border-border"></div>

    <!-- User Collection Input -->
    <Field.Field>
      <div class="flex items-center mb-2">
        <Field.Label
          for="bgm_username-{id}"
          class="font-mono text-sm font-bold uppercase"
        >
          Collection
        </Field.Label>
        <a
          href="##"
          class="ms-auto text-xs font-bold underline decoration-2 underline-offset-4 hover:text-accent-foreground hover:bg-accent"
        >
          Find ID
        </a>
      </div>
      <div class="flex gap-3">
        <Input
          id="bgm_username-{id}"
          type="text"
          class={inputClass}
          placeholder="username"
        />
        <Button size="icon" class={btnIconClass}>
          <span class="icon-[lucide--arrow-up-right] h-6 w-6"></span>
        </Button>
      </div>
      <Field.Description
        class="mt-2 text-xs font-bold uppercase text-muted-foreground"
      >
        Your bgm username
      </Field.Description>
    </Field.Field>

    <div class="my-4 h-1 w-full border-b-2 border-border"></div>

    <!-- Footer -->
    <Field.Field>
      <Field.Description class="text-center font-mono text-xs font-bold">
        Don't have a bangumi account?
        <a
          href="https://bgm.tv/signup"
          class="bg-foreground text-background px-1 hover:bg-accent hover:text-accent-foreground"
        >
          Sign up
        </a>
      </Field.Description>
    </Field.Field>
  </Field.Group>
</div>
