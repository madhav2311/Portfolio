import { NextResponse } from "next/server";

export function checkAuth(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const pass = process.env.ADMIN_PASS || "madhavan-admin";
  return token === pass;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
