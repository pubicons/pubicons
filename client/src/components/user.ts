import { API } from "./api";
import { Storage } from "./storage";
import { UserProfile } from "./user_profile";

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

    /** This instance is the current my profile self information. */
    static profile?: UserProfile = this.isOffline ? undefined : new UserProfile(this.activeId);

    static signIn(account: API.Account) {
        Storage.set("user-activeId", account.userId);
        Storage.set("user-accounts", [...this.accounts.filter(e => e.userId != account.userId), account]);
        this.profile = new UserProfile(account.userId);
    }

    static signOut() {
        console.assert(!this.isOffline, "Already not signed-in.");
        Storage.set("user-activeId", null);
    }
}