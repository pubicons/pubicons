import { Box, Column, Row, Text } from "@web-package/react-widgets";
import Logo from "../assets/svgs/logo.svg";

export function LandingPage() {
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
                    <Row>
                        <button className="primary">Sign In</button>
                        <button className="secondary">Sign Up</button>
                    </Row>
                </Row>
                <Column gap="15px" align="center" margin="100px 0px">
                    <Text.h2 fontSize="48px">PUBLISH OR SEARCH ICONS</Text.h2>
                    <Text.span fontSize="18px" color="var(--foreground2)" alignment="center" maxWidth="600px">Visual Studio Code with GitHub Copilot supercharges your code with AI-powered suggestions, right in your editor.</Text.span>
                    <Row gap="10px">
                        <button className="primary">Get Started</button>
                        <button className="tertiary" onClick={() => window.open("https://docs.pubicons.com")}>Go to document</button>
                    </Row>
                </Column>
                <Box
                    width="100%"
                    height="500px"
                    backgroundColor="var(--rearground)"
                    borderRadius="15px"
                    border="1px solid var(--rearground-border)"
                />
            </Column>
        </>
    )
}