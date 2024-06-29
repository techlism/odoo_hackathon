"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { RegisterFormData } from "@/lib/types";
import { BASE_URL } from "@/lib/constants";
import axios from "axios";
import { useState } from "react";

export function OTPVerificationDialog({
    registrationDetails,
}: {
    registrationDetails: RegisterFormData;
}) {
    const [otp, setOTP] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [otpSent, setOTPSent] = useState<boolean>(false);
    const sendOTP = async () => {
        const response = await axios.post(`${BASE_URL}/api/otp/send-otp`, {
            email: registrationDetails.email,
        });
        if (response?.data?.success) {
            setOTPSent(true);
        }
    };

    const registerInstituteWithAdmin = async () => {
        if(otp.length !== 6){
            return;
        }
        const response = await axios.post(
            `${BASE_URL}/api/user/register`,
            {
                "admin_name": registrationDetails.adminName,
                "email": registrationDetails.email,
                "password": registrationDetails.password,
                "institute_name": registrationDetails.instituteName,
                "address": registrationDetails.address,
                "pincode": registrationDetails.pincode,
                "otp" : otp
            }
        );
        if(response?.data?.success){          
            localStorage.setItem("token", response.data.token);
            window.location.href = `/dashboard`;
        }
        
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="default" onClick={sendOTP}>
                    Proceed -&gt;
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="justify-center">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Please verify your email.
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span>Enter the OTP sent to your email.</span>
                        <InputOTP maxLength={6} onChange={(e)=>setOTP(e)}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-red-500">
                        Cancel
                    </AlertDialogCancel>
                    <Button variant={"outline"}>Resend OTP</Button>
                    <AlertDialogAction onClick={registerInstituteWithAdmin} disabled ={!otpSent}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
