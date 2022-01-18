<script>
    import { onMount } from "svelte";
    import router from "page";
    import { currentRoute } from "../store";
    import { routes } from "../router.js";
    import { getAuth } from "firebase/auth";
    import { db } from "../../scripts/firebase";
    import { ref, get, set, onValue } from "firebase/database";
    let auth = getAuth(),
        currentUser,
        admin = false;
    onMount(() => {
        auth.onAuthStateChanged((u) => {
            currentUser = u;
            if (currentUser && !currentUser.isAnonymous) {
                const settingsRef = ref(
                    db,
                    `settings/${auth.currentUser.uid}/`
                );
                onValue(settingsRef, (snapshot) => {
                    const val = snapshot.val();
                    if (val) {
                        admin = val.isAdmin;
                    }
                });
            }
        });
    });
    function logout() {
        auth.signOut();
        router.show("/");
    }
</script>

<div class="header">
    {#if !currentUser}
        <a
            class="item"
            class:active={$currentRoute.href == "/login"}
            href={routes.login.href}
        >
            {routes.login.label}
        </a>
    {/if}
    {#if currentUser}
        <a class="item" href={"#"} on:click={logout}> Logout </a>
        {#if admin}
            <a
                class="item"
                class:active={$currentRoute.href == "/admin"}
                href={routes.admin.href}
            >
                {routes.admin.label}
            </a>
        {/if}
        <a
            class="item"
            class:active={$currentRoute.href == "/settings"}
            href={routes.settings.href}
        >
            {routes.settings.label}
        </a>
        <a
            class="item"
            class:active={$currentRoute.href == "/meals"}
            href={routes.meals.href}
        >
            {routes.meals.label}
        </a>
        <a
            class="item"
            class:active={$currentRoute.href == "/list"}
            href={routes.list.href}
        >
            {routes.list.label}
        </a>
    {/if}
    <a
        class="item"
        class:active={$currentRoute.href == "/"}
        href={routes.home.href}
    >
        {routes.home.label}
    </a>
</div>

<style>
    .header {
        background: var(--header-background);
        height: var(--header-height);
        display: flex;
        padding: 0 1rem;
        align-items: center;
        flex-direction: row-reverse;
    }
    .header .item {
        position: relative;
        margin: 0 1rem;
        user-select: none;
        text-decoration: unset;
        color: #fff;
    }
    .header .item.active:after {
        content: "";
        bottom: -2px;
        left: 0;
        position: absolute;
        height: 1px;
        width: 100%;
        background: #fff;
    }
</style>
