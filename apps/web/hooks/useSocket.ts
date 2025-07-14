import { useEffect, useState } from "react";

export function useSocket(){
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        // Use JWT Token here
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiY2NiOGRkZC1mZTA5LTRjMjYtYmE3Mi1jNGI0NzdhYTFjYmEiLCJpYXQiOjE3NTE4OTE1NjZ9.TrHOFKIHgIgakYHQSNpiT-OcdGVYfSC20a2TxFdaKH4`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    },[]);

    return {
        socket, 
        loading
    }
}