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
        banner: {
          primary: '#252525',
        },
        dropdown: {
          primary: '#202020',
        },
        card: {
          primary: '#292929',
          text: '#FFFFFF',
        },
        button: {
          primary: '#292929',
          text: '#FFFFFF',
          accent: '#7948ea',
          accentHover: '#8a5fec',
        },
      },
      fontFamily: {
        mono: 'monospace',
      },
    },
  },
  plugins: [],
}