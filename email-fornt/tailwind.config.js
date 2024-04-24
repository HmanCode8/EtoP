/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "calc-width": "calc(100vw - 100px)",
      },
      height: {
        "calc-height": "calc(100vh - 70px)",
      },
      colors: {
        lightThemeColor: "#e8eefd",
        lightSecondaryColor: "#35aefd",
        freshThemeColor: "#0058ff",
        userListBg: "#e5f2ff",
        darkThemeColor: "#2b664c",
        darkSecondaryColor: "#000",
      },
      spacing: {
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
