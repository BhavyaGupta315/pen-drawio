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
    try{
        const body = req.body;

        const parsedData = CreateUserSchema.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({
                type: "validation_error",
                message: "Invalid input data",
                errors: parsedData.error.format(),
            })
            return;
        }
        
        if(!JWT_SECRET){
            console.error("JWT Secret is not present");
            res.status(500).json({
                type: "server_error",
                message: "Internal server configuration error",
            });
            return;
        }

        const {email, password, name} = parsedData.data;
        const userExists = await prismaClient.user.findUnique({
            where : {
                email : email
            }
        })
        if(userExists){
            res.status(409).json({
                type: "conflict_error",
                message: "User already exists with this email",
            })
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prismaClient.user.create({
            data : {
                email,
                password : hashedPassword,
                name
            }
        })
        
        const token = jwt.sign({userId: user.id}, JWT_SECRET);
        res.status(201).json({token});
    }catch(e){
        console.error("Error during signup:", e);
        res.status(500).json({
            type: "server_error",
            message: "Unexpected error during signup. Please try again later.",
        });
    }
    

})

app.post("/signin", async (req, res) => {
    try{
        const body = req.body;

        const parsedData = SigninSchema.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({
                type: "validation_error",
                message: "Invalid input data",
                errors: parsedData.error.format(),
            })
            return;
        }

        if(!JWT_SECRET){
            console.error("JWT Secret is not present");
            res.status(500).json({
                type: "server_error",
                message: "Internal server configuration error",
            });
            return;
        }

        const {email, password} = parsedData.data;
        const userExists = await prismaClient.user.findUnique({
            where : {
                email : email,
            }
        });

        if (!userExists || !(await bcrypt.compare(password, userExists.password))) {
            res.status(401).json({
                type: "unauthorized",
                message: "Invalid email or password",
            });
            return;
        };

        const token = jwt.sign({userId: userExists.id}, JWT_SECRET);
        res.status(201).json({token});
    }catch(e){
        console.error("Error during signin:", e);
        res.status(500).json({
            type: "server_error",
            message: "Unexpected error during Signin. Please try again later.",
        });
    }
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
    try{
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
    }catch(e){
        console.log(e);
        res.status(401).json({
            message : "Internal Server Error"
        })

    }
    
});


app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    try{
        const room = await prismaClient.room.findFirst({
        where:{
            slug
        }
    });

        res.json({
            room
        })
    }catch(e){
        console.log(e);
        res.json({
            message : "Internal Server Error"
        })

    }
    
})

app.listen(3001);