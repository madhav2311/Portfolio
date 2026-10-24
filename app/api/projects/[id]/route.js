import { NextResponse } from "next/server";
import { readProjects, writeProjects } from "@/lib/projectsStore";
import { checkAuth, unauthorized } from "@/lib/auth";

// PUT /api/projects/:id — admin: update project
export async function PUT(req, { params }) {
  if (!checkAuth(req)) return unauthorized();
  try {
    const body = await req.json();
    const projects = await readProjects();
    const idx = projects.findIndex((p) => p._id === params.id);
    if (idx === -1)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    projects[idx] = {
      ...projects[idx],
      title: body.title ?? projects[idx].title,
      tagline: body.tagline ?? projects[idx].tagline,
      category: body.category ?? projects[idx].category,
      description: body.description ?? projects[idx].description,
      arch: body.arch ?? projects[idx].arch,
      features: body.features ?? projects[idx].features,
      stack: body.stack ?? projects[idx].stack,
      demo: body.demo ?? projects[idx].demo,
      github: body.github ?? projects[idx].github,
      cover: body.cover ?? projects[idx].cover,
      order: body.order ?? projects[idx].order,
      updatedAt: new Date().toISOString(),
    };
    await writeProjects(projects);
    return NextResponse.json(projects[idx]);
  } catch (err) {
    console.error("PUT /api/projects/[id]", err);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// DELETE /api/projects/:id — admin: delete project
export async function DELETE(req, { params }) {
  if (!checkAuth(req)) return unauthorized();
  try {
    const projects = await readProjects();
    const filtered = projects.filter((p) => p._id !== params.id);
    if (filtered.length === projects.length)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    await writeProjects(filtered);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/projects/[id]", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
