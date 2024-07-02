"use client";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/constants";
import axios from "axios";
import { useState } from "react";
import { UserPlus } from "lucide-react";

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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export function CreateUserDialog({ institute_id }: { institute_id: string }) {
    const [role, setRole] = useState("");

    const handleRoleChange = (value: string) => {
        setRole(value);
    };

    const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("role", role); // Manually append role to form data

        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        if(email && password && name && role){
            const response = await axios.post(`${BASE_URL}/api/user/register-new-user`, {
                email,
                password,
                name,
                role,
                institute_id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Replace YOUR_AUTH_TOKEN with the actual token
                }
            });
            if(response?.data?.success){
                console.log("User created successfully");
                // Close the dialog
                window.location.reload();
            }
        }                
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="default" className="flex">
                    <UserPlus className="mr-2" />
                    Create User
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="justify-center">    
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Create New User
                        </CardTitle>
                        <CardDescription>
                            Fill out the form below to create a new user.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <form onSubmit={createUser} id="create_user">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="inline-block">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter name"
                                    className="inline-block"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="inline-block">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    className="inline-block"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="inline-block"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    className="inline-block"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="inline-block">
                                    Role
                                </Label>
                                <Select onValueChange={handleRoleChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="examiner">
                                            Examiner
                                        </SelectItem>
                                        <SelectItem value="invigilator">
                                            Invigilator
                                        </SelectItem>
                                        <SelectItem value="admin">
                                            Admin
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-red-500">
                        Cancel
                    </AlertDialogCancel>
                    <Button type="submit" form="create_user">
                        Create User
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
