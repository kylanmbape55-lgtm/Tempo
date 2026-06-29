"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

/* ═══════════════════════════════════════════════════════════════════
   TEMPO — Prototype Homepage
   Inspired by PlayerAlbum's layered depth, bold typography,
   and asymmetrical curved backgrounds.
   ═══════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="geo-pattern" />
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO — PlayerAlbum-inspired layered depth
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Curved background accent */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-[800px] h-[800px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #39FF14 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #FFB800 0%, transparent 70%)" }}
          />
          {/* Sweeping curve */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            style={{ height: "200px" }}
          >
            <path
              d="M0,120 C360,180 720,60 1080,120 C1260,150 1380,140 1440,120 L1440,200 L0,200 Z"
              fill="rgba(57,255,20,0.03)"
            />
            <path
              d="M0,140 C400,100 800,160 1200,120 C1320,110 1400,130 1440,140 L1440,200 L0,200 Z"
              fill="rgba(57,255,20,0.02)"
            />
          </svg>
        </div>

        {/* Vertical scrolling sidebar text — PlayerAlbum style */}
        <div className="absolute left-4 top-0 bottom-0 hidden lg:flex flex-col items-center justify-center gap-8 z-10 overflow-hidden">
          <div className="scroll-text-up">
            {[...Array(3)].map((_, setIdx) => (
              <div key={setIdx} className="flex flex-col items-center gap-8">
                {["DAILY PLANS", "SLEEP", "RECOVERY", "STREAKS", "FOCUS", "TEMPO"].map((text, i) => (
                  <span
                    key={`${setIdx}-${i}`}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap"
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      color: "var(--text-faded)",
                      letterSpacing: "0.3em",
                    }}
                  >
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-4 top-0 bottom-0 hidden lg:flex flex-col items-center justify-center gap-8 z-10 overflow-hidden">
          <div className="scroll-text-down">
            {[...Array(3)].map((_, setIdx) => (
              <div key={setIdx} className="flex flex-col items-center gap-8">
                {["AI POWERED", "15 MIN", "FREE", "24/7", "AI COACH", "STUDENTS"].map((text, i) => (
                  <span
                    key={`${setIdx}-${i}`}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap"
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      color: "var(--text-faded)",
                      letterSpacing: "0.3em",
                    }}
                  >
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Heartbeat monitor — large, overlays the TEMPO title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
            <svg
              viewBox="0 0 800 200"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: "100%", height: "300px" }}
            >
              <path
                d="M0,100 L100,100 L140,100 L155,100 L170,50 L185,150 L200,60 L215,140 L230,100 L260,100 L300,100 L340,100 L380,100 L420,100 L460,100 L500,100 L540,100 L580,100 L620,100 L660,100 L700,100 L740,100 L780,100 L800,100"
                fill="none"
                stroke="#39FF14"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="heartbeat-line"
              />
            </svg>
          </div>

          {/* Rotating badge — PlayerAlbum "SWAP" style */}
          <div className="inline-flex items-center justify-center mb-8 slide-up">
            <div className="relative w-14 h-14">
              <div className="rotate-badge absolute inset-0 rounded-full border border-neon/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-black tracking-wider text-neon uppercase">AI ✦</span>
              </div>
            </div>
          </div>

          {/* Main Title — ultra-thick, PlayerAlbum style */}
          <h1 className="slide-up slide-up-delay-1" style={{ position: "relative", zIndex: 2 }}>
            <span className="block text-7xl sm:text-8xl md:text-9xl font-black text-white leading-[0.9] tracking-tight">
              TEMPO
            </span>
          </h1>

          {/* Subtitle */}
          <p className="slide-up slide-up-delay-2 mt-4 text-lg sm:text-xl font-bold tracking-[0.15em] uppercase text-gray" style={{ position: "relative", zIndex: 2 }}>
            The AI Coach for Student Athletes
          </p>

          {/* Description */}
          <p className="slide-up slide-up-delay-3 mt-6 text-base sm:text-lg text-muted font-medium max-w-2xl mx-auto leading-relaxed" style={{ position: "relative", zIndex: 2 }}>
            Plan your day in 15 minutes. Balance practice, homework, meals, and sleep —
            with an AI coach that understands what it means to be a student athlete.
          </p>

          {/* CTA Buttons — PlayerAlbum pill style */}
          <div className="slide-up slide-up-delay-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/onboarding"
              className="btn-primary px-8 py-4 rounded-full text-base font-extrabold tracking-wide"
            >
              PLAN MY DAY →
            </a>
            <a
              href="#how-it-works"
              className="btn-outline px-8 py-4 rounded-full text-base font-bold tracking-wide"
            >
              See How It Works
            </a>
          </div>

          {/* Trust indicators */}
          <div className="slide-up slide-up-delay-4 mt-12 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: "🔥", text: "12-day avg streak" },
              { icon: "⚡", text: "15-min setup" },
              { icon: "🆓", text: "Free for students" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-medium text-muted">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-faded">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-neon animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: FEATURES — What Tempo Does
          ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neon">Features</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white">
              Everything you need.<br />
              <span className="text-gradient-neon">Nothing you don&apos;t.</span>
            </h2>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🧠",
                title: "AI Daily Planner",
                desc: "Tell Tempo what's on your plate. Get a minute-by-minute plan that fits your practice, homework, and sleep schedule.",
                accent: "neon",
              },
              {
                icon: "😴",
                title: "Sleep Guardrail",
                desc: "Tempo never schedules past bedtime. If workload exceeds time, it tells you honestly what to prioritize.",
                accent: "amber",
              },
              {
                icon: "🏃",
                title: "Recovery Aware",
                desc: "Report soreness and Tempo adds foam rolling, hydration reminders, and adjusts your study intensity.",
                accent: "flame",
              },
              {
                icon: "📊",
                title: "Streak Tracking",
                desc: "Build the habit. See your consistency grow with daily streaks, badges, and personal records.",
                accent: "neon",
              },
              {
                icon: "🏆",
                title: "Game Day Mode",
                desc: "On game days, Tempo shifts everything — pre-game meals, mental prep, lighter homework load.",
                accent: "amber",
              },
              {
                icon: "⚡",
                title: "15-Minute Setup",
                desc: "Answer 7 questions once. Every morning after takes 30 seconds. That's it.",
                accent: "emerald",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card-glass rounded-2xl p-7 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 ${
                  feature.accent === "neon" ? "bg-neon/10" :
                  feature.accent === "amber" ? "bg-amber/10" :
                  feature.accent === "flame" ? "bg-flame/10" :
                  "bg-emerald/10"
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-muted font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: HOW IT WORKS — 3 Steps
          ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative py-32 px-6">
        {/* Background accent */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #FFB800 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-amber">How It Works</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white">
              Three steps to<br />
              <span className="text-gradient-amber">own your day.</span>
            </h2>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Set Your Profile",
                desc: "Answer 7 questions about your sport, schedule, sleep, and hardest subjects. Takes 15 minutes. Done once.",
                icon: "⚙️",
              },
              {
                step: "02",
                title: "Morning Check-In",
                desc: "Every day, tell Tempo what's on your plate. Homework, tests, how you're feeling. Takes 30 seconds.",
                icon: "💬",
              },
              {
                step: "03",
                title: "Get Your Plan",
                desc: "Receive a minute-by-minute daily plan. Practice, homework blocks, meals, recovery, sleep — all balanced.",
                icon: "📋",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card-glass rounded-2xl p-8 flex flex-col sm:flex-row items-start gap-6 group hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber/20 to-gold/10 border border-amber/20 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black tracking-wider text-amber uppercase">Step {item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-muted font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: ALL STARS — Featured Student Athletes
          ═══════════════════════════════════════════════════════════ */}
      <section id="all-stars" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-flame">All Stars</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white">
              Real athletes.<br />
              <span className="text-gradient-neon">Real results.</span>
            </h2>
            <p className="mt-4 text-muted font-medium max-w-lg mx-auto">
              Student athletes who use Tempo to balance their grind. Featured here with their permission.
            </p>
          </div>

          {/* Athlete Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Athlete — Your footballer interviewee */}
            <div className="card-glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="h-48 bg-gradient-to-br from-neon/10 via-charcoal to-emerald/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-32 h-32 border border-neon/30 rounded-full" />
                  <div className="absolute bottom-4 right-4 w-24 h-24 border border-neon/20 rounded-full" />
                </div>
                <div className="text-6xl float">⚽</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon to-emerald flex items-center justify-center text-xs font-black text-void">
                    AM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Alex M.</h4>
                    <p className="text-[10px] text-muted">Football · Varsity · Grade 11</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full bg-neon/10 text-neon border border-neon/20">
                    🔥 5 streak
                  </span>
                </div>
                <p className="text-sm text-muted italic leading-relaxed">
                  &ldquo;I used to do homework at 11pm with my eyes closed. Tempo fixed that. I&apos;m sleeping 8 hours now and my grades went up.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-neon">8.2h</p>
                    <p className="text-[9px] text-muted uppercase">Avg Sleep</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-amber">94%</p>
                    <p className="text-[9px] text-muted uppercase">Plan Follow</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-white">23</p>
                    <p className="text-[9px] text-muted uppercase">Day Streak</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder Athlete 2 */}
            <div className="card-glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-amber/10 via-charcoal to-flame/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-6 right-6 w-20 h-20 border border-amber/30 rounded-full" />
                </div>
                <div className="text-6xl float float-delay-1">🏊</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber to-gold flex items-center justify-center text-xs font-black text-void">
                    SK
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Sarah K.</h4>
                    <p className="text-[10px] text-muted">Swimming · JV · Grade 10</p>
                  </div>
                </div>
                <p className="text-sm text-muted italic leading-relaxed">
                  &ldquo;Morning practice at 5am is brutal. Tempo plans my afternoon so I&apos;m not drowning in homework after.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-neon">7.8h</p>
                    <p className="text-[9px] text-muted uppercase">Avg Sleep</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-amber">88%</p>
                    <p className="text-[9px] text-muted uppercase">Plan Follow</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-white">17</p>
                    <p className="text-[9px] text-muted uppercase">Day Streak</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder Athlete 3 */}
            <div className="card-glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-flame/10 via-charcoal to-danger/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute bottom-6 left-6 w-28 h-28 border border-flame/30 rounded-full" />
                </div>
                <div className="text-6xl float float-delay-2">🏀</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-flame to-danger flex items-center justify-center text-xs font-black text-white">
                    JR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">James R.</h4>
                    <p className="text-[10px] text-muted">Basketball · Varsity · Grade 12</p>
                  </div>
                </div>
                <p className="text-sm text-muted italic leading-relaxed">
                  &ldquo;Game days used to be chaos. Tempo&apos;s Game Day Mode has my nutrition, warm-up, and study schedule locked in.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-neon">8.5h</p>
                    <p className="text-[9px] text-muted uppercase">Avg Sleep</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-amber">91%</p>
                    <p className="text-[9px] text-muted uppercase">Plan Follow</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-white">31</p>
                    <p className="text-[9px] text-muted uppercase">Day Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA under All Stars */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted mb-4">Want to be featured? Use Tempo for 7 days and share your story.</p>
            <a href="/onboarding" className="text-sm font-bold text-neon hover:text-emerald transition-colors">
              Apply to be featured →
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: CTA — Get Started
          ═══════════════════════════════════════════════════════════ */}
      <section id="get-started" className="relative py-32 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #39FF14 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
            Ready to<br />
            <span className="text-gradient-neon">own your tempo?</span>
          </h2>
          <p className="mt-6 text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Join student athletes who stopped choosing between their sport and their grades.
            One AI coach. One daily plan. Zero stress.
          </p>

          <div className="mt-10">
            <a href="/onboarding" className="btn-primary px-10 py-5 rounded-full text-base font-extrabold tracking-wide inline-block">
              Get Started Free →
            </a>
          </div>
          <p className="mt-4 text-[10px] text-faded">
            Free for students. No credit card. No spam. Just better days.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-emerald flex items-center justify-center text-sm font-black text-void">
                  T
                </div>
                <span className="text-base font-extrabold text-white">TEMPO</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                AI-powered daily planner for student athletes. Balance the grind.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#all-stars" className="hover:text-white transition-colors">All Stars</a></li>
              </ul>
            </div>

            {/* Project */}
            <div>
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4">Project</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#" className="hover:text-white transition-colors">IBMYP Personal Project</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research & Sources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-faded">
              © 2026 Tempo · IBMYP Personal Project · Not affiliated with any school or organization
            </p>
            <p className="text-[10px] text-faded">
              Built with Next.js + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
