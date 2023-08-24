import "dotenv/config";
import process from "node:process";
import { object, safeParse, string } from "valibot";

const EnvironmentVariables = object({
  COOKIE: string(),
  COLLECTION_PATH: string(),
});

const result = safeParse(EnvironmentVariables, process.env);
if (result.success) console.log("✅ Environment variables verified");
else
  throw new Error(
    `❌ Environment variables not verified: ${result.issues.join(", ")}`
  );

const env = result.output;
export default env;
