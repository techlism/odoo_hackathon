'use client'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { OTPVerificationDialog } from "../../components/OTPVerificationDialog";
import { MoveLeft } from "lucide-react";
import { RegisterFormData } from "@/lib/types";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function Register() {
    const [formData, setFormData] = useState<RegisterFormData>({
        instituteName: "",
        address: "",
        pincode: "",
        adminName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [validated , setValidated] = useState<boolean>(false);
    function validate(){
        setValidated(false);
        if(formData.password !== formData.confirmPassword){
            setError("Passwords do not match");
        }
        else if (formData.instituteName === "" || formData.address === "" || formData.pincode === "" || formData.adminName === "" || formData.email === "" || formData.password === "" || formData.confirmPassword === ""){
            setError("Please fill out all the fields");        
        }
        else if(formData.email.indexOf('@') === -1 || formData.email.indexOf('.') === -1){
            setError("Invalid email address");
        }
        else{
            setValidated(true);
        }
        setError(null);
    }
    return (
        <main className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex align-middle items-center">
                        <Link href={"/"}>
                            <MoveLeft className="mr-4" />
                        </Link>
                        Register Your Institute
                    </CardTitle>
                    <CardDescription>
                        Fill out the form below to register your institute.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid grid-cols-2 gap-4" onSubmit={validate}>
                        <div className="col-span-2">
                            <Label
                                htmlFor="institute-name"
                                className="inline-block"
                            >
                                Institute Name
                            </Label>
                            <Input
                                id="institute-name"
                                placeholder="Enter institute name"
                                className="inline-block"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    instituteName: e.target.value,
                                })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="address" className="inline-block">
                                Address
                            </Label>
                            <Input
                                id="address"
                                placeholder="Enter institute address"
                                className="inline-block"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    address: e.target.value,
                                })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="pincode" className="inline-block">
                                Pincode
                            </Label>
                            <Input
                                id="pincode"
                                placeholder="Enter pincode"
                                className="inline-block"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    pincode: e.target.value,
                                })
                                }
                            />
                        </div>
                        <div className="col-span-2">
                            <Label
                                htmlFor="admin-name"
                                className="inline-block"
                            >
                                Admin Name
                            </Label>
                            <Input
                                id="admin-name"
                                placeholder="Enter admin name"
                                className="inline-block"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    adminName: e.target.value,
                                })
                                }
                            />
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="email" className="inline-block">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                className="inline-block"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="inline-block">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                className="inline-block"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                                }
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="confirm-password"
                                className="inline-block"                                
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm password"
                                className="inline-block"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    confirmPassword: e.target.value,
                                }                         
                                )                                
                                }
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="grid grid-cols-1 items-center space-y-4">
                {error && 
                    <div className="rounded-lg p-2 bg-red-50">
                         <p className="text-red-500">{error}</p>
                    </div>
                }
                {!validated && <Button onClick={validate}>Validate</Button>}
                {validated && (
                    <OTPVerificationDialog registrationDetails={formData}/>
                )}
                </CardFooter>
            </Card>
        </main>
    );
}    