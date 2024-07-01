"use client";
import { format } from "date-fns";

import { BASE_URL } from "@/lib/constants";
import axios from "axios";
import { LockIcon, UploadIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateUserDialog } from "../../components/CreateUserDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaperUploadDialog } from "@/components/UploadPaper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {saveAs} from 'file-saver';

export default function Dashboard() {
    const [userData, setUserData] = useState({} as any);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [papers, setPapers] = useState([]);

    async function downloadPaper(paper_id:any, encryptedFileName:any) {
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
          saveAs(blob, 'decrypted-paper.pdf');
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
            <PaperUploadDialog institute_id={userData?.institute?.institute_id} examiner_id={userData?._id} />
            <div className="space-y-4">
                {papers.map((paper: any) => (
                    <Card key={paper._id} className="w-full max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{paper.paper_name}</CardTitle>
                            <p className="text-sm text-gray-500">{paper.paper_code}</p>
                        </CardHeader>
                        <CardContent>
                            <p>Access Start Time: {format(new Date(paper.access_time_start), "Pp")}</p>
                            <p>Access End Time: {format(new Date(paper.access_time_end), "Pp")}</p>
                            {paper.papers.map((subPaper: any) => (
                                <div key={subPaper._id} className="mt-4">
                                    <p className="text-sm text-gray-500">Uploaded At: {format(new Date(subPaper.upload_time), "Pp")}</p>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="default" onClick={() => downloadPaper(paper?._id, subPaper?.paper_url)}>
                                            Download
                                        </Button>
                                        <label className="btn btn-default">
                                            Upload New Version
                                            <input
                                                type="file"
                                                //   onChange={(e) => handleUploadNewVersion(e, subPaper._id)}
                                                style={{ display: "none" }}
                                            />
                                        </label>
                                    </CardFooter>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}
