"use client";

import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   TEMPO — Onboarding Screen
   Split layout: questions on left, Coach Vega preview on right
   ═══════════════════════════════════════════════════════════════════ */

const QUESTIONS = [
  { id: 1, question: "What sport do you play?", type: "select", options: ["Football", "Basketball", "Swimming", "Track & Field", "Tennis", "Baseball", "Soccer", "Other"] },
  { id: 2, question: "What grade are you in?", type: "select", options: ["6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"] },
  { id: 3, question: "What time do you wake up on weekdays?", type: "dual-time", label: "Weekdays", label2: "Weekends & Holidays" },
  { id: 4, question: "What time do you go to sleep?", type: "dual-time", label: "Weekdays", label2: "Weekends & Holidays" },
  { id: 5, question: "When is practice?", type: "multi", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { id: 6, question: "What are your hardest subjects? Pick your top 3.", type: "ranking", options: ["Math", "Science", "English", "History", "Foreign Language", "Art", "PE"] },
  { id: 7, question: "What's your name & email?", type: "name-email" },
];

const RANK_COLORS = [
  "#FFD700", // Gold — 1st
  "#C0C0C0", // Silver — 2nd
  "#CD7F32", // Bronze — 3rd
];

const RANK_LABELS = ["1st", "2nd", "3rd"];

function TimePicker({ onChange, value }: { onChange: (val: string) => void; value?: string }) {
  const [hour, setHour] = useState(value?.split(":")[0] || "06");
  const [minute, setMinute] = useState(value?.split(":")[1] || "00");

  const handleChange = (h: string, m: string) => {
    setHour(h);
    setMinute(m);
    onChange(`${h}:${m}`);
  };

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="flex items-center gap-2">
      {/* Hour */}
      <select
        value={hour}
        onChange={(e) => handleChange(e.target.value, minute)}
        className="flex-1 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-lg font-bold focus:outline-none focus:border-neon/50 transition-colors appearance-none cursor-pointer"
      >
        {hours.map((h) => (
          <option key={h} value={h} className="bg-charcoal text-white">{h}</option>
        ))}
      </select>
      <span className="text-2xl font-black text-muted">:</span>
      {/* Minute */}
      <select
        value={minute}
        onChange={(e) => handleChange(hour, e.target.value)}
        className="flex-1 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-lg font-bold focus:outline-none focus:border-neon/50 transition-colors appearance-none cursor-pointer"
      >
        {minutes.map((m) => (
          <option key={m} value={m} className="bg-charcoal text-white">{m}</option>
        ))}
      </select>
    </div>
  );
}

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [fadeIn, setFadeIn] = useState(true);
  const [practiceSlots, setPracticeSlots] = useState<{ days: string[]; time: string }[]>([{ days: [], time: "" }]);
  const [nameEmail, setNameEmail] = useState<{ name: string; email: string }>({ name: "", email: "" });

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        // Save profile & redirect to check-in
        const profile = {
          sport: answers[1],
          grade: answers[2],
          wakeTime: answers[3],
          sleepTime: answers[4],
          practice: practiceSlots,
          hardSubjects: answers[6] || [],
          name: nameEmail.name || "",
          email: nameEmail.email || "",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("tempo_profile", JSON.stringify(profile));
        window.location.href = "/check-in";
      }
      setFadeIn(true);
    }, 300);
  };

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [currentQ.id]: value });
  };

  const handleRankingSelect = (option: string) => {
    const current = (answers[6] as string[]) || [];
    const isSelected = current.includes(option);

    if (isSelected) {
      // Double-tap to deselect
      setAnswers({ ...answers, 6: current.filter((s: string) => s !== option) });
    } else if (current.length < 3) {
      // Add pick
      setAnswers({ ...answers, 6: [...current, option] });
    }
  };

  const getRank = (option: string): number | null => {
    const ranking = (answers[6] as string[]) || [];
    const idx = ranking.indexOf(option);
    return idx >= 0 ? idx : null;
  };

  const handlePracticeDayToggle = (slotIndex: number, day: string) => {
    const updated = [...practiceSlots];
    const slot = { ...updated[slotIndex] };
    slot.days = slot.days.includes(day)
      ? slot.days.filter((d) => d !== day)
      : [...slot.days, day];
    updated[slotIndex] = slot;
    setPracticeSlots(updated);
  };

  const handlePracticeTimeChange = (slotIndex: number, time: string) => {
    const updated = [...practiceSlots];
    updated[slotIndex] = { ...updated[slotIndex], time };
    setPracticeSlots(updated);
  };

  const addPracticeSlot = () => {
    setPracticeSlots([...practiceSlots, { days: [], time: "" }]);
  };

  const isMultiAnswered = () => {
    return practiceSlots.some((slot) => slot.days.length > 0 && slot.time);
  };

  return (
    <div className="min-h-screen bg-void flex">
      {/* ═══════════════════════════════════════════════════════════
          LEFT SIDE — Questions
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center px-12 md:px-20 lg:px-28">
        {/* Logo */}
        <div className="absolute top-8 left-12 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-emerald flex items-center justify-center text-sm font-black text-void">
            T
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">TEMPO</span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-12">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === step ? "32px" : "12px",
                background: i <= step ? "#39FF14" : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
          <span className="ml-3 text-[10px] font-bold text-muted tracking-wider">
            {step + 1} / {QUESTIONS.length}
          </span>
        </div>

        {/* Question area */}
        <div className={`transition-all duration-300 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {/* Headline — only on first question */}
          {step === 0 && (
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight">
                LET&apos;S BUILD
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gradient-neon leading-[0.95] tracking-tight">
                YOUR TEMPO
              </h1>
              <p className="mt-4 text-base text-muted max-w-md leading-relaxed">
                Tell us about your day. We&apos;ll handle the rest.
              </p>
            </div>
          )}

          {/* Question */}
          <div className={step === 0 ? "mt-12" : "mt-0"}>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neon">
              Step {String(step + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
              {currentQ.question}
            </h2>
          </div>

          {/* Input */}
          <div className="mt-8">
            {currentQ.type === "select" && (
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {currentQ.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`px-5 py-3.5 rounded-xl text-sm font-bold text-left transition-all duration-200 ${
                      answers[currentQ.id] === option
                        ? "bg-neon/15 border-2 border-neon text-neon"
                        : "bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.06] hover:border-white/20"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === "dual-time" && (
              <div className="max-w-sm space-y-5">
                {/* Weekdays */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-neon mb-2 block">
                    {currentQ.label}
                  </label>
                  <TimePicker onChange={(val) => handleSelect(`wd:${val}`)} />
                </div>

                {/* Weekends & Holidays */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-2 block">
                    {currentQ.label2}
                  </label>
                  <TimePicker onChange={(val) => handleSelect(`we:${val}`)} />
                </div>
              </div>
            )}

            {currentQ.type === "multi" && (
              <div className="max-w-lg space-y-4">
                {practiceSlots.map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3"
                  >
                    {/* Day pills */}
                    <div className="flex flex-wrap gap-2">
                      {currentQ.days?.map((day) => (
                        <button
                          key={day}
                          onClick={() => handlePracticeDayToggle(slotIndex, day)}
                          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                            slot.days.includes(day)
                              ? "bg-neon/15 border border-neon text-neon"
                              : "bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.06]"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>

                    {/* Time picker for this slot */}
                    <TimePicker
                      value={slot.time}
                      onChange={(val) => handlePracticeTimeChange(slotIndex, val)}
                    />
                  </div>
                ))}

                {/* Add Practice button — only show if at least one slot exists */}
                {practiceSlots.length >= 1 && (
                  <button
                    onClick={addPracticeSlot}
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-dashed border-white/10 text-sm font-bold text-muted hover:border-neon/40 hover:text-neon transition-all duration-200"
                  >
                    + Add Practice
                  </button>
                )}
              </div>
            )}

            {currentQ.type === "ranking" && (
              <div className="max-w-lg space-y-3">
                <p className="text-xs text-muted mb-4">
                  Tap to rank. Double-tap to remove. Pick up to 3.
                </p>
                {currentQ.options?.map((option) => {
                  const rank = getRank(option);
                  const isSelected = rank !== null;
                  return (
                    <button
                      key={option}
                      onClick={() => handleRankingSelect(option)}
                      className={`w-full px-5 py-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-2 bg-white/[0.04]"
                          : "border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                      }`}
                      style={isSelected ? { borderColor: RANK_COLORS[rank!] } : {}}
                    >
                      <span
                        className="text-base font-bold"
                        style={{ color: isSelected ? RANK_COLORS[rank!] : "#FFFFFF" }}
                      >
                        {option}
                      </span>
                      {isSelected && (
                        <span
                          className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full"
                          style={{
                            color: RANK_COLORS[rank!],
                            background: `${RANK_COLORS[rank!]}15`,
                            border: `1px solid ${RANK_COLORS[rank!]}30`,
                          }}
                        >
                          {RANK_LABELS[rank!]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.type === "name-email" && (
              <div className="max-w-sm space-y-4">
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-neon mb-2 block">
                    Your Name <span className="text-neon">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Alex"
                    onChange={(e) => setNameEmail({ ...nameEmail, name: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-muted focus:outline-none focus:border-neon/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-neon mb-2 block">
                    Email Address <span className="text-neon">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    onChange={(e) => setNameEmail({ ...nameEmail, email: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-muted focus:outline-none focus:border-neon/50 transition-colors"
                  />
                </div>
              </div>
            )}

            {currentQ.type === "text" && (
              <div className="max-w-lg">
                <input
                  type="text"
                  onChange={(e) => handleSelect(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-muted focus:outline-none focus:border-neon/50 transition-colors"
                />
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={handleNext}
              disabled={
                (!answers[currentQ.id] && !(currentQ.type === "multi" && isMultiAnswered()) && !(currentQ.type === "ranking" && ((answers[6] as string[])?.length))) ||
                (currentQ.type === "name-email" && (!nameEmail.name.trim() || !nameEmail.email.trim()))
              }
              className={`btn-primary px-8 py-4 rounded-full text-sm font-extrabold tracking-wide transition-all ${
                ((!answers[currentQ.id] && !(currentQ.type === "multi" && isMultiAnswered()) && !(currentQ.type === "ranking" && ((answers[6] as string[])?.length))) ||
                (currentQ.type === "name-email" && (!nameEmail.name.trim() || !nameEmail.email.trim())))
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
            >
              {step === QUESTIONS.length - 1 ? "COMPLETE SETUP →" : "CONTINUE →"}
            </button>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm font-medium text-muted hover:text-white transition-colors"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Skip */}
          <button className="mt-6 text-[11px] text-muted hover:text-white transition-colors">
            Skip for now — set up later
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT SIDE — Coach Vega (Messianic Figure)
          ═══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        {/* Radial glow behind coach */}
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

        {/* Coach Vega — Cosmic Fear Garou inspired messianic figure */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Radial cosmic aura */}
          <div className="relative">
            {/* Outer cosmic glow */}
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20 animate-pulse"
              style={{ background: "radial-gradient(circle, #39FF14 0%, #06B6D4 40%, transparent 70%)", filter: "blur(40px)" }}
            />
            {/* Inner star-core glow */}
            <div
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, #FFB800 0%, #39FF14 50%, transparent 70%)", filter: "blur(20px)" }}
            />

            {/* Cosmic Garou SVG */}
            <svg width="300" height="420" viewBox="0 0 300 420" fill="none" className="relative z-10 float" style={{ filter: "drop-shadow(0 0 30px rgba(57,255,20,0.2)) drop-shadow(0 0 60px rgba(6,182,212,0.15))" }}>
              {/* Cosmic aura ring */}
              <ellipse cx="150" cy="210" rx="120" ry="180" fill="none" stroke="url(#auraGradient)" strokeWidth="1" opacity="0.3" />
              <ellipse cx="150" cy="210" rx="100" ry="155" fill="none" stroke="#39FF14" strokeWidth="0.5" opacity="0.15" />

              {/* Body — pitch-black void with cosmic interior */}
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

              {/* Torso — void body */}
              <path
                d="M110 165 Q150 150 190 165 L200 280 Q150 310 100 280 Z"
                fill="url(#voidGradient)"
              />
              {/* Cosmic interior — nebulae and galaxies */}
              <ellipse cx="130" cy="200" rx="25" ry="35" fill="url(#galaxy1)" />
              <ellipse cx="170" cy="220" rx="20" ry="30" fill="url(#galaxy2)" />
              <ellipse cx="150" cy="180" rx="15" ry="20" fill="url(#galaxy3)" />
              {/* Scattered stars inside body */}
              <circle cx="125" cy="185" r="1.5" fill="#FFFFFF" opacity="0.8" />
              <circle cx="140" cy="210" r="1" fill="#FFFFFF" opacity="0.6" />
              <circle cx="165" cy="195" r="1.5" fill="#FFFFFF" opacity="0.7" />
              <circle cx="175" cy="230" r="1" fill="#FFFFFF" opacity="0.5" />
              <circle cx="145" cy="240" r="1.2" fill="#FFFFFF" opacity="0.6" />
              <circle cx="155" cy="175" r="0.8" fill="#FFFFFF" opacity="0.9" />
              <circle cx="130" cy="225" r="1" fill="#06B6D4" opacity="0.5" />
              <circle cx="170" cy="205" r="0.8" fill="#8B5CF6" opacity="0.5" />
              {/* Cosmic dust trails */}
              <path d="M120 190 Q115 200 110 215" stroke="#39FF14" strokeWidth="0.5" fill="none" opacity="0.3" />
              <path d="M180 200 Q185 215 190 230" stroke="#06B6D4" strokeWidth="0.5" fill="none" opacity="0.2" />
              <path d="M140 250 Q145 260 150 270" stroke="#FFB800" strokeWidth="0.5" fill="none" opacity="0.2" />

              {/* Shoulder armor ridges — sharp jagged */}
              <path
                d="M110 165 L95 155 L90 170 L105 175 Z"
                fill="#0a0a0c"
                stroke="#39FF14"
                strokeWidth="0.8"
                opacity="0.9"
              />
              <path
                d="M190 165 L205 155 L210 170 L195 175 Z"
                fill="#0a0a0c"
                stroke="#39FF14"
                strokeWidth="0.8"
                opacity="0.9"
              />
              {/* Chest ridge */}
              <path
                d="M135 175 L150 165 L165 175 L160 190 L150 185 L140 190 Z"
                fill="#0a0a0c"
                stroke="#39FF14"
                strokeWidth="0.5"
                opacity="0.7"
              />
              {/* Chest core glow */}
              <circle cx="150" cy="180" r="8" fill="url(#coreGlow)" />

              {/* Left arm — extended back */}
              <path
                d="M95 170 Q60 150 35 120"
                stroke="#0a0a0c"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left arm cosmic interior */}
              <path
                d="M85 160 Q60 145 45 125"
                stroke="#39FF14"
                strokeWidth="1"
                fill="none"
                opacity="0.2"
              />
              {/* Left hand — open palm */}
              <circle cx="35" cy="120" r="10" fill="#0a0a0c" stroke="#39FF14" strokeWidth="1" />
              <circle cx="35" cy="120" r="4" fill="#39FF14" opacity="0.3" />
              {/* Fingers */}
              <path d="M28 115 L25 108" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M32 113 L30 105" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M37 112 L36 104" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M41 114 L42 107" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />

              {/* Right arm — stretched forward and up */}
              <path
                d="M205 170 Q240 150 270 125"
                stroke="#0a0a0c"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right arm cosmic interior */}
              <path
                d="M215 160 Q245 145 265 128"
                stroke="#06B6D4"
                strokeWidth="1"
                fill="none"
                opacity="0.2"
              />
              {/* Right hand — reaching forward */}
              <circle cx="270" cy="125" r="10" fill="#0a0a0c" stroke="#39FF14" strokeWidth="1" />
              <circle cx="270" cy="125" r="4" fill="#39FF14" opacity="0.3" />
              {/* Fingers */}
              <path d="M277 120 L280 113" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M273 118 L275 110" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M268 117 L268 109" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />
              <path d="M263 119 L261 112" stroke="#0a0a0c" strokeWidth="3" strokeLinecap="round" />

              {/* Head — void with cosmic interior */}
              <ellipse cx="150" cy="115" rx="32" ry="38" fill="url(#voidGradient)" />
              {/* Head cosmic interior */}
              <ellipse cx="145" cy="110" rx="15" ry="18" fill="url(#galaxy3)" />
              <circle cx="148" cy="115" r="1.5" fill="#FFFFFF" opacity="0.9" />
              <circle cx="155" cy="105" r="1" fill="#FFFFFF" opacity="0.7" />
              <circle cx="140" cy="120" r="0.8" fill="#06B6D4" opacity="0.6" />

              {/* Jagged horn-like hair spikes — asymmetrical */}
              <path
                d="M130 85 L120 50 L135 75 Z"
                fill="#0a0a0c"
                stroke="#39FF14"
                strokeWidth="0.8"
                opacity="0.9"
              />
              <path
                d="M165 80 L175 45 L170 70 Z"
                fill="#0a0a0c"
                stroke="#39FF14"
                strokeWidth="0.8"
                opacity="0.9"
              />
              {/* Horn glow tips */}
              <circle cx="120" cy="50" r="3" fill="#39FF14" opacity="0.4" />
              <circle cx="175" cy="45" r="3" fill="#39FF14" opacity="0.4" />
              {/* Additional smaller spikes */}
              <path
                d="M140 82 L138 58 L145 76 Z"
                fill="#0a0a0c"
                stroke="#39FF14"
                strokeWidth="0.5"
                opacity="0.7"
              />
              <path
                d="M158 78 L162 55 L163 72 Z"
                fill="#0a0a0c"
                stroke="#39FF14"
                strokeWidth="0.5"
                opacity="0.7"
              />

              {/* Eyes — sharp, glowing pure white, no pupils */}
              <ellipse cx="138" cy="112" rx="6" ry="4" fill="#FFFFFF" />
              <ellipse cx="162" cy="112" rx="6" ry="4" fill="#FFFFFF" />
              {/* Eye glow */}
              <ellipse cx="138" cy="112" rx="8" ry="6" fill="#39FF14" opacity="0.15" />
              <ellipse cx="162" cy="112" rx="8" ry="6" fill="#39FF14" opacity="0.15" />
              {/* Eye sharpness — slight tilt */}
              <path d="M132 114 L144 110" stroke="#0a0a0c" strokeWidth="1" opacity="0.5" />
              <path d="M156 110 L168 114" stroke="#0a0a0c" strokeWidth="1" opacity="0.5" />

              {/* Mouth — slight confident smirk */}
              <path d="M140 128 Q150 133 160 128" stroke="#39FF14" strokeWidth="0.8" fill="none" opacity="0.4" />

              {/* Legs — powerful stance */}
              <path
                d="M130 280 Q120 330 105 370"
                stroke="#0a0a0c"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M170 280 Q180 330 195 370"
                stroke="#0a0a0c"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              {/* Leg cosmic interior */}
              <path
                d="M125 290 Q118 330 108 360"
                stroke="#39FF14"
                strokeWidth="0.8"
                fill="none"
                opacity="0.15"
              />
              <path
                d="M175 290 Q182 330 192 360"
                stroke="#06B6D4"
                strokeWidth="0.8"
                fill="none"
                opacity="0.15"
              />
              {/* Feet */}
              <ellipse cx="105" cy="375" rx="12" ry="6" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.8" />
              <ellipse cx="195" cy="375" rx="12" ry="6" fill="#0a0a0c" stroke="#39FF14" strokeWidth="0.8" />

              {/* Ethereal cosmic aura ripples */}
              <ellipse cx="150" cy="200" rx="90" ry="130" fill="none" stroke="#39FF14" strokeWidth="0.3" opacity="0.2" strokeDasharray="4 8" />
              <ellipse cx="150" cy="200" rx="105" ry="150" fill="none" stroke="#06B6D4" strokeWidth="0.3" opacity="0.1" strokeDasharray="6 12" />

              {/* Floating cosmic particles around figure */}
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

          {/* Coach name */}
          <div className="mt-4 text-center">
            <h3 className="text-xl font-black text-white tracking-tight">COACH VEGA</h3>
            <p className="mt-1 text-xs font-bold tracking-[0.2em] uppercase text-neon">Your Cosmic Guide</p>
          </div>

          {/* Dynamic message based on step */}
          <div className="mt-4 max-w-xs text-center">
            <p className="text-sm text-muted leading-relaxed">
              {step === 0 && "Every great athlete needs a plan. Let's build yours."}
              {step === 1 && "Your grade level helps us calibrate your schedule."}
              {step === 2 && "Weekday and weekend schedules? We'll balance both."}
              {step === 3 && "Sleep is non-negotiable. We protect it."}
              {step === 4 && "Practice is fixed. Everything else flexes around it."}
              {step === 5 && "We'll prioritize your hardest subjects when your mind is fresh."}
              {step === 6 && "Almost done. What should we call you?"}
            </p>
          </div>
        </div>

        {/* Decorative lines */}
        <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 600 100" preserveAspectRatio="none" style={{ height: "100px" }}>
          <path d="M0,80 Q150,20 300,60 Q450,100 600,40" stroke="#39FF14" strokeWidth="1" fill="none" />
          <path d="M0,90 Q200,50 400,70 Q500,80 600,60" stroke="#FFB800" strokeWidth="0.5" fill="none" />
        </svg>
      </div>
    </div>
  );
}
