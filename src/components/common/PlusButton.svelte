<script>
    import { PlusIcon } from "svelte-feather-icons";
    export let callback, disabled=false;
</script>

<div class="new-entry" {disabled} on:click={() => !disabled && callback()}>
    <PlusIcon />
</div>

<style>
    .new-entry {
        cursor: pointer;
        border-radius: 4px;
        width: 48px;
        height: 48px;
        color: white;
        background: var(--positive);
    }
    .new-entry[disabled="true"] {
        cursor: not-allowed;
        background: #b3dbcd;
    }
</style>
