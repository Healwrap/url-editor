/// <reference types="node" />
import { defineConfig } from "vite";
import { resolve } from "path";
import base from "./vite.config.base";

// popup的打包配置，因为实际是在dist下执行的，并且会移动public所以直接为vite.config.ts
export default defineConfig({
	...base,
	build: {
		cssCodeSplit: false,
		outDir: resolve(__dirname, "dist"),
		rollupOptions: {
			input: resolve(__dirname, "popup.html"),
			output: {
				entryFileNames: "popup/index.js",
				assetFileNames: "popup/[name].[ext]",
				format: "esm",
			},
		},
	},
});
