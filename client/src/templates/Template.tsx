import { Box } from "@web-package/react-widgets";
import { ReactNode } from "preact/compat";

export namespace Template {
    export function Area({children}: {children: ReactNode}) {
        return (
            <Box display="flex" size="100%" justifyContent="center" alignItems="center">
                <Box
                    padding="var(--padding-lg)"
                    backgroundColor="var(--rearground)"
                    borderRadius="15px"
                    children={children}
                />
            </Box>
        )
    }
}