import axios from "axios";
import { useEffect, useRef, useState } from "react";

type UseSocketResult = {
  socket: WebSocket | null;
  loading: boolean;
  error: string | null;
};

export function useSocket(roomId : string): UseSocketResult {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let isMounted = true;

        const connectSocket = async() => {
            try {
                const tokenRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
                    withCredentials: true
                });
                const { token } = tokenRes.data;
                const ws = new WebSocket(
                    `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`
                );
                socketRef.current = ws;
                ws.onopen = () => {
                    if (isMounted) {
                        console.log("WebSocket connected");
                        ws.send(JSON.stringify({
                            type : "join_room",
                            roomId
                        }))
                        setLoading(false);
                    }
                };

                ws.onerror = (err) => {
                    console.error("WebSocket error", err);
                    if (isMounted) setError("WebSocket connection failed");
                };

                ws.onclose = () => {
                    console.warn("WebSocket closed");
                    if (isMounted) setLoading(false);
                };
            }catch(err){
                console.error("Error connecting to WebSocket:", err);
                if (isMounted) {
                    setError("Unable to connect to WebSocket");
                    setLoading(false);
                }
            }
        }
        connectSocket();
    
        return () => {
            isMounted = false;
            socketRef.current?.close();
        };;
    }, []);

  return {
    socket: socketRef.current,
    loading,
    error,
  };
}
