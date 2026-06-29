"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════
   TEMPO — Daily Check-In Screen
   Greets user by name, captures today's context, generates plan
   ═══════════════════════════════════════════════════════════════════ */

const QUICK_CHIPS = [
  { label: "📝 Test today", value: "I have a test today" },
  { label: "😴 Tired", value: "I'm feeling tired" },
  { label: "🏃 Practice", value: "I have practice" },
  { label: "📚 Homework due", value: "I have homework due" },
  { label: "🎮 Game today", value: "I have a game today" },
  { label: "🤒 Not feeling well", value: "I'm not feeling well" },
  { label: "⏰ Early morning", value: "I have to wake up early" },
  { label: "🎉 Feeling great", value: "I'm feeling great" },
];

function getTimezoneGreeting(): { greeting: string; icon: string } {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) return { greeting: "Good morning", icon: "☀️" };
  if (hour >= 12 && hour < 18) return { greeting: "Good afternoon", icon: "🌤️" };
  if (hour >= 18 && hour < 22) return { greeting: "Good evening", icon: "🌅" };
  return { greeting: "Good night", icon: "🌙" };
}

export default function CheckInScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; email: string; timezone: string } | null>(null);
  const [text, setText] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tempo_profile");
    if (!stored) {
      router.push("/");
      return;
    }
    const parsed = JSON.parse(stored);
    setProfile(parsed);
    setTimeout(() => setFadeIn(true), 100);
  }, [router]);

  const toggleChip = (value: string) => {
    setSelectedChips((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (!text.trim() && selectedChips.length === 0) return;

    const allInputs = [
      ...(text.trim() ? [text.trim()] : []),
      ...selectedChips,
    ].join(". ");

    // Save today's check-in and navigate to plan
    const today = new Date().toISOString().split("T")[0];
    const checkInData = {
      date: today,
      input: allInputs,
      timezone: profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    localStorage.setItem(`tempo_checkin_${today}`, JSON.stringify(checkInData));

    router.push("/plan");
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
    <div className="min-h-screen bg-void flex">
      {/* ═══════════════════════════════════════════════════════════
          LEFT — Check-In Form
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center px-12 md:px-20 lg:px-28">
        {/* Logo */}
        <div className="absolute top-8 left-12 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-emerald flex items-center justify-center text-sm font-black text-void">
            T
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">TEMPO</span>
        </div>

        <div className={`max-w-xl transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {/* Greeting */}
          <div className="mb-2">
            <span className="text-3xl mr-2">{icon}</span>
            <span className="text-sm font-bold text-muted tracking-wider uppercase">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight">
            {greeting}, {profile.name}
          </h1>
          <p className="mt-4 text-base text-muted leading-relaxed">
            Tell Coach Vega about today. We&apos;ll build your minute-by-minute plan.
          </p>

          {/* Text area */}
          <div className="mt-10">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., I've got a math test 3rd period, feeling a bit tired, and practice at 4pm..."
              rows={4}
              className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white font-medium placeholder:text-muted/60 focus:outline-none focus:border-neon/50 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Quick-add chips */}
          <div className="mt-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-3">
              Quick add
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => toggleChip(chip.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                    selectedChips.includes(chip.value)
                      ? "bg-neon/15 border border-neon text-neon"
                      : "bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.06] hover:border-white/20"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="mt-10">
            <button
              onClick={handleSubmit}
              disabled={!text.trim() && selectedChips.length === 0}
              className={`btn-primary px-10 py-4 rounded-full text-sm font-extrabold tracking-wide transition-all ${
                !text.trim() && selectedChips.length === 0
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
            >
              GENERATE TODAY&apos;S PLAN →
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT — Coach Vega
          ═══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #39FF14 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #FFB800 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20 animate-pulse"
              style={{ background: "radial-gradient(circle, #39FF14 0%, #06B6D4 40%, transparent 70%)", filter: "blur(40px)" }}
            />
            <div
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, #FFB800 0%, #39FF14 50%, transparent 70%)", filter: "blur(20px)" }}
            />

            {/* Coach Vega SVG (reused from onboarding) */}
            <svg width="300" height="420" viewBox="0 0 300 420" fill="none" className="relative z-10 float" style={{ filter: "drop-shadow(0 0 30px rgba(57,255,20,0.2)) drop-shadow(0 0 60px rgba(6,182,212,0.15))" }}>
              <ellipse cx="150" cy="210" rx="120" ry="180" fill="none" stroke="url(#auraGradient)" strokeWidth="1" opacity="0.3" />
              <ellipse cx="150" cy="210" rx="100" ry="155" fill="none" stroke="#39FF14" strokeWidth="0.5" opacity="0.15" />
              <defs>
                <radialGradient id="voidGradient" cx="0.5" cy="0.4" r="0.6">
                  <stop offset="0%" stopColor="#0a0a0c" />
                  <stop offset="40%" stopColor="#050508" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>
                <radialGradient id="coreGlow" cx="0.5" cy="0.3" r="0.5">
                  <stop offset="0%" stopColor="#39FF14" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#39FF14" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="auraGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39FF14" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
                </linearGradient>
                <radialGradient id="galaxy1" cx="0.3" cy="0.4" r="0.3">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="galaxy2" cx="0.7" cy="0.5" r="0.25">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="galaxy3" cx="0.5" cy="0.3" r="0.2">
                  <stop offset="0%" stopColor="#FFB800" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFB800" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path d="M110 165 Q150 150 190 165 L200 280 Q150 310 100 280 Z" fill="url(#voidGradient)" />
              <ellipse cx="130" cy="200" rx="25" ry="35" fill="url(#galaxy1)" />
              <ellipse cx="170" cy="220" rx="20" ry="30" fill="url(#galaxy2)" />
              <ellipse cx="150" cy="180" rx="15" ry="20" fill="url(#galaxy3)" />
              <circle cx="125" cy="185" r="1.5" fill="#FFFFFF" opacity="0.8" />
              <circle cx="140" cy="210" r="1" fill="#FFFFFF" opacity="0.6" />
              <circle cx="165" cy="195" r="1.5" fill="#FFFFFF" opacity="0.7" />
              <circle cx="175" cy="230" r="1" fill="#FFFFFF" opacity="0.5" />
              <circle cx="145" cy="240" r="1.2" fill="#FFFFFF" opacity="0.6" />
              <circle cx="155" cy="175" r="0.8" fill="#FFFFFF" opacity="0.9" />
              <circle cx="130" cy="225" r="1" fill="#06B6D4" opacity="0.5" />
              <circle cx="170" cy="205" r="0.8" fill="#8B5CF6" opacity="0.5" />
              <path d="M120 190 Q115 200 110 215" stroke="#39FF14" strokeWidth="0.5" fill="none" opacity="0.3" />
              <path d="M180 200 Q185 215 190 230" stroke="#06B6D4" strokeWidth="0.5" fill="none" opacity="0.2" />
              <path d="M140 250 Q145 260 150 270" stroke="#FFB800" strokeWidth="0.5" fill="none" opacity="0.2" />
              <path d="M110 165 L95 155 L90 170 L105 175 Z" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.8" opacity="0.9" />
              <path d="M190 165 L205 155 L210 170 L195 175 Z" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.8" opacity="0.9" />
              <path d="M135 175 L150 165 L165 175 L160 190 L150 185 L140 190 Z" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.5" opacity="0.7" />
              <circle cx="150" cy="180" r="8" fill="url(#coreGlow)" />
              <path d="M95 170 Q60 150 35 120" stroke="#0a0a0c" strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M85 160 Q60 145 45 125" stroke="#39FF14" strokeWidth="1" fill="none" opacity="0.2" />
              <circle cx="35" cy="120" r="10" fill="#0a0a0c" stroke="#39FF14" strokeWidth="1" />
              <circle cx="35" cy="120" r="4" fill="#39FF14" opacity="0.3" />
              <path d="M28 115 L25 108" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M32 113 L30 105" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M37 112 L36 104" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M41 114 L42 107" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M205 170 Q240 150 270 125" stroke="#0a0a0c" strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M215 160 Q245 145 265 128" stroke="#06B6D4" strokeWidth="1" fill="none" opacity="0.2" />
              <circle cx="270" cy="125" r="10" fill="#0a0a0c" stroke="#39FF14" strokeWidth="1" />
              <circle cx="270" cy="125" r="4" fill="#39FF14" opacity="0.3" />
              <path d="M277 120 L280 113" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M273 118 L275 110" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M268 117 L268 109" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M263 119 L261 112" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="150" cy="115" rx="32" ry="38" fill="url(#voidGradient)" />
              <ellipse cx="145" cy="110" rx="15" ry="18" fill="url(#galaxy3)" />
              <circle cx="148" cy="115" r="1.5" fill="#FFFFFF" opacity="0.9" />
              <circle cx="155" cy="105" r="1" fill="#FFFFFF" opacity="0.7" />
              <circle cx="140" cy="120" r="0.8" fill="#06B6D4" opacity="0.6" />
              <path d="M130 85 L120 50 L135 75 Z" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.8" opacity="0.9" />
              <path d="M165 80 L175 45 L170 70 Z" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.8" opacity="0.9" />
              <circle cx="120" cy="50" r="3" fill="#39FF14" opacity="0.4" />
              <circle cx="175" cy="45" r="3" fill="#39FF14" opacity="0.4" />
              <path d="M140 82 L138 58 L145 76 Z" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.5" opacity="0.7" />
              <path d="M158 78 L162 55 L163 72 Z" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.5" opacity="0.7" />
              <ellipse cx="138" cy="112" rx="6" ry="4" fill="#FFFFFF" />
              <ellipse cx="162" cy="112" rx="6" ry="4" fill="#FFFFFF" />
              <ellipse cx="138" cy="112" rx="8" ry="6" fill="#39FF14" opacity="0.15" />
              <ellipse cx="162" cy="112" rx="8" ry="6" fill="#39FF14" opacity="0.15" />
              <path d="M132 114 L144 110" stroke="#0a0a0c" strokeWidth="1" opacity="0.5" />
              <path d="M156 110 L168 114" stroke="#0a0a0c" strokeWidth="1" opacity="0.5" />
              <path d="M140 128 Q150 133 160 128" stroke="#39FF14" strokeWidth="0.8" fill="none" opacity="0.4" />
              <path d="M130 280 Q120 330 105 370" stroke="#0a0a0c" strokeWidth="14" strokeLinecap="round" fill="none" />
              <path d="M170 280 Q180 330 195 370" stroke="#0a0a0c" strokeWidth="14" strokeLinecap="round" fill="none" />
              <path d="M125 290 Q118 330 108 360" stroke="#39FF14" strokeWidth="0.8" fill="none" opacity="0.15" />
              <path d="M175 290 Q182 330 192 360" stroke="#06B6D4" strokeWidth="0.8" fill="none" opacity="0.15" />
              <ellipse cx="105" cy="375" rx="12" ry="6" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.8" />
              <ellipse cx="195" cy="375" rx="12" ry="6" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.8" />
              <ellipse cx="150" cy="200" rx="90" ry="130" fill="none" stroke="#39FF14" strokeWidth="0.3" opacity="0.2" strokeDasharray="4 8" />
              <ellipse cx="150" cy="200" rx="105" ry="150" fill="none" stroke="#06B6D4" strokeWidth="0.3" opacity="0.1" strokeDasharray="6 12" />
              <circle cx="30" cy="80" r="2" fill="#39FF14" opacity="0.6" />
              <circle cx="270" cy="70" r="1.5" fill="#06B6D4" opacity="0.5" />
              <circle cx="20" cy="180" r="1.5" fill="#8B5CF6" opacity="0.4" />
              <circle cx="280" cy="200" r="2" fill="#FFB800" opacity="0.4" />
              <circle cx="50" cy="300" r="1" fill="#39FF14" opacity="0.5" />
              <circle cx="250" cy="320" r="1.5" fill="#06B6D4" opacity="0.3" />
              <circle cx="150" cy="30" r="1.5" fill="#FFFFFF" opacity="0.7" />
              <circle cx="100" cy="40" r="1" fill="#FFB800" opacity="0.5" />
              <circle cx="200" cy="35" r="1" fill="#8B5CF6" opacity="0.4" />
              <circle cx="150" cy="390" r="1.5" fill="#39FF14" opacity="0.4" />
              <circle cx="80" cy="350" r="1" fill="#06B6D4" opacity="0.3" />
              <circle cx="220" cy="360" r="1" fill="#FFB800" opacity="0.3" />
            </svg>
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-xl font-black text-white tracking-tight">COACH VEGA</h3>
            <p className="mt-1 text-xs font-bold tracking-[0.2em] uppercase text-neon">Your Cosmic Guide</p>
          </div>

          <div className="mt-4 max-w-xs text-center">
            <p className="text-sm text-muted leading-relaxed">
              Tell me about your day — tests, practice, how you&apos;re feeling. I&apos;ll build the perfect plan.
            </p>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 600 100" preserveAspectRatio="none" style={{ height: "100px" }}>
          <path d="M0,80 Q150,20 300,60 Q450,100 600,40" stroke="#39FF14" strokeWidth="1" fill="none" />
          <path d="M0,90 Q200,50 400,70 Q500,80 600,60" stroke="#FFB800" strokeWidth="0.5" fill="none" />
        </svg>
      </div>
    </div>
  );
}
