"use client"
import { Button } from "@repo/ui/button";
import Input from "@repo/ui/input";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage({isSignin} : {isSignin : boolean}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleOnClick = async () => {
        setError("");
        const endPoint = isSignin ? "/signin" : "/signup";
        const body = isSignin ? {
            email, password
        } : {
            name, email, password
        };

        try {
            console.log("Request Going")
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${endPoint}`, body, {
                withCredentials : true,
                headers : {
                    "Content-Type" : "application/json"
                }
            });

            const data = response.data;
            console.log("Data - ", data);
            if(data.type === "success"){
                router.push("/dashboard");
            }else{
                setError(data.message || "Something went wrong");
            }
        }catch(e){
            console.error(error);
            setError("Network error");
        }
    }

    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="border rounded-md pb-10 px-5 w-[25%]">
            <div className="items-center justify-center flex text-3xl font-extrabold m-10">
                {isSignin && "Sign In"}
                {!isSignin && "Sign Up"}
            </div>
            <div>
                {!isSignin && <Input label={"Name"} value={name} onChange={(e) => setName(e.target.value)}></Input>}
                <Input label={"Email"} value={email} onChange={(e) => setEmail(e.target.value)}></Input>
                <Input type={"password"} label={"Password"} value={password} onChange={(e) => setPassword(e.target.value)}></Input>
            </div>
             {error && <div className="text-red-500 text-center py-2">{error}</div>}
            <div className="flex justify-center items-center py-2">
                <Button variant="default" size="default" onClick={handleOnClick}>
                    {isSignin && "Sign In"}
                    {!isSignin && "Sign Up"}
                </Button>
            </div>
            <div className="flex justify-center items-center py-3">
                {isSignin && "Don't have an Account?"}
                {!isSignin && "Already Have an Account?"}
                <Link href={(isSignin) ? "/signup" : "signin"} className="cursor-pointer pl-1 pointer underline">
                    {isSignin && "Sign Up"}
                    {!isSignin && "Sign In"}
                </Link>
            </div>
        </div>
    </div>

}