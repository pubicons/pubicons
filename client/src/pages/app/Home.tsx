import HistoryIcon from "../../assets/svgs/history.svg";
import SearchIcon from "../../assets/svgs/search.svg";
import MikeIcon from "../../assets/svgs/mike.svg";

import { Box, Column, Row, Scrollable, Text } from "@web-package/react-widgets";
import { TouchRipple } from "web-touch-ripple/jsx";

export function HomePage() {
    return (
        <Column>
            <Header />
            <Content />
        </Column>
    )
}

function Header() {
    return (
        <Column borderBottom="1px solid var(--rearground-border)" paddingAndGap="var(--padding-df)">
            <HeaderTop />
            <HeaderBottom />
        </Column>
    )
}

function HeaderTop() {
    return (
        <Row align="center" gap="var(--padding-sm)">
            <HeaderSearchBar />
            <HeaderSearchVoice />
        </Row>
    )
}

function HeaderSearchBar() {
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

function HeaderSearchVoice() {
    return (
        <TouchRipple onTap={() => {}}>
            <Box display="flex" padding="var(--padding-df)" backgroundColor="var(--rearground)" borderRadius="1e10px">
                <MikeIcon width="20px" height="20px" />
            </Box>
        </TouchRipple>
    )
}

function HeaderBottom() {
    return (
        <Row>
            <Scrollable.Horizontal>
                <Row gap="var(--padding-sm)">
                    <Category title="Rounded" selected={true} />
                    <Category title="Sharp" selected={false} />
                    <Category title="Modern" selected={false} />
                    <Category title="Simple" selected={false} />
                    <Category title="Realistic" selected={false} />
                </Row>
            </Scrollable.Horizontal>
            <button className="primary">Filter</button>
        </Row>
    )
}

function Content() {
    return (
        <Column padding="var(--padding-df)">
            <Row align="centerLeft" paddingAndGap="var(--padding-df)">
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
                </Row>
            </Scrollable.Horizontal>
        </Column>
    )
}

function Category({title, selected}: {
    title: string;
    selected: boolean;
}) {
    return (
        <Box
            padding="10px 15px"
            fontSize="14px"
            borderRadius="1e10px"
            backgroundColor={selected ? "var(--foreground)" : "var(--rearground)"}
            color={selected ? "var(--background)" : "var(--foreground)"}
            children={title}
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
                        <Text.span>{details}</Text.span>
                        <Text.span>{keywords.map(e => `#${e}`).join(" ")}</Text.span>
                    </Column>
                    <Text.span color="var(--foreground3)">4.9☆ · 22.3k · 2024-11-23</Text.span>
                </Column>
            </Row>
        </TouchRipple>
    )
}