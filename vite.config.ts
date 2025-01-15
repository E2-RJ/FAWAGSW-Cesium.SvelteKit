import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';
import Terminal from 'vite-plugin-terminal';

export default defineConfig({
	optimizeDeps: {
		//noDiscovery: true, // Only useful for development
		include: [ // Reduces time spent crawling for dependencies
			'lucide-svelte',
			'bits-ui',
			'lucide-svelte/icons/x',
			'd3',
			'embla-carousel-svelte',
			'lucide-svelte/icons/arrow-left',
			'lucide-svelte/icons/arrow-right',
			'cesium',
			'tailwind-variants',
			'clsx',
			'tailwind-merge',
			'dequal',
			'nanoid/non-secure',
			'@internationalized/date',
			'@floating-ui/dom',
			'focus-trap',
			'lucide-svelte/icons/check',
			'lucide-svelte/icons/chevrons-up-down',
			'lucide-svelte/icons/search',
			'cmdk-sv',
			'lucide-svelte/icons/chevron-down'
		]
	},
	plugins: [
		sveltekit(),
		cesium(),
		Terminal({
			console: 'terminal'
		}),
	]
});
