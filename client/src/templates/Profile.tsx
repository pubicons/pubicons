import { Box } from "@web-package/react-widgets";

export namespace Profile {
    export function Default({color, name, size}: {
        color: string;
        name: string;
        size: number;
    }) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={`${size}px`}
                height={`${size}px`}
                backgroundColor={color}
                borderRadius="1e10px"
                pointerEvents="none"
                fontSize={`${size / 2}px`}
                children={name[0]}
            />
        )
    }
}