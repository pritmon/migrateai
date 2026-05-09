"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
  Download,
  RotateCcw,
  GitBranch,
  ChevronRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const SOURCE_PLATFORMS = ["UiPath", "Blue Prism", "Automation Anywhere", "Power Automate", "VBA", "Legacy Python", "Bash/Shell", "SQL Procedures"];
const TARGET_PLATFORMS = ["Python", "Python + LangChain", "Python + pandas", "Node.js", "Automation Anywhere v11", "Power Automate"];

const SAMPLE_CODES: Record<string, string> = {
  UiPath: `<?xml version="1.0" encoding="utf-8"?>
<Activity DisplayName="Process Invoices" sap2010:WorkflowViewState.IdRef="Activity_1">
  <Sequence DisplayName="Main Sequence">
    <GetDataTable DisplayName="Read Excel File"
      FilePath="C:\\invoices\\data.xlsx"
      SheetName="Sheet1"
      DataTable="{x:Reference __ReferenceID0}" />
    <ForEachRow DisplayName="For Each Row" DataTable="{x:Reference __ReferenceID0}">
      <Body>
        <ActivityAction>
          <Sequence>
            <Assign DisplayName="Get Invoice Number">
              <To>[invoiceNum]</To>
              <Value>[CurrentRow("InvoiceID").ToString()]</Value>
            </Assign>
            <TypeInto DisplayName="Enter Invoice" Selector="&lt;wnd app='erp.exe' /&gt;" Text="[invoiceNum]" />
            <Click DisplayName="Submit Button" Selector="&lt;html /&gt;&lt;webctrl id='submit-btn' /&gt;" />
            <LogMessage DisplayName="Log Success" Level="Info" Message="&quot;Processed: &quot; + invoiceNum" />
          </Sequence>
        </ActivityAction>
      </Body>
    </ForEachRow>
  </Sequence>
</Activity>`,
  VBA: `Sub ProcessMonthlyReport()
    Dim wb As Workbook
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim total As Double
    Dim i As Integer

    Set wb = ThisWorkbook
    Set ws = wb.Sheets("Sales Data")
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row

    total = 0
    For i = 2 To lastRow
        If ws.Cells(i, 3).Value > 0 Then
            total = total + ws.Cells(i, 3).Value
            ws.Cells(i, 4).Value = ws.Cells(i, 3).Value * 0.1
        End If
    Next i

    ws.Cells(lastRow + 2, 3).Value = total
    ws.Cells(lastRow + 2, 4).Value = total * 0.1

    MsgBox "Report complete. Total: $" & Format(total, "#,##0.00")
End Sub`,
  "Legacy Python": `import smtplib
import MySQLdb
import time

DB_HOST = "localhost"
DB_USER = "root"
DB_PASS = "password123"
DB_NAME = "crm_db"

def get_overdue_customers():
    db = MySQLdb.connect(DB_HOST, DB_USER, DB_PASS, DB_NAME)
    cursor = db.cursor()
    cursor.execute("SELECT id, name, email, balance FROM customers WHERE due_date < NOW() AND paid = 0")
    rows = cursor.fetchall()
    db.close()
    return rows

def send_email(to_email, name, balance):
    server = smtplib.SMTP("smtp.company.com", 25)
    msg = "From: billing@company.com\nTo: " + to_email + "\nSubject: Payment Due\n\nDear " + name + ",\nYour balance of $" + str(balance) + " is overdue."
    server.sendmail("billing@company.com", to_email, msg)
    server.quit()

def main():
    customers = get_overdue_customers()
    for row in customers:
        send_email(row[2], row[1], row[3])
        time.sleep(1)
    print "Done: " + str(len(customers)) + " emails sent"

main()`,
};

type Severity = "critical" | "high" | "medium" | "low";

interface Issue {
  severity: Severity;
  title: string;
  description: string;
}

interface Assessment {
  complexityScore: number;
  migrationReadiness: string;
  linesOfCode: number;
  estimatedEffort: string;
  codeAccuracyEstimate: number;
  issues: Issue[];
  aiOpportunities: string[];
  summary: string;
  platformInsights: string;
}

interface ConversionResult {
  convertedCode: string;
  language: string;
  changes: string[];
  warnings: string[];
}

const STEPS = ["Configure", "Assess", "Convert", "Complete"];

const severityConfig: Record<Severity, { color: string; bg: string; icon: typeof AlertCircle }> = {
  critical: { color: "#f87171", bg: "rgba(248,113,113,0.1)", icon: AlertCircle },
  high: { color: "#fb923c", bg: "rgba(251,146,60,0.1)", icon: AlertTriangle },
  medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", icon: AlertTriangle },
  low: { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", icon: Info },
};

export default function MigratePage() {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [source, setSource] = useState("UiPath");
  const [target, setTarget] = useState("Python");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [conversion, setConversion] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadSample = () => {
    setCode(SAMPLE_CODES[source] || SAMPLE_CODES["Legacy Python"]);
  };

  const runAssessment = async () => {
    if (!code.trim()) { setError("Please paste some code first"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, sourcePlatform: source, targetPlatform: target }),
      });
      if (!res.ok) throw new Error("Assessment failed");
      const data = await res.json();
      setAssessment(data);
      setStep(1);
    } catch {
      setError("Assessment failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const runConversion = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, sourcePlatform: source, targetPlatform: target, assessment }),
      });
      if (!res.ok) throw new Error("Conversion failed");
      const data = await res.json();
      setConversion(data);
      setStep(2);
    } catch {
      setError("Conversion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (conversion) {
      navigator.clipboard.writeText(conversion.convertedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setStep(0);
    setCode("");
    setAssessment(null);
    setConversion(null);
    setError("");
  };

  const scoreColor = (score: number) =>
    score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Navbar */}
      <nav className="border-b" style={{ borderColor: "var(--border)", background: "rgba(10,10,15,0.9)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 text-sm hover:text-white transition-colors" style={{ color: "var(--text-muted)" }}>
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <span style={{ color: "var(--border)" }}>/</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}>
                <GitBranch className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold">New Migration</span>
            </div>
          </div>
          <button onClick={reset} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: "var(--text-muted)" }}>
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: i < step ? "linear-gradient(135deg, #34d399, #10b981)" : i === step ? "linear-gradient(135deg, #6366f1, #4338ca)" : "var(--bg-card)",
                    border: i > step ? "1px solid var(--border)" : "none",
                    color: i <= step ? "white" : "var(--text-muted)",
                  }}
                >
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-sm font-medium" style={{ color: i === step ? "var(--text-primary)" : i < step ? "#34d399" : "var(--text-muted)" }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-3" style={{ color: "var(--text-muted)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Configure */}
        {step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Platform selectors */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: "#a78bfa" }} />
                  Migration Configuration
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-muted)" }}>SOURCE PLATFORM</label>
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1"
                      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                    >
                      {SOURCE_PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-muted)" }}>TARGET PLATFORM</label>
                    <select
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                    >
                      {TARGET_PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Code input */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>legacy_code.{source === "VBA" ? "vba" : source === "UiPath" ? "xaml" : "py"}</span>
                  </div>
                  <button
                    onClick={loadSample}
                    className="text-xs px-3 py-1 rounded-md transition-colors hover:bg-white/10"
                    style={{ color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}
                  >
                    Load Sample Code
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`Paste your ${source} automation code here...`}
                  rows={20}
                  className="w-full p-5 text-sm code-block outline-none resize-none scrollbar-thin"
                  style={{ background: "var(--bg-secondary)", color: "#e2e8f0", caretColor: "#6366f1" }}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={runAssessment}
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)", boxShadow: "0 0 30px rgba(99,102,241,0.2)" }}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Run AI Assessment</>
                )}
              </button>
            </div>

            {/* Tips sidebar */}
            <div className="space-y-4">
              <div className="glass rounded-xl p-5">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" style={{ color: "#38bdf8" }} />
                  What to expect
                </h4>
                <ul className="space-y-3">
                  {[
                    { step: "01", text: "AI analyzes your code for complexity, anti-patterns, and migration readiness" },
                    { step: "02", text: "Get a detailed report with issues, effort estimates, and AI enhancement ideas" },
                    { step: "03", text: "One-click conversion to your target platform with 91%+ accuracy" },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="font-mono font-bold shrink-0" style={{ color: "#a78bfa" }}>{item.step}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-xl p-5">
                <h4 className="font-semibold text-sm mb-3">Supported Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {SOURCE_PLATFORMS.map((p) => (
                    <span key={p} className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(99,102,241,0.1)", color: "#a78bfa", border: "1px solid rgba(99,102,241,0.2)" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Assessment */}
        {step === 1 && assessment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Assessment Report</h2>
              <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                <CheckCircle className="w-4 h-4" />
                Analysis Complete
              </div>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Complexity Score", value: `${assessment.complexityScore}/10`, color: assessment.complexityScore > 7 ? "#f87171" : assessment.complexityScore > 4 ? "#fbbf24" : "#34d399" },
                { label: "Migration Readiness", value: assessment.migrationReadiness, color: assessment.migrationReadiness === "High" ? "#34d399" : assessment.migrationReadiness === "Medium" ? "#fbbf24" : "#f87171" },
                { label: "Estimated Accuracy", value: `${assessment.codeAccuracyEstimate}%`, color: scoreColor(assessment.codeAccuracyEstimate) },
                { label: "Estimated Effort", value: assessment.estimatedEffort, color: "var(--text-primary)" },
              ].map((card) => (
                <div key={card.label} className="glass rounded-xl p-5 text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: card.color }}>{card.value}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{card.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issues */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: "#fbbf24" }} />
                    Issues Found ({assessment.issues.length})
                  </h3>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {assessment.issues.length === 0 ? (
                    <div className="px-5 py-4 text-sm" style={{ color: "var(--text-muted)" }}>No critical issues found.</div>
                  ) : (
                    assessment.issues.map((issue, i) => {
                      const cfg = severityConfig[issue.severity] || severityConfig.low;
                      const Icon = cfg.icon;
                      return (
                        <div key={i} className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: cfg.color }} />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{issue.title}</span>
                                <span className="text-xs px-1.5 py-0.5 rounded capitalize" style={{ background: cfg.bg, color: cfg.color }}>{issue.severity}</span>
                              </div>
                              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{issue.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* AI Opportunities + Summary */}
              <div className="space-y-4">
                <div className="glass rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: "#a78bfa" }} />
                      AI Enhancement Opportunities
                    </h3>
                  </div>
                  <div className="p-5 space-y-2">
                    {assessment.aiOpportunities.map((opp, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#34d399" }} />
                        <span style={{ color: "var(--text-muted)" }}>{opp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text-muted)" }}>SUMMARY</h3>
                  <p className="text-sm leading-relaxed mb-3">{assessment.summary}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{assessment.platformInsights}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="px-5 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/5" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back
              </button>
              <button
                onClick={runConversion}
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)", boxShadow: "0 0 30px rgba(99,102,241,0.2)" }}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Converting Code...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Convert to {target}<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Conversion */}
        {step === 2 && conversion && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Migration Complete</h2>
              <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                <CheckCircle className="w-4 h-4" />
                {source} → {target}
              </div>
            </div>

            {/* Changes + warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: "#34d399" }} />
                  Changes Applied
                </h3>
                <ul className="space-y-2">
                  {conversion.changes.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="text-green-400 font-bold">+</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              {conversion.warnings.length > 0 && (
                <div className="glass rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: "#fbbf24" }} />
                    Manual Review Required
                  </h3>
                  <ul className="space-y-2">
                    {conversion.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span style={{ color: "#fbbf24" }}>!</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Side by side code */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b flex items-center gap-3" style={{ borderColor: "var(--border)", background: "rgba(248,113,113,0.05)" }}>
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>original — {source}</span>
                </div>
                <pre className="p-5 text-xs code-block overflow-auto scrollbar-thin max-h-96" style={{ color: "#94a3b8" }}>
                  {code}
                </pre>
              </div>
              <div className="glass rounded-xl overflow-hidden glow-border">
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.05)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs font-mono" style={{ color: "#a78bfa" }}>converted — {target}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={copyCode} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors hover:bg-white/10" style={{ color: copied ? "#34d399" : "var(--text-muted)" }}>
                      {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                <pre className="p-5 text-xs code-block overflow-auto scrollbar-thin max-h-96" style={{ color: "#e2e8f0" }}>
                  {conversion.convertedCode}
                </pre>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/5" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back to Assessment
              </button>
              <button
                onClick={copyCode}
                className="px-5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }}
              >
                <Download className="w-4 h-4" />
                Export Code
              </button>
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #6366f1, #4338ca)" }}
              >
                <Zap className="w-4 h-4" />
                New Migration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
