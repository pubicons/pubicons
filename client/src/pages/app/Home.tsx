import { Column } from "@web-package/react-widgets";

export function HomePage() {
    return (
        <Column paddingAndGap="var(--padding-df)">
            <Column>
                <h2>Your History</h2>
                <span>The icons that is you previously downloaded.</span>
            </Column>
        </Column>
    )
}