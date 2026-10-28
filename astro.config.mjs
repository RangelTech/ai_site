import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ai.rangeltech.net',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  server: { host: true, port: 4321 },
});
