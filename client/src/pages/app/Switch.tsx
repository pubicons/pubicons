import Logo from "../../assets/svgs/logo.svg";
import HomeIcon from "../../assets/svgs/home.svg";
import HomeFilledIcon from "../../assets/svgs/home-filled.svg";
import CompassIcon from "../../assets/svgs/compass.svg";
import CompassFilledIcon from "../../assets/svgs/compass-filled.svg";
import CommunityIcon from "../../assets/svgs/community.svg";
import CommunityFilledIcon from "../../assets/svgs/community-filled.svg";
import UserIcon from "../../assets/svgs/user.svg";
import UserFilledIcon from "../../assets/svgs/user-filled.svg";
import LeftArrowIcon from "../../assets/svgs/arrow_left.svg";

import { AnimatedTransition, Box, Column, Row, Scrollable, Text } from "@web-package/react-widgets";
import { SVGJSX } from "../../types/types";
import { TouchRipple } from "web-touch-ripple/jsx";

export function SwitchPage() {
    return (
        <Row size="100%">
            <SideBar.Body />
            <Column padding="var(--padding-df)">
                <h1>Hello, World!</h1>
            </Column>
        </Row>
    )
}

namespace SideBar {
    export function Body() {
        return (
            <Column
                backgroundColor="var(--rearground)"
                borderRadius="0px 15px 15px 0px"
            >
                <Row align="center" gap="10px" padding="var(--padding-df)">
                    <Logo width="24px" />
                    <Text.h1 fontSize="20px">PUBICONS</Text.h1>
                    <Box padding="5px 10px" fontSize="14px" color="var(--foreground3)" border="1px solid var(--rearground-border)" borderRadius="1e10px">
                        Dev
                    </Box>
                </Row>
                <Column height="100%" padding="var(--padding-df) 0px">
                    <Scrollable.Vertical>
                        <SwitchItem active={true} normalIcon={HomeIcon} activeIcon={HomeFilledIcon} text="Home" />
                        <SwitchItem active={false} normalIcon={CompassIcon} activeIcon={CompassFilledIcon} text="Navigation" />
                        <SwitchItem active={false} normalIcon={CommunityIcon} activeIcon={CommunityFilledIcon} text="Community" />
                        <SwitchItem active={false} normalIcon={UserIcon} activeIcon={UserFilledIcon} text="User" />
                    </Scrollable.Vertical>
                    <Item icon={LeftArrowIcon} text="Close" />
                </Column>
            </Column>
        )
    }

    function Item({icon, text}: {
        icon: SVGJSX;
        text: string;
    }) {
        const Icon = icon;
        return (
            <TouchRipple onTap={() => {}}>
                <Row align="centerLeft" padding="var(--padding-df)" marginRight="var(--padding-df)" borderRadius="0px 1e10px 1e10px 0px">
                    <Icon width="18px" height="18px" />
                    <Text marginLeft="var(--padding-df)">{text}</Text>
                </Row>
            </TouchRipple>
        )
    }

    function SwitchItem({normalIcon, activeIcon, active, text}: {
        normalIcon: SVGJSX;
        activeIcon: SVGJSX;
        active: boolean;
        text: string;
    }) {
        const NormalIcon = normalIcon;
        const ActiveIcon = activeIcon;
        return (
            <TouchRipple onTap={active ? undefined : () => {}}>
                <Row
                    align="centerLeft"
                    padding="var(--padding-df)"
                    marginRight="var(--padding-df)"
                    borderRadius="0px 1e10px 1e10px 0px"
                    backgroundColor={active ? "var(--rearground-active)" : undefined}
                    transitionProperty="background-color"
                    transitionDuration="0.3s"
                >
                    <AnimatedTransition value={active} animation={{
                        duration: "0.3s",
                        fadeIn : {from: {opacity: "0"}, to: {opacity: "1"}},
                        fadeOut: {from: {opacity: "1"}, to: {opacity: "0"}}
                    }}>
                        {active /* Whether current is active */
                            ? <ActiveIcon width="18px" height="18px" />
                            : <NormalIcon width="18px" height="18px" />
                        }
                    </AnimatedTransition>
                    <Text marginLeft="var(--padding-df)">{text}</Text>
                </Row>
            </TouchRipple>
        )
    }
}