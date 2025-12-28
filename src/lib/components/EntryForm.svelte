<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
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
  <Card.Root>
    <Card.Header class="text-center">
      <Card.Title class="text-xl">Welcome back</Card.Title>
      <Card.Description>Make custom tier of ...</Card.Description>
    </Card.Header>
    <Card.Content>
      <form>
        <FieldGroup>
          <Field>
            <Button variant="outline" type="button">Anime Studios</Button>
            <Button variant="outline" type="button">Animes</Button>
          </Field>
          <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
            Or proceed with
          </FieldSeparator>
          <Field>
            <FieldLabel for="email-{id}">Bangumi Index Id</FieldLabel>
            <Input
              id="email-{id}"
              type="text"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <div class="flex items-center">
              <FieldLabel for="password-{id}">Password</FieldLabel>
              <a
                href="##"
                class="ms-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password-{id}" type="password" required />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
            <FieldDescription class="text-center">
              Don't have an account? <a href="##">Sign up</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Card.Content>
  </Card.Root>
</div>
