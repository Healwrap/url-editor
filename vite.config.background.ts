/// <reference types="node" />
import { defineConfig } from "vite";
import { resolve } from "path";
import base from "./vite.config.base";

// https://vite.dev/config/
export default defineConfig({
	...base,
	build: {
		copyPublicDir: false,
		outDir: resolve(__dirname, "dist/background"),
		rollupOptions: {
			input: resolve(__dirname, "src/background/index.ts"),
			output: {
				entryFileNames: "index.js",
				format: "esm",
			},
		},
	},
});
