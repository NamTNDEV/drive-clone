'use client';
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { AVATAR_PLACEHOLDER_URL, navItems } from "@/constants";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FileUploader from "../others/FileUploader";
import { Button } from "../ui/button";
import { signOutUser } from "@/lib/appwrite/actions/user.actions";

type SidebarProps = {
    fullName?: string;
    email?: string;
    avatar?: string;
}

const MobileNavigation = ({ fullName, email, avatar }: SidebarProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();

    return <header className="mobile-header">
        <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={120}
            height={52}
            className="h-auto"
        />

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
                <Image
                    src="/assets/icons/menu.svg"
                    alt="Search"
                    width={30}
                    height={30}
                />
            </SheetTrigger>
            <SheetContent className="shad-sheet h-screen px-3">
                <SheetTitle>
                    <div className="header-user">
                        <Image
                            src={avatar || AVATAR_PLACEHOLDER_URL}
                            alt="avatar"
                            width={44}
                            height={44}
                            className="header-user-avatar"
                        />
                        <div className="sm:hidden lg:block">
                            <p className="subtitle-2 capitalize">{fullName || "Unknown User"}</p>
                            <p className="caption">{email || "No Email Provided"}</p>
                        </div>
                    </div>
                    <Separator className="mb-4 bg-light-200/20" />
                </SheetTitle>
                <nav className="mobile-nav">
                    <ul className="mobile-nav-list">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.url} className="lg:w-full" >
                                <li className={
                                    cn("mobile-nav-item",
                                        pathname === item.url && "shad-active",
                                    )}>
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        width={24}
                                        height={24}
                                        className={cn(
                                            "nav-icon",
                                            pathname === item.url && "nav-icon-active",
                                        )}
                                    />
                                    <p className={
                                        cn("", pathname === item.url && "text-white")
                                    }>{item.name}</p>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </nav>

                <Separator className="my-5 bg-light-200/20" />

                <div className="flex flex-col justify-between gap-5 pb-5">
                    <FileUploader />
                    <Button
                        type="submit"
                        className="mobile-sign-out-button"
                        onClick={async () => await signOutUser()}
                    >
                        <Image
                            src="/assets/icons/logout.svg"
                            alt="logo"
                            width={24}
                            height={24}
                        />
                        <p>Logout</p>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    </header>;
};

export default MobileNavigation;
