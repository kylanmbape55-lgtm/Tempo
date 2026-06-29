module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0A0A0C",
        charcoal: "#141416",
        deepvoid: "#0F0F12",
        steel: "#1E1E24",
        neon: "#39FF14",
        emerald: "#2ECC71",
        amber: "#FFB800",
        gold: "#F5A623",
        flame: "#FF6B35",
        danger: "#E63946",
        white: "#FFFFFF",
        gray: "#B0B3B8",
        muted: "#6B7280",
      },
      fontFamily: {
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 1s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(57,255,20,0.15), 0 0 20px rgba(57,255,20,0.05)" },
          "50%": { boxShadow: "0 0 25px rgba(57,255,20,0.3), 0 0 50px rgba(57,255,20,0.1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
