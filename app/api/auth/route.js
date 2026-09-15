import { NextResponse } from "next/server";

// POST /api/auth — verify admin passphrase, returns a bearer token for API calls
export async function POST(req) {
  const { pass } = await req.json();
  const ADMIN_PASS = process.env.ADMIN_PASS || "madhavan-admin";
  if (pass === ADMIN_PASS) {
    return NextResponse.json({ token: ADMIN_PASS });
  }
  return NextResponse.json({ error: "Invalid passphrase" }, { status: 401 });
}
