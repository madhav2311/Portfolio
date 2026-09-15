import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Project from "@/lib/Project";
import { checkAuth, unauthorized } from "@/lib/auth";

// PUT /api/projects/:id — admin: update project
export async function PUT(req, { params }) {
  if (!checkAuth(req)) return unauthorized();
  try {
    await dbConnect();
    const body = await req.json();
    const project = await Project.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        tagline: body.tagline,
        category: body.category,
        description: body.description,
        arch: body.arch,
        features: body.features,
        stack: body.stack,
        demo: body.demo,
        github: body.github,
        cover: body.cover,
        order: body.order,
      },
      { new: true, runValidators: true },
    );
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({
      ...project.toObject(),
      _id: project._id.toString(),
    });
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
    await dbConnect();
    const project = await Project.findByIdAndDelete(params.id);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/projects/[id]", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
