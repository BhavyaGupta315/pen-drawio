import { z } from "zod";

export const CreateUserSchema = z.object({
    email : z.string().min(3, "Should be minimum length 3").max(20, "Should be maximum length 20"),
    password : z.string().min(8, "Should be of minimum length 8"),
    name : z.string()
})

export const SigninSchema = z.object({
    email : z.string().min(3, "Should be minimum length 3").max(20, "Should be maximum length 20"),
    password : z.string().min(8, "Should be of minimum length 8"),
})

export const RoomSchema = z.object({
    name : z.string().min(3, "Should be minimum of 3").max(20, "Should be maximum 20 length")
})