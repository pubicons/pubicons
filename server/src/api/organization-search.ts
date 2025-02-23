import { HTTPHandler } from "core";
import { PG_CLIENT } from "..";
import { PathUtil } from "core/src";
import { APIException } from "core/src/api";

enum SearchOrder {
    LATEST = "latest",
    OLDEST = "oldest"
}

// The value defines the maximum number of loading count.
const PAGE_SIZE = 30;

export const ORGANIZATION_SEARCH_HTTP_HANDLER = new HTTPHandler({
    get: async (request, response, _) => {
        const params = PathUtil.toUrl(request.url!).searchParams;
        const order = params.get("order");
        const count = params.get("count");
        if (order && count) {
            if (order != SearchOrder.LATEST
             && order != SearchOrder.OLDEST) {
                response.writeHead(400);
                response.end(APIException.INVALID_REQUEST_FORMAT);
                return;
            }

            if (isNaN(parseInt(count))) {
                response.writeHead(400);
                response.end(APIException.INVALID_REQUEST_FORMAT);
                return;
            }

            const orderQuery = order == SearchOrder.LATEST
                ? `ORDER BY "createdAt" DESC`
                : `ORDER BY "createdAt" ASC`;

            const params = `
                a."id",
                a."ownerId",
                a."tags",
                a."alias",
                a."displayName",
                a."introduction",
                a."profileColor",
                a."profileImage",
                jsonb_array_length(a."stars") AS "starsCount",
                b."notificationStatus",
                b."userId" IS NOT NULL AS "isSubscribed",
                a."createdAt",
                a."updatedAt"
            `;
            const querys = `LEFT JOIN "Subscriptions" b ON a."id" = b."orgzId" WHERE "deletedAt" IS NULL`;
            const offset = parseInt(count) * PAGE_SIZE;
            const result = await PG_CLIENT.query(
                `SELECT ${params} FROM "Organizations" a ${querys} ${orderQuery} LIMIT $1 OFFSET $2`,
                [PAGE_SIZE, offset]
            );

            if (result.rowCount == null
             || result.rowCount == 0) {
                response.writeHead(404);
                response.end();
                return;
            }

            // Not need to respond to notificationStatus if a user is not subscribed.
            for (const row of result.rows) {
                if (row["isSubscribed"] == false) delete row["notificationStatus"];
            }

            response.setHeader("Content-Type", "application/json");
            response.writeHead(200);
            response.end(JSON.stringify(result.rows));
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    }
});