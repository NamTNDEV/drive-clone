export const APPWRITE_CONFIG = {
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
    fileCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILE_COLLECTION_ID!,
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
    secret: process.env.NEXT_APPWRITE_SECRET!,
}