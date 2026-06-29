"use client";

import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   TEMPO — Onboarding Screen
   Split layout: questions on left, Coach Vega preview on right
   ═══════════════════════════════════════════════════════════════════ */

const QUESTIONS = [
  { id: 1, question: "What sport do you play?", type: "select", options: ["Football", "Basketball", "Swimming", "Track & Field", "Tennis", "Baseball", "Soccer", "Other"] },
  { id: 2, question: "What grade are you in?", type: "select", options: ["6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"] },
  { id: 3, question: "What time do you wake up?", type: "time" },
  { id: 4, question: "What time do you go to sleep?", type: "time" },
  { id: 5, question: "When is practice?", type: "multi", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { id: 6, question: "What's your hardest subject?", type: "select", options: ["Math", "Science", "English", "History", "Foreign Language", "Art", "PE"] },
  { id: 7, question: "Any games coming up?", type: "text", placeholder: "e.g., Saturday vs. Lincoln High" },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [fadeIn, setFadeIn] = useState(true);

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      }
      setFadeIn(true);
    }, 300);
  };

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [currentQ.id]: value });
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

            {currentQ.type === "time" && (
              <div className="max-w-xs">
                <input
                  type="time"
                  onChange={(e) => handleSelect(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white text-lg font-bold focus:outline-none focus:border-neon/50 transition-colors"
                />
              </div>
            )}

            {currentQ.type === "multi" && (
              <div className="max-w-lg">
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentQ.days?.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleSelect(day)}
                      className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        answers[currentQ.id]?.includes(day)
                          ? "bg-neon/15 border border-neon text-neon"
                          : "bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <input
                  type="time"
                  onChange={(e) => handleSelect(`${answers[currentQ.id] || ""} ${e.target.value}`)}
                  className="w-full px-5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-bold focus:outline-none focus:border-neon/50 transition-colors"
                />
              </div>
            )}

            {currentQ.type === "text" && (
              <div className="max-w-lg">
                <input
                  type="text"
                  placeholder={currentQ.placeholder}
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
              disabled={!answers[currentQ.id]}
              className={`btn-primary px-8 py-4 rounded-full text-sm font-extrabold tracking-wide transition-all ${
                !answers[currentQ.id] ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              {step === QUESTIONS.length - 1 ? "BUILD MY TEMPO →" : "CONTINUE →"}
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

        {/* Coach Vega — Messianic SVG */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Halo / Aura */}
          <div className="relative">
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-20 animate-pulse"
              style={{
                background: "radial-gradient(circle, #39FF14 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            {/* Coach figure */}
            <svg width="280" height="360" viewBox="0 0 280 360" fill="none" className="relative z-10">
              {/* Glow circle behind head */}
              <circle cx="140" cy="100" r="60" fill="url(#haloGradient)" opacity="0.3" />
              <circle cx="140" cy="100" r="45" fill="url(#haloGradient)" opacity="0.15" />

              {/* Head */}
              <circle cx="140" cy="100" r="35" fill="#1a1a1e" stroke="#39FF14" strokeWidth="1.5" />

              {/* Eyes — glowing */}
              <circle cx="128" cy="95" r="4" fill="#39FF14" opacity="0.9" />
              <circle cx="152" cy="95" r="4" fill="#39FF14" opacity="0.9" />

              {/* Smile */}
              <path d="M130 110 Q140 118 150 110" stroke="#39FF14" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Body / Robe */}
              <path
                d="M105 135 Q140 125 175 135 L190 280 Q140 300 90 280 Z"
                fill="url(#robeGradient)"
                stroke="#39FF14"
                strokeWidth="1"
                opacity="0.9"
              />

              {/* Inner robe detail */}
              <path
                d="M120 150 Q140 145 160 150 L170 260 Q140 270 110 260 Z"
                fill="none"
                stroke="#39FF14"
                strokeWidth="0.5"
                opacity="0.3"
              />

              {/* Arms reaching out (welcoming) */}
              <path
                d="M105 145 Q70 170 55 200"
                stroke="#1a1a1e"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M175 145 Q210 170 225 200"
                stroke="#1a1a1e"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />

              {/* Hands with glow */}
              <circle cx="55" cy="200" r="8" fill="#1a1a1e" stroke="#39FF14" strokeWidth="1" />
              <circle cx="225" cy="200" r="8" fill="#1a1a1e" stroke="#39FF14" strokeWidth="1" />
              <circle cx="55" cy="200" r="3" fill="#39FF14" opacity="0.6" />
              <circle cx="225" cy="200" r="3" fill="#39FF14" opacity="0.6" />

              {/* Floating particles (divine) */}
              <circle cx="60" cy="80" r="2" fill="#39FF14" opacity="0.4" />
              <circle cx="220" cy="90" r="1.5" fill="#39FF14" opacity="0.3" />
              <circle cx="40" cy="150" r="1.5" fill="#FFB800" opacity="0.3" />
              <circle cx="240" cy="160" r="2" fill="#FFB800" opacity="0.3" />
              <circle cx="80" cy="260" r="1" fill="#39FF14" opacity="0.4" />
              <circle cx="200" cy="250" r="1.5" fill="#39FF14" opacity="0.3" />

              {/* Gradients */}
              <defs>
                <radialGradient id="haloGradient" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#39FF14" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#39FF14" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="robeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E1E24" />
                  <stop offset="100%" stopColor="#141416" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Coach name */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-black text-white tracking-tight">COACH VERA</h3>
            <p className="mt-1 text-xs font-bold tracking-[0.2em] uppercase text-neon">Your AI Guide</p>
          </div>

          {/* Dynamic message based on step */}
          <div className="mt-6 max-w-xs text-center">
            <p className="text-sm text-muted leading-relaxed">
              {step === 0 && "Every great athlete needs a plan. Let's build yours."}
              {step === 1 && "Your grade level helps us calibrate your schedule."}
              {step === 2 && "We anchor your day around your wake time."}
              {step === 3 && "Sleep is non-negotiable. We protect it."}
              {step === 4 && "Practice is fixed. Everything else flexes around it."}
              {step === 5 && "We'll prioritize your hardest subjects when your mind is fresh."}
              {step === 6 && "Game days get special treatment."}
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
