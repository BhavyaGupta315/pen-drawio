import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcryptjs";
import { CreateUserSchema, SigninSchema, RoomSchema } from "@repo/common/types"
import {prismaClient} from "@repo/db/client"

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const body = req.body;
    const parsedData = CreateUserSchema.safeParse(body);

    if(!parsedData.success){
        res.status(403).json({
            message: "Incorrect Data input"
        })
        return;
    }
    const {email, password, name} = parsedData.data;
    if(!JWT_SECRET){
        console.log("JWT Secret is not present");
    }
    const userExists = await prismaClient.user.findUnique({
        where : {
            email : email
        }
    })
    if(userExists != null){
        res.status(403).json({
            message : "User already Exists"
        })
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prismaClient.user.create({
            data : {
                email,
                password : hashedPassword,
                name
            }
        })
        
        const token = jwt.sign({userId: user.id}, JWT_SECRET);
        res.json({token});
    }catch(e){
        console.log("Error while signing up - ",e);
        res.status(411).json({
            message: "Username not available."
        })
    }
    

})

app.post("/signin", async (req, res) => {
    const body = req.body;
    const data = SigninSchema.safeParse(body);
    if(!data.success){
        res.status(403).json({
            message: "Invalid Data types"
        })
        return;
    }
    const email = data.data.email;
    const password = data.data.password;

    const userExists = await prismaClient.user.findUnique({
        where : {
            email : email,
        }
    })
    if(!userExists){
        res.status(401).json({
            message : "Invalid Emails"
        });
        return;
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch){
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }
    if(!JWT_SECRET){
        res.send("There is no secret key");
        return;
    } 
    const token = jwt.sign({userId: userExists.id}, JWT_SECRET);
    res.json({token});

})

app.post("/create-room", middleware, async (req, res) =>{
    const parsedData = RoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(403).json({
            message : "Invalid Data",
            error: parsedData.error
        })
        return;
    }
    const userId = req.userId;
    if(!userId){
        console.log("User ID is not, Authorization not done");
        return;
    }
    try{
        const room = await prismaClient.room.create({
            data : {
                slug : parsedData.data.name,
                adminId : userId
            }
        })
        const roomId  = room.id;
        res.json({roomId : roomId});
    }catch(e){
        console.log("Error while creating Room - ", e);
        res.status(401).json({
            message : "Room is already there with the same name"
        })
    }
    
})

app.get("/chat/:roomId", async (req, res) =>{
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where:{
            roomId : roomId
        },
        orderBy:{
            id : "desc"
        },
        take : 50   
    })
    res.json({messages})
})

app.listen(3001);