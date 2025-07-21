import Link from "next/link";
import Canvas from "../../../components/Canvas";
import { checkRoomExists } from "../../../utils/server";
import { Button } from "@repo/ui/button";

export default async function CanvasPage({params} : {
    params : {
        roomId : string
    }
}){
    const roomId = (await params).roomId;
    const roomExists = await checkRoomExists(roomId);
    if(!roomExists){
        return <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <p className="text-gray-600 my-2">The room you're trying to access doesn't exist.</p>
        <Link href={"/dashboard"}>
            <Button variant="default" size="lg">Back to Dashboard</Button>
        </Link>
      </div>
    }
    return <Canvas roomId={roomId}/>
}