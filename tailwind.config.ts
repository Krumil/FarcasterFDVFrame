import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			colors: {
				custom: {
					dark: "#1A090D",
					purple: "#4A314D",
					grey: "#6B6570",
					sage: "#A8BA9A",
					lime: "#ACE894"
				}
			}
		}
	},
	plugins: []
};
export default config;
