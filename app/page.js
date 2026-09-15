"use client";

import { useEffect, useRef, useState } from "react";

const SKILLS = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  Backend: ["Node.js", "Python","REST APIs"],
  Databases: ["PostgreSQL", "MongoDB", "Mysql"],
  "Tools": [ "Git", "AWS", "CI/CD"],
};

const PHRASES = [
  "React & Next.js",
  "Node.js & Go backends",
  "AI-powered tools",
  "cloud-native systems",
  "beautiful UIs",
];

const stackColor = (s) =>
  ({
    React: "text-cyan-neon border-cyan-neon/40",
    "Next.js": "text-cyan-neon border-cyan-neon/40",
    TypeScript: "text-cyan-neon border-cyan-neon/40",
    Docker: "text-cyan-neon border-cyan-neon/40",
    "Node.js": "text-green-neon border-green-neon/40",
    Go: "text-green-neon border-green-neon/40",
    MongoDB: "text-green-neon border-green-neon/40",
    PostgreSQL: "text-green-neon border-green-neon/40",
    OpenAI: "text-violet-neon border-violet-neon/40",
    Redis: "text-red-400 border-red-400/40",
  })[s] || "text-slate-300 border-slate-600";

const grads = [
  "from-cyan-neon/30 to-violet-neon/30",
  "from-violet-neon/30 to-green-neon/30",
  "from-green-neon/30 to-cyan-neon/30",
];

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [typed, setTyped] = useState("");
  const [modalProject, setModalProject] = useState(null);
  const [toast, setToast] = useState(null);
  const gridRef = useRef(null);
  const toastTimer = useRef(null);

  // Fetch projects from the API
  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]));
  }, []);

  // Typing effect
  useEffect(() => {
    let pi = 0,
      ci = 0,
      deleting = false,
      timer;
    const tick = () => {
      const cur = PHRASES[pi];
      setTyped(cur.slice(0, ci));
      if (!deleting && ci < cur.length) {
        ci++;
        timer = setTimeout(tick, 70);
      } else if (!deleting) {
        deleting = true;
        timer = setTimeout(tick, 1600);
      } else if (ci > 0) {
        ci--;
        timer = setTimeout(tick, 35);
      } else {
        deleting = false;
        pi = (pi + 1) % PHRASES.length;
        timer = setTimeout(tick, 300);
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  // Particles
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        color: ["#00f3ff", "#7000ff", "#4ADE80"][i % 3],
        duration: 10 + Math.random() * 20,
        delay: -Math.random() * 20,
      })),
    );
  }, []);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  // Card tilt + shine
  const onCardMove = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-8px) scale(1.015)`;
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
  };
  const onCardLeave = (e) => {
    e.currentTarget.style.transform = "";
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@madhavan.dev");
      showToast("Email copied to clipboard!");
    } catch {
      showToast("Copy failed — hello@madhavan.dev", "error");
    }
  };

  return (
    <div>
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: "110vh",
              background: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Sticky Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-mono font-bold text-lg select-none">
            <span className="text-cyan-neon">&lt;</span>madhavan
            <span className="text-violet-neon">.dev</span>
            <span className="text-cyan-neon"> /&gt;</span>
          </a>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#projects" className="hover:text-cyan-neon transition">
              Projects
            </a>
            <a href="#skills" className="hover:text-cyan-neon transition">
              Skills
            </a>
            <a href="#contact" className="hover:text-cyan-neon transition">
              Contact
            </a>
          </div>
          <a
            href="#contact"
            className="hidden md:inline-flex glow-btn font-mono text-sm font-semibold bg-cyan-neon/10 text-cyan-neon border-cyan-neon/40 rounded-lg px-4 py-2"
          >
            Hire Me
          </a>
          <a
            href="#contact"
            className="md:hidden text-cyan-neon font-mono text-sm"
          >
            Hire Me
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative grid-bg min-h-screen flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm mb-8 fade-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-neon"></span>
            </span>
            Available for new projects
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight fade-up">
            Hi, I&apos;m <span className="grad-text">Madhavan</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-slate-300 mt-4 fade-up">
            Full-Stack Developer &amp; Software Engineer
          </h2>
          <p className="font-mono text-lg md:text-xl mt-6 text-slate-400 fade-up">
            <span className="text-green-neon">$</span> I build with
            <span className="text-cyan-neon"> {typed}</span>
            <span className="cursor-blink text-cyan-neon">|</span>
          </p>
          <div className="flex flex-wrap gap-4 mt-10 fade-up">
            <a
              href="#projects"
              className="glow-btn inline-flex items-center gap-2 bg-gradient-to-r from-cyan-neon to-violet-neon text-obsidian font-bold px-7 py-3.5 rounded-xl"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border-slate-500 text-slate-200 font-semibold px-7 py-3.5 rounded-xl hover:border-cyan-neon hover:text-cyan-neon transition"
            >
              Contact Me
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-14 fade-up">
            {[
              ["GitHub", "https://github.com/madhav2311"],
              ["LinkedIn", "https://www.linkedin.com/in/madhavans666/"],
              
            ].map(([label, href]) => (
              <a
                key={label}
                aria-label={label}
                href={href}
                target="_blank"
                rel="noopener"
                className="social-icon font-mono text-xs text-slate-400 border-slate-700 rounded-full px-3 py-1.5"
              >
                {label}
              </a>
            ))}
            <a
              aria-label="Email"
              href="mailto:bettafish505@gmail.com"
              className="social-icon font-mono text-xs text-slate-400 border-slate-700 rounded-full px-3 py-1.5"
            >
              Email
            </a>
          </div>
        </div>
      </header>

      {/* Projects */}
      <section id="projects" className="relative py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold fade-up">
            Featured <span className="grad-text">Projects</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl fade-up">
            A selection of things I&apos;ve shipped — from AI tools to
            full-stack platforms.
          </p>
          <div
            ref={gridRef}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-14"
          >
            {projects.map((p, i) => (
              <article
                key={p._id}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                className="card glass rounded-2xl overflow-hidden fade-up visible flex-col relative"
              >
                <div className="card-shine"></div>
                <div
                  className={`h-36 border-b border-slate-700 flex items-center justify-center ${p.cover ? "" : `bg-gradient-to-br ${grads[i % 3]}`}`}
                  style={
                    p.cover
                      ? {
                          backgroundImage: `url('${p.cover}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {}
                  }
                >
                  <div className="bg-obsidian/70 border-slate-600 rounded-lg px-4 py-2 font-mono text-xs text-slate-300">
                    <span className="text-red-400">●</span>{" "}
                    <span className="text-yellow-400">●</span>{" "}
                    <span className="text-green-neon">●</span>&nbsp;{" "}
                    {p.title.toLowerCase().replace(/\s/g, "")}.app
                  </div>
                </div>
                <div className="p-6 flex-col flex-1 gap-3">
                  <div className="flex gap-2 flex-wrap">
                    {p.category && (
                      <span className="badge-pop text-[11px] font-mono uppercase tracking-wide bg-violet-neon/10 text-violet-neon border-violet-neon/30 rounded-full px-2.5 py-0.5">
                        {p.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="text-sm text-slate-400 flex-1">{p.tagline}</p>
                  <div className="flex gap-2 flex-wrap">
                    {(p.stack || []).map((s) => (
                      <span
                        key={s}
                        className={`pill text-[11px] font-mono border rounded-full px-2.5 py-0.5 ${stackColor(s)}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-2 pt-4 border-t border-slate-800">
                    <a
                      href={p.demo || "#"}
                      target="_blank"
                      rel="noopener"
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-neon hover:underline ${p.demo ? "" : "opacity-40 pointer-events-none"}`}
                    >
                      Live Demo
                    </a>
                    <a
                      href={p.github || "#"}
                      target="_blank"
                      rel="noopener"
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white ${p.github ? "" : "opacity-40 pointer-events-none"}`}
                    >
                      GitHub
                    </a>
                    <button
                      onClick={() => setModalProject(p)}
                      className="ml-auto text-sm font-mono text-slate-400 hover:text-cyan-neon transition"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="relative py-28 grid-bg">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold fade-up">
            Skills &amp; <span className="grad-text">Tools Matrix</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-14">
            {Object.entries(SKILLS).map(([cat, items], i) => (
              <div key={cat} className="card glass rounded-2xl p-6 fade-up">
                <h3
                  className={`font-mono text-sm font-bold uppercase tracking-wider mb-4 ${["text-cyan-neon", "text-violet-neon", "text-green-neon", "text-cyan-neon"][i]}`}
                >
                  {cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <span
                      key={s}
                      className="pill text-xs font-mono border-slate-700 bg-obsidian/60 rounded-lg px-3 py-1.5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-28">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center fade-up">
            Let&apos;s <span className="grad-text">Connect</span>
          </h2>
          <p className="text-slate-400 text-center mt-4 fade-up">
            Have a project in mind? Drop me a message.
          </p>
          <div className="glass rounded-2xl p-8 mt-12 fade-up">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Message sent — I'll get back to you soon!");
                e.target.reset();
              }}
            >
              <input
                name="name"
                required
                placeholder="Name"
                className="w-full bg-panel border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-neon transition"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full bg-panel border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-neon transition"
              />
              <textarea
                name="message"
                rows="4"
                required
                placeholder="Tell me about your project..."
                className="w-full bg-panel border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-neon transition"
              />
              <button
                type="submit"
                className="glow-btn w-full bg-gradient-to-r from-cyan-neon to-violet-neon text-obsidian font-bold py-3.5 rounded-xl"
              >
                Send Message
              </button>
            </form>
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-800">
              <span className="font-mono text-sm text-slate-400 flex-1 truncate">
                hello@madhavan.dev
              </span>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-2 border-slate-600 hover:border-cyan-neon hover:text-cyan-neon text-slate-300 font-mono text-sm px-4 py-2 rounded-lg transition"
              >
                Copy Email
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 py-8 text-center text-sm text-slate-500 font-mono">
        © 2025 Madhavan — Built with <span className="text-cyan-neon">♥</span>{" "}
        and lots of coffee
      </footer>

      {/* Project details modal */}
      {modalProject && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          onClick={() => setModalProject(null)}
        >
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"></div>
          <div
            className="glass rounded-2xl p-8 w-[min(92vw,640px)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold grad-text">
                {modalProject.title}
              </h3>
              <button
                onClick={() => setModalProject(null)}
                className="text-slate-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="rounded-xl h-44 my-6 bg-gradient-to-br from-cyan-neon/20 via-violet-neon/20 to-green-neon/20 border-slate-700 flex items-center justify-center">
              <div className="bg-obsidian/70 border-slate-600 rounded-lg px-4 py-2 font-mono text-xs text-slate-300">
                {modalProject.title.toLowerCase().replace(/\s/g, "")}.app
              </div>
            </div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-2">
              Key Features
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-300">
              {(modalProject.features || []).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mt-6 mb-2">
              Architecture
            </h4>
            <p className="text-sm text-slate-300">{modalProject.arch || "—"}</p>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
          <div
            className={`glass font-mono text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
              toast.type === "error"
                ? "border-red-400/40 text-red-400"
                : toast.type === "info"
                  ? "border-cyan-neon/40 text-cyan-neon"
                  : "border-green-neon/40 text-green-neon"
            }`}
          >
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
