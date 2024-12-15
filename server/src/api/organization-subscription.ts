import { PG_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { AuthUtil } from "../utils/auth";
import { PathUtil } from "../utils/path";
import { APIException } from "./components/http";

enum OrganizationException {
    INVALID_UUID = "invalid_uuid",
    INVALID_ALIAS = "invalid_alias",
    ALREADY_SUBSCRIPTED = "already_subscribed",
    ALREADY_UNSUBSCRIPTED = "already_unsubscribed",
    OWNER_CANNOT_SUBSCRIBE = "owner_cannot_subscribe"
}

export const ORGANIZATION_SUBSCRIPT_HTTP_HANDLER = new HTTPHandler({
    post: async (request, response, _) => {
        const userId = await AuthUtil.userIdOf(request);
        if (!userId) {
            response.writeHead(401);
            response.end();
            return;
        }

        const params = PathUtil.toUrl(request.url!).searchParams;
        const status = params.get("status");
        const alias = params.get("alias");
        const uuid = params.get("uuid");
        if ((alias || uuid) && status) {
            if (status != "true" && status != "false") {
                response.writeHead(400);
                response.end(APIException.INVALID_REQUEST_FORMAT);
                return;
            }

            const validResult = uuid
                ? await PG_CLIENT.query(`SELECT "id", "ownerId" FROM "Organizations" WHERE "id" = $1 LIMIT 1`, [uuid])
                : await PG_CLIENT.query(`SELECT "id", "ownerId" FROM "Organizations" WHERE "alias" = $1 LIMIT 1`, [alias]);

            if (validResult.rowCount == null
             || validResult.rowCount == 0) {
                response.writeHead(409);
                response.end(uuid ? OrganizationException.INVALID_UUID : OrganizationException.INVALID_ALIAS);
                return;
            }

            // The owner of the organization cannot subscribe to the myself organization.
            if (validResult.rows[0]["ownerId"] == userId) {
                response.writeHead(409);
                response.end(OrganizationException.OWNER_CANNOT_SUBSCRIBE);
                return;
            }

            // When a user want to subscript the organization.
            if (status == "true") {
                const orgzId = validResult.rows[0]["id"];
                const result = await PG_CLIENT.query(`SELECT FROM "Subscriptions" WHERE "userId" = $1 AND "orgzId" = $2`, [
                    userId,
                    orgzId
                ]);

                // When a user already subscribed about the given organization.
                if (result.rowCount != 0) {
                    response.writeHead(409);
                    response.end(OrganizationException.ALREADY_SUBSCRIPTED);
                    return;
                }

                await PG_CLIENT.query(`INSERT INTO "Subscriptions"("userId", "orgzId") VALUES($1, $2)`, [
                    userId,
                    orgzId
                ]);
            } else {
                const orgzId = validResult.rows[0]["id"];
                const result = await PG_CLIENT.query(`SELECT FROM "Subscriptions" WHERE "userId" = $1 AND "orgzId" = $2`, [
                    userId,
                    orgzId
                ]);

                // When a user already not subscribed about the given organization.
                if (result.rowCount == null
                 || result.rowCount == 0) {
                    response.writeHead(409);
                    response.end(OrganizationException.ALREADY_UNSUBSCRIPTED);
                    return;
                }

                await PG_CLIENT.query(`DELETE FROM "Subscriptions" WHERE "userId" = $1 AND "orgzId" = $2`, [
                    userId,
                    orgzId
                ]);
            }

            response.writeHead(200);
            response.end();
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    }
});