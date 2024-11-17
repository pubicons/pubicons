import { Box, Column, Row, Scrollable } from "@web-package/react-widgets";

export function HomePage() {
    return (
        <Column paddingAndGap="var(--padding-df)">
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

function Category({title, selected}: {
    title: string;
    selected: boolean;
}) {
    return (
        <Box
            padding="10px 15px"
            borderRadius="1e10px"
            backgroundColor={selected ? "var(--rearground)" : "transparent"}
            border="1px solid var(--rearground-border)"
            children={title}
        />
    )
}