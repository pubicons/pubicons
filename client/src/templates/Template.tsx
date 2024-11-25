import WebIcon from "../assets/svgs/web.svg";
import SunIcon from "../assets/svgs/sun.svg";
import MoonIcon from "../assets/svgs/moon.svg";

import { Box, Column, Text } from "@web-package/react-widgets";
import { ReactNode, useContext, useLayoutEffect, useState } from "preact/compat";
import { TouchRipple } from "web-touch-ripple/jsx";
import { AppContext } from "../pages/App";
import { SettingsBinding } from "../settings/settings_binding";
import { Loading } from "./Loading";

export namespace Template {
    export function FormWrapper({children, loading = false}: {
        children: ReactNode;
        loading?: boolean;
    }) {
        const [isActive, setActive] = useState(loading);

        useLayoutEffect(() => {
            if (loading) {
                setActive(true);
            } else {
                // Delay 300 ms for the transition animation.
                setTimeout(() => setActive(false), 300);
            }
        }, [loading]);

        return (
            <Box display="flex" size="100%" justifyContent="center" alignItems="center">
                <Box
                    overflow="hidden"
                    position="relative"
                    padding="var(--padding-lg)"
                    backgroundColor="var(--rearground)"
                    borderRadius="15px"
                    pointerEvents={loading ? "none" : undefined}
                    userSelect={loading ? "none" : undefined}
                >
                    {children}
                    <Box
                        display="flex"
                        position="absolute"
                        justifyContent="center"
                        alignItems="center"
                        top="0px"
                        left="0px"
                        size="100%"
                        backgroundColor="rgb(0, 0, 0, 0.25)"
                        pointerEvents="none"
                        opacity={isActive ? "1" : "0"}
                        transitionProperty="opacity"
                        transitionDuration="0.3s"
                    >
                        {isActive ? <Loading.Circle size="40px" /> : <></>}
                    </Box>
                </Box>
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