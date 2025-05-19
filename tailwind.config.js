/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
<<<<<<< HEAD
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
<<<<<<< HEAD
=======
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
>>>>>>> e95bc34 (Initial commit)
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
    },
<<<<<<< HEAD
=======
    extend: {},
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
  },
  plugins: [],
=======
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
>>>>>>> e95bc34 (Initial commit)
}