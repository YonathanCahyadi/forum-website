import * as dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

export const __prod__ = process.env.NODE_ENV === "production";

const checkEnvVariable = (envName: string) => {
  if (process.env[envName] === undefined) {
    throw new Error(`Need to specify ${envName} in env variable.`);
  }
};

// check if the reqiured Env variable is set
checkEnvVariable("DATABASE_NAME");
checkEnvVariable("JWT_SECRET");

export const __db_name__ = process.env.DATABASE_NAME;
export const __jwt_secret__ = process.env.JWT_SECRET as JWT.Secret;
