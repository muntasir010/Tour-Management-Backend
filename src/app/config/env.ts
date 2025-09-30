/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
}

const loadEnvVariables = (): EnvConfig => {

    const requiredEnvVariable:string[]=["PORT", "DB_URL", "NODE_ENV"]

    requiredEnvVariable.forEach(key => {
         if(!process.env[key]){
        throw new Error(`Missing require environment variable ${key}`)
    }
    });
   
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};


export const enVars = loadEnvVariables();