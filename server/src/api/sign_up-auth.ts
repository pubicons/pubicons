import { PG_CLIENT, REDIS_CLIENT } from "..";
import { HTTPHandler } from "../core/http/http_handler";
import { AuthUtil } from "../core/utils/auth";
import { HTTPUtil } from "../core/utils/http";
import { PathUtil } from "../core/utils/path";
import { UUID } from "../core/utils/uuid";
import { APIException } from "../core/api/http";
import { User } from "./components/user";
import { SignUpException, SignUpRequest } from "./sign_up";
import { createHash, randomBytes } from "crypto";

interface AuthData extends SignUpRequest {
    numbers: string;
}

interface AuthRequest {
    numbers: string;
}

enum SignUpAuthException {
    INVALID_UUID = "invalid_uuid",
    INVALID_NUMBERS = "invalid_numbers"
}

export const SIGN_UP_AUTH_HTTP_HANDLER = new HTTPHandler({
    post: async (request, response, requestBody) => {
        const uuid = PathUtil.toUrl(request.url!).searchParams.get("uuid");
        if (!uuid) {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
            return;
        }

        // Is not exists user sign-up information corresponding to a given uuid.
        const rawAuthData = await REDIS_CLIENT.hGet("SignUpAuth", uuid!);
        if (!rawAuthData) {
            response.writeHead(400);
            response.end(SignUpAuthException.INVALID_UUID);
            return;
        }

        const authRequest = JSON.parse(rawAuthData!) as AuthData;
        const requestData = HTTPUtil.parseRequest<AuthRequest>(requestBody, response);
        if (!requestData) return;
        if (!requestData.numbers) {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
            return;
        }

        if (requestData.numbers == authRequest.numbers) {
            if (await User.existsEmail(authRequest.email)) {
                response.writeHead(409);
                response.end(SignUpException.ALREADY_EXISTS_EMAIL);
                return;
            }

            if (await User.existsAlias(authRequest.alias)) {
                response.writeHead(409);
                response.end(SignUpException.ALREADY_EXISTS_ALIAS);
                return;
            }

            const userId = UUID.v4();
            const alias = authRequest.alias;
            const email = authRequest.email;
            const displayName = authRequest.displayName;
            const passSalt = createHash("sha256").update(randomBytes(128)).digest("base64");
            const password = createHash("sha512").update(authRequest.password + passSalt).digest("base64");
            const accessToken = AuthUtil.createToken();
            const refreshToken = AuthUtil.createToken();

            try {
                await PG_CLIENT.query(`START TRANSACTION`);
                await PG_CLIENT.query(`INSERT INTO "User"("id", "createdAt", "alias", "email", "password", "passwordSalt") VALUES($1, CURRENT_TIMESTAMP, $2, $3, $4, $5)`, [
                    userId,
                    alias,
                    email,
                    password,
                    passSalt
                ]);

                await PG_CLIENT.query(`INSERT INTO "UserDetails"("id", "displayName") VALUES($1, $2)`, [userId, displayName]);
                await PG_CLIENT.query(`COMMIT`);
            } catch (error) {
                await PG_CLIENT.query(`ROLLBACK`);
                throw error;
            }

            await REDIS_CLIENT.multi()
                // Authorization uuid must expire because sign-up tasks has finally been completed.
                .hDel("SignUpAuth", uuid)
                .hSet("AccessToken", accessToken, userId)
                .hSet("RefreshToken", refreshToken, userId)
                .hExpire("AccessToken", accessToken, AuthUtil.ACCESS_TOKEN_EXPIER_DURATION)
                .hExpire("RefreshToken", refreshToken, AuthUtil.REFRESH_TOKEN_EXPIER_DURATION)
                .exec();

            // Sets the access token as the http-only cookie.
            AuthUtil.setAccessTokenAsCookie(response, accessToken);

            response.setHeader("Content-Type", "application/json");
            response.writeHead(200);
            response.end(JSON.stringify({userId, accessToken, refreshToken}));
        } else {
            response.writeHead(400);
            response.end(SignUpAuthException.INVALID_NUMBERS);
        }
    }
});