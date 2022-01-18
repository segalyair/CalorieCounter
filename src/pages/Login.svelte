<script>
    import { onMount } from "svelte";
    import router from "page";
    import {
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
    } from "firebase/auth";
    import { db } from "../../scripts/firebase";
    import { ref, get, set } from "firebase/database";
    let auth, form;
    onMount(() => {
        auth = getAuth();
    });
    async function checkSettings() {
        const settingsRef = ref(db, `settings/${auth.currentUser.uid}/`);
        const snapshot = await get(settingsRef);
        if (!snapshot.val()) {
            set(settingsRef, { isAdmin: false, totalCalories: 2100 });
        }
    }
    async function handleLogin() {
        let result;
        try {
            result = await signInWithEmailAndPassword(
                auth,
                form.email.value,
                form.password.value
            );
            checkSettings();
            router.show("/list");
        } catch (err) {
            console.log(err);
        }
    }
    async function handleRegister() {
        let result;
        try {
            result = await createUserWithEmailAndPassword(
                auth,
                form.email.value,
                form.password.value
            );
            checkSettings();
            router.show("/list");
        } catch (err) {
            console.log(err);
        }
    }
</script>

<div class="container">
    <form bind:this={form} onsubmit="event.preventDefault(); return;">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            label="login.email"
            required={true}
        />
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            label="login.password"
            required={true}
        />
        <div class="actions">
            <button class="outline" on:click={handleRegister}>
                Register
            </button>
            <button on:click={handleLogin}> Login </button>
        </div>
    </form>
</div>

<style>
    form {
        display: flex;
        flex-direction: column;
    }
    input {
        margin-bottom: 2rem;
    }
    .container {
        justify-content: center;
        align-items: center;
    }
    .actions {
        display: grid;
        grid-auto-columns: minmax(0, 1fr);
        grid-auto-flow: column;
        column-gap: 1rem;
        justify-content: space-between;
    }
</style>
