/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(280, 100%, 70%)", // Purple-600 from register page
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(280, 100%, 97%)",
          100: "hsl(280, 100%, 95%)",
          200: "hsl(280, 100%, 90%)",
          300: "hsl(280, 100%, 83%)",
          400: "hsl(280, 100%, 76%)",
          500: "hsl(280, 100%, 70%)",
          600: "hsl(280, 100%, 63%)",
          700: "hsl(280, 100%, 56%)",
          800: "hsl(280, 100%, 49%)",
          900: "hsl(280, 100%, 42%)",
        },
        secondary: {
          DEFAULT: "hsl(330, 100%, 70%)", // Pink-600 from register page
          foreground: "hsl(var(--secondary-foreground))",
          50: "hsl(330, 100%, 97%)",
          100: "hsl(330, 100%, 95%)",
          200: "hsl(330, 100%, 90%)",
          300: "hsl(330, 100%, 83%)",
          400: "hsl(330, 100%, 76%)",
          500: "hsl(330, 100%, 70%)",
          600: "hsl(330, 100%, 63%)",
          700: "hsl(330, 100%, 56%)",
          800: "hsl(330, 100%, 49%)",
          900: "hsl(330, 100%, 42%)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enterprise color palette from register page
        slate: {
          50: "hsl(210, 40%, 98%)",
          100: "hsl(210, 40%, 96%)",
          200: "hsl(214, 32%, 91%)",
          300: "hsl(213, 27%, 84%)",
          400: "hsl(215, 20%, 65%)",
          500: "hsl(215, 16%, 47%)",
          600: "hsl(215, 19%, 35%)",
          700: "hsl(215, 25%, 27%)",
          800: "hsl(217, 33%, 17%)",
          900: "hsl(222, 84%, 5%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, hsl(280, 100%, 70%) 0%, hsl(330, 100%, 70%) 100%)",
        "gradient-primary-hover":
          "linear-gradient(135deg, hsl(280, 100%, 63%) 0%, hsl(330, 100%, 63%) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
