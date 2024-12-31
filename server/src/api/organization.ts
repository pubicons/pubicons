import { HTTPHandler, PathUtil, UUID } from "core";
import { PG_CLIENT } from "..";
import { Test } from "./components/test";
import { HTTPUtil } from "core/src";
import { AuthUtil } from "../utils/auth";
import { APIException, APILength } from "core/src/api";

interface OrganizationPostReqeust {
    alias: string;
    displayName: string;
    introduction?: string;
    tags: string[];
}

/** Signature for the type about the post request that is nullable all properties setted. */
type OrganizationPatchRequest = Partial<OrganizationPostReqeust>

enum OrganizationException {
    ALREADY_EXISTS_ALIAS = "already_exists_alias",
    INVALID_ALIAS_FORMAT = "invalid_alias_format",
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
            response.end();
            return;
        }

        // The validation checking for given request.
        if (given.alias
         && given.alias.length < APILength.alias
         && given.displayName
         && given.displayName.length < APILength.displayName) {
            if (!Test.isAlias(given.alias)) {
                response.writeHead(400);
                response.end(OrganizationException.INVALID_ALIAS_FORMAT);
                return;
            }

            if (given.tags && !Test.isArray(given.tags, "number")) {
                response.writeHead(400);
                response.end(APIException.INVALID_REQUEST_FORMAT);
                return;
            }

            const result = await PG_CLIENT.query(`SELECT "id" FROM "Organizations" WHERE "alias" = $1 LIMIT 1`, [
                given.alias
            ]);

            if (result.rowCount == null
             || result.rowCount != 0) {
                response.writeHead(400);
                response.end(OrganizationException.ALREADY_EXISTS_ALIAS);
                return;
            }

            const uuid = UUID.v4();
            const params = `"id", "ownerId", "tags", "alias", "displayName", "introduction", "createdAt"`;
            await PG_CLIENT.query(`INSERT INTO "Organizations"(${params}) VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`, [
                uuid,
                userId,
                JSON.stringify(given.tags ?? []),
                given.alias,
                given.displayName,
                given.introduction,
            ]);

            response.writeHead(200, {"content-type": "applization/json"});
            response.end(JSON.stringify({id: uuid}));
        } else {
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    },
    patch: async (request, response, body) => {
        // Because it's an authentication-only request.
        const userId = await AuthUtil.userIdOf(request);
        if (!userId) {
            response.writeHead(401);
            response.end();
            return;
        }

        const params = PathUtil.toUrl(request.url!).searchParams;
        const alias = params.get("alias");
        const uuid = params.get("uuid");
        if (uuid || alias) {
            const given = HTTPUtil.parseRequest<OrganizationPatchRequest>(body, response);
            if (!given) return;
            if (!given.alias
             && !given.displayName
             && !given.introduction
             && !given.tags) {
                response.writeHead(400);
                response.end(APIException.MISSING_REQUEST_FORMAT);
                return;
            }

            if (given.tags && !Test.isArray(given.tags!, "number")
             || given.alias && given.alias.length > APILength.alias
             || given.displayName && given.displayName.length > APILength.displayName) {
                response.writeHead(400);
                response.end(APIException.INVALID_REQUEST_FORMAT);
                return;
            }

            const ownerIdResult = uuid
                ? await PG_CLIENT.query(`SELECT "ownerId" FROM "Organizations" WHERE "id" = $1 LIMIT 1`, [uuid])
                : await PG_CLIENT.query(`SELECT "ownerId" FROM "Organizations" WHERE "alias" = $1 LIMIT 1`, [alias]);

            if (ownerIdResult.rowCount == null
             || ownerIdResult.rowCount == 0) {
                response.writeHead(400);
                response.end(uuid ? OrganizationException.INVALID_UUID : OrganizationException.INVALID_ALIAS);
                return;
            }

            const ownerId = ownerIdResult.rows[0].ownerId;
            const targets: {key: string, value: string, count: number}[] = [];
            let itemCount = 0;

            // When a user has insufficient permissions to modify a given organization.
            if (ownerId != userId) {
                response.writeHead(403);
                response.end();
                return;
            }

            if (given.alias) {
                // Verify that an alias already given exists.
                const result = await PG_CLIENT.query(`SELECT "id" FROM "Organizations" WHERE "alias" = $1 LIMIT 1`, [
                    given.alias
                ]);

                if (result.rowCount != null
                 || result.rowCount != 0) {
                    response.writeHead(409);
                    response.end(OrganizationException.ALREADY_EXISTS_ALIAS);
                    return;
                }

                itemCount += 1;
                targets.push({key: "alias", value: given.alias, count: itemCount});
            }
            if (given.displayName) {
                itemCount += 1;
                targets.push({key: "displayName", value: given.displayName, count: itemCount});
            }
            if (given.introduction) {
                itemCount += 1;
                targets.push({key: "introduction", value: given.introduction, count: itemCount});
            }
            if (given.tags) {
                itemCount += 1;
                targets.push({key: "tags", value: JSON.stringify(given.tags), count: itemCount});
            }

            const params = targets.map(e => `"${e.key}" = \$${e.count}`).join(", ");
            const values = targets.map(e => e.value);
            const result = uuid
                await PG_CLIENT.query(`UPDATE "Organizations" SET ${params} WHERE "id" = \$${itemCount + 1}`, [...values, uuid]);
                await PG_CLIENT.query(`UPDATE "Organizations" SET ${params} WHERE "alias" = \$${itemCount + 1}`, [...values, alias]);

            response.writeHead(200, {"content-type": "application/json"});
            response.end(JSON.stringify({
                patchedCount: itemCount,
                patchedItems: targets.map(e => e.key)
            }));
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    },
    delete: async (request, response) => {
        // Because it's an authentication-only request.
        const userId = await AuthUtil.userIdOf(request);
        if (!userId) {
            response.writeHead(401);
            response.end();
            return;
        }

        const params = PathUtil.toUrl(request.url!).searchParams;
        const alias = params.get("alias");
        const uuid = params.get("uuid");
        if (alias || uuid) {
            const ownerIdResult = uuid
                ? await PG_CLIENT.query(`SELECT "ownerId" FROM "Organizations" WHERE "id" = $1 LIMIT 1`, [uuid])
                : await PG_CLIENT.query(`SELECT "ownerId" FROM "Organizations" WHERE "alias" = $1 LIMIT 1`, [alias]);

            if (ownerIdResult.rowCount == null
             || ownerIdResult.rowCount == 0) {
                response.writeHead(400);
                response.end(uuid ? OrganizationException.INVALID_UUID : OrganizationException.INVALID_ALIAS);
                return;
            }

            const ownerId = ownerIdResult.rows[0].ownerId;

            // When a user has insufficient permissions to delete a given organization.
            if (ownerId != userId) {
                response.writeHead(403);
                response.end();
                return;
            }

            const currentTime = new Date().toISOString();
            const result = uuid
                ? await PG_CLIENT.query(`UPDATE "Organizations" SET "deletedAt" = $1 WHERE "id" = $2`, [currentTime, uuid])
                : await PG_CLIENT.query(`UPDATE "Organizations" SET "deletedAt" = $1 WHERE "alias" = $2`, [currentTime, alias]);

            response.writeHead(200);
            response.end(JSON.stringify({deletedAt: currentTime}));
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    },
    get: async (request, response, _) => {
        const params = PathUtil.toUrl(request.url!).searchParams;
        const alias = params.get("alias");
        const uuid = params.get("uuid");
        if (uuid || alias) {
            const params = `
                jsonb_array_length(a."stars") AS "starsCount",
                a."tags",
                a."displayName",
                a."introduction",
                a."profileColor",
                a."profileImage",
                b."notificationStatus",
                b."userId" IS NOT NULL AS "isSubscribed",
                a."createdAt",
                a."updatedAt"
            `;
            const querys = `LEFT JOIN "Subscriptions" b ON a."id" = b."orgzId"`;
            const result = uuid
                ? await PG_CLIENT.query(`SELECT "ownerId", "alias", ${params} FROM "Organizations" a ${querys} WHERE "id" = $1 LIMIT 1`, [uuid])
                : await PG_CLIENT.query(`SELECT "id", "ownerId", ${params} FROM "Organizations" a ${querys} WHERE "alias" = $1 LIMIT 1`, [alias])

            if (result.rowCount == null
             || result.rowCount == 0) {
                response.writeHead(409);
                response.end(uuid ? OrganizationException.INVALID_UUID : OrganizationException.INVALID_ALIAS);
                return;
            }

            // Not need to respond to notificationStatus if a user is not subscribed.
            if (result.rows[0]["isSubscribed"] == false) {
                delete result.rows[0]["notificationStatus"];
            }

            response.setHeader("Content-Type", "application/json");
            response.writeHead(200);
            response.end(JSON.stringify(result.rows[0]));
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    }
});