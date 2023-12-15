import * as daisyui from "daisyui";


/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [daisyui],
    daisyui: {
        themes: ['dark'],
    },
}

