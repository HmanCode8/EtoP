/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myBgColor:'#f0f2f5',
        menuTextColor:'#35aefd',
        avatarColor:'#0058ff',
        userListBg:'#e5f2ff',
        menuBg:"#e5e5ff",
        fontColor: "#105dca",
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}