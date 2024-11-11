import WebIcon from "../assets/svgs/web.svg";

import { Box, Column, Text } from "@web-package/react-widgets";
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

    export namespace Popup {
        export function Error({title, message}: {
            title: string;
            message: string;
        }) {
            return (
                <Column align="center" gap="var(--padding-sm)" padding="var(--padding-df)">
                    <WebIcon width="50px" />
                    <Column align="center">
                        <Text.h2>{title}</Text.h2>
                        <Text.span>{message}</Text.span>
                    </Column>
                </Column>
            )
        }
    }
}