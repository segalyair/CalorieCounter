<script>
    import { onMount } from "svelte";
    import Modal from "../Modal.svelte";
    import { db } from "../../../scripts/firebase";
    import {
        get,
        query,
        equalTo,
        push,
        ref,
        orderByChild,
        onValue,
    } from "firebase/database";
    import { getAuth } from "firebase/auth";
    export let modal = undefined,
        meal = undefined;
    let foodsRef,
        mealsRef,
        foodEntries = [];
    let selectedFoodEntry;
    const auth = getAuth();
    async function handleAddFoodEntry() {
        if (selectedFoodEntry.length <= 0) {
            return;
        }
        const foodEntrySnapshot = await get(foodsRef);
        const foodEntry = Object.values(foodEntrySnapshot.val()).find(
            (f) => f.name == selectedFoodEntry
        );
        if (!foodEntry) {
            return;
        }
        modal.toggleLoading();
        try {
            push(mealsRef, {
                foodEntryId: foodEntry.id,
                meal,
                date: new Date().toISOString(),
            });
        } catch (err) {
            console.log(err);
        }
        modal.close();
    }
    onMount(async () => {
        foodsRef = query(
            ref(db, `food-entries/${auth.currentUser.uid}/`),
            orderByChild("isArchived"),
            equalTo(false)
        );
        mealsRef = ref(db, `meals/${auth.currentUser.uid}/`);
        const snapshot = await get(foodsRef);
        const result = snapshot.val();
        foodEntries = result
            ? Object.entries(result).map((f) => {
                  f[1].id = f[0];
                  return f[1];
              })
            : [];
    });
</script>

<Modal bind:this={modal}>
    <div slot="content">
        <label for="food-entry">Food Entry</label>
        <input
            bind:value={selectedFoodEntry}
            type="text"
            id="food-entry"
            list="food-entries"
        />
        <datalist id="food-entries">
            {#each foodEntries as foodEntry}
                <option value={foodEntry.name} />
            {/each}
        </datalist>
    </div>
    <div slot="actions">
        <button type="button" class="outline" on:click={() => modal.close()}>
            Cancel
        </button>
        <button class="primary" type="button" on:click={handleAddFoodEntry}>
            Submit
        </button>
    </div>
</Modal>
