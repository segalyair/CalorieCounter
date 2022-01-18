<script>
    import { getAuth } from "firebase/auth";
    import List from "../components/List.svelte";
    const auth = getAuth();
</script>

<div class="container">
    <h3>Food Entries</h3>
    <List userId={auth.currentUser.uid} />
</div>
