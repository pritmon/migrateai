"use client";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  BarChart3,
  Code2,
  CheckCircle,
  TrendingUp,
  GitBranch,
  Clock,
  Shield,
} from "lucide-react";

const stats = [
  { label: "Migrations Completed", value: "2,847", delta: "+12% this month" },
  { label: "Avg. Code Accuracy", value: "91.4%", delta: "+2.1% vs manual" },
  { label: "Faster than Manual", value: "50x", delta: "Assessment cycles" },
  { label: "Effort Reduced", value: "70%", delta: "Avg. redevelopment" },
];

const recentMigrations = [
  {
    id: "MIG-2041",
    name: "CRM Automation Suite",
    source: "UiPath",
    target: "Python + LangChain",
    status: "completed",
    score: 94,
    date: "2 hours ago",
  },
  {
    id: "MIG-2040",
    name: "Invoice Processing Bot",
    source: "Blue Prism",
    target: "Python",
    status: "completed",
    score: 88,
    date: "5 hours ago",
  },
  {
    id: "MIG-2039",
    name: "Legacy VBA Reports",
    source: "VBA",
    target: "Python + pandas",
    status: "in_progress",
    score: null,
    date: "1 hour ago",
  },
  {
    id: "MIG-2038",
    name: "ITSM Ticket Router",
    source: "Automation Anywhere",
    target: "Python",
    status: "completed",
    score: 96,
    date: "Yesterday",
  },
  {
    id: "MIG-2037",
    name: "HR Onboarding Flow",
    source: "Power Automate",
    target: "Python + LangChain",
    status: "completed",
    score: 82,
    date: "Yesterday",
  },
];

const features = [
  {
    icon: Zap,
    title: "Instant Assessment",
    desc: "Analyze your entire automation estate in minutes. Get complexity scores, migration readiness, and AI enhancement opportunities.",
  },
  {
    icon: Code2,
    title: "AI Code Conversion",
    desc: "Up to 91% accurate code migration powered by Claude. Handles complex edge cases with a hybrid human-AI approach.",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    desc: "Built for scale — from pilot projects to enterprise-wide programs. SOC 2 compliant with full audit trails.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Navbar */}
      <nav className="border-b" style={{ borderColor: "var(--border)", background: "rgba(10,10,15,0.9)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}>
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MigrateAI</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
            <span className="cursor-pointer hover:text-white transition-colors">Dashboard</span>
            <span className="cursor-pointer hover:text-white transition-colors">History</span>
            <span className="cursor-pointer hover:text-white transition-colors">Settings</span>
            <Link href="/migrate">
              <button
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 flex items-center gap-2"
                style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)" }}
              >
                <Zap className="w-4 h-4" />
                New Migration
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#a78bfa" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            AI Engine Active — claude-sonnet-4-6
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Modernize Your Automation</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>with AI-Powered Migration</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--text-muted)" }}>
            Migrate legacy RPA, ITSM, and automation scripts to modern platforms.
            Assessment in minutes, conversion in seconds.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-5">
              <div className="text-3xl font-bold mb-1 gradient-text">{s.value}</div>
              <div className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>{s.label}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Recent Migrations */}
          <div className="lg:col-span-2 glass rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                <h2 className="font-semibold">Recent Migrations</h2>
              </div>
              <span className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(99,102,241,0.1)", color: "#a78bfa" }}>
                {recentMigrations.length} jobs
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {recentMigrations.map((m) => (
                <div key={m.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{m.id}</span>
                      <span className="text-sm font-medium truncate">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="px-1.5 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "#a78bfa" }}>{m.source}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="px-1.5 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>{m.target}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {m.score !== null ? (
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: m.score >= 90 ? "#34d399" : m.score >= 80 ? "#fbbf24" : "#f87171" }}>
                          {m.score}%
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>accuracy</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs" style={{ color: "#fbbf24" }}>
                        <Clock className="w-3 h-3 animate-pulse" />
                        Running
                      </div>
                    )}
                    <div className={`w-2 h-2 rounded-full ${m.status === "completed" ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`} />
                  </div>
                  <div className="text-xs w-20 text-right" style={{ color: "var(--text-muted)" }}>{m.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-4">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)" }}>
                    <f.icon className="w-4 h-4" style={{ color: "#a78bfa" }} />
                  </div>
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass glow-border rounded-2xl p-8 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-3" style={{ color: "#a78bfa" }} />
          <h2 className="text-2xl font-bold mb-2 gradient-text">Ready to modernize your automation?</h2>
          <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
            Paste your legacy code and get an AI assessment + converted output in under 60 seconds.
          </p>
          <Link href="/migrate">
            <button
              className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto"
              style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)", boxShadow: "0 0 30px rgba(99,102,241,0.3)" }}
            >
              Start Migration
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
