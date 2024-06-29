'use client'
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
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { RegisterFormData } from "@/lib/types";
  
  export function OTPVerificationDialog({registrationDetails} : {registrationDetails : RegisterFormData}) {
    const sendOTP = () => {
      console.log("OTP sent");
      console.log(registrationDetails);
    }
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="default" onClick={sendOTP}>Proceed -&gt;</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="justify-center">
          <AlertDialogHeader>
            <AlertDialogTitle>Please verify your email.</AlertDialogTitle>
            <AlertDialogDescription>
            <span>Enter the OTP sent to your email.</span>
            <InputOTP maxLength={6}>
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
            <AlertDialogCancel className="text-red-500">Cancel</AlertDialogCancel>
            <Button variant={'outline'}>Resend OTP</Button>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  