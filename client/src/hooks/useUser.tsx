import { useLayoutEffect, useState } from "preact/hooks";
import { UserProfile, UserProfileStatus } from "../components/user_profile";
import { User } from "../components/user";

export function useUser(): [UserProfileStatus, UserProfile | undefined] {
    const [status, setStatus] = useState(User.profile?.status ?? UserProfileStatus.NONE);

    useLayoutEffect(() => {
        if (!User.profile) return;
        let listener;
        User.profile.addStatusListener(listener = (status: UserProfileStatus) => {
            setStatus(status);
        });

        return () => User.profile.removeStatusListener(listener);
    }, [User.profile]);

    return [status, User.profile];
}