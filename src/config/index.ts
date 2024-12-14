import dotenv from "dotenv";
import { join } from "path";
import { InternalError } from "../models/api-error";

export enum EnvironmentType {
  DEVELOP = "develop",
  PRODUCTION = "production",
}

// set node env to develop by default
const env = dotenv.config({
  path: join(
    __dirname,
    "..",
    "environment",
    `.env.${process.env.NODE_ENV || EnvironmentType.DEVELOP}`
  ),
});

if (env.error) {
  throw new InternalError(
    "missing .env file. Create 'environment' directory inside 'src' and make a file titled '.env.develop' containing all configurations. See read mee for more details."
  );
}

export const DefaultConfig = {
  port: parseInt(process.env.PORT as string, 10),
  environment: process.env.NODE_ENV || EnvironmentType.DEVELOP,
};
