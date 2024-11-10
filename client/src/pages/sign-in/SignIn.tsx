import GoogleLogo from "../../assets/svgs/google.svg";
import GitHubLogo from "../../assets/svgs/github.svg";

import { Box, Column, Row, Text } from "@web-package/react-widgets";
import { Template } from "../../templates/Template";
import { Input } from "../../templates/Input";
import { TouchRipple } from "web-touch-ripple/jsx";
import { ColumnList } from "../../templates/List";

export function SignInPage() {
    return (
        <>
            <title>PUBICONS - Sign In</title>
            <Template.Area>
                <Column gap="var(--padding-df)">
                    <Column>
                        <Text.h1>Sign In</Text.h1>
                        <Text.span color="var(--foreground2)">Sign-In to Access Free and Premium Icons</Text.span>
                    </Column>
                    <Column gap="var(--padding-sm)">
                        <Input.Text type="email" design="area" placeholder="Email or Alias" />
                        <Input.Text type="password" design="area" placeholder="Password" />
                    </Column>
                    <SplitLineWithOR />
                    <ColumnList.Divider>
                        <TouchRipple onTap={() => {}}>
                            <Row align="centerLeft" paddingAndGap="var(--padding-df)">
                                <GoogleLogo width="24px" />
                                Sign in With Google
                            </Row>
                        </TouchRipple>
                        <TouchRipple onTap={() => {}}>
                            <Row align="centerLeft" paddingAndGap="var(--padding-df)">
                                <GitHubLogo width="24px" />
                                Sign in With GitHub
                            </Row>
                        </TouchRipple>
                    </ColumnList.Divider>
                    <button className="primary">Done</button>
                </Column>
            </Template.Area>
        </>
    )
}

function SplitLineWithOR() {
    return (
        <Box position="relative" width="100%" height="1px" margin="10px 0px" backgroundColor="var(--rearground-border)">
            <Box
                position="absolute"
                padding="0px var(--padding-df)"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                backgroundColor="var(--rearground)"
                color="var(--foreground3)"
                children="OR"
            />
        </Box>
    )
}