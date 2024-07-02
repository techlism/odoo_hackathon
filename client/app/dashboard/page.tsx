"use client";
import { format } from "date-fns";

import { BASE_URL } from "@/lib/constants";
import axios from "axios";
import { LockIcon, UploadIcon, UserIcon, Delete, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateUserDialog } from "../../components/CreateUserDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaperUploadDialog } from "@/components/UploadPaper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { saveAs } from 'file-saver';

export default function Dashboard() {
    const [userData, setUserData] = useState({} as any);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [papers, setPapers] = useState([]);
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        paper_id: any
    ) => {
        const file = event.target.files?.[0] || null;
        // file?.name && console.log(file.name);
        if (file && file.name.toLowerCase().endsWith("pdf")) {

            const formData = new FormData();
            formData.append("paper", file);
            try {
                const response = await axios.put(
                    `${BASE_URL}/api/paper/update-paper/${paper_id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (response?.data?.success) {
                    console.log(response.data);
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error uploading paper:", error);
            }
        }
    };
    async function downloadPaper(paper_id: any, encryptedFileName: any) {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/paper/download-paper/${encryptedFileName}/${paper_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    responseType: 'blob' // Important for handling binary data
                }
            );

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/pdf' });
            // Use file-saver to trigger a download
            saveAs(blob, `${encryptedFileName}.pdf`);
        } catch (error) {
            console.error("Error downloading paper:", error);
        }
    }

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
    useEffect(() => {
        async function fetchPapers() {
            const response = await axios.get(`${BASE_URL}/api/paper/papers`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response?.data?.success) {
                console.log(response.data.data);
                setPapers(response.data.data);
            }
        }
        if (loggedIn) {
            fetchPapers();
        }
    }, [loggedIn])
    if (!loggedIn) {
        return <h1 className="text-5xl">Loading..</h1>;
    }


    return (

        <main className="min-h-screen flex justify-center items-center align-middle flex-col flex-1 space-y-4">
            <div className="border rounded-lg p-4">
                <div className="flex flex-row items-center justify-end">
                    <LogOut color="black" size="24" onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                        className="cursor-pointer" />
                </div>
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
                <h2 className="text-xl font-medium">
                    You are an {userData?.role.charAt(0).toUpperCase() + userData?.role.slice(1)}
                </h2>
            </div>
            {
                userData?.role === "admin" ? (
                    <CreateUserDialog
                        institute_id={userData?.institute?.institute_id}
                    />
                ) : (null)
            }
            {
                userData?.role === "invigilator" ? (null) : (
                    <PaperUploadDialog institute_id={userData?.institute?.institute_id} examiner_id={userData?._id} />
                )
            }
            <div className="space-y-8">
                {papers.map((paper: any) => (
                    <div key={paper._id} className="max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden" style={{
                        // if paper is live bg green otherwise white
                        backgroundColor: new Date(paper.access_time_start) < new Date() && new Date(paper.access_time_end) > new Date() ? "rgb(117 237 112 / 46%)" : "white"
                    }}>
                        <div className="px-6 py-4">
                            <h2 className="text-2xl font-bold text-gray-800">{paper.paper_name}</h2>
                            <p className="text-sm text-gray-500">{paper.paper_code}</p>
                            {
                                new Date(paper.access_time_start) < new Date() && new Date(paper.access_time_end) > new Date() ? (
                                    <p className="text-sm text-green-700 font-bold">This paper is now live</p>
                                ) : (
                                    null
                                )
                            }
                            {
                                new Date(paper.access_time_start) > new Date() ? (
                                    <p className="text-sm text-gray-500 font-bold">Upcoming paper</p>
                                ) : (
                                    null
                                )
                            }
                            {
                                new Date(paper.access_time_end) < new Date() ? (
                                    <p className="text-sm text-gray-500 font-bold">Paper over!</p>
                                ) : (
                                    null
                                )
                            }
                        </div>
                        <div className="px-6 py-2">
                            <p className="text-sm text-gray-700">Access Start Time: {format(new Date(paper.access_time_start), "Pp")}</p>
                            <p className="text-sm text-gray-700">Access End Time: {format(new Date(paper.access_time_end), "Pp")}</p>
                            {
                                userData?.role === "invigilator" ? (null) : (
                                    <div className="relative cursor-pointer px-4 py-2 mt-2 bg-primary text-white rounded hover:bg-primary-dark w-60 h-10 focus:outline-none">
                                        Upload New Version
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, paper._id)}
                                            className=" inset-0 opacity-0 cursor-pointer"
                                            accept="application/pdf"
                                        />
                                    </div>
                                )
                            }
                            {paper.papers.slice(0).reverse().map((subPaper: any) => (
                                <div key={subPaper._id} className="mt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col items-start">
                                            <p className="text-sm text-gray-500">Uploaded At: {format(new Date(subPaper.upload_time), "Pp")}</p>
                                            <p className="text-sm text-gray-500">{subPaper?.paper_url}</p>
                                        </div>
                                        {userData?.role === "invigilator" ? (null) : (
                                            <Delete color="red" size="24" />
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <button
                                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none"
                                            onClick={() => downloadPaper(paper._id, subPaper.paper_url)}
                                        >
                                            Download
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
