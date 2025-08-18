import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://neoarts.github.io',
  base: '/NeoArts-WebTools',
  integrations: [
    tailwind(), 
    react()
  ],
  output: 'static',
  // Remove Vercel adapter for GitHub Pages
  build: {
    assets: 'assets'
  },
  // Allow TypeScript warnings for now
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Ignore TypeScript warnings during build
          if (warning.code === 'UNRESOLVED_IMPORT') return;
          warn(warning);
        }
      }
    }
  }
});