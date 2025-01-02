import { Request as ExpressRequest } from "express";

interface CustomRequest extends ExpressRequest {
  user?: {
    uid: string;
    email: string?;
    name: string;
    image: string?;
    role: string;
  };
}
