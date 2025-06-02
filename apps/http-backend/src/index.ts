import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema } from "@repo/common/types"

const app = express();
app.use(express.json());

app.post("/signup", (req, res) => {
    const body = req.body;
    const data = CreateUserSchema.safeParse(body);

    if(!data.success){
        res.status(403).json({
            message: "Incorrect Data input"
        })
        return;
    }
    const username = data.data?.username;
    // Check for already user and if(user) return;

    // Enter in the database
    const token = jwt.sign({username: username}, JWT_SECRET);
    res.json({token});

})

app.post("/signin", (req, res) => {
    const body = req.body;

    const username = body.username;
    const password = body.password;

    // Check for user and if(!user) return;
    if(!JWT_SECRET){
        res.send("There is no secret key");
        return;
    } 
    const token = jwt.sign({username: username}, JWT_SECRET);
    res.send(token);

})

app.post("/create-room", middleware, (req, res) =>{
    // Add a middleware to get username from token
    // const username = from token
    const { roomId } = req.body;
    res.json({roomId : roomId});
})

app.listen(3001);