import { AnimatedSize, AnimatedTransition, Column, Text } from "@web-package/react-widgets";
import { l10n } from "../../localization/localization";
import { Template } from "../../templates/Template";
import { Input } from "../../templates/Input";
import { Disactive } from "../../templates/Disactive";
import { useContext, useRef, useState } from "preact/hooks";
import { Test } from "../../components/test";
import { RouterBinding } from "@web-package/react-widgets-router";
import { Popup } from "../../components/popup";
import { AppContext } from "../App";
import { User } from "../../components/user";

enum SignUpStatus {
    INFO,
    PASS,
    AUTH
}

export function SignUpPage() {
    const context = useContext(AppContext);
    const [status, setStatus] = useState(SignUpStatus.INFO);
    const [alias, setAlias] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [authNums, setAuthNums] = useState<string>("");
    const [checkPassword, setCheckPassword] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const authIdRef = useRef<string>(null);
    const authId = authIdRef.current; // Authorization UUID

    const isNextable = (Test.isEmail(email) && (alias != "" && Test.isAlias(alias)) && password != "")
                    && (status == SignUpStatus.PASS ? password == checkPassword : true);

    const onNextable = async () => {
        if (status == SignUpStatus.INFO) {
            setStatus(SignUpStatus.PASS);
        }

        if (status == SignUpStatus.PASS) {
            // Verify that it is the same as the password.
            if (password != checkPassword) return;

            setLoading(true);
            const result = await fetch("/api/sign-up", {method: "POST", body: JSON.stringify({
                email: email,
                alias: alias,
                password: password
            })});
            setLoading(false);

            if (result.status == 200) {
                // Sets Authorization UUID for finishing sign-up.
                authIdRef.current = await result.text();
                setStatus(SignUpStatus.AUTH);
            } else {
                Popup.open(
                    <Template.Popup.Error
                        title={`${result.status} ERROR`}
                        message={l10n["sign-up"][await result.text()]}
                    />
                );
            }
        }

        if (status == SignUpStatus.AUTH) {
            setLoading(true);
            const result = await fetch(`/api/sign-up/auth?uuid=${authId}`, {
                method: "POST",
                body: JSON.stringify({numbers: authNums}
            )});
            setLoading(false);

            if (result.status == 200) {
                User.signIn(await result.json());

                // Move to application page when after sccessful sign-up the user.
                RouterBinding.instance.push("/app");

                // Refresh when the user logs in or the sign-in
                // status changes, updating the UI/UX.
                context("Update user status to sign-ined");
            } else {
                Popup.open(
                    <Template.Popup.Error
                        title={`${result.status} ERROR`}
                        message={l10n["sign-up"][await result.text()]}
                    />
                );
            }
        }
    }

    return (
        <>
            <title>PUBICONS - {l10n["sign-up"]["title"]}</title>
            <Template.FormWrapper loading={isLoading}>
                <Column gap="var(--padding-df)">
                    <Column>
                        <Text.h1>{l10n["sign-up"]["title"]}</Text.h1>
                        {
                            status == SignUpStatus.INFO || status == SignUpStatus.PASS
                                ? <span>{l10n["sign-up"]["info_description"]}</span>
                                : <span>{l10n["sign-up"]["auth_description"]}</span>
                        }
                    </Column>
                    <AnimatedSize duration="0.5s">
                        <AnimatedTransition value={status} animation={{
                            duration: "0.5s",
                            fadeIn : {from: {transform: "translateX(100%)", opacity: "0"}, to: {transform: "translateX(0px)"  , opacity: "1"}},
                            fadeOut: {from: {transform: "translateX(0px)" , opacity: "1"}, to: {transform: "translateX(-100%)", opacity: "0"}}
                        }}>
                            <Column gap="var(--padding-sm)">
                                <Inputs
                                    status={status}
                                    setAlias={setAlias}
                                    setEmail={setEmail}
                                    setPassword={setPassword}
                                    setAuthNums={setAuthNums}
                                    setCheckPassword={setCheckPassword}
                                />
                            </Column>
                        </AnimatedTransition>
                    </AnimatedSize>
                    <Disactive active={isNextable}>
                        <button className="primary" onClick={onNextable} style={{width: "100%"}}>{l10n["done"]}</button>
                    </Disactive>
                </Column>
            </Template.FormWrapper>
        </>
    )
}

function Inputs({status, setAlias, setEmail, setPassword, setCheckPassword, setAuthNums}: {
    status: SignUpStatus;
    setAlias: (value: string) => void;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    setAuthNums: (value: string) => void;
    setCheckPassword: (value: string) => void;
}) {
    if (status == SignUpStatus.INFO) {
        return (
            <>
                <Input.Text key="alias" onChange={setAlias} type="" design="form" placeholder={l10n["alias"]} />
                <Input.Text key="email" onChange={setEmail} type="email" design="form" placeholder={l10n["email"]} />
                <Input.Text key="password" onChange={setPassword} type="password" design="form" placeholder={l10n["password"]} />
            </>
        )
    }

    if (status == SignUpStatus.PASS) {
        return <Input.Text key="password" onChange={setCheckPassword} type="password" design="form" placeholder={l10n["password"]} />
    }

    if (status == SignUpStatus.AUTH) {
        return <Input.Text key="auth_numbers" onChange={setAuthNums} design="form" placeholder={l10n["auth_numbers"]} />;
    }
}