
export namespace API {
    // https://docs.pubicons.com/sign-up-2-auth
    // https://docs.pubicons.com/sign-in
    export interface Account {
        userId: string;
        accessToken: string;
        refreshToken: string;
    }
}