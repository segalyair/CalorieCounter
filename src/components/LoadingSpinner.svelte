<script>
    import Spinner from "svelte-spinner";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    export let isLoading = false;
    export let backgroundColor = "transparent";
    export let size = 250;
    let container;
    onMount(() => {
        container.style.backgroundColor = backgroundColor;
        container.style.zIndex = 100;
    });
</script>

<div
    bind:this={container}
    transition:fade={{ duration: 100 }}
    class="loading"
    class:notLoading={!isLoading}
>
    <Spinner {size} speed="650" color="#1b6dc1" thickness="1.5" gap="40" />
</div>

<style>
    .notLoading {
        display: none !important;
    }
    .loading {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
