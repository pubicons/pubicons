import { Route, Router } from "@web-package/react-widgets-router";
import { LandingPage } from "./Landing";
import { SwitchPage } from "./app/Switch";

export function App() {
    return (
        <Router>
            <Route path="/" component={LandingPage} />
            <Route path="/app" component={SwitchPage} />
        </Router>
    )
}