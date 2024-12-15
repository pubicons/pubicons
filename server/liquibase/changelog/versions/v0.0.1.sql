CREATE DOMAIN UUID AS VARCHAR(36);

CREATE DOMAIN SHA512 AS CHAR(88);

CREATE DOMAIN SHA256 AS CHAR(44);

CREATE DOMAIN URL AS VARCHAR(255);

CREATE DOMAIN RGB AS CHAR(11); -- 0~255,0~255,0~255

CREATE FUNCTION "random_rgb"(min INT DEFAULT 0, max INT DEFAULT 255) RETURNS RGB AS $$
DECLARE
    r INT;
    g INT;
    b INT;
BEGIN
    r := floor(random() * (max - min + 1) + min);
    g := floor(random() * (max - min + 1) + min);
    b := floor(random() * (max - min + 1) + min);
    RETURN r || ',' || g || ',' || b;
END;
$$ LANGUAGE PLPGSQL;

CREATE TABLE "User"(
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP,
    "deletedAt" TIMESTAMP,
    "alias" VARCHAR(64) NOT NULL UNIQUE,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" SHA512,
    "passwordSalt" SHA256
);

CREATE INDEX "indexAlias" ON "User"("alias");

CREATE INDEX "indexEmail" ON "User"("email");

CREATE INDEX "indexCreatedAt" ON "User"("createdAt");

CREATE TABLE "UserDetails"(
    "id" UUID NOT NULL,
    "displayName" VARCHAR(32),
    "bookmarkedIcons" JSONB NOT NULL DEFAULT '[]',
    "downloadedIcons" JSONB NOT NULL DEFAULT '[]',
    "profileColor" RGB NOT NULL DEFAULT random_rgb(100, 255),
    "profileImage" URL,
    FOREIGN KEY("id") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Organizations"(
    "id" UUID PRIMARY KEY,
    "ownerId" UUID NOT NULL,
    "stars" JSONB NOT NULL DEFAULT '[]',
    "alias" VARCHAR(64) NOT NULL UNIQUE,
    "displayName" VARCHAR(32),
    "introduction" VARCHAR(256),
    "profileColor" RGB NOT NULL DEFAULT random_rgb(100, 255),
    "profileImage" URL,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP,
    "deletedAt" TIMESTAMP,
    FOREIGN KEY("masterId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "ginIndexOrganizationStars" ON "Organizations" USING GIN ("stars");

-- Notification Status:
-- 0 = Receive notifications for all updates (e.g., added or removed icons)
-- 1 = Receive notifications only for announcements made by the master
-- 2 = Disable notifications
CREATE TABLE "Subscriptions"(
    "userId" UUID NOT NULL,
    "orgzId" UUID NOT NULL,
    "notificationStatus" INT DEFAULT 0,
    FOREIGN KEY("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY("orgzId") REFERENCES "Organizations"("id") ON DELETE CASCADE
);

CREATE TABLE "ImageIcons"(
    "id" UUID PRIMARY KEY,
    "userId" UUID NOT NULL,
    "orgzId" UUID NOT NULL,
    "srcUrl" URL NOT NULL,
    FOREIGN KEY("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY("orgzId") REFERENCES "Organizations"("id") ON DELETE CASCADE
);

CREATE TABLE "VectorIcons"(
    "id" UUID PRIMARY KEY,
    "userId" UUID NOT NULL,
    "orgzId" UUID NOT NULL,
    "source" URL NOT NULL,
    FOREIGN KEY("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY("orgzId") REFERENCES "Organizations"("id") ON DELETE CASCADE
);