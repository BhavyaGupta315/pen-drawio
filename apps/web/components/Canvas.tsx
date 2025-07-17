"use client"
import { useEffect, useRef } from "react";
import initDraw from "../utils/draw";

export default function Canvas({roomId} : {roomId : string}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        if(canvasRef.current){
            initDraw(canvasRef.current, roomId);
        }
    },[canvasRef])
    
    return <div className="relative overflow-hidden">
        <canvas ref={canvasRef} width="1920" height="785"/>
    </div>
}