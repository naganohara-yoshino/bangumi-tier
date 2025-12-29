<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { cn } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> =
    $props();

  const id = $props.id();
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
  <Field.Group>
    <div class="flex flex-col items-center gap-1 text-center">
      <h1 class="text-2xl font-bold">Welcome back</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Make custom tier of ...
      </p>
    </div>
    <Field.Separator />
    <Field.Field>
      <Button variant="outline" type="button">Anime Studios</Button>
      <FieldSeparator />
      <Button variant="outline" type="button">Animes</Button>
    </Field.Field>
    <Field.Separator class="*:data-[slot=field-separator-content]:bg-card">
      Or proceed with
    </Field.Separator>
    <Field.Field>
      <div class="flex items-center">
        <Field.Label for="index-{id}">Index Id</Field.Label>
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
    </Field.Field>
    <Field.Separator />
    <Field.Field>
      <div class="flex items-center">
        <Field.Label for="bgm_username-{id}">Personal Collection</Field.Label>
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
      <Field.Description>Your bgm username</Field.Description>
    </Field.Field>
    <Field.Separator />
    <Field.Field>
      <Field.Description class="text-center">
        Don't have a bangumi account? <a href="https://bgm.tv/signup">Sign up</a
        >
      </Field.Description>
    </Field.Field>
  </Field.Group>
</div>
