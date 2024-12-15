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

export function Body() {
    return (
        <>
            <title>PUBICONS - Home</title>
            <Column size="100%">
                <Header.Body />
                <Scrollable.Vertical>
                    <Column maxWidth="var(--content-max-width)" margin="auto">
                        <Content.Banner />
                        <Content.History.Body />
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
        return (
            <Row align="center">
                <Row width="100%" align="center" gap="var(--padding-sm)">
                    <SearchBar />
                    <SearchVoiceButton />
                </Row>
                <Row width="max-content" flexShrink="0">
                    <Button type="secondary" text="Sign Out" icon={SignOutIcon} onTap={() => {}} />
                    <Template.ThemeSwitch />
                    <TouchRipple onTap={() => {}}>
                        <Box padding="var(--padding-sm)" borderRadius="1e10px">
                            <Profile.Default color="rgb(150, 150, 232)" name="D" size={32} />
                        </Box>
                    </TouchRipple>
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
    export function Body() {
        const [isLoading, setLoading] = useState(true);

        useEffect(() => {
            fetch("/api/organization/search?order=latest&count=0").then(response => {
                // TODO
            });

            setTimeout(() => setLoading(false), 2000); // 임시 로직
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
                            <Item
                                title="Minceraft Icons"
                                details="You need to use this icons template that is simply design."
                                coverURL="https://yt3.googleusercontent.com/_DiGCcjGwJQAZ3zmlyB8TCYuA8O9tDJ9zGNysq5sR0rxwYb6SP5fW8cb3LbfcRwfui0m27oIhA=s900-c-k-c0x00ffffff-no-rj"
                                keywords={["Rounded", "Modern"]}
                            />
                            <Item
                                title="Bird Icons"
                                details="You need to use this icons template that is modern design."
                                coverURL="https://img.freepik.com/premium-vector/bird-colorful-logo-gradient-vector_1131634-35.jpg?semt=ais_hybrid"
                                keywords={["Modern"]}
                            />
                            <Item
                                title="Cooking Icons"
                                details="You need to use this icons template that is modern design."
                                coverURL="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                                keywords={["Rounded", "Modern"]}
                            />
                            <Item
                                title="Logo Icons"
                                details="You need to use this icons template that is modern design."
                                coverURL="data:image/png;base64,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"
                                keywords={["Rounded", "Modern"]}
                            />
                            <Item
                                title="Discord Icons"
                                details="You need to use this icons template that is modern design."
                                coverURL="data:image/png;base64,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"
                                keywords={["Rounded", "Modern"]}
                            />
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

    function Item({title, details, coverURL, keywords}: {
        title: string;
        details: string;
        coverURL: string;
        keywords: string[];
    }) {
        return (
            <TouchRipple onTap={() => {}}>
                <Row paddingAndGap="var(--padding-df)" backgroundColor="var(--rearground)" borderRadius="10px">
                    <img src={coverURL} style={{width: "32px", height: "32px", borderRadius: "10px"}} />
                    <Column gap="var(--padding-sm)">
                        <Column>
                            <Text.h3>{title}</Text.h3>
                            <Text.span maxLine={2}>{details}</Text.span>
                        </Column>
                        <Row gap="var(--padding-sm)">{
                                keywords.map(keyword => {
                                    return (
                                        <Box padding="5px 10px" backgroundColor="var(--rearground-active)" borderRadius="1e10px">
                                            <Text.span color="var(--foreground2)">{keyword}</Text.span>
                                        </Box>
                                    )
                                })
                            }</Row>
                        <Text.span color="var(--foreground3)">4.9☆ · 22.3k · 2024-11-23</Text.span>
                    </Column>
                </Row>
            </TouchRipple>
        )
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
                                title="Minceraft Icons"
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