<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { currentHistory } from "../store";
    import { XIcon } from "svelte-feather-icons";
    import MealModal from "../components/Modals/MealModal.svelte";
    import PlusButton from "../components/common/PlusButton.svelte";
    import { getAuth } from "firebase/auth";
    import { db } from "../../scripts/firebase";
    import {
        remove,
        get,
        query,
        equalTo,
        push,
        ref,
        orderByChild,
        onValue,
        orderByKey,
        startAt,
        endAt,
    } from "firebase/database";
    export let meal,
        limit = 3;
    const auth = getAuth();
    const dispatch = createEventDispatcher();
    let mealModal,
        mealsRef,
        foodEntriesRef,
        mealsRefByDate,
        foodEntries = [];
    function getEatenAtTime(date) {
        const d = new Date(Date.parse(date));
        const minutes = Number(d.getMinutes());
        return `${d.getHours()}:${
            minutes < 10 ? "0" + minutes.toString() : minutes.toString()
        }`;
    }
    onMount(async () => {
        foodEntriesRef = ref(db, `food-entries/${auth.currentUser.uid}/`);
        mealsRef = ref(db, `meals/${auth.currentUser.uid}/`);
        currentHistory.subscribe((h) => {
            const beginDate = new Date(
                new Date().setUTCHours(24 * -h, 0, 0, 0)
            ).toISOString();
            const endDate = new Date(
                new Date().setUTCHours(23 + 24 * -h, 59, 59, 0)
            ).toISOString();
            mealsRefByDate = query(
                mealsRef,
                orderByChild("date"),
                startAt(beginDate),
                endAt(endDate)
            );
            onValue(mealsRefByDate, async (snapshot) => {
                let result = [];
                const mealEntries = snapshot.val();
                for (let key in mealEntries) {
                    const mealEntry = mealEntries[key];
                    if (mealEntry.meal == meal) {
                        const foodEntrySnapshot = await get(
                            query(
                                foodEntriesRef,
                                orderByChild("id"),
                                equalTo(mealEntry.foodEntryId)
                            )
                        );
                        //TODO: Check if foodEntry exists, if not, it means it was deleted, delete it from the meals
                        const foodEntry = Object.values(
                            foodEntrySnapshot.val()
                        )[0];
                        mealEntry.id = key;
                        foodEntry.date = mealEntry.date;
                        foodEntry.mealEntry = mealEntry;
                        result.push(foodEntry);
                    }
                }
                foodEntries = result;
                dispatch(
                    "change",
                    foodEntries
                        .map((f) => f.calories)
                        .reduce((a, b) => a + b, 0)
                );
            });
        });
    });
    function deleteMeal(foodEntry) {
        const toRemove = ref(
            db,
            `meals/${auth.currentUser.uid}/${foodEntry.mealEntry.id}`
        );
        remove(toRemove);
    }
</script>

<h4>{meal} - {foodEntries.length} / {limit} Food entries</h4>
<div class="list">
    <PlusButton
        disabled={foodEntries.length + 1 > limit || $currentHistory != 0}
        callback={() => mealModal.open({ title: "Add food" })}
    />
    {#each foodEntries as foodEntry}
        <div class="item">
            <div class="title">
                <p>{foodEntry.name}</p>
                <div class="icon" on:click={() => deleteMeal(foodEntry)}>
                    <XIcon size="24" />
                </div>
            </div>
            <p>Calories: {foodEntry.calories}</p>
            <p>Eaten at: {getEatenAtTime(foodEntry.date)}</p>
        </div>
    {/each}
</div>
<MealModal bind:modal={mealModal} {meal} />

<style>
    .list {
        display: grid;
        align-items: center;
        justify-items: center;
        grid-template-columns: 200px 200px 200px 200px;
        gap: 1rem;
    }
    .item,
    .new-entry {
        width: 200px;
        border-radius: 4px;
    }
    .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 1px solid lightgray;
        padding: 1rem;
    }
    .item .title {
        display: flex;
        justify-content: space-between;
    }
    .item .title .icon {
        cursor: pointer;
    }
    .new-entry {
        width: 48px;
        height: 48px;
    }
</style>
