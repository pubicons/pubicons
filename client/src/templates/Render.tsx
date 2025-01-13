import { ReactNode } from "react-dom/src";
import { User } from "../components/user";

export namespace Render {
    export function SignInOnly({children}: {
        children: ReactNode;
    }) {
        return User.isOffline ? <></> : children;
    }
}