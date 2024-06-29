'use client'

import { BASE_URL } from "@/lib/constants";
import axios from "axios";
import { useEffect, useState } from "react"

export default function Dashboard(){
    const [userData, setUserData] = useState({} as any);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if(!token){
                window.location.href = "/login";
            }
            const response  = await axios.get(`${BASE_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response?.data?.success){
                setUserData(response?.data?.data);
                setLoggedIn(true);
            }  
        }
        if(!loggedIn){
            fetchUserData();
        }
    }, [loggedIn])
    if(!loggedIn){
        return <h1>You are not logged in please log in/register.</h1>
    }
    return (
        <main>
            <h1>Welcome {userData?.name}</h1>
            <p>{userData?.role}</p>
            <h2>Your Institute: {userData?.institute?.name}</h2>

        </main>
    )
}