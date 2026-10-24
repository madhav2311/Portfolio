import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Project from "@/lib/Project";
import { SEED_PROJECTS } from "@/lib/seedData";
import { checkAuth, unauthorized } from "@/lib/auth";

// Bump this number whenever you edit lib/seedData.js — the DB will
// automatically re-sync on the next GET /api/projects call.
const SEED_VERSION = 3;

// GET /api/projects — public list
// Auto-seeds: on an empty DB, or when SEED_VERSION is newer than the
// one stored in the DB (stale seed docs are replaced; manually added
// projects are kept).
export async function GET() {
  try {
    await dbConnect();

    // Check the seed version in the dedicated metadata collection
    const meta = mongoose.connection.db.collection("meta");
    let stored = await meta.findOne({ key: "seedVersion" });
    if (!stored || stored.value !== SEED_VERSION) {
      // Replace all seed-sourced projects; keep manually added ones
      await Project.deleteMany({ isSeed: { $ne: false } });
      await Project.insertMany(
        SEED_PROJECTS.map((p) => ({ ...p, isSeed: true })),
      );
      await meta.updateOne(
        { key: "seedVersion" },
        { $set: { value: SEED_VERSION } },
        { upsert: true },
      );
    }

    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      projects.map((p) => {
        const { isSeed, ...rest } = p;
        return { ...rest, _id: p._id.toString() };
      }),
    );
  } catch (err) {
    console.error("GET /api/projects", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// POST /api/projects — admin: create project
export async function POST(req) {
  if (!checkAuth(req)) return unauthorized();
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.title || !body.tagline) {
      return NextResponse.json(
        { error: "Title and tagline are required" },
        { status: 400 },
      );
    }
    const project = await Project.create({
      title: body.title,
      tagline: body.tagline,
      category: body.category || "Full-Stack",
      description: body.description || "",
      arch: body.arch || "",
      features: body.features || [],
      stack: body.stack || [],
      demo: body.demo || "",
      github: body.github || "",
      cover: body.cover || "",
      order: body.order || 0,
      isSeed: false,
    });
    return NextResponse.json(
      { ...project.toObject(), _id: project._id.toString() },
      { status: 201 },
    );
  } catch (err) {
    console.error("POST /api/projects", err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
