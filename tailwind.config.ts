import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    'fixed',
    'inset-0',
    'bg-black',
    'bg-opacity-50',
    'flex',
    'justify-center',
    'items-center',
    'z-50',
    'bg-white',
    'w-3/4',
    'h-3/4',
    'rounded-lg',
    'p-4',
    'overflow-auto',
    'grid',
    'grid-cols-3',
    'gap-4',
    'cursor-pointer',
    'h-24',
    'object-cover'
  ]
} satisfies Config;
