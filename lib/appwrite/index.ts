'use server'

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { APPWRITE_CONFIG } from "./config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
    const client = new Client()
        .setEndpoint(APPWRITE_CONFIG.endpoint)
        .setProject(APPWRITE_CONFIG.projectId)

    const session = (await cookies()).get("appwrite_session");

    if (!session || !session.value) throw new Error("No session found");

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client);
        }
    };
};
export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(APPWRITE_CONFIG.endpoint)
        .setProject(APPWRITE_CONFIG.projectId)
        .setKey(APPWRITE_CONFIG.secret);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        },
        get avatars() {
            return new Avatars(client);
        },
    };
};
