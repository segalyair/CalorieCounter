<script>
    import { onMount } from "svelte";
    import { db } from "../../scripts/firebase";
    import { set, ref, onValue } from "firebase/database";
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
    const auth = getAuth();
    const settingsRef = ref(db, `settings/${auth.currentUser.uid}/`);
    let form,
        invitationForm,
        invitation = {};
    onMount(() => {
        onValue(settingsRef, (snapshot) => {
            const result = snapshot.val();
            if (form && result) {
                form.maxCalories.value = result.totalCalories;
                form.isAdmin.checked = result.isAdmin;
            }
        });
    });
    function saveSettings() {
        set(settingsRef, {
            totalCalories: Number(form.maxCalories.value),
            isAdmin: form.isAdmin.checked,
        });
    }
    let reg = /[a-zA-Z0-9_\-+.!$%^&*#]/;
    function generateRandomValue() {
        const newChar = String.fromCharCode(
            ...window.crypto.getRandomValues(new Uint8Array(1))
        );
        if (reg.test(newChar)) {
            return newChar;
        }
        return generateRandomValue();
    }
    async function sendInvitation() {
        if (invitationForm.email.value.length <= 0) return;
        if (invitationForm.name.value.length <= 0) return;
        let password = "";
        while (password.length < 10) {
            password += generateRandomValue();
        }
        const credential = await createUserWithEmailAndPassword(
            auth,
            invitationForm.email.value,
            password
        );
        invitation = {
            password,
            token: credential.user.accessToken,
        };
    }
</script>

<div class="container">
    <h3>Settings</h3>
    <form bind:this={form}>
        <label for="maxCalories">Max Calories</label>
        <input id="maxCalories" name="maxCalories" type="number" />
        <label for="isAdmin">Is Admin</label>
        <input id="isAdmin" name="isAdmin" type="checkbox" />
    </form>
    <button on:click={saveSettings}>Save</button>
    <h4>Invite</h4>
    <form bind:this={invitationForm}>
        <label for="name">Name</label>
        <input id="name" name="name" type="text" />
        <label for="email">Email</label>
        <input id="email" name="email" type="email" />
    </form>
    <button on:click={sendInvitation}>Send</button>
    {#if invitation.password}
        <div class="invite-result">
            <h4>Invitation sent</h4>
            <p>Password: {invitation.password}</p>
            <p class="token">Token: {invitation.token}</p>
        </div>
    {/if}
</div>

<style>
    form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        align-items: baseline;
    }
    input {
        width: 250px;
        justify-self: flex-end;
    }
    #isAdmin {
        width: 33px;
    }
    button {
        margin-top: 2rem;
        margin-left: auto;
    }
    .invite-result .token {
        word-break: break-all;
    }
</style>
