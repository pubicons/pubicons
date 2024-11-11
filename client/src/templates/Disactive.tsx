import { Box } from "@web-package/react-widgets";
import { ReactNode } from "preact/compat";

export function Disactive({active, children}: {
    active: boolean;
    children: ReactNode;
}) {
    return (
        <Box
            opacity={active ? "1" : "0.5"}
            pointerEvents={active ? undefined : "none"}
            userSelect={active ? undefined : "none"}
            transitionProperty="opacity"
            transitionDuration="0.3s"
            children={children}
        />
    )
}