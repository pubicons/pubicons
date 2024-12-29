import { Box } from "@web-package/react-widgets";
import { UserProfile, UserProfileStatus } from "../components/user_profile";
import { Loading } from "./Loading";
import { useLayoutEffect, useState } from "preact/hooks";

export namespace Profile {
    export function With({profile, size}: {
        profile: UserProfile;
        size: number;
    }) {
        const [status, setStatus] = useState(profile.status);

        // Re-renders when the status of a given user profile changes.
        useLayoutEffect(() => {
            let listener;
            profile.addStatusListener(listener = (status: UserProfileStatus) => {
                setStatus(status);
            });

            return () => profile.removeStatusListener(listener);
        }, []);

        // When a given profile information has not yet been loaded.
        if (status != UserProfileStatus.LOADED) {
            return <LoadingCircle />
        }

        if (!profile.profileImage) {
            return (
                <Default
                    color={`rgb(${profile.profileColor})`}
                    name={profile.alias.toUpperCase()}
                    size={size}
                />
            )
        } else {
            <>Hello, World!</>
        }
    }

    export function Default({color, name, size}: {
        color: string;
        name: string;
        size: number;
    }) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={`${size}px`}
                height={`${size}px`}
                backgroundColor={color}
                borderRadius="1e10px"
                pointerEvents="none"
                color="white"
                fontSize={`${size / 2}px`}
                children={name[0]}
            />
        )
    }

    export function LoadingCircle() {
        return <Loading.Circle size="32px" thickness={4} />
    }
}