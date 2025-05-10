/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
  },
};
export const plugins = [];

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./src/**/*.{js,jsx,ts,tsx}",],
//   theme: {
//     extend: {},
//   },
//   plugins: {tailwindcss: {},
//     autoprefixer: {}},
// }