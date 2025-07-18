"use client"
import { useEffect, useRef } from "react";
import initDraw from "../utils/draw";
import { useSocket } from "../hooks/useSocket";

export default function Canvas({roomId} : {roomId : string}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {socket, loading, error} = useSocket(roomId);
    useEffect(()=>{
        if(canvasRef.current && socket){
            console.log("Cnvas Is here init")
            initDraw(canvasRef.current, roomId, socket);
        }
    },[canvasRef, socket])
    
    if(loading){
        return <div>
            Connecting to Server.....
        </div>
    }
    if(error){
        return <div>
            <div>
                Some issue with the server - 
            </div>
            <div>
                {error}
            </div>
        </div>
    }
    return <div className="relative overflow-hidden">
        <canvas ref={canvasRef} width="1920" height="785"/>
    </div>
}