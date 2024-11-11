import { Box } from "@web-package/react-widgets";
import { JSX, render } from "preact";

export namespace Popup {
    export function open(component: JSX.Element) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "center";
        wrapper.style.alignItems = "center";
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.position = "fixed";
        wrapper.style.zIndex = "999";
        wrapper.style.backgroundColor = "rgb(0, 0, 0, 0.5)";
        wrapper.style.backdropFilter = "blur(2px)"
        wrapper.style.opacity = "0";
        wrapper.style.transitionProperty = "opacity, backdrop-filter";
        wrapper.style.transitionDuration = "0.3s";
        document.body.appendChild(wrapper);

        wrapper.getBoundingClientRect(); // reflow
        wrapper.style.opacity = "1";
        wrapper.onclick = event => {
            if (event.target == wrapper) {
                wrapper.style.opacity = "0";
                wrapper.style.pointerEvents = "none";
                wrapper.addEventListener('transitionend', (event) => {
                    // Ignores other elements except for the wrapper.
                    if (event.target === wrapper) {
                        wrapper.remove();
                    }
                });
            }
        }

        render(<Wrapper body={component} />, wrapper);
    }

    export function Wrapper({body}: {body: JSX.Element}) {
        return (
            <Box
                backgroundColor="var(--background)"
                borderRadius="15px"
                padding="15px"
                children={body}
            />
        )
    }
}