"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from 'axios';
import { BASE_URL } from "@/lib/constants";

export default function Login() {
    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Logging in");

        const formData = new FormData(e.currentTarget);
        let email = "" ;
        let password = "";
        // Log form data entries
        for (let [key, value] of formData.entries()) {
            if(key.includes("email")){
                email = value.toString();
            }
            else {
                password = value.toString();            
            }
        }
        if(email && password){
            const response = await axios.post(`${BASE_URL}/api/user/login`, {
                email,
                password
            });
            if(response?.data?.success){
                localStorage.setItem("token", response.data.token);
                window.location.href = "/dashboard";
            }
        }
    };

    return (
        <main className="min-h-screen flex justify-center items-center">
            <div className="grid grid-cols-1 space-y-4 gap-4">
                <form
                    onSubmit={login}
                    className="grid grid-cols-1 gap-4 border rounded-lg p-4"
                >
                    <div>
                        <Label htmlFor="login_email">Email</Label>
                        <Input type="email" required placeholder="Please enter your email" id="login_email" name="email"/>
                    </div>
                    <div>
                        <Label htmlFor="login_password">Password</Label>
                        <Input type="password" required placeholder="Password here" id="login_password" name="password"/>
                    </div>
                    <Button type="submit">Login</Button>
                </form>
                <div className="border rounded-lg flex flex-col justify-center align-middle items-center space-y-4 w-full py-4">
                    <p className="text-gray-500">Not registered?</p>
                    <Link href={"/register"} className="border p-2 rounded-lg bg-primary text-secondary">Register your Institute</Link>
                </div>
            </div>
        </main>
    );
}
