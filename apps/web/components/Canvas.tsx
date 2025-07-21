"use client"
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { Draw } from "../utils/Draw";
import Topbar from "./Topbar";

export type Tool = "ellipse" | "rect" | "pencil" | "line" | "text" ;

export default function Canvas({roomId} : {roomId : string}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>("rect");
    const [drawBoard, setDrawBoard] = useState<Draw>()
    const {socket, loading, error} = useSocket(roomId);

    useEffect(()=>{
        if(canvasRef.current && socket){
            const draw = new Draw(canvasRef.current, Number(roomId), socket);
            setDrawBoard(draw);

            return () =>{
                draw.destroy();
            }
        }
    },[canvasRef, socket]);

    useEffect(() => {
        drawBoard?.setTool(selectedTool);
    },[selectedTool, drawBoard])
     
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
    return <div className="h-[100vh] overflow-hidden">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}/>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
    </div>
}