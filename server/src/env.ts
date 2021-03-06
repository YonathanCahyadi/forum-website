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
checkEnvVariable("DATABASE_HOST");
checkEnvVariable("DATABASE_PORT");
checkEnvVariable("DATABASE_NAME");
checkEnvVariable("DATABASE_USER");
checkEnvVariable("DATABASE_PASSWORD");
checkEnvVariable("JWT_SECRET");
checkEnvVariable("PORT");

export const __db_host__ = process.env.DATABASE_HOST;
export const __db_port__ = process.env.DATABASE_PORT;
export const __port__ = parseInt(process.env.PORT as string);
export const __db_name__ = process.env.DATABASE_NAME;
export const __db_user__ = process.env.DATABASE_USER;
export const __db_password__ = process.env.DATABASE_PASSWORD;
export const __jwt_secret__ = process.env.JWT_SECRET as JWT.Secret;
