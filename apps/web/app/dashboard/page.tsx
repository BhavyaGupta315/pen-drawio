"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
    const [createSlug, setCreateSlug] = useState("");
    const [joinSlug, setJoinSlug] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleCreateRoom = async () => {
        setError("");
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
                if (!data.roomId) {
                    setError(data.message || "Room creation failed.");
                    return;
                }
                router.push(`/canvas/${data.roomId}`);
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

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room/${joinSlug}`);
            const data = response.data;

            if(data.type === "success"){
                if (!data.room){
                    setError("Room not found.");
                    return;
                }
                const roomId = data.room.id;
                router.push(`/canvas/${roomId}`);
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


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">
                    Collaborative Drawboard Dashboard
                </h1>

                <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                        Create a Room
                    </label>
                    <input
                        type="text"
                        placeholder="Enter room slug"
                        value={createSlug}
                        onChange={(e) => setCreateSlug(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleCreateRoom}
                        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
                    >
                        Create Room
                    </button>
                </div>

                <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                        Join a Room
                    </label>
                    <input
                        type="text"
                        placeholder="Enter room slug"
                        value={joinSlug}
                        onChange={(e) => setJoinSlug(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleJoinRoom}
                        className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
                    >
                        Join Room
                    </button>
                </div>

                {error && (
                    <p className="text-center text-red-600 font-medium text-sm">{error}</p>
                )}
            </div>
        </div>
    );
}
