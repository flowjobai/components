"use client";

import "@/amplify-client"
import {Authenticator} from "@aws-amplify/ui-react";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { Hub } from 'aws-amplify/utils';

// https://ui.docs.amplify.aws/react/connected-components/authenticator
export default function() {
    const router = useRouter();

    useEffect(() => {
        Hub.listen("auth", (data) => {
            console.log("Hub event", data);
            if (data.payload.event === "signedIn") {
                router.push("/app/build");
            }
        });
    }, []);

    return (
        <Authenticator loginMechanisms={['email']} hideSignUp={true}>
            {({ signOut, user }) => {
                return (
                    <div className="flex flex-col gap-4 items-center text-secondary">
                        <div>{user?.username}</div>
                        <button className="caption hover:text-blue-500" onClick={signOut}>Sign out</button>
                    </div>
                )
            }}
        </Authenticator>
    );
}


