import axios from "axios"
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId : string){
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${roomId}`);
    console.log(response.data);
    return response.data.messages;
}

export default async function ChatRoom({id} : {id: string}){
    const messages = await getChats(id);
    return <ChatRoomClient messages={messages} id={id}/>
}