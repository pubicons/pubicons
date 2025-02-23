import http from "http";
import fs from "fs";
import path from "path";
import { Client } from "pg";
import { config } from "dotenv";
import { createClient } from "redis";
import { SIGN_IN_HTTP_HANDLER } from "./api/sign_in";
import { SIGN_UP_HTTP_HANDLER } from "./api/sign_up";
import { SIGN_UP_AUTH_HTTP_HANDLER } from "./api/sign_up-auth";
import { TOKEN_HTTP_HANDLER } from "./api/token";
import { PROFILE_HTTP_HANDLER } from "./api/profile";
import { PROFILE_SELF_HTTP_HANDLER } from "./api/profile-self";
import { FORGET_PASSWORD_AUTH_HTTP_HANDLER } from "./api/forget_password-auth";
import { FORGET_PASSWORD_HTTP_HANDLER } from "./api/forget_password";
import { ORGANIZATION_HTTP_HANDLER } from "./api/organization";
import { ORGANIZATION_SEARCH_HTTP_HANDLER } from "./api/organization-search";
import { ORGANIZATION_SELF_HTTP_HANDLER } from "./api/organization-self";
import { ORGANIZATION_SUBSCRIPT_HTTP_HANDLER } from "./api/organization-subscription";
import { HTTPConnection, HTTPHandler, HTTPRouter, PathUtil } from "core";
import { HTTPUtil } from "core/src";

/** Initializes configuation values in node.js about .env files. */
config();

/** The value defines the currently active postgresql client instance. */
export const PG_CLIENT = new Client({
    port: Number.parseInt(process.env.POSTGRES_PORT as string),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD
});

/** The value defines the currently active redis client instance. */
export const REDIS_CLIENT = createClient({
    socket: {
        // Based on the external port (internal port is the default port of redis)
        port: Number.parseInt(process.env.REDIS_PORT as string)
    },
    password: process.env.REDIS_PASSWORD
});

const RESOURCE_HTTP_HANDLER = new HTTPHandler({
    get: (request, response) => {
        if (request.url === undefined) {
            response.writeHead(404);
            return;
        }

        const ext = path.extname(request.url);

        // If the file extension does not exist,
        // it will respond with `index.html` due to the characteristics of SPA.
        if (request.method == "GET" && ext != "") {
            const srcPath = path.join("../client/dist", path.normalize(request.url));

            fs.readFile(srcPath, null, (err, data) => {
                if (err) { // Is not found or other errors occur.
                    response.writeHead(404);
                    response.end();
                } else {
                    // A response about a user request will be cached for about a year.
                    // when request a user to font files (e.g. ttf, otf).
                    if (ext == ".ttf"
                     || ext == ".otf"
                     || ext == ".woff"
                     || ext == ".woff2") {
                        response.setHeader("Cache-Control", "max-age=31536000, public");
                    }

                    response.writeHead(200, {"Content-Type": HTTPUtil.contentTypeOf(srcPath)});
                    response.end(data);
                }
            });
        } else {
            fs.readFile("../client/dist/index.html", "utf8", (err, data) => {
                response.writeHead(200, {"Content-Type": HTTPUtil.contentTypeOf("html")});
                response.end(data);
            });
        }
    }
});

/**
 * Refer to [Docs API](docs.pubicons.com) for details.
 * 
 * - api/sign-in
 * - api/sign-up
 * - api/sign-up/auth
 * - api/profile
 * - api/profile/self
 * - api/token
 * - api/forget-password
 * - api/forget-password/auth
 * - api/organization
 * - api/organization/self
*/
const HTTP_ROUTER = new HTTPRouter("api", RESOURCE_HTTP_HANDLER, [
    new HTTPRouter("sign-in", SIGN_IN_HTTP_HANDLER),
    new HTTPRouter("sign-up", SIGN_UP_HTTP_HANDLER, [new HTTPRouter("auth", SIGN_UP_AUTH_HTTP_HANDLER)]),
    new HTTPRouter("profile", PROFILE_HTTP_HANDLER, [new HTTPRouter("self", PROFILE_SELF_HTTP_HANDLER)]),
    new HTTPRouter("token", TOKEN_HTTP_HANDLER),
    new HTTPRouter("forget-password", FORGET_PASSWORD_HTTP_HANDLER, [new HTTPRouter("auth", FORGET_PASSWORD_AUTH_HTTP_HANDLER)]),
    new HTTPRouter("organization", ORGANIZATION_HTTP_HANDLER, [
        new HTTPRouter("self", ORGANIZATION_SELF_HTTP_HANDLER),
        new HTTPRouter("search", ORGANIZATION_SEARCH_HTTP_HANDLER),
        new HTTPRouter("subscription", ORGANIZATION_SUBSCRIPT_HTTP_HANDLER)
    ])
]);

const server = http.createServer(async (request, response) => {
    if (request.url === undefined) return;

    HTTP_ROUTER.perform(new HTTPConnection(
        PathUtil.toList(request.url),
        request,
        response,
    ));
});

server.listen(8080, undefined, undefined, () => {
    PG_CLIENT.connect();
    REDIS_CLIENT.connect();
});