import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Project from "@/lib/Project";
import { SEED_PROJECTS } from "@/lib/seedData";
import { checkAuth, unauthorized } from "@/lib/auth";

// GET /api/projects — public list (auto-seeds the DB on first run)
export async function GET() {
  try {
    await dbConnect();
    let projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    if (projects.length === 0) {
      await Project.insertMany(SEED_PROJECTS);
      projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    }
    return NextResponse.json(
      projects.map((p) => ({ ...p, _id: p._id.toString() })),
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
