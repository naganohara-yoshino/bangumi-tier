<script lang="ts">
    import { onMount } from "svelte";
    import { addIndexAndGoto } from "$lib/actions.svelte";
    import { page } from "$app/state";
    import { m } from "$lib/paraglide/messages";

    onMount(() => {
        addIndexAndGoto(Number(page.params.id));
    });
</script>

<h1 class="prose">Redirecting...</h1>
<p class="prose">{m.please_wait()}</p>
