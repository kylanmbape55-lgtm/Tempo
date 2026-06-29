"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════
   TEMPO — Plan Display (placeholder — full plan coming next)
   ═══════════════════════════════════════════════════════════════════ */

export default function PlanScreen() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-8">
      <div className={`max-w-lg text-center transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon/20 to-emerald/20 border border-neon/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📋</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          Your Plan
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          Your AI-generated minute-by-minute plan will appear here. This screen is coming next in the build.
        </p>
        <div className="mt-8 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-xs text-muted uppercase tracking-wider font-bold mb-3">Coming soon</p>
          <ul className="text-sm text-white/70 space-y-2 text-left">
            <li>• Minute-by-minute daily timeline</li>
            <li>• Color-coded blocks (sport, study, meals, sleep)</li>
            <li>• Adaptive to today&apos;s check-in</li>
            <li>• Edit & rearrange on the fly</li>
          </ul>
        </div>
        <button
          onClick={() => router.push("/check-in")}
          className="mt-8 btn-primary px-8 py-4 rounded-full text-sm font-extrabold tracking-wide"
        >
          ← Back to Check-In
        </button>
      </div>
    </div>
  );
}
