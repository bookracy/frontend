module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1A1A',
        sidebar: {
          primary: '#3A3A3A',
          button: '#292929',
          text: '#FFFFFF',
        },
        card: {
          primary: '#292929',
          text: '#FFFFFF',
        },
        button: {
          primary: '#292929',
          text: '#FFFFFF',
        },
      },
      fontFamily: {
        mono: 'monospace',
      },
    },
  },
  plugins: [],
}