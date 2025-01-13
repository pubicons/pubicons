import ControlIcon from "../../assets/svgs/control.svg";
import SignOutIcon from "../../assets/svgs/sign_out.svg";
import HistoryIcon from "../../assets/svgs/history.svg";
import SearchIcon from "../../assets/svgs/search.svg";
import GithubIcon from "../../assets/svgs/github.svg";
import MikeIcon from "../../assets/svgs/mike.svg";

/** @ts-ignore */
import DevTtangkong from "../../assets/images/dev_ttangkong.png";

import { AnimatedTransition, Box, Column, Constraint, ConstraintBuilder, Grid, Row, Scrollable, Text } from "@web-package/react-widgets";
import { TouchRipple } from "web-touch-ripple/jsx";
import { Button } from "../../templates/Button";
import { Profile } from "../../templates/Profile";
import { Template } from "../../templates/Template";
import { useEffect, useRef, useState } from "preact/hooks";
import { MathUtil } from "../../components/math";
import { Render } from "../../templates/Render";
import { useUser } from "../../hooks/useUser";
import { API } from "../../components/api";
import { Util } from "../../components/util";

export function Body() {
    return (
        <>
            <title>PUBICONS - Home</title>
            <Column size="100%">
                <Header.Body />
                <Scrollable.Vertical>
                    <Column maxWidth="var(--content-max-width)" margin="auto">
                        <Content.Banner />
                        <Render.SignInOnly>
                            <Content.History.Body />
                        </Render.SignInOnly>
                        <Content.Body />
                    </Column>
                </Scrollable.Vertical>
            </Column>
        </>
    )
}

namespace Header {
    export function Body() {
        return (
            <Column borderBottom="1px solid var(--rearground-border)" paddingAndGap="var(--padding-df)">
                <TopArea />
                <BottomArea />
            </Column>
        )
    }

    /** The area contains about search and the user profile components. */
    function TopArea() {
        const [_, myProfile] = useUser();
        return (
            <Row align="center">
                <Row width="100%" align="center" gap="var(--padding-sm)">
                    <SearchBar />
                    <SearchVoiceButton />
                </Row>
                <Row width="max-content" flexShrink="0">
                    <Render.SignInOnly>
                        <Button type="secondary" text="Sign Out" icon={SignOutIcon} onTap={() => {}} />
                    </Render.SignInOnly>
                    <Template.ThemeSwitch />
                    <Render.SignInOnly>
                        <TouchRipple onTap={() => {}}>
                            <Box padding="var(--padding-sm)" borderRadius="1e10px">
                                <Profile.With profile={myProfile} size={32} />
                            </Box>
                        </TouchRipple>
                    </Render.SignInOnly>
                </Row>
            </Row>
        )
    }

    function SearchBar() {
        return (
            <Row
                width="100%"
                maxWidth="600px"
                paddingLeft="var(--padding-df)"
                backgroundColor="var(--rearground)"
                borderRadius="1e10px"
            >
                <SearchIcon width="18px" style={{fill: "var(--foreground2)"}} />
                <input placeholder="Enter a name of icons and keywords or alias" style={{
                    width: "100%",
                    padding: "var(--padding-df)"
                }} />
            </Row>
        )
    }

    function SearchVoiceButton() {
        return (
            <TouchRipple onTap={() => {}}>
                <Box display="flex" padding="var(--padding-df)" backgroundColor="var(--rearground)" borderRadius="1e10px">
                    <MikeIcon width="20px" height="20px" />
                </Box>
            </TouchRipple>
        )
    }

    function BottomArea() {
        return (
            <Row>
                <Scrollable.Horizontal>
                    <Row gap="var(--padding-sm)">
                        <Category title="Rounded" selected={true} />
                        <Category title="Sharp" selected={false} />
                        <Category title="Modern" selected={false} />
                        <Category title="Simple" selected={false} />
                        <Category title="Realistic" selected={false} />
                        <Category title="Kidding" selected={false} />
                        <Category title="Cutely" selected={false} />
                        <Category title="Colorful" selected={false} />
                    </Row>
                </Scrollable.Horizontal>
                <Button text="Filter" type="primary" icon={ControlIcon} onTap={() => {}} />
            </Row>
        )
    }
}

namespace Content {
    export enum Status {
        LOADING,
        LOADED,
        EMPTY
    }

    export function Body() {
        const [items, setItems] = useState<API.Organization[]>([]);
        const [status, setStatus] = useState(Status.LOADING);
        const isLoading = status == Status.LOADING;

        useEffect(() => {
            fetch("/api/organization/search?order=latest&count=0").then(async response => {
                if (response.status == 200) {
                    setItems(await response.json());
                    setStatus(Status.LOADED);
                } else if (response.status == 404) {
                    setStatus(Status.EMPTY);
                }
            });
        }, []);

        return (
            <ConstraintBuilder
                usememo={false}
                constraints={[
                    new Constraint(1600, Infinity, 4),
                    new Constraint(1200, 1600, 3),
                    new Constraint(700, 1200, 2),
                    new Constraint(-Infinity, 700, 1)
                ]}
                builder={(rowCount) => {
                    let children;

                    if (isLoading) {
                        children = <>
                            {Array.from({length: 30}).map(() => <PlaceHolder />)}
                        </>
                    } else {
                        children = <>
                            {items.map(item => <Item data={item} />)}
                        </>
                    }

                    return (
                        <AnimatedTransition value={isLoading} animation={{
                            duration: "0.5s",
                            fadeIn : {from: {opacity: 0}, to: {opacity: 1}},
                            fadeOut: {from: {opacity: 1}, to: {opacity: 0}}
                        }}>
                            <Grid rowCount={rowCount} padding="var(--padding-df)" gap='var(--padding-df)' children={children} />
                        </AnimatedTransition>
                    )
                }}
            />
        )
    }

    function Item({data}: {data: API.Organization}) {
        return (
            <TouchRipple onTap={() => {}}>
                <Row paddingAndGap="var(--padding-df)" backgroundColor="var(--rearground)" borderRadius="10px">
                    <ItemProfile data={data} size={"32px"} />
                    <Column gap="var(--padding-sm)">
                        <Column>
                            <Text.h3>{data.displayName}</Text.h3>
                            <Text.span maxLine={2}>{data.introduction}</Text.span>
                        </Column>
                        <Row gap="var(--padding-sm)" marginTop="auto">{
                            data.tags.map(keyword => {
                                return (
                                    <Box padding="5px 10px" backgroundColor="var(--rearground-active)" borderRadius="1e10px">
                                        <Text.span color="var(--foreground2)">{keyword}</Text.span>
                                    </Box>
                                )
                            })
                        }</Row>
                        <Text.span color="var(--foreground3)">{data.starsCount} Stars · {Util.yyyyMmDdOf(data.createdAt)}</Text.span>
                    </Column>
                </Row>
            </TouchRipple>
        )
    }

    function ItemProfile({data, size}: {
        data: API.Organization;
        size: string;
    }) {
        if (data.profileImage) {
            return <img src={""} style={{width: size, height: "32px", borderRadius: "10px"}} />
        } else {
            return (
                <Box
                    size={size}
                    display="flex"
                    justifyContent="center"
                    fontSize={`calc(${size} / 2)`}
                    alignItems="center"
                    color="white"
                    backgroundColor={`rgb(${data.profileColor})`} borderRadius="10px"
                    children={data.displayName[0].toUpperCase()}
                />
            )
        }
    }

    function PlaceHolder() {
        const upperRef = useRef(MathUtil.randomRange(80, 100));
        const lowerRef = useRef(MathUtil.randomRange(40, 80));

        return (
            <Row paddingAndGap="var(--padding-df)">
                <Box className="placeholder" width="50px" height="50px" backgroundColor="var(--rearground)" borderRadius="10px" />
                <Column width="100%" gap="var(--padding-df)">
                    <Box className="placeholder" width={`${upperRef.current}%`} height="30px" backgroundColor="var(--rearground)" borderRadius="10px" />
                    <Box className="placeholder" width={`${lowerRef.current}%`} height="30px" backgroundColor="var(--rearground)" borderRadius="10px" />
                </Column>
            </Row>
        )
    }

    export function Banner() {
        const goToGithub = () => {
            window.open("https://github.com/MTtankkeo");
        }

        return (
            <Box padding="var(--padding-df)" maxWidth="1000px" margin="auto">
                <Row
                    width="100%"
                    height="200px"
                    boxSizing="border-box"
                    backgroundImage="linear-gradient(90deg, rgb(230, 200, 150), rgb(215, 120, 130))"
                    border="3px solid rgba(220, 120, 120)"
                    boxShadow="0px 0px 100px rgba(220, 120, 120, 0.5)"
                    borderRadius="10px"
                >
                    <img src={DevTtangkong} height="100%" />
                    <Column padding="var(--padding-df)" align="centerLeft">
                        <Text.h3 color="black" fontSize="32px" maxLine={1}>DEV TTANGKONG</Text.h3>
                        <Text.span color="rgb(50, 50, 50)" maxLine={3} fontSize="16px">I'm always striving to enhance user experiences as a front-end developer, And studying back-end.</Text.span>
                        <Row marginTop="var(--padding-df)">
                            <Button type="primary" text="Go to Github" icon={GithubIcon} onTap={goToGithub} />
                        </Row>
                    </Column>
                </Row>
            </Box>
        )
    }

    export namespace History {
        export function Body() {
            return (
                <Column margin="var(--padding-df)" paddingAndGap="var(--padding-df)" border="1px dashed var(--background-border)" borderRadius='10px'>
                    <Row align="centerLeft" gap="var(--padding-df)">
                        <HistoryIcon width="24px" />
                        <Column>
                            <h3>Your History</h3>
                            <span>The icons that is you previously downloaded.</span>
                        </Column>
                    </Row>
                    <Scrollable.Horizontal>
                        <Row gap="var(--padding-df)">
                            <Item
                                title="Minecraft Icons"
                                coverURL="https://yt3.googleusercontent.com/_DiGCcjGwJQAZ3zmlyB8TCYuA8O9tDJ9zGNysq5sR0rxwYb6SP5fW8cb3LbfcRwfui0m27oIhA=s900-c-k-c0x00ffffff-no-rj"
                            />
                            <Item
                                title="Bird Icons"
                                coverURL="https://img.freepik.com/premium-vector/bird-colorful-logo-gradient-vector_1131634-35.jpg?semt=ais_hybrid"
                            />
                            <Item
                                title="Cooking Icons"
                                coverURL="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                            />
                        </Row>
                    </Scrollable.Horizontal>
                </Column>
            )
        }

        function Item({title, coverURL}: {
            title: string;
            coverURL: string;
        }) {
            return (
                <TouchRipple onTap={() => {}}>
                    <Row paddingAndGap="var(--padding-df)" backgroundColor="var(--rearground)" borderRadius="10px">
                        <img src={coverURL} style={{width: "32px", height: "32px", borderRadius: "10px"}} />
                        <Column gap="var(--padding-sm)">
                            <Text.h4>{title}</Text.h4>
                            <Text.span color="var(--foreground3)">22.3k · 2024-11-23</Text.span>
                        </Column>
                    </Row>
                </TouchRipple>
            )
        }
    }
}

function Category({title, selected}: {
    title: string;
    selected: boolean;
}) {
    return (
        <TouchRipple onTap={() => {}}>
            <Box
                padding="10px 15px"
                fontSize="14px"
                borderRadius="1e10px"
                backgroundColor={selected ? "var(--foreground)" : "var(--rearground)"}
                color={selected ? "var(--background)" : "var(--foreground)"}
                children={title}
            />
        </TouchRipple>
    )
}