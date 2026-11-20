

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Clay and Sage palette from Screenshot 2026-05-05 121254.jpg
        clay: {
          terracotta: "#AD7E66", // The deep brownish-orange spheres
          peach: "#E6B8A2",      // The lighter accent spheres
        },
        sage: {
          DEFAULT: "#C1C8C1",    // The main background color
          light: "#D9DDD9",      // For translucent cards and highlights
          dark: "#A8B0A8",       // For borders and depth
        }
      },
      boxShadow: {
        // Soft 3D effect for spheres and cards
        'clay': '20px 20px 60px #a4aaa4, -20px -20px 60px #dee6de',
        'clay-inner': 'inset 6px 6px 12px rgba(0,0,0,0.1), inset -6px -6px 12px rgba(255,255,255,0.5)',
      }
    },
  },
  plugins: [],
}