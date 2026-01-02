<script lang="ts">
    import { onMount } from "svelte";
    import { addIndexAndGoto } from "$lib/actions.svelte";
    import { page } from "$app/state";

    onMount(() => {
        addIndexAndGoto(Number(page.params.id));
    });
</script>

<h1 class="prose">Redirecting...</h1>
<p class="prose">Wait a moment.</p>
