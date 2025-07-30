'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient } from ".."
import { APPWRITE_CONFIG } from "../config";
import { AVATAR_PLACEHOLDER_URL } from "@/constants";
import { parseStringify } from "@/lib/utils";

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