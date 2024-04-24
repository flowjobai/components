"use server";

// https://docs.amplify.aws/gen2/start/quickstart/nextjs-app-router-server-components/

import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession } from "aws-amplify/auth/server";

const config = {
    Auth: {
        Cognito: {
            userPoolId: process.env.COGNITO_USER_POOL_ID!,
            userPoolClientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
            region: process.env.REGION!,
        },
    },
};

console.log("Cognito user pool", config.Auth.Cognito.userPoolId);

const { runWithAmplifyServerContext } = createServerRunner({ config });

export async function getCurrentUserServer() {
    try {
        return await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: async (contextSpec) => {
                const session = await fetchAuthSession(contextSpec);
                //console.log(session)
                return {
                    id: session.userSub as string,
                    email: session.tokens?.idToken?.payload.email as string,
                    groups: session.tokens?.accessToken?.payload["cognito:groups"] as string[],
                };
            },
        });
    } catch (error) {
        console.error("Amplify Error", error);
    }
}
