import { PG_CLIENT } from "..";
import { HTTPHandler } from "../core/http/http_handler";
import { PathUtil } from "../core/utils/path";
import { APIException } from "../core/api/http";

enum SelfException {
    INVALID_UUID = "invalid_uuid"
}

export const PROFILE_HTTP_HANDLER = new HTTPHandler({
    get: async (request, response) => {
        const uuid = PathUtil.toUrl(request.url!).searchParams.get("uuid");
        if (!uuid) {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
            return;
        }

        try {
            const params = `"displayName", "email", "alias", "profileImage", "profileColor"`;
            const result = await PG_CLIENT.query(`SELECT ${params} FROM "User" JOIN "UserDetails" ON "User"."id" = "UserDetails"."id" WHERE "User"."id" = $1 LIMIT 1`, [
                uuid
            ]);

            // When the user not found corresponding to a given UUID.
            if (result.rowCount == null
             || result.rowCount == 0) {
                response.writeHead(400);
                response.end(SelfException.INVALID_UUID);
                return;
            }

            response.writeHead(200);
            response.end(JSON.stringify(result.rows[0]));
        } catch {
            response.writeHead(400);
            response.end(APIException.INVALID_REQUEST_FORMAT);
        }
    }
});