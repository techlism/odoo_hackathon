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
import { useEffect, useState } from "react";
import { FilePlus, UploadIcon } from "lucide-react";

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

export function PaperUploadDialog({
    institute_id,
    examiner_id,
}: {
    institute_id: string;
    examiner_id: string;
}) {
    const [invigilator, setInvigilator] = useState("");
    const [allInvigilators, setInvigilators] = useState<any[]>([] as any);
    const [inputFile, setInputFile] = useState<File | null>(null);

    useEffect(() => {
        const getInvigilators = async () => {
            const response = await axios.get(
                `${BASE_URL}/api/user/invigilators`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response?.data?.success) {
                setInvigilators(response?.data?.data);
            }
        };
        getInvigilators();
    }, []);

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
        if (file && file.name.toLowerCase().endsWith("pdf")) {
            setInputFile(file);
        }
    };

    const handleInvigilatorChange = (value: string) => {
        setInvigilator(value);
    };

    const uploadPaper = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("invigilator", invigilator);

        const paperName = formData.get("paperName");
        const paperCode = formData.get("paperCode");
        const startTime = formData.get("startTime");
        const endTime = formData.get("endTime");
        const fromdata2 = new FormData();
        fromdata2.append("paper", inputFile as Blob);
        fromdata2.append("paper_code", paperCode as string);
        fromdata2.append("paper_name", paperName as string);
        fromdata2.append("institute_id", institute_id);
        fromdata2.append("examiner_id", examiner_id);
        fromdata2.append("invigilators", invigilator);
        fromdata2.append("access_time_start", startTime as string);
        fromdata2.append("access_time_end", endTime as string);
        console.log(inputFile);

        if (
            paperName &&
            paperCode &&
            invigilator &&
            startTime &&
            endTime &&
            inputFile
        ) {
            const response = await axios.post(
                `${BASE_URL}/api/paper/create-paper`,
                fromdata2,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response?.data?.success) {
                window.location.reload();
            }
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="default" className="flex">
                    <FilePlus className="mr-2" />
                    Upload Paper
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="justify-center">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Upload New Paper
                        </CardTitle>
                        <CardDescription>
                            Fill out the form below to upload a new paper.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <form onSubmit={uploadPaper} id="upload_paper">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="paperName"
                                    className="inline-block"
                                >
                                    Paper Name
                                </Label>
                                <Input
                                    id="paperName"
                                    name="paperName"
                                    placeholder="Enter paper name"
                                    className="inline-block"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="paperCode"
                                    className="inline-block"
                                >
                                    Paper Code
                                </Label>
                                <Input
                                    id="paperCode"
                                    name="paperCode"
                                    placeholder="Enter paper code"
                                    className="inline-block"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="invigilator"
                                    className="inline-block"
                                >
                                    Select Invigilator
                                </Label>
                                <Select onValueChange={handleInvigilatorChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select invigilator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allInvigilators.map((invigilator) => (
                                            <SelectItem
                                                key={invigilator?._id}
                                                value={invigilator?._id}
                                            >
                                                {invigilator?.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="startTime"
                                    className="inline-block"
                                >
                                    Paper Start Time
                                </Label>
                                <Input
                                    id="startTime"
                                    name="startTime"
                                    type="datetime-local"
                                    className="inline-block"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="endTime"
                                    className="inline-block"
                                >
                                    Paper End Time
                                </Label>
                                <Input
                                    id="endTime"
                                    name="endTime"
                                    type="datetime-local"
                                    className="inline-block"
                                />
                            </div>
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
                                        {inputFile === null ? (
                                            <UploadIcon />
                                        ) : (
                                            inputFile.name
                                        )}
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
                                        accept={`application/pdf`}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </Label>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-red-500">
                        Cancel
                    </AlertDialogCancel>
                    <Button type="submit" form="upload_paper">
                        Upload Paper
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
