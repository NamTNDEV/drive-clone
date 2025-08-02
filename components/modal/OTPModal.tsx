'use client';
import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { Button } from "../ui/button";
import { sendEmailOTP, verifyOTP } from "@/lib/appwrite/actions/user.actions";
import { useRouter } from "next/navigation";

type OTPModalProps = {
    email: string;
    accountId: string;
}

const OTPModal = ({ email, accountId }: OTPModalProps) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    const [otp, setOtp] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const handleOTPSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const sessionId = await verifyOTP({ otp, accountId });
            if (sessionId) {
                setIsOpen(false);
                router.push("/");
            }
        } catch (error) {
            console.error("Error submitting OTP:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            await sendEmailOTP(email);
        } catch (error) {
            console.error("Error resending OTP:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader className="relative flex justify-center">
                    <AlertDialogTitle className="h2 text-center">
                        Enter your OTP

                        <Image
                            src="/assets/icons/close-dark.svg"
                            alt="close"
                            width={20}
                            height={20}
                            onClick={() => setIsOpen(false)}
                            className="otp-close-button"
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription className="subtitle-2 text-center text-light-100">
                        We&apos;ve sent a code to{" "}
                        <span className="pl-1 text-brand">{email}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup className="shad-otp">
                        <InputOTPSlot index={0} className="shad-otp-slot" />
                        <InputOTPSlot index={1} className="shad-otp-slot" />
                        <InputOTPSlot index={2} className="shad-otp-slot" />
                        <InputOTPSlot index={3} className="shad-otp-slot" />
                        <InputOTPSlot index={4} className="shad-otp-slot" />
                        <InputOTPSlot index={5} className="shad-otp-slot" />
                    </InputOTPGroup>
                </InputOTP>

                <AlertDialogFooter>
                    <div className="flex w-full flex-col gap-4">
                        <AlertDialogAction
                            disabled={isLoading || otp.length < 6}
                            onClick={handleOTPSubmit}
                            className="shad-submit-btn h-12 cursor-pointer"
                            type="button"
                        >
                            Submit

                            {isLoading && (
                                <Image
                                    src="/assets/icons/loader.svg"
                                    alt="loader"
                                    width={24}
                                    height={24}
                                    className="ml-2 animate-spin"
                                />
                            )}
                        </AlertDialogAction>

                        <div className="subtitle-2 mt-2 text-center text-light-100">
                            Didn&apos;t get a code?
                            <Button
                                type="button"
                                variant="link"
                                className="pl-1 text-brand cursor-pointer"
                                disabled={isLoading}
                                onClick={handleResendOTP}
                            >
                                Click to resend
                            </Button>
                        </div>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default OTPModal;
