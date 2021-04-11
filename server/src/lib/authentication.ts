import JWT from "jsonwebtoken";
import { __jwt_secret__ } from "../env";

const payloadName = "userId";
const algorithm = "HS256";

export const createToken = (userId: string): string => {
  return JWT.sign({ [payloadName]: userId }, __jwt_secret__, {
    algorithm,
    expiresIn: "30d",
  });
};

type verifiedPayload = {
  [payloadName]: string;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = JWT.verify(token, __jwt_secret__, { algorithms: [algorithm] }) as verifiedPayload;

    return decoded[payloadName];
  } catch (err) {
    return null;
  }
};
