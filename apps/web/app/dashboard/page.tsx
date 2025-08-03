import Link from "next/link";
import DashboardClient from "../../components/DashboardClient";
import { fetchUserRooms, getUserFromCookie } from "../../lib/auth";
import { Button } from "@repo/ui/button";
import { ArrowRight } from "lucide-react";

export default async function Dashboard() {
    const userId  : string | null=  await getUserFromCookie();
    if(!userId){
        return <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="mx-auto p-10 rounded-2xl shadow-md bg-gray-400 flex flex-col items-center justify-center gap-2">
                Unauthorized Access, Please Sign in
                <Link href="/dashboard">
                    <Button variant="default" size="lg" className="group">
                        Dashboard
                        <ArrowRight className='group-hover:translate-x-1 transition-transform'/>
                    </Button>
                </Link>
                <Link href='/signin'>
                    <Button variant="outline" size="lg">
                        Signin
                    </Button>
                </Link>
            </div>
        </div>
    }
    const DashboardData = await fetchUserRooms(userId);
    if(!DashboardData){
        return <div>
            Internal Server Eror
        </div>
    }
    
    return <DashboardClient rooms={DashboardData.rooms} user={DashboardData.user}/>
}
