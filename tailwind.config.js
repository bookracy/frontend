module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a1a',
        text: {
          primary: '#fff',
          secondary: '#aaa',
        },
        banner: {
          primary: '#252525',
          secondary: '#2f2f2f',
        },
        sidebar: {
          primary: '#252525',
          button: '#333',
          buttonHover: '#3a3a3a',
        },
        card: {
          primary: '#333',
        },
        button: {
          primary: '#333',
          hover: '#3a3a3a',
          accent: '#7948ea',
          accentHover: '#8a5fec',
        },
      },
      fontFamily: {
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
}