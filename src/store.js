import { writable } from "svelte/store";

export const currentRoute = writable(null);
export const currentHistory = writable(0);