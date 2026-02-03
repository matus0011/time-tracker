import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/time-tracker";

const client = new MongoClient(MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
});
