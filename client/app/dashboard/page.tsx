"use client";

import { BASE_URL } from "@/lib/constants";
import axios from "axios";
import { LockIcon, UploadIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateUserDialog } from "../../components/CreateUserDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
    const [userData, setUserData] = useState({} as any);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [inputFile, setInputFile] = useState<File | null>(null);
        
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
    const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };     
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Set the first file to your state variable
            setInputFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const file = event.target.files?.[0] || null;
        // file?.name && console.log(file.name);
        if (file && file.name.toLowerCase().endsWith('pdf')){
          setInputFile(file);
        }
      };
    
      
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
            <div>
                <Label
                    htmlFor="dropzone-file"
                    className="justify-self-center cursor-pointer"
                >
                    <div
                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 "
                        onDragOver={preventDefaults}
                        onDragEnter={preventDefaults}
                        onDragLeave={preventDefaults}
                        onDrop={handleDrop}
                    >
                        <UploadIcon />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                            <span className="font-semibold">
                                Click to Select
                            </span>{" "}
                            or Drag and Drop
                        </p>
                    </div>
                    <Input
                        id="dropzone-file"
                        type="file"
                        accept={`.pdf`}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </Label>
            </div>
        </main>
    );
}
