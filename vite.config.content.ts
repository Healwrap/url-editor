/// <reference types="node" />
import { defineConfig } from "vite";
import { resolve } from "path";
import base from "./vite.config.base";

// https://vite.dev/config/
export default defineConfig({
	...base,
	build: {
		copyPublicDir: false,
		outDir: resolve(__dirname, "dist/content"),
		rollupOptions: {
			input: resolve(__dirname, "src/content/index.tsx"),
			output: {
				entryFileNames: "index.js",
				assetFileNames: "[name].[ext]",
				format: "esm",
			},
		},
	},
});
