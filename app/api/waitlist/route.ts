import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const entry = { email, at: new Date().toISOString() };

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let list: { email: string; at: string }[] = [];
    try {
      const existing = await fs.readFile(DATA_FILE, "utf8");
      list = JSON.parse(existing);
    } catch {
      // file doesn't exist yet, start fresh
    }
    if (!list.some((e) => e.email === email)) {
      list.push(entry);
      await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
    }
  } catch (err) {
    // Fall back to logging if the filesystem is read-only (e.g. serverless)
    console.log("[waitlist] signup:", entry, "(persist failed)", err);
  }

  return NextResponse.json({ ok: true });
}
