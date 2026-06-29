"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════
   TEMPO — Plan Display
   Minute-by-minute daily timeline, color-coded by activity type
   ═══════════════════════════════════════════════════════════════════ */

type BlockType = "sport" | "study" | "meal" | "personal" | "sleep";

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
};

function getTimezoneGreeting(): { greeting: string; icon: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: "Good morning", icon: "☀️" };
  if (hour >= 12 && hour < 18) return { greeting: "Good afternoon", icon: "🌤️" };
  if (hour >= 18 && hour < 22) return { greeting: "Good evening", icon: "🌅" };
  return { greeting: "Good night", icon: "🌙" };
}

function generateDemoPlan(
  profile: {
    sport: string;
    practice: { days: string[]; time: string }[];
    hardSubjects: string[];
    wakeTime: string;
    sleepTime: string;
    grade: string;
  },
  checkIn?: { input: string } | null
): PlanBlock[] {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" }).slice(0, 3).toLowerCase();
  const isWeekend = dayName === "sat" || dayName === "sun";

  // Find today's practice
  const dayMap: Record<string, string> = { mon: "mon", tue: "tue", wed: "wed", thu: "thu", fri: "fri", sat: "sat", sun: "sun" };
  const todayPractice = profile.practice?.find((p) => p.days.some((d) => d.toLowerCase() === dayName));

  const wakeTime = profile.wakeTime?.replace("wd:", "").replace("we:", "") || "06:00";
  const sleepTime = profile.sleepTime?.replace("wd:", "").replace("we:", "") || "22:00";
  const useWeekendTime = isWeekend;
  const effectiveWake = useWeekendTime
    ? profile.sleepTime?.replace("we:", "") || wakeTime
    : wakeTime;
  const effectiveSleep = useWeekendTime
    ? profile.sleepTime?.replace("we:", "") || sleepTime
    : sleepTime;

  const subjects = profile.hardSubjects?.length ? profile.hardSubjects : ["Math", "Science"];
  const sportName = profile.sport || "Sport";

  const blocks: PlanBlock[] = [];

  // Wake up
  blocks.push({ startTime: effectiveWake, endTime: addMinutes(effectiveWake, 15), label: "Wake up & stretch", type: "personal", icon: "🔵" });

  // Morning routine
  let cursor = addMinutes(effectiveWake, 15);
  blocks.push({ startTime: effectiveWake, endTime: cursor, label: "Morning routine", type: "personal", icon: "🔵" });

  // Breakfast
  cursor = addMinutes(cursor, 30);
  blocks.push({ startTime: addMinutes(effectiveWake, 15), endTime: cursor, label: "Breakfast", type: "meal", icon: "🍽️" });

  // Morning study block (hardest subject first)
  const studyEnd = addMinutes(cursor, 90);
  blocks.push({ startTime: cursor, endTime: studyEnd, label: `Study: ${subjects[0]}`, type: "study", icon: "📚" });
  cursor = studyEnd;

  // Break
  const breakEnd = addMinutes(cursor, 15);
  blocks.push({ startTime: cursor, endTime: breakEnd, label: "Break", type: "personal", icon: "🔵" });
  cursor = breakEnd;

  // Practice or sport block
  if (todayPractice?.time) {
    const pTime = todayPractice.time;
    const pStart = pTime || addMinutes(cursor, 60);
    const pEnd = addMinutes(pStart, 120);
    blocks.push({ startTime: pStart, endTime: pEnd, label: `${sportName} Practice`, type: "sport", icon: "🏃" });
    cursor = pEnd;
  } else {
    // Default morning activity
    const actEnd = addMinutes(cursor, 90);
    blocks.push({ startTime: cursor, endTime: actEnd, label: `${sportName} Training`, type: "sport", icon: "🏃" });
    cursor = actEnd;
  }

  // Shower & lunch
  const showerEnd = addMinutes(cursor, 30);
  blocks.push({ startTime: cursor, endTime: showerEnd, label: "Shower & Lunch", type: "meal", icon: "🍽️" });
  cursor = showerEnd;

  // Second study block
  if (subjects[1]) {
    const study2End = addMinutes(cursor, 60);
    blocks.push({ startTime: cursor, endTime: study2End, label: `Study: ${subjects[1]}`, type: "study", icon: "📚" });
    cursor = study2End;
  }

  // Free time / homework
  const freeEnd = addMinutes(cursor, 60);
  blocks.push({ startTime: cursor, endTime: freeEnd, label: "Homework / Free time", type: "personal", icon: "🔵" });
  cursor = freeEnd;

  // Snack
  blocks.push({ startTime: cursor, endTime: addMinutes(cursor, 15), label: "Snack", type: "meal", icon: "🍽️" });
  cursor = addMinutes(cursor, 15);

  // Afternoon practice or study
  if (todayPractice?.time && todayPractice.days.length > 0) {
    const p2End = addMinutes(cursor, 90);
    blocks.push({ startTime: cursor, endTime: p2End, label: `${sportName} Practice`, type: "sport", icon: "🏃" });
    cursor = p2End;
  } else {
    const study3End = addMinutes(cursor, 60);
    blocks.push({ startTime: cursor, endTime: study3End, label: `Study: ${subjects[0]}`, type: "study", icon: "📚" });
    cursor = study3End;
  }

  // Dinner
  const dinnerTime = "18:00";
  blocks.push({ startTime: cursor, endTime: dinnerTime, label: "Free time", type: "personal", icon: "🔵" });
  blocks.push({ startTime: dinnerTime, endTime: addMinutes(dinnerTime, 45), label: "Dinner", type: "meal", icon: "🍽️" });

  // Evening wind down
  const windDown = addMinutes(dinnerTime, 45);
  blocks.push({ startTime: windDown, endTime: addMinutes(windDown, 60), label: "Relax / Family time", type: "personal", icon: "🔵" });

  // Study if not too late
  const studyTime = addMinutes(windDown, 60);
  if (timeToMinutes(effectiveSleep) - timeToMinutes(studyTime) > 60) {
    blocks.push({ startTime: studyTime, endTime: addMinutes(studyTime, 45), label: `Study: ${subjects[1] || subjects[0]}`, type: "study", icon: "📚" });
  }

  // Sleep routine
  const routineStart = addMinutes(windDown, 120);
  blocks.push({ startTime: routineStart, endTime: effectiveSleep, label: "Sleep routine", type: "sleep", icon: "😴" });
  blocks.push({ startTime: effectiveSleep, endTime: addMinutes(effectiveSleep, 60), label: "Lights out", type: "sleep", icon: "😴" });

  return blocks;
}

function addMinutes(time: string, mins: number): string {
  const m = timeToMinutes(time) + mins;
  return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function PlanScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    sport: string;
    practice: { days: string[]; time: string }[];
    hardSubjects: string[];
    wakeTime: string;
    sleepTime: string;
    grade: string;
    name: string;
    email: string;
    lastCheckIn?: { input: string; date: string; timezone: string };
  } | null>(null);
  const [plan, setPlan] = useState<PlanBlock[]>([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tempo_profile");
    if (!stored) {
      router.push("/");
      return;
    }
    const parsed = JSON.parse(stored);
    setProfile(parsed);

    // Generate plan from profile + last check-in if available
    const lastCheckIn = parsed.lastCheckIn;
    setPlan(generateDemoPlan(parsed, lastCheckIn));

    setTimeout(() => setFadeIn(true), 100);
  }, [router]);

  const handleRegenerate = () => {
    if (!profile) return;
    setGenerating(true);
    setFadeIn(false);
    setTimeout(() => {
      setPlan(generateDemoPlan(profile, profile.lastCheckIn));
      setFadeIn(true);
      setGenerating(false);
    }, 800);
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
          <div className={`transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-bold text-muted tracking-wider uppercase">
                {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {greeting}, {profile.name}
            </h1>
            <p className="mt-2 text-sm text-muted">
              Here&apos;s your minute-by-minute plan. Let&apos;s make it count.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          LEGEND — Activity type color key
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex flex-wrap gap-4">
          {Object.entries(BLOCK_STYLES).map(([key, style]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: style.color }} />
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {key}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TIMELINE — Minute-by-minute plan
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className={`transition-all duration-500 ${fadeIn ? "opacity-100" : "opacity-0"} ${generating ? "opacity-50 scale-[0.99]" : ""}`}>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[72px] top-0 bottom-0 w-px bg-white/[0.06]" />

            {/* Blocks */}
            {plan.map((block, i) => {
              const style = BLOCK_STYLES[block.type];
              return (
                <div
                  key={i}
                  className="relative flex items-stretch gap-4 group"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {/* Time column */}
                  <div className="w-[72px] shrink-0 pt-3 text-right">
                    <span className="text-xs font-bold text-muted tabular-nums">
                      {formatTime(block.startTime)}
                    </span>
                  </div>

                  {/* Dot on timeline */}
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

                  {/* Block card */}
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
                        <span
                          className="text-sm font-bold"
                          style={{ color: style.color }}
                        >
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
          ACTIONS — Check-in again, edit, regenerate
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

        {/* AI note */}
        <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-xs text-muted leading-relaxed">
            <span className="text-neon font-bold">⚡ Demo mode:</span> This plan is generated from your profile data. Connect your OpenAI API key to enable AI-powered adaptive planning based on your daily check-in.
          </p>
        </div>
      </div>
    </div>
  );
}
