import router from "page"
import { currentRoute } from "./store.js";
import Home from "./pages/Home.svelte"
import Login from "./pages/Login.svelte"
import List from "./pages/List.svelte"
import Settings from "./pages/Settings.svelte"
import Forbidden from "./pages/Forbidden.svelte"
import Meals from "./pages/Meals.svelte"
import Admin from "./pages/Admin.svelte"
import { getAuth } from "firebase/auth";
import { db } from "../scripts/firebase";
import { ref, get, set } from "firebase/database";

export const routes = {
    home: { href: "/", label: "Home", component: Home },
    login: { href: "/login", label: "Login", component: Login },
    list: { href: "/list", label: "Food Entries", component: List },
    meals: { href: "/meals", label: "Meals", component: Meals },
    settings: { href: "/settings", label: "Settings", component: Settings },
    admin: { href: "/admin", label: "Admin", component: Admin }
}

export function initializeRouter() {

    const auth = getAuth();
    router("/", () => {
        currentRoute.set(routes.home);
    });
    router("/login", () => {
        let user = auth.currentUser;
        if (!user || user.isAnonymous) {
            currentRoute.set(routes.login);
        }
        else {
            router.show("/list")
        }
    });
    router("/settings", () => {
        let user = auth.currentUser;
        if (user && !user.isAnonymous) {
            currentRoute.set(routes.settings);
        }
        else {
            currentRoute.set({ component: Forbidden })

        }
    });
    router("/list", () => {
        let user = auth.currentUser;
        if (user && !user.isAnonymous) {
            currentRoute.set(routes.list);
        }
        else {
            currentRoute.set({ component: Forbidden })
        }
    });
    router("/meals", () => {
        let user = auth.currentUser;
        if (user && !user.isAnonymous) {
            currentRoute.set(routes.meals);
        }
        else {
            currentRoute.set({ component: Forbidden })
        }
    });
    router("/admin", async () => {
        let user = auth.currentUser;
        if (!user || user.isAnonymous) {
            currentRoute.set({ component: Forbidden });
        }
        const settingsRef = ref(db, `settings/${auth.currentUser.uid}/`);
        const snapshot = await get(settingsRef);
        const { isAdmin } = snapshot.val();
        if (isAdmin) {
            currentRoute.set(routes.admin);
        }
        else {
            currentRoute.set({ component: Forbidden })
        }
    });

    router.start();

}