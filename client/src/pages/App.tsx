import { Route, Router } from "@web-package/react-widgets-router";
import { SwitchPage } from "./app/Switch";
import { LandingPage } from "./Landing";
import { NotFoundPage } from "./NotFound";
import { SignInPage } from "./sign-in/SignIn";
import { SignUpPage } from "./sign-up/SignUp";
import { createContext } from "preact";
import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks";
import { SettingsBinding } from "../settings/settings_binding";
import { User } from "../components/user";
import { UserProfile, UserProfileStatus } from "../components/user_profile";

/** This context is used to change the state of all components globally. */
export const AppContext = createContext<Dispatch<StateUpdater<string>>>(null);

/** This instance is the current my profile self information. `temp-logic` */
const myProfile = new UserProfile(User.activeId);

export function App() {
    const [_, setState] = useState<string>("");

    // Insert className dark theme into body element when a user is dark mode.
    if (SettingsBinding.getValue("theme") == null) {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.body.className = "dark";
        }
    } else {
        document.body.className = SettingsBinding.getValue("theme");
    }

    useEffect(() => {
        let listener;
        myProfile.addStatusListener(listener = (status: UserProfileStatus) => {
            if (status == UserProfileStatus.LOADED) console.log(myProfile.alias);
        });

        return () => myProfile.removeStatusListener(listener);
    });

    return (
        <AppContext.Provider value={setState}>
            <Router>
                <Route path="/" component={LandingPage} />
                <Route path="/app" component={SwitchPage} />
                <Route path="/sign-in" component={SignInPage} />
                <Route path="/sign-up" component={SignUpPage} />
                <Route path="" component={NotFoundPage} default={true} />
            </Router>
        </AppContext.Provider>
    )
}