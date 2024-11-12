import WebIcon from "../assets/svgs/web.svg";
import SunIcon from "../assets/svgs/sun.svg";
import MoonIcon from "../assets/svgs/moon.svg";

import { Box, Column, Text } from "@web-package/react-widgets";
import { ReactNode, useContext } from "preact/compat";
import { TouchRipple } from "web-touch-ripple/jsx";
import { AppContext } from "../pages/App";
import { SettingsBinding } from "../settings/settings_binding";

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

    export function ThemeSwitch() {
        const setApp = useContext(AppContext);
        const isDark = document.body.className == "dark";

        const onToggle = () => {
            if (isDark) {
                SettingsBinding.setValue("theme", "light");
                setApp("Update theme to light");
            } else {
                SettingsBinding.setValue("theme", "dark");
                setApp("Update theme to dark");
            }
        }

        return (
            <TouchRipple onTap={onToggle}>
                <Column position="relative" display="flex" borderRadius="1e10px" overflow="clip">
                    <SunIcon width="24px" style={{
                        padding: "var(--padding-df)",
                        opacity: isDark ? "0" : "1",
                        transform: isDark ? "translateY(-100%)" : "translateY(0%)",
                        transitionProperty: "transform, opacity",
                        transitionDuration: "0.3s"
                    }} />
                    <MoonIcon width="24px" style={{
                        position: "absolute",
                        padding: "var(--padding-df)",
                        opacity: isDark ? "1" : "0",
                        transform: isDark ? "translateY(-0%)" : "translateY(100%)",
                        transitionProperty: "transform, opacity",
                        transitionDuration: "0.3s"
                    }} />
                </Column>
            </TouchRipple>
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