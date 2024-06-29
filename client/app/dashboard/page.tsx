"use client";

import { BASE_URL } from "@/lib/constants";
import axios from "axios";
import { LockIcon, UploadIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateUserDialog } from "../../components/CreateUserDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaperUploadDialog } from "@/components/UploadPaper";

export default function Dashboard() {
    const [userData, setUserData] = useState({} as any);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
            }
            const response = await axios.get(`${BASE_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response?.data?.success) {
                setUserData(response?.data?.data);
                setLoggedIn(true);
            }
        };
        if (!loggedIn) {
            fetchUserData();
        }
    }, [loggedIn]);
    if (!loggedIn) {
        return <h1>You are not logged in please log in/register.</h1>;
    }

      
    return (
        
        <main className="min-h-screen flex justify-center items-center align-middle flex-col flex-1 space-y-4">
            <div className="border rounded-lg p-4">
                <div className="flex gap-4 align-middle items-center">
                    <p className="text-gray-500">
                        {userData?.role === "admin" ? (
                            <LockIcon color="green" />
                        ) : (
                            <UserIcon color="green" />
                        )}
                    </p>
                    <h1 className="text-3xl font-bold">
                        Welcome,{" "}
                        <span className="text-4xl font-bold">
                            {userData?.name}
                        </span>{" "}
                    </h1>
                </div>
                <h2 className="text-2xl font-medium">
                    {userData?.institute?.name}
                </h2>
            </div>
            <CreateUserDialog
                institute_id={userData?.institute?.institute_id}
            />     
            <PaperUploadDialog institute_id="nalla" />
        </main>
    );
}
