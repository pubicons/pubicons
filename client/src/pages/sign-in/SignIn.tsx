import GoogleLogo from "../../assets/svgs/google.svg";
import GitHubLogo from "../../assets/svgs/github.svg";

import { Box, Column, Row, Text } from "@web-package/react-widgets";
import { Template } from "../../templates/Template";
import { Input } from "../../templates/Input";
import { TouchRipple } from "web-touch-ripple/jsx";
import { ColumnList } from "../../templates/List";
import { useState } from "preact/hooks";
import { Disactive } from "../../templates/Disactive";
import { Test } from "../../components/test";
import { RouterBinding } from "@web-package/react-widgets-router";

export function SignInPage() {
    const [emailAlias, setEmailAlias] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    // Whether it currently possible to move to the next phase.
    const isNextable = emailAlias != "" && password != "";
    const onListener = async () => {
        setLoading(true);
        const result = await fetch("/api/sign-in", {method: "POST", body: JSON.stringify(
            Test.isEmail(emailAlias)
                ? { email: emailAlias, password }
                : { alias: emailAlias, password }
        )});
        setLoading(false);

        if (result.status == 200) {
            // Move to application page when after sccessful sign-in the user.
            RouterBinding.instance.push("/app");
        } else {
            setError(await result.text());
        }
    }

    console.log(error);

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
                        <Input.Text onChange={setEmailAlias} type="email" design="area" placeholder="Email or Alias" />
                        <Input.Text onChange={setPassword} type="password" design="area" placeholder="Password" />
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
                    <Disactive active={isNextable}>
                        <button className="primary" onClick={onListener} style={{width: "100%"}}>Done</button>
                    </Disactive>
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