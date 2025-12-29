<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldDescription,
    FieldSeparator,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { cn } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> =
    $props();

  const id = $props.id();
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
  <FieldGroup>
    <div class="flex flex-col items-center gap-1 text-center">
      <h1 class="text-2xl font-bold">Welcome back</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Make custom tier of ...
      </p>
    </div>
    <FieldSeparator />
    <Field>
      <Button variant="outline" type="button">Anime Studios</Button>
      <FieldSeparator />
      <Button variant="outline" type="button">Animes</Button>
    </Field>
    <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
      Or proceed with
    </FieldSeparator>
    <Field>
      <div class="flex items-center">
        <FieldLabel for="index-{id}">Index Id</FieldLabel>
        <a href="##" class="ms-auto text-sm underline-offset-4 hover:underline">
          What is index id?
        </a>
      </div>

      <div class="grid grid-cols-6 gap-4">
        <Input id="index-{id}" type="text" class="col-span-5" />
        <Button size="icon" class="col-span-1">
          <span class="icon-[lucide--arrow-up-right]"></span>
        </Button>
      </div>
      <!-- <FieldDescription>Id found in the URL of any bgm index.</FieldDescription> -->
    </Field>
    <FieldSeparator />
    <Field>
      <div class="flex items-center">
        <FieldLabel for="bgm_username-{id}">Personal Collection</FieldLabel>
        <a href="##" class="ms-auto text-sm underline-offset-4 hover:underline">
          What is username?
        </a>
      </div>
      <div class="grid grid-cols-6 gap-4">
        <Input id="bgm_username-{id}" type="text" class="col-span-5" />
        <Button size="icon" class="col-span-1">
          <span class="icon-[lucide--arrow-up-right]"></span>
        </Button>
      </div>
      <FieldDescription>Your bgm username</FieldDescription>
    </Field>
    <FieldSeparator />
    <Field>
      <FieldDescription class="text-center">
        Don't have a bangumi account? <a href="https://bgm.tv/signup">Sign up</a
        >
      </FieldDescription>
    </Field>
  </FieldGroup>
</div>
