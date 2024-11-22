import SearchIcon from "../../assets/svgs/search.svg";
import MikeIcon from "../../assets/svgs/mike.svg";
import { Box, Column, Row, Scrollable } from "@web-package/react-widgets";
import { TouchRipple } from "web-touch-ripple/jsx";

export function HomePage() {
    return (
        <Column paddingAndGap="var(--padding-df)">
            <Header />
            <Column>
                <h2>Your History</h2>
                <span>The icons that is you previously downloaded.</span>
            </Column>
            <Scrollable.Horizontal>
                <Row gap="var(--padding-sm)">
                    <Category title="Rounded" selected={true} />
                    <Category title="Sharp" selected={false} />
                    <Category title="Modern" selected={false} />
                    <Category title="Simple" selected={false} />
                    <Category title="Realistic" selected={false} />
                </Row>
            </Scrollable.Horizontal>
        </Column>
    )
}

function Header() {
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

function Category({title, selected}: {
    title: string;
    selected: boolean;
}) {
    return (
        <Box
            padding="10px 15px"
            fontSize="14px"
            borderRadius="1e10px"
            backgroundColor={selected ? "var(--rearground)" : "transparent"}
            border="1px solid var(--rearground-border)"
            children={title}
        />
    )
}