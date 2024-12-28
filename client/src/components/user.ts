import { API } from "./api";
import { Storage } from "./storage";

export class User {
    static get isOffline() {
        return this.activeId == null;
    }

    static get activeId() {
        return Storage.get("user-activeId");
    }

    static get accounts(): API.Account[] {
        return Storage.get("user-accounts") ?? [];
    }

    static signIn(account: API.Account) {
        Storage.set("user-activeId", account.userId);
        Storage.set("user-accounts", [...this.accounts.filter(e => e.userId != account.userId), account]);
    }

    static signOut() {
        console.assert(!this.isOffline, "Already not signed-in.");
        Storage.set("user-activeId", null);
    }
}