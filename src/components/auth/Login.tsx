"use client";

import "./auth.scss";
import "@/amplify-client";
import { Authenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { AuthUser } from "aws-amplify/auth";

interface Props {
    children?: React.ReactNode | ((props: { signOut?: () => void; user?: AuthUser }) => JSX.Element);
    onChange?: (event: string) => void;
}

// https://ui.docs.amplify.aws/react/connected-components/authenticator
export default function ({ children, onChange }: Props) {
    const router = useRouter();

    useEffect(() => {
        Hub.listen("auth", (data) => {
            //console.log("Hub event", data);
            if (onChange) {
                onChange(data.payload.event);
            }
        });
    }, []);

    return (
        <Authenticator loginMechanisms={["email"]} hideSignUp={true}>
            {children}
        </Authenticator>
    );
}
