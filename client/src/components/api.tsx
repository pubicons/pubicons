
export namespace API {
    export enum NotificationStatus {

    }    

    // https://docs.pubicons.com/sign-up-2-auth
    // https://docs.pubicons.com/sign-in
    export interface Account {
        userId: string;
        accessToken: string;
        refreshToken: string;
    }

    export interface Organization {
        id: string;
        ownerId: string;
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