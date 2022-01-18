<script>
    import { createEventDispatcher } from "svelte";
    import Modal from "../Modal.svelte";
    import { db } from "../../../scripts/firebase";
    import {
        get,
        query,
        equalTo,
        push,
        update,
        ref,
        orderByChild,
    } from "firebase/database";
    export let modal = undefined,
        userId = undefined;
    let form, foodEntry;
    const dispatch = createEventDispatcher();
    async function handleSubmit() {
        const isEdit = !!foodEntry;
        if (form.name.value.length <= 0) {
            return;
        }
        if (form.calories.value <= 0) {
            return;
        }
        const foodName = form.name.value;
        const foodsRef = ref(db, `food-entries/${userId}/`);
        const snapshot = await get(
            query(foodsRef, orderByChild("name"), equalTo(foodName))
        );
        const identicalFood = snapshot.val();
        if (
            (!isEdit || (isEdit && foodEntry.name != foodName)) &&
            identicalFood &&
            Object.values(identicalFood).some((f) => !f.isArchived)
        ) {
            console.log("Food entry already exists.");
            return;
        }
        modal.toggleLoading();
        if (isEdit) {
            editFood();
        } else {
            addFood();
        }
        modal.close();
    }
    function editFood() {
        try {
            const foodsRef = ref(
                db,
                `food-entries/${userId}/${foodEntry.parentId}/`
            );
            update(foodsRef, {
                id: foodEntry.id,
                name: form.name.value,
                calories: Number(form.calories.value),
                date: new Date().toISOString(),
                isArchived: false,
            });
        } catch (err) {
            console.log(err);
        }
    }
    function addFood() {
        try {
            const foodsRef = ref(db, `food-entries/${userId}/`);
            const newFoodsRef = push(foodsRef);
            push(foodsRef, {
                id: newFoodsRef.key,
                name: form.name.value,
                calories: Number(form.calories.value),
                date: new Date().toISOString(),
                isArchived: false,
            });
        } catch (err) {
            console.log(err);
        }
    }
    function initializeModal() {
        foodEntry = modal.getSettings().data;
        if (!foodEntry) return;
        form.name.value = foodEntry.name;
        form.calories.value = foodEntry.calories;
    }
</script>

<Modal
    bind:this={modal}
    on:open={initializeModal}
    on:close={() => dispatch("close")}
>
    <div slot="content">
        <form bind:this={form}>
            <label for="name">Name</label>
            <input type="text" id="name" />
            <label for="calories">Calories</label>
            <input type="number" id="calories" />
        </form>
    </div>
    <div slot="actions">
        <button type="button" class="outline" on:click={() => modal.close()}>
            Cancel
        </button>
        <button class="primary" type="button" on:click={handleSubmit}>
            Submit
        </button>
    </div>
</Modal>

<style>
    form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 1rem;
    }
</style>
