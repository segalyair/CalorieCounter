<script>
    import { onMount } from "svelte";
    import { MONTHS } from "../../scripts/constants";
    import { db } from "../../scripts/firebase";
    import { getAuth } from "firebase/auth";
    import {
        push,
        query,
        orderByChild,
        get,
        set,
        ref,
        onValue,
        equalTo,
        startAt,
    } from "firebase/database";
    import List from "../components/List.svelte";
    let usersFoodEntries = [];
    let totalFoodEntries = { twoWeeks: 0, oneWeek: 0 };
    let averageCalorie = 0;
    const auth = getAuth();
    onMount(async () => {
        let userFoodEntriesRef = ref(db, `food-entries/`);
        let snapshot = await get(userFoodEntriesRef);
        usersFoodEntries = snapshot.val();

        totalFoodEntries.twoWeeks = await getTotalFoodEntries(
            new Date().setUTCHours(24 * -14, 0, 0, 0),
            new Date().setUTCHours(24 * -7, 0, 0, 0)
        );
        totalFoodEntries.oneWeek = await getTotalFoodEntries(
            new Date().setUTCHours(24 * -7, 0, 0, 0),
            new Date().valueOf()
        );
        averageCalorie = await getAverageCalories();
    });
    async function getTotalFoodEntries(startDate, endDate) {
        let result = 0;
        Object.values(usersFoodEntries).forEach((u) => {
            const foodEntries = Object.values(u).filter((f) => {
                const parsedDate = Date.parse(f.date);
                return parsedDate >= startDate && parsedDate <= endDate;
            });
            result += foodEntries.length;
        });
        return result;
    }
    async function getAverageCalories() {
        let userCalories = [];
        Object.values(usersFoodEntries).forEach((u) => {
            const foodEntries = Object.values(u).filter((f) => {
                const parsedDate = Date.parse(f.date);
                return parsedDate >= new Date().setUTCHours(24 * -7, 0, 0, 0);
            });
            userCalories.push(
                foodEntries.map((f) => f.calories).reduce((a, b) => a + b, 0) /
                    7
            );
        });
        return (
            userCalories.reduce((a, b) => a + b, 0) / userCalories.length
        ).toFixed(2);
    }
    function getDate(reduceBy) {
        let d = new Date();
        d = new Date(d.setDate(d.getDate() - reduceBy));
        return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
</script>

<div class="container">
    <h3>Data</h3>
    <div class="data">
        <h4>Number of food entries introduced:</h4>
        <div class="grid">
            <span>
                Between {getDate(14)} and {getDate(7)}:
            </span>
            <span class:hasValue={totalFoodEntries.twoWeeks > 0}
                >{totalFoodEntries.twoWeeks}</span
            >
            <span>Between {getDate(7)} and Today:</span>
            <span class:hasValue={totalFoodEntries.oneWeek > 0}
                >{totalFoodEntries.oneWeek}</span
            >
        </div>
        <br />
        <div class="grid">
            <h4>Average number of calories for all users last week:</h4>
            <span class:hasValue={averageCalorie > 0}>{averageCalorie}</span>
        </div>
    </div>
    <h3>All Users Food entries</h3>
    {#each Object.keys(usersFoodEntries) as userId}
        <h4>
            {auth.currentUser.uid == userId ? "Your food entries:" : userId}
        </h4>
        <List {userId} />
        <br />
    {/each}
</div>

<style>
    h3 {
        border-bottom: 1px solid lightgray;
        padding-bottom: 1rem;
    }
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: baseline;
        gap: 2rem;
    }
    .grid > *:nth-child(even) {
        justify-self: center;
        font-size: 30px;
    }
    .grid > *:nth-child(even).hasValue {
        color: var(--header-background);
    }
</style>
