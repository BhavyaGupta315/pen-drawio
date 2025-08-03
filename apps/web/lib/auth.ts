import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getUserFromCookie() : Promise<string | null>{
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) return null;
  try {
    const user = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return user.userId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function fetchUserRooms(userId : string){
    try{
        const AxiosRoomsData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${userId}`);
        if(AxiosRoomsData.data.type === "success"){
            const rooms = AxiosRoomsData.data.rooms;
            const user = AxiosRoomsData.data.user;
            return {rooms, user};
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
        return null;
    }
} 
