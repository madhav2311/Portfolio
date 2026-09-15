import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/madhavan-portfolio";

let cached = globalThis._mongooseCache;
if (!cached) cached = globalThis._mongooseCache = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "madhavan-portfolio",
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
