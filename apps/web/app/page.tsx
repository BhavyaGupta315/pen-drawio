"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [slug, setSlug] = useState("");
  const router = useRouter();
  return (
    <div>
        <div>
          <input type="text" placeholder="Room ID" onChange={(e)=>{
              setSlug(e.target.value);
          }}></input>
          <button onClick={()=>{
                router.push(`/room/${slug}`)
          }}>Join Room</button>
        </div>
    </div>
  );
}
