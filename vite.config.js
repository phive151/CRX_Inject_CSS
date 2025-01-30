import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

export default defineConfig( {
  plugins: [
    tailwindcss(),
    solidPlugin(),
    crx(
      { manifest }
    )
  ],
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        popup: "@popup/popup.html",
        options: "@options/options.html",
      },
    },
    minify: false,
  },
  resolve: {
    alias: {
      "@src": path.resolve( __dirname, "./src" ),
      "@components": path.resolve( __dirname, "./src/components" ),
      "@popup": path.resolve( __dirname, "./src/pages/popup" ),
      "@options": path.resolve( __dirname, "./src/pages/options" ),
    },
  },
} );
