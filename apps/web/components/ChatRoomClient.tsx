"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"

export function ChatRoomClient({
    messages,
    id
} : {
    messages : {message : string; key : number}[],
    id : string
}){
    const {socket, loading} = useSocket();
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(()=>{
        if(socket && !loading){
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                console.log(parsedData);
                if(parsedData.type === "chat"){
                    setChats(c => [...c, {message : parsedData.message, key : parsedData.id}]);
                }
            }
        }
        
    },[socket, loading]);

    useEffect(() => {
        if(socket){
            socket.send(JSON.stringify({
                type : "join_room",
                roomId : id 
            }))
        }
        
    },[socket, id]);

    return <div>
        {chats.map(m => <div key={m.key}>{m.message}</div>)}
        <input type="text" value={currentMessage} placeholder="Chat Here" onChange={(e) =>{
            setCurrentMessage(e.target.value);
        }}></input>
        <button onClick={() => {
            if(!socket){
                alert("Please Wait a while, Server is not connected");
                return;
            }
            socket.send(JSON.stringify({
                type : "chat",
                roomId : id,
                message : currentMessage
            }));
            setCurrentMessage("");
        }}>Send Message</button>
    </div>
}