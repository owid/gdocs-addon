import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    // JS and CSS in source HTML are not served with the right MIME type by GAS,
    // so we inline them all in a single file
    viteSingleFile(),
  ],
  build: {
    minify: true,
    outDir: "../dist/sidebar",
  },
  root: "sidebar",
})
