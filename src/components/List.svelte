<script>
    import { onMount } from "svelte";
    import { db } from "../../scripts/firebase";
    import {
        push,
        query,
        orderByChild,
        get,
        set,
        ref,
        onValue,
        equalTo,
    } from "firebase/database";

    import FoodModal from "../components/modals/FoodModal.svelte";
    import PlusButton from "../components/common/PlusButton.svelte";
    import { XIcon } from "svelte-feather-icons";
    export let userId;
    let foodsRef,
        foodEntries = [];
    let foodModal;

    onMount(() => {
        foodsRef = ref(db, `food-entries/${userId}/`);
        getFoods();
    });
    async function getFoods() {
        const snapshot = await get(
            query(foodsRef, orderByChild("isArchived"), equalTo(false))
        );
        const result = snapshot.val();
        foodEntries = result
            ? Object.entries(result).map((f) => {
                  f[1].parentId = f[0];
                  return f[1];
              })
            : [];
    }
    function archiveFoodEntry(foodEntry) {
        const toUpdate = ref(
            db,
            `food-entries/${userId}/${foodEntry.parentId}`
        );
        delete foodEntry.parentId;
        set(toUpdate, { ...foodEntry, isArchived: true });
        getFoods();
    }
</script>

<div class="list">
    <PlusButton callback={() => foodModal.open({ title: "New food entry" })} />
    {#each foodEntries as foodEntry}
        <div
            class="item"
            on:click={() =>
                foodModal.open({ title: "Edit food entry", data: foodEntry })}
        >
            <div class="title">
                <p>{foodEntry.name}</p>
                <div class="icon" on:click|stopPropagation={() => archiveFoodEntry(foodEntry)}>
                    <XIcon size="24" />
                </div>
            </div>
            <p>Calories: {foodEntry.calories}</p>
        </div>
    {/each}
</div>
<FoodModal bind:modal={foodModal} {userId} on:close={() => getFoods()} />

<style>
    .list {
        display: grid;
        align-items: center;
        justify-items: center;
        grid-template-columns: 200px 200px 200px 200px;
        gap: 1rem;
        margin-top: 1rem;
    }
    .item {
        cursor: pointer;
        width: 200px;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 1px solid lightgray;
        padding: 1rem;
        transition: all 200ms;
    }
    .item:hover {
        border: 1px solid var(--positive);
    }
    .item .title {
        display: flex;
        justify-content: space-between;
    }
    .item .title .icon {
        cursor: pointer;
    }
</style>
