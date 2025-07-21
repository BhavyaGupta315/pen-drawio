import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({port: 8080});

interface User {
    userId : string,
    rooms : Number[],
    ws : WebSocket
}

const users : User[] = [];

function checkUser(token : string) : string | null{
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(typeof(decoded) === "string"){
            return null;
        }
        if(!decoded || !decoded.userId){
            return null;
        }
        return decoded.userId;
    }catch(e){
        console.log(e);
        return null;
    }
    
}

wss.on("connection", (ws, request) => {
    const url = request.url;    

    if(!url){
        console.log("No URL FOUND")
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token');

    if(!token){
        console.log("No Token Found");
        ws.send("No Token");
        return;
    }

    if(!JWT_SECRET){
        console.log("Backend Error, No JWT_SECRET in env file")
        ws.send("Backend Error, No JWT_SECRET in env file");
        return;
    }
    
    const userId = checkUser(token);
        if(!userId){
            console.log("No userId FOUND")
            ws.close();
            return;
        }
        users.push({
            userId,
            rooms : [],
            ws
    })
    ws.on('message', async (data) => {
        const stringData = data.toString();
        const parsedData = JSON.parse(stringData);
        
        if(parsedData.type === "join_room"){
            const user = users.find(x => x.ws === ws);
            if(!user){
                console.log("No User found");
                return;
            }
            user.rooms.push(parsedData.roomId);
            console.log("Room Added");
        }
        if(parsedData.type === "leave_room"){
            const user = users.find(x => x.ws === ws);
            if(!user){
                console.log("User not found");
                return;
            }
            user.rooms = user.rooms.filter(x => x === parsedData.data.roomId);
            console.log("User left the room");
        }

        if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;
            const parsedMessage = JSON.parse(message);
            const shape = parsedMessage.shape;
            const dbMsg = await prismaClient.chat.create({
                data : {
                    roomId : roomId,
                    message : JSON.stringify(shape),
                    userId
                }
            })
            
            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    if(user.userId === userId) return;
                    // console.log("Sending message to ", user.userId, "with WS ", user.ws);
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId,
                        id : dbMsg.id
                    }))
                }
            })
        }
    })
    
})

// State management, statless systems like redux, recoil etc.   