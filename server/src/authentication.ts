import JWT from "jsonwebtoken";
import { __jwt_secret__ } from "./env";

const payloadName = "userId";

export const createToken = (userId: string): string => {
  return JWT.sign({ [payloadName]: userId }, __jwt_secret__, {
    algorithm: "HS256",
    expiresIn: "30d",
  });
};

type verifiedPayload = {
  [payloadName]: string;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = JWT.verify(token, __jwt_secret__) as verifiedPayload;
    return decoded[payloadName];
  } catch (err) {
    return null;
  }
};
