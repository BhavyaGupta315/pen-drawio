import { z } from "zod";

export const CreateUserSchema = z.object({
    email : z.string({
        required_error: "Email is required",
        invalid_type_error: "Email is invalid"
    })
    .email("Invalid Email Format"),
    password : z.string({
        required_error : "Password is Required",
        invalid_type_error : "Password is invalid"
    })
    .min(8, "Password Should be of minimum length 8"),
    name : z.string({
        required_error : "Name is Required",
        invalid_type_error : "Name is invalid"
    })
    .min(3, "Name should be of minimum length 3")
})

export const SigninSchema = z.object({
    email : z.string({
        required_error: "Email is required",
        invalid_type_error: "Email is invalid"
    })
    .email("Invalid Email Format"),
    password : z.string({
        required_error : "Password is Required",
        invalid_type_error : "Password is invalid"
    })
    .min(8, "Password Should be of minimum length 8"),
})

export const RoomSchema = z.object({
    name : z.string({
        required_error: "Name is required",
        invalid_type_error: "Name is invalid"
    })
    .min(3, "Should be minimum of 3").max(20, "Should be maximum 20 length")
})