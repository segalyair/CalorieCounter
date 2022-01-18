<script>
    import { onMount } from "svelte";
    import { currentHistory } from "../store";
    import { db } from "../../scripts/firebase";
    import { push, ref, onValue } from "firebase/database";
    import { getAuth } from "firebase/auth";
    import MealList from "../components/MealList.svelte";
    import { MONTHS } from "../../scripts/constants";
    import { ChevronLeftIcon } from "svelte-feather-icons";
    import { ChevronRightIcon } from "svelte-feather-icons";
    let titleDate,
        totalCalories = { Breakfast: 0, Lunch: 0, Dinner: 0 },
        settingsCalories = 2100;
    const auth = getAuth();
    const maxHistory = 7;
    $: totalCaloriesValue = Object.values(totalCalories).reduce(
        (a, b) => a + b,
        0
    );
    onMount(() => {
        const settingsRef = ref(db, `settings/${auth.currentUser.uid}/`);
        onValue(settingsRef, (snapshot) => {
            const result = snapshot.val();
            if (result) {
                settingsCalories = result.totalCalories;
            }
        });
        currentHistory.subscribe((h) => {
            getTitleDate();
        });
    });
    function getTitleDate() {
        let d = new Date();
        d = new Date(d.setDate(d.getDate() - $currentHistory));
        titleDate = `${MONTHS[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
    }
    function getTotalCalories() {}
    function changeDate(by) {
        currentHistory.set($currentHistory + by);
    }
</script>

<div class="container">
    <div class="title">
        <h3>Meals for {titleDate}</h3>
        <div class="navigator">
            <div
                class="icon"
                on:click={() => changeDate(1)}
                disabled={$currentHistory == maxHistory}
            >
                <ChevronLeftIcon size="24" />
            </div>
            <div
                class="icon"
                on:click={() => changeDate(-1)}
                disabled={$currentHistory == 0}
            >
                <ChevronRightIcon size="24" />
            </div>
        </div>
    </div>
    <MealList
        meal="Breakfast"
        limit="3"
        on:change={(e) => (totalCalories.Breakfast = e.detail)}
    />
    <MealList
        meal="Lunch"
        limit="5"
        on:change={(e) => (totalCalories.Lunch = e.detail)}
    />
    <MealList
        meal="Dinner"
        limit="2"
        on:change={(e) => (totalCalories.Dinner += e.detail)}
    />
    <p class="calories-total">
        You have consumed a total of {totalCaloriesValue} calories out of {settingsCalories}
        today.
    </p>
    {#if totalCaloriesValue > settingsCalories}
        <p class="calorie-warning">
            You have passed the calorie limit for today.
        </p>
    {/if}
</div>

<style>
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid lightgray;
    }
    .navigator {
        display: flex;
    }
    .calories-total {
        margin-top: 2rem;
    }
    .icon {
        cursor: pointer;
        user-select: none;
    }
    .icon[disabled="true"] {
        color: lightgray;
        pointer-events: none;
    }
    .calorie-warning {
        font-weight: 700;
    }
</style>
