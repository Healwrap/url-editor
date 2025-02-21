import { createRoot } from "react-dom/client";
import Widget from "./widget";

registerPlugin();

function registerPlugin() {
	const containerId = "chrome-extension-root";
	let container = document.getElementById(containerId);
	if (!container) {
		container = document.createElement("div");
		container.id = containerId;
		document.body.appendChild(container);
	}

	createRoot(container).render(<Widget />);
	console.warn("插件注册成功🏆");
}
// chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
// 	if (request.type === "xhr") {
// 		console.log("Received xhr data:", request.data);
// 		// 处理接收到的数据
// 		sendResponse({ status: "success" });
// 	}
// });
