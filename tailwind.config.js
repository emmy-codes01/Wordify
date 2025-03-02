/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'scroll-smooth': 'scroll 20s linear infinite',
                'scroll-smooth-reverse': 'scroll-reverse 20s linear infinite',
            },
            keyframes: {
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(calc(-48px * 18))' },
                },
                'scroll-reverse': {
                    '0%': { transform: 'translateX(calc(-48px * 18))' },
                    '100%': { transform: 'translateX(0)' },
                },
                fontFamily: {
                    montserrat: ['Montserrat', 'sans-serif'], // Montserrat from Google Fonts
                    nexaBold: ['Nexa Bold', 'sans-serif'], // Nexa Bold local font
                },
                gridTemplateColumns: {
                    '70/30': '70% 28%',
                },
                colors: {
                    customRed: '#CF0001',
                },
                maxWidth: {
                    '280': '280px', // Custom max-width of 280px
                },


            },

        },
        plugins: [],
    }
}