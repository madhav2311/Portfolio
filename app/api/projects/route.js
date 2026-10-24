import { NextResponse } from "next/server";
import { readProjects, writeProjects, nextId } from "@/lib/projectsStore";
import { checkAuth, unauthorized } from "@/lib/auth";

// GET /api/projects — public list (file-backed, no database)
export async function GET() {
  try {
    const projects = await readProjects();
    return NextResponse.json(projects);
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
    const body = await req.json();
    if (!body.title || !body.tagline) {
      return NextResponse.json(
        { error: "Title and tagline are required" },
        { status: 400 },
      );
    }
    const projects = await readProjects();
    const project = {
      _id: String(await nextId()),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(project);
    await writeProjects(projects);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects", err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
