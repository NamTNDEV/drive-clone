'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from ".."
import { APPWRITE_CONFIG } from "../config";
import { AVATAR_PLACEHOLDER_URL } from "@/constants";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";

const getUserByEmail = async (email: string) => {
    try {
        const { databases } = await createAdminClient();
        const result = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.userCollectionId,
            [Query.equal("email", [email])],
        );

        return result.total > 0 ? result.documents[0] : null;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw new Error("Failed to fetch user by email");
    }
};

export const sendEmailOTP = async (email: string) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId;
    } catch (error) {
        console.error("Error sending email OTP:", error);
        throw new Error("Failed to send email OTP");
    }
}

export const createAccount = async ({ email, fullName }: { email: string, fullName: string }) => {
    const user = await getUserByEmail(email);
    if (user) {
        throw new Error("User already exists");
    }

    const accountId = await sendEmailOTP(email);

    const { databases } = await createAdminClient();
    await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.userCollectionId,
        ID.unique(),
        {
            fullName,
            email,
            avatar: AVATAR_PLACEHOLDER_URL,
            accountId
        }
    );

    return parseStringify({ accountId });
};

export const verifyOTP = async ({ otp, accountId }: { otp: string, accountId: string }) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, otp);
        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return parseStringify({ sessionId: session.$id });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw new Error("Failed to verify OTP");
    }
};

export const getUser = async () => {
    try {
        const { database, account } = await createSessionClient();
        const result = await account.get();

        const user = await database.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.userCollectionId,
            [Query.equal("accountId", result.$id)],
        );

        if (user.total < 0) return null;
        return parseStringify(user.documents[0]);
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
    }
}