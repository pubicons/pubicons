import { Route, Router } from "@web-package/react-widgets-router";
import { LandingPage } from "./Landing";
import { SwitchPage } from "./app/Switch";
import { NotFoundPage } from "./NotFound";
import { SignInPage } from "./sign-in/SignIn";

export function App() {
    return (
        <Router>
            <Route path="/" component={LandingPage} />
            <Route path="/app" component={SwitchPage} />
            <Route path="/sign-in" component={SignInPage} />
            <Route path="" component={NotFoundPage} default={true} />
        </Router>
    )
}