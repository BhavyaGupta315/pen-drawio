import axios from "axios";
import ChatRoom  from "../../../components/ChatRoom";

async function getRoomId(slug : string): Promise<string | null> {
    const roomId = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room/${slug}`);
    console.log(roomId.data);
    if(!roomId.data.room.id){
        return null;
    }
    return roomId.data.room.id;
}

export default async function RoomId({
    params
} : {
    params : {
        slug : string
    }
}){
    const slug = (await params).slug;
    const roomId = await getRoomId(slug);
    if(!roomId){
        return <div>
            Loading...
        </div>
    }
    return <div>
        <ChatRoom id={roomId}/>
    </div>
}