import { Request as ExpressRequest } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

interface CustomRequest extends ExpressRequest {
  user?: {
    uid: string;
    email: string | null;
    name?: string;
    image?: string | null;
    role?: string;
  };
  decodedToken?: DecodedIdToken;
}
