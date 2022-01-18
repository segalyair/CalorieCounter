<script>
    import { onMount } from "svelte";
    import { initializeFirebase } from "../scripts/firebase";
    import { getAuth } from "firebase/auth";
    import { initializeRouter } from "./router";
    import { currentRoute } from "./store";
    import Header from "./components/Header.svelte";
    let ready = false,
        auth;
    onMount(() => {
        initializeFirebase();
        auth = getAuth();
        auth.onAuthStateChanged((u) => {
            initializeRouter();
            ready = true;
        });
    });
</script>

{#if ready && $currentRoute}
    <Header />
    <main>
        <svelte:component this={$currentRoute.component} />
    </main>
{/if}

<style>
    main {
        display: flex;
        padding: 0.5rem;
        width: 100%;
        height: calc(100% - var(--header-height));
    }
</style>
