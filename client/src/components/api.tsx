
export namespace API {
    export enum NotificationStatus {
        ALL = 0,
        ONLY_IMPORTANT = 1,
        NONE = 2
    }    

    // https://docs.pubicons.com/sign-up-2-auth
    // https://docs.pubicons.com/sign-in
    export interface Account {
        userId: string;
        accessToken: string;
        refreshToken: string;
    }

    // https://docs.pubicons.com/api-server/profile
    export interface Profile {
        displayName: string;
        email: string;
        alias: string;
        profileImage: string;
        profileColor: string;
    }

    export interface Organization {
        id: string;
        ownerId: string;
        tags: number[];
        alias: string;
        displayName: string;
        introduction: string;
        profileColor: string;
        profileImage: null;
        starsCount: number;
        notificationStatus: 0 | 1 | 2 | null; // when only isSubscribed is true.
        isSubscribed: boolean;
        createdAt: string;
        updatedAt: string;
    }
}