import { Box, Column } from "@web-package/react-widgets";
import { Fragment, JSX } from "preact";

export namespace ColumnList {
    export function Divider({children}: {
        children: JSX.Element[];
    }) {
        return (
            <Column backgroundColor="var(--rearground-in-background)" borderRadius="10px" overflow="hidden">
                {children.map((child, index) => (
                    <Fragment key={index}>
                        {index > 0 && (
                            <Box padding="0px 15px" boxSizing="border-box">
                                <Box width="100%" height="1px" backgroundColor="var(--rearground-border)" />
                            </Box>
                        )}
                        {child}
                    </Fragment>
                ))}
            </Column>
        );
    }
}