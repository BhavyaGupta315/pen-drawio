import { Button } from "@repo/ui/button";
import Input from "@repo/ui/input";
import Link from "next/link";

export default function AuthPage({isSignin} : {isSignin : boolean}){
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="border rounded-md pb-10 px-5 w-[25%]">
            <div className="items-center justify-center flex text-3xl font-extrabold m-10">
                {isSignin && "Sign In"}
                {!isSignin && "Sign Up"}
            </div>
            <div>
                {!isSignin && <Input label={"Name"}></Input>}
                <Input label={"Email"}></Input>
                <Input label={"Password"}></Input>
            </div>
            <div className="flex justify-center items-center py-2">
                <Button variant="default" size="default">
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