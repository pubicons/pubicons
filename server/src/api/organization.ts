import { PG_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { AuthUtil } from "../utils/auth";
import { HTTPUtil } from "../utils/http";
import { PathUtil } from "../utils/path";
import { UUID } from "../utils/uuid";
import { APIException, APILength } from "./components/http";
import { Test } from "./components/test";

interface OrganizationPostReqeust {
    alias: string;
    displayName: string;
    introduction?: string;
}

enum OrganizationException {
    INVALID_ALIAS_FORMAT = "invalid_alias_format",
    ALREADY_EXISTS_ALIAS = "already_exists_alias",
    INVALID_UUID = "invalid_uuid",
    INVALID_ALIAS = "invalid_alias"
}

export const ORGANIZATION_HTTP_HANDLER = new HTTPHandler({
    post: async (request, response, body) => { // Create a organization
        const given = HTTPUtil.parseRequest<OrganizationPostReqeust>(body, response);
        if (!given) return;

        const userId = await AuthUtil.userIdOf(request);
        if (!userId) {
            response.writeHead(401);
            response.end(undefined);
            return;
        }

        // The validation checking for given request.
        if (given.alias && given.alias.length < APILength.alias && given.displayName) {
            if (!Test.isAlias(given.alias)) {
                response.writeHead(400);
                response.end(OrganizationException.INVALID_ALIAS_FORMAT);
                return;
            }

            const result = await PG_CLIENT.query(`SELECT "id" FROM "Organizations" WHERE "alias" = $1 LIMIT 1`, [given.alias]);

            if (result.rowCount != 0) {
                response.writeHead(400);
                response.end(OrganizationException.ALREADY_EXISTS_ALIAS);
                return;
            }

            const uuid = UUID.v4();

            await PG_CLIENT.query(`INSERT INTO "Organizations"("id", "masterId", "alias", "displayName", "introduction", "createdAt") VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`, [
                uuid,
                userId,
                given.alias,
                given.displayName,
                given.introduction
            ]);

            response.writeHead(200);
            response.end(JSON.stringify({id: uuid}));
        } else {
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    },
    get: async (request, response, body) => {
        const params = PathUtil.toUrl(request.url!).searchParams;
        const alias = params.get("alias");
        const uuid = params.get("uuid");
        if (uuid || alias) {
            const params = `"displayName", "introduction", "profileColor", "profileImage"`;
            const result = uuid
                ? await PG_CLIENT.query(`SELECT "masterId", "alias", ${params} FROM "Organizations" WHERE "id" = $1 LIMIT 1`, [uuid])
                : await PG_CLIENT.query(`SELECT "masterId", "id", ${params} FROM "Organizations" WHERE "alias" = $1 LIMIT 1`, [alias]);

            if (result.rowCount == null || result.rowCount == 0) {
                response.writeHead(400);
                response.end(uuid ? OrganizationException.INVALID_UUID : OrganizationException.INVALID_ALIAS);
                return;
            }

            response.writeHead(200);
            response.end(JSON.stringify(result.rows[0]));
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    }
});