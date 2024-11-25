import { Column, Text } from "@web-package/react-widgets";
import { Template } from "../templates/Template";
import { RouterBinding } from "@web-package/react-widgets-router";

export function NotFoundPage() {
    return (
        <>
            <title>PUBICONS - Not Found</title>
            <Template.FormWrapper>
                <Column align="center" gap="var(--padding-df)">
                    <Column align="center">
                        <Text.h1 fontSize="48px">404</Text.h1>
                        <Text.span color="var(--foreground2)">The page of a given path is not found.</Text.span>
                    </Column>
                    <button className="primary" onClick={() => RouterBinding.instance.push("/")}>Go to home</button>
                </Column>
            </Template.FormWrapper>
        </>
    )
}