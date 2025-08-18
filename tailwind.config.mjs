/** @type {import('tailwindcss').Config} */
export default {
	content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		"./node_modules/flowbite/**/*.js"
    ],
	theme: {
		extend: {
			// Design System Colors
			colors: {
				primary: {
					50: '#f5f3ff',
					100: '#ede9fe',
					200: '#ddd6fe',
					300: '#c4b5fd',
					400: '#a78bfa',
					500: '#8b5cf6',
					600: '#7c3aed',
					700: '#6d28d9',
					800: '#5b21b6',
					900: '#4c1d95',
				},
				neutral: {
					0: '#ffffff',
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827',
				}
			},
			
			// Typography
			fontFamily: {
				sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			
			// Spacing
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			
			// Animation
			animation: {
				'fade-in': 'fadeIn 0.2s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'slide-down': 'slideDown 0.3s ease-out',
			},
			
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
			
			// Box Shadow
			boxShadow: {
				'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
				'medium': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
				'hard': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
			},
		},
	},
	plugins: [
		require('flowbite/plugin'),
		require('@tailwindcss/forms'),
	],
}
