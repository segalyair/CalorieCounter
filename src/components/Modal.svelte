<script>
    import { XIcon } from "svelte-feather-icons";
    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    import LoadingSpinner from "./LoadingSpinner.svelte";
    const dispatch = createEventDispatcher();
    let visible = false,
        isLoading = false,
        settings;
    export function open(data) {
        settings = data;
        visible = true;
        setTimeout(() => dispatch("open"));
    }
    export function toggleLoading() {
        isLoading = !isLoading;
    }
    export function close() {
        isLoading = false;
        visible = false;
        dispatch("close");
    }
    export function getSettings() {
        return settings;
    }
</script>

{#if visible}
    <div class="transition" transition:fade={{ duration: 200 }}>
        <div
            class="container"
            style="pointer-events:{isLoading
                ? 'none'
                : 'auto'};user-select:{isLoading ? 'none' : 'auto'}"
            on:mousedown={close}
        >
            <div class="modal" on:mousedown|stopPropagation>
                {#if isLoading}
                    <LoadingSpinner
                        size={100}
                        {isLoading}
                        backgroundColor={"rgba(0, 0, 0, 0.05)"}
                    />
                {/if}
                <div class="modal-title">
                    <h2>{settings.title}</h2>
                    <div class="icon-container" on:click={close}>
                        <XIcon size="18" />
                    </div>
                </div>
                <div class="content-slot">
                    <slot name="content" />
                </div>
                <div class="actions-slot">
                    <slot name="actions" />
                </div>
            </div>
        </div>
    </div>
    <div transition:fade={{ duration: 200 }}>
        <slot name="background" />
    </div>
{/if}

<style>
    .transition {
        position: relative;
        z-index: 1;
    }
    .container {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
    }
    .content-slot {
        flex-grow: 1;
        padding: 20px 0;
    }
    .modal {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 150px;
        min-height: 150px;
        width: auto;
        height: auto;
        background-color: white;
        border-radius: 4px;
        padding: 2rem;
    }
    .modal-title {
        height: auto;
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        user-select: none;
    }
    .icon-container {
        cursor: pointer;
        margin-left: 5px;
    }
    .content-slot {
        max-height: 90vh;
        max-width: 80vw;
        overflow-y: auto;
    }
    .actions-slot {
        padding-top: 0.5em;
        height: auto;
        display: flex;
        justify-content: center;
    }
</style>
