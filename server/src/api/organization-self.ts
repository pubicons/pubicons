import { PG_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { AuthUtil } from "../utils/auth";

export const ORGANIZATION_SELF_HTTP_HANDLER = new HTTPHandler({
    get: async (request, response, _) => {
        const userId = await AuthUtil.userIdOf(request);
        if (!userId) {
            response.writeHead(401);
            response.end();
            return;
        }

        const result1 = await PG_CLIENT.query(`
            SELECT 
                "id", 
                "ownerId", 
                "alias", 
                "displayName", 
                "introduction", 
                "profileColor", 
                "profileImage", 
                jsonb_array_length("stars") AS "starsCount", 
                "createdAt",
                "updatedAt" 
            FROM "Organizations" 
            WHERE "ownerId" = $1
        `, [userId]);

        response.setHeader("Content-Type", "application/json");
        response.writeHead(200);
        response.end(JSON.stringify(result1.rows));
    }
});