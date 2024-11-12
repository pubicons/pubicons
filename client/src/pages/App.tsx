import { Route, Router } from "@web-package/react-widgets-router";
import { LandingPage } from "./Landing";
import { SwitchPage } from "./app/Switch";
import { NotFoundPage } from "./NotFound";
import { SignInPage } from "./sign-in/SignIn";
import { createContext } from "preact";
import { Dispatch, StateUpdater, useState } from "preact/hooks";
import { SettingsBinding } from "../settings/settings_binding";

/** This context is used to change the state of all components globally. */
export const AppContext = createContext<Dispatch<StateUpdater<string>>>(null);

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

    return (
        <AppContext.Provider value={setState}>
            <Router>
                <Route path="/" component={LandingPage} />
                <Route path="/app" component={SwitchPage} />
                <Route path="/sign-in" component={SignInPage} />
                <Route path="" component={NotFoundPage} default={true} />
            </Router>
        </AppContext.Provider>
    )
}