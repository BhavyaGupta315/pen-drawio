import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { JWT_SECRET } from "@repo/backend-common/config";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface JwtPayload {
  userId: string;
}

export function middleware(req: Request, res: Response, next: NextFunction){
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.token;
  
  if(!token){
      res.status(403).json({ type: "unauthorized", message : "Cookies not Present" });
      return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId;
    next();
  }catch(err){
    console.log(err);
    res.status(403).json({ type: "unauthorized", message : "Cookies are Invalid" });
    return;
  }
}
