import axios from "axios";

export async function checkRoomExists(roomId: string): Promise<boolean> {
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room-exists/${roomId}`);
        const data = response.data;
        if(data.type === "success") return true;
        else return false;
    }catch(e){
        if (axios.isAxiosError(e)) {
            const msg = e.response?.data?.message || "Unexpected error";
            console.log(msg);
        }else{
            console.log(e);
        }
        return false;
    }
}
