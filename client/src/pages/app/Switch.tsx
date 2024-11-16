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

import { AnimatedFoldable, AnimatedTransition, Box, Column, Row, Scrollable, Text } from "@web-package/react-widgets";
import { SVGJSX } from "../../types/types";
import { TouchRipple } from "web-touch-ripple/jsx";
import { useState } from "preact/hooks";
import { Route, Router } from "@web-package/react-widgets-router";
import { HomePage } from "./Home";

export function SwitchPage() {
    return (
        <Row size="100%">
            <SideBar.Body />
            <Column size="100%">
                <Router>
                    <Route path="/a" component={HomePage} default={true} />
                </Router>
            </Column>
        </Row>
    )
}

namespace SideBar {
    export function Body() {
        const [isFold, setFold] = useState(false);

        return (
            <Column backgroundColor="var(--rearground)" borderRadius="0px 15px 15px 0px">
                <Row align="centerLeft" gap="10px" padding="var(--padding-df)" marginBottom="var(--padding-sm)">
                    <Logo width="24px" />
                    <AnimatedFoldable.Horizontal visible={!isFold} duration="0.3s" transition={{opacity: true}}>
                        <Text.h1 fontSize="20px" paddingRight="var(--padding-df)">PUBICONS</Text.h1>
                    </AnimatedFoldable.Horizontal>
                </Row>
                <Scrollable.Vertical>
                    <SwitchItem active={true} normalIcon={HomeIcon} activeIcon={HomeFilledIcon} text="Home" folded={isFold} />
                    <SwitchItem active={false} normalIcon={CompassIcon} activeIcon={CompassFilledIcon} text="Navigation" folded={isFold} />
                    <SwitchItem active={false} normalIcon={CommunityIcon} activeIcon={CommunityFilledIcon} text="Community" folded={isFold} />
                    <SwitchItem active={false} normalIcon={UserIcon} activeIcon={UserFilledIcon} text="User" folded={isFold} />
                </Scrollable.Vertical>
                <Column marginBottom="var(--padding-df)">
                    <Item icon={LeftArrowIcon} text="Close" folded={isFold} onTap={() => setFold(!isFold)} />
                </Column>
            </Column>
        )
    }

    function Item({folded, onTap, icon, text}: {
        folded: boolean;
        onTap: VoidFunction;
        icon: SVGJSX;
        text: string;
    }) {
        const Icon = icon;
        return (
            <TouchRipple onTap={onTap}>
                <Row
                    align="centerLeft"
                    color="var(--foreground)"
                    padding="var(--padding-df)"
                    marginRight="var(--padding-df)"
                    borderRadius="0px 1e10px 1e10px 0px"
                >
                    <Icon width="18px" height="18px" />
                    <AnimatedFoldable.Horizontal visible={!folded} duration="0.3s" overflow="visible" transition={{opacity: true}}>
                        <Text marginLeft="var(--padding-df)">{text}</Text>
                    </AnimatedFoldable.Horizontal>
                </Row>
            </TouchRipple>
        )
    }

    function SwitchItem({normalIcon, activeIcon, active, folded, text}: {
        normalIcon: SVGJSX;
        activeIcon: SVGJSX;
        active: boolean;
        folded: boolean;
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
                    fill={active ? "var(--foreground)" : "var(--foreground2)"}
                    color={active ? "var(--foreground)" : "var(--foreground2)"}
                    backgroundColor={active ? "var(--rearground-active)" : undefined}
                    transitionProperty="background-color, color"
                    transitionDuration="0.3s"
                >
                    <Box size="18px">
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
                    </Box>
                    <AnimatedFoldable.Horizontal visible={!folded} duration="0.3s" overflow="visible" transition={{opacity: true}}>
                        <Text marginLeft="var(--padding-df)">{text}</Text>
                    </AnimatedFoldable.Horizontal>
                </Row>
            </TouchRipple>
        )
    }
}