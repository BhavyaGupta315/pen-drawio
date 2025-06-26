import dotenv from "dotenv";

dotenv.config(); 

export const JWT_SECRET = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not defined. Please set it in your .env file.");
}
