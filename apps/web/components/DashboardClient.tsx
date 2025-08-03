"use client";
import { Button } from "@repo/ui/button";
import Input from "@repo/ui/input";
import axios from "axios";
import { ArrowRight, Pencil, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Room = {
  id: string;
  slug: string;
  createdAt : string;
  adminId : string;
};

type User = {
    id : String;
    email : String;
    password :String;
    name : String;
    photo? : String;
}

type Props = {
  rooms: Room[];
  user : User;
};
export default function DashboardClient({ rooms, user} : Props){
    const [joinedRooms, setJoinedRooms] = useState<Room[]>(rooms || []);
    const [createSlug, setCreateSlug] = useState("");
    const [joinSlug, setJoinSlug] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleCreateRoom = async () => {
        setError("");
        if(setJoinedRooms.length >= 5){
            setError("Limit Reached!");
            return;
        }
        if(createSlug === ""){
            setError("Enter a Valid Value");
            return;
        }
        const body = JSON.stringify({
            name : createSlug
        })
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-room`, body, {
                withCredentials : true,
                headers : {
                    "Content-Type" : "application/json"
                }
            }); 
            
            const data = response.data;
            if(data.type === "success"){
                if (!data.room) {
                    setError(data.message || "Room creation failed.");
                    return;
                }
                console.log(joinedRooms);
                setJoinedRooms((prev) => [data.room, ...prev]);
                console.log("New - ", joinedRooms);
                router.push(`/canvas/${data.room.id}`);
            }else{
                setError(data.message || "Something went wrong");
            }
        }catch(e){
            console.log(e);
            if (axios.isAxiosError(e)) {
                const msg = e.response?.data?.message || "Unexpected error";
                setError(msg);
            }else{
                setError("Failed to Create Room");
            }
        }
    };



    const handleJoinRoom = async () => {
        setError("");
        if(joinSlug === ""){
            setError("Enter a Valid Value");
            return;
        }
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room/${joinSlug}`);
            const data = response.data;

            if(data.type === "success"){
                if (!data.room){
                    setError("Room not found.");
                    return;
                }
                setJoinedRooms((prev) => [data.room, ...prev]);
                router.push(`/canvas/${data.room.id}`);
            }else{
                setError(data.message || "Something went wrong");
            }

        } catch (e) {
            console.log(e);
            if (axios.isAxiosError(e)) {
                const msg = e.response?.data?.message || "Unexpected error";
                setError(msg);
            }else{
                setError("Failed to Join Room");
            }
        }
    };
    const copyLink = async (id: string, url : string) => {
        navigator.clipboard.writeText(`${url}/canvas/${id}`);
        alert("Link copied to clipboard!");
    };

    const handleSignout = async () =>{
        try{
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signout`, {}, {
                withCredentials : true,
                headers : {
                    "Content-Type" : "application/json"
                }
          });
          if(response.data.type === "success"){
              router.push("/");
          }else{
            alert("Internal Server Error");
          }
        }catch(err){
          console.log(err);
          alert("Internal Server Error");
        }
      
    }

      return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-4">
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl bg-[#404040] backdrop-blur-md rounded-xl shadow-lg px-6 py-4 flex justify-between items-center z-50 border border-gray-700">
        <h1 className="text-xl font-bold flex"><Pencil className="m-1"/> Dashboard</h1>
        <div className="flex gap-5">
            <div className="text-gray-300">Welcome, <span className="font-medium">{user.name}</span></div>
            <Link href='/signup'>
                <Button variant="destructive" size="sm" onClick={handleSignout}>
                    Sign Out
                </Button>
            </Link>
        </div>
      </nav>

      <main className="pt-28 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#212121] p-5 rounded-2xl pb-30">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold mb-4">Your Rooms</h2>
                <h2 className="mr-2 opacity-20">Limit - 5</h2>
            </div>
          {joinedRooms.length === 0 ? (
            <div className="text-gray-400 italic">You haven't created any rooms yet.</div>
          ) : (
            <ul className="space-y-4">
              {joinedRooms.map((room) => (
                <li
                  key={room.id}
                  className="bg-[#404040] rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-white">Room {room.id} - {room.slug}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => router.push(`/canvas/${room.id}`)}
                    >
                        Join Room
                    </Button>
                    
                    <Button
                        size="lg"
                        onClick={() => copyLink(room.id, process.env.NEXT_PUBLIC_FRONTEND_ORIGIN!)}
                        isLoading={false}
                    >
                        Copy Link
                      <Share2 size={18} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
            {error && <div className="text-red-400">{error}</div>}
          <div>
            <h3 className="font-medium mb-2">Create a New Room</h3>
            <div className="flex gap-4 ">
              <Input
                type="text"
                label="Enter room slug"
                bgColor="#121212"
                value={createSlug}
                onChange={(e) => setCreateSlug(e.target.value)}
              />
              <div className="flex justify-center items-center"> 
                <Button
                    variant="secondary"
                    onClick={handleCreateRoom}
                    size="lg"
                >
                    Create Room
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Join an Existing Room</h3>
            <div className="flex gap-4 ">
              <Input
                type="text"
                label="Enter room slug"
                bgColor="#121212"
                value={joinSlug}
                onChange={(e) => setJoinSlug(e.target.value)}
              />
              <div className="flex justify-center items-center"> 
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleJoinRoom}
                >
                    Join Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}