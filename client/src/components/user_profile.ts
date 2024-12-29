import { StatusListener } from "../types/types";
import { API } from "./api";

export type UserProfileStatusListener = StatusListener<UserProfileStatus>;
export enum UserProfileStatus {
    NONE = "none",
    LOADING = "loading",
    LOADED = "loaded",
    ERROR = "error"
}

export class UserProfile {
    private _status = UserProfileStatus.NONE;
    private _statusListeners: UserProfileStatusListener[] = [];

    private _displayName: string;
    private _email: string;
    private _alias: string;
    private _profileImage: string;
    private _profileColor: string;

    get status() {
        return this._status;
    }
    set status(newStatus: UserProfileStatus) {
        if (this._status != newStatus) {
            this.notifyStatusListeners(this._status = newStatus);
        }
    }

    get displayName() {
        console.assert(!this._displayName, "Reference not allowed yet.");
        return this._displayName;
    }

    get email() {
        console.assert(!this._email, "Reference not allowed yet.");
        return this._email;
    }

    get alias() {
        console.assert(!this._alias, "Reference not allowed yet.");
        return this._alias;
    }

    get profileImage() {
        console.assert(!this._profileImage, "Reference not allowed yet.");
        return this._profileImage;
    }

    get profileColor() {
        console.assert(!this._profileColor, "Reference not allowed yet.");
        return this._profileColor;
    }

    constructor(uuid: string) {
        this.status = UserProfileStatus.LOADING;

        fetch(`/api/profile?uuid=${uuid}`).then(async result => {
            if (result.status == 200) {
                const response = await result.json() as API.Profile;
                this._displayName = response.displayName;
                this._email = response.email;
                this._alias = response.alias;
                this._profileImage = response.profileImage;
                this._profileColor = response.profileColor;
                this.status = UserProfileStatus.LOADED;
            } else {
                this.status = UserProfileStatus.ERROR;
            }
        });
    }

    notifyStatusListeners(newStatus: UserProfileStatus) {
        this._statusListeners.forEach(l => l(newStatus));
    }

    addStatusListener(listener: UserProfileStatusListener) {
        console.assert(!this._statusListeners.includes(listener), "Already exists a given listener.");
        this._statusListeners.push(listener);
    }

    removeStatusListener(listener: UserProfileStatusListener) {
        console.assert(this._statusListeners.includes(listener), "Already not exists a given listener.");
        this._statusListeners = this._statusListeners.filter(l => l != listener);
    }
}