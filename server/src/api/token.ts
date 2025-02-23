import { HTTPHandler } from "core";
import { REDIS_CLIENT } from "..";
import { AuthUtil } from "../utils/auth";
import { APIException } from "core/src/api";
import { HTTPUtil } from "core/src";

interface TokenRequest {
    refreshToken: string;
}

enum TokenException {
    INVALID_REFRESH_TOKEN = "invalid_refresh_token"
}

export const TOKEN_HTTP_HANDLER = new HTTPHandler({
    post: async (_, response, requestBody) => {
        const given = HTTPUtil.parseRequest<TokenRequest>(requestBody, response);
        if (!given) return;

        // A refresh token is required when creating an access token.
        if (given.refreshToken) {
            const userId = await REDIS_CLIENT.hGet("RefreshToken", given.refreshToken);

            // Is the given refresh token is invalid.
            if (!userId) {
                response.writeHead(400);
                response.end(TokenException.INVALID_REFRESH_TOKEN);
                return;
            }

            const accessToken = AuthUtil.createToken();

            REDIS_CLIENT.hSet("AccessToken", accessToken, userId);
            REDIS_CLIENT.hExpire("AccessToken", accessToken, AuthUtil.ACCESS_TOKEN_EXPIER_DURATION);

            // Sets the access token as the http-only cookie.
            AuthUtil.setAccessTokenAsCookie(response, accessToken);

            response.writeHead(200);
            response.end(accessToken);
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    }
});