"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════
   TEMPO — Plan Display
   Minute-by-minute daily timeline, color-coded by activity type
   Uses Hermes sub-agent for AI-powered plan generation
   ═══════════════════════════════════════════════════════════════════ */

type BlockType = "sport" | "study" | "meal" | "personal" | "sleep" | "recovery";

interface PlanBlock {
  startTime: string;
  endTime: string;
  label: string;
  type: BlockType;
  icon: string;
}

const BLOCK_STYLES: Record<BlockType, { color: string; bg: string; border: string; icon: string }> = {
  sport:    { color: "#39FF14", bg: "rgba(57,255,20,0.06)", border: "rgba(57,255,20,0.2)", icon: "🏃" },
  study:    { color: "#FFB800", bg: "rgba(255,184,0,0.06)",  border: "rgba(255,184,0,0.2)",  icon: "📚" },
  meal:     { color: "#2ECC71", bg: "rgba(46,204,113,0.06)", border: "rgba(46,204,113,0.2)", icon: "🍽️" },
  personal: { color: "#06B6D4", bg: "rgba(6,182,212,0.06)", border: "rgba(6,182,212,0.2)", icon: "🔵" },
  sleep:    { color: "#8B5CF6", bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.2)", icon: "😴" },
  recovery: { color: "#06B6D4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.25)", icon: "🧊" },
};

function getTimezoneGreeting(): { greeting: string; icon: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: "Good morning", icon: "☀️" };
  if (hour >= 12 && hour < 18) return { greeting: "Good afternoon", icon: "🌤️" };
  if (hour >= 18 && hour < 22) return { greeting: "Good evening", icon: "🌅" };
  return { greeting: "Good night", icon: "🌙" };
}

function generateLocalPlan(profile: Record<string, unknown>, checkIn: { input: string; training?: string[]; recovery?: string[] } | null): PlanBlock[] {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" }).slice(0, 3).toLowerCase();
  const isWeekend = dayName === "sat" || dayName === "sun";

  const sport = (profile.sport as string) || "Sport";
  const practice = (profile.practice as { days: string[]; time: string }[]) || [];
  const hardSubjects = (profile.hardSubjects as string[]) || ["Math", "Science"];
  const wakeTime = ((profile.wakeTime as string)?.replace("wd:", "").replace("we:", "")) || "06:00";
  const sleepTime = ((profile.sleepTime as string)?.replace("wd:", "").replace("we:", "")) || "22:00";

  const effectiveWake = isWeekend ? ((profile.wakeTime as string)?.replace("we:", "") || "08:00") : wakeTime;
  const effectiveSleep = isWeekend ? ((profile.sleepTime as string)?.replace("we:", "") || "22:00") : sleepTime;

  const dayMap: Record<string, string> = { mon: "mon", tue: "tue", wed: "wed", thu: "thu", fri: "fri", sat: "sat", sun: "sun" };
  const todayPractice = practice.find((p) => p.days.some((d) => d.toLowerCase() === dayMap[dayName]));

  const checkinInput = ((checkIn?.input || "") + " " + (checkIn?.training?.join(" ") || "") + " " + (checkIn?.recovery?.join(" ") || "")).toLowerCase();
  const isTired = checkinInput.includes("tired");
  const hasTest = checkinInput.includes("test") || checkinInput.includes("exam");
  const hasGame = checkinInput.includes("game");
  const notWell = checkinInput.includes("not feeling well") || checkinInput.includes("sick");
  const isTrainingDay = (checkIn?.training?.length ?? 0) > 0 || checkinInput.includes("lift") || checkinInput.includes("leg day") || checkinInput.includes("cardio");
  const needsRecovery = (checkIn?.recovery?.length ?? 0) > 0 || checkinInput.includes("sore") || checkinInput.includes("poor sleep") || checkinInput.includes("ice bath");

  const subjects = hardSubjects.length ? hardSubjects : ["Math", "Science"];

  const blocks: PlanBlock[] = [];

  // Wake up
  blocks.push({ startTime: effectiveWake, endTime: addMinutes(effectiveWake, 15), label: "Wake up & stretch", type: "personal", icon: "🔵" });

  // Morning routine
  const cursor1 = addMinutes(effectiveWake, 15);
  blocks.push({ startTime: effectiveWake, endTime: cursor1, label: "Morning routine", type: "personal", icon: "🔵" });

  // Breakfast
  const breakfastEnd = addMinutes(cursor1, 30);
  blocks.push({ startTime: cursor1, endTime: breakfastEnd, label: "Breakfast", type: "meal", icon: "🍽️" });

  // Morning study
  const studyDur = isTired ? 60 : 90;
  const studyEnd = addMinutes(breakfastEnd, studyDur);
  blocks.push({ startTime: breakfastEnd, endTime: studyEnd, label: `Study: ${subjects[0]}` + (hasTest ? " (test prep!)" : ""), type: "study", icon: "📚" });

  // Break
  const breakEnd = addMinutes(studyEnd, 15);
  blocks.push({ startTime: studyEnd, endTime: breakEnd, label: "Break" + (isTired ? " — rest your mind" : ""), type: "personal", icon: "🔵" });

  // Practice / sport
  if (todayPractice?.time) {
    const pStart = todayPractice.time;
    const pEnd = addMinutes(pStart, 120);
    blocks.push({ startTime: pStart, endTime: pEnd, label: `${sport} Practice`, type: "sport", icon: "🏃" });
  } else {
    const actEnd = addMinutes(breakEnd, 90);
    const label = hasGame ? `${sport} Game Day! 🏆` : `${sport} Training`;
    blocks.push({ startTime: breakEnd, endTime: actEnd, label, type: "sport", icon: "🏃" });
  }

  // Shower & lunch
  const lastBlock = blocks[blocks.length - 1];
  const showerStart = lastBlock.endTime;
  const showerEnd = addMinutes(showerStart, 30);
  const showerLabel = isTrainingDay ? "Shower & High-Protein Lunch" : "Shower & Lunch";
  blocks.push({ startTime: showerStart, endTime: showerEnd, label: showerLabel, type: "meal", icon: "🍽️" });

  // Recovery block (if training or sore)
  if (needsRecovery || isTrainingDay) {
    const recEnd = addMinutes(showerEnd, 20);
    const recLabel = needsRecovery ? "Foam Roll + Stretch" : "Post-Workout stretch";
    blocks.push({ startTime: showerEnd, endTime: recEnd, label: recLabel, type: "recovery", icon: "🧊" });
    // Second study starts after recovery
    if (subjects[1]) {
      const s2End = addMinutes(recEnd, 60);
      blocks.push({ startTime: recEnd, endTime: s2End, label: `Study: ${subjects[1]}`, type: "study", icon: "📚" });
    } else {
      const freeEnd = addMinutes(recEnd, 60);
      blocks.push({ startTime: recEnd, endTime: freeEnd, label: "Homework / Free time", type: "personal", icon: "🔵" });
    }
  } else {
    const s2End = addMinutes(showerEnd, 60);
    blocks.push({ startTime: showerEnd, endTime: s2End, label: `Study: ${subjects[1]}`, type: "study", icon: "📚" });
  }

  // Free time
  const lastEnd2 = blocks[blocks.length - 1].endTime;
  const freeEnd2 = addMinutes(lastEnd2, 60);
  blocks.push({ startTime: lastEnd2, endTime: freeEnd2, label: "Free time / Rest", type: "personal", icon: "🔵" });

  // Snack
  const snackEnd = addMinutes(freeEnd2, 15);
  blocks.push({ startTime: freeEnd2, endTime: snackEnd, label: "Snack", type: "meal", icon: "🍽️" });

  // Afternoon study
  const s3End = addMinutes(snackEnd, 60);
  const s3Label = hasTest ? `${subjects[0]} (test prep!)` : `${subjects[0]}`;
  blocks.push({ startTime: snackEnd, endTime: s3End, label: `Study: ${s3Label}`, type: "study", icon: "📚" });

  // Dinner
  const dinnerTime = "18:00";
  const lastAfternoon = blocks[blocks.length - 1].endTime;
  if (timeToMinutes(lastAfternoon) < timeToMinutes(dinnerTime)) {
    blocks.push({ startTime: lastAfternoon, endTime: dinnerTime, label: "Free time / Relax", type: "personal", icon: "🔵" });
  }
  blocks.push({ startTime: dinnerTime, endTime: addMinutes(dinnerTime, 45), label: "Dinner", type: "meal", icon: "🍽️" });

  // Evening
  const windDown = addMinutes(dinnerTime, 45);
  const windEnd = addMinutes(windDown, 60);
  blocks.push({ startTime: windDown, endTime: windEnd, label: "Family time / Relax", type: "personal", icon: "🔵" });

  // Evening study if time
  if (timeToMinutes(effectiveSleep) - timeToMinutes(windEnd) > 60) {
    const eveEnd = addMinutes(windEnd, 45);
    blocks.push({ startTime: windEnd, endTime: eveEnd, label: `Study: ${subjects[1] || subjects[0]}`, type: "study", icon: "📚" });
    windEnd && blocks.push({ startTime: eveEnd, endTime: effectiveSleep, label: "Sleep routine" + (isTired || notWell || needsRecovery ? " — extra rest!" : ""), type: "sleep", icon: "😴" });
  } else {
    blocks.push({ startTime: windEnd, endTime: effectiveSleep, label: "Sleep routine" + (isTired || notWell || needsRecovery ? " — extra rest!" : ""), type: "sleep", icon: "😴" });
  }

  // Lights out
  blocks.push({ startTime: effectiveSleep, endTime: addMinutes(effectiveSleep, 60), label: "Lights out", type: "sleep", icon: "😴" });

  return blocks;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function addMinutes(time: string, mins: number): string {
  const m = timeToMinutes(time) + mins;
  return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function PlanScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [plan, setPlan] = useState<PlanBlock[]>([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planSource, setPlanSource] = useState<"hermes" | "local" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("tempo_profile");
    if (!stored) {
      router.push("/");
      return;
    }
    const parsed = JSON.parse(stored);
    setProfile(parsed);

    // Check for today's plan from Hermes cron
    const today = new Date().toISOString().split("T")[0];
    const hermesPlanKey = `tempo_plan_${today}`;
    const hermesPlan = localStorage.getItem(hermesPlanKey);

    if (hermesPlan) {
      try {
        const parsedPlan = JSON.parse(hermesPlan);
        if (parsedPlan.plan && parsedPlan.plan.length > 0) {
          setPlan(parsedPlan.plan);
          setPlanSource("hermes");
          setTimeout(() => setFadeIn(true), 100);
          return;
        }
      } catch {
        // fall through to local generation
      }
    }

    // Generate local plan from profile + check-in
    const checkInData = parsed.lastCheckIn;
    setPlan(generateLocalPlan(parsed, checkInData));
    setPlanSource("local");
    setTimeout(() => setFadeIn(true), 100);
  }, [router]);

  const handleRegenerate = () => {
    if (!profile) return;
    setGenerating(true);
    setFadeIn(false);
    setTimeout(() => {
      const checkInData = profile.lastCheckIn as { input: string; training?: string[]; recovery?: string[] } | undefined;
      setPlan(generateLocalPlan(profile, checkInData ?? null));
      setPlanSource("local");
      setFadeIn(true);
      setGenerating(false);
    }, 600);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    );
  }

  const { greeting, icon } = getTimezoneGreeting();

  return (
    <div className="min-h-screen bg-void">
      {/* ═══════════════════════════════════════════════════════════
          HEADER — Greeting + Date
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative border-b border-white/[0.04]">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #39FF14 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-8">
          <div className={`max-w-3xl transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-bold text-muted tracking-wider uppercase">
                {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {greeting}, {profile.name as string}
            </h1>
            <p className="mt-2 text-sm text-muted">
              Here&apos;s your minute-by-minute plan. Let&apos;s make it count.
            </p>
            {planSource === "hermes" && (
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold bg-neon/10 text-neon border border-neon/20">
                ✨ Generated by Hermes AI
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          LEGEND
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex flex-wrap gap-4">
          {Object.entries(BLOCK_STYLES).map(([key, style]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: style.color }} />
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TIMELINE
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className={`transition-all duration-500 ${fadeIn ? "opacity-100" : "opacity-0"} ${generating ? "opacity-50 scale-[0.99]" : ""}`}>
          <div className="relative">
            <div className="absolute left-[72px] top-0 bottom-0 w-px bg-white/[0.06]" />

            {plan.map((block, i) => {
              const style = BLOCK_STYLES[block.type];
              return (
                <div key={i} className="relative flex items-stretch gap-4 group">
                  <div className="w-[72px] shrink-0 pt-3 text-right">
                    <span className="text-xs font-bold text-muted tabular-nums">
                      {formatTime(block.startTime)}
                    </span>
                  </div>

                  <div className="relative flex items-center shrink-0">
                    <div
                      className="w-3 h-3 rounded-full border-2 transition-all duration-200 group-hover:scale-125"
                      style={{
                        background: style.color,
                        borderColor: style.color,
                        boxShadow: `0 0 8px ${style.color}40`,
                      }}
                    />
                  </div>

                  <div
                    className="flex-1 mb-2 rounded-xl border transition-all duration-200 group-hover:translate-x-1"
                    style={{
                      background: style.bg,
                      borderColor: style.border,
                    }}
                  >
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-base">{style.icon}</span>
                        <span className="text-sm font-bold" style={{ color: style.color }}>
                          {block.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-muted tabular-nums">
                        {formatTime(block.startTime)} — {formatTime(block.endTime)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ACTIONS
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap gap-3 pt-6 border-t border-white/[0.04]">
          <button
            onClick={() => router.push("/check-in")}
            className="btn-primary px-6 py-3 rounded-full text-xs font-extrabold tracking-wide"
          >
            + New Check-In
          </button>
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="px-6 py-3 rounded-full text-xs font-extrabold tracking-wide border border-white/10 text-white hover:bg-white/[0.03] transition-all disabled:opacity-40"
          >
            {generating ? "Generating..." : "🔄 Regenerate"}
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-full text-xs font-extrabold tracking-wide text-muted hover:text-white transition-colors"
          >
            ← Home
          </button>
        </div>

        {/* Hermes integration info */}
        <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-xs text-muted leading-relaxed">
            <span className="text-neon font-bold">⚡ Hermes AI Mode:</span> A daily cron job generates optimized plans at 7:00 AM. Use &quot;Regenerate&quot; for instant refresh, or check in with new context to adapt your plan.
          </p>
        </div>
      </div>
    </div>
  );
}
