"use client"
import { Button } from "@repo/ui/button";
import Input from "@repo/ui/input";
import axios from "axios";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface formType {
    nameErr? : string;
    passwordErr : string;
    emailErr : string;
}

export default function AuthPage({isSignin} : {isSignin : boolean}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [formErrData, setFormErrData] = useState<formType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleOnClick = async () => {
        setLoading(true);
        setError("");
        setFormErrData(null);
        const endPoint = isSignin ? "/signin" : "/signup";
        const body = isSignin ? {
            email, password
        } : {
            name, email, password
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${endPoint}`, body, {
                withCredentials : true,
                headers : {
                    "Content-Type" : "application/json"
                }
            });

            const data = response.data;
            if(data.type === "success"){
                router.push("/dashboard");
            }else{
                setError(data.message || "Something went wrong");
            }
            setLoading(false);
        }catch(e){
            if (axios.isAxiosError(e)) {
                if(e.response?.data?.type === "validation_error"){
                        const newErrData : formType = {
                            emailErr: e.response?.data?.errors.email?._errors ?? [],
                            passwordErr: e.response?.data?.errors.password?._errors ?? [],
                        };

                        if (endPoint === "/signup") {
                            newErrData.nameErr = e.response?.data?.errors.name?._errors ?? [];
                        }

                        setFormErrData(newErrData);
                }
                const msg = e.response?.data?.message || "Unexpected error";
                setError(msg);
            }else{
                setError("Network error");
            }
            setLoading(false);
        }
    }

    return <div className="w-screen min-h-screen flex justify-center items-center">
        <div className="border rounded-md pb-10 px-5 w-[25%]">
            <div className="items-center justify-center flex text-3xl font-extrabold m-10">
                {isSignin && "Sign In"}
                {!isSignin && "Sign Up"}
            </div>
            <div>
                {!isSignin && <Input label={"Name"} value={name} onChange={(e) => setName(e.target.value)}></Input>}
                {(formErrData?.nameErr) && <div className="text-red-300 text-xs">{formErrData?.nameErr}</div>}
                <Input label={"Email"} value={email} onChange={(e) => setEmail(e.target.value)}></Input>
                {(formErrData) && <div className="text-red-300 text-xs">{formErrData?.emailErr}</div>}
                <Input type={"password"} label={"Password"} value={password} onChange={(e) => setPassword(e.target.value)}></Input>
                {(formErrData) && <div className="text-red-300 text-xs">{formErrData?.passwordErr}</div>}
            </div>
             {error && <div className="text-red-500 text-center py-2">{error}</div>}
            <div className="flex justify-center items-center py-2">
                <Button variant="default" size="default" onClick={handleOnClick}>
                    {loading && <Loader/>}
                    {!loading && (isSignin && "Sign In") || (!isSignin && "Sign Up")}
                </Button>
            </div>
            <div className="flex justify-center items-center py-3">
                {isSignin && "Don't have an Account?"}
                {!isSignin && "Already Have an Account?"}
                <Link href={(isSignin) ? "/signup" : "signin"} className="cursor-pointer pl-1 pointer underline" onClick={() => setLoading(true)}>
                    {isSignin && "Sign Up"}
                    {!isSignin && "Sign In"}
                </Link>
            </div>
        </div>
    </div>

}

/**
 
;
 */