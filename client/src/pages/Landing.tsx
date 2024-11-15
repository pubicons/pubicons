import { Box, Column, Row, Text } from "@web-package/react-widgets";
import Logo from "../assets/svgs/logo.svg";
import { RouterBinding } from "@web-package/react-widgets-router";
import { l10n } from "../localization/localization";
import { useEffect, useRef, useState } from "preact/hooks";
import { Template } from "../templates/Template";

export function LandingPage() {
    const highlightRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        // Delay by the page transition animation duration.
        setTimeout(() => {
            highlightRef.current.style.boxShadow = "0px 0px 150px var(--primary)";
        }, 300);
    }, []);

    return (
        <>
            <title>PUBICONS</title>
            <Column maxWidth="1200px" padding="15px" margin="auto">
                <Row align="centerSpaceBetween">
                    <Row align="center" gap="10px">
                        <Logo width="24px" />
                        <Text.h1 fontSize="20px">PUBICONS</Text.h1>
                        <Box backgroundColor="var(--rearground)" padding="5px 10px" fontSize="14px" color="var(--foreground3)" borderRadius="1e10px">
                            Dev
                        </Box>
                    </Row>
                    <Row align="centerRight">
                        <Template.ThemeSwitch />
                        <button className="primary" onClick={() => RouterBinding.instance.push("/sign-in")}>{l10n["sign-in"]["title"]}</button>
                        <button className="secondary" onClick={() => RouterBinding.instance.push("/sign-up")}>{l10n["sign-up"]["title"]}</button>
                    </Row>
                </Row>
                <Column gap="15px" align="center" margin="100px 0px">
                    <Text.h2 fontSize="48px">{l10n["landing"]["title"]}</Text.h2>
                    <Text.span fontSize="18px" color="var(--foreground2)" alignment="center" maxWidth="600px">{l10n["landing"]["description"]}</Text.span>
                    <Row gap="10px">
                        <button className="primary" onClick={() => RouterBinding.instance.push("/app")}>{l10n["get_started"]}</button>
                        <button className="tertiary" onClick={() => window.open("https://docs.pubicons.com")}>{l10n["landing"]["go_to_document"]}</button>
                    </Row>
                </Column>
                <Box
                    position="relative"
                    width="100%"
                    height="500px"
                    padding="var(--padding-df)"
                    boxSizing="border-box"
                    backgroundColor="var(--rearground)"
                    borderRadius="15px"
                    border="1px solid var(--rearground-border)"
                    color="var(--foreground3)"
                >
                    <CodeBlockContent />
                    <Box
                        ref={highlightRef}
                        position="absolute"
                        width="100%"
                        height="100%"
                        top="0px"
                        left="0px"
                        borderRadius="15px"
                        opacity="0.3"
                        boxShadow="0px 0px 0px var(--primary)"
                        transitionDuration="2s"
                        transitionProperty="box-shadow"
                    />
                </Box>
            </Column>
        </>
    )
}

function CodeBlockContent() {
    const text = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30"><path d="M22.258 0C19.997 0 17.799 1 16 2.666 14.15.952 11.824-.018 9.513 0 7.075.02 4.653 1.13 2.821 3.144c-3.761 4.139-3.762 10.731 0 14.87l9.363 10.302c2.04 2.245 5.591 2.245 7.632 0l9.363-10.302c3.761-4.14 3.761-10.731 0-14.87C27.299 1.074 24.777 0 22.258 0Zm0 3.01c1.691 0 3.383.735 4.716 2.202 2.665 2.933 2.666 7.8 0 10.734l-9.363 10.302c-.884.973-2.338.973-3.222 0L5.026 15.946c-2.665-2.933-2.665-7.802 0-10.734 2.662-2.93 6.77-2.93 9.431 0h.002a2.101 2.101 0 0 0 3.082 0h.002c1.333-1.467 3.023-2.201 4.715-2.201zm-6.914.13-.006.004v-.002c.001-.002.006-.001.006-.002zm1.312 0c.002.001.005 0 .006.002v.002l-.006-.004z"/></svg>`;
    const [ count, setCount ] = useState<number>(0);

    useEffect(() => {
        function handleText(count: number) {
            setCount(count + 1);

            // Delay and defines to next the text content.
            if (count != text.length) setTimeout(() => handleText(count + 1), 1);
        }

        handleText(count);
    }, []);

    return (
        <>
            {text.slice(0, count) + "◀"}
        </>
    )
}