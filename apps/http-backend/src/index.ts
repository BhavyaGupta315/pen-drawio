import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcryptjs";
import { CreateUserSchema, SigninSchema, RoomSchema } from "@repo/common/types"
import {prismaClient} from "@repo/db/client"
import { parse, serialize } from "cookie";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,              
}));

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
        
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {
            expiresIn: "7d"
        });
        res.setHeader("Set-Cookie", serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7*24*60*60
        }))

        res.status(201).json({ type : "success", token : token });
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
        res.status(201).json({
            type : "success",
            token : token
        });
    }catch(e){
        console.error("Error during signin:", e);
        res.status(500).json({
            type: "server_error",
            message: "Unexpected error during Signin. Please try again later.",
        });
    }
})

app.post("/signout", async (req, res) => {
    res.setHeader("Set-Cookie", serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    }));
    res.status(200).json({ type: "success" });
});


app.get("/token", (req, res) => {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    if(!token){
        res.status(403).json({ type: "unauthorized", message : "Cookies not Present" });
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
    try {
        jwt.verify(token, JWT_SECRET);
        res.json({
            type:"success",
            token:token
        })
    }catch(err){
        res.status(403).json({ type: "unauthorized", message : "Cookies are Invalid" });
    return;
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
        res.json({
            type : "success",
            roomId : roomId
        });
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
            take : 1000
        })
        res.json({type : "success", messages})
    }catch(e){
        console.log(e);
        res.status(401).json({
            type: "server_error",
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
            type : "success",
            room
        })
    }catch(e){
        console.log(e);
        res.json({
            type: "server_error",
            message : "Internal Server Error"
        })

    }
    
});

app.get("/room-exists/:id", async( req, res) => {
    const id = req.params.id;
    try{
        const room = await prismaClient.room.findUnique({
            where : {
                id : Number(id)
            }
        });
        if(!room){
            res.json({
                type:"unauthorized",
                message : "Room Doesn't Exists"
            })
            return;
        }
        res.json({
            type:"success",
            message:"Room Exists"
        })
    }catch(e){
        console.log(e);
        res.json({
            type: "server_error",
            message : "Internal Server Error"
        })
    }
})

app.listen(3001);