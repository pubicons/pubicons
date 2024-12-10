import { HTTPHandler } from "../http/core/http_handler";
import { HTTPUtil } from "../utils/http";

interface OrganizationReqeust {
    alias: string;
    displayName: string;
    introduction?: string;
}

enum OrganizationException {
    ALREADY_EXISTS_ALIAS = "already_exists_alias",
}

export const ORGANIZATION_HTTP_HANDLER = new HTTPHandler({
    post: (request, response, body) => { // Create a organization
        const given = HTTPUtil.parseRequest<OrganizationReqeust>(body, response);
        if (!given) return;

        console.log(given);
    }
});