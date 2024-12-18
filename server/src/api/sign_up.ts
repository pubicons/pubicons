import { REDIS_CLIENT } from "..";
import { Mail } from "./components/mail";
import { User } from "./components/user";
import { Test } from "./components/test";
import { HTTPHandler, UUID } from "core";
import { APIException, APILength } from "core/src/api";
import { HTTPUtil } from "core/src";
import { AuthUtil } from "../utils/auth";

export interface SignUpRequest {
    email: string;
    alias: string;
    password: string;
    displayName: string | undefined;
}

export enum SignUpException {
    ALREADY_EXISTS_EMAIL = "already_exists_email",
    ALREADY_EXISTS_ALIAS = "already_exists_alias",
    INVALID_EMAIL_FORMAT = "invalid_email_format",
    INVALID_ALIAS_FORMAT = "invalid_alias_format"
}

export const SIGN_UP_HTTP_HANDLER = new HTTPHandler({
    post: async (_, response, requestBody) => {
        const given = HTTPUtil.parseRequest<SignUpRequest>(requestBody, response);
        if (!given) return;

        // The validation checking for given request.
        if (given.email && given.email.length < APILength.email
         && given.alias && given.alias.length < APILength.alias
         && given.password) {
            if (!Test.isAlias(given.alias)) {
                response.writeHead(400);
                response.end(SignUpException.INVALID_ALIAS_FORMAT);
                return;
            }

            if (await User.existsEmail(given.email)) {
                response.writeHead(409);
                response.end(SignUpException.ALREADY_EXISTS_EMAIL);
                return;
            }

            if (await User.existsAlias(given.alias)) {
                response.writeHead(409);
                response.end(SignUpException.ALREADY_EXISTS_ALIAS);
                return;
            }

            const authUUID = UUID.v4();
            const authNums = AuthUtil.createNumbers(6);

            try {
                if (!Test.isEmail(given.email)) {
                    throw new Error(SignUpException.INVALID_EMAIL_FORMAT);
                }

                await Mail.sendHTML(given.email, "Your authentication numbers for sign-up about PubIcons", authNums);

                // Sets the auth-number for the next sign-up task.
                REDIS_CLIENT.hSet("SignUpAuth", authUUID, JSON.stringify({...given, ...{numbers: authNums}}));

                // Sets the expire duration to 10 minute for the auth-numbers.
                REDIS_CLIENT.hExpire("SignUpAuth", authUUID, AuthUtil.DURATION);

                response.writeHead(200);
                response.end(authUUID);
            } catch {
                response.writeHead(400);
                response.end(SignUpException.INVALID_EMAIL_FORMAT);
            }
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    }
});