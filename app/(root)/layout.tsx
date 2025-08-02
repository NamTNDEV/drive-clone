import Sidebar from "@/components/layout/Sidebar";
import { getUser } from "@/lib/appwrite/actions/user.actions";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getUser();

    return <main className="flex h-screen">
        <Sidebar {...currentUser} />

        <section className="flex w-full flex-1 flex-col">
            {/* MobileNavigation */}

            {/* Header */}

            <div className="main-content remove-scrollbar">
                {children}
            </div>
        </section>
    </main>;
};

export default RootLayout;
