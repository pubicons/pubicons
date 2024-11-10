import { render } from "preact";
import { App } from "./pages/App";

import "./styles/main";
import "./styles/font";
import "./styles/variables";
import "./styles/templates";
import "./styles/keyframes";

import "web-touch-ripple";

addEventListener("load", () => render(<App />, document.body));
addEventListener("load", () => {
    document.body.style.animation = "page_fade-in 0.5s";
})
addEventListener("beforeunload", () => {
    document.body.style.animation = "page_fade-out 0.5s";
    document.body.style.animationFillMode = "backwards";
});