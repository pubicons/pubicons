import { render } from "preact";
import { App } from "./pages/App";

import "./styles/main";
import "./styles/font";
import "./styles/variables";
import "./styles/templates";

import "web-touch-ripple";

render(<App />, document.body);