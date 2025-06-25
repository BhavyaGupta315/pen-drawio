import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
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
    // Check for already user and if(user) return;
    try {
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

        const user = await prismaClient.user.create({
            data : {
                email,
                password,
                name
            }
        })
        // Enter in the database
        const token = jwt.sign({userId: user.id}, JWT_SECRET);
        res.json({token});
    }catch(e){
        console.log(e);
        res.status(411).json({
            message: "Internal Server Error from the database."
        })
    }
    

})

app.post("/signin", (req, res) => {
    const body = req.body;
    const data = SigninSchema.safeParse(body);
    if(!data.success){
        res.status(403).json({
            message: "Invalid Data types"
        })
        return;
    }
    const email = data.data.email;

    // Check for user and if(!user) return;
    if(!JWT_SECRET){
        res.send("There is no secret key");
        return;
    } 
    const token = jwt.sign({email: email}, JWT_SECRET);
    res.send(token);

})

app.post("/create-room", middleware, (req, res) =>{
    const data = RoomSchema.safeParse(req.userId);
    if(!data.success){
        res.status(403).json({
            message : "Invalid Data"
        })
        return;
    }
    const roomId  = data.data.name;
    res.json({roomId : roomId});
})

app.listen(3001);