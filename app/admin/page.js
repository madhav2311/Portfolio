"use client";

import { useEffect, useRef, useState } from "react";

const EMPTY = {
  title: "",
  tagline: "",
  category: "Full-Stack",
  arch: "",
  features: "",
  stack: "",
  demo: "",
  github: "",
  cover: "",
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const toastTimer = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const loadProjects = () =>
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => showToast("Failed to load projects", "error"));

  useEffect(() => {
    if (authed) loadProjects();
  }, [authed]);

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pass }),
    });
    if (res.ok) {
      setAuthed(true);
      setPassErr(false);
      showToast("Welcome back, Madhavan. Admin mode enabled.");
    } else setPassErr(true);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toPayload = () => ({
    ...form,
    features: form.features
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    stack: form.stack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  });

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.tagline)
      return showToast("Title and tagline are required.", "error");
    setSaving(true);
    const editing = !!editingId;
    const res = await fetch(
      editing ? `/api/projects/${editingId}` : "/api/projects",
      {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pass}`,
        },
        body: JSON.stringify(toPayload()),
      },
    );
    setSaving(false);
    if (res.ok) {
      await loadProjects();
      resetForm();
      showToast(`Project "${form.title}" ${editing ? "updated" : "added"}!`);
    } else {
      showToast(editing ? "Update failed" : "Create failed", "error");
    }
  };

  const editProject = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      tagline: p.tagline,
      category: p.category || "",
      arch: p.arch || "",
      features: (p.features || []).join("\n"),
      stack: (p.stack || []).join(", "),
      demo: p.demo || "",
      github: p.github || "",
      cover: p.cover || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = async () => {
    const id = confirmId;
    setConfirmId(null);
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${pass}` },
    });
    if (res.ok) {
      await loadProjects();
      showToast("Project deleted.", "error");
    } else showToast("Delete failed", "error");
  };

  /* ---- Login screen ---- */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <form
          onSubmit={login}
          className="glass rounded-2xl p-8 w-[min(92vw,400px)] space-y-5"
        >
          <h1 className="text-xl font-bold grad-text font-mono">
            Admin Portal
          </h1>
          <p className="text-sm text-slate-400">
            Restricted area. Enter the admin passphrase.
          </p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Passphrase"
            className="w-full bg-panel border-slate-700 rounded-lg px-4 py-3 font-mono focus:outline-none focus:border-violet-neon focus:ring-1 focus:ring-violet-neon transition"
          />
          {passErr && (
            <p className="text-red-400 text-xs">Incorrect passphrase.</p>
          )}
          <button
            type="submit"
            className="glow-btn w-full bg-gradient-to-r from-cyan-neon to-violet-neon text-obsidian font-bold py-3 rounded-xl"
          >
            Authenticate
          </button>
          <a
            href="/"
            className="block text-center font-mono text-xs text-slate-500 hover:text-cyan-neon transition"
          >
            ← back to portfolio
          </a>
        </form>
        {toast && <Toast toast={toast} />}
      </div>
    );
  }

  /* ---- Dashboard ---- */
  return (
    <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold grad-text font-mono">
          Control Panel
        </h1>
        <div className="flex gap-4">
          <a
            href="/"
            className="font-mono text-xs text-slate-400 hover:text-cyan-neon transition"
          >
            view site
          </a>
          <button
            onClick={() => setAuthed(false)}
            className="font-mono text-xs text-slate-400 hover:text-red-400 transition"
          >
            logout
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={submit}
        className="glass rounded-xl p-6 space-y-4"
        data-editing={editingId || ""}
      >
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-neon">
          {editingId ? `Edit Project — ${form.title}` : "Add New Project"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Project Title *">
            <input
              value={form.title}
              onChange={set("title")}
              required
              className={inputCls}
              placeholder="NeuraChat"
            />
          </Field>
          <Field label="Category">
            <input
              value={form.category}
              onChange={set("category")}
              list="cats"
              className={inputCls}
              placeholder="Full-Stack"
            />
            <datalist id="cats">
              <option value="Full-Stack" />
              <option value="AI & Microservices" />
              <option value="Real-Time Web App" />
              <option value="DevOps" />
              <option value="Open Source" />
            </datalist>
          </Field>
        </div>
        <Field label="Subtitle / Tagline *">
          <input
            value={form.tagline}
            onChange={set("tagline")}
            required
            className={inputCls}
            placeholder="AI-powered chatbot platform"
          />
        </Field>
        <Field label="Detailed Description / Architecture">
          <textarea
            value={form.arch}
            onChange={set("arch")}
            rows={3}
            className={inputCls}
          />
        </Field>
        <Field label="Key Features (one per line)">
          <textarea
            value={form.features}
            onChange={set("features")}
            rows={3}
            className={inputCls}
          />
        </Field>
        <Field label="Tech Stack (comma separated)">
          <input
            value={form.stack}
            onChange={set("stack")}
            className={inputCls}
            placeholder="React, Node.js, MongoDB"
          />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Live Demo Link">
            <input
              type="url"
              value={form.demo}
              onChange={set("demo")}
              className={inputCls}
              placeholder="https://demo.example.com"
            />
          </Field>
          <Field label="GitHub Repository Link">
            <input
              type="url"
              value={form.github}
              onChange={set("github")}
              className={inputCls}
              placeholder="https://github.com/user/repo"
            />
          </Field>
        </div>
        <Field label="Cover Image URL (optional)">
          <input
            type="url"
            value={form.cover}
            onChange={set("cover")}
            className={inputCls}
          />
        </Field>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="glow-btn flex-1 bg-gradient-to-r from-cyan-neon to-violet-neon text-obsidian font-bold py-3 rounded-xl text-sm disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Update Project" : "Save Project"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="border border-slate-600 text-slate-300 font-semibold px-6 py-3 rounded-xl text-sm hover:border-slate-400 transition"
          >
            Clear
          </button>
        </div>
      </form>

      {/* List */}
      <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-violet-neon mt-10 mb-4">
        Manage Projects ({projects.length})
      </h2>
      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p._id}
            className="glass rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-neon/25 to-violet-neon/25 border-slate-700 shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{p.title}</p>
              <p className="text-xs text-slate-400 truncate">{p.tagline}</p>
            </div>
            <button
              onClick={() => editProject(p)}
              className="font-mono text-xs text-cyan-neon border-cyan-neon/30 hover:bg-cyan-neon/10 rounded-lg px-3 py-1.5 transition"
            >
              Edit
            </button>
            <button
              onClick={() => setConfirmId(p._id)}
              className="font-mono text-xs text-red-400 border-red-400/30 hover:bg-red-400/10 rounded-lg px-3 py-1.5 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Confirm delete */}
      {confirmId && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          onClick={() => setConfirmId(null)}
        >
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"></div>
          <div
            className="glass rounded-2xl p-8 w-[min(92vw,420px)] text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border-red-500/40 flex items-center justify-center text-red-400 text-2xl mb-4">
              !
            </div>
            <h3 className="text-xl font-bold">Delete Project?</h3>
            <p className="text-sm text-slate-400 mt-2">
              This project will be permanently removed from the database. This
              cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 border-slate-600 text-slate-300 font-semibold py-2.5 rounded-xl hover:border-slate-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteProject}
                className="flex-1 bg-red-500/90 text-white font-bold py-2.5 rounded-xl hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast toast={toast} />}
    </div>
  );
}

const inputCls =
  "w-full bg-panel border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toast({ toast }) {
  const cls =
    toast.type === "error"
      ? "border-red-400/40 text-red-400"
      : toast.type === "info"
        ? "border-cyan-neon/40 text-cyan-neon"
        : "border-green-neon/40 text-green-neon";
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
      <div
        className={`glass font-mono text-sm px-5 py-3 rounded-xl shadow-lg ${cls}`}
      >
        {toast.msg}
      </div>
    </div>
  );
}
